import { useEffect, useRef } from "react";

/* ─── Calibrated density (N≈50 on 390×844 mobile) ─────────────
 * DENSITY = 50 / (390×844) ≈ 0.000152 particles/px²
 * MAX_N caps at 70 so large screens stay smooth.
 *
 * JUMP-FIX: The resize() handler was reinitialising all particles
 * whenever the viewport height changed — on mobile/tablet this
 * fires on every scroll because the browser chrome (address bar)
 * shows/hides, causing particles to teleport.
 * Fix: debounce resize, and only reinitialise if the canvas
 * WIDTH changes (not height-only changes caused by scrolling).
 * ─────────────────────────────────────────────────────────────*/
const DENSITY     = 0.000152;
const MAX_N       = 70;
const MAX_DIST    = 130;
const MAX_DIST_SQ = MAX_DIST * MAX_DIST;
const SPEED       = 0.38;
const TARGET_FPS  = 40;
const FRAME_MS    = 1000 / TARGET_FPS;
const MAX_DPR     = 1;
const MOUSE_R     = 150;
const MOUSE_R_SQ  = MOUSE_R * MOUSE_R;

function rand(a, b) { return Math.random() * (b - a) + a; }

/* Particle radius scales with screen width:
 * mobile (< 640px) → 0.8–1.6  (finer, more delicate)
 * tablet (640–1024) → 1.0–1.9
 * desktop (> 1024) → 1.3–2.4  (original)               */
function particleRadius(W) {
  if (W < 640)  return rand(0.8, 1.6);
  if (W < 1024) return rand(1.0, 1.9);
  return rand(1.3, 2.4);
}

export default function ParticleBackground({ paused }) {
  const canvasRef = useRef(null);
  const stateRef  = useRef({
    particles: [],
    pausedRef: paused,
    frameId: null,
    lastTs: 0,
    W: 0, H: 0,
    lastW: 0,           /* track width separately to detect real resizes */
    bgGrad: null,
    vigGrad: null,
    mx: -9999, my: -9999,
    resizeTimer: null,  /* debounce handle */
  });

  useEffect(() => { stateRef.current.pausedRef = paused; }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s   = stateRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });

    /* ── Full canvas init (only when WIDTH changes or first run) ── */
    function initCanvas(W, H) {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      s.W = W; s.H = H; s.lastW = W;

      s.bgGrad = ctx.createLinearGradient(0, 0, W * 0.5, H);
      s.bgGrad.addColorStop(0, "#0f1128");
      s.bgGrad.addColorStop(1, "#07080f");

      s.vigGrad = ctx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, H*0.82);
      s.vigGrad.addColorStop(0, "rgba(0,0,0,0)");
      s.vigGrad.addColorStop(1, "rgba(0,0,0,0.52)");

      const N = Math.min(MAX_N, Math.max(20, Math.round(W * H * DENSITY)));
      s.particles = Array.from({ length: N }, () => ({
        x:  rand(0, W), y: rand(0, H),
        vx: rand(-SPEED, SPEED) || SPEED,
        vy: rand(-SPEED, SPEED) || SPEED,
        r:  particleRadius(W),
      }));
    }

    /* ── Height-only resize: just update canvas height & gradients,
     *    DO NOT reinitialise particles (prevents jump on mobile scroll) ── */
    function updateHeightOnly(W, H) {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      s.H = H;

      /* rebuild gradients for new height */
      s.bgGrad = ctx.createLinearGradient(0, 0, W * 0.5, H);
      s.bgGrad.addColorStop(0, "#0f1128");
      s.bgGrad.addColorStop(1, "#07080f");

      s.vigGrad = ctx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, H*0.82);
      s.vigGrad.addColorStop(0, "rgba(0,0,0,0)");
      s.vigGrad.addColorStop(1, "rgba(0,0,0,0.52)");

      /* clamp existing particles to new height — no jump */
      for (const p of s.particles) {
        if (p.y > H) p.y = H;
      }
    }

    /* ── Debounced resize handler ── */
    function onResize() {
      clearTimeout(s.resizeTimer);
      s.resizeTimer = setTimeout(() => {
        const W = canvas.offsetWidth;
        const H = canvas.offsetHeight;
        if (W !== s.lastW) {
          /* Genuine width change (orientation flip, window resize): full reinit */
          initCanvas(W, H);
        } else {
          /* Height-only change (mobile browser chrome appearing/hiding): soft update */
          updateHeightOnly(W, H);
        }
      }, 80); /* 80ms debounce — ignores rapid transient changes */
    }

    /* ── Draw loop ── */
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

      /* particle-to-particle lines — 4 alpha buckets batched */
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

      /* mouse highlight lines */
      const hasMouse = mx > -999 && my > -999;
      if (hasMouse) {
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

      /* dots — single batch */
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

    initCanvas(canvas.offsetWidth, canvas.offsetHeight);
    window.addEventListener("resize", onResize);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    s.frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(s.frameId);
      clearTimeout(s.resizeTimer);
      window.removeEventListener("resize", onResize);
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
