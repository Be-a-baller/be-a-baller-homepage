/* ============================================
   サイズ診断の計算（goods.js と fit3d.js で共通）
   身長・体重・体型から体の寸法（cm）を推定し、商品の実寸と比べて着用感を出す
   ※ 推定は日本人成人の平均的な体型をもとにした概算。あくまで目安です
   ============================================ */
window.Fit = (() => {
  const DEFAULT = { height: 172, weight: 65, base: "male", build: "normal", pref: "regular", foot: "" };
  const BUILD = { slim: -0.045, normal: 0, solid: 0.05 };
  const PREF_NAME = { just: "ジャスト", regular: "レギュラー", loose: "ゆったり" };
  const EASE = { just: 11, regular: 18, loose: 28 }; // 胸まわりのゆとり（cm）の好み
  const HEM = { just: 9, regular: 5, loose: 1 }; // 裾が股のラインから何cm上にくるのが好みか

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const r0 = (v) => Math.round(v);
  const signed = (v) => `${v >= 0 ? "+" : "−"}${Math.abs(r0(v))}`;

  /* ---------- 体の寸法（cm）と、体の各ラインの高さ（床から） ---------- */
  function body(p) {
    const f = p.base === "female";
    const h = p.height;
    const r = p.weight / (h / 100) ** 2 / 22; // BMI 22 を 1 とした比
    const ref = h / (f ? 158 : 171);
    const b = BUILD[p.build] || 0;
    const shoulder = h * (f ? 0.245 : 0.262) * (1 + b * 0.6);
    return {
      h, f,
      chest: (f ? 84 : 91) * r ** 0.55 * ref ** 0.35 * (1 + b),
      waist: (f ? 67 : 77) * r ** 0.95 * ref ** 0.3 * (1 + b * 1.2),
      hip: (f ? 90 : 92) * r ** 0.6 * ref ** 0.4 * (1 + b * 0.6),
      shoulder, sH: shoulder / 2,
      hps: h * 0.835, // 首の付け根（服の着丈はここから測る）
      drape: 4.5, // 肩の傾斜や胸のふくらみで、着丈が縦に短く見える分
      shoulderY: h * 0.815, chestY: h * 0.725, waistY: h * 0.59, hipY: h * 0.505,
      crotchY: h * 0.455, kneeY: h * 0.285,
      upperArm: h * 0.186, foreArm: h * 0.146,
      neckR: h * (f ? 0.031 : 0.034) * (1 + b * 0.8), headR: h * 0.06,
      bulk: r ** 0.5 * (1 + b), // 腕・脚の太さの目安
      foot: p.foot ? +p.foot : Math.round(h * (f ? 0.148 : 0.152) * 2) / 2,
      footEst: !p.foot,
      head: f ? 55 : 57,
    };
  }

  /* ---------- 商品の種類 ---------- */
  const KIND = { tee: "tops", longtee: "tops", hoodie: "tops", shorts: "shorts", socks: "socks", cap: "free", towel: "none" };
  const kindOf = (p) => KIND[p.art] || "none";

  /* ---------- トップス ---------- */
  const chestWord = (e) =>
    e < 4 ? "きつい" : e < 9 ? "ぴったり" : e < 14 ? "ジャスト" : e < 24 ? "レギュラー" : e < 34 ? "ゆったり" : "ビッグシルエット";
  function lengthWord(toCrotch) {
    if (toCrotch > 18) return "おへそが見えそうな短さ";
    if (toCrotch > 10) return "ベルトが少し見える";
    if (toCrotch > 3) return "ベルトがかくれる";
    if (toCrotch > -3) return "おしりがかくれる";
    if (toCrotch > -10) return "おしりまですっぽり（長め）";
    return "太ももまでかかる（かなり長め）";
  }
  function shoulderWord(drop) {
    if (drop < -1.5) return "肩がきゅうくつ";
    if (drop < 1.5) return "肩線がちょうど肩の位置";
    if (drop < 5) return "肩線が少し落ちる";
    return "ドロップショルダー";
  }

  function tops(B, d, prof, product) {
    const ease = 2 * d.width - B.chest;
    const hem = B.hps + B.drape - d.length;
    const toCrotch = hem - B.crotchY;
    const drop = d.shoulder / 2 - B.sH;
    const s = Math.max(drop, -2) + d.sleeve; // 肩先から袖口まで
    const long = product.art !== "tee";
    const wrist = B.upperArm + B.foreArm;

    let score = Math.abs(ease - EASE[prof.pref]) + 0.5 * Math.abs(toCrotch - HEM[prof.pref]);
    if (ease < 4) score += (4 - ease) * 3;
    if (drop < -1.5) score += (-drop - 1.5) * 4;
    if (long) score += 0.3 * Math.max(0, Math.abs(s - wrist - 2) - 3);

    let sleeveWord;
    let sleevePos;
    if (long) {
      const diff = s - wrist;
      sleeveWord = diff < -3 ? "手首より短め" : diff < 6 ? "手首がかくれるちょうどいい長さ" : "手の甲にかかる長め";
      sleevePos = clamp((diff + 8) / 20);
    } else {
      const k = s / B.upperArm;
      sleeveWord = k < 0.45 ? "二の腕の上のほう" : k < 0.75 ? "二の腕の真ん中あたり" : k < 1 ? "ひじの少し上" : k < 1.15 ? "ひじくらい" : "ひじがかくれる";
      sleevePos = clamp(k / 1.3);
    }
    const belt = B.waistY - hem;

    return {
      score,
      word: chestWord(ease),
      rows: [
        { key: "chest", label: "胸まわり", value: `ゆとり ${signed(ease)}cm`, word: chestWord(ease), pos: clamp((ease + 5) / 50),
          scale: ["きつい", "ジャスト", "レギュラー", "ゆったり"], warn: ease < 4 },
        { key: "length", label: "着丈", value: belt >= 0 ? `ベルト位置から ${r0(belt)}cm 下` : `ベルト位置より ${r0(-belt)}cm 上`,
          word: lengthWord(toCrotch), pos: clamp((belt + 5) / 40), scale: ["短め", "ふつう", "長め"], warn: toCrotch > 14 },
        { key: "shoulder", label: "肩", value: `肩線 ${signed(drop)}cm`, word: shoulderWord(drop), pos: clamp((drop + 4) / 14),
          scale: ["きゅうくつ", "ジャスト", "落ちる"], warn: drop < -1.5 },
        { key: "sleeve", label: "袖丈", value: `肩先から ${r0(s)}cm`, word: sleeveWord, pos: sleevePos, scale: ["短め", "ふつう", "長め"] },
      ],
      lengthShort: lengthWord(toCrotch),
      reason: `胸まわりのゆとりが約${r0(ease)}cmで、好みの「${PREF_NAME[prof.pref]}」に近いサイズです。着丈は${lengthWord(toCrotch)}くらい。`,
    };
  }

  /* ---------- ショーツ ---------- */
  function shorts(B, d, prof) {
    const [w0, w1] = d.waist;
    const p = (B.waist - w0) / (w1 - w0); // 0 = ゴムがゆるい側、1 = きつい側
    const target = { just: 0.65, regular: 0.5, loose: 0.3 }[prof.pref];
    const hipEase = 2 * d.hip - B.hip;
    const hem = B.waistY - 3 - d.length;
    const knee = hem - B.kneeY; // + ならひざ上
    let score = Math.abs(p - target) * 20;
    if (p < 0) score += 12 - p * 20;
    if (p > 1) score += 30 + (p - 1) * 40;
    if (hipEase < 8) score += (8 - hipEase) * 1.5;
    const waistWord = p < 0 ? "ゆるい（ひもで調整）" : p < 0.35 ? "ゆったり" : p < 0.75 ? "ちょうどいい" : p <= 1 ? "ややきつめ" : "きつい";
    const kneeWord = knee > 12 ? "短め（ひざ上かなり）" : knee > 4 ? "ひざ上" : knee > -3 ? "ひざくらい" : "ひざがかくれる";
    return {
      score,
      word: waistWord,
      rows: [
        { key: "waist", label: "ウエスト", value: `${w0}〜${w1}cm に対応（あなた: 約${r0(B.waist)}cm）`, word: waistWord,
          pos: clamp((p + 0.25) / 1.5), scale: ["ゆるい", "ちょうど", "きつい"], warn: p > 1 },
        { key: "hip", label: "ヒップ・太もも", value: `ゆとり ${signed(hipEase)}cm`, word: hipEase < 8 ? "ぴったり" : hipEase < 20 ? "ほどよいゆとり" : "ゆったり",
          pos: clamp(hipEase / 36), scale: ["ぴったり", "ふつう", "ゆったり"], warn: hipEase < 4 },
        { key: "length", label: "丈", value: knee >= 0 ? `ひざ上 ${r0(knee)}cm` : `ひざ下 ${r0(-knee)}cm`, word: kneeWord,
          pos: clamp((12 - knee) / 24), scale: ["短め", "ひざ", "長め"] },
      ],
      lengthShort: kneeWord,
      reason: `ウエスト約${r0(B.waist)}cmが、ゴムの対応範囲（${w0}〜${w1}cm）の${waistWord === "ちょうどいい" ? "真ん中あたり" : "中"}に入ります。丈は${kneeWord}。`,
    };
  }

  /* ---------- ソックス ---------- */
  function socks(B, d, prof) {
    const [a, b] = d.foot;
    const f = B.foot;
    const inside = f >= a && f <= b;
    const mid = (a + b) / 2;
    let score = inside ? Math.abs(f - mid) : 10 + Math.min(Math.abs(f - a), Math.abs(f - b)) * 4;
    if (inside && (f === a || f === b)) score += prof.pref === "loose" ? (f === b ? -0.3 : 0.3) : f === a ? -0.3 : 0.3;
    const word = inside ? "ぴったり" : f < a ? "大きめ" : "小さめ";
    return {
      score,
      word,
      rows: [{ key: "foot", label: "足のサイズ", value: `${a}〜${b}cm に対応（あなた: ${f}cm${B.footEst ? "・推定" : ""}）`, word,
        pos: clamp((f - a + 1) / (b - a + 2)), scale: [`${a}cm`, "", `${b}cm`], warn: !inside }],
      lengthShort: word,
      reason: inside
        ? `足のサイズ ${f}cm が対応範囲（${a}〜${b}cm）に入ります。`
        : `足のサイズ ${f}cm は対応範囲の外です。いちばん近いサイズを表示しています。`,
    };
  }

  /* ---------- 診断（全サイズ） ---------- */
  function evaluate(product, prof) {
    const kind = kindOf(product);
    const B = body(prof);
    if (kind === "none" || kind === "free") return { kind, body: B, sizes: [], best: product.sizes[0] };
    const fn = { tops, shorts, socks }[kind];
    const sizes = product.sizes.map((s) => ({ size: s, ...fn(B, product.chart[s], prof, product) }));
    const best = sizes.reduce((a, b) => (b.score < a.score ? b : a));
    return { kind, body: B, sizes, best: best.size, reason: best.reason };
  }

  /* 手持ちの服との比較：寸法の差の合計がいちばん小さいサイズ */
  function closest(product, own) {
    const keys = Object.keys(own).filter((k) => own[k] > 0);
    if (!keys.length) return null;
    let best = null;
    product.sizes.forEach((s) => {
      const d = product.chart[s];
      const diff = keys.reduce((sum, k) => sum + Math.abs((Array.isArray(d[k]) ? (d[k][0] + d[k][1]) / 2 : d[k]) - own[k]), 0);
      if (!best || diff < best.diff) best = { size: s, diff };
    });
    return best.size;
  }

  return { DEFAULT, PREF_NAME, body, kindOf, evaluate, closest };
})();
