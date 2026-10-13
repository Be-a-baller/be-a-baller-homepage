// 年齢を生年月日から自動計算（誕生日が来たら勝手に1つ増える）
const bday = new Date(document.getElementById("birthday").dateTime);
const now = new Date();
let age = now.getFullYear() - bday.getFullYear();
if (now < new Date(now.getFullYear(), bday.getMonth(), bday.getDate())) age--;
document.getElementById("age").textContent = `${age}歳`;
document.getElementById("ageNum").textContent = age;

const fx = document.documentElement.classList.contains("fx");

/* ---------- カードを指・マウスの位置に合わせて立体的に傾ける ---------- */
if (fx && matchMedia("(hover: hover)").matches) {
  document.querySelectorAll("[data-tilt]").forEach((el) => {
    const max = el.classList.contains("pcard") ? 14 : 6;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.classList.add("is-tilting");
      el.style.setProperty("--ry", `${(x - 0.5) * max * 2}deg`);
      el.style.setProperty("--rx", `${(0.5 - y) * max * 2}deg`);
      el.style.setProperty("--mx", `${x * 100}%`);
      el.style.setProperty("--my", `${y * 100}%`);
    });
    el.addEventListener("pointerleave", () => {
      el.classList.remove("is-tilting");
      ["--rx", "--ry", "--mx", "--my"].forEach((p) => el.style.removeProperty(p));
    });
  });
}

/* ---------- 経歴：スクロールに合わせてマーカーが線の上を進む（ボールは転がる） ---------- */
const lanes = [...document.querySelectorAll(".tl-lane")];
if (lanes.length) {
  let ticking = false;
  const roll = () => {
    ticking = false;
    lanes.forEach((lane) => {
      const mark = lane.querySelector(".tl-ball");
      const r = lane.getBoundingClientRect();
      const y = Math.min(1, Math.max(0, (innerHeight * 0.55 - r.top) / r.height)) * r.height;
      const spin = mark.hasAttribute("data-roll") ? ` rotate(${(y / (Math.PI * mark.clientWidth)) * 360}deg)` : "";
      mark.style.transform = `translateY(${y}px)${spin}`;
    });
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(roll); } }, { passive: true });
  addEventListener("resize", roll);
  roll();
}

/* ---------- クリニック：カードをクリックすると概要をポップアップで表示 ---------- */
const modal = document.getElementById("campModal");
if (modal && modal.showModal) {
  const q = (s) => modal.querySelector(s);
  document.querySelectorAll(".camp").forEach((card) => {
    card.addEventListener("click", () => {
      const f = (k) => card.querySelector(`[data-f="${k}"]`)?.textContent.trim() || "";
      q(".camp-m-no").textContent = card.querySelector(".camp-no").textContent;
      q(".camp-m-en").textContent = card.querySelector(".camp-en").textContent;
      q(".camp-m-ja").textContent = card.querySelector(".camp-ja").textContent;
      q(".camp-m-lead").textContent = f("lead");
      q(".camp-m-data").innerHTML = "";
      ["対象", "内容", "開催地", "実績"].forEach((k) => {
        const row = document.createElement("div");
        row.innerHTML = "<dt></dt><dd></dd>";
        row.firstChild.textContent = k;
        row.lastChild.textContent = f(k);
        q(".camp-m-data").append(row);
      });
      // 詳細ページの URL が入っていればリンク、なければ「準備中」
      const link = q(".camp-m-link"), url = f("link");
      link.classList.toggle("is-disabled", !url);
      link.textContent = url ? "詳細ページへ →" : "詳細ページ（準備中）";
      url ? link.setAttribute("href", url) : link.removeAttribute("href");
      modal.showModal();
    });
  });
  q(".camp-close").addEventListener("click", () => modal.close());
  // 外側（背景）をクリックしたら閉じる
  modal.addEventListener("click", (e) => {
    const r = modal.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) modal.close();
  });
}

/* ---------- 共通（メニュー・スクロール表示・年） ---------- */
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
  toggle.textContent = open ? "✕" : "☰";
});

if (fx && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
}

document.getElementById("year").textContent = new Date().getFullYear();
