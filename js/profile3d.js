/* ============================================
   PROFILE トップの3Dストリートコート（three.js）
   青空の下、海の見える丘のストリートコート。訪れた人がシュートを打てるミニゲーム
   長押し（クリック／タップ／スペースキー）でジャンプ → メーターの緑で離すと入る
   3Dが使えない環境ではヒーローの写真がそのまま表示される
   ============================================ */
(() => {
  const host = document.getElementById("court3d");
  const T = window.THREE;
  if (!host || !T) return;

  T.ColorManagement.legacyMode = false;
  let renderer;
  try {
    renderer = new T.WebGLRenderer({ antialias: true });
  } catch (e) {
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputEncoding = T.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);
  host.classList.add("is-ready");

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scene = new T.Scene();
  const HAZE = new T.Color("#DDEEF1");
  scene.background = new T.Color("#7DBDEB");
  scene.fog = new T.Fog(HAZE, 30, 110);
  const camera = new T.PerspectiveCamera(30, 1, 0.1, 260);
  const camBase = new T.Vector3(2.4, 2.7, 13.2);
  const camTarget = new T.Vector3(-0.3, 1.9, 0.8);

  /* ---------- ライト（夏の午後の日ざし） ---------- */
  scene.add(new T.HemisphereLight(0xd6ecff, 0x86a860, 0.62));
  const sun = new T.DirectionalLight(0xfff3dc, 0.95);
  sun.position.set(9, 17, 13);
  sun.target.position.set(0, 0, 3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 60 });
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.03;
  scene.add(sun, sun.target);

  /* ---------- 便利関数（アニメ塗り＝トゥーンシェーディング） ---------- */
  const steps = new T.DataTexture(new Uint8Array([120, 120, 120, 255, 190, 190, 190, 255, 255, 255, 255, 255]), 3, 1);
  steps.minFilter = steps.magFilter = T.NearestFilter;
  steps.generateMipmaps = false;
  steps.needsUpdate = true;
  const M = (color, extra) => new T.MeshToonMaterial({ color, gradientMap: steps, ...extra });
  const cap = (r, len) => new T.CapsuleGeometry(r, Math.max(len - r * 2, 0.001), 6, 14);
  const sph = (r) => new T.SphereGeometry(r, 20, 14);
  function part(geo, mat, parent, x = 0, y = 0, z = 0) {
    const m = new T.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  function rod(a, b, r, mat, parent = scene) {
    const len = a.distanceTo(b);
    const m = part(new T.CylinderGeometry(r, r, len, 12), mat, parent);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    return m;
  }
  function canvasTex(w, h, draw) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d"), w, h);
    const t = new T.CanvasTexture(c);
    t.encoding = T.sRGBEncoding;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return t;
  }
  // 毎回同じ景色になるように固定の乱数
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const blob = (g, x, y, r, color) => {
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, color);
    gr.addColorStop(1, color.replace(/[\d.]+\)$/, "0)")); // 同じ色のまま透明に（黒ずまないように）
    g.fillStyle = gr;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  };

  /* ---------- 遠景（空・海・岬の町）：コートを囲む大きな円筒に描く ---------- */
  const BG_R = 85, BG_TOP = 78, BG_BOT = -14, BG_H = BG_TOP - BG_BOT;
  const BG_ARC = 3.6; // 約206°
  const backdropTex = canvasTex(4096, 1400, (g, w, h) => {
    const row = (y) => ((BG_TOP - y) / BG_H) * h;
    const hz = row(2.2); // 水平線（目の高さ）
    // 空
    const sky = g.createLinearGradient(0, 0, 0, hz);
    sky.addColorStop(0, "#2F7FD2");
    sky.addColorStop(0.42, "#5FA9E6");
    sky.addColorStop(0.8, "#A9D6F1");
    sky.addColorStop(1, "#E6F2F0");
    g.fillStyle = sky;
    g.fillRect(0, 0, w, hz);
    // 薄いすじ雲
    g.globalAlpha = 0.35;
    for (let i = 0; i < 14; i++) {
      const x = rnd() * w, y = hz * (0.25 + rnd() * 0.45), len = 200 + rnd() * 500;
      g.fillStyle = "#fff";
      g.beginPath();
      g.ellipse(x, y, len, 6 + rnd() * 10, -0.04, 0, Math.PI * 2);
      g.fill();
    }
    g.globalAlpha = 1;
    // 海
    const sea = g.createLinearGradient(0, hz, 0, h);
    sea.addColorStop(0, "#8EC3D6");
    sea.addColorStop(0.08, "#4E9CC4");
    sea.addColorStop(0.5, "#2F7DB0");
    sea.addColorStop(1, "#2A6D9E");
    g.fillStyle = sea;
    g.fillRect(0, hz, w, h - hz);
    // 波のきらめき
    for (let i = 0; i < 900; i++) {
      const y = hz + Math.pow(rnd(), 1.6) * (h - hz);
      const x = rnd() * w;
      const near = (y - hz) / (h - hz);
      g.fillStyle = `rgba(255,255,255,${0.25 + rnd() * 0.5})`;
      g.fillRect(x, y, 4 + near * 26 * rnd(), 1 + near * 3);
    }
    // 遠くの島
    const island = (cx, wd, ht, col) => {
      g.fillStyle = col;
      g.beginPath();
      g.moveTo(cx - wd, hz + 1);
      g.bezierCurveTo(cx - wd * 0.5, hz - ht * 0.9, cx - wd * 0.15, hz - ht, cx, hz - ht);
      g.bezierCurveTo(cx + wd * 0.3, hz - ht, cx + wd * 0.6, hz - ht * 0.5, cx + wd, hz + 1);
      g.fill();
    };
    island(w * 0.3, 230, 38, "#9CBCCB");
    island(w * 0.37, 120, 20, "#A7C5D1");
    island(w * 0.58, 160, 26, "#A2C1CE");
    // 左右の丘（手前ほど濃い緑）
    const hill = (pts, top, col, shade) => {
      g.beginPath();
      g.moveTo(pts[0][0] * w, h);
      pts.forEach(([u, y]) => g.lineTo(u * w, row(y)));
      g.lineTo(pts[pts.length - 1][0] * w, h);
      g.closePath();
      const gr = g.createLinearGradient(0, row(top), 0, hz + 40);
      gr.addColorStop(0, col);
      gr.addColorStop(1, shade);
      g.fillStyle = gr;
      g.fill();
    };
    const smooth = (u0, u1, y0, y1, ypk, n = 40) => {
      const out = [];
      for (let i = 0; i <= n; i++) {
        const s = i / n;
        out.push([u0 + (u1 - u0) * s, y0 + (y1 - y0) * s + Math.sin(s * Math.PI) * ypk + Math.sin(s * 19) * 0.25]);
      }
      return out;
    };
    hill(smooth(-0.02, 0.3, 11, 1.4, 3), 12, "#86B27E", "#6E9E70"); // 左奥の丘
    hill(smooth(-0.02, 0.2, 7, 0.6, 2.5), 8, "#5F9B52", "#4F8848"); // 左手前
    hill(smooth(0.66, 1.02, 1.6, 12, 3.5), 13, "#88B37F", "#6D9C70"); // 右奥（岬）
    hill(smooth(0.8, 1.02, 0.8, 7, 2), 8, "#5C9750", "#4C8547");
    // 木のかたまり（丸い葉っぱの重なり）
    const clump = (u, y, s, dark) => {
      const x = u * w, yy = row(y);
      for (let i = 0; i < 6; i++) {
        const r = s * (0.6 + rnd() * 0.5);
        const cx = x + (rnd() - 0.5) * s * 1.6, cy = yy - rnd() * s * 0.7;
        const gr = g.createRadialGradient(cx - r * 0.3, cy - r * 0.4, r * 0.1, cx, cy, r);
        gr.addColorStop(0, dark ? "#5E9A4C" : "#7DB45E");
        gr.addColorStop(1, dark ? "#2F6A3A" : "#477F45");
        g.fillStyle = gr;
        g.beginPath();
        g.arc(cx, cy, r, 0, Math.PI * 2);
        g.fill();
      }
    };
    for (let i = 0; i < 16; i++) clump(rnd() * 0.18, 3 + rnd() * 4, 14 + rnd() * 16, i % 3 === 0);
    for (let i = 0; i < 10; i++) clump(0.84 + rnd() * 0.16, 3 + rnd() * 4, 14 + rnd() * 14, i % 3 === 0);
    // 岬の白い灯台と、丘の上の小さな家
    const lx = w * 0.69, ly = row(3.4);
    g.fillStyle = "#F7F3EA";
    g.beginPath();
    g.moveTo(lx - 9, ly);
    g.lineTo(lx - 6, ly - 70);
    g.lineTo(lx + 6, ly - 70);
    g.lineTo(lx + 9, ly);
    g.fill();
    g.fillStyle = "#C9543F";
    g.fillRect(lx - 7, ly - 48, 14, 12);
    g.fillRect(lx - 8, ly - 80, 16, 10);
    g.beginPath();
    g.moveTo(lx - 9, ly - 80);
    g.lineTo(lx, ly - 92);
    g.lineTo(lx + 9, ly - 80);
    g.fill();
    const house = (u, y, s, roof) => {
      const x = u * w, yy = row(y);
      g.fillStyle = "#F4EEDF";
      g.fillRect(x - s, yy - s * 1.1, s * 2, s * 1.1);
      g.fillStyle = roof;
      g.beginPath();
      g.moveTo(x - s * 1.25, yy - s * 1.05);
      g.lineTo(x - s * 0.6, yy - s * 1.9);
      g.lineTo(x + s * 0.6, yy - s * 1.9);
      g.lineTo(x + s * 1.25, yy - s * 1.05);
      g.fill();
      g.fillStyle = "#6E8FA3";
      g.fillRect(x - s * 0.5, yy - s * 0.75, s * 0.35, s * 0.35);
    };
    [[0.86, 6.2, 13, "#C65B44"], [0.9, 7.2, 11, "#4F8FA8"], [0.94, 6.7, 14, "#D4864A"], [0.78, 5.3, 10, "#C65B44"], [0.1, 6.4, 11, "#4F8FA8"], [0.06, 5.6, 13, "#C65B44"]].forEach((a) => house(...a));
  });
  backdropTex.wrapS = T.RepeatWrapping;
  backdropTex.repeat.x = -1; // 円筒の内側から見るので左右を反転
  const backdrop = new T.Mesh(
    new T.CylinderGeometry(BG_R, BG_R, BG_H, 96, 1, true, Math.PI - BG_ARC / 2, BG_ARC),
    new T.MeshBasicMaterial({ map: backdropTex, side: T.BackSide, fog: false, depthWrite: false })
  );
  backdrop.renderOrder = -1; // いちばん奥に描く（雲を隠さない）
  backdrop.position.set(0, BG_BOT + BG_H / 2, 6);
  scene.add(backdrop);
  // 円筒の上の空（カメラが見上げたとき用）
  const dome = new T.Mesh(
    new T.SphereGeometry(BG_R + 20, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.2),
    new T.MeshBasicMaterial({ color: 0x2f7fd2, side: T.BackSide, fog: false, depthWrite: false })
  );
  dome.renderOrder = -2;
  dome.position.set(0, 20, 6);
  scene.add(dome);

  /* ---------- 入道雲（ゆっくり流れる） ---------- */
  function cloudTex(tall) {
    return canvasTex(1024, tall ? 1024 : 512, (g, w, h) => {
      const base = h * 0.9;
      const H = tall ? h * 0.82 : h * 0.62;
      const lobes = [];
      const N = tall ? 44 : 26;
      for (let i = 0; i < N; i++) {
        const u = 0.08 + rnd() * 0.84;
        const prof = Math.pow(Math.sin(u * Math.PI), tall ? 1.6 : 0.9);
        const top = base - H * prof * (0.7 + rnd() * 0.3);
        const r = w * (tall ? 0.085 : 0.075) * (0.55 + rnd() * 0.6) * (0.55 + prof * 0.45);
        const y = top + r + rnd() * Math.max(0, base - top - r * 2) * 0.7;
        lobes.push({ x: u * w, y, r });
      }
      for (let i = 0; i < 9; i++) lobes.push({ x: w * (0.14 + i * 0.09), y: base - w * 0.03, r: w * 0.06 });
      lobes.sort((a, b) => b.y - a.y);
      g.save();
      g.beginPath();
      g.rect(0, 0, w, base);
      g.clip();
      // 影色で形をつくり、左上にずらした白を重ねる（右下にだけ影が残る）
      g.fillStyle = "#C6D2EA";
      for (const { x, y, r } of lobes) {
        g.beginPath();
        g.arc(x, y, r, 0, Math.PI * 2);
        g.fill();
      }
      g.globalCompositeOperation = "source-atop";
      for (const { x, y, r } of lobes) {
        const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.4, r * 0.1, x - r * 0.16, y - r * 0.2, r * 0.9);
        gr.addColorStop(0, "#FFFFFF");
        gr.addColorStop(0.75, "#F7F9FD");
        gr.addColorStop(1, "#E4EAF5");
        g.fillStyle = gr;
        g.beginPath();
        g.arc(x - r * 0.16, y - r * 0.2, r * 0.88, 0, Math.PI * 2);
        g.fill();
      }
      // 底は青むらさきの影
      const sh = g.createLinearGradient(0, base - H * 0.35, 0, base);
      sh.addColorStop(0, "rgba(160,176,214,0)");
      sh.addColorStop(1, "rgba(150,166,210,.75)");
      g.fillStyle = sh;
      g.fillRect(0, 0, w, h);
      g.restore();
    });
  }
  const clouds = [];
  // [x, 雲の底の高さ, z, 幅, 入道雲か]
  [
    [20, 1.5, -76, 46, true],
    [-12, 17, -78, 28, false],
    [46, 13, -64, 24, false],
    [-42, 8, -70, 30, false],
    [4, 30, -80, 22, false],
    [-66, 20, -44, 24, false],
  ].forEach(([x, y0, z, s, tall]) => {
    const y = y0 + (tall ? s : s / 2) * 0.5 - (tall ? s : s / 2) * 0.1;
    const tex = cloudTex(tall);
    const m = new T.Mesh(
      new T.PlaneGeometry(s, tall ? s : s / 2),
      new T.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, fog: false })
    );
    m.position.set(x, y, z);
    m.lookAt(0, y * 0.4, 10);
    m.renderOrder = 1;
    scene.add(m);
    clouds.push({ m, speed: tall ? 0.06 : 0.2 + rnd() * 0.3 });
  });

  /* ---------- 地面：芝生とストリートコート（単位はメートル。ゴール側＝ -z） ---------- */
  const RIM = new T.Vector3(0, 3.05, 0); // リングの中心
  const RIM_R = 0.225, TUBE = 0.017;
  const BOARD_Z = -0.375; // バックボードの表面
  const POLE_Z = -1.9;
  const SPOT = new T.Vector3(0, 0, 4.7); // シュートを打つ位置

  const grassTex = canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = "#86BA59";
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) blob(g, rnd() * w, rnd() * h, 30 + rnd() * 70, rnd() < 0.5 ? "rgba(160,206,98,.5)" : "rgba(98,150,64,.45)");
    for (let i = 0; i < 2600; i++) {
      g.fillStyle = rnd() < 0.5 ? "rgba(60,110,40,.35)" : "rgba(190,226,130,.35)";
      g.fillRect(rnd() * w, rnd() * h, 2, 5 + rnd() * 6);
    }
  });
  grassTex.wrapS = grassTex.wrapT = T.RepeatWrapping;
  grassTex.repeat.set(12, 12);
  const grass = new T.Mesh(new T.CircleGeometry(30, 64), M(0xffffff, { map: grassTex }));
  grass.rotation.x = -Math.PI / 2;
  grass.position.set(0, 0, 2);
  grass.receiveShadow = true;
  scene.add(grass);

  const CREAM = "rgba(246,241,226,.9)";
  function courtTexture() {
    const ppm = 128;
    return canvasTex(16 * ppm, 16 * ppm, (g, w, h) => {
      const X = (x) => (x + 8) * ppm;
      const Y = (z) => (z + 3) * ppm; // 上がゴール側
      // 日に焼けたコンクリート
      g.fillStyle = "#B8B6AA";
      g.fillRect(0, 0, w, h);
      for (let i = 0; i < 260; i++) blob(g, rnd() * w, rnd() * h, 40 + rnd() * 160, rnd() < 0.5 ? "rgba(214,210,196,.35)" : "rgba(140,140,128,.22)");
      // 塗られたコート面（色あせた青緑）と、レンガ色のペイントエリア
      g.fillStyle = "#79A99C";
      g.fillRect(X(-7.5), Y(-1.575), 15 * ppm, 14 * ppm);
      g.fillStyle = "#C47B5C";
      g.fillRect(X(-2.45), Y(-1.575), 4.9 * ppm, 5.8 * ppm);
      g.beginPath();
      g.arc(X(0), Y(12.425), 1.8 * ppm, Math.PI, Math.PI * 2);
      g.fill();
      // 塗装のはげ・ムラ
      for (let i = 0; i < 520; i++) blob(g, X(-7.5 + rnd() * 15), Y(-1.6 + rnd() * 14), 10 + rnd() * 70, rnd() < 0.6 ? "rgba(196,194,180,.38)" : "rgba(255,255,240,.12)");
      for (let i = 0; i < 9000; i++) {
        g.fillStyle = rnd() < 0.5 ? "rgba(0,0,0,.06)" : "rgba(255,255,255,.07)";
        g.fillRect(rnd() * w, rnd() * h, 2, 2);
      }
      // ライン
      g.strokeStyle = CREAM;
      g.lineWidth = 0.06 * ppm;
      g.strokeRect(X(-7.5), Y(-1.575), 15 * ppm, 14 * ppm);
      g.strokeRect(X(-2.45), Y(-1.575), 4.9 * ppm, 5.8 * ppm);
      g.beginPath();
      g.arc(X(0), Y(4.225), 1.8 * ppm, 0, Math.PI * 2);
      g.stroke();
      g.beginPath();
      g.arc(X(0), Y(12.425), 1.8 * ppm, Math.PI, Math.PI * 2);
      g.stroke();
      // スリーポイントライン
      const a = Math.asin(6.6 / 6.75);
      g.beginPath();
      g.moveTo(X(-6.6), Y(-1.575));
      g.lineTo(X(-6.6), Y(Math.cos(a) * 6.75));
      g.arc(X(0), Y(0), 6.75 * ppm, Math.PI / 2 + a, Math.PI / 2 - a, true);
      g.lineTo(X(6.6), Y(-1.575));
      g.stroke();
      // ひび割れ
      g.strokeStyle = "rgba(70,66,58,.35)";
      g.lineWidth = 2;
      for (let i = 0; i < 26; i++) {
        let x = rnd() * w, y = rnd() * h, ang = rnd() * Math.PI * 2;
        g.beginPath();
        g.moveTo(x, y);
        for (let k = 0; k < 14; k++) {
          ang += (rnd() - 0.5) * 1.1;
          x += Math.cos(ang) * 18;
          y += Math.sin(ang) * 18;
          g.lineTo(x, y);
        }
        g.stroke();
      }
      // 手描き風の文字
      g.save();
      g.globalAlpha = 0.72;
      g.fillStyle = "#F6F1E2";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.font = `${0.62 * ppm}px "Zen Maru Gothic", Anton, sans-serif`;
      g.fillText("BE A BALLER", X(0), Y(8.9));
      g.font = `${0.3 * ppm}px "Zen Maru Gothic", Jost, sans-serif`;
      g.fillText("HALLELUJAH  COURT", X(0), Y(9.6));
      g.restore();
      // ふちは芝生になじませる
      const edge = g.createLinearGradient(0, 0, 0, h);
      edge.addColorStop(0, "rgba(134,186,89,1)");
      edge.addColorStop(0.04, "rgba(134,186,89,0)");
      edge.addColorStop(0.96, "rgba(134,186,89,0)");
      edge.addColorStop(1, "rgba(134,186,89,1)");
      g.fillStyle = edge;
      g.fillRect(0, 0, w, h);
      const edge2 = g.createLinearGradient(0, 0, w, 0);
      edge2.addColorStop(0, "rgba(134,186,89,1)");
      edge2.addColorStop(0.03, "rgba(134,186,89,0)");
      edge2.addColorStop(0.97, "rgba(134,186,89,0)");
      edge2.addColorStop(1, "rgba(134,186,89,1)");
      g.fillStyle = edge2;
      g.fillRect(0, 0, w, h);
    });
  }
  const courtMat = M(0xffffff);
  const court = new T.Mesh(new T.PlaneGeometry(16, 16), courtMat);
  court.rotation.x = -Math.PI / 2;
  court.position.set(0, 0.012, 5);
  court.receiveShadow = true;
  scene.add(court);
  const paintCourt = () => {
    seed = 11;
    if (courtMat.map) courtMat.map.dispose();
    courtMat.map = courtTexture();
    courtMat.needsUpdate = true;
  };
  paintCourt();
  if (document.fonts) document.fonts.load('40px "Zen Maru Gothic"').then(paintCourt, () => {});

  /* ---------- ゴール（屋外の古いゴール） ---------- */
  const poleMat = M(0x3f6f5b);
  part(new T.CylinderGeometry(0.11, 0.13, 3.6, 16), poleMat, scene, 0, 1.8, POLE_Z);
  part(new T.CylinderGeometry(0.3, 0.34, 0.12, 16), M(0x9a968a), scene, 0, 0.06, POLE_Z);
  rod(new T.Vector3(0, 3.55, POLE_Z), new T.Vector3(0, 3.42, -0.5), 0.06, poleMat);
  rod(new T.Vector3(0, 2.75, POLE_Z), new T.Vector3(0, 3.38, -0.95), 0.045, poleMat);
  part(new T.SphereGeometry(0.12, 16, 10), poleMat, scene, 0, 3.6, POLE_Z);
  const boardTex = canvasTex(540, 315, (g, w, h) => {
    g.fillStyle = "#F7F4EA";
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 30; i++) blob(g, rnd() * w, rnd() * h, 20 + rnd() * 50, "rgba(205,196,170,.09)");
    // 雨だれのサビ
    for (let i = 0; i < 6; i++) {
      const x = 20 + rnd() * (w - 40);
      const gr = g.createLinearGradient(0, 10, 0, 60 + rnd() * 120);
      gr.addColorStop(0, "rgba(160,100,60,.16)");
      gr.addColorStop(1, "rgba(160,100,60,0)");
      g.fillStyle = gr;
      g.fillRect(x, 10, 3 + rnd() * 4, 180);
    }
    g.strokeStyle = "#C9583A";
    g.lineWidth = 12;
    g.strokeRect(8, 8, w - 16, h - 16);
    g.lineWidth = 9;
    g.strokeRect(w / 2 - 88, 135, 176, 135);
  });
  const boardWhite = M(0xf3efe2);
  part(new T.BoxGeometry(1.8, 1.05, 0.05), [boardWhite, boardWhite, boardWhite, boardWhite, M(0xffffff, { map: boardTex }), boardWhite], scene, 0, 3.425, BOARD_Z - 0.025);
  part(new T.BoxGeometry(0.4, 0.4, 0.06), poleMat, scene, 0, 3.4, BOARD_Z - 0.08);
  part(new T.BoxGeometry(0.12, 0.04, 0.17), M(0xd9542b), scene, 0, 3.04, BOARD_Z + 0.08);
  const rimMesh = part(new T.TorusGeometry(RIM_R, TUBE, 10, 40), M(0xd9542b), scene, RIM.x, RIM.y, RIM.z);
  rimMesh.rotation.x = Math.PI / 2;

  // ネット（ボールが通ると揺れる）
  const NR = 5, NN = 14, NH = 0.42;
  const netBase = [], netRing = [];
  for (let i = 0; i < NR - 1; i++) {
    for (let j = 0; j < NN; j++) {
      const a = (i % 2) * 0.5;
      const b = ((i + 1) % 2) * 0.5;
      for (const jj of [j + (b > a ? 0 : 1), j + (b > a ? -1 : 0)]) {
        [[i, j + a], [i + 1, jj + b]].forEach(([ri, aj]) => {
          const f = ri / (NR - 1);
          const r = RIM_R - 0.09 * f;
          const ang = (aj / NN) * Math.PI * 2;
          netBase.push(Math.cos(ang) * r, -NH * f, Math.sin(ang) * r);
          netRing.push(f);
        });
      }
    }
  }
  const netGeo = new T.BufferGeometry();
  netGeo.setAttribute("position", new T.Float32BufferAttribute(netBase.slice(), 3));
  const net = new T.LineSegments(netGeo, new T.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 }));
  net.position.copy(RIM);
  scene.add(net);
  function swishNet(s, amp) {
    const p = netGeo.attributes.position;
    const pulse = s > 0 && s < 1.4 ? ((s < 0.22 ? Math.sin((s / 0.22) * Math.PI) : 0) + Math.sin(s * 16) * Math.exp(-s * 4) * 0.5) * amp : 0;
    for (let i = 0; i < netRing.length; i++) {
      const f = netRing[i];
      const k = 1 - f * 0.22 * pulse;
      p.setXYZ(i, netBase[i * 3] * k, netBase[i * 3 + 1] * (1 + 0.3 * pulse * f), netBase[i * 3 + 2] * k + f * 0.04 * pulse);
    }
    p.needsUpdate = true;
  }

  /* ---------- まわりの景色：木・電柱・柵・ベンチ・草 ---------- */
  const sways = [];
  function tree(x, z, s, tint = 0) {
    const g = new T.Group();
    g.position.set(x, 0, z);
    g.scale.setScalar(s);
    scene.add(g);
    const bark = M(0x7a5a3e);
    part(new T.CylinderGeometry(0.15, 0.26, 3, 10), bark, g, 0, 1.5, 0);
    rod(new T.Vector3(0, 2.2, 0), new T.Vector3(0.7, 3.1, 0.2), 0.08, bark, g);
    rod(new T.Vector3(0, 2.4, 0), new T.Vector3(-0.6, 3.3, -0.1), 0.08, bark, g);
    const crown = new T.Group();
    crown.position.y = 3.4;
    g.add(crown);
    const greens = [0x4e8c43, 0x5e9e4c, 0x6fae57, 0x7fbc61].map((c) => M(new T.Color(c).offsetHSL(tint, 0, 0)));
    for (let i = 0; i < 11; i++) {
      const r = 0.7 + rnd() * 0.6;
      const a = rnd() * Math.PI * 2, d = rnd() * 1.1;
      const leaf = part(new T.SphereGeometry(r, 18, 14), greens[Math.min(3, Math.floor(rnd() * 2) + (i > 6 ? 2 : 0))], crown, Math.cos(a) * d * 1.2, rnd() * 1.3 - 0.2 + (i > 6 ? 0.6 : 0), Math.sin(a) * d);
      leaf.scale.y = 0.85;
    }
    sways.push({ crown, phase: rnd() * 6 });
  }
  tree(-8.6, -1.5, 1.45);
  tree(-12.5, 5.5, 1.2, 0.01);
  tree(-15, -9, 1.6);
  tree(11, -6.5, 1.3, -0.01);
  tree(14, 3, 1.15);
  tree(-16, -15, 1.1, 0.015);

  // 電柱と電線
  const wood = M(0x6e5c4b);
  const polePos = [new T.Vector3(7.6, 0, -7.5), new T.Vector3(-26, 0, -30)];
  const span = polePos[1].clone().sub(polePos[0]);
  const tops = polePos.map((p) => {
    part(new T.CylinderGeometry(0.12, 0.17, 8.6, 10), wood, scene, p.x, 4.3, p.z);
    const arm = part(new T.BoxGeometry(1.6, 0.1, 0.1), wood, scene, p.x, 7.9, p.z);
    arm.rotation.y = Math.atan2(-span.z, span.x) + Math.PI / 2; // 電線と直角
    return arm;
  });
  const wireMat = new T.MeshBasicMaterial({ color: 0x3b4140 });
  [-0.7, 0, 0.7].forEach((o) => {
    const a = new T.Vector3(o, 0, 0).applyQuaternion(tops[0].quaternion).add(new T.Vector3(polePos[0].x, 7.95, polePos[0].z));
    const b = new T.Vector3(o, 0, 0).applyQuaternion(tops[1].quaternion).add(new T.Vector3(polePos[1].x, 7.95, polePos[1].z));
    const pts = [];
    for (let i = 0; i <= 30; i++) {
      const s = i / 30;
      pts.push(new T.Vector3().lerpVectors(a, b, s).add(new T.Vector3(0, -Math.sin(s * Math.PI) * 1.6, 0)));
    }
    // 画面の右外へ続く線
    const c = a.clone().add(new T.Vector3(18, -0.4, 10));
    const pts2 = [];
    for (let i = 0; i <= 12; i++) {
      const s = i / 12;
      pts2.push(new T.Vector3().lerpVectors(a, c, s).add(new T.Vector3(0, -Math.sin(s * Math.PI) * 1.1, 0)));
    }
    [pts, pts2].forEach((ps) => scene.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(ps), 40, 0.018, 4), wireMat)));
  });

  // 海側の木の柵
  const fenceWood = M(0xa07e5b);
  for (let x = -20; x <= 20; x += 1.7) {
    part(new T.BoxGeometry(0.12, 1.05, 0.12), fenceWood, scene, x, 0.52, -11 + Math.sin(x * 0.3) * 0.15);
  }
  [0.45, 0.85].forEach((y) => part(new T.BoxGeometry(40, 0.08, 0.05), fenceWood, scene, 0, y, -11));

  // ベンチ（タオルと水筒）
  const bench = new T.Group();
  bench.position.set(6.3, 0, 6.8);
  bench.rotation.y = -Math.PI / 2;
  scene.add(bench);
  const benchWood = M(0xb5835a);
  [-0.12, 0.12].forEach((z) => part(new T.BoxGeometry(2.0, 0.05, 0.2), benchWood, bench, 0, 0.45, z));
  part(new T.BoxGeometry(2.0, 0.22, 0.04), benchWood, bench, 0, 0.75, 0.24).rotation.x = -0.12;
  [-0.85, 0.85].forEach((x) => part(new T.BoxGeometry(0.06, 0.45, 0.5), M(0x5b6158), bench, x, 0.22, 0.04));
  part(new T.BoxGeometry(0.5, 0.06, 0.32), M(0xf0e0b8), bench, -0.45, 0.5, 0);
  part(new T.CylinderGeometry(0.045, 0.045, 0.24, 12), M(0x4f9fc4), bench, 0.55, 0.6, -0.02);

  // 草むら・花（芝生の上だけ）
  // 細い葉を3本束ねた草
  const tuftGeo = (() => {
    const pos = [], nor = [];
    [[-0.05, 0.25], [0.03, -0.2], [0.07, 0.4]].forEach(([x, tilt], i) => {
      const b = new T.ConeGeometry(0.022, 0.3 - i * 0.05, 3).toNonIndexed();
      b.translate(0, (0.3 - i * 0.05) / 2, 0);
      b.rotateZ(tilt);
      b.translate(x, 0, i * 0.03);
      pos.push(...b.attributes.position.array);
      nor.push(...b.attributes.normal.array);
    });
    const g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
    g.setAttribute("normal", new T.Float32BufferAttribute(nor, 3));
    return g;
  })();
  const TUFTS = 1100;
  const tufts = new T.InstancedMesh(tuftGeo, M(0xffffff), TUFTS);
  const flowers = new T.InstancedMesh(new T.SphereGeometry(0.05, 6, 5), M(0xffffff), 260);
  const o3 = new T.Object3D(), col = new T.Color();
  let ti = 0, fi = 0;
  while (ti < TUFTS || fi < 260) {
    const a = rnd() * Math.PI * 2, d = 4 + Math.sqrt(rnd()) * 22;
    const x = Math.cos(a) * d, z = 2 + Math.sin(a) * d;
    if (Math.abs(x) < 8.4 && z > -3.4 && z < 13.4) continue;
    if (z < -11.3) continue;
    o3.position.set(x, 0, z);
    o3.rotation.set((rnd() - 0.5) * 0.4, rnd() * 3, (rnd() - 0.5) * 0.4);
    if (ti < TUFTS) {
      o3.scale.set(1, 0.7 + rnd() * 0.8, 1);
      o3.updateMatrix();
      tufts.setMatrixAt(ti, o3.matrix);
      tufts.setColorAt(ti++, col.setHSL(0.24 + rnd() * 0.06, 0.45, 0.32 + rnd() * 0.16));
    } else {
      o3.position.y = 0.3 + rnd() * 0.15;
      o3.scale.setScalar(1);
      o3.updateMatrix();
      flowers.setMatrixAt(fi, o3.matrix);
      flowers.setColorAt(fi++, col.set(["#FFFFFF", "#FFE58A", "#F6B8C8", "#FFFFFF"][Math.floor(rnd() * 4)]));
    }
  }
  tufts.receiveShadow = flowers.receiveShadow = true;
  scene.add(tufts, flowers);

  // 風に舞う花びら・葉っぱ
  const PET = reduce ? 0 : 150;
  const petGeo = new T.BufferGeometry();
  const petPos = new Float32Array(PET * 3), petCol = new Float32Array(PET * 3), petSeed = [];
  for (let i = 0; i < PET; i++) {
    petPos.set([-14 + rnd() * 28, 0.3 + rnd() * 8, -8 + rnd() * 20], i * 3);
    col.set(["#FFFFFF", "#F8C9D4", "#B8DC8A", "#FFF2B0"][i % 4]);
    petCol.set([col.r, col.g, col.b], i * 3);
    petSeed.push(rnd() * 10);
  }
  petGeo.setAttribute("position", new T.BufferAttribute(petPos, 3));
  petGeo.setAttribute("color", new T.BufferAttribute(petCol, 3));
  const petTex = canvasTex(64, 64, (g, w) => {
    g.fillStyle = "#fff";
    g.beginPath();
    g.ellipse(w / 2, w / 2, w * 0.42, w * 0.24, 0.6, 0, Math.PI * 2);
    g.fill();
  });
  const petals = new T.Points(petGeo, new T.PointsMaterial({ size: 0.11, map: petTex, vertexColors: true, transparent: true, alphaTest: 0.3, depthWrite: false }));
  scene.add(petals);
  let burst = []; // ゴールが決まったときの花びら

  /* ---------- フィギュア（白T・クリームのショーツ・黒髪） ---------- */
  const skin = M(0xe8b693);
  const hairM = M(0x2a2420);
  const shirt = M(0xfbf8f0);
  const shorts = M(0xe2d4b2);
  const shoeM = M(0xfdfcf8);
  const soleM = M(0x3a3a3a);
  const dark = M(0x1a1410);

  const player = new T.Group();
  player.position.copy(SPOT);
  scene.add(player);
  const pelvis = new T.Group();
  player.add(pelvis);
  const hips = part(cap(0.15, 0.44), shorts, pelvis, 0, -0.03, 0);
  hips.rotation.z = Math.PI / 2;
  hips.scale.z = 0.72;
  const spine = new T.Group();
  spine.position.y = 0.03;
  pelvis.add(spine);
  part(cap(0.17, 0.64), shirt, spine, 0, 0.3, 0).scale.set(1.12, 1, 0.72);
  part(new T.CylinderGeometry(0.05, 0.055, 0.12, 12), skin, spine, 0, 0.58, 0);

  const head = new T.Group();
  head.position.y = 0.6;
  head.scale.setScalar(1.22);
  spine.add(head);
  part(new T.SphereGeometry(0.12, 32, 24), skin, head, 0, 0.11, 0).scale.set(0.92, 1.05, 1);
  const hairCap = part(new T.SphereGeometry(0.128, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.52), hairM, head, 0, 0.125, 0.006);
  hairCap.rotation.x = 0.35;
  hairCap.scale.set(0.97, 1.08, 1.04);
  const fringe = part(new T.SphereGeometry(0.07, 16, 12), hairM, head, 0.015, 0.19, -0.075);
  fringe.scale.set(1.45, 0.6, 0.75);
  fringe.rotation.z = 0.25;
  [-1, 1].forEach((s) => {
    part(sph(0.028), skin, head, 0.112 * s, 0.1, 0.005).scale.set(0.5, 1, 0.8);
    part(sph(0.013), dark, head, 0.04 * s, 0.115, -0.11);
  });

  function arm(s) {
    const sh = new T.Group();
    sh.position.set(0.2 * s, 0.5, 0);
    spine.add(sh);
    part(sph(0.068), shirt, sh);
    part(cap(0.066, 0.2), shirt, sh, 0, -0.08, 0);
    part(cap(0.045, 0.3), skin, sh, 0, -0.15, 0);
    const el = new T.Group();
    el.position.y = -0.29;
    sh.add(el);
    part(cap(0.041, 0.27), skin, el, 0, -0.135, 0);
    const wr = new T.Group();
    wr.position.y = -0.26;
    el.add(wr);
    part(sph(0.05), skin, wr, 0, -0.045, 0).scale.set(0.8, 1.25, 0.55);
    const tip = new T.Object3D();
    tip.position.y = -0.05;
    wr.add(tip);
    return { sh, el, wr, tip };
  }
  function leg(s) {
    const hip = new T.Group();
    hip.position.set(0.1 * s, -0.05, 0);
    pelvis.add(hip);
    part(cap(0.088, 0.3), shorts, hip, 0, -0.13, 0);
    part(cap(0.068, 0.45), skin, hip, 0, -0.225, 0);
    const kn = new T.Group();
    kn.position.y = -0.45;
    hip.add(kn);
    part(cap(0.056, 0.45), skin, kn, 0, -0.225, 0);
    part(new T.CylinderGeometry(0.053, 0.05, 0.12, 14), shirt, kn, 0, -0.39, 0);
    const an = new T.Group();
    an.position.y = -0.45;
    kn.add(an);
    const shoe = part(cap(0.055, 0.27), shoeM, an, 0, -0.035, -0.06);
    shoe.rotation.x = Math.PI / 2;
    shoe.scale.z = 0.75;
    part(new T.BoxGeometry(0.11, 0.025, 0.27), soleM, an, 0, -0.075, -0.06);
    return { hip, kn, an };
  }
  const armR = arm(1), armL = arm(-1), legR = leg(1), legL = leg(-1);

  /* ---------- フォーム（キーフレーム） ----------
     j:ジャンプ h:股関節 k:ひざ lean:上体 rs/ls:肩 rsz/lsz:肩の開き re/le:ひじ rw/lw:手首 hd:頭
     0〜1.4 が構え→ジャンプ→リリース、1.4〜2.6 がフォロースルー、3.55 がキャッチの構え */
  const C = 4.0, TOP = 1.4, CATCH = 3.55;
  const KEYS = [
    [0.0, { j: 0, h: 0.35, k: -0.6, lean: -0.15, rs: 0.6, rsz: -0.1, re: 1.3, rw: 0.3, ls: 0.6, lsz: 0.3, le: 1.3, lw: 0.2, hd: 0.05 }],
    [0.55, { j: 0, h: 0.8, k: -1.3, lean: -0.28, rs: 0.5, rsz: -0.12, re: 1.25, rw: 0.3, ls: 0.5, lsz: 0.32, le: 1.3, lw: 0.2, hd: 0.12 }],
    [1.0, { j: 0.04, h: 0.3, k: -0.45, lean: -0.08, rs: 1.75, rsz: -0.14, re: 1.45, rw: 0.8, ls: 1.6, lsz: 0.42, le: 1.5, lw: 0.3, hd: 0.15 }],
    [1.4, { j: 0.34, h: 0.05, k: -0.12, lean: 0, rs: 2.7, rsz: -0.08, re: 0.2, rw: 0.25, ls: 2.0, lsz: 0.35, le: 1.0, lw: 0.2, hd: 0.18 }],
    [1.7, { j: 0.22, h: 0.1, k: -0.2, lean: 0, rs: 2.75, rsz: -0.06, re: 0.15, rw: -1.3, ls: 1.8, lsz: 0.3, le: 0.8, lw: 0, hd: 0.18 }],
    [2.0, { j: 0, h: 0.6, k: -1.0, lean: -0.15, rs: 2.6, rsz: -0.06, re: 0.25, rw: -1.3, ls: 1.3, lsz: 0.25, le: 0.7, lw: 0, hd: 0.15 }],
    [2.6, { j: 0, h: 0.2, k: -0.35, lean: -0.05, rs: 2.5, rsz: -0.06, re: 0.3, rw: -1.2, ls: 0.5, lsz: 0.15, le: 0.4, lw: 0, hd: 0.1 }],
    [3.1, { j: 0, h: 0.12, k: -0.22, lean: -0.05, rs: 0.25, rsz: 0, re: 0.35, rw: 0, ls: 0.25, lsz: 0.1, le: 0.35, lw: 0, hd: 0.05 }],
    [3.55, { j: 0, h: 0.3, k: -0.5, lean: -0.12, rs: 0.7, rsz: -0.08, re: 1.1, rw: 0.2, ls: 0.7, lsz: 0.28, le: 1.1, lw: 0.2, hd: 0.05 }],
  ];
  // ドリブル（手が上 → 下）
  const DRIB_UP = { j: 0, h: 0.5, k: -0.85, lean: -0.24, rs: 0.95, rsz: 0.22, re: 1.05, rw: 0.35, ls: 0.75, lsz: -0.35, le: 1.25, lw: 0.2, hd: 0.14 };
  const DRIB_DN = { ...DRIB_UP, h: 0.56, k: -0.95, rs: 0.5, re: 0.45, rw: -0.35 };
  const cr = (a, b, c, d, u) => b + 0.5 * u * (c - a + u * (2 * a - 5 * b + 4 * c - d + u * (3 * (b - c) + d - a)));
  function poseAt(t) {
    const n = KEYS.length;
    let i = n - 1;
    while (i > 0 && KEYS[i][0] > t) i--;
    const k0 = KEYS[(i - 1 + n) % n][1], k1 = KEYS[i][1], k2 = KEYS[(i + 1) % n][1], k3 = KEYS[(i + 2) % n][1];
    const t1 = KEYS[i][0], t2 = i + 1 < n ? KEYS[i + 1][0] : C;
    const u = (t - t1) / (t2 - t1);
    const p = {};
    for (const key in k1) p[key] = cr(k0[key], k1[key], k2[key], k3[key], u);
    return p;
  }
  function mixPose(a, b, u, out = {}) {
    for (const key in a) out[key] = a[key] + (b[key] - a[key]) * u;
    return out;
  }
  const L = 0.45, ANK = 0.088;
  function setPose(p) {
    const j = Math.max(0, p.j), k = Math.min(-0.02, p.k);
    const toe = -Math.min(j / 0.25, 1) * 0.5;
    for (const lg of [legL, legR]) {
      lg.hip.rotation.x = p.h;
      lg.kn.rotation.x = k;
      lg.an.rotation.x = -(p.h + k) + toe;
    }
    const vy = L * Math.cos(p.h) + L * Math.cos(p.h + k);
    const vz = L * Math.sin(p.h) + L * Math.sin(p.h + k);
    pelvis.position.set(0, j + ANK + vy + 0.05, vz);
    spine.rotation.x = p.lean;
    head.rotation.x = p.hd - p.lean * 0.6;
    armR.sh.rotation.set(p.rs, 0, p.rsz);
    armR.el.rotation.x = Math.max(0.05, p.re);
    armR.wr.rotation.x = p.rw;
    armL.sh.rotation.set(p.ls, 0, p.lsz);
    armL.el.rotation.x = Math.max(0.05, p.le);
    armL.wr.rotation.x = p.lw;
  }

  /* ---------- ボール ---------- */
  const R = 0.12, G = 9.8;
  const ballTex = canvasTex(512, 256, (g, w, h) => {
    g.fillStyle = "#E0773A";
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 4000; i++) {
      g.fillStyle = rnd() < 0.5 ? "rgba(0,0,0,.07)" : "rgba(255,255,255,.06)";
      g.fillRect(rnd() * w, rnd() * h, 2, 2);
    }
    g.strokeStyle = "#3A1A08";
    g.lineWidth = 6;
    g.beginPath();
    g.moveTo(0, h / 2);
    g.lineTo(w, h / 2);
    [w / 4, (w * 3) / 4].forEach((x) => { g.moveTo(x, 0); g.lineTo(x, h); });
    g.stroke();
    [0, w / 2, w].forEach((cx) => {
      g.beginPath();
      for (let y = 0; y <= h; y += 4) {
        const dx = Math.sin((y / h) * Math.PI) * 70;
        y === 0 ? g.moveTo(cx - dx, y) : g.lineTo(cx - dx, y);
      }
      g.moveTo(cx, 0);
      for (let y = 0; y <= h; y += 4) g.lineTo(cx + Math.sin((y / h) * Math.PI) * 70, y);
      g.stroke();
    });
  });
  const ball = part(new T.SphereGeometry(R, 32, 24), M(0xffffff, { map: ballTex }), scene);

  const tmp = new T.Vector3();
  const HOLD = new T.Vector3(0, 0.11, -0.04);
  const handPos = (out) => {
    player.updateMatrixWorld(true);
    return armR.tip.getWorldPosition(out);
  };
  const heldBall = (out) => handPos(out).add(HOLD);

  /* ---------- 画面の上の表示（メーター・判定・ヒント） ---------- */
  const el = (cls, html = "") => {
    const d = document.createElement("div");
    d.className = cls;
    d.innerHTML = html;
    host.appendChild(d);
    return d;
  };
  const meterEl = el("pr-meter", '<i class="pr-meter-zone"></i><i class="pr-meter-fill"></i>');
  const zoneEl = meterEl.querySelector(".pr-meter-zone");
  const fillEl = meterEl.querySelector(".pr-meter-fill");
  const callEl = el("pr-call");
  const tipEl = el("pr-tip", "<b>長押し</b>して、メーターが<em>緑</em>で離す！");

  const board = document.querySelector(".pr-board");
  const $ = (id) => document.getElementById(id);
  let makes = 0, shots = 0, streak = 0, best = 0;
  try { best = +localStorage.getItem("prBestStreak") || 0; } catch (e) {}
  function updateBoard(pop) {
    const pad = (n) => String(n).padStart(2, "0");
    if ($("makes")) $("makes").textContent = pad(makes);
    if ($("shots")) $("shots").textContent = pad(shots);
    if ($("streak")) $("streak").textContent = streak;
    if ($("best")) $("best").textContent = best;
    if (!board) return;
    board.classList.toggle("is-hot", streak >= 3);
    if (pop) {
      board.classList.remove("pop");
      void board.offsetWidth;
      board.classList.add("pop");
    }
  }
  updateBoard(false);
  let callTimer = 0;
  function call(text, kind) {
    callEl.textContent = text;
    callEl.className = "pr-call is-" + kind;
    void callEl.offsetWidth;
    callEl.classList.add("is-on");
    clearTimeout(callTimer);
    callTimer = setTimeout(() => callEl.classList.remove("is-on"), 1300);
  }

  /* ---------- ゲーム ----------
     ready:ドリブル中 → rise:長押し中（メーター上昇） → flight:ボールが飛ぶ → back:ボールが戻る */
  const FILL = 0.92;   // メーターが満タンになるまでの秒数
  const TARGET = 0.84; // ベストのタイミング（メーターの位置）
  const zoneHalf = () => Math.max(0.03, 0.07 - streak * 0.006); // 連続で決めるほど緑が細くなる
  let state = "ready", stT = 0, meter = 0, shotT = 0, dribble = 0, riseAt = 0;
  let made = false, judged = false, touched = false, swishT = -1, swishAmp = 1;
  const ballPos = new T.Vector3(), ballVel = new T.Vector3(), from = new T.Vector3();
  const pose = { ...DRIB_UP };
  let target = pose;
  let firstShot = true;

  function startShot() {
    if (state !== "ready") return false;
    state = "rise";
    stT = 0;
    meter = 0;
    riseAt = performance.now(); // メーターは実時間で進める（重い端末でもタイミングがずれない）
    from.copy(ballPos);
    const W = zoneHalf();
    zoneEl.style.bottom = (TARGET - W) * 100 + "%";
    zoneEl.style.height = W * 200 + "%";
    meterEl.className = "pr-meter is-on";
    if (firstShot) {
      firstShot = false;
      tipEl.classList.add("is-gone");
    }
    return true;
  }
  function release() {
    if (state !== "rise") return;
    meter = (performance.now() - riseAt) / 1000 / FILL;
    const err = meter - TARGET, a = Math.abs(err), W = zoneHalf();
    let offset = 0, side = 0, label, kind;
    if (a <= W * 0.5) {
      label = "PERFECT";
      kind = "perfect";
    } else if (a <= W) {
      label = "GOOD";
      kind = "good";
      offset = Math.sign(err) * 0.035 * (a / W);
      side = (Math.random() - 0.5) * 0.03;
    } else {
      label = (a > W + 0.14 ? "VERY " : "") + (err < 0 ? "EARLY" : "LATE");
      kind = "miss";
      offset = Math.sign(err) * Math.min(1.5, 0.11 + (a - W) * 2.2);
      side = (Math.random() - 0.5) * 0.14;
    }
    meterEl.className = "pr-meter is-on is-" + kind;
    call(label, kind);
    // 早いと手前（ショート）、遅いと奥（ロング）を狙ってしまう
    const dir = tmp.set(RIM.x - SPOT.x, 0, RIM.z - SPOT.z).normalize();
    const aim = RIM.clone().addScaledVector(dir, offset).add(new T.Vector3(-dir.z, 0, dir.x).multiplyScalar(side));
    heldBall(ballPos);
    const fly = 1.08;
    ballVel.set((aim.x - ballPos.x) / fly, (aim.y - ballPos.y + (G * fly * fly) / 2) / fly, (aim.z - ballPos.z) / fly);
    state = "flight";
    stT = 0;
    shotT = Math.max(shotT, 0.9);
    made = judged = touched = false;
    shots++;
    updateBoard(false);
  }
  function abortShot() {
    if (state !== "rise") return;
    state = "ready";
    meterEl.className = "pr-meter";
  }
  function onMake() {
    made = judged = true;
    makes++;
    streak++;
    if (streak > best) {
      best = streak;
      try { localStorage.setItem("prBestStreak", best); } catch (e) {}
    }
    swishT = 0;
    swishAmp = touched ? 0.7 : 1.2;
    setTimeout(() => {
      if (streak >= 3) call(streak + " IN A ROW!", "streak");
      else call(touched ? "BUCKET!" : "SWISH!", "make");
    }, 120);
    updateBoard(true);
    if (!reduce) for (let i = 0; i < 26; i++) burst.push({ p: RIM.clone().add(new T.Vector3(0, -0.2, 0)), v: new T.Vector3((Math.random() - 0.5) * 2.6, 1 + Math.random() * 2.4, (Math.random() - 0.5) * 2.6), life: 1.6 + Math.random() });
  }
  function onMiss() {
    judged = true;
    streak = 0;
    updateBoard(false);
  }

  // ボールの物理（リング・ボード・支柱・地面）
  function stepBall(dt) {
    const n = Math.ceil(dt / (1 / 240));
    const h = dt / n;
    for (let s = 0; s < n; s++) {
      const prevY = ballPos.y;
      ballVel.y -= G * h;
      let dx = ballPos.x - RIM.x, dz = ballPos.z - RIM.z, dh = Math.hypot(dx, dz);
      if (ballPos.y < RIM.y && ballPos.y > RIM.y - 0.5 && dh < RIM_R) {
        // ネットで減速
        const k = Math.exp(-h * 22);
        ballVel.x = ballVel.x * k - dx * h * 40;
        ballVel.z = ballVel.z * k - dz * h * 40;
        ballVel.y *= Math.exp(-h * 3);
      }
      ballPos.addScaledVector(ballVel, h);
      dx = ballPos.x - RIM.x;
      dz = ballPos.z - RIM.z;
      dh = Math.hypot(dx, dz) || 1e-6;
      if (!judged && prevY >= RIM.y && ballPos.y < RIM.y && dh < RIM_R) onMake();
      // リング（チューブとの距離で当たり判定）
      const qx = RIM.x + (dx / dh) * RIM_R, qz = RIM.z + (dz / dh) * RIM_R;
      let nx = ballPos.x - qx, ny = ballPos.y - RIM.y, nz = ballPos.z - qz;
      const d = Math.hypot(nx, ny, nz), min = R + TUBE;
      if (d < min) {
        nx /= d; ny /= d; nz /= d;
        ballPos.x += nx * (min - d);
        ballPos.y += ny * (min - d);
        ballPos.z += nz * (min - d);
        const vn = ballVel.x * nx + ballVel.y * ny + ballVel.z * nz;
        if (vn < 0) {
          ballVel.x -= nx * vn * 1.55;
          ballVel.y -= ny * vn * 1.55;
          ballVel.z -= nz * vn * 1.55;
          ballVel.multiplyScalar(0.92);
          if (!touched && -vn > 0.6) rimShake = 1;
          touched = true;
        }
      }
      // バックボード
      if (Math.abs(ballPos.x) < 0.9 + R * 0.5 && ballPos.y > 2.9 - R * 0.5 && ballPos.y < 3.95 + R * 0.5 && ballPos.z - R < BOARD_Z && ballPos.z > BOARD_Z - 0.15 && ballVel.z < 0) {
        ballPos.z = BOARD_Z + R;
        ballVel.z *= -0.6;
        ballVel.x *= 0.9;
        ballVel.y *= 0.9;
        touched = true;
      }
      // 支柱
      const px = ballPos.x, pz = ballPos.z - POLE_Z, pd = Math.hypot(px, pz);
      if (ballPos.y < 3.6 && pd < R + 0.12) {
        const ux = px / pd, uz = pz / pd;
        ballPos.x = ux * (R + 0.12);
        ballPos.z = POLE_Z + uz * (R + 0.12);
        const vn = ballVel.x * ux + ballVel.z * uz;
        if (vn < 0) {
          ballVel.x -= ux * vn * 1.5;
          ballVel.z -= uz * vn * 1.5;
        }
      }
      // 地面
      if (ballPos.y < R) {
        ballPos.y = R;
        if (ballVel.y < 0) {
          ballVel.y = -ballVel.y * 0.66;
          if (ballVel.y < 0.45) ballVel.y = 0;
          ballVel.x *= 0.86;
          ballVel.z *= 0.86;
        }
        if (!judged) onMiss();
      }
      if (ballPos.y <= R + 1e-4 && ballVel.y === 0) {
        const k = Math.exp(-h * 0.9);
        ballVel.x *= k;
        ballVel.z *= k;
      }
    }
  }

  /* ---------- 操作：長押しでジャンプ、離してシュート ---------- */
  let pid = null;
  host.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || pid !== null) return;
    if (startShot()) {
      pid = e.pointerId;
      try { host.setPointerCapture(pid); } catch (err) {}
    }
  });
  const up = (e) => {
    if (e.pointerId !== pid) return;
    pid = null;
    release();
  };
  host.addEventListener("pointerup", up);
  host.addEventListener("lostpointercapture", up);
  host.addEventListener("pointercancel", (e) => {
    // スマホでスクロールに変わったときは打たない
    if (e.pointerId !== pid) return;
    pid = null;
    abortShot();
  });
  host.addEventListener("contextmenu", (e) => e.preventDefault());
  let heroIn = 0;
  const typing = () => {
    const a = document.activeElement;
    return a && a !== document.body && /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(a.tagName);
  };
  addEventListener("keydown", (e) => {
    if (e.code !== "Space" || heroIn < 0.5 || typing() || document.querySelector("dialog[open]")) return;
    e.preventDefault();
    if (!e.repeat) startShot();
  });
  addEventListener("keyup", (e) => {
    if (e.code === "Space" && state === "rise" && pid === null) release();
  });

  let px = 0, py = 0;
  addEventListener("pointermove", (e) => {
    px = e.clientX / innerWidth - 0.5;
    py = e.clientY / innerHeight - 0.5;
  }, { passive: true });

  /* ---------- サイズ ---------- */
  let wide = true, W = 1, H = 1;
  function resize() {
    W = host.clientWidth;
    H = host.clientHeight;
    if (!W || !H) return;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    wide = W > 960;
    // 横長の画面ではコートを右に寄せる。縦長の画面では画角を広げてゴールまで入れる
    if (wide) camera.setViewOffset(W, H, -W * 0.18, 0, W, H);
    else camera.clearViewOffset();
    camera.fov = wide ? 36 : Math.min(50, 34 + Math.max(0, 1.5 - camera.aspect) * 20);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(host);
  resize();

  /* ---------- ループ（画面外では止める） ---------- */
  let visible = true, running = false, last = 0, clock = 0, rimShake = 0;
  const screen = new T.Vector3();
  const ease = (u) => u * u * (3 - 2 * u);
  function frame(now) {
    if (!visible) { running = false; return; }
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000 || 0, 0.05);
    last = now;
    clock += dt;
    stT += dt;

    // フォームとボールの位置
    if (state === "ready") {
      if (reduce) {
        target = KEYS[0][1];
      } else {
        dribble = (dribble + dt / 0.62) % 1;
        target = mixPose(DRIB_UP, DRIB_DN, 0.5 + 0.5 * Math.cos(Math.PI * 2 * (dribble - 0.05)), {});
      }
    } else if (state === "rise") {
      meter = (now - riseAt) / 1000 / FILL;
      if (meter >= 1.1) release();
      target = poseAt(0.3 + (TOP - 0.3) * Math.min(meter, 1));
    } else if (state === "flight") {
      shotT = Math.min(CATCH - 0.05, shotT + dt * (shotT < TOP ? 3 : 1));
      target = poseAt(shotT);
      stepBall(dt);
      if (!judged && stT > 2.4) onMiss();
      if (stT > (made ? 2.0 : 2.5)) {
        state = "back";
        stT = 0;
        from.copy(ballPos);
        meterEl.className = "pr-meter";
      }
    } else if (state === "back") {
      target = KEYS[KEYS.length - 1][1];
    }
    mixPose(pose, target, 1 - Math.exp(-dt * (state === "rise" ? 26 : 14)), pose);
    setPose(pose);

    if (state === "ready") {
      if (reduce) heldBall(ballPos);
      else {
        handPos(tmp);
        ballPos.set(tmp.x + 0.02, 0, tmp.z - 0.06);
        ballPos.y = R + (tmp.y - R - R - 0.02) * Math.abs(Math.cos(Math.PI * dribble));
      }
    } else if (state === "rise") {
      heldBall(tmp);
      ballPos.lerpVectors(from, tmp, ease(Math.min(1, stT / 0.14)));
    } else if (state === "back") {
      const u = Math.min(1, stT / 0.85);
      heldBall(tmp);
      ballPos.lerpVectors(from, tmp, u);
      ballPos.y += Math.sin(u * Math.PI) * 1.3;
      if (u >= 1) {
        state = "ready";
        stT = 0;
        dribble = 0;
      }
    }
    ball.position.copy(ballPos);
    if (state === "flight") {
      ball.rotation.x -= dt * (made ? 4 : 12);
    } else if (state === "ready" && !reduce) {
      ball.rotation.x += dt * 5;
    }

    // ネットとリング
    if (swishT >= 0) {
      swishT += dt;
      swishNet(swishT, swishAmp);
      if (swishT > 1.5) swishT = -1;
    }
    rimShake *= Math.exp(-dt * 8);
    rimMesh.position.y = RIM.y - Math.sin(clock * 60) * 0.008 * rimShake;

    // 景色：雲・木・花びら
    if (!reduce) {
      for (const c of clouds) {
        c.m.position.x += c.speed * dt;
        if (c.m.position.x > 80) c.m.position.x = -80;
      }
      for (const s of sways) {
        s.crown.rotation.z = Math.sin(clock * 0.9 + s.phase) * 0.025;
        s.crown.rotation.x = Math.sin(clock * 0.7 + s.phase * 1.3) * 0.015;
      }
      const pp = petGeo.attributes.position;
      for (let i = 0; i < PET; i++) {
        const sd = petSeed[i];
        let x = pp.getX(i) + dt * (0.9 + Math.sin(clock * 0.5 + sd) * 0.5);
        let y = pp.getY(i) + dt * (Math.sin(clock * 1.7 + sd * 3) * 0.35 - 0.18);
        const z = pp.getZ(i) + dt * Math.cos(clock * 0.6 + sd) * 0.25;
        if (x > 14) x = -14;
        if (y < 0.1) y = 8;
        pp.setXYZ(i, x, y, z);
      }
      pp.needsUpdate = true;
    }
    if (burst.length) {
      burst = burst.filter((b) => (b.life -= dt) > 0);
      // 決まったときの花びらは既存の花びらを一時的に借りて表示
      const pp = petGeo.attributes.position;
      burst.forEach((b, i) => {
        b.v.y -= dt * 1.2;
        b.v.multiplyScalar(Math.exp(-dt * 1.4));
        b.p.addScaledVector(b.v, dt);
        b.p.x += dt * 0.5;
        if (i < PET) pp.setXYZ(i, b.p.x, b.p.y, b.p.z);
      });
      pp.needsUpdate = true;
    }

    // カメラ
    camera.position.set(camBase.x + px * 0.8, camBase.y - py * 0.4 + (reduce ? 0 : Math.sin(clock * 0.5) * 0.04), camBase.z);
    if (!wide) camera.position.x *= 0.55;
    camera.lookAt(camTarget);
    renderer.render(scene, camera);

    // メーターとヒントはフィギュアの横に
    screen.set(SPOT.x + 0.55, 1.75, SPOT.z).project(camera);
    const sx = (screen.x * 0.5 + 0.5) * W, sy = (-screen.y * 0.5 + 0.5) * H;
    meterEl.style.transform = `translate(${sx}px, ${sy}px)`;
    fillEl.style.transform = `scaleY(${Math.min(1, meter)})`;
    screen.set(SPOT.x, 2.25, SPOT.z).project(camera);
    const cx = (screen.x * 0.5 + 0.5) * W, cy = (-screen.y * 0.5 + 0.5) * H;
    callEl.style.left = cx + "px";
    callEl.style.top = cy + "px";
    // スマホではゴールを隠さないよう、ヒントは足もとに出す
    if (!wide) screen.set(SPOT.x, 0, SPOT.z).project(camera);
    tipEl.classList.toggle("is-below", !wide);
    tipEl.style.left = (screen.x * 0.5 + 0.5) * W + "px";
    tipEl.style.top = (-screen.y * 0.5 + 0.5) * H + "px";
  }
  function start() {
    if (running) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(frame);
  }
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    heroIn = e.intersectionRatio;
    if (visible) start();
  }, { threshold: [0, 0.25, 0.5, 0.75, 1] }).observe(host);
  start();
})();
