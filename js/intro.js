/* ============================================
   オープニング（BE A BALLER のアニメーション）
   <body> の直後で読み込む。サイトに入ったときに1回だけ流れる（同じタブ内でページを移動しても再生しない）
   クリック／タップでスキップできる
   ============================================ */
(() => {
  let seen = false;
  try {
    seen = sessionStorage.getItem("introSeen") === "1";
    sessionStorage.setItem("introSeen", "1");
  } catch {}
  if (seen) return;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const letters = "BE A BALLER"
    .split("")
    .map((c, i) => (c === " " ? '<span class="gap"></span>' : `<span style="--i:${i}">${c}</span>`))
    .join("");

  const el = document.createElement("div");
  el.className = "intro";
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = `
    <div class="intro-in">
      <svg class="intro-ball" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="ib-base" cx="38%" cy="32%" r="72%"><stop offset="0" stop-color="#F8A65E"/><stop offset=".45" stop-color="#E2712A"/><stop offset=".8" stop-color="#B4500F"/><stop offset="1" stop-color="#6E2905"/></radialGradient>
          <radialGradient id="ib-shade" cx="50%" cy="50%" r="50%"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
          <radialGradient id="ib-hl" cx="34%" cy="27%" r="32%"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
          <filter id="ib-pebble" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="3" result="n"/><feDiffuseLighting in="n" surfaceScale="1.4" lighting-color="#fff" result="l"><feDistantLight azimuth="225" elevation="60"/></feDiffuseLighting><feComposite in="l" in2="SourceGraphic" operator="in" result="c"/><feBlend in="SourceGraphic" in2="c" mode="multiply"/></filter>
          <clipPath id="ib-clip"><circle cx="50" cy="50" r="48"/></clipPath>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#ib-base)" filter="url(#ib-pebble)"/>
        <g clip-path="url(#ib-clip)"><g class="intro-seams" fill="none" stroke="#1C0D04" stroke-width="2.4" stroke-linecap="round"><path d="M0 50Q50 63 100 50M50 0Q37 50 50 100M16 10Q44 50 16 90M84 10Q56 50 84 90"/></g></g>
        <circle cx="50" cy="50" r="48" fill="url(#ib-shade)"/>
        <circle cx="50" cy="50" r="48" fill="url(#ib-hl)"/>
      </svg>
      <p class="intro-word">${letters}</p>
      <p class="intro-sub">HALLELUJAH</p>
      <span class="intro-bar"></span>
    </div>`;
  document.body.prepend(el);
  document.documentElement.classList.add("is-intro");

  // 文字のフォント（Archivo Black：サイト一番下のロゴと同じ）が読み込めてから再生。遅いときは 0.7 秒で見切って始める
  const ready = Promise.race([
    document.fonts ? document.fonts.load('400 80px "Archivo Black"') : Promise.resolve(),
    new Promise((r) => setTimeout(r, 700)),
  ]).catch(() => {});

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    el.classList.add("is-out");
    document.documentElement.classList.remove("is-intro");
    setTimeout(() => el.remove(), 800);
  };

  ready.then(() => {
    el.classList.add("is-play");
    setTimeout(finish, reduce ? 900 : 2500);
  });
  el.addEventListener("click", finish);
})();
