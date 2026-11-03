"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// ── Card themes — each a live ASCII render of one of the studio's own
//    character sets + color modes (no external media). ───────────────
const THEMES: { title: string; chars: string; color: string; rgb: [number, number, number] }[] = [
  { title: "MATRIX",  chars: " ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷ", color: "#00FF41", rgb: [0, 255, 65] },
  { title: "BLOCKS",  chars: " ░▒▓█",               color: "#C6FF00", rgb: [198, 255, 0] },
  { title: "BRAILLE", chars: " ⠁⠃⠇⡇⣇⣧⣷⣿",          color: "#60E0FF", rgb: [96, 224, 255] },
  { title: "HEATMAP", chars: " .:-=+*#%@",           color: "#FF3B5C", rgb: [255, 59, 92] },
  { title: "BINARY",  chars: " 01",                  color: "#BB44FF", rgb: [187, 68, 255] },
  { title: "NEON",    chars: " .:oO0@",              color: "#39FF14", rgb: [57, 255, 20] },
  { title: "DOTS",    chars: " ·•●",                 color: "#FFD700", rgb: [255, 215, 0] },
  { title: "SLASHES", chars: " /|\\-_",              color: "#FF69B4", rgb: [255, 105, 180] },
];

const CSS = `
.vr-root{--bg:#080810;--ink:#F2F2F2;--mid:#6f6f7a;--acc:#C6FF00;--line:rgba(242,242,242,.14);background:var(--bg);color:var(--ink);position:relative;z-index:1}
.vr-root *{box-sizing:border-box;margin:0;padding:0}
.vr-track{height:800vh}
.vr-stage{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;background:var(--bg)}
.vr-hl{position:absolute;left:0;right:0;font-family:var(--font-bebas,'Bebas Neue',sans-serif);font-weight:400;font-size:clamp(52px,9vw,170px);line-height:1;letter-spacing:.015em;white-space:nowrap;text-align:center;will-change:transform}
.vr-l1{top:calc(50% - 1.02em)}
.vr-l2{top:calc(50% + .04em);color:var(--acc);text-shadow:0 0 55px rgba(198,255,0,.28)}
.vr-l1 span,.vr-l2 span{display:inline-block}
.vr-l1 span{margin-right:15vw}
.vr-l2 span{margin-left:15vw}
.vr-cap{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:17em;text-align:center;font-family:var(--font-dm-mono,monospace);font-size:clamp(9px,.74vw,12px);font-weight:500;line-height:1.4;letter-spacing:.18em;text-transform:uppercase;color:var(--mid)}
.vr-gl{position:absolute;inset:0;width:100%;height:100%;display:block}
.vr-glow{position:absolute;left:0;right:0;top:0;height:42%;background:linear-gradient(rgba(198,255,0,.06),rgba(198,255,0,0));pointer-events:none}
.vr-cross{position:absolute;left:32px;right:32px;top:37.5%;height:1px;background:var(--line)}
.vr-cross i{position:absolute;left:50%;top:-.62em;margin-left:-.3em;font:400 13px var(--font-dm-mono,monospace);color:var(--mid);background:var(--bg);padding:0 .3em;line-height:1.2;font-style:normal}
.vr-tag{position:absolute;left:32px;top:30px;font:400 11px var(--font-dm-mono,monospace);letter-spacing:.2em;color:var(--mid);pointer-events:none}
.vr-bot{position:absolute;left:32px;right:32px;bottom:26px;display:grid;grid-template-columns:1fr auto 1fr;align-items:end;font-size:12px;line-height:1.4;pointer-events:none}
.vr-bot p{color:rgba(242,242,242,.4);font-family:var(--font-barlow,system-ui);font-weight:300;max-width:22em}
.vr-bot .vr-mid{font:400 11px var(--font-dm-mono,monospace);letter-spacing:.14em;color:var(--mid)}
.vr-bot .vr-mid s{text-decoration:none;color:rgba(242,242,242,.14);margin:0 .9em}
.vr-bot .vr-r{justify-self:end;display:flex;gap:12px;align-items:center;font:400 11px var(--font-dm-mono,monospace);letter-spacing:.14em;color:var(--mid)}
.vr-bot .vr-r:after{content:"";width:22px;height:1px;background:var(--acc)}
.vr-rule{position:absolute;left:3.5vw;right:3.5vw;top:50%;height:1px;background:var(--line);transform-origin:left;transform:scaleX(0)}
.vr-name{position:absolute;left:0;top:0;padding:6px 11px;background:var(--acc);color:var(--bg);border-radius:99px;font-family:var(--font-dm-mono,monospace);font-size:11px;font-weight:500;letter-spacing:.08em;pointer-events:none;opacity:0;transition:opacity .16s;white-space:nowrap}
@media (max-width:760px){
  .vr-bot{left:18px;right:18px;bottom:18px;grid-template-columns:1fr auto}.vr-bot .vr-mid{display:none}
  .vr-tag{left:18px}.vr-bot p{max-width:17em;font-size:11px}
}
@media (prefers-reduced-motion:reduce){.vr-track{height:100vh}}
`;

export default function ShowreelSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const $ = (sel: string) => root.querySelector(sel) as HTMLElement;

    const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
    const mix = (a: number, b: number, t: number) => a + (b - a) * t;
    const ease = (t: number) => t * t * (3 - 2 * t);
    const out = (t: number) => 1 - (1 - t) ** 3;
    const span = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

    // ── renderer ──────────────────────────────────────────────
    const canvas = $(".vr-gl") as unknown as HTMLCanvasElement;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const FOV = 35;
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);

    // ── ribbon path (centripetal CatmullRom, sampled by arc length) ──
    const SAMPLES = 1200;
    const pathP: THREE.Vector3[] = [];
    const pathT: THREE.Vector3[] = [];
    const PH0 = -1.5, PH1 = Math.PI * 2 + 1.35;
    let PATH_L = 1;
    function buildPath() {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 160; i++) {
        const t = i / 160, ph = mix(PH0, PH1, t), cs = Math.cos(ph), u = 2 * t - 1;
        const depth = cs > 0 ? 7.6 + 16.4 * cs ** 0.9 : 7.6 + 2.2 * cs;
        const edge = 0.84 + 0.5 * span(0.14 - t, 0, 0.14) + 0.8 * span(t, 0.84, 1);
        pts.push(new THREE.Vector3(
          edge * Math.sin(ph) * depth * 0.561,
          0.5 * Math.sign(u) * Math.abs(u) ** 1.4 * depth * 0.63,
          -depth
        ));
      }
      const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal");
      curve.arcLengthDivisions = 1500;
      PATH_L = curve.getLength();
      pathP.length = pathT.length = 0;
      for (let i = 0; i <= SAMPLES; i++) {
        const u = i / SAMPLES;
        pathP.push(curve.getPointAt(u));
        pathT.push(curve.getTangentAt(u));
      }
    }
    const at = (s: number, op: THREE.Vector3, ot: THREE.Vector3) => {
      const f = clamp(s / PATH_L) * SAMPLES, i = Math.min(SAMPLES - 1, Math.floor(f)), k = f - i;
      op.lerpVectors(pathP[i], pathP[i + 1], k);
      ot.lerpVectors(pathT[i], pathT[i + 1], k).normalize();
    };

    // ── live ASCII canvas texture per card ────────────────────
    function makeAsciiCard(theme: (typeof THEMES)[number]) {
      const cv = document.createElement("canvas");
      cv.width = 384; cv.height = 240;
      const cx = cv.getContext("2d")!;
      const CELL = 12, cols = Math.ceil(cv.width / CELL), rows = Math.ceil(cv.height / CELL);
      const chars = theme.chars;
      const draw = (t: number) => {
        cx.fillStyle = "#080810";
        cx.fillRect(0, 0, cv.width, cv.height);
        cx.font = `${CELL - 1}px monospace`;
        cx.textBaseline = "top";
        const tt = t * 0.0011;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const nx = c * 0.32, ny = r * 0.34;
            let v = (Math.sin(nx + tt) + Math.cos(ny - tt * 1.2) + Math.sin((nx + ny) * 0.5 + tt)) / 3;
            v = (v + 1) / 2;
            if (v < 0.18) continue;
            const ci = Math.min(chars.length - 1, Math.max(1, Math.floor(v * chars.length)));
            cx.fillStyle = `rgba(${theme.rgb[0]},${theme.rgb[1]},${theme.rgb[2]},${0.18 + v * 0.75})`;
            cx.fillText(chars[ci], c * CELL, r * CELL);
          }
        }
        cx.fillStyle = `rgba(${theme.rgb[0]},${theme.rgb[1]},${theme.rgb[2]},0.95)`;
        cx.font = `600 13px monospace`;
        cx.fillText("◆ " + theme.title, 14, cv.height - 26);
        cx.fillStyle = "rgba(242,242,242,0.28)";
        cx.font = `12px monospace`;
        cx.fillText("ASCII·ART", cv.width - 84, 14);
      };
      return { cv, cx, draw };
    }

    // ── cards ─────────────────────────────────────────────────
    const CARD_W = 2.1, CARD_H = 1.32, GAP = 0.03, STEP = CARD_W + GAP, NX = 28, NY = 3;
    const vs = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
    const fs = `uniform sampler2D map;uniform float aspect,radius;varying vec2 vUv;
void main(){
  vec2 q=(abs(vUv-.5)-.5)*vec2(aspect,1.)+radius;
  float d=length(max(q,0.))+min(max(q.x,q.y),0.)-radius;
  float px=fwidth(d),a=1.-smoothstep(-px,px,d);
  if(a<.01)discard;
  vec2 uv=vUv;if(!gl_FrontFacing)uv.x=1.-uv.x;
  vec3 c=texture2D(map,uv).rgb;
  float edge=smoothstep(-.012-px,-.012,d);
  gl_FragColor=vec4(mix(c,vec3(.78,1.,0.),edge*.14),a);
}`;
    const cards = THEMES.map((theme, i) => {
      const art = makeAsciiCard(theme);
      const tex = new THREE.CanvasTexture(art.cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      const geo = new THREE.PlaneGeometry(1, 1, NX, NY);
      const mat = new THREE.ShaderMaterial({
        vertexShader: vs, fragmentShader: fs, transparent: true, side: THREE.DoubleSide,
        uniforms: { map: { value: tex }, aspect: { value: CARD_W / CARD_H }, radius: { value: 0.018 } },
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.frustumCulled = false;
      scene.add(mesh);
      return { i, title: theme.title, art, tex, geo, mat, mesh, rect: null as ReturnType<typeof grid> | null, lastDraw: 0 };
    });

    // ── layout ────────────────────────────────────────────────
    const GZ = 8;
    let W = 1, H = 1, asp = 1, cols = 3, rows = 2, tanH = 0.3153;
    function resize() {
      W = window.innerWidth; H = window.innerHeight; asp = W / H;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H, false);
      camera.aspect = asp;
      camera.fov = asp < 16 / 9 ? (Math.atan(0.561 / asp) * 360) / Math.PI : FOV;
      camera.updateProjectionMatrix();
      tanH = Math.tan((camera.fov * Math.PI) / 360);
      cols = asp < 0.9 ? 2 : 3; rows = asp < 0.9 ? 3 : 2;
    }
    function grid(i: number) {
      const vh = 2 * GZ * tanH, vw = vh * asp, gw = vw * (cols === 3 ? 0.74 : 0.88), gap = gw * 0.017;
      const cw = (gw - gap * (cols - 1)) / cols, ch = cw / (CARD_W / CARD_H), gh = ch * rows + gap * 1.6 * (rows - 1);
      const c = i % cols, r = Math.floor(i / cols);
      return { x: -gw / 2 + cw / 2 + c * (cw + gap), y: gh / 2 - ch / 2 - r * (ch + gap * 1.6), w: cw, h: ch, vw, vh, c, r };
    }

    // ── scroll (relative to this section's own track) ─────────
    let target = 0, p = 0;
    const trackEl = $(".vr-track");
    const readScroll = () => {
      const r = trackEl.getBoundingClientRect();
      const trackTopAbs = window.scrollY + r.top;
      const denom = trackEl.offsetHeight - window.innerHeight;
      target = denom > 0 ? clamp((window.scrollY - trackTopAbs) / denom) : 0;
    };
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", resize);
    resize(); buildPath(); readScroll();

    // ── pose ──────────────────────────────────────────────────
    const op = new THREE.Vector3(), ot = new THREE.Vector3(), up = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0), vp = new THREE.Vector3();
    function poseRibbon(c: (typeof cards)[number], head: number) {
      const pos = c.geo.attributes.position, centre = head - c.i * STEP;
      for (let iy = 0; iy <= NY; iy++) for (let ix = 0; ix <= NX; ix++) {
        const k = iy * (NX + 1) + ix, lu = ix / NX - 0.5, lv = 0.5 - iy / NY;
        at(centre + lu * CARD_W, op, ot);
        up.copy(Y).addScaledVector(ot, -Y.dot(ot)).normalize();
        vp.copy(op).addScaledVector(up, lv * CARD_H);
        pos.setXYZ(k, vp.x, vp.y, vp.z);
      }
      pos.needsUpdate = true;
    }
    function poseGrid(c: (typeof cards)[number], q: number) {
      const g = grid(c.i), pos = c.geo.attributes.position;
      const dx = (g.c - (cols - 1) / 2) * 1.2, dy = g.r < rows / 2 ? 1 : -1;
      const ox = dx * g.vw * 0.62 * (1 - q), oy = dy * g.vh * (g.c === 1 ? 0.95 : 0.34) * (1 - q), tilt = (1 - q) * 0.22 * (g.c - 1 || 0.5) * dy;
      const cs = Math.cos(tilt), sn = Math.sin(tilt);
      for (let iy = 0; iy <= NY; iy++) for (let ix = 0; ix <= NX; ix++) {
        const k = iy * (NX + 1) + ix, x = (ix / NX - 0.5) * g.w, y = (0.5 - iy / NY) * g.h;
        pos.setXYZ(k, g.x + ox + x * cs - y * sn, g.y + oy + x * sn + y * cs, -GZ - (1 - q) * 0.6 * Math.sin((ix / NX) * Math.PI));
      }
      pos.needsUpdate = true;
      c.rect = g;
    }

    const RIB_A = 0.14, RIB_B = 0.63;
    const l1 = $(".vr-l1"), l2 = $(".vr-l2"), cap = $(".vr-cap"), rule = $(".vr-rule");
    const fade = [".vr-cross", ".vr-glow"].map($);

    function render(t: number) {
      const pp = p;
      const rise = 1 - out(span(pp, 0, 0.12));
      const run = mix(-50, 76, span(pp, 0, 0.58));
      l1.style.transform = `translate3d(${run}vw,${rise * 34}vh,0)`;
      l2.style.transform = `translate3d(${-run}vw,${rise * 34}vh,0)`;
      const capA = 1 - span(pp, 0.52, 0.57);
      cap.style.opacity = String(capA);
      cap.style.transform = `translate(-50%,calc(-50% + ${rise * 34}vh))`;
      const intro = 1 - span(pp, 0, 0.05);
      fade.forEach((el) => { el.style.opacity = String(intro); });
      rule.style.transform = `scaleX(${ease(span(pp, 0.72, 0.86))})`;

      const pr = span(pp, RIB_A, RIB_B), head = mix(0, PATH_L + cards.length * STEP, pr);
      for (const c of cards) {
        const s = head - c.i * STEP, end = PATH_L - CARD_W;
        if (s < end) {
          c.mesh.visible = s > CARD_W; c.rect = null;
          if (c.mesh.visible) poseRibbon(c, head);
        } else if (c.i < cols * rows) {
          const st = mix(RIB_A, RIB_B, (end + c.i * STEP) / (PATH_L + cards.length * STEP)), q = out(span(pp, st, st + 0.13));
          c.mesh.visible = q > 0.001;
          if (c.mesh.visible) poseGrid(c, q);
        } else { c.mesh.visible = false; c.rect = null; }

        if (c.mesh.visible && t - c.lastDraw > 40) {
          c.art.draw(t); c.tex.needsUpdate = true; c.lastDraw = t;
        }
      }
      renderer.render(scene, camera);
    }

    // ── hover name pill ───────────────────────────────────────
    const nameEl = $(".vr-name");
    const stage = $(".vr-stage");
    const onPointer = (e: PointerEvent) => {
      let hit: (typeof cards)[number] | null = null;
      if (p > 0.86) {
        const nx = e.clientX / W - 0.5, ny = 0.5 - e.clientY / H;
        for (const c of cards) {
          const g = c.rect; if (!g) continue;
          const x = nx * g.vw, y = ny * g.vh;
          if (Math.abs(x - g.x) < g.w / 2 && Math.abs(y - g.y) < g.h / 2) hit = c;
        }
      }
      nameEl.style.opacity = hit ? "1" : "0";
      if (hit) {
        const sr = stage.getBoundingClientRect();
        nameEl.textContent = hit.title;
        nameEl.style.transform = `translate(${e.clientX - sr.left + 14}px,${e.clientY - sr.top + 16}px)`;
      }
    };
    stage.addEventListener("pointermove", onPointer as EventListener);

    // ── loop (paused while the section is off-screen) ─────────
    let raf = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const r = trackEl.getBoundingClientRect();
      const visible = r.bottom > 0 && r.top < window.innerHeight;
      if (!visible) { p = target; return; }
      p += (target - p) * 0.09;
      if (Math.abs(target - p) < 0.00005) p = target;
      render(t);
    };
    if (reduce) { p = target = 0.95; render(performance.now()); }
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", resize);
      stage.removeEventListener("pointermove", onPointer as EventListener);
      cards.forEach((c) => { c.geo.dispose(); c.mat.dispose(); c.tex.dispose(); });
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={rootRef} className="vr-root" id="showreel">
      <style>{CSS}</style>
      <div className="vr-track">
        <section className="vr-stage">
          <div className="vr-tag">◆ IN MOTION</div>
          <h1 aria-label="Made of characters">
            <div className="vr-hl vr-l1" aria-hidden="true"><span>MADE OF</span></div>
            <div className="vr-hl vr-l2" aria-hidden="true"><span>CHARACTERS</span></div>
          </h1>
          <div className="vr-cap">Every character set · every color mode · in motion</div>
          <div className="vr-glow" />
          <div className="vr-cross"><i>+</i></div>
          <div className="vr-rule" />
          <canvas className="vr-gl" />
          <footer className="vr-bot">
            <p>Live ASCII renders of the character sets and color modes the studio ships — swept through space, then settled into a grid.</p>
            <div className="vr-mid">MATRIX<s>/</s>BRAILLE<s>/</s>HEATMAP<s>/</s>NEON</div>
            <div className="vr-r">ENTER STUDIO</div>
          </footer>
          <div className="vr-name" />
        </section>
      </div>
    </div>
  );
}
