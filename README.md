# 우리 둘 💕 — 한국어 ↔ 베트남어 자동 번역 커플 채팅

- 한국어로 보내면 상대는 베트남어로, 베트남어로 보내면 한국어로 보입니다.
- 연인끼리 쓰는 자연스러운 말투(한국어 반말, 베트남어 anh/em)로 번역합니다.
- 말풍선을 누르면 원문과 번역을 같이 볼 수 있습니다.
- 휴대폰 홈 화면에 추가하면 앱처럼 쓸 수 있습니다.
- 📷 사진 주고받기: 휴대폰에서 자동 압축해 보냅니다 (한 번에 최대 10장). 사진을 누르면 크게 보이고, 길게 누르면 저장됩니다.
- 🐰 커플 이모티콘 18종 (핑크 토끼 '토리' + 크림 곰 '뭉치') + 이모지 패널.

### 사진 저장 용량
사진은 Firebase Storage(유료 요금제 필요) 대신 Firestore에 바로 저장해서 **무료 요금제로 그대로 쓸 수 있습니다.**
Firestore 무료 저장 공간은 1GB, 사진 한 장은 보통 100~400KB라서 대략 3,000~5,000장까지 무료입니다.

## 구조

| 파일 | 역할 |
|---|---|
| `index.html` | 채팅 화면 (Firebase로 실시간 저장·수신) |
| `api/config.js` | Firebase 접속 정보를 Vercel 환경변수에서 읽어 전달 (코드 수정 불필요) |
| `api/translate.js` | Vercel 서버 함수: Claude API로 번역 (API 키는 서버에만 있음) |
| `firestore.rules` | 데이터베이스 보안 규칙 (사진 규칙 포함, **바뀌었으면 Firebase에 다시 게시**) |
| `stickers.js` | 커플 이모티콘(SVG)과 이모지 목록 |

준비물: Google 계정(Firebase), GitHub 계정, Vercel 계정, Anthropic API 키.
PC에서 진행하는 걸 추천합니다. 30분 정도 걸립니다.

---

## 1. Anthropic API 키 만들기
1. https://console.anthropic.com 로그인
2. **Billing**에서 크레딧 충전 (사용한 만큼 차감)
3. **API Keys → Create Key** → 키 복사해서 메모장에 보관 (`sk-ant-...`)
4. (추천) **Limits**에서 월 사용 한도를 낮게 설정

## 2. Firebase 만들기 (대화 저장)
1. https://console.firebase.google.com → **프로젝트 추가** (애널리틱스는 꺼도 됨)
2. 왼쪽 **빌드 → Authentication → 시작하기 → 로그인 방법 → 익명** → 사용 설정 → 저장
3. **빌드 → Firestore Database → 데이터베이스 만들기**
   - 위치: `asia-southeast1 (싱가포르)` 또는 `asia-northeast3 (서울)`
   - **프로덕션 모드**로 시작
4. Firestore의 **규칙** 탭 → 내용을 전부 지우고 `firestore.rules` 파일 내용을 붙여넣기 → **게시**
5. 톱니바퀴 **프로젝트 설정 → 내 앱 → 웹(`</>`) 아이콘** → 앱 이름 입력 → 등록
6. 나오는 `const firebaseConfig = { ... };` 부분을 통째로 복사해 메모장에 보관 (4단계에서 붙여넣음)

## 3. GitHub에 올리기
1. https://github.com/new → 저장소 이름 예: `couple-chat` → **Private** → 생성
2. **uploading an existing file** 클릭 → 이 폴더의 파일 전부 드래그 (`api` 폴더 포함) → Commit

## 4. Vercel로 배포 (사이트 주소 생기는 단계)
1. https://vercel.com → **GitHub로 로그인**
2. **Add New → Project** → 방금 만든 저장소 **Import**
3. **Environment Variables**에 세 개 추가
   - `ANTHROPIC_API_KEY` = 1단계에서 만든 키
   - `CHAT_PASSCODE` = 둘만 아는 방 비밀번호 (**12자 이상, 길게**)
   - `FIREBASE_CONFIG` = 2단계에서 복사한 `firebaseConfig = { ... }` 통째로 (형식 신경 안 써도 됨)
4. **Deploy** → 끝나면 `https://couple-chat-xxxx.vercel.app` 같은 주소가 생김

## 5. 사용하기
1. 주소를 둘이 각자 휴대폰으로 열기
2. 언어 · 성별 · 이름 · 방 비밀번호(`CHAT_PASSCODE`) 입력 → 입장
3. 홈 화면에 추가
   - 아이폰: Safari 공유 버튼 → **홈 화면에 추가**
   - 안드로이드: Chrome 메뉴 → **홈 화면에 추가**

---

## 자주 생기는 문제
- **"비밀번호가 틀렸어요"**: Vercel의 `CHAT_PASSCODE`와 똑같이 입력했는지 확인하세요. 환경변수를 바꿨으면 Vercel에서 **Redeploy**를 해야 반영됩니다.
- **"인터넷 연결을 확인해 주세요"가 계속 뜸**: Vercel의 `FIREBASE_CONFIG` 값, Firestore 규칙 게시 여부, 익명 로그인이 켜져 있는지 확인하세요.
- **번역 실패**: Vercel → 프로젝트 → **Logs**에서 오류를 보세요. 대부분 API 키 오타나 크레딧 부족입니다.
- **번역이 느리거나 비쌀 때**: Vercel 환경변수에 `CLAUDE_MODEL` = `claude-haiku-5-5` 를 추가하면 더 빠르고 싸집니다 (말투 품질은 조금 떨어질 수 있음).

## 보안 메모
- 방 ID는 비밀번호의 해시라서, 비밀번호를 모르면 대화에 접근할 수 없습니다. 그래서 비밀번호는 **길고 추측하기 어렵게** 정하세요.
- 번역 서버는 비밀번호가 맞을 때만 동작하기 때문에 남이 API 키를 쓸 수 없습니다.
- 메시지는 삭제·수정이 막혀 있고, 번역 결과만 추가할 수 있습니다.
