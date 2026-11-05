/* ============================================
   ★ チームオフェンス・チームディフェンス共通の料金設定
   ここを書き換えると、両方のページのプラン表に反映されます
   sessions: 回数 / hours: 1回の時間 / note: 時間の内訳
   ============================================ */
const TEAM_PLANS = [
  { key: "single", en: "SINGLE", short: "単発", name: "単発プラン", price: 55000, sessions: 1, hours: 3, note: "" },
  { key: "half", en: "6 MONTHS", short: "半年", name: "半年プラン", price: 300000, sessions: 6, hours: 4, note: "月1回・午前2時間＋午後2時間" },
  { key: "year", en: "12 MONTHS", short: "1年", name: "1年プラン", price: 550000, sessions: 12, hours: 4, note: "月1回・午前2時間＋午後2時間", best: true },
];

const yen = (n) => `¥${n.toLocaleString("ja-JP")}`;
// 割り切れない金額は100円単位に丸めて「約」を付ける
const about = (n) => (Number.isInteger(n) ? yen(n) : `約${yen(Math.round(n / 100) * 100)}`);
const totalHours = (p) => p.sessions * p.hours;

// 上の料金カードと、下の切り替えボタン。どちらを押しても同じプランが選ばれる
const cards = document.getElementById("plans");
const seg = document.getElementById("seg");
const radio = (el, p) => {
  el.type = "button";
  el.setAttribute("role", "radio");
  el.addEventListener("click", () => select(p.key));
  return el;
};

TEAM_PLANS.forEach((p) => {
  const card = radio(document.createElement("button"), p);
  card.className = "tier";
  card.dataset.key = p.key;
  card.innerHTML = `
    ${p.best ? '<span class="plan-badge">1時間あたり最安</span>' : ""}
    <span class="plan-en">${p.en}</span>
    <span class="tier-n">${p.sessions}<small>回</small></span>
    <span class="plan-name">${p.name}</span>
    <span class="tier-price">${yen(p.price)}</span>
    <span class="tier-save">1時間あたり ${about(p.price / totalHours(p))}</span>`;
  cards.append(card);

  const b = radio(document.createElement("button"), p);
  b.dataset.key = p.key;
  b.textContent = p.short;
  seg.append(b);
});

function select(key) {
  const p = TEAM_PLANS.find((x) => x.key === key);
  [...cards.children, ...seg.children].forEach((el) => {
    const on = el.dataset.key === key;
    el.classList.toggle("is-on", on && el.classList.contains("tier"));
    el.setAttribute("aria-checked", on);
  });
  document.getElementById("d-content").innerHTML =
    (p.sessions > 1 ? `全${p.sessions}回 × ${p.hours}時間` : `${p.hours}時間`) + (p.note ? `<small>${p.note}</small>` : "");
  document.getElementById("d-hours").textContent = `${totalHours(p)}時間`;
  document.getElementById("d-per").textContent = p.sessions > 1 ? about(p.price / p.sessions) : "―";
  document.getElementById("d-hour").textContent = about(p.price / totalHours(p));
  document.getElementById("d-name").textContent = p.name;
  document.getElementById("d-price").textContent = yen(p.price);
}
select(TEAM_PLANS[0].key);

document.getElementById("year").textContent = new Date().getFullYear();
