/* =========================================================
   form.js — 페이지 안에서 내 프로필을 작성하는 시트
   입력할 때마다 오른쪽 미리보기 카드가 실시간으로 바뀝니다.
   ========================================================= */

(function () {
  "use strict";

  var CARDS = window.CARDS;
  var ICONS = window.SOCIAL_ICONS || {};
  if (!CARDS) return;

  var dialog = document.getElementById("profileDialog");
  var form = document.getElementById("profileForm");
  var openBtn = document.getElementById("openForm");
  var closeBtn = document.getElementById("closeForm");
  var cancelBtn = document.getElementById("cancelForm");
  var swatchesEl = document.getElementById("swatches");
  var linkRowsEl = document.getElementById("linkRows");
  var addLinkBtn = document.getElementById("addLink");
  var previewEl = document.getElementById("previewSlot");
  var noteEl = document.getElementById("formNote");

  /* 처음 열었을 때 기본으로 깔아 두는 링크 칸 */
  var DEFAULT_KEYS = ["instagram", "youtube", "x"];
  var PLATFORMS = Object.keys(ICONS);

  var photoInput = document.getElementById("photoInput");
  var photoThumb = document.getElementById("photoThumb");
  var photoClear = document.getElementById("photoClear");

  var chosenAccent = "";
  var chosenPhoto = "";

  /* ---------- 프로필 사진 ----------
     휴대폰 사진은 수 MB라 그대로 두면 저장 한도를 넘깁니다.
     가운데를 정사각형으로 잘라 256px JPEG 으로 줄여서 담습니다. */

  var PHOTO_SIZE = 256;

  function shrink(file, done) {
    var reader = new FileReader();

    reader.onload = function () {
      var img = new Image();

      img.onload = function () {
        var side = Math.min(img.width, img.height);
        var canvas = document.createElement("canvas");
        canvas.width = canvas.height = PHOTO_SIZE;

        canvas
          .getContext("2d")
          .drawImage(
            img,
            (img.width - side) / 2, (img.height - side) / 2, side, side,
            0, 0, PHOTO_SIZE, PHOTO_SIZE
          );

        done(canvas.toDataURL("image/jpeg", 0.82));
      };

      img.onerror = function () { done(null); };
      img.src = reader.result;
    };

    reader.onerror = function () { done(null); };
    reader.readAsDataURL(file);
  }

  function showPhoto(dataUrl) {
    chosenPhoto = dataUrl || "";
    photoThumb.style.backgroundImage = chosenPhoto ? 'url("' + chosenPhoto + '")' : "";
    photoThumb.classList.toggle("is-set", !!chosenPhoto);
    photoClear.hidden = !chosenPhoto;
    updatePreview();
  }

  photoInput.addEventListener("change", function () {
    var file = photoInput.files && photoInput.files[0];
    if (!file) return;

    shrink(file, function (dataUrl) {
      if (!dataUrl) {
        noteEl.textContent = "이 사진은 불러오지 못했어요. 다른 사진으로 해주세요.";
        noteEl.className = "sheet__note is-warn";
        return;
      }
      noteEl.textContent = "";
      noteEl.className = "sheet__note";
      showPhoto(dataUrl);
    });
  });

  photoClear.addEventListener("click", function () {
    photoInput.value = "";
    showPhoto("");
  });

  /* ---------- 색상 선택 ---------- */

  function buildSwatches() {
    swatchesEl.innerHTML =
      '<button class="swatch swatch--auto is-on" type="button" data-color="" title="닉네임에 맞춰 자동">자동</button>' +
      CARDS.palette
        .map(function (color) {
          return '<button class="swatch" type="button" data-color="' + color +
            '" style="--sw:' + color + '" aria-label="' + color + '"></button>';
        })
        .join("");
  }

  swatchesEl.addEventListener("click", function (event) {
    var button = event.target.closest(".swatch");
    if (!button) return;

    chosenAccent = button.dataset.color;
    Array.prototype.forEach.call(swatchesEl.children, function (el) {
      el.classList.toggle("is-on", el === button);
    });
    updatePreview();
  });

  /* ---------- 소셜 링크 칸 ---------- */

  function linkRowHTML(selectedKey) {
    var options = PLATFORMS.map(function (key) {
      var label = (ICONS[key] && ICONS[key].label) || key;
      return '<option value="' + key + '"' + (key === selectedKey ? " selected" : "") + ">" +
        label + "</option>";
    }).join("");

    return (
      '<div class="linkrow">' +
      '<select class="linkrow__select" aria-label="플랫폼">' + options + "</select>" +
      '<input class="linkrow__input" type="text" inputmode="url" autocomplete="off"' +
      ' placeholder="' + (selectedKey === "email" ? "me@example.com" : "https://...") + '"' +
      ' aria-label="링크 주소" />' +
      '<button class="linkrow__del" type="button" aria-label="이 칸 지우기">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      "</button></div>"
    );
  }

  function addLinkRow(key) {
    linkRowsEl.insertAdjacentHTML("beforeend", linkRowHTML(key || "instagram"));
  }

  addLinkBtn.addEventListener("click", function () {
    addLinkRow();
    var rows = linkRowsEl.querySelectorAll(".linkrow__input");
    if (rows.length) rows[rows.length - 1].focus();
  });

  linkRowsEl.addEventListener("click", function (event) {
    var del = event.target.closest(".linkrow__del");
    if (!del) return;
    del.closest(".linkrow").remove();
    updatePreview();
  });

  linkRowsEl.addEventListener("input", updatePreview);
  linkRowsEl.addEventListener("change", updatePreview);

  /* ---------- 폼 → 멤버 객체 ---------- */

  function collect() {
    var data = new FormData(form);
    var links = {};

    Array.prototype.forEach.call(linkRowsEl.querySelectorAll(".linkrow"), function (row) {
      var key = row.querySelector(".linkrow__select").value;
      var value = row.querySelector(".linkrow__input").value.trim();
      if (value) links[key] = value;
    });

    var tags = String(data.get("tags") || "")
      .split(",")
      .map(function (t) { return t.trim().replace(/^#/, ""); })
      .filter(Boolean)
      .slice(0, 5);

    return {
      name: String(data.get("name") || "").trim(),
      role: String(data.get("role") || "").trim(),
      bio: String(data.get("bio") || "").trim(),
      photo: chosenPhoto,
      accent: chosenAccent,
      tags: tags,
      links: links,
    };
  }

  /* ---------- 미리보기 ---------- */

  function updatePreview() {
    var member = collect();
    if (!member.name) member.name = "닉네임";
    previewEl.innerHTML = CARDS.cardHTML(member, 0);
  }

  form.addEventListener("input", updatePreview);

  /* ---------- 열기 / 닫기 ---------- */

  function open() {
    form.reset();
    chosenAccent = "";
    noteEl.textContent = "";
    noteEl.className = "sheet__note";
    photoInput.value = "";
    showPhoto("");
    buildSwatches();
    linkRowsEl.innerHTML = "";
    DEFAULT_KEYS.forEach(addLinkRow);
    updatePreview();

    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");

    form.querySelector('[name="name"]').focus();
  }

  function close() {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  cancelBtn.addEventListener("click", close);

  /* 배경(백드롭)을 누르면 닫힙니다 */
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) close();
  });

  /* ---------- 저장 ---------- */

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var member = collect();
    if (!member.name) {
      noteEl.textContent = "닉네임은 꼭 적어주세요.";
      noteEl.className = "sheet__note is-warn";
      form.querySelector('[name="name"]').focus();
      return;
    }

    var ok = CARDS.addLocal(member);
    if (!ok) {
      noteEl.textContent = "이 브라우저가 저장을 막고 있어요. 시크릿 모드라면 일반 창에서 시도해 주세요.";
      noteEl.className = "sheet__note is-warn";
      return;
    }

    close();
    document.querySelector(".wrap").scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
