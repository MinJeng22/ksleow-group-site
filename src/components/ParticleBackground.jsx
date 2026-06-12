import { useEffect, useRef } from "react";

/* ─── Calibrated density — fewer particles on mobile/tablet ────
 * Mobile (< 640): ~22 particles, density 0.00007 px⁻²
 * Tablet (640–1024): ~35 particles, density 0.00010 px⁻²
 * Desktop (> 1024): up to 70 particles, density 0.000152 px⁻²
 *
 * JUMP-FIX: The resize() handler was reinitialising all particles
 * whenever the viewport height changed — on mobile/tablet this
 * fires on every scroll because the browser chrome (address bar)
 * shows/hides, causing particles to teleport.
 * Fix: debounce resize, and only reinitialise if the canvas
 * WIDTH changes (not height-only changes caused by scrolling).
 * ─────────────────────────────────────────────────────────────*/
function densityFor(W) {
  if (W < 640)  return 0.00007;
  if (W < 1024) return 0.00010;
  return 0.000152;
}
function maxParticlesFor(W) {
  if (W < 640)  return 22;
  if (W < 1024) return 35;
  return 70;
}
function minParticlesFor(W) {
  if (W < 640)  return 10;
  if (W < 1024) return 15;
  return 20;
}
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
 * mobile (< 640px) → 1.55–2.8
 * tablet (640–1024) → 1.85–3.25
 * desktop (> 1024) → 1.55–2.85                         */
function particleRadius(W) {
  if (W < 640)  return rand(1.55, 2.8);
  if (W < 1024) return rand(1.85, 3.25);
  return rand(1.55, 2.85);
}

export default function ParticleBackground({
  paused,
  backgroundStart = "#0f1128",
  backgroundEnd = "#07080f",
  lineRgb = "201,168,76",
  dotRgb = "201,168,76",
  highlightRgb = "232,201,122",
  vignetteEnd = "rgba(0,0,0,0.52)",
  dotOutlineRgb = "47,49,90",
  dotOutlineAlpha = 0.42,
  dotOutlineWidth = 0.65,
  densityScale = 1,
  mobileDensityScale = null,
  lineAlphaScale = 1,
  dotAlpha = 0.52,
  obstacleSelector = null,
  obstaclePadding = 0,
}) {
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
    obstacles: [],
    resizeTimer: null,  /* debounce handle */
    obstacleFrame: 0,
  });

  useEffect(() => { stateRef.current.pausedRef = paused; }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s   = stateRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });

    /* ── Full canvas init (only when WIDTH changes or first run) ── */
    function initCanvas(W, H) {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      s.W = W; s.H = H; s.lastW = W;

      s.bgGrad = ctx.createLinearGradient(0, 0, W * 0.5, H);
      s.bgGrad.addColorStop(0, backgroundStart);
      s.bgGrad.addColorStop(1, backgroundEnd);

      s.vigGrad = ctx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, H*0.82);
      s.vigGrad.addColorStop(0, "rgba(0,0,0,0)");
      s.vigGrad.addColorStop(1, vignetteEnd);

      const baseN = Math.min(maxParticlesFor(W), Math.max(minParticlesFor(W), Math.round(W * H * densityFor(W))));
      const currentDensityScale = (mobileDensityScale !== null && W < 640) ? mobileDensityScale : densityScale;
      const N = Math.max(3, Math.round(baseN * currentDensityScale));
      s.particles = Array.from({ length: N }, () => ({
        x:  rand(0, W), y: rand(0, H),
        vx: rand(-SPEED, SPEED) || SPEED,
        vy: rand(-SPEED, SPEED) || SPEED,
        r:  particleRadius(W),
      }));
      updateObstacles();
    }

    function updateObstacles() {
      if (!obstacleSelector) {
        s.obstacles = [];
        return;
      }
      const canvasRect = canvas.getBoundingClientRect();
      s.obstacles = Array.from(document.querySelectorAll(obstacleSelector))
        .map(node => {
          const r = node.getBoundingClientRect();
          return {
            x0: r.left - canvasRect.left - obstaclePadding,
            y0: r.top - canvasRect.top - obstaclePadding,
            x1: r.right - canvasRect.left + obstaclePadding,
            y1: r.bottom - canvasRect.top + obstaclePadding,
          };
        })
        .filter(r => r.x1 > 0 && r.y1 > 0 && r.x0 < s.W && r.y0 < s.H);
    }

    function collideWithObstacles(p, prevX, prevY) {
      for (const r of s.obstacles) {
        if (p.x < r.x0 || p.x > r.x1 || p.y < r.y0 || p.y > r.y1) continue;
        if (prevX <= r.x0) { p.x = r.x0; p.vx = -Math.abs(p.vx); return; }
        if (prevX >= r.x1) { p.x = r.x1; p.vx = Math.abs(p.vx); return; }
        if (prevY <= r.y0) { p.y = r.y0; p.vy = -Math.abs(p.vy); return; }
        if (prevY >= r.y1) { p.y = r.y1; p.vy = Math.abs(p.vy); return; }

        const left = Math.abs(p.x - r.x0);
        const right = Math.abs(r.x1 - p.x);
        const top = Math.abs(p.y - r.y0);
        const bottom = Math.abs(r.y1 - p.y);
        const min = Math.min(left, right, top, bottom);
        if (min === left) { p.x = r.x0; p.vx = -Math.abs(p.vx); return; }
        if (min === right) { p.x = r.x1; p.vx = Math.abs(p.vx); return; }
        if (min === top) { p.y = r.y0; p.vy = -Math.abs(p.vy); return; }
        p.y = r.y1; p.vy = Math.abs(p.vy);
        return;
      }
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
      s.bgGrad.addColorStop(0, backgroundStart);
      s.bgGrad.addColorStop(1, backgroundEnd);

      s.vigGrad = ctx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, H*0.82);
      s.vigGrad.addColorStop(0, "rgba(0,0,0,0)");
      s.vigGrad.addColorStop(1, vignetteEnd);

      /* clamp existing particles to new height — no jump */
      for (const p of s.particles) {
        if (p.y > H) p.y = H;
      }
      updateObstacles();
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
        
        /* If paused (out of view), force a single paint so it doesn't flicker when scrolling back */
        if (!s.isIntersecting && !s.frameId) {
          draw(performance.now(), true);
        }
      }, 80); /* 80ms debounce — ignores rapid transient changes */
    }

    /* ── Draw loop ── */
    function draw(ts, force = false) {
      if (!s.isIntersecting && !force) {
        s.frameId = null;
        return;
      }
      if (!force && ts - s.lastTs < FRAME_MS) { s.frameId = requestAnimationFrame(draw); return; }
      s.lastTs = ts;

      const { W, H, particles, pausedRef, bgGrad, vigGrad, mx, my } = s;

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      if (!pausedRef) {
        if (obstacleSelector && (s.obstacleFrame++ % 24 === 0)) updateObstacles();
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const prevX = p.x;
          const prevY = p.y;
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) { p.x = 0; p.vx =  Math.abs(p.vx); }
          if (p.x > W) { p.x = W; p.vx = -Math.abs(p.vx); }
          if (p.y < 0) { p.y = 0; p.vy =  Math.abs(p.vy); }
          if (p.y > H) { p.y = H; p.vy = -Math.abs(p.vy); }
          collideWithObstacles(p, prevX, prevY);
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
      const alphas = [0.52, 0.34, 0.18, 0.07].map(a => a * lineAlphaScale);
      for (let b = 0; b < BUCKETS; b++) {
        ctx.strokeStyle = `rgba(${lineRgb},${alphas[b]})`;
        ctx.stroke(paths[b]);
      }

      /* mouse highlight lines and glowing particle */
      const hasMouse = mx > -999 && my > -999;
      if (hasMouse) {
        for (let i = 0; i < particles.length; i++) {
          const dx = particles[i].x - mx, dy = particles[i].y - my;
          const dSq = dx*dx + dy*dy;
          if (dSq < MOUSE_R_SQ) {
            const alpha = (1 - dSq / MOUSE_R_SQ) * 0.65;
            ctx.strokeStyle = `rgba(${highlightRgb},${alpha})`;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mx, my);
            ctx.stroke();
          }
        }
        
        /* Draw glowing light particle at mouse cursor */
        ctx.beginPath();
        ctx.arc(mx, my, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${highlightRgb}, 0.9)`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(mx, my, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${highlightRgb}, 0.25)`;
        ctx.fill();
      }



      /* dots — single batch */
      const dotPath = new Path2D();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        dotPath.moveTo(p.x + p.r, p.y);
        dotPath.arc(p.x, p.y, p.r, 0, 6.2832);
      }
      ctx.strokeStyle = `rgba(${dotOutlineRgb},${dotOutlineAlpha})`;
      ctx.lineWidth = dotOutlineWidth;
      ctx.stroke(dotPath);
      ctx.fillStyle = `rgba(${dotRgb},${dotAlpha})`;
      ctx.fill(dotPath);

      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, W, H);

      s.frameId = requestAnimationFrame(draw);
    }

    /* Track mouse via window so the overlay content-wrap div
       doesn't block events from reaching the canvas.
       We translate page coords → canvas-relative coords. */
    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      s.mx = e.clientX - rect.left;
      s.my = e.clientY - rect.top;
    }
    function onMouseLeave() { s.mx = -9999; s.my = -9999; }

    initCanvas(canvas.offsetWidth, canvas.offsetHeight);
    window.addEventListener("resize", onResize);
    /* Use window-level listener so the overlaid content div
       does not swallow mouse events before they reach the canvas */
    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const observer = new IntersectionObserver(([entry]) => {
      s.isIntersecting = entry.isIntersecting;
      if (s.isIntersecting && !s.frameId) {
        s.lastTs = performance.now();
        s.frameId = requestAnimationFrame(draw);
      }
    }, { threshold: 0 });
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      if (s.frameId) cancelAnimationFrame(s.frameId);
      clearTimeout(s.resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [
    backgroundStart, backgroundEnd, lineRgb, dotRgb, highlightRgb, vignetteEnd,
    dotOutlineRgb, dotOutlineAlpha, dotOutlineWidth, densityScale, mobileDensityScale,
    lineAlphaScale, dotAlpha, obstacleSelector, obstaclePadding
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        background: `linear-gradient(135deg, ${backgroundStart} 0%, ${backgroundEnd} 100%)`,
      }}
    />
  );
}
