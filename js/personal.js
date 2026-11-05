/* ============================================
   ★ 料金設定 — 金額が変わったらここを書き換えるだけでOK
   price: 2時間・1人あたりの料金（people 人以上のとき）
   farFee: 東京都・神奈川県外での開催の追加料金
   ============================================ */
const PLAN = {
  tiers: [
    { people: 1, price: 11000 },
    { people: 2, price: 9000 },
    { people: 3, price: 8000 },
    { people: 4, price: 7000, orMore: true },
  ],
  farFee: 10000,
  maxPeople: 20,
};

const yen = (n) => `¥${n.toLocaleString("ja-JP")}`;
const tierFor = (n) => [...PLAN.tiers].reverse().find((t) => n >= t.people);

let people = 1;

// 料金表
const list = document.getElementById("tiers");
const base = PLAN.tiers[0].price;
// 枠を押すとその人数になる（「4人以上」は4人）。下の ＋− ボタンとも連動
PLAN.tiers.forEach((t) => {
  const li = document.createElement("button");
  li.type = "button";
  li.className = "tier";
  li.setAttribute("role", "radio");
  li.addEventListener("click", () => { people = t.people; render(); });
  li.innerHTML = `
    <span class="tier-n">${t.people}${t.orMore ? "+" : ""}<small>${t.orMore ? "人以上" : "人"}</small></span>
    <span class="tier-price">${yen(t.price)}<small>/人</small></span>
    <span class="tier-save">${t.price < base ? `1人あたり ${yen(base - t.price)} お得` : ""}</span>`;
  list.append(li);
});

// 料金シミュレーター
const out = document.getElementById("people");
const minus = document.getElementById("minus");
const plus = document.getElementById("plus");
const far = document.getElementById("far");

function render() {
  const t = tierFor(people);
  out.textContent = people;
  minus.disabled = people <= 1;
  plus.disabled = people >= PLAN.maxPeople;
  document.getElementById("per").textContent = yen(t.price);
  document.getElementById("total").textContent = yen(t.price * people + (far.checked ? PLAN.farFee : 0));
  [...list.children].forEach((li, i) => {
    li.classList.toggle("is-on", PLAN.tiers[i] === t);
    li.setAttribute("aria-checked", PLAN.tiers[i] === t);
  });
}
minus.addEventListener("click", () => { people = Math.max(1, people - 1); render(); });
plus.addEventListener("click", () => { people = Math.min(PLAN.maxPeople, people + 1); render(); });
far.addEventListener("change", render);
render();

document.getElementById("year").textContent = new Date().getFullYear();
