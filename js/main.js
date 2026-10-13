/* ============================================
   ★ リンク設定 — URLが決まったらここを書き換えるだけでOK
   空文字 "" のままだと「COMING SOON」表示になります
   ============================================ */
const LINKS = {
  youtube:  "https://www.youtube.com/@be_a_baller",
  // ワークアウトの3つは各ページに飛ぶので、ここでの設定は不要
  // パーソナル → personal.html（料金は js/personal.js）
  // チームオフェンス／ディフェンス → team-offense.html / team-defense.html（料金は js/team.js）
};

/* ============================================
   ★ スポンサー設定
   name: 会社名 / logo: ロゴ画像のパス（例: "images/sponsor-main.png"）/ url: リンク先
   name が空のままだと「募集中」の枠が表示されます
   ============================================ */
const SPONSORS = {
  main: { name: "", logo: "", url: "" },
  subs: [
    { name: "", logo: "", url: "" },
    { name: "", logo: "", url: "" },
    { name: "", logo: "", url: "" },
    { name: "", logo: "", url: "" },
  ],
};

const CONTACT_EMAIL = "be.a.baller.official@gmail.com";

// スポンサー枠を描画
function sponsorSlot(sp, kind, no) {
  const el = document.createElement("a");
  el.className = `sp-slot sp-${kind}`;
  if (sp.name) {
    el.href = sp.url || "#sponsors";
    if (sp.url) { el.target = "_blank"; el.rel = "noopener"; }
    el.innerHTML = sp.logo
      ? `<img src="${sp.logo}" alt="${sp.name}">`
      : `<strong class="sp-name">${sp.name}</strong>`;
    el.setAttribute("aria-label", sp.name);
  } else {
    el.href = "#contact";
    el.classList.add("sp-open");
    el.dataset.topic = "スポンサーについて";
    el.innerHTML = kind === "main"
      ? `<span class="sp-ph">YOUR LOGO HERE</span><span class="sp-txt">スポンサー募集中</span><span class="sp-go">お問い合わせ →</span>`
      : `<span class="sp-no">${String(no).padStart(2, "0")}</span><span class="sp-ph">YOUR LOGO</span><span class="sp-txt">スポンサー募集中</span>`;
  }
  return el;
}
document.getElementById("sponsor-main").append(sponsorSlot(SPONSORS.main, "main"));
SPONSORS.subs.forEach((sp, i) =>
  document.getElementById("sponsor-subs").append(sponsorSlot(sp, "sub", i + 1))
);

// 「スポンサーのご相談」などからフォームへ飛んだら、種類を自動で選択
const form = document.getElementById("contact-form");
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-topic]");
  if (a) form.elements.topic.value = a.dataset.topic;
});

// お問い合わせフォーム → メールアプリを開く
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();
  const err = form.querySelector(".form-error");
  if (!name || !email || !message) { err.hidden = false; return; }
  err.hidden = true;
  const subject = `【${form.elements.topic.value}】${name}様より`;
  const body = `お名前：${name}\nメールアドレス：${email}\nお問い合わせの種類：${form.elements.topic.value}\n\n${message}\n`;
  location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

// メールアドレスをコピー
document.querySelectorAll(".copy-btn").forEach((btn) =>
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      btn.textContent = "コピーしました ✓";
    } catch {
      btn.textContent = btn.dataset.copy;
    }
    setTimeout(() => (btn.textContent = "アドレスをコピー"), 2000);
  })
);

// data-link 属性の付いたリンクに LINKS を反映
document.querySelectorAll("[data-link]").forEach((a) => {
  const url = LINKS[a.dataset.link];
  if (url) {
    a.href = url;
  } else {
    a.classList.add("soon");
    a.removeAttribute("target");
    a.setAttribute("aria-disabled", "true");
    const go = a.querySelector(".go");
    if (go) go.textContent = "COMING SOON";
    a.addEventListener("click", (e) => e.preventDefault());
  }
});

// スマホメニュー
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
  toggle.textContent = open ? "✕" : "☰";
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "☰";
  })
);

// サムネをクリックでその場で再生
document.querySelectorAll(".yt-lite").forEach((btn) => {
  btn.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${btn.dataset.id}?autoplay=1&rel=0`;
    iframe.title = btn.getAttribute("aria-label") || "YouTube";
    iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    btn.replaceWith(iframe);
  });
});

// Nihon Tengus 再生リストの ← → ボタン
document.querySelectorAll(".series").forEach((series) => {
  const track = series.querySelector(".series-track");
  const step = () => track.querySelector(".vid").offsetWidth + 20;
  series.querySelector(".prev").addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  series.querySelector(".next").addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
});

// スクロールで表示
if (document.documentElement.classList.contains("fx") && "IntersectionObserver" in window) {
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

// 立体感: ヒーローの奥行き（マウスで層がずれる）と、カードの 3D チルト。マウス操作のときだけ
if (document.documentElement.classList.contains("fx") && matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const hero = document.querySelector(".pf");
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    hero.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  });
  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--px", 0);
    hero.style.setProperty("--py", 0);
  });

  document.querySelectorAll(".wo-card, .goods, .coach-visual, .sns a").forEach((el) => {
    el.classList.add("tilt");
    const max = el.offsetWidth > 600 ? 3 : 7; // 大きいものほど控えめに傾ける
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--ry", `${((x - 0.5) * max * 2).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${((0.5 - y) * max * 2).toFixed(2)}deg`);
      el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    });
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
