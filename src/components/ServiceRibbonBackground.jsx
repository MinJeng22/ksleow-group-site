import { useEffect, useRef } from "react";

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
          { x: 1.12 * width, y: 0.12 * height },
          { x: 0.7 * width, y: 0.18 * height },
          { x: 0.18 * width, y: 0.3 * height },
          { x: 0.74 * width, y: 0.52 * height },
          { x: 0.2 * width, y: 0.72 * height },
          { x: 1.08 * width, y: 0.96 * height },
        ]
      : [
          { x: 1.08 * width, y: 0.18 * height },
          { x: 0.82 * width, y: 0.22 * height },
          { x: 0.72 * width, y: 0.42 * height },
          { x: 0.38 * width, y: 0.5 * height },
          { x: 0.16 * width, y: 0.66 * height },
          { x: 0.58 * width, y: 0.78 * height },
          { x: 1.08 * width, y: 0.9 * height },
        ])
    : mobile
    ? [
        { x: -0.14 * width, y: 0.14 * height },
        { x: 0.14 * width, y: 0.29 * height },
        { x: 0.74 * width, y: 0.42 * height },
        { x: 0.18 * width, y: 0.6 * height },
        { x: 0.82 * width, y: 0.78 * height },
        { x: 1.1 * width, y: 0.98 * height },
      ]
    : [
        { x: -0.1 * width, y: 0.18 * height },
        { x: 0.22 * width, y: 0.28 * height },
        { x: 0.1 * width, y: 0.58 * height },
        { x: 0.46 * width, y: 0.62 * height },
        { x: 0.62 * width, y: 0.24 * height },
        { x: 0.84 * width, y: 0.24 * height },
        { x: 1.08 * width, y: 0.38 * height },
        { x: 1.05 * width, y: 0.72 * height },
      ];

  const padded = [controls[0], ...controls, controls[controls.length - 1]];
  const points = [];
  const samples = mobile ? 36 : 44;

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

function drawPolyline(ctx, points, width, strokeStyle, shadowColor, shadow = 0, offsetY = 0) {
  if (points.length < 2) return;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y + offsetY);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y + offsetY);
  }
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = width;
  ctx.strokeStyle = strokeStyle;
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = shadow;
  ctx.stroke();
  ctx.restore();
}

export default function ServiceRibbonBackground({
  variant = "services",
  completeAt = 0.58,
  trigger = 0.38,
  opacity = 0.78,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let path = buildPath(1, 1, variant);
    let targetProgress = 0;
    let progress = 0;
    let rafId = 0;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateProgress = () => {
      const section = canvas.parentElement;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const triggerLine = window.innerHeight * trigger;
      const travel = Math.max(rect.height * completeAt, 1);
      targetProgress = clamp((triggerLine - rect.top) / travel);

      if (motionQuery.matches) {
        progress = targetProgress;
        draw();
      }
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

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const visible = partialPoints(path, progress);
      const strokeWidth = width < 640 ? 17 : 26;
      const glowWidth = strokeWidth * 2.45;
      const softBlue = "rgba(67, 97, 238, 0.13)";
      const outerBlue = "rgba(80, 111, 246, 0.18)";
      const highlight = "rgba(255, 255, 255, 0.3)";
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "rgba(43, 76, 228, 0.96)");
      gradient.addColorStop(0.42, "rgba(96, 128, 255, 0.94)");
      gradient.addColorStop(1, "rgba(57, 123, 246, 0.9)");

      drawPolyline(ctx, visible, glowWidth, softBlue, "rgba(67, 97, 238, 0.2)", 34);
      drawPolyline(ctx, visible, strokeWidth + 7, outerBlue, "rgba(80, 111, 246, 0.16)", 18);
      drawPolyline(ctx, visible, strokeWidth, gradient, "rgba(67, 97, 238, 0.24)", 4);
      drawPolyline(ctx, visible, Math.max(2, strokeWidth * 0.1), highlight, "rgba(255,255,255,0.08)", 2, -strokeWidth * 0.08);

      const head = visible[visible.length - 1];
      if (head) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(head.x, head.y, strokeWidth * 0.44, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.82)";
        ctx.shadowColor = "rgba(67, 97, 238, 0.38)";
        ctx.shadowBlur = 22;
        ctx.fill();
        ctx.restore();
      }
    };

    const tick = () => {
      if (!motionQuery.matches) {
        progress += (targetProgress - progress) * 0.12;
        if (Math.abs(targetProgress - progress) < 0.001) progress = targetProgress;
        draw();
        rafId = requestAnimationFrame(tick);
      }
    };

    resize();

    const resizeObserver = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(resize);
    resizeObserver?.observe(canvas);

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    updateProgress();
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", resize);
    };
  }, []);

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
        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.4) 18%, #000 34%, #000 100%)",
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.4) 18%, #000 34%, #000 100%)",
      }}
    />
  );
}
