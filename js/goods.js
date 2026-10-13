/* ============================================
   ★ ストア設定
   storeUrl: オンラインストア（BASE / STORES / Shopify など）のトップURL
   各商品の url を入れるとその商品ページへ、空なら storeUrl へ飛びます
   どちらも空のときは、商品名・カラー・サイズ入りのお問い合わせメールが開きます
   ============================================ */
const STORE = {
  storeUrl: "",
  email: "be.a.baller.official@gmail.com",
};

/* ============================================
   ★ 商品リスト（価格は仮。決まったら書き換えてください）
   art: イラストの種類（tee / longtee / hoodie / socks / shorts / cap / towel）
   print: Tシャツの胸のデザイン（logo / court）
   photo: 実物の写真を使う場合は "images/xxx.jpg" を入れるとイラストの代わりに表示
   ============================================ */
const PRODUCTS = [
  {
    name: "Be a baller ロゴTシャツ",
    cat: "tops", art: "tee", print: "logo", price: 4950, badge: "NEW",
    colors: [
      { name: "ホワイト", hex: "#F7F5F0" },
      { name: "ブラック", hex: "#1D1D1B" },
      { name: "グリーン", hex: "#03491F" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    desc: "胸に手書きの「Be a baller.」。練習にも普段着にも使えるベーシックな一枚。",
    url: "", photo: "",
  },
  {
    name: "コートイラストTシャツ",
    cat: "tops", art: "tee", print: "court", price: 5500, badge: "NEW",
    colors: [
      { name: "ホワイト", hex: "#F7F5F0" },
      { name: "クリーム", hex: "#EFE3C8" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    desc: "ブルーのコートをドリブルで駆けるイラストを胸にプリント。",
    url: "", photo: "",
  },
  {
    name: "ロングスリーブTシャツ",
    cat: "tops", art: "longtee", print: "logo", price: 6600,
    colors: [
      { name: "ブラック", hex: "#1D1D1B" },
      { name: "ホワイト", hex: "#F7F5F0" },
    ],
    sizes: ["S", "M", "L", "XL"],
    desc: "肌寒い季節のシューティングにも。袖まで動きやすいシルエット。",
    url: "", photo: "",
  },
  {
    name: "Be a baller フーディー",
    cat: "tops", art: "hoodie", print: "logo", price: 9900,
    colors: [
      { name: "グリーン", hex: "#03491F" },
      { name: "グレー", hex: "#B9B8B2" },
      { name: "クリーム", hex: "#EFE3C8" },
    ],
    sizes: ["M", "L", "XL"],
    desc: "裏起毛のあたたかいフーディー。移動中やウォームアップに。",
    url: "", photo: "",
  },
  {
    name: "バスケットボールソックス",
    cat: "socks", art: "socks", price: 1980, badge: "NEW",
    colors: [
      { name: "ホワイト", hex: "#F7F5F0", accent: "#03491F" },
      { name: "ブラック", hex: "#1D1D1B", accent: "#EFE3C8" },
    ],
    sizes: ["25-27cm", "27-29cm"],
    desc: "クッション性のある厚手のソックス。ラインがアクセント。",
    url: "", photo: "",
  },
  {
    name: "ソックス 3足セット",
    cat: "socks", art: "socks", price: 4980, set: 3,
    colors: [
      { name: "ミックス", hex: "#F7F5F0", accent: "#03491F" },
    ],
    sizes: ["25-27cm", "27-29cm"],
    desc: "練習用にまとめてそろえたい方に。お得な3足セット。",
    url: "", photo: "",
  },
  {
    name: "プラクティスショーツ",
    cat: "tops", art: "shorts", price: 5940,
    colors: [
      { name: "ブラック", hex: "#1D1D1B" },
      { name: "ホワイト", hex: "#F7F5F0" },
    ],
    sizes: ["S", "M", "L", "XL"],
    desc: "サイドラインが効いた練習用ハーフパンツ。軽くて乾きやすい素材。",
    url: "", photo: "",
  },
  {
    name: "Be a baller キャップ",
    cat: "goods", art: "cap", price: 4400,
    colors: [
      { name: "グリーン", hex: "#03491F" },
      { name: "ブラック", hex: "#1D1D1B" },
      { name: "クリーム", hex: "#EFE3C8" },
    ],
    sizes: ["FREE"],
    desc: "フロントに刺繍ロゴ。サイズ調整できるストラップバック。",
    url: "", photo: "",
  },
  {
    name: "スポーツタオル",
    cat: "goods", art: "towel", price: 2200,
    colors: [
      { name: "ホワイト", hex: "#F7F5F0" },
      { name: "グリーン", hex: "#03491F" },
    ],
    sizes: ["FREE"],
    desc: "ベンチにも練習バッグにも。吸水性の高いコットンタオル。",
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

/* ---------- 商品カード ---------- */
const yen = (n) => `¥${n.toLocaleString("ja-JP")}`;
const grid = document.getElementById("products");

PRODUCTS.forEach((p, i) => {
  const state = { color: 0, size: null };
  const card = document.createElement("article");
  card.className = "p-card reveal";
  card.dataset.cat = p.cat;
  card.innerHTML = `
    <div class="p-art">${p.badge ? `<span class="p-badge">${p.badge}</span>` : ""}<span class="p-no">${String(i + 1).padStart(2, "0")}</span>${artSvg(p, p.colors[0])}</div>
    <div class="p-body">
      <h3 class="p-name">${p.name}</h3>
      <p class="p-price">${yen(p.price)}<small>（税込）</small></p>
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
      </div>
      <p class="p-msg" role="status"></p>
      <button type="button" class="btn primary p-buy">${p.url || STORE.storeUrl ? "購入する →" : "購入・お問い合わせ →"}</button>
    </div>`;
  if (p.sizes.length === 1) state.size = p.sizes[0];

  const art = card.querySelector(".p-art");
  const msg = card.querySelector(".p-msg");

  card.querySelectorAll(".swatch").forEach((sw) =>
    sw.addEventListener("click", () => {
      state.color = +sw.dataset.i;
      const c = p.colors[state.color];
      card.querySelectorAll(".swatch").forEach((b) => {
        b.classList.toggle("is-on", b === sw);
        b.setAttribute("aria-pressed", b === sw);
      });
      card.querySelector(".p-color-name").textContent = c.name;
      art.querySelector("svg, img").outerHTML = artSvg(p, c);
    })
  );
  card.querySelectorAll(".size").forEach((sb) =>
    sb.addEventListener("click", () => {
      state.size = sb.dataset.s;
      card.querySelectorAll(".size").forEach((b) => {
        b.classList.toggle("is-on", b === sb);
        b.setAttribute("aria-pressed", b === sb);
      });
      msg.textContent = "";
    })
  );
  card.querySelector(".p-buy").addEventListener("click", () => {
    if (!state.size) {
      msg.textContent = "サイズを選んでください";
      return;
    }
    const c = p.colors[state.color];
    const url = p.url || STORE.storeUrl;
    if (url) {
      window.open(url, "_blank", "noopener");
      return;
    }
    const subject = `【グッズ購入希望】${p.name}`;
    const body = `商品：${p.name}\nカラー：${c.name}\nサイズ：${state.size}\n数量：1\n価格：${yen(p.price)}（税込）\n\nお名前：\nお届け先：\n`;
    location.href = `mailto:${STORE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  grid.append(card);
});

/* ---------- カテゴリ絞り込み ---------- */
const count = document.getElementById("item-count");
const updateCount = () => {
  const n = [...grid.children].filter((c) => !c.hidden).length;
  count.textContent = `${n} items`;
};
document.querySelectorAll(".filter").forEach((f) =>
  f.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((b) => {
      b.classList.toggle("is-active", b === f);
      b.setAttribute("aria-selected", b === f);
    });
    [...grid.children].forEach((card) => {
      card.hidden = f.dataset.cat !== "all" && card.dataset.cat !== f.dataset.cat;
    });
    updateCount();
  })
);
updateCount();

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
