import { useEffect, useRef } from "react";

const RIBBON_COLORS = [
  "76, 90, 166",
  "201, 168, 76",
  "120, 140, 205",
  "47, 49, 90",
];

function makeRibbon(index, width, height) {
  const count = Math.max(4, Math.min(7, Math.round(width / 260)));
  const points = Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0 : i / (count - 1);
    return {
      x: t * width,
      y: height * (0.18 + ((index * 0.17 + t * 0.42) % 0.66)),
    };
  });

  return {
    points,
    color: RIBBON_COLORS[index % RIBBON_COLORS.length],
    phase: index * 1.37,
    speed: 0.0035 + index * 0.00065,
    amplitude: height * (0.045 + (index % 3) * 0.012),
    drift: 18 + index * 9,
    width: 1.1 + (index % 2) * 0.45,
  };
}

export default function ServiceRibbonBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let ribbons = [];
    let rafId = 0;
    let pointerX = 0.5;
    let pointerY = 0.5;
    let easedPointerX = 0.5;
    let easedPointerY = 0.5;
    let scrollOffset = window.scrollY || 0;
    let easedScroll = scrollOffset;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const ribbonCount = width < 640 ? 4 : 6;
      ribbons = Array.from({ length: ribbonCount }, (_, i) => makeRibbon(i, width, height));
      if (reducedMotion) {
        requestAnimationFrame(() => draw(performance.now()));
      }
    };

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointerX = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      pointerY = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    };

    const onScroll = () => {
      scrollOffset = window.scrollY || 0;
    };

    const drawRibbon = (ribbon, index, time) => {
      const points = ribbon.points.map((point, i) => {
        const t = ribbons.length <= 1 ? 0 : index / (ribbons.length - 1);
        const wave = Math.sin(time * ribbon.speed + ribbon.phase + i * 0.86);
        const cross = Math.cos(time * ribbon.speed * 0.78 + ribbon.phase + i * 0.52);
        const pointerPull = (easedPointerY - 0.5) * height * 0.11 * Math.sin(i + time * 0.0014 + index);
        const scrollPull = Math.sin(easedScroll * 0.0022 + i * 0.9 + index) * height * 0.025;

        return {
          x:
            point.x +
            cross * ribbon.drift +
            (easedPointerX - 0.5) * width * 0.045 * Math.sin(t + i * 0.7),
          y:
            point.y +
            wave * ribbon.amplitude +
            pointerPull +
            scrollPull,
        };
      });

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, `rgba(${ribbon.color}, 0)`);
      gradient.addColorStop(0.18, `rgba(${ribbon.color}, 0.46)`);
      gradient.addColorStop(0.62, `rgba(${ribbon.color}, 0.34)`);
      gradient.addColorStop(1, `rgba(${ribbon.color}, 0)`);

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length - 1; i += 1) {
        const midX = (points[i].x + points[i + 1].x) / 2;
        const midY = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
      }
      const last = points[points.length - 1];
      ctx.lineTo(last.x, last.y);

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = `rgba(${ribbon.color}, 0.3)`;
      ctx.shadowBlur = 22;
      ctx.strokeStyle = gradient;
      ctx.lineWidth = ribbon.width * 6.2;
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(${ribbon.color}, 0.64)`;
      ctx.lineWidth = ribbon.width * 1.15;
      ctx.stroke();
    };

    const draw = (time = 0) => {
      frame += 1;
      easedPointerX += (pointerX - easedPointerX) * 0.045;
      easedPointerY += (pointerY - easedPointerY) * 0.045;
      easedScroll += (scrollOffset - easedScroll) * 0.05;

      ctx.clearRect(0, 0, width, height);

      ribbons.forEach((ribbon, index) => drawRibbon(ribbon, index, time + frame * 8));

      if (!reducedMotion) {
        rafId = requestAnimationFrame(draw);
      }
    };

    resize();

    const resizeObserver = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(resize);
    resizeObserver?.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
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
        opacity: 0.82,
        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.2) 18%, rgba(0,0,0,0.74) 32%, #000 48%, #000 100%)",
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.2) 18%, rgba(0,0,0,0.74) 32%, #000 48%, #000 100%)",
      }}
    />
  );
}
