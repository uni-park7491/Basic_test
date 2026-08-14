# 우리들의 링크 · Social Profile Cards

멤버들의 인스타그램을 비롯한 여러 소셜 네트워크 계정을 카드 한 장에 모아 보여주는 정적 웹페이지입니다.
카드의 아이콘을 누르면 해당 프로필로 새 탭에서 바로 이동합니다.

- 닉네임 · 한 줄 역할 · 간단한 소개말 · 관심 키워드
- 프로필 사진은 **넣어도 되고 안 넣어도 됩니다** (없으면 닉네임 이니셜 아바타가 자동 생성)
- 20여 개 소셜 플랫폼 아이콘 지원, 아이콘마다 브랜드 색으로 반응
- 검색 · 키워드 필터 · 다크/라이트 모드 · 모바일 대응
- 빌드 도구·서버 없이 HTML/CSS/JS 파일만으로 동작

---

## 1. 실행해 보기

`index.html` 파일을 브라우저로 열면 바로 확인할 수 있습니다.
(로컬 서버로 보고 싶다면 프로젝트 폴더에서 `python3 -m http.server` 후 http://localhost:8000 접속)

## 2. 내 카드 추가하기

**`data/members.js` 파일 하나만 고치면 됩니다.** 배열 안에 아래 블록을 복사해서 채워 넣으세요.

```js
{
  name: "닉네임",                        // 필수
  role: "한 줄 역할",                     // 선택
  bio: "간단한 소개말을 적어주세요.",       // 선택
  photo: "",                            // 선택 — 사진 URL, 비워두면 이니셜 아바타
  accent: "",                           // 선택 — 카드 포인트 색(예: "#8b6ff5"), 비우면 자동 배정
  tags: ["관심사", "키워드"],              // 선택
  links: {
    instagram: "https://instagram.com/내아이디",
    github: "https://github.com/내아이디",
    email: "me@example.com",
  },
},
```

### links 에 쓸 수 있는 플랫폼 키

| 키 | 플랫폼 | 키 | 플랫폼 |
| --- | --- | --- | --- |
| `instagram` | Instagram | `linkedin` | LinkedIn |
| `threads` | Threads | `discord` | Discord |
| `x` | X (Twitter) | `telegram` | Telegram |
| `facebook` | Facebook | `twitch` | Twitch |
| `youtube` | YouTube | `spotify` | Spotify |
| `tiktok` | TikTok | `soundcloud` | SoundCloud |
| `github` | GitHub | `behance` | Behance |
| `dribbble` | Dribbble | `pinterest` | Pinterest |
| `notion` | Notion | `blog` | 네이버 블로그 |
| `kakao` | 카카오톡 오픈채팅 | `email` | 이메일 |
| `website` | 개인 웹사이트 | `link` | 그 외 아무 링크 |

- 링크는 **전체 주소**(`https://...`)로 넣는 것을 권장합니다. `https://` 를 빼먹어도 자동으로 붙습니다.
- `email` 은 주소만 적어도 `mailto:` 가 자동으로 처리됩니다.
- 목록에 없는 키를 쓰면 기본 링크 아이콘(🔗)으로 표시되니, 어떤 링크든 자유롭게 추가해도 됩니다.
- 아이콘은 `links` 에 적은 **순서 그대로** 표시됩니다.

### 프로필 사진

`photo` 에는 이미지 주소를 넣습니다. 정사각형 이미지가 가장 예쁘게 나옵니다.

- GitHub 프로필 사진을 쓰고 싶다면: `https://github.com/내아이디.png`
- 저장소에 직접 올리려면 `assets/img/` 폴더에 넣고 `photo: "assets/img/내파일.jpg"`
- 주소가 잘못돼서 사진을 못 불러와도 이니셜 아바타로 자연스럽게 대체됩니다.

## 3. 배포하기 (GitHub Pages)

저장소 **Settings → Pages → Source** 를 `Deploy from a branch` 로 두고,
브랜치를 `main` / 폴더를 `/ (root)` 로 지정하면 몇 분 뒤 공개 주소가 생성됩니다.

## 폴더 구조

```
├─ index.html            페이지 뼈대
├─ data/
│  └─ members.js         ★ 멤버 정보 (여기만 고치면 됩니다)
└─ assets/
   ├─ css/style.css      디자인
   └─ js/
      ├─ icons.js        소셜 아이콘 데이터
      └─ app.js          카드 렌더링 · 검색 · 필터 · 테마
```

## 크레딧

브랜드 아이콘은 [Simple Icons](https://github.com/simple-icons/simple-icons) (CC0 1.0) 를 사용했습니다.
본문 서체는 [Pretendard](https://github.com/orioncactus/pretendard) 입니다.
