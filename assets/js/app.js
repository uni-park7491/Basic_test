/* =========================================================
   app.js — 카드 렌더링 · 검색 · 필터 · 테마
   (수정할 일은 거의 없어요. 멤버 추가는 data/members.js 에서!)
   ========================================================= */

(function () {
  "use strict";

  var ICONS = window.SOCIAL_ICONS || {};
  var MEMBERS = Array.isArray(window.MEMBERS) ? window.MEMBERS : [];

  var gridEl = document.getElementById("grid");
  var emptyEl = document.getElementById("empty");
  var searchEl = document.getElementById("search");
  var tagFilterEl = document.getElementById("tagFilter");

  /* accent 를 지정하지 않은 멤버에게 자동으로 배정되는 색 */
  var PALETTE = [
    "#8b6ff5", "#2fb6a6", "#e0803f", "#d9557f", "#4f8ef7",
    "#c2703f", "#3fa96b", "#a86bd8", "#e0575b", "#5c8fb8",
  ];

  var state = { query: "", tag: "" };

  /* ---------- utils ---------- */

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  /* 닉네임을 기반으로 항상 같은 색이 나오도록 */
  function pickAccent(name) {
    var sum = 0;
    for (var i = 0; i < name.length; i++) sum = (sum * 31 + name.charCodeAt(i)) % 100000;
    return PALETTE[sum % PALETTE.length];
  }

  /* 사진이 없을 때 쓰는 이니셜 (한글은 첫 글자, 영문은 최대 두 글자) */
  function initials(name) {
    var clean = name.trim();
    if (!clean) return "?";
    if (/[가-힣]/.test(clean[0])) return clean[0];
    var words = clean.split(/[\s._-]+/).filter(Boolean);
    return (words.length > 1 ? words[0][0] + words[1][0] : clean.slice(0, 2)).toUpperCase();
  }

  function normalizeHref(key, value) {
    var raw = String(value).trim();
    if (!raw) return "";
    if (key === "email") return /^mailto:/i.test(raw) ? raw : "mailto:" + raw;
    if (/^(https?:|mailto:)/i.test(raw)) return raw;
    return "https://" + raw.replace(/^\/+/, "");
  }

  /* ---------- 렌더링 ---------- */

  function socialHTML(key, value) {
    var href = normalizeHref(key, value);
    if (!href) return "";

    var icon = ICONS[key] || ICONS.link;
    var style = icon.color
      ? ' style="--brand-light:' + icon.color + ';--brand-dark:' + icon.colorDark + '"'
      : "";
    var label = icon.label || key;

    return (
      '<a class="social" href="' + esc(href) + '"' + style +
      ' target="_blank" rel="noopener noreferrer"' +
      ' aria-label="' + esc(label) + '" title="' + esc(label) + '">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"' + (icon.stroke ? ' data-stroke' : "") + ">" +
      '<path d="' + icon.path + '"/></svg></a>'
    );
  }

  /* 사진이 있으면 사진, 없거나 불러오지 못하면 이니셜이 그대로 보입니다. */
  function avatarHTML(member) {
    return (
      '<div class="avatar"><span aria-hidden="true">' + esc(initials(member.name)) + "</span>" +
      (member.photo
        ? '<img src="' + esc(member.photo) + '" alt="' + esc(member.name) +
          '" loading="lazy" onerror="this.remove()" />'
        : "") +
      "</div>"
    );
  }

  function cardHTML(member, index) {
    var accent = member.accent || pickAccent(member.name || "");
    var links = member.links || {};
    var socials = Object.keys(links)
      .map(function (key) { return socialHTML(key, links[key]); })
      .join("");
    var tags = (member.tags || [])
      .map(function (tag) { return '<span class="tag">#' + esc(tag) + "</span>"; })
      .join("");

    return (
      '<article class="card" style="--accent:' + esc(accent) +
      ";animation-delay:" + Math.min(index, 12) * 45 + 'ms">' +
      '<div class="card__head">' + avatarHTML(member) +
      '<div class="card__id"><h2 class="card__name">' + esc(member.name) + "</h2>" +
      (member.role ? '<p class="card__role">' + esc(member.role) + "</p>" : "") +
      "</div></div>" +
      (member.bio ? '<p class="card__bio">' + esc(member.bio) + "</p>" : "") +
      (tags ? '<div class="card__tags">' + tags + "</div>" : "") +
      (socials ? '<div class="card__links">' + socials + "</div>" : "") +
      "</article>"
    );
  }

  function matches(member) {
    if (state.tag && (member.tags || []).indexOf(state.tag) === -1) return false;
    if (!state.query) return true;

    var haystack = [member.name, member.role, member.bio]
      .concat(member.tags || [])
      .concat(Object.keys(member.links || {}))
      .join(" ")
      .toLowerCase();
    return haystack.indexOf(state.query) !== -1;
  }

  function render() {
    var visible = MEMBERS.filter(matches);
    gridEl.innerHTML = visible.map(cardHTML).join("");
    emptyEl.hidden = visible.length > 0;

    /* 아직 아무도 등록하지 않은 상태와, 검색 결과가 없는 상태는 다른 안내가 필요합니다 */
    if (!visible.length) {
      emptyEl.textContent = MEMBERS.length
        ? "찾는 멤버가 없어요. 다른 키워드로 검색해 보세요."
        : "아직 등록된 카드가 없어요. 아래 버튼을 눌러 첫 번째 주인공이 되어 주세요.";
    }
  }

  /* ---------- 태그 필터 ---------- */

  function buildTagFilter() {
    var seen = [];
    MEMBERS.forEach(function (member) {
      (member.tags || []).forEach(function (tag) {
        if (seen.indexOf(tag) === -1) seen.push(tag);
      });
    });
    if (!seen.length) return;

    tagFilterEl.innerHTML = ['<button class="chip" type="button" data-tag="" aria-pressed="true">전체</button>']
      .concat(seen.map(function (tag) {
        return '<button class="chip" type="button" data-tag="' + esc(tag) +
          '" aria-pressed="false">' + esc(tag) + "</button>";
      }))
      .join("");

    tagFilterEl.addEventListener("click", function (event) {
      var button = event.target.closest(".chip");
      if (!button) return;

      state.tag = button.dataset.tag === state.tag ? "" : button.dataset.tag;
      Array.prototype.forEach.call(tagFilterEl.children, function (chip) {
        chip.setAttribute("aria-pressed", String(chip.dataset.tag === state.tag));
      });
      render();
    });
  }

  /* ---------- 테마 ---------- */

  function setupTheme() {
    var root = document.documentElement;
    var saved = null;
    try { saved = localStorage.getItem("theme"); } catch (e) { /* 사생활 보호 모드 등 */ }

    var prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    root.dataset.theme = saved || (prefersLight ? "light" : "dark");

    document.getElementById("themeToggle").addEventListener("click", function () {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem("theme", root.dataset.theme); } catch (e) { /* noop */ }
    });
  }

  /* ---------- init ---------- */

  setupTheme();
  buildTagFilter();
  render();

  /* 카드가 하나도 없을 때 검색창만 덩그러니 남으면 고장 난 것처럼 보입니다 */
  if (!MEMBERS.length) {
    var toolbarEl = document.querySelector(".toolbar");
    if (toolbarEl) toolbarEl.hidden = true;
  }

  searchEl.addEventListener("input", function () {
    state.query = searchEl.value.trim().toLowerCase();
    render();
  });
})();
