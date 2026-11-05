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

/* ============================================
   ★ お問い合わせフォームの送信先
   Web3Forms（https://web3forms.com）のアクセスキーを入れると、
   送信内容が be.a.baller.official@gmail.com に直接届く
   空のままだと、送信ボタンでメールアプリが開く仮の動作になる
   ============================================ */
const WEB3FORMS_KEY = "a686375c-c0ff-4eaf-8555-fecc408c4bd2";
const FORM_ENDPOINT = "https://api.web3forms.com/submit";
// メールアドレスはスパム対策のためページには直接書かない
const CONTACT_EMAIL = ["be.a.baller.official", "gmail.com"].join("@");

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
    el.dataset.topic = "sponsor";
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

// お問い合わせの種類に応じて、ワークアウトの詳細欄を出し分け
const form = document.getElementById("contact-form");
const WORKOUT_TOPICS = ["personal", "team-offense", "team-defense", "event"];
const woFields = form.querySelector(".wo-fields");
function syncTopic() {
  const t = form.elements.topic.value;
  woFields.hidden = !WORKOUT_TOPICS.includes(t);
  woFields.querySelectorAll(".for-team").forEach((el) => (el.hidden = !t.startsWith("team-")));
}
form.elements.topic.addEventListener("change", syncTopic);

// 「スポンサーのご相談」やワークアウトの各ページ（?topic=personal など）から来たら、種類を自動で選択
const setTopic = (key) => {
  if ([...form.elements.topic.options].some((o) => o.value === key)) form.elements.topic.value = key;
  syncTopic();
};
setTopic(new URLSearchParams(location.search).get("topic"));
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-topic]");
  if (a) setTopic(a.dataset.topic);
});

// 送信内容を「項目名：値」の一覧にする（空欄の項目は省く）
function formEntries() {
  const f = form.elements;
  const topic = f.topic.selectedOptions[0].textContent;
  const rows = [["お問い合わせの種類", topic], ["お名前", f.name.value], ["メールアドレス", f.email.value]];
  if (!woFields.hidden) {
    rows.push(["チーム名・団体名", f.team.closest("label").hidden ? "" : f.team.value]);
    rows.push(["参加人数", f.people.value], ["開催希望地", f.place.value]);
    rows.push(["希望のプラン", f.plan.closest("label").hidden ? "" : f.plan.value || "未定・相談したい"]);
    rows.push(["希望の日時", f.date.value]);
  }
  rows.push(["お問い合わせ内容", f.message.value]);
  return { topic, rows: rows.map(([k, v]) => [k, v.trim()]).filter(([, v]) => v) };
}

const err = form.querySelector(".form-error");
const showError = (msg) => { err.textContent = msg; err.hidden = false; };
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = form.elements;
  if (!f.name.value.trim() || !f.email.value.trim() || !f.message.value.trim()) {
    return showError("お名前・メールアドレス・お問い合わせ内容を入力してください。");
  }
  if (!f.email.checkValidity()) return showError("メールアドレスの形式を確認してください。");
  err.hidden = true;

  const { topic, rows } = formEntries();
  const subject = `【${topic}】${f.name.value.trim()}様より`;
  const done = () => {
    form.hidden = true;
    const box = document.getElementById("form-done");
    box.hidden = false;
    box.focus();
  };
  if (f._gotcha.value) return done(); // 見えない欄に入力がある＝ボットなので送らない

  // アクセスキーが未設定のあいだは、メールアプリを開く
  if (!WEB3FORMS_KEY) {
    const body = rows.map(([k, v]) => `${k}：${v}`).join("\n") + "\n";
    location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "送信中…";
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject,
        from_name: "BE A BALLER ホームページ",
        replyto: f.email.value.trim(), // Gmail で「返信」するとお問い合わせした人に届く
        ...Object.fromEntries(rows),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || String(data.success) !== "true") throw new Error(data.message || res.status);
    form.reset();
    done();
  } catch {
    showError("送信できませんでした。時間をおいてもう一度お試しいただくか、SNSのDMからご連絡ください。");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "送信する →";
  }
});

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
