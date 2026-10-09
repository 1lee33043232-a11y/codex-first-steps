/* Firebase 콘솔 → 프로젝트 설정 → 내 앱(웹) → SDK 설정 및 구성 → "구성" 값을 그대로 붙여넣기
   이 값은 비밀번호가 아님(웹 앱에 공개되는 식별 정보) · 보안은 database.rules.json 규칙이 담당
   databaseURL 은 Realtime Database 화면 상단 주소 (예: https://프로젝트-default-rtdb.asia-southeast1.firebasedatabase.app) */
/* 사용자 제공 웹 앱 SDK 화면에서 확인한 구성
   실제 프로젝트 ID: notebooklm-3b8ab-fff4a
   databaseURL 미확인 · 비워둔 상태에서는 자유 열람
   연결 순서: firebase/SETUP.md */
window.FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAgVVqSVcY69kxv2c_G1UKK8MQ-249ko6s',
  authDomain: 'notebooklm-3b8ab-fff4a.firebaseapp.com',
  databaseURL: '',
  projectId: 'notebooklm-3b8ab-fff4a',
  storageBucket: 'notebooklm-3b8ab-fff4a.firebasestorage.app',
  messagingSenderId: '986953400520',
  appId: '1:986953400520:web:5ba11b1e64ab27597525fd',
  measurementId: 'G-SFV89WS1EZ'
};

/* 강의마다 다른 이름 - 같은 프로젝트로 여러 강의 운영 가능 (영문·숫자·하이픈) */
window.DECK_ID = 'codex-first-steps-20261009';
