import { useEffect, useRef, useState } from "react";

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const catmullRom = (p0, p1, p2, p3, t) => {
  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x: 0.5 * (
      (2 * p1.x) +
      (-p0.x + p2.x) * t +
      (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
      (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
    ),
    y: 0.5 * (
      (2 * p1.y) +
      (-p0.y + p2.y) * t +
      (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
      (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
    ),
  };
};

function buildPath(width, height, variant) {
  const mobile = width < 640;

  const controls = variant === "continuation"
    ? (mobile
      ? [
          { x: 1.14 * width, y: 0.08 * height },
          { x: 0.72 * width, y: 0.14 * height },
          { x: 0.2 * width, y: 0.26 * height },
          { x: 0.82 * width, y: 0.46 * height },
          { x: 0.1 * width, y: 0.68 * height },
          { x: 0.56 * width, y: 0.82 * height },
          { x: 1.12 * width, y: 0.98 * height },
        ]
      : [
          { x: 1.12 * width, y: 0.1 * height },
          { x: 0.9 * width, y: 0.16 * height },
          { x: 0.68 * width, y: 0.36 * height },
          { x: 0.34 * width, y: 0.3 * height },
          { x: 0.14 * width, y: 0.56 * height },
          { x: 0.42 * width, y: 0.72 * height },
          { x: 0.74 * width, y: 0.58 * height },
          { x: 1.1 * width, y: 0.86 * height },
        ])
    : mobile
    ? [
        { x: -0.1 * width, y: 0.34 * height },
        { x: 0.06 * width, y: 0.26 * height },
        { x: 0.2 * width, y: 0.4 * height },
        { x: 0.16 * width, y: 0.68 * height },
        { x: 0.04 * width, y: 0.56 * height },
        { x: 0.28 * width, y: 0.38 * height },
        { x: 0.52 * width, y: 0.66 * height },
        { x: 0.78 * width, y: 0.42 * height },
        { x: 1.08 * width, y: 0.66 * height },
      ]
    : [
        // Optimized Services curve: softer loop + broad waves only.
        // Shape: subtle teardrop loop on the left → large middle sweep → large right sweep.
        { x: -0.1 * width, y: 0.34 * height },
        { x: 0.04 * width, y: 0.26 * height },
        { x: 0.18 * width, y: 0.36 * height },
        { x: 0.16 * width, y: 0.66 * height },
        { x: 0.04 * width, y: 0.56 * height },
        { x: 0.2 * width, y: 0.38 * height },
        { x: 0.38 * width, y: 0.3 * height },
        { x: 0.54 * width, y: 0.68 * height },
        { x: 0.72 * width, y: 0.38 * height },
        { x: 0.9 * width, y: 0.7 * height },
        { x: 1.08 * width, y: 0.58 * height },
      ];

  const padded = [controls[0], ...controls, controls[controls.length - 1]];
  const points = [];
  const samples = mobile ? 44 : 56;

  for (let i = 0; i < padded.length - 3; i += 1) {
    for (let step = 0; step < samples; step += 1) {
      points.push(catmullRom(
        padded[i],
        padded[i + 1],
        padded[i + 2],
        padded[i + 3],
        step / samples
      ));
    }
  }
  points.push(controls[controls.length - 1]);

  const lengths = [0];
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    lengths.push(total);
  }

  return { points, lengths, total };
}

function partialPoints(path, progress) {
  if (!path.points.length || progress <= 0) return [];

  const target = path.total * clamp(progress);
  const result = [path.points[0]];

  for (let i = 1; i < path.points.length; i += 1) {
    if (path.lengths[i] < target) {
      result.push(path.points[i]);
      continue;
    }

    const prevLength = path.lengths[i - 1];
    const segmentLength = path.lengths[i] - prevLength || 1;
    const segmentProgress = clamp((target - prevLength) / segmentLength);
    const prev = path.points[i - 1];
    const next = path.points[i];
    result.push({
      x: prev.x + (next.x - prev.x) * segmentProgress,
      y: prev.y + (next.y - prev.y) * segmentProgress,
    });
    break;
  }

  return result;
}

function drawPolyline(ctx, points, width, strokeStyle) {
  if (points.length < 2) return;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = width;
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
  ctx.restore();
}

export default function ServiceRibbonBackground({
  variant = "services",
  // Start early, but use a longer travel distance so the ribbon does not finish too quickly.
  completeAt = 0.78,
  trigger = 0.78,
  opacity = 1,
}) {
  const canvasRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = () => setEnabled(window.innerWidth > 640);
    sync();
    window.addEventListener("resize", sync, { passive: true });
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return undefined;

    let width = 0;
    let height = 0;
    let path = buildPath(1, 1, variant);
    let targetProgress = 0;
    let progress = 0;
    let rafId = 0;
    let scrollFrameId = 0;
    let isAnimating = false;
    let lastScrollY = window.scrollY || window.pageYOffset || 0;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const visible = partialPoints(path, progress);
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#2f315a");
      gradient.addColorStop(0.44, "#4f5fbd");
      gradient.addColorStop(1, "#7b91d9");

      drawPolyline(ctx, visible, Math.min(36, Math.max(24, width * 0.022)), gradient);
    };

    const tick = () => {
      if (motionQuery.matches) {
        isAnimating = false;
        return;
      }

      const delta = targetProgress - progress;
      if (Math.abs(delta) < 0.001) {
        progress = targetProgress;
        draw();
        isAnimating = false;
        return;
      }

      // Keep the movement smooth and not too fast.
      // Early start/retract is controlled by trigger + completeAt, not by high easing speed.
      const easing = delta < 0 ? 0.18 : 0.22;
      progress += delta * easing;
      draw();
      rafId = requestAnimationFrame(tick);
    };

    const startAnimation = () => {
      if (motionQuery.matches) {
        progress = targetProgress;
        draw();
        return;
      }
      if (isAnimating) return;
      isAnimating = true;
      rafId = requestAnimationFrame(tick);
    };

    const updateProgress = () => {
      const section = canvas.parentElement;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const currentScrollY = window.scrollY || window.pageYOffset || 0;
      const isScrollingUp = currentScrollY < lastScrollY;
      lastScrollY = currentScrollY;

      const triggerLine = window.innerHeight * trigger;
      const travel = Math.max(rect.height * completeAt, 1);

      const drawProgress = (triggerLine - rect.top) / travel;

      // When scrolling upward from below the Services section:
      // - Start retracting as soon as the section touches the viewport from the top.
      // - Finish only when the section has almost left the viewport at the bottom.
      // This makes the retract feel early but gradual, not instant.
      const retractDistance = rect.height + window.innerHeight * 0.85;
      const retractProgress = 1 - (rect.bottom / Math.max(retractDistance, 1));

      targetProgress = clamp(isScrollingUp ? retractProgress : drawProgress);

      if (motionQuery.matches) {
        progress = targetProgress;
        draw();
      } else {
        startAnimation();
      }
    };

    const scheduleProgressUpdate = () => {
      if (scrollFrameId) return;
      scrollFrameId = requestAnimationFrame(() => {
        scrollFrameId = 0;
        updateProgress();
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      path = buildPath(width, height, variant);
      updateProgress();
      draw();
    };

    resize();

    const resizeObserver = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(resize);
    resizeObserver?.observe(canvas);

    window.addEventListener("scroll", scheduleProgressUpdate, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    updateProgress();

    return () => {
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(scrollFrameId);
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", scheduleProgressUpdate);
      window.removeEventListener("resize", resize);
    };
  }, [completeAt, enabled, trigger, variant]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity,
      }}
    />
  );
}
