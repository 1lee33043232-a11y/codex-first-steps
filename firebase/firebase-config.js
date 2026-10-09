/* Firebase 콘솔 → 프로젝트 설정 → 내 앱(웹) → SDK 설정 및 구성 → "구성" 값을 그대로 붙여넣기
   이 값은 비밀번호가 아님(웹 앱에 공개되는 식별 정보) · 보안은 database.rules.json 규칙이 담당
   databaseURL 은 Realtime Database 화면 상단 주소 (예: https://프로젝트-default-rtdb.asia-southeast1.firebasedatabase.app) */
/* 사용자 제공 프로젝트 표시 이름: 0930notebooklm
   실제 프로젝트 ID: notebooklm-3b8ab (Firebase 생성 완료 화면 확인)
   웹 앱 SDK 구성·databaseURL 미확인 · 미입력 상태에서는 자유 열람
   연결 순서: firebase/SETUP.md */
window.FIREBASE_CONFIG = {
  apiKey: '[apiKey 붙여넣기]',
  authDomain: '[프로젝트].firebaseapp.com',
  databaseURL: '[Realtime Database 주소]',
  projectId: 'notebooklm-3b8ab',
  appId: '[appId 붙여넣기]'
};

/* 강의마다 다른 이름 - 같은 프로젝트로 여러 강의 운영 가능 (영문·숫자·하이픈) */
window.DECK_ID = 'codex-first-steps-20261009';
