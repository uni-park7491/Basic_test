/* ============================================================
 *  members.js — 여기에만 추가하면 카드가 자동으로 생성됩니다.
 * ------------------------------------------------------------
 *  아래 배열에 자신의 정보를 { ... } 블록으로 하나 추가하세요.
 *
 *  name    : 닉네임 (필수)
 *  role    : 한 줄 직함/역할 (선택)
 *  bio     : 간단한 소개말 (선택, 2~3줄 권장)
 *  photo   : 프로필 사진 URL (선택 — 비워두면 이니셜 아바타가 자동 생성)
 *  accent  : 카드 포인트 색상 (선택 — 비워두면 닉네임 기반으로 자동 배정)
 *  tags    : 관심사/키워드 배열 (선택)
 *  links   : { 플랫폼: "링크" } — 아이콘을 누르면 새 탭으로 열립니다.
 *
 *  사용 가능한 플랫폼 키:
 *    instagram, threads, x, facebook, youtube, tiktok, github,
 *    linkedin, discord, telegram, twitch, spotify, soundcloud,
 *    behance, dribbble, pinterest, notion, blog, kakao, email, website
 *
 *  email 은 주소만 적어도 되고(mailto: 자동 처리), 나머지는 전체 URL을 넣어주세요.
 * ============================================================ */

window.MEMBERS = [
  {
    name: "지은",
    role: "Product Designer",
    bio: "쓸모 있는 아름다움을 좋아합니다. 요즘은 타이포그래피와 모션에 빠져 있어요.",
    photo: "",
    accent: "#8b6ff5",
    tags: ["디자인", "타이포", "모션"],
    links: {
      instagram: "https://instagram.com/",
      behance: "https://behance.net/",
      threads: "https://threads.net/",
      email: "hello@example.com",
    },
  },
  {
    name: "MINHO",
    role: "Frontend Engineer",
    bio: "웹으로 만들 수 있는 건 다 만들어보는 중. 커피 한 잔이면 밤도 괜찮습니다.",
    photo: "",
    accent: "#2fb6a6",
    tags: ["웹", "React", "사이드프로젝트"],
    links: {
      github: "https://github.com/",
      x: "https://x.com/",
      linkedin: "https://linkedin.com/in/",
      website: "https://example.com",
    },
  },
  {
    name: "하루",
    role: "Photographer",
    bio: "빛이 좋은 날엔 무조건 밖으로. 필름과 디지털 반반씩 찍습니다.",
    photo: "",
    accent: "#e0803f",
    tags: ["사진", "필름", "여행"],
    links: {
      instagram: "https://instagram.com/",
      youtube: "https://youtube.com/",
      pinterest: "https://pinterest.com/",
    },
  },
  {
    name: "SORA",
    role: "Music / DJ",
    bio: "새벽 4시의 사운드를 만듭니다. 플레이리스트 공유는 언제든 환영이에요.",
    photo: "",
    accent: "#d9557f",
    tags: ["음악", "DJ", "플레이리스트"],
    links: {
      spotify: "https://open.spotify.com/",
      soundcloud: "https://soundcloud.com/",
      instagram: "https://instagram.com/",
      tiktok: "https://tiktok.com/",
    },
  },
];
