/* ============================================
   3D フィッティング（three.js）
   入力した体型のマネキンに、選んだサイズの服を着せて表示する。2サイズを並べて比べることもできる
   寸法はすべて cm（1 = 1cm）。体の推定は js/fit.js、服の寸法は goods.js の chart（実寸サイズ表）
   3D が使えない環境では create() が null を返し、goods.js がイラスト表示に切り替える
   ============================================ */
window.Fit3D = (() => {
  let T; // three.js は goods.js があとから読み込む
  const INK = "#141414";
  const SKIN = "#D9CDB9"; // マネキンの色
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function create(host) {
    T = window.THREE;
    if (!T || !window.Fit) return null;
    T.ColorManagement.legacyMode = false;
    let renderer;
    try {
      renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      return null;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    host.prepend(canvas);

    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(22, 1, 10, 3000);
    scene.add(new T.HemisphereLight(0xffffff, 0xb3aa98, 0.7));
    const sun = new T.DirectionalLight(0xfffaf2, 0.9);
    sun.position.set(-120, 260, 240);
    scene.add(sun);

    /* ---------- 材質（アニメ塗り＋輪郭線。サイトのイラストに合わせる） ---------- */
    const steps = new T.DataTexture(new Uint8Array([118, 118, 118, 255, 190, 190, 190, 255, 255, 255, 255, 255]), 3, 1);
    steps.minFilter = steps.magFilter = T.NearestFilter;
    steps.generateMipmaps = false;
    steps.needsUpdate = true;
    const toon = (color, extra) => new T.MeshToonMaterial({ color, gradientMap: steps, ...extra });
    const outline = (w) =>
      new T.ShaderMaterial({
        uniforms: { w: { value: w }, c: { value: new T.Color(INK) } },
        vertexShader: "uniform float w; void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal * w, 1.0); }",
        fragmentShader: "uniform vec3 c; void main(){ gl_FragColor = vec4(c, 1.0); }",
        side: T.BackSide,
      });
    const skinMat = toon(SKIN);
    const lineBody = outline(0.45);
    const lineCloth = outline(0.6);

    let pool = []; // 作り直すたびに破棄するもの
    const keep = (o) => (pool.push(o), o);
    function mesh(geo, mat, parent, line) {
      const m = new T.Mesh(keep(geo), mat);
      if (line) m.add(new T.Mesh(geo, line));
      parent.add(m);
      return m;
    }
    const UP = new T.Vector3(0, 1, 0);
    /* a から b へのびる円すい台（上が a） */
    function limb(a, b, ra, rb, mat, parent, line, open) {
      const len = a.distanceTo(b);
      const m = mesh(new T.CylinderGeometry(ra, rb, len, 28, 1, !!open), mat, parent, line);
      m.position.copy(a).add(b).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(UP, a.clone().sub(b).normalize());
      return m;
    }
    function ball(p, r, mat, parent, line, sy = 1) {
      const m = mesh(new T.SphereGeometry(r, 28, 18), mat, parent, line);
      m.position.copy(p);
      m.scale.y = sy;
      return m;
    }
    /* [半径, 高さ] の点列をなめらかにつないで回転体を作る。kz で前後につぶして楕円にする */
    function lathe(pts, kz, mat, parent, line) {
      const curve = new T.SplineCurve(pts.map(([r, y]) => new T.Vector2(r, y)));
      const geo = new T.LatheGeometry(curve.getPoints(pts.length * 8), 56);
      const m = mesh(geo, mat, parent, line);
      m.scale.z = kz;
      return m;
    }
    const lerpPts = (pts, y) => {
      if (y <= pts[0][1]) return pts[0][0];
      for (let i = 1; i < pts.length; i++) {
        if (y <= pts[i][1]) {
          const [r0, y0] = pts[i - 1];
          const [r1, y1] = pts[i];
          return r0 + ((r1 - r0) * (y - y0)) / (y1 - y0 || 1);
        }
      }
      return pts[pts.length - 1][0];
    };

    /* ---------- 体（マネキン） ---------- */
    const KZ = 0.74; // 胴の前後の厚み ÷ 横幅
    function buildBody(B, g) {
      const a = (c) => c / (Math.PI * (1 + KZ));
      const aC = a(B.chest), aW = a(B.waist), aH = a(B.hip);
      const armpit = B.shoulderY - 10;
      const torso = [
        [0.5, B.crotchY - 3], [aH * 0.8, B.crotchY + 1], [aH, B.hipY], [aW, B.waistY], [aC * 0.97, B.chestY - 8],
        [aC, B.chestY], [aC * 0.99, armpit], [B.sH * 0.8, B.shoulderY - 3.5], [B.sH * 0.58, B.shoulderY + 0.8],
        [B.neckR * 1.5, B.hps - 0.8], [B.neckR, B.hps + 0.5],
      ];
      lathe(torso, KZ, skinMat, g, lineBody);
      limb(new T.Vector3(0, B.hps + 7, 0), new T.Vector3(0, B.hps - 3, 0), B.neckR, B.neckR * 1.05, skinMat, g, lineBody);
      const headR = (B.h - B.hps - 6) / 2.25;
      ball(new T.Vector3(0, B.h - headR * 1.12, 0.6), headR, skinMat, g, lineBody, 1.12);

      // 腕（少し開いた A ポーズ）
      const rUA = (0.3 * B.chest) / (2 * Math.PI) * Math.min(1.25, B.bulk ** 0.5);
      const arms = [];
      [-1, 1].forEach((sd) => {
        const J = new T.Vector3(sd * (B.sH - 3.5), B.shoulderY - 4, 0);
        const dir = new T.Vector3(sd * Math.sin(0.17), -Math.cos(0.17), 0);
        const E = J.clone().addScaledVector(dir, B.upperArm);
        const W = E.clone().addScaledVector(dir, B.foreArm);
        ball(J, rUA * 1.12, skinMat, g, lineBody);
        limb(J, E, rUA, rUA * 0.8, skinMat, g, lineBody);
        ball(E, rUA * 0.8, skinMat, g);
        limb(E, W, rUA * 0.8, rUA * 0.6, skinMat, g, lineBody);
        const hand = ball(W.clone().addScaledVector(dir, 4.2), rUA * 0.85, skinMat, g, lineBody);
        hand.scale.set(0.62, 1.35, 1);
        arms.push({ J, dir, r: (t) => (t < B.upperArm ? rUA - (rUA * 0.2 * t) / B.upperArm : rUA * 0.8 - (rUA * 0.2 * (t - B.upperArm)) / B.foreArm) });
      });

      // 脚
      const rTh = (0.6 * B.hip) / (2 * Math.PI);
      const legs = [];
      [-1, 1].forEach((sd) => {
        const H = new T.Vector3(sd * aH * 0.48, B.crotchY + 5, 0);
        const K = new T.Vector3(sd * aH * 0.5, B.kneeY, 0.6);
        const A = new T.Vector3(sd * aH * 0.53, B.h * 0.045, 0);
        limb(H, K, rTh, rTh * 0.64, skinMat, g, lineBody);
        ball(K, rTh * 0.64, skinMat, g);
        limb(K, A, rTh * 0.66, rTh * 0.4, skinMat, g, lineBody);
        const foot = mesh(new T.CapsuleGeometry(rTh * 0.45, B.h * 0.12, 6, 16), skinMat, g, lineBody);
        foot.rotation.x = Math.PI / 2;
        foot.position.set(A.x, rTh * 0.45, A.z + B.h * 0.045);
        legs.push({ H, K, r: (y) => rTh * (0.64 + (0.36 * (y - B.kneeY)) / (H.y - B.kneeY)) });
      });

      return { torso, armpit, aH, arms, legs, rUA };
    }

    /* ---------- 服の柄（キャンバスに描いて、胴に沿った曲面に貼る） ---------- */
    const courtImg = new Image();
    courtImg.src = "images/goods-2.jpg";
    courtImg.onload = () => current && build(current);
    function printTex(print, dark) {
      const c = document.createElement("canvas");
      c.width = 512;
      c.height = 256;
      const x = c.getContext("2d");
      const ink = dark ? "#F0E3C8" : INK;
      if (print === "court") {
        x.fillStyle = "#2A6FA8";
        x.fillRect(136, 20, 240, 120);
        if (courtImg.complete && courtImg.naturalWidth) x.drawImage(courtImg, 0, courtImg.naturalHeight * 0.18, courtImg.naturalWidth, courtImg.naturalHeight * 0.64, 136, 20, 240, 120);
        x.lineWidth = 8;
        x.strokeStyle = INK;
        x.strokeRect(136, 20, 240, 120);
        x.font = '38px "Permanent Marker", cursive';
        x.fillStyle = ink;
        x.textAlign = "center";
        x.fillText("Be a baller.", 256, 200);
      } else {
        x.translate(256, 128);
        x.rotate(-0.1);
        x.font = '78px "Permanent Marker", cursive';
        x.fillStyle = ink;
        x.textAlign = "center";
        x.fillText("Be a baller.", 0, 24);
        x.beginPath();
        x.moveTo(-150, 58);
        x.quadraticCurveTo(0, 46, 150, 34);
        x.lineWidth = 10;
        x.lineCap = "round";
        x.strokeStyle = ink;
        x.stroke();
      }
      const t = keep(new T.CanvasTexture(c));
      t.encoding = T.sRGBEncoding;
      return t;
    }
    /* 胴の表面に沿った曲面パッチ（前面中央） */
    function patch(r, kz, y0, y1, arc, mat, parent) {
      const m = mesh(new T.CylinderGeometry(r, r, y1 - y0, 24, 1, true, -arc / 2, arc), mat, parent);
      m.position.y = (y0 + y1) / 2;
      m.scale.z = kz;
      return m;
    }

    /* ---------- 服 ---------- */
    const KG = 0.8; // 服の前後 ÷ 横幅（体より少し丸く落ちる）
    const isDark = (hex) => {
      const n = parseInt(hex.slice(1), 16);
      return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 < 128;
    };
    function buildTop(B, body, d, item, g) {
      const cloth = keep(toon(item.color, { side: T.DoubleSide }));
      const rib = keep(toon(new T.Color(item.color).multiplyScalar(0.88)));
      const gap = 0.7;
      const need = (y) => {
        const r = lerpPts(body.torso, y);
        return Math.max(r + gap, (r * KZ + gap) / KG);
      };
      const aG = (2 * d.width) / (Math.PI * (1 + KG));
      const hem = B.hps + B.drape - d.length;
      const rS = Math.max(d.shoulder / 2, need(B.shoulderY - 3.5));
      const neck = B.neckR + 2.6;
      const hood = item.art === "hoodie";
      const pts = [];
      const ribH = hood ? 6 : 0;
      if (hood) pts.push([Math.max(aG * 0.9, need(hem)), hem]);
      for (let y = hem + ribH; y < body.armpit; y += 6) pts.push([Math.max(aG, need(y)), y]);
      pts.push([Math.max(aG, need(body.armpit)), body.armpit]);
      pts.push([Math.max(rS * 0.94, need(B.shoulderY - 3.5)), B.shoulderY - 3]);
      pts.push([Math.max(rS * 0.7, need(B.shoulderY + 0.8) + 0.4), B.shoulderY + 1.2]);
      pts.push([neck + 1, B.hps - 0.2]);
      pts.push([neck, B.hps + 0.8]);
      const torso = lathe(pts, KG, cloth, g, lineCloth);
      const rAt = (y) => lerpPts(pts, y);

      // 首まわりのリブ
      const collar = mesh(new T.TorusGeometry(neck, 1.0, 10, 48), rib, g, lineCloth);
      collar.rotation.x = Math.PI / 2;
      collar.position.y = B.hps + 0.8;
      collar.scale.y = KG;
      if (hood) {
        limb(new T.Vector3(0, hem + ribH + 0.4, 0), new T.Vector3(0, hem, 0), pts[1][0], pts[0][0], rib, g, lineCloth, true).scale.z = KG;
      }

      // 袖
      const drop = d.shoulder / 2 - B.sH;
      const long = item.art !== "tee";
      body.arms.forEach(({ J, dir, r }) => {
        const t0 = -3;
        const t1 = 3.5 + Math.max(drop, -2) + d.sleeve;
        const r1 = Math.max((d.width * 0.45) / Math.PI, r(0) + 1.4);
        const end = Math.min(t1, B.upperArm + B.foreArm + 6);
        const rEnd = long ? Math.max((d.width * 0.19) / Math.PI, r(Math.min(end, B.upperArm + B.foreArm)) + 0.6) : Math.max((d.width * 0.34) / Math.PI, r(end) + 0.8);
        const a = J.clone().addScaledVector(dir, t0);
        const b = J.clone().addScaledVector(dir, end - (long ? 5 : 0));
        limb(a, b, r1, long ? Math.max(rEnd * 1.35, r((end - 5)) + 1) : rEnd, cloth, g, lineCloth, true);
        if (long) limb(b, J.clone().addScaledVector(dir, end), rEnd, rEnd, rib, g, lineCloth, true);
      });

      // 胸のプリント
      const yP = hood ? B.chestY - 7 : B.chestY + 3;
      const rp = rAt(yP) + 0.25;
      const pm = keep(toon("#ffffff", { map: printTex(item.print, isDark(item.color)), transparent: true, alphaTest: 0.4 }));
      patch(rp, KG, yP - rp * 0.36, yP + rp * 0.36, 1.45, pm, g);

      if (hood) {
        // フード（背中側に下ろした状態）
        const headR = (B.h - B.hps - 6) / 2.25;
        const hoodM = mesh(new T.SphereGeometry(headR * 1.18, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.6), cloth, g, lineCloth);
        hoodM.position.set(0, B.hps - 1.5, -(B.neckR + headR * 0.55));
        hoodM.rotation.x = -2.15;
        hoodM.scale.set(1.05, 0.62, 0.95);
        // ひも
        const zf = (y) => rAt(y) * KG + 0.5;
        [-1, 1].forEach((sd) => {
          const top = new T.Vector3(sd * 3.4, B.hps - 0.5, zf(B.hps - 3));
          const bot = new T.Vector3(sd * 4.2, B.hps - 14, zf(B.hps - 14));
          limb(top, bot, 0.5, 0.5, keep(toon("#F2EEE4")), g, lineCloth);
        });
        // カンガルーポケット
        const y0 = hem + ribH + 5;
        const y1 = y0 + 19;
        const pc = document.createElement("canvas");
        pc.width = pc.height = 256;
        const px = pc.getContext("2d");
        px.fillStyle = new T.Color(item.color).multiplyScalar(0.94).getStyle();
        px.strokeStyle = INK;
        px.lineWidth = 9;
        px.beginPath();
        px.moveTo(40, 6);
        px.lineTo(216, 6);
        px.lineTo(250, 250);
        px.lineTo(6, 250);
        px.closePath();
        px.fill();
        px.stroke();
        const ptex = keep(new T.CanvasTexture(pc));
        ptex.encoding = T.sRGBEncoding;
        const pmat = keep(toon("#ffffff", { map: ptex, transparent: true, alphaTest: 0.4 }));
        patch(rAt((y0 + y1) / 2) + 0.3, KG, y0, y1, 1.35, pmat, g);
      }
      return { top: B.h + 22, bottom: -6, focusTop: B.h + 14, focusBottom: hem - 14 };
    }

    function buildShorts(B, body, d, item, g) {
      const cloth = keep(toon(item.color, { side: T.DoubleSide }));
      const band = keep(toon(new T.Color(item.color).multiplyScalar(0.86)));
      const line = keep(toon(isDark(item.color) ? "#F0E3C8" : "#03491F", { side: T.DoubleSide }));
      const top = B.waistY - 3;
      const hem = top - d.length;
      const crotch = Math.min(B.crotchY - 2, top - (d.length - d.inseam));
      const gap = 0.7;
      const need = (y) => {
        const r = lerpPts(body.torso, y);
        return Math.max(r + gap, (r * KZ + gap) / KG);
      };
      const aHg = (2 * d.hip) / (Math.PI * (1 + KG));
      // ウエストはゴムで体に沿い、おしりのあたりで最大になる
      const pts = [
        [need(top) + 0.2, top], [Math.max(aHg * 0.84, need(top - 8)), top - 8], [Math.max(aHg * 0.94, need(B.hipY)), B.hipY],
        [Math.max(aHg * 0.86, need(crotch + 6)), crotch + 6], [aHg * 0.5, crotch],
      ].sort((p, q) => p[1] - q[1]);
      lathe(pts, KG, cloth, g, lineCloth);
      const wb = limb(new T.Vector3(0, top + 0.6, 0), new T.Vector3(0, top - 3.6, 0), need(top) + 0.4, need(top - 3.6) + 0.4, band, g, lineCloth, true);
      wb.scale.z = KG;
      const rT = d.thigh / Math.PI;
      body.legs.forEach(({ H, K, r }, i) => {
        const sd = i === 0 ? -1 : 1;
        const x = (y) => H.x + ((K.x - H.x) * (H.y - y)) / (H.y - K.y);
        const yTop = crotch + 15;
        const rr = (y) => Math.max(rT, r(y) + 1.2) * (y > crotch ? 1.08 : 1);
        const a = new T.Vector3(x(yTop), yTop, 0);
        const b = new T.Vector3(x(hem) + sd * 0.8, hem, 0.3);
        limb(a, b, rr(yTop), rr(hem) * 0.98, cloth, g, lineCloth, true);
        // サイドライン
        const s = mesh(new T.CylinderGeometry(rr(yTop) + 0.3, rr(hem) * 0.98 + 0.3, a.distanceTo(b) - 1, 8, 1, true, sd * (Math.PI / 2 - 0.5) - 0.14, 0.28), line, g);
        s.position.copy(a).add(b).multiplyScalar(0.5);
        s.quaternion.setFromUnitVectors(UP, a.clone().sub(b).normalize());
      });
      return { top: B.h + 22, bottom: -6, focusTop: B.chestY + 10, focusBottom: -6 };
    }

    /* ---------- 床の影 ---------- */
    const shadowTex = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const x = c.getContext("2d");
      const gr = x.createRadialGradient(64, 64, 4, 64, 64, 62);
      gr.addColorStop(0, "rgba(16,38,26,0.32)");
      gr.addColorStop(1, "rgba(16,38,26,0)");
      x.fillStyle = gr;
      x.fillRect(0, 0, 128, 128);
      return new T.CanvasTexture(c);
    })();
    const shadowMat = new T.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });

    /* ---------- 組み立て ---------- */
    const figures = [];
    let current = null;
    let frame = "up";
    let yaw = 0;
    let span = { top: 200, bottom: 0 };

    function figure(B, item) {
      const g = new T.Group();
      const body = buildBody(B, g);
      const f = item.kind === "shorts" ? buildShorts(B, body, item.dims, item, g) : buildTop(B, body, item.dims, item, g);
      const sh = new T.Mesh(keep(new T.PlaneGeometry(B.h * 0.42, B.h * 0.26)), shadowMat);
      sh.rotation.x = -Math.PI / 2;
      sh.position.y = 0.2;
      g.add(sh);
      return { g, f };
    }

    function build(opts) {
      current = opts;
      figures.forEach((f) => scene.remove(f.g));
      figures.length = 0;
      pool.forEach((o) => o.dispose && o.dispose());
      pool = [];
      const B = Fit.body(opts.profile);
      const list = [opts.item, opts.compare].filter(Boolean);
      const gapX = B.h * 0.36;
      list.forEach((item, i) => {
        const fig = figure(B, { ...opts.item, ...item });
        fig.g.position.x = list.length > 1 ? (i === 0 ? -gapX : gapX) : 0;
        fig.g.rotation.y = yaw;
        scene.add(fig.g);
        figures.push(fig);
      });
      const f = figures[0].f;
      span = frame === "up" ? { top: f.focusTop, bottom: f.focusBottom } : { top: f.top, bottom: f.bottom };
      span.half = list.length > 1 ? gapX + B.h * 0.2 : B.h * 0.2;
      place();
    }

    function place() {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const t = Math.tan(T.MathUtils.degToRad(camera.fov / 2));
      const hh = (span.top - span.bottom) / 2;
      const dist = Math.max(hh / t, span.half / (t * camera.aspect)) * 1.06;
      const cy = (span.top + span.bottom) / 2;
      camera.position.set(0, cy + dist * 0.06, dist);
      camera.lookAt(0, cy, 0);
      camera.updateProjectionMatrix();
      draw();
    }

    let queued = false;
    function draw() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        figures.forEach((f) => (f.g.rotation.y = yaw));
        renderer.render(scene, camera);
      });
    }

    /* ---------- 回転（ドラッグ・矢印キー・ボタン） ---------- */
    let tween = 0;
    function turnTo(target) {
      cancelAnimationFrame(tween);
      const from = yaw;
      // いちばん近い回り方で
      let to = target;
      while (to - from > Math.PI) to -= Math.PI * 2;
      while (to - from < -Math.PI) to += Math.PI * 2;
      if (reduce) {
        yaw = to;
        return draw();
      }
      const t0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - t0) / 450);
        yaw = from + (to - from) * (1 - (1 - k) ** 3);
        draw();
        if (k < 1) tween = requestAnimationFrame(step);
      };
      tween = requestAnimationFrame(step);
    }
    let drag = null;
    canvas.addEventListener("pointerdown", (e) => {
      cancelAnimationFrame(tween);
      drag = { x: e.clientX, yaw };
      canvas.setPointerCapture(e.pointerId);
      host.classList.add("is-dragging");
    });
    canvas.addEventListener("pointermove", (e) => {
      if (!drag) return;
      yaw = drag.yaw + (e.clientX - drag.x) * 0.011;
      draw();
    });
    const end = () => {
      drag = null;
      host.classList.remove("is-dragging");
    };
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointercancel", end);
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "img");
    canvas.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        turnTo(yaw + (e.key === "ArrowLeft" ? -Math.PI / 4 : Math.PI / 4));
      }
    });

    new ResizeObserver(() => current && place()).observe(host);
    document.fonts && document.fonts.load('40px "Permanent Marker"').then(() => current && build(current));

    return {
      canvas,
      show(opts) {
        build(opts);
      },
      view(name) {
        turnTo({ front: 0, side: -Math.PI / 2, back: Math.PI }[name] ?? 0);
      },
      intro() {
        if (reduce) return;
        yaw = -0.6;
        turnTo(0);
      },
      frame(f) {
        frame = f;
        if (current) build(current);
      },
    };
  }

  return { create };
})();
