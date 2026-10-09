# NotebookLM 강의 Firebase 연결 체크리스트

프로젝트 표시 이름: `0930notebooklm`. 2026년 10월 9일 사용자 승인 후 새 프로젝트 생성 완료 화면 확인. 실제 프로젝트 ID: `notebooklm-3b8ab`. 웹 앱 등록 완료 단계 확인. SDK 구성과 데이터베이스 URL은 아직 확인되지 않음. 이름으로 ID·주소를 만들지 않기.

현재 상태: 프로젝트 생성과 웹 앱 등록 단계 확인 이후 콘솔의 약관 상태 오류·권한 오류·로딩 지연 발생. Realtime Database·Authentication·규칙·admins 설정은 미완료. 실제 연결값 입력과 배포 전까지 공개 강의는 자유 열람 상태 유지.

## 1. 기존 프로젝트 확인

- [ ] https://console.firebase.google.com/ 에서 프로젝트를 만든 Google 계정으로 로그인
- [ ] 기존 `0930notebooklm` 프로젝트 선택
- [ ] 프로젝트 설정 → 일반 → 프로젝트 ID 확인(표시 이름과 다를 수 있음)

## 2. Realtime Database

- [ ] 빌드 → Realtime Database → 데이터베이스 만들기(기존 데이터베이스가 있으면 그대로 사용)
- [ ] 데이터 위치 선택 → 잠금 모드로 시작
- [ ] 데이터 화면 상단의 실제 HTTPS 데이터베이스 URL 복사
- [ ] `firebase/firebase-config.js`의 `databaseURL`에 입력

## 3. Authentication

- [ ] 빌드 → Authentication → 시작하기
- [ ] 로그인 방법 → 이메일/비밀번호 사용 설정 → 저장
- [ ] 사용자 → 사용자 추가 → 강사 이메일과 비밀번호를 콘솔에 직접 입력
- [ ] 생성된 강사 사용자 UID 복사
- [ ] 설정 → 승인된 도메인 → `codex-first-steps.vercel.app` 추가(이미 있으면 유지)
- [ ] 비밀번호·서비스 계정 비공개 키를 저장소에 넣지 않기

## 4. 데이터베이스 규칙

- [ ] Realtime Database → 규칙 → `firebase/database.rules.json` 전체 내용 붙여넣기 → 게시
- [ ] 공개 읽기: `decks/{덱 이름}/state`의 슬라이드 번호·잠금·PDF 상태
- [ ] 상태 쓰기: `admins/{로그인 UID}`의 값이 불리언 `true`인 계정만 허용
- [ ] admins 목록: 본인 UID 읽기만 허용 · 웹 앱에서 목록 추가·수정 금지
- [ ] 다른 루트에 `.read: true`나 `.write: true` 규칙을 추가하지 않기

## 5. 관리자 등록

- [ ] Realtime Database → 데이터 → 루트에 `admins` 항목 추가
- [ ] `admins` 아래에 Authentication에서 복사한 UID를 키로 추가
- [ ] 값: 문자열 `"true"`가 아닌 불리언 `true`
- [ ] 아래 구조는 형태 예시이며 실제 UID로 교체

```json
{ "admins": { "강사_사용자_UID": true } }
```

## 6. 웹 앱 등록과 구성 입력

- [ ] 프로젝트 설정 → 일반 → 내 앱 → 웹 아이콘(`</>`) 선택(기존 웹 앱이 있으면 선택)
- [ ] 앱 닉네임 입력 → 앱 등록 · Firebase Hosting 추가 설정은 불필요(Vercel 사용)
- [ ] SDK 설정 및 구성 → 구성에서 실제 값 복사
- [ ] `firebase/firebase-config.js`의 `window.FIREBASE_CONFIG`에 입력

| 입력 키 | 확인 위치 |
|---|---|
| `apiKey` | 웹 앱 SDK 구성 |
| `authDomain` | 웹 앱 SDK 구성 |
| `projectId` | 웹 앱 SDK 구성·프로젝트 일반 설정 |
| `appId` | 웹 앱 SDK 구성 |
| `databaseURL` | Realtime Database 데이터 화면 상단 |

`window.DECK_ID = 'codex-first-steps-20261009'`는 강의 동기화 경로이며 Firebase 프로젝트 ID와 별개. 강사·청중은 같은 파일과 덱 ID 사용.

## 7. 배포와 두 기기 확인

- [ ] 구성 파일 변경 커밋 → `main` 푸시 → Vercel 배포 완료 확인
- [ ] 강사: https://codex-first-steps.vercel.app/slides.html?admin → 강사 로그인
- [ ] 청중: https://codex-first-steps.vercel.app/slides.html (다른 기기나 브라우저)
- [ ] 잠금 ON → 강사 다음 장 이동 → 청중 같은 번호 확인 · 청중 직접 이동 불가 확인
- [ ] 잠금 OFF → 청중 개별 이동 확인 · 청중 이동이 강사 화면에 영향을 주지 않는지 확인
- [ ] PDF OFF → PDF 저장 버튼과 P 단축키 비활성 확인 · ON 후 복원 확인
- [ ] admins에 없는 사용자 → 강사 제어 버튼 미표시 · 상태 쓰기 거부 확인
- [ ] 규칙 시뮬레이터에서 비로그인 쓰기 거부·등록 UID 쓰기 허용 확인
- [ ] 기존 PDF 링크·영상 링크·음성 재생·이미지 표시 확인

구성값 미입력·미완성 상태에서는 자유 열람. 연결 설정 뒤 네트워크 단절 시 마지막 수신 상태 유지 및 재연결 안내. PDF 스위치는 웹슬라이드의 인쇄 UI 제어이며 공개 자료 파일 다운로드 차단 기능은 아님.

실제 프로젝트 구성 입력과 규칙 게시 이전에는 실제 Firebase 두 기기 동기화가 완료된 상태가 아님.

참고: [웹 앱 등록](https://firebase.google.com/docs/web/setup), [이메일·비밀번호 인증](https://firebase.google.com/docs/auth/web/password-auth), [데이터베이스 규칙](https://firebase.google.com/docs/database/security).
