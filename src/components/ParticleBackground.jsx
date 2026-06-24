import { useEffect, useLayoutEffect, useRef } from "react";

const useIsomorphicLayoutEffect = import.meta.env.SSR ? useEffect : useLayoutEffect;

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
  if (W < 640)  return 0.000085;
  if (W < 1200) return 0.000095;
  return 0.000152;
}
function maxParticlesFor(W) {
  if (W < 640)  return 28;
  if (W < 1200) return 32;
  return 70;
}
function minParticlesFor(W) {
  if (W < 640)  return 14;
  if (W < 1200) return 18;
  return 20;
}
const MAX_DIST    = 130;
const SPEED       = 0.38;
const TARGET_FPS  = 40;
const FRAME_MS    = 1000 / TARGET_FPS;
const MAX_DPR     = 1;
const MOUSE_R     = 150;
const MOUSE_R_SQ  = MOUSE_R * MOUSE_R;
const INTRO_FADE_MS = 520;
const MAX_CLICK_PARTICLES = 100;

function rand(a, b) { return Math.random() * (b - a) + a; }

/* Particle radius scales with screen width:
 * mobile (< 640px) → 1.55–2.8
 * tablet (640–1024) → 1.85–3.25
 * desktop (> 1024) → 1.55–2.85                         */
function particleRadius(W) {
  if (W < 640)  return rand(1.55, 2.8);
  if (W < 1200) return rand(1.85, 3.25);
  return rand(1.55, 2.85);
}

export default function ParticleBackground({
  active = true,
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
    retryFrame: 0,
    introStart: 0,
    touchUntil: 0,
    clickDotSuppressUntil: 0,
  });

  useEffect(() => { stateRef.current.pausedRef = paused; }, [paused]);

  useIsomorphicLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!active) return;
    if (!canvas) return;
    const s   = stateRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    const finePointerMedia = window.matchMedia("(hover: hover) and (pointer: fine)");

    function measureCanvas() {
      const rect = canvas.getBoundingClientRect();
      const parentRect = canvas.parentElement?.getBoundingClientRect();
      const W = Math.round(rect.width || canvas.offsetWidth || parentRect?.width || 0);
      const H = Math.round(rect.height || canvas.offsetHeight || parentRect?.height || 0);
      if (W < 2 || H < 2) return null;
      return { W, H, rect };
    }

    function startLoop(forcePaint = false) {
      if (s.frameId) return;
      s.lastTs = performance.now();
      s.frameId = requestAnimationFrame((ts) => draw(ts, forcePaint));
    }

    function retryWhenSized() {
      if (s.retryFrame) return;
      s.retryFrame = requestAnimationFrame(() => {
        s.retryFrame = 0;
        const size = measureCanvas();
        if (!size) {
          retryWhenSized();
          return;
        }
        initCanvas(size.W, size.H);
        s.isIntersecting = true;
        startLoop(true);
      });
    }

    /* ── Full canvas init (only when WIDTH changes or first run) ── */
    function initCanvas(W, H) {
      if (W < 2 || H < 2) return false;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      s.W = W; s.H = H; s.lastW = W;
      s.maxH = H;
      s.introStart = performance.now();

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
      return true;
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
    function addClickParticle(x, y, count = 1) {
      if (!s.W || !s.H) return;
      for (let c = 0; c < count; c++) {
        s.particles.push({
          x,
          y,
          vx: rand(-SPEED * 1.5, SPEED * 1.5) || SPEED,
          vy: rand(-SPEED * 1.5, SPEED * 1.5) || SPEED,
          r: particleRadius(s.W) * 1.18,
          added: true,
        });
      }

      let addedCount = 0;
      for (let i = s.particles.length - 1; i >= 0; i--) {
        if (!s.particles[i].added) continue;
        addedCount += 1;
        if (addedCount > MAX_CLICK_PARTICLES) {
          s.particles.splice(i, 1);
        }
      }
    }

    function updateHeightOnly(W, H) {
      if (W < 2 || H < 2) return false;
      if (W === s.W && H === s.H) {
        updateObstacles();
        return false;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      s.H = H;
      s.maxH = Math.max(s.maxH || 0, H);

      /* rebuild gradients for new height */
      s.bgGrad = ctx.createLinearGradient(0, 0, W * 0.5, H);
      s.bgGrad.addColorStop(0, backgroundStart);
      s.bgGrad.addColorStop(1, backgroundEnd);

      s.vigGrad = ctx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, H*0.82);
      s.vigGrad.addColorStop(0, "rgba(0,0,0,0)");
      s.vigGrad.addColorStop(1, vignetteEnd);

      updateObstacles();
      return true;
    }

    /* ── Debounced resize handler ── */
    function onResize() {
      clearTimeout(s.resizeTimer);
      s.resizeTimer = setTimeout(() => {
        const size = measureCanvas();
        if (!size) {
          retryWhenSized();
          return;
        }
        const { W, H, rect } = size;

        // Manually verify viewport intersection on resize (safeguard for mobile/Safari 0x0 startup)
        const inViewport = (
          rect.width > 0 &&
          rect.height > 0 &&
          rect.top < window.innerHeight &&
          rect.bottom > 0 &&
          rect.left < window.innerWidth &&
          rect.right > 0
        );
        if (inViewport) {
          s.isIntersecting = true;
        }

        if (W !== s.lastW) {
          /* Genuine width change (orientation flip, window resize): full reinit */
          initCanvas(W, H);
        } else {
          /* Height-only change (mobile browser chrome appearing/hiding): soft update */
          const resized = updateHeightOnly(W, H);
          if (resized && s.isIntersecting) draw(performance.now(), true);
        }
        
        if (s.isIntersecting && !s.frameId) {
          startLoop(true);
        } else if (!s.isIntersecting && !s.frameId) {
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
      if (!W || !H || !bgGrad || !vigGrad) {
        s.frameId = null;
        retryWhenSized();
        return;
      }

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);
      const introAlpha = Math.min(1, Math.max(0, (ts - (s.introStart || ts)) / INTRO_FADE_MS));

      if (!pausedRef) {
        if (obstacleSelector && (s.obstacleFrame++ % 24 === 0)) updateObstacles();
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const prevX = p.x;
          const prevY = p.y;
          p.x += p.vx;
          p.y += p.vy;
          const boundH = s.maxH || H;
          if (p.x < 0) { p.x = 0; p.vx =  Math.abs(p.vx); }
          if (p.x > W) { p.x = W; p.vx = -Math.abs(p.vx); }
          if (p.y < 0) { p.y = 0; p.vy =  Math.abs(p.vy); }
          if (p.y > boundH) { p.y = boundH; p.vy = -Math.abs(p.vy); }
          collideWithObstacles(p, prevX, prevY);
        }
      }

      /* particle-to-particle lines — 4 alpha buckets batched */
      const maxDist = W < 640 ? 146 : W < 1200 ? 150 : MAX_DIST;
      const maxDistSq = maxDist * maxDist;
      const BUCKETS = 4;
      const paths   = Array.from({ length: BUCKETS }, () => new Path2D());
      for (let i = 0; i < particles.length - 1; i++) {
        const ax = particles[i].x, ay = particles[i].y;
        for (let j = i + 1; j < particles.length; j++) {
          const dx = ax - particles[j].x, dy = ay - particles[j].y;
          const dSq = dx*dx + dy*dy;
          if (dSq < maxDistSq) {
            const bucket = Math.min(BUCKETS - 1, ((dSq / maxDistSq) * BUCKETS) | 0);
            paths[bucket].moveTo(ax, ay);
            paths[bucket].lineTo(particles[j].x, particles[j].y);
          }
        }
      }
      ctx.lineWidth = 0.8;
      const alphas = [0.52, 0.34, 0.18, 0.07].map(a => a * lineAlphaScale * introAlpha);
      for (let b = 0; b < BUCKETS; b++) {
        ctx.strokeStyle = `rgba(${lineRgb},${alphas[b]})`;
        ctx.stroke(paths[b]);
      }

      if (!finePointerMedia.matches && s.touchUntil && ts > s.touchUntil) {
        s.mx = -9999;
        s.my = -9999;
        s.touchUntil = 0;
      }

      /* pointer highlight lines and glowing particle */
      const hasMouse = mx > -999 && my > -999;
      const suppressPointerHighlight = s.clickDotSuppressUntil && ts <= s.clickDotSuppressUntil;
      if (hasMouse && !suppressPointerHighlight) {
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
      ctx.strokeStyle = `rgba(${dotOutlineRgb},${dotOutlineAlpha * introAlpha})`;
      ctx.lineWidth = dotOutlineWidth;
      ctx.stroke(dotPath);
      ctx.fillStyle = `rgba(${dotRgb},${dotAlpha * introAlpha})`;
      ctx.fill(dotPath);

      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, W, H);

      s.frameId = requestAnimationFrame(draw);
    }

    /* Track mouse via window so the overlay content-wrap div
       doesn't block events from reaching the canvas.
       We translate page coords → canvas-relative coords. */
    function applyPointerPosition(e, hold = false) {
      if (!s.isIntersecting) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      s.mx = x;
      s.my = y;
      if (hold) {
        const isDesktop = s.W >= 1200;
        const count = isDesktop ? 20 : 1;
        addClickParticle(x, y, count);
        if (e.pointerType !== "mouse") {
          s.clickDotSuppressUntil = performance.now() + 1600;
          s.touchUntil = performance.now() + 1500;
        }
        startLoop(true);
      }
    }
    function onPointerMove(e) {
      if (!finePointerMedia.matches) return;
      applyPointerPosition(e);
    }
    function onPointerDown(e) {
      applyPointerPosition(e, true);
    }
    function onPointerLeave() { s.mx = -9999; s.my = -9999; s.touchUntil = 0; }

    const initialSize = measureCanvas();
    if (initialSize) {
      initCanvas(initialSize.W, initialSize.H);
      draw(performance.now(), true);
    } else {
      retryWhenSized();
    }

    const ro = new ResizeObserver(() => {
      onResize();
    });
    ro.observe(canvas);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    /* Use window-level listener so the overlaid content div
       does not swallow mouse events before they reach the canvas */
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave);

    const observer = new IntersectionObserver(([entry]) => {
      s.isIntersecting = entry.isIntersecting;
      if (s.isIntersecting && !s.frameId) {
        startLoop(true);
      }
    }, { threshold: 0 });
    observer.observe(canvas);

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (s.frameId) cancelAnimationFrame(s.frameId);
        s.frameId = null;
        return;
      }
      onResize();
      if (s.isIntersecting) startLoop(true);
    };
    window.addEventListener("pageshow", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      ro.disconnect();
      if (s.frameId) cancelAnimationFrame(s.frameId);
      if (s.retryFrame) cancelAnimationFrame(s.retryFrame);
      clearTimeout(s.resizeTimer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.removeEventListener("pageshow", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [
    active,
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
