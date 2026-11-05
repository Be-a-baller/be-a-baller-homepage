// スマホメニュー（ワークアウトの各ページ用）
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");
const setOpen = (open) => {
  nav.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", open);
  toggle.textContent = open ? "✕" : "☰";
};
toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
