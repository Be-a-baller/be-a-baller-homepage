/* ============================================
   ★ ストア設定
   storeUrl: オンラインストア（BASE / STORES / Shopify など）のトップURL
   各商品の url を入れるとその商品ページへ、空なら storeUrl へ飛びます
   どちらも空のあいだは「COMING SOON」表示になり、購入できません
   policy: 送料・サイズ交換の案内（FAQ に表示）。空のあいだは「販売開始時にご案内します」
   ※ 外部のECサイトに飛ばす形なら、特定商取引法に基づく表示はECサイト側で行います。
     このサイト内で直接販売（決済・メール注文など）する場合は、このサイトに表示が必要です
   ※ 販売を始めたら goods.html の「ご購入について」の文面も合わせて書き換えてください
   ============================================ */
const STORE = {
  storeUrl: "",
  policy: {
    shipping: "",
    exchange: "",
  },
};

/* ============================================
   ★ 商品リスト（価格・寸法・素材は仮。決まったら書き換えてください）
   id: 商品ページのURL（goods.html#item-◯◯）に使う英数字
   art: イラストの種類（tee / longtee / hoodie / socks / shorts / cap / towel）
   print: Tシャツの胸のデザイン（logo / court）
   photo: 実物の写真を使う場合は "images/xxx.jpg" を入れるとイラストの代わりに表示
   chart: 実寸サイズ表（cm・平置き）。サイズ診断と3Dフィッティングはこの数字で計算します
     トップス  length 着丈 / width 身幅 / shoulder 肩幅 / sleeve 袖丈
     ショーツ  waist ウエスト（ゴムの対応範囲）/ hip ヒップ / thigh わたり幅 / inseam 股下 / length 総丈
     ソックス  foot 対応サイズ / キャップ head 頭まわり / タオル width 幅・length 長さ
   spec: 素材・生地。scales は 1〜5（thick 厚さ / stretch 伸び / sheer 透け / silhouette シルエット）
   pair: 「合わせて着たい」に出す商品の id
   wearers: 着用例（実際に着た人の身長・体重・サイズ）。入れると「サイズ感」に表示
     例 { name: "ハレルヤ", height: 178, weight: 72, size: "L", note: "肩まわりに少しゆとり" }
   ============================================ */
const PRODUCTS = [
  {
    id: "logo-tee",
    name: "Be a baller ロゴTシャツ",
    cat: "tops", art: "tee", print: "logo", price: 4950, badge: "NEW",
    colors: [
      { name: "ホワイト", hex: "#F7F5F0" },
      { name: "ブラック", hex: "#1D1D1B" },
      { name: "グリーン", hex: "#03491F" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    chart: {
      S: { length: 66, width: 50, shoulder: 44, sleeve: 19 },
      M: { length: 69, width: 53, shoulder: 47, sleeve: 20 },
      L: { length: 72, width: 56, shoulder: 50, sleeve: 21 },
      XL: { length: 75, width: 59, shoulder: 53, sleeve: 22 },
      XXL: { length: 77, width: 62, shoulder: 56, sleeve: 23 },
    },
    spec: {
      material: "綿 100%",
      fabric: "6.2オンスの天竺。しっかりした厚みで、首まわりがヨレにくい生地",
      scales: { thick: 4, stretch: 2, sheer: 2, silhouette: 3 },
      care: ["洗濯機OK（裏返してネットに入れる）", "乾燥機は使わない", "プリントに直接アイロンをあてない"],
    },
    desc: "胸に手書きの「Be a baller.」。練習にも普段着にも使えるベーシックな一枚。",
    pair: ["shorts", "socks"], wearers: [],
    url: "", photo: "",
  },
  {
    id: "court-tee",
    name: "コートイラストTシャツ",
    cat: "tops", art: "tee", print: "court", price: 5500, badge: "NEW",
    colors: [
      { name: "ホワイト", hex: "#F7F5F0" },
      { name: "クリーム", hex: "#EFE3C8" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    chart: {
      S: { length: 66, width: 50, shoulder: 44, sleeve: 19 },
      M: { length: 69, width: 53, shoulder: 47, sleeve: 20 },
      L: { length: 72, width: 56, shoulder: 50, sleeve: 21 },
      XL: { length: 75, width: 59, shoulder: 53, sleeve: 22 },
      XXL: { length: 77, width: 62, shoulder: 56, sleeve: 23 },
    },
    spec: {
      material: "綿 100%",
      fabric: "6.2オンスの天竺。イラストはフルカラーのプリント",
      scales: { thick: 4, stretch: 2, sheer: 2, silhouette: 3 },
      care: ["洗濯機OK（裏返してネットに入れる）", "乾燥機は使わない", "プリントに直接アイロンをあてない"],
    },
    desc: "ブルーのコートをドリブルで駆けるイラストを胸にプリント。",
    pair: ["shorts", "cap"], wearers: [],
    url: "", photo: "",
  },
  {
    id: "long-tee",
    name: "ロングスリーブTシャツ",
    cat: "tops", art: "longtee", print: "logo", price: 6600,
    colors: [
      { name: "ブラック", hex: "#1D1D1B" },
      { name: "ホワイト", hex: "#F7F5F0" },
    ],
    sizes: ["S", "M", "L", "XL"],
    chart: {
      S: { length: 66, width: 50, shoulder: 44, sleeve: 58 },
      M: { length: 69, width: 53, shoulder: 47, sleeve: 60 },
      L: { length: 72, width: 56, shoulder: 50, sleeve: 62 },
      XL: { length: 75, width: 59, shoulder: 53, sleeve: 63 },
    },
    spec: {
      material: "綿 100%",
      fabric: "5.6オンスの天竺。袖口はリブで、まくっても落ちにくい",
      scales: { thick: 3, stretch: 2, sheer: 2, silhouette: 3 },
      care: ["洗濯機OK（裏返してネットに入れる）", "乾燥機は使わない"],
    },
    desc: "肌寒い季節のシューティングにも。袖まで動きやすいシルエット。",
    pair: ["shorts", "socks"], wearers: [],
    url: "", photo: "",
  },
  {
    id: "hoodie",
    name: "Be a baller フーディー",
    cat: "tops", art: "hoodie", print: "logo", price: 9900,
    colors: [
      { name: "グリーン", hex: "#03491F" },
      { name: "グレー", hex: "#B9B8B2" },
      { name: "クリーム", hex: "#EFE3C8" },
    ],
    sizes: ["M", "L", "XL"],
    chart: {
      M: { length: 68, width: 60, shoulder: 55, sleeve: 56 },
      L: { length: 71, width: 63, shoulder: 58, sleeve: 57 },
      XL: { length: 74, width: 66, shoulder: 61, sleeve: 58 },
    },
    spec: {
      material: "綿 80%・ポリエステル 20%",
      fabric: "10オンスの裏起毛。肩が落ちるゆったりめのシルエット",
      scales: { thick: 5, stretch: 3, sheer: 1, silhouette: 4 },
      care: ["洗濯機OK（裏返してネットに入れる）", "乾燥機は使わない", "毛玉を防ぐため、ほかの衣類と分けて洗う"],
    },
    desc: "裏起毛のあたたかいフーディー。移動中やウォームアップに。",
    pair: ["shorts", "cap"], wearers: [],
    url: "", photo: "",
  },
  {
    id: "socks",
    name: "バスケットボールソックス",
    cat: "socks", art: "socks", price: 1980, badge: "NEW",
    colors: [
      { name: "ホワイト", hex: "#F7F5F0", accent: "#03491F" },
      { name: "ブラック", hex: "#1D1D1B", accent: "#EFE3C8" },
    ],
    sizes: ["25-27cm", "27-29cm"],
    chart: { "25-27cm": { foot: [25, 27] }, "27-29cm": { foot: [27, 29] } },
    spec: {
      material: "綿・ポリエステル・ポリウレタン",
      fabric: "足裏が厚手のパイル編み。着地の衝撃をやわらげる",
      scales: { thick: 5, stretch: 4 },
      care: ["洗濯機OK", "乾燥機は使わない"],
    },
    desc: "クッション性のある厚手のソックス。ラインがアクセント。",
    pair: ["shorts", "logo-tee"], wearers: [],
    url: "", photo: "",
  },
  {
    id: "socks-3",
    name: "ソックス 3足セット",
    cat: "socks", art: "socks", price: 4980, set: 3,
    colors: [
      { name: "ミックス", hex: "#F7F5F0", accent: "#03491F" },
    ],
    sizes: ["25-27cm", "27-29cm"],
    chart: { "25-27cm": { foot: [25, 27] }, "27-29cm": { foot: [27, 29] } },
    spec: {
      material: "綿・ポリエステル・ポリウレタン",
      fabric: "足裏が厚手のパイル編み。ホワイト・ブラック・グリーンの3足",
      scales: { thick: 5, stretch: 4 },
      care: ["洗濯機OK", "乾燥機は使わない"],
    },
    desc: "練習用にまとめてそろえたい方に。お得な3足セット。",
    pair: ["shorts", "towel"], wearers: [],
    url: "", photo: "",
  },
  {
    id: "shorts",
    name: "プラクティスショーツ",
    cat: "tops", art: "shorts", price: 5940,
    colors: [
      { name: "ブラック", hex: "#1D1D1B" },
      { name: "ホワイト", hex: "#F7F5F0" },
    ],
    sizes: ["S", "M", "L", "XL"],
    chart: {
      S: { waist: [66, 78], hip: 52, thigh: 31, inseam: 20, length: 45 },
      M: { waist: [72, 84], hip: 55, thigh: 32.5, inseam: 21, length: 47 },
      L: { waist: [78, 90], hip: 58, thigh: 34, inseam: 22, length: 49 },
      XL: { waist: [84, 96], hip: 61, thigh: 35.5, inseam: 23, length: 51 },
    },
    spec: {
      material: "ポリエステル 100%",
      fabric: "軽いメッシュ生地。ウエストはゴム＋ひもで調整できる",
      scales: { thick: 2, stretch: 3, sheer: 2, silhouette: 4 },
      care: ["洗濯機OK（ネットに入れる）", "乾燥機は使わない"],
    },
    desc: "サイドラインが効いた練習用ハーフパンツ。軽くて乾きやすい素材。",
    pair: ["logo-tee", "socks"], wearers: [],
    url: "", photo: "",
  },
  {
    id: "cap",
    name: "Be a baller キャップ",
    cat: "goods", art: "cap", price: 4400,
    colors: [
      { name: "グリーン", hex: "#03491F" },
      { name: "ブラック", hex: "#1D1D1B" },
      { name: "クリーム", hex: "#EFE3C8" },
    ],
    sizes: ["FREE"],
    chart: { FREE: { head: [56, 60] } },
    spec: {
      material: "綿 100%",
      fabric: "張りのあるツイル生地。フロントに刺繍ロゴ",
      scales: { thick: 3 },
      care: ["手洗い（形をととのえて陰干し）"],
    },
    desc: "フロントに刺繍ロゴ。サイズ調整できるストラップバック。",
    pair: ["hoodie", "court-tee"], wearers: [],
    url: "", photo: "",
  },
  {
    id: "towel",
    name: "スポーツタオル",
    cat: "goods", art: "towel", price: 2200,
    colors: [
      { name: "ホワイト", hex: "#F7F5F0" },
      { name: "グリーン", hex: "#03491F" },
    ],
    sizes: ["FREE"],
    chart: { FREE: { width: 40, length: 110 } },
    spec: {
      material: "綿 100%",
      fabric: "吸水性の高いパイル。首にかけやすい細長いサイズ",
      scales: { thick: 3 },
      care: ["洗濯機OK", "柔軟剤は控えめに（吸水性が落ちるため）"],
    },
    desc: "ベンチにも練習バッグにも。吸水性の高いコットンタオル。",
    pair: ["socks", "shorts"], wearers: [],
    url: "", photo: "",
  },
];

/* ---------- イラスト（SVG） ---------- */
const INK = "#141414";
const isDark = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 < 128;
};
const shade = (hex) => (isDark(hex) ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)");

function chestPrint(print, color, y) {
  const ink = isDark(color) ? "#F0E3C8" : INK;
  if (print === "court") {
    return `<g transform="translate(88 ${y - 22})">
      <rect x="0" y="0" width="64" height="30" rx="2" fill="#2A6FA8" stroke="${INK}" stroke-width="3"/>
      <image href="images/goods-2.jpg" x="1.5" y="1.5" width="61" height="27" preserveAspectRatio="xMidYMid slice"/>
      <text x="32" y="44" text-anchor="middle" font-family="Permanent Marker, cursive" font-size="9" fill="${ink}">Be a baller.</text>
    </g>`;
  }
  return `<text x="120" y="${y}" text-anchor="middle" font-family="Permanent Marker, cursive" font-size="12" fill="${ink}" transform="rotate(-6 120 ${y})">Be a baller.</text>
    <path d="M100 ${y + 7} Q120 ${y + 4} 140 ${y + 1}" stroke="${ink}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
}

const ART = {
  tee: (c, p) => `
    <path d="M70 40 L96 30 Q120 46 144 30 L170 40 L206 76 L184 100 L166 88 L166 210 Q120 216 74 210 L74 88 L56 100 L34 76 Z" fill="${c.hex}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M74 88 L74 210 Q96 213 110 213" stroke="${shade(c.hex)}" stroke-width="10" fill="none"/>
    <path d="M96 30 Q120 52 144 30" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>
    ${chestPrint(p.print, c.hex, 108)}`,
  longtee: (c, p) => `
    <path d="M70 40 L96 30 Q120 46 144 30 L170 40 Q186 52 192 74 L214 168 L190 176 L168 104 L166 210 Q120 216 74 210 L72 104 L50 176 L26 168 L48 74 Q54 52 70 40 Z" fill="${c.hex}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M28 160 L50 168 M212 160 L190 168" stroke="${INK}" stroke-width="3"/>
    <path d="M96 30 Q120 52 144 30" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>
    ${chestPrint(p.print, c.hex, 108)}`,
  hoodie: (c, p) => `
    <path d="M66 46 L92 34 L148 34 L174 46 Q190 58 194 80 L214 172 L190 180 L170 110 L168 212 Q120 218 72 212 L70 110 L50 180 L26 172 L46 80 Q50 58 66 46 Z" fill="${c.hex}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M86 46 Q82 10 120 8 Q158 10 154 46 Q120 66 86 46 Z" fill="${c.hex}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M100 44 Q120 22 140 44 Q120 56 100 44 Z" fill="${isDark(c.hex) ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.18)"}" stroke="${INK}" stroke-width="3"/>
    <path d="M112 54 L110 92 M128 54 L130 92" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <path d="M86 150 L154 150 L164 196 L76 196 Z" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    ${chestPrint("logo", c.hex, 124)}`,
  socks: (c, p) => {
    const sock = (dx, rot, col) => `
      <g transform="translate(${dx} 0) rotate(${rot} 120 120)">
        <path d="M94 22 L146 22 L146 136 Q146 152 160 160 L192 178 Q212 190 204 208 Q196 224 174 218 L110 198 Q88 190 90 168 Z" fill="${col.hex}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
        <rect x="94" y="22" width="52" height="16" fill="${shade(col.hex)}"/>
        <path d="M94 38 L146 38" stroke="${INK}" stroke-width="3"/>
        <rect x="94" y="48" width="52" height="7" fill="${col.accent}"/>
        <rect x="94" y="61" width="52" height="7" fill="${col.accent}"/>
        <text x="120" y="112" text-anchor="middle" font-family="Archivo Black, sans-serif" font-size="13" fill="${col.accent}">BAB</text>
      </g>`;
    if (p.set) {
      const mix = [c, { hex: "#1D1D1B", accent: "#EFE3C8" }, { hex: "#03491F", accent: "#F7F5F0" }];
      return sock(-46, -8, mix[1]) + sock(46, 8, mix[2]) + sock(0, 0, mix[0]);
    }
    return sock(0, 0, c);
  },
  cap: (c) => {
    const ink = isDark(c.hex) ? "#F0E3C8" : INK;
    return `
    <path d="M52 150 Q50 72 120 66 Q190 72 188 150 Z" fill="${c.hex}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M120 66 Q100 100 96 150 M120 66 Q140 100 144 150" stroke="${INK}" stroke-width="2.5" fill="none" opacity="0.7"/>
    <circle cx="120" cy="66" r="6" fill="${c.hex}" stroke="${INK}" stroke-width="3"/>
    <path d="M40 150 Q120 132 200 150 Q214 170 120 178 Q26 170 40 150 Z" fill="${c.hex}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M52 156 Q120 146 188 156" stroke="${shade(c.hex)}" stroke-width="6" fill="none"/>
    <text x="120" y="122" text-anchor="middle" font-family="Permanent Marker, cursive" font-size="12" fill="${ink}" transform="rotate(-5 120 122)">Be a baller.</text>`;
  },
  shorts: (c) => {
    const line = isDark(c.hex) ? "#F0E3C8" : "#03491F";
    return `
    <path d="M62 46 L178 46 L198 190 L134 198 L120 112 L106 198 L42 190 Z" fill="${c.hex}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M62 46 L178 46 L180 64 L60 64 Z" fill="${shade(c.hex)}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M114 64 L112 84 M126 64 L128 84" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M64 70 L50 186 M176 70 L190 186" stroke="${line}" stroke-width="6"/>
    <text x="80" y="176" text-anchor="middle" font-family="Archivo Black, sans-serif" font-size="11" fill="${line}" transform="rotate(-4 80 176)">BAB</text>`;
  },
  towel: (c) => {
    const ink = isDark(c.hex) ? "#F0E3C8" : INK;
    const fringe = Array.from({ length: 13 }, (_, k) => `M${66 + k * 9} 204 L${66 + k * 9} 214`).join(" ");
    return `
    <rect x="58" y="30" width="124" height="174" rx="6" fill="${c.hex}" stroke="${INK}" stroke-width="4"/>
    <rect x="58" y="30" width="124" height="22" rx="6" fill="${shade(c.hex)}" stroke="${INK}" stroke-width="3.5"/>
    <rect x="58" y="166" width="124" height="8" fill="#03491F" opacity="${isDark(c.hex) ? 0 : 1}"/>
    <rect x="58" y="180" width="124" height="8" fill="#03491F" opacity="${isDark(c.hex) ? 0 : 1}"/>
    <text x="120" y="118" text-anchor="middle" font-family="Permanent Marker, cursive" font-size="17" fill="${ink}" transform="rotate(-6 120 118)">Be a baller.</text>
    <path d="${fringe}" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`;
  },
};

const artSvg = (p, c) =>
  p.photo
    ? `<img src="${p.photo}" alt="${p.name}" loading="lazy">`
    : `<svg viewBox="0 0 240 240" role="img" aria-label="${p.name}（${c.name}）のイラスト">${ART[p.art](c, p)}</svg>`;

/* ---------- 保存（このブラウザの中だけ。送信はしない） ---------- */
const store = {
  get(k, fb) {
    try {
      const v = JSON.parse(localStorage.getItem(k));
      return v ?? fb;
    } catch {
      return fb;
    }
  },
  set(k, v) {
    try {
      v == null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  },
};

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const anim = (el, kf, opt) => (!reduce && window.Motion && el ? Motion.animate(el, kf, opt) : null);
const EASE_OUT = [0.23, 1, 0.32, 1];

const yen = (n) => `¥${n.toLocaleString("ja-JP")}`;
const byId = (id) => PRODUCTS.findIndex((p) => p.id === id);
const canBuy = (p) => !!(p.url || STORE.storeUrl);
const kindOf = (p) => Fit.kindOf(p);

let profile = store.get("bab-mysize", null); // null = まだ診断していない
let favs = new Set(store.get("bab-favs", []));
const own = store.get("bab-own", {}); // 手持ちの服の寸法 { tops: {...}, shorts: {...} }
const states = PRODUCTS.map((p) => ({ color: 0, size: p.sizes.length === 1 ? p.sizes[0] : null }));
const prof = () => profile || Fit.DEFAULT;
const evalOf = (i) => Fit.evaluate(PRODUCTS[i], prof());

/* ============================================
   MY SIZE（身長・体重などの入力フォーム）
   ページのフォームとドロワー内のフォームは同じ内容を共有する
   ============================================ */
const seg = (name, items) =>
  `<div class="seg">${items
    .map(([v, label, sub]) => `<label><input type="radio" name="${name}" value="${v}"><span>${label}${sub ? `<small>${sub}</small>` : ""}</span></label>`)
    .join("")}</div>`;

function profileForm(px) {
  const feet = ['<option value="">わからない（身長から推定）</option>'];
  for (let v = 22; v <= 30; v += 0.5) feet.push(`<option value="${v}">${v.toFixed(1)}cm</option>`);
  return `
    <div class="ms-field">
      <label class="ms-lbl" for="${px}-height">身長</label>
      <div class="ms-range">
        <input type="range" id="${px}-height" name="height" min="140" max="200" step="1">
        <span class="ms-num"><input type="number" name="height-n" min="140" max="200" step="1" inputmode="numeric" aria-label="身長（cm）"><i>cm</i></span>
      </div>
    </div>
    <div class="ms-field">
      <label class="ms-lbl" for="${px}-weight">体重</label>
      <div class="ms-range">
        <input type="range" id="${px}-weight" name="weight" min="35" max="130" step="1">
        <span class="ms-num"><input type="number" name="weight-n" min="35" max="130" step="1" inputmode="numeric" aria-label="体重（kg）"><i>kg</i></span>
      </div>
    </div>
    <fieldset class="ms-field">
      <legend class="ms-lbl">体型の基準<small>寸法の推定に使います</small></legend>
      ${seg("base", [["male", "男性"], ["female", "女性"]])}
    </fieldset>
    <fieldset class="ms-field">
      <legend class="ms-lbl">体つき</legend>
      ${seg("build", [["slim", "細め"], ["normal", "ふつう"], ["solid", "がっしり"]])}
    </fieldset>
    <fieldset class="ms-field">
      <legend class="ms-lbl">好きな着方</legend>
      ${seg("pref", [["just", "ジャスト", "体に沿う"], ["regular", "レギュラー", "ほどよいゆとり"], ["loose", "ゆったり", "大きめに着る"]])}
    </fieldset>
    <div class="ms-field">
      <label class="ms-lbl" for="${px}-foot">足のサイズ<small>任意・ソックス用</small></label>
      <select id="${px}-foot" name="foot" class="ms-select">${feet.join("")}</select>
    </div>`;
}

const forms = [];
function fillForm(f, v) {
  f.height.value = f["height-n"].value = v.height;
  f.weight.value = f["weight-n"].value = v.weight;
  ["base", "build", "pref"].forEach((n) => (f.querySelector(`[name="${n}"][value="${v[n]}"]`).checked = true));
  f.foot.value = v.foot;
}
function readForm(f) {
  const num = (n, min, max, fb) => {
    const v = +f[n].value;
    return Number.isFinite(v) && v >= min && v <= max ? v : fb;
  };
  return {
    height: num("height", 140, 200, 172),
    weight: num("weight", 35, 130, 65),
    base: f.querySelector('[name="base"]:checked').value,
    build: f.querySelector('[name="build"]:checked').value,
    pref: f.querySelector('[name="pref"]:checked').value,
    foot: f.foot.value,
  };
}
function bindForm(f, px) {
  f.innerHTML += profileForm(px);
  fillForm(f, prof());
  forms.push(f);
  // スライダーと数字入力を連動
  ["height", "weight"].forEach((n) => {
    f[n].addEventListener("input", () => (f[`${n}-n`].value = f[n].value));
    f[`${n}-n`].addEventListener("change", () => {
      const r = f[n];
      const v = Math.min(+r.max, Math.max(+r.min, Math.round(+f[`${n}-n`].value) || +r.value));
      r.value = f[`${n}-n`].value = v;
      f.dispatchEvent(new Event("input"));
    });
  });
  f.addEventListener("input", (e) => {
    if (e.target && e.target.name && e.target.name.endsWith("-n")) return; // 打ち込み途中は change で反映
    setProfile(readForm(f), f);
  });
  f.addEventListener("submit", (e) => e.preventDefault());
}

let raf = 0;
function setProfile(v, from) {
  profile = v;
  store.set("bab-mysize", v);
  forms.forEach((f) => f !== from && fillForm(f, v));
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    refreshCards();
    refreshSummary();
    if (pd.open) renderDrawer(false);
  });
}

/* ---------- ページの「サイズ診断」セクション ---------- */
const fitForm = document.getElementById("fit-form");
bindForm(fitForm, "fit");
const fitStatus = document.getElementById("fit-status");
function refreshSummary() {
  document.querySelectorAll("[data-ms-summary]").forEach((el) => {
    const v = prof();
    el.textContent = `${v.height}cm・${v.weight}kg・${{ slim: "細め", normal: "ふつう", solid: "がっしり" }[v.build]}・${Fit.PREF_NAME[v.pref]}`;
  });
  document.body.classList.toggle("has-mysize", !!profile);
}
document.getElementById("fit-go").addEventListener("click", () => {
  setProfile(readForm(fitForm));
  fitStatus.textContent = "各アイテムに、あなたのおすすめサイズを表示しました。";
  document.getElementById("items").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
});
document.getElementById("fit-reset").addEventListener("click", () => {
  profile = null;
  store.set("bab-mysize", null);
  forms.forEach((f) => fillForm(f, Fit.DEFAULT));
  fitStatus.textContent = "入力内容を消去しました。";
  refreshCards();
  refreshSummary();
});

/* ============================================
   商品カード
   ============================================ */
const grid = document.getElementById("products");
const cards = [];

const heart = (on) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.4-9.3-9.2C1.6 8.2 3.6 4.8 7 4.5c2-.2 3.6.9 5 2.6 1.4-1.7 3-2.8 5-2.6 3.4.3 5.4 3.7 4.3 6.8-1.8 4.8-9.3 9.2-9.3 9.2z" fill="${on ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`;

function toggleFav(i) {
  const id = PRODUCTS[i].id;
  favs.has(id) ? favs.delete(id) : favs.add(id);
  store.set("bab-favs", [...favs]);
  document.querySelectorAll(`[data-fav="${i}"]`).forEach((b) => {
    const on = favs.has(id);
    b.setAttribute("aria-pressed", on);
    b.innerHTML = heart(on);
    anim(b, { scale: [0.8, 1] }, { duration: 0.25, ease: EASE_OUT });
  });
  updateCount();
}

function setColor(i, ci) {
  states[i].color = ci;
  const p = PRODUCTS[i];
  const c = p.colors[ci];
  const card = cards[i];
  card.querySelectorAll(".swatch").forEach((b, k) => {
    b.classList.toggle("is-on", k === ci);
    b.setAttribute("aria-pressed", k === ci);
  });
  card.querySelector(".p-color-name").textContent = c.name;
  card.querySelector(".p-art svg, .p-art img").outerHTML = artSvg(p, c);
}
function setSize(i, s) {
  states[i].size = s;
  cards[i].querySelectorAll(".size").forEach((b) => {
    b.classList.toggle("is-on", b.dataset.s === s);
    b.setAttribute("aria-pressed", b.dataset.s === s);
  });
  cards[i].querySelector(".p-msg").textContent = "";
}

function buy(i, msgEl) {
  const p = PRODUCTS[i];
  const url = p.url || STORE.storeUrl;
  if (!url) return;
  if (!states[i].size) {
    msgEl.textContent = "サイズを選んでください";
    return;
  }
  window.open(url, "_blank", "noopener");
}

PRODUCTS.forEach((p, i) => {
  const kind = kindOf(p);
  const card = document.createElement("article");
  card.className = "p-card reveal";
  card.dataset.cat = p.cat;
  card.id = `item-${p.id}`;
  card.innerHTML = `
    <div class="p-art-wrap">
      <button type="button" class="p-art" data-open="${i}" aria-label="${p.name}の詳細とサイズ感を見る">
        ${p.badge ? `<span class="p-badge">${p.badge}</span>` : ""}${artSvg(p, p.colors[0])}
        ${kind === "tops" || kind === "shorts" ? '<span class="p-3d">3D FIT</span>' : ""}
      </button>
      <button type="button" class="fav" data-fav="${i}" aria-pressed="${favs.has(p.id)}" aria-label="お気に入り">${heart(favs.has(p.id))}</button>
    </div>
    <div class="p-body">
      <h3 class="p-name">${p.name}</h3>
      <p class="p-price">${yen(p.price)}<small>（税込${canBuy(p) ? "" : "・予定価格"}）</small></p>
      <p class="p-desc">${p.desc}</p>
      <div class="p-opt">
        <span class="p-lbl">COLOR<em class="p-color-name">${p.colors[0].name}</em></span>
        <div class="swatches">${p.colors
          .map((c, ci) => `<button type="button" class="swatch${ci === 0 ? " is-on" : ""}" style="--c:${c.hex}" data-i="${ci}" aria-label="${c.name}" aria-pressed="${ci === 0}"></button>`)
          .join("")}</div>
      </div>
      <div class="p-opt">
        <span class="p-lbl">SIZE</span>
        <div class="sizes">${p.sizes
          .map((s) => `<button type="button" class="size${p.sizes.length === 1 ? " is-on" : ""}" data-s="${s}" aria-pressed="${p.sizes.length === 1}">${s}</button>`)
          .join("")}</div>
        ${kind === "none" || kind === "free" ? "" : '<p class="p-rec" aria-live="polite"></p>'}
      </div>
      <p class="p-msg" role="status"></p>
      <div class="p-actions">
        <button type="button" class="btn p-more" data-open="${i}">${kind === "tops" || kind === "shorts" ? "サイズ感を3Dで見る" : "サイズ・詳細を見る"}</button>
        ${canBuy(p)
          ? '<button type="button" class="btn primary p-buy">購入する →</button>'
          : '<button type="button" class="btn primary p-buy" disabled>COMING SOON</button>'}
      </div>
    </div>`;

  card.querySelectorAll(".swatch").forEach((sw) => sw.addEventListener("click", () => setColor(i, +sw.dataset.i)));
  card.querySelectorAll(".size").forEach((sb) => sb.addEventListener("click", () => setSize(i, sb.dataset.s)));
  card.querySelector(".p-buy").addEventListener("click", () => buy(i, card.querySelector(".p-msg")));
  card.querySelectorAll("[data-open]").forEach((b) => b.addEventListener("click", () => openDrawer(i)));
  card.querySelector(".fav").addEventListener("click", () => toggleFav(i));
  grid.append(card);
  cards.push(card);
});

/* おすすめサイズの表示（MY SIZE を入れると全商品に出る） */
function refreshCards() {
  PRODUCTS.forEach((p, i) => {
    const rec = cards[i].querySelector(".p-rec");
    if (!rec) return;
    cards[i].querySelectorAll(".size").forEach((b) => b.classList.remove("is-rec"));
    if (!profile) {
      rec.innerHTML = '<a href="#fit" class="p-rec-cta">身長・体重から、おすすめサイズを表示 →</a>';
      return;
    }
    const r = evalOf(i);
    const best = r.sizes.find((s) => s.size === r.best);
    const prev = rec.dataset.best;
    rec.dataset.best = r.best;
    rec.innerHTML = `<span class="rec-chip">MY SIZE</span>あなたには <b>${r.best}</b><span class="rec-word">${best.word === best.lengthShort ? best.word : `${best.word}・${best.lengthShort}`}</span>`;
    cards[i].querySelector(`.size[data-s="${r.best}"]`).classList.add("is-rec");
    if (prev !== r.best) anim(rec.querySelector("b"), { scale: [0.7, 1], opacity: [0, 1] }, { duration: 0.3, ease: EASE_OUT });
  });
}

/* ---------- カテゴリ絞り込み ---------- */
const count = document.getElementById("item-count");
const favCount = document.getElementById("fav-count");
let filter = "all";
function applyFilter() {
  cards.forEach((card, i) => {
    card.hidden = filter === "fav" ? !favs.has(PRODUCTS[i].id) : filter !== "all" && card.dataset.cat !== filter;
  });
  updateCount();
}
function updateCount() {
  if (filter === "fav") cards.forEach((card, i) => (card.hidden = !favs.has(PRODUCTS[i].id)));
  const n = cards.filter((c) => !c.hidden).length;
  count.textContent = `${n} items`;
  favCount.textContent = favs.size ? favs.size : "";
  document.getElementById("fav-empty").hidden = !(filter === "fav" && n === 0);
}
document.querySelectorAll(".filter").forEach((f) =>
  f.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((b) => {
      b.classList.toggle("is-active", b === f);
      b.setAttribute("aria-selected", b === f);
    });
    filter = f.dataset.cat;
    applyFilter();
  })
);

/* ============================================
   商品の詳細（ドロワー）
   PC は右から、スマホは下からせり上がるパネル。3D・サイズ感・サイズ表・素材をまとめて見られる
   ============================================ */
const pd = {
  el: document.getElementById("pd"),
  panel: document.querySelector(".pd-panel"),
  backdrop: document.querySelector(".pd-backdrop"),
  open: false,
  i: 0,
  tab: "fit",
  compare: null,
  viewer: null,
  lastFocus: null,
};
const $ = (s) => pd.el.querySelector(s);

/* three.js は重いので、ページが落ち着いてから読み込む */
let threeReady = null;
function loadThree() {
  if (threeReady) return threeReady;
  threeReady = new Promise((res) => {
    if (window.THREE) return res();
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js";
    s.onload = res;
    s.onerror = res;
    document.head.append(s);
  });
  return threeReady;
}
(window.requestIdleCallback || ((f) => setTimeout(f, 1500)))(() => loadThree());

const COLS = {
  tops: [["length", "着丈"], ["width", "身幅"], ["shoulder", "肩幅"], ["sleeve", "袖丈"]],
  shorts: [["waist", "ウエスト"], ["hip", "ヒップ"], ["thigh", "わたり幅"], ["inseam", "股下"], ["length", "総丈"]],
  socks: [["foot", "対応サイズ"]],
  free: [["head", "頭まわり"]],
  none: [["width", "幅"], ["length", "長さ"]],
};
const OWN = {
  tops: [["width", "身幅"], ["length", "着丈"], ["sleeve", "袖丈"]],
  shorts: [["length", "総丈"], ["thigh", "わたり幅"], ["hip", "ヒップ"]],
};
const SCALE = {
  thick: ["生地の厚さ", "薄手", "厚手"],
  stretch: ["伸びやすさ", "伸びにくい", "よく伸びる"],
  sheer: ["透け感", "透けにくい", "透けやすい"],
  silhouette: ["シルエット", "タイト", "ゆったり"],
};
const cell = (v) => (Array.isArray(v) ? `${v[0]}〜${v[1]}` : v);

function openDrawer(i, tab) {
  pd.i = i;
  pd.compare = null;
  const kind = kindOf(PRODUCTS[i]);
  pd.tab = tab || (kind === "none" ? "chart" : "fit");
  const st = states[i];
  if (!st.size) st.size = kind === "none" || kind === "free" ? PRODUCTS[i].sizes[0] : evalOf(i).best;
  if (!pd.open) {
    pd.lastFocus = document.activeElement;
    pd.el.hidden = false;
    pd.open = true;
    document.documentElement.classList.add("pd-lock");
    const mobile = matchMedia("(max-width: 899px)").matches;
    anim(pd.backdrop, { opacity: [0, 1] }, { duration: 0.25 });
    anim(pd.panel, { transform: mobile ? ["translateY(100%)", "translateY(0%)"] : ["translateX(100%)", "translateX(0%)"] }, { duration: 0.42, ease: EASE_OUT });
  }
  history.replaceState(null, "", `#item-${PRODUCTS[i].id}`);
  renderDrawer(true);
  $(".pd-scroll").scrollTop = 0;
  pd.panel.focus({ preventScroll: true });
}

async function closeDrawer() {
  if (!pd.open) return;
  pd.open = false;
  const mobile = matchMedia("(max-width: 899px)").matches;
  const a = anim(pd.panel, { transform: mobile ? ["translateY(0%)", "translateY(100%)"] : ["translateX(0%)", "translateX(100%)"] }, { duration: 0.24, ease: [0.4, 0, 1, 1] });
  anim(pd.backdrop, { opacity: [1, 0] }, { duration: 0.24 });
  if (a) await a;
  pd.el.hidden = true;
  document.documentElement.classList.remove("pd-lock");
  history.replaceState(null, "", location.pathname + location.search);
  if (pd.lastFocus) pd.lastFocus.focus({ preventScroll: true });
}
pd.el.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", closeDrawer));
pd.el.addEventListener("keydown", (e) => {
  if (e.key === "Escape") return closeDrawer();
  if (e.key !== "Tab") return;
  const f = [...pd.panel.querySelectorAll('button:not([disabled]), [href], input, select, [tabindex="0"]')].filter((el) => el.offsetParent);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

/* ---------- ドロワーの中身 ---------- */
const drawerForm = $("#pd-form");
bindForm(drawerForm, "pd");

function sizeButtons(p, cur, rec, attr) {
  return p.sizes
    .map((s) => `<button type="button" class="size${s === cur ? " is-on" : ""}${s === rec ? " is-rec" : ""}" ${attr}="${s}" aria-pressed="${s === cur}">${s}</button>`)
    .join("");
}

function renderDrawer(full) {
  const i = pd.i;
  const p = PRODUCTS[i];
  const st = states[i];
  const kind = kindOf(p);
  const c = p.colors[st.color];
  const r = evalOf(i);
  const has3d = kind === "tops" || kind === "shorts";

  if (full) {
    $(".pd-cat").textContent = { tops: "APPAREL", socks: "SOCKS", goods: "ACCESSORIES" }[p.cat];
    $("#pd-title").textContent = p.name;
    $(".pd-price").innerHTML = `${yen(p.price)}<small>（税込${canBuy(p) ? "" : "・予定価格"}）</small>`;
    $(".pd-tab[data-tab='fit']").hidden = kind === "none";
    $(".pd-foot-swatches").innerHTML = p.colors
      .map((cc, ci) => `<button type="button" class="swatch${ci === st.color ? " is-on" : ""}" style="--c:${cc.hex}" data-ci="${ci}" aria-label="${cc.name}" aria-pressed="${ci === st.color}"></button>`)
      .join("");
    const fav = $(".pd-foot .fav");
    fav.dataset.fav = i;
    fav.setAttribute("aria-pressed", favs.has(p.id));
    fav.innerHTML = heart(favs.has(p.id));
    const buyBtn = $(".pd-buy");
    buyBtn.disabled = !canBuy(p);
    buyBtn.textContent = canBuy(p) ? "購入する →" : "COMING SOON";
  }
  $(".pd-color-name").textContent = c.name;
  $(".pd-foot-swatches").querySelectorAll(".swatch").forEach((b, k) => {
    b.classList.toggle("is-on", k === st.color);
    b.setAttribute("aria-pressed", k === st.color);
  });

  // ステージ（3D or イラスト）
  const stage = $(".pd-stage");
  stage.classList.toggle("is-3d", has3d);
  $(".pd-art").innerHTML = has3d ? "" : artSvg(p, c);
  $(".pd-wear").hidden = !has3d && p.sizes.length === 1;
  $("#pd-sizes").innerHTML = sizeButtons(p, st.size, r.sizes.length ? r.best : null, "data-wear");
  $(".pd-cmp-row").hidden = !has3d;
  $("#pd-cmp").innerHTML =
    `<button type="button" class="size${!pd.compare ? " is-on" : ""}" data-cmp="" aria-pressed="${!pd.compare}">なし</button>` +
    p.sizes
      .filter((s) => s !== st.size)
      .map((s) => `<button type="button" class="size${s === pd.compare ? " is-on" : ""}" data-cmp="${s}" aria-pressed="${s === pd.compare}">${s}</button>`)
      .join("");
  if (has3d) show3d(full);

  // タブ
  pd.el.querySelectorAll(".pd-tab").forEach((t) => {
    const on = t.dataset.tab === pd.tab;
    t.classList.toggle("is-on", on);
    t.setAttribute("aria-selected", on);
    t.tabIndex = on ? 0 : -1;
  });
  pd.el.querySelectorAll(".pd-pane").forEach((pn) => (pn.hidden = pn.dataset.pane !== pd.tab));
  renderFit(p, r, kind);
  renderChart(p, r, kind);
  if (full) renderSpec(p);
}

function show3d(full) {
  const p = PRODUCTS[pd.i];
  const st = states[pd.i];
  const v = prof();
  const cap = $(".fit3d-cap");
  cap.textContent = `${profile ? "あなたの体型" : "仮の体型"}（${v.height}cm・${v.weight}kg）で ${st.size} を着用${pd.compare ? ` ／ 右は ${pd.compare}` : ""}`;
  const tags = $(".fit3d-tags");
  tags.hidden = !pd.compare;
  tags.innerHTML = pd.compare ? `<span>${st.size}<small>選択中</small></span><span>${pd.compare}<small>比較</small></span>` : "";
  const host = $(".fit3d");
  loadThree().then(() => {
    if (!pd.open) return;
    if (!pd.viewer) pd.viewer = window.Fit3D && Fit3D.create(host);
    if (!pd.viewer) {
      // 3D が使えない環境はイラストで
      $(".pd-stage").classList.remove("is-3d");
      $(".pd-art").innerHTML = artSvg(p, p.colors[st.color]);
      return;
    }
    host.classList.add("is-ready");
    const kind = kindOf(p);
    pd.viewer.canvas.setAttribute("aria-label", `${cap.textContent}した3Dのイメージ。左右の矢印キーで回転できます`);
    pd.viewer.show({
      profile: v,
      item: { kind, art: p.art, print: p.print, color: p.colors[st.color].hex, dims: p.chart[st.size] },
      compare: pd.compare ? { dims: p.chart[pd.compare] } : null,
    });
    if (full) pd.viewer.intro();
  });
}

function meter(row) {
  return `
    <div class="mr${row.warn ? " is-warn" : ""}">
      <div class="mr-top"><span class="mr-lbl">${row.label}</span><span class="mr-word">${row.word}</span></div>
      <div class="meter"><span class="meter-dot" style="left:${(row.pos * 100).toFixed(1)}%"></span></div>
      <div class="meter-scale">${row.scale.map((s) => `<span>${s}</span>`).join("")}</div>
      <p class="mr-val">${row.value}</p>
    </div>`;
}

function renderFit(p, r, kind) {
  const st = states[pd.i];
  const pane = $(".pd-pane[data-pane='fit']");
  const out = $("#pd-fit");
  $(".pd-ms-note").hidden = !!profile;
  if (kind === "none") return;
  if (kind === "free") {
    const d = p.chart.FREE.head;
    out.innerHTML = `
      <div class="rec-card"><p class="rec-k">サイズ</p><p class="rec-size">FREE</p>
      <p class="rec-why">頭まわり ${d[0]}〜${d[1]}cm に対応。後ろのストラップで調整できます。大人の頭まわりはおよそ 54〜60cm なので、多くの方がかぶれるサイズです。</p></div>
      <p class="pane-note">はじめて測るときは、メジャーをおでこの真ん中と耳の上を通るように一周させてください。</p>`;
    pane.classList.add("is-simple");
    return;
  }
  pane.classList.remove("is-simple");
  const cur = r.sizes.find((s) => s.size === st.size) || r.sizes[0];
  const rows = r.sizes
    .map(
      (s) => `<tr class="${s.size === r.best ? "is-rec" : ""}${s.size === st.size ? " is-cur" : ""}">
        <th scope="row">${s.size}${s.size === r.best ? '<span class="tag">おすすめ</span>' : ""}</th>
        <td>${s.word}</td><td>${s.lengthShort}</td>
        <td>${s.size === st.size ? '<span class="now">表示中</span>' : `<button type="button" class="mini" data-wear="${s.size}">${kind === "socks" ? "選ぶ" : "着せる"}</button>`}</td>
      </tr>`
    )
    .join("");
  const wear = p.wearers && p.wearers.length
    ? `<h3 class="pane-h">着用例</h3><ul class="wearers">${p.wearers
        .map((w) => `<li><b>${w.name}</b><span>${w.height}cm・${w.weight}kg</span><em>${w.size} を着用</em>${w.note ? `<p>${w.note}</p>` : ""}</li>`)
        .join("")}</ul>`
    : "";
  out.innerHTML = `
    <div class="rec-card">
      <p class="rec-k">${profile ? "あなたへのおすすめ" : "仮の体型でのおすすめ"}</p>
      <p class="rec-size">${r.best}</p>
      <p class="rec-why">${r.reason}</p>
      ${st.size !== r.best ? `<button type="button" class="btn rec-try" data-wear="${r.best}">${r.best} ${kind === "socks" ? "を選ぶ" : "を3Dで着てみる"}</button>` : ""}
    </div>
    <h3 class="pane-h">${st.size} を${kind === "socks" ? "選んだ" : "着た"}とき</h3>
    <div class="meters">${cur.rows.map(meter).join("")}</div>
    <h3 class="pane-h">全サイズの着用感</h3>
    <div class="tbl-wrap"><table class="all-fit">
      <thead><tr><th scope="col">サイズ</th><th scope="col">${kind === "socks" ? "足" : kind === "shorts" ? "ウエスト" : "胸まわり"}</th><th scope="col">${kind === "socks" ? "" : "丈"}</th><th scope="col"><span class="sr">操作</span></th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    ${wear}
    <p class="pane-note">身長・体重からの推定と、実寸サイズ表（予定）をもとにした目安です。${kind === "tops" ? "迷ったら、ゆったり着たいなら大きいほう、すっきり着たいなら小さいほうがおすすめです。" : ""}</p>`;
}

const HOW = {
  tops: `<svg viewBox="0 0 240 240" aria-hidden="true">
    <path d="M70 40 L96 30 Q120 46 144 30 L170 40 L206 76 L184 100 L166 88 L166 210 Q120 216 74 210 L74 88 L56 100 L34 76 Z" fill="#fff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M96 30 Q120 52 144 30" stroke="${INK}" stroke-width="3" fill="none"/>
    <g stroke="#03491F" stroke-width="2.5" fill="none" marker-start="url(#ah)" marker-end="url(#ah)">
      <path d="M150 36 L150 208"/><path d="M78 98 L162 98"/><path d="M72 30 L168 30" stroke-dasharray="4 3"/><path d="M174 46 L198 82"/>
    </g>
    <g font-family="Noto Sans JP, sans-serif" font-size="11" font-weight="700" fill="#03491F">
      <text x="156" y="160">着丈</text><text x="100" y="116">身幅</text><text x="104" y="22">肩幅</text><text x="196" y="58">袖丈</text>
    </g></svg>`,
  shorts: `<svg viewBox="0 0 240 240" aria-hidden="true">
    <path d="M62 46 L178 46 L198 190 L134 198 L120 112 L106 198 L42 190 Z" fill="#fff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <g stroke="#03491F" stroke-width="2.5" fill="none" marker-start="url(#ah)" marker-end="url(#ah)">
      <path d="M66 56 L174 56"/><path d="M210 46 L210 192"/><path d="M53 122 L117 122"/><path d="M124 118 L134 192"/>
    </g>
    <g font-family="Noto Sans JP, sans-serif" font-size="11" font-weight="700" fill="#03491F">
      <text x="98" y="78">ウエスト</text><text x="214" y="124">総丈</text><text x="58" y="140">わたり幅</text><text x="138" y="160">股下</text>
    </g></svg>`,
};
const ARROW = `<svg width="0" height="0" style="position:absolute"><defs><marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 1 L9 5 L0 9 Z" fill="#03491F"/></marker></defs></svg>`;

function renderChart(p, r, kind) {
  const st = states[pd.i];
  const cols = COLS[kind];
  const mine = OWN[kind] ? own[kind] || {} : {};
  const hasOwn = OWN[kind] && Object.values(mine).some((v) => v > 0);
  const near = hasOwn ? Fit.closest(p, mine) : null;
  const diff = (s, k) => {
    const v = p.chart[s][k];
    if (!hasOwn || !(mine[k] > 0) || Array.isArray(v)) return "";
    const d = Math.round((v - mine[k]) * 10) / 10;
    return `<small class="${Math.abs(d) <= 1 ? "is-near" : ""}">${d === 0 ? "±0" : d > 0 ? `+${d}` : `−${Math.abs(d)}`}</small>`;
  };
  const rows = p.sizes
    .map(
      (s) => `<tr class="${r.sizes.length && s === r.best ? "is-rec" : ""}${s === st.size ? " is-cur" : ""}${s === near ? " is-near" : ""}">
        <th scope="row">${s}${r.sizes.length && s === r.best ? '<span class="tag">おすすめ</span>' : ""}${s === near ? '<span class="tag tag-near">近い</span>' : ""}</th>
        ${cols.map(([k]) => `<td>${cell(p.chart[s][k])}${diff(s, k)}</td>`).join("")}
      </tr>`
    )
    .join("");
  const ownRow = hasOwn
    ? `<tr class="own-row"><th scope="row">あなたの服</th>${cols.map(([k]) => `<td>${mine[k] > 0 ? mine[k] : "—"}</td>`).join("")}</tr>`
    : "";
  $("#pd-chart").innerHTML = `
    <div class="tbl-wrap"><table class="size-tbl">
      <caption>実寸サイズ表（cm）<span>※ 予定の寸法です</span></caption>
      <thead><tr><th scope="col">サイズ</th>${cols.map(([, l]) => `<th scope="col">${l}</th>`).join("")}</tr></thead>
      <tbody>${rows}${ownRow}</tbody>
    </table></div>
    <p class="pane-note">${kind === "socks" ? "対応する足のサイズ（cm）です。" : kind === "free" ? "後ろのストラップで調整できる範囲です。" : "平らに置いて測った寸法です。製品によって 1〜2cm ほどの誤差があります。"}</p>
    ${HOW[kind] ? `<figure class="how">${ARROW}${HOW[kind]}<figcaption>測り方</figcaption></figure>` : ""}
    ${OWN[kind] ? `
    <div class="own">
      <h3 class="pane-h">手持ちの服と比べる</h3>
      <p class="own-lead">サイズ感が気に入っている服を平らに置いて測ってみてください。いちばん近いサイズがわかります。</p>
      <form class="own-form" novalidate>
        ${OWN[kind].map(([k, l]) => `<label><span>${l}</span><input type="number" inputmode="decimal" min="0" max="200" step="0.5" name="${k}" value="${mine[k] || ""}" placeholder="—"><i>cm</i></label>`).join("")}
      </form>
      <p class="own-result" role="status">${near ? `あなたの服にいちばん近いのは <b>${near}</b> です。` : ""}</p>
    </div>` : ""}`;
  const of = $("#pd-chart .own-form");
  if (of) {
    of.addEventListener("change", () => {
      const v = {};
      OWN[kind].forEach(([k]) => {
        const n = parseFloat(of[k].value);
        if (n > 0) v[k] = n;
      });
      own[kind] = v;
      store.set("bab-own", own);
      renderChart(p, evalOf(pd.i), kind);
      const res = $("#pd-chart .own-result b");
      if (res) anim(res, { scale: [0.8, 1] }, { duration: 0.25, ease: EASE_OUT });
    });
  }
}

function renderSpec(p) {
  const s = p.spec;
  const scales = Object.entries(s.scales || {})
    .map(([k, v]) => {
      const [label, lo, hi] = SCALE[k];
      return `<div class="sc">
        <span class="sc-lbl">${label}</span>
        <div class="sc-bar" role="img" aria-label="${label}：5段階中${v}（${lo}〜${hi}）">${[1, 2, 3, 4, 5].map((n) => `<i class="${n === v ? "is-on" : ""}"></i>`).join("")}</div>
        <div class="sc-ends"><span>${lo}</span><span>${hi}</span></div>
      </div>`;
    })
    .join("");
  const pairs = (p.pair || [])
    .map(byId)
    .filter((j) => j >= 0)
    .map((j) => `<button type="button" class="pair" data-goto="${j}"><span class="pair-art">${artSvg(PRODUCTS[j], PRODUCTS[j].colors[0])}</span><span class="pair-name">${PRODUCTS[j].name}</span><span class="pair-price">${yen(PRODUCTS[j].price)}</span></button>`)
    .join("");
  $("#pd-spec").innerHTML = `
    <dl class="spec"><dt>素材</dt><dd>${s.material}</dd><dt>生地</dt><dd>${s.fabric}</dd></dl>
    <div class="scales">${scales}</div>
    <h3 class="pane-h">お手入れ</h3>
    <ul class="care">${s.care.map((c) => `<li>${c}</li>`).join("")}</ul>
    ${pairs ? `<h3 class="pane-h">合わせて着たい</h3><div class="pairs">${pairs}</div>` : ""}
    <p class="pane-note">素材・生地は予定のもので、変更になる場合があります。</p>`;
}

/* ---------- ドロワー内の操作 ---------- */
pd.el.addEventListener("click", (e) => {
  const t = e.target.closest("button");
  if (!t || !pd.el.contains(t)) return;
  const i = pd.i;
  if (t.dataset.wear) {
    states[i].size = t.dataset.wear;
    if (pd.compare === t.dataset.wear) pd.compare = null;
    setSize(i, t.dataset.wear);
    renderDrawer(false);
  } else if ("cmp" in t.dataset) {
    pd.compare = t.dataset.cmp || null;
    renderDrawer(false);
  } else if (t.dataset.ci) {
    setColor(i, +t.dataset.ci);
    renderDrawer(false);
  } else if (t.dataset.view) {
    pd.viewer && pd.viewer.view(t.dataset.view);
    pd.el.querySelectorAll("[data-view]").forEach((b) => b.setAttribute("aria-pressed", b === t));
  } else if (t.dataset.frame) {
    pd.viewer && pd.viewer.frame(t.dataset.frame);
    pd.el.querySelectorAll("[data-frame]").forEach((b) => b.setAttribute("aria-pressed", b === t));
  } else if (t.dataset.goto) {
    openDrawer(+t.dataset.goto);
  } else if (t.dataset.fav) {
    toggleFav(i);
  } else if (t.classList.contains("pd-tab")) {
    pd.tab = t.dataset.tab;
    renderDrawer(false);
    anim($(`.pd-pane[data-pane='${pd.tab}']`), { opacity: [0, 1], transform: ["translateY(6px)", "translateY(0)"] }, { duration: 0.22, ease: EASE_OUT });
  } else if (t.classList.contains("pd-ms-toggle")) {
    const open = t.getAttribute("aria-expanded") !== "true";
    t.setAttribute("aria-expanded", open);
    drawerForm.hidden = !open;
    if (open) anim(drawerForm, { opacity: [0, 1] }, { duration: 0.2 });
  } else if (t.classList.contains("pd-buy")) {
    buy(i, $(".pd-msg"));
  }
});
// タブは矢印キーでも切り替え
$(".pd-tabs").addEventListener("keydown", (e) => {
  if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
  const tabs = [...pd.el.querySelectorAll(".pd-tab")].filter((t) => !t.hidden);
  const k = tabs.findIndex((t) => t.dataset.tab === pd.tab);
  const next = tabs[(k + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
  pd.tab = next.dataset.tab;
  renderDrawer(false);
  next.focus();
});

/* URL に #item-◯◯ があればその商品を開く（SNS などで商品を直接紹介できる） */
const fromHash = () => {
  const m = location.hash.match(/^#item-(.+)$/);
  const i = m ? byId(m[1]) : -1;
  if (i >= 0) openDrawer(i);
};
window.addEventListener("hashchange", fromHash);

/* ---------- FAQ（送料・交換） ---------- */
document.querySelectorAll("[data-policy]").forEach((el) => {
  const v = STORE.policy[el.dataset.policy];
  if (v) el.textContent = v;
});

refreshCards();
refreshSummary();
updateCount();
fromHash();

/* ---------- 共通（メニュー・スクロール表示・年） ---------- */
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
  toggle.textContent = open ? "✕" : "☰";
});

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

document.getElementById("year").textContent = new Date().getFullYear();
