/* ============================================================
 * Firebase Realtime Database 웹슬라이드 동기화 모듈
 * - 서버(PHP) 없이 정적 호스팅(Vercel · GitHub Pages · Netlify)에서 청중 동기화
 * - 데이터 경로: decks/{덱 이름}/state = { slide, locked, pdf, updatedAt }
 *                decks/{덱 이름}/viewers/{접속 키} = 접속 시각 (창을 닫으면 자동 삭제)
 * - 쓰기 권한: database.rules.json 의 admins/{UID} = true 인 계정만
 * ============================================================ */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import {
  getDatabase, ref, set, update, push, onValue, onDisconnect, serverTimestamp, runTransaction
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js';
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';

const DEFAULT_STATE = { slide: 0, locked: true, pdf: true };

/* firebase-config.js 를 아직 채우지 않았으면 false - 이때 덱은 자유 열람으로 동작 */
export function isConfigured(cfg) {
  return !!(cfg && ['apiKey', 'authDomain', 'databaseURL', 'projectId', 'appId'].every(
    (key) => typeof cfg[key] === 'string' && cfg[key].trim() && !/[\[\]…]/.test(cfg[key])
  ) && /^https:\/\//.test(cfg.databaseURL));
}

export function createSync(cfg, deckId) {
  const app = initializeApp(cfg);
  const db = getDatabase(app);
  const auth = getAuth(app);
  const base = 'decks/' + deckId;
  const stateRef = ref(db, base + '/state');
  // 집중 안내는 슬라이드 진행 상태와 분리 · 기존 state 형식 보존
  const attentionRef = ref(db, base + '/attention');

  let isAdmin = false;
  let user = null;
  const adminListeners = [];
  const errorListeners = [];
  let stopAdmin = null, revision = 0, permissionRevision = 0;
  const reportError = (e) => errorListeners.forEach((cb) => cb(e));
  const notifyAdmin = () => adminListeners.forEach((cb) => cb(isAdmin, user));

  /* 로그인만으로는 부족 - 이메일 가입은 누구나 가능하므로 admins 목록에 있는 UID 인지 확인 */
  onAuthStateChanged(auth, (u) => {
    const current = ++revision;
    ++permissionRevision;
    if (stopAdmin) stopAdmin();
    stopAdmin = null;
    user = u; isAdmin = false; notifyAdmin();
    if (!u) return;
    stopAdmin = onValue(ref(db, 'admins/' + u.uid), async (s) => {
      if (current !== revision) return;
      const permission = ++permissionRevision;
      isAdmin = false;
      if (s.val() === true) {
        try {
          // 최초 로그인 두 창에서도 기존 상태를 덮어쓰지 않기
          await runTransaction(stateRef, (value) => value || { ...DEFAULT_STATE, updatedAt: serverTimestamp() });
          if (current !== revision || permission !== permissionRevision) return;
          isAdmin = true;
        } catch (e) { reportError(e); }
      }
      notifyAdmin();
    }, (e) => { if (current !== revision) return; ++permissionRevision; isAdmin = false; notifyAdmin(); reportError(e); });
  });

  function patch(values) {
    if (!isAdmin) return Promise.reject(new Error('not-admin'));
    return update(stateRef, { ...values, updatedAt: serverTimestamp() });
  }

  return {
    onError(cb) { errorListeners.push(cb); },
    /* 상태가 바뀔 때마다 즉시 호출 (폴링 없음) */
    onState(cb) {
      return onValue(stateRef, (s) => cb({ ...DEFAULT_STATE, ...(s.val() || {}) }), () => cb(null));
    },
    onConnection(cb) {
      return onValue(ref(db, '.info/connected'), (s) => cb(s.val() === true));
    },
    onAdmin(cb) { adminListeners.push(cb); cb(isAdmin, user); },
    login(email, pw) { return signInWithEmailAndPassword(auth, email, pw); },
    logout() { return signOut(auth); },
    setSlide(n) { return patch({ slide: Math.max(0, n | 0) }); },
    setLock(on) { return patch({ locked: !!on }); },
    setPdf(on) { return patch({ pdf: !!on }); },
    onAttention(cb) {
      return onValue(attentionRef, (s) => cb(s.val()?.enabled === true), (e) => { cb(null); reportError(e); });
    },
    setAttention(on) {
      if (!isAdmin) return Promise.reject(new Error('not-admin'));
      return set(attentionRef, { enabled: !!on, updatedAt: serverTimestamp() });
    },
    reset() { return patch({ ...DEFAULT_STATE }); },

    /* 접속자 수: 창을 닫거나 연결이 끊기면 서버가 자동으로 지움 */
    joinViewers() {
      const me = push(ref(db, base + '/viewers'));
      onValue(ref(db, '.info/connected'), (s) => {
        if (s.val() !== true) return;
        onDisconnect(me).remove().then(() => set(me, serverTimestamp()));
      });
    },
    /* 관리자·프로젝션 화면만 구독 권장 - 모든 청중이 구독하면 접속자² 만큼 전송량 증가 */
    onViewers(cb) {
      return onValue(ref(db, base + '/viewers'), (s) => cb(s.size), () => cb(null));
    }
  };
}
