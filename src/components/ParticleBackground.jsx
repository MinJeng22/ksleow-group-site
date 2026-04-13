import { useEffect, useRef } from "react";

/* ─── Density normalisation ───────────────────────────────────
 * The problem: a fixed particle count (e.g. 50) looks dense on
 * a 390px mobile screen but sparse on a 1440px desktop because
 * the same particles are spread over 13× the area.
 *
 * Fix: calculate N dynamically so particle density (particles
 * per 100×100 px tile) stays constant on every screen size.
 * We also restore mouse-highlight interaction (no repulsion —
 * just a bright line to nearby particles on hover).
 * ─────────────────────────────────────────────────────────────*/
const DENSITY     = 0.0028;   // particles per px²  (tune here)
const MAX_DIST    = 130;
const MAX_DIST_SQ = MAX_DIST * MAX_DIST;
const SPEED       = 0.38;
const TARGET_FPS  = 40;
const FRAME_MS    = 1000 / TARGET_FPS;
const MAX_DPR     = 1;
const MOUSE_R     = 150;      // px — highlight radius
const MOUSE_R_SQ  = MOUSE_R * MOUSE_R;

function rand(a, b) { return Math.random() * (b - a) + a; }

export default function ParticleBackground({ paused }) {
  const canvasRef = useRef(null);
  const stateRef  = useRef({
    particles: [],
    pausedRef: paused,
    frameId: null,
    lastTs: 0,
    W: 0, H: 0,
    bgGrad: null,
    vigGrad: null,
    mx: -9999, my: -9999,
  });

  useEffect(() => { stateRef.current.pausedRef = paused; }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s   = stateRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const W   = canvas.offsetWidth;
      const H   = canvas.offsetHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      s.W = W; s.H = H;

      s.bgGrad = ctx.createLinearGradient(0, 0, W * 0.5, H);
      s.bgGrad.addColorStop(0, "#0f1128");
      s.bgGrad.addColorStop(1, "#07080f");

      s.vigGrad = ctx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, H*0.82);
      s.vigGrad.addColorStop(0, "rgba(0,0,0,0)");
      s.vigGrad.addColorStop(1, "rgba(0,0,0,0.52)");

      /* density-based count: same visual density at any screen size */
      const N = Math.round(W * H * DENSITY);
      s.particles = Array.from({ length: N }, () => ({
        x:  rand(0, W), y: rand(0, H),
        vx: rand(-SPEED, SPEED) || SPEED,
        vy: rand(-SPEED, SPEED) || SPEED,
        r:  rand(1.3, 2.4),
      }));
    }

    function draw(ts) {
      if (ts - s.lastTs < FRAME_MS) { s.frameId = requestAnimationFrame(draw); return; }
      s.lastTs = ts;

      const { W, H, particles, pausedRef, bgGrad, vigGrad, mx, my } = s;

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      if (!pausedRef) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) { p.x = 0; p.vx =  Math.abs(p.vx); }
          if (p.x > W) { p.x = W; p.vx = -Math.abs(p.vx); }
          if (p.y < 0) { p.y = 0; p.vy =  Math.abs(p.vy); }
          if (p.y > H) { p.y = H; p.vy = -Math.abs(p.vy); }
        }
      }

      /* ── particle-to-particle lines (4 alpha buckets, batched) ── */
      const BUCKETS = 4;
      const paths   = Array.from({ length: BUCKETS }, () => new Path2D());
      for (let i = 0; i < particles.length - 1; i++) {
        const ax = particles[i].x, ay = particles[i].y;
        for (let j = i + 1; j < particles.length; j++) {
          const dx = ax - particles[j].x, dy = ay - particles[j].y;
          const dSq = dx*dx + dy*dy;
          if (dSq < MAX_DIST_SQ) {
            const bucket = Math.min(BUCKETS - 1, ((dSq / MAX_DIST_SQ) * BUCKETS) | 0);
            paths[bucket].moveTo(ax, ay);
            paths[bucket].lineTo(particles[j].x, particles[j].y);
          }
        }
      }
      ctx.lineWidth = 0.8;
      const alphas = [0.52, 0.34, 0.18, 0.07];
      for (let b = 0; b < BUCKETS; b++) {
        ctx.strokeStyle = `rgba(201,168,76,${alphas[b]})`;
        ctx.stroke(paths[b]);
      }

      /* ── mouse highlight lines (separate pass, brighter gold) ── */
      const hasMouse = mx > -999 && my > -999;
      if (hasMouse) {
        const mousePath = new Path2D();
        for (let i = 0; i < particles.length; i++) {
          const dx = particles[i].x - mx, dy = particles[i].y - my;
          const dSq = dx*dx + dy*dy;
          if (dSq < MOUSE_R_SQ) {
            const alpha = (1 - dSq / MOUSE_R_SQ) * 0.65;
            ctx.strokeStyle = `rgba(232,201,122,${alpha})`;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mx, my);
            ctx.stroke();
          }
        }
      }

      /* ── dots (single batch) ── */
      ctx.fillStyle = "rgba(201,168,76,0.88)";
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.moveTo(p.x + p.r, p.y);
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
      }
      ctx.fill();

      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, W, H);

      s.frameId = requestAnimationFrame(draw);
    }

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      s.mx = e.clientX - rect.left;
      s.my = e.clientY - rect.top;
    }
    function onMouseLeave() { s.mx = -9999; s.my = -9999; }

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    s.frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(s.frameId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
    />
  );
}
