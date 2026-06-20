import { useEffect, useRef } from "react";

const SQRT_3 = Math.sqrt(3);
const DPR_LIMIT = 1.25;

function hexPath(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI / 180) * (60 * i);
    const px = x + r * Math.cos(angle);
    const py = y + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

export default function StealthHoneycombGrid({
  background = "#f5f5f8",
  lineRgb = "47,49,90",
  glowRgb = "201,168,76",
  lineOpacity = 0.042,
  cellFillOpacity = 0.012,
  wash = true,
  fullCellsOnly = false,
  titleGlow = true,
  titleGlowBounds,
  titleGlowTarget,
  className = "",
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    cells: [],
    persistentGlow: [],
    active: new Map(),
    frame: 0,
    w: 0,
    h: 0,
    radius: 34,
    pointerFine: false,
    lastActivated: -1,
    touchHoldFrames: new Map(),
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    const s = stateRef.current;
    const finePointerMedia = window.matchMedia("(hover: hover) and (pointer: fine)");

    function measure() {
      const rect = canvas.getBoundingClientRect();
      return {
        w: Math.round(rect.width || canvas.parentElement?.clientWidth || 0),
        h: Math.round(rect.height || canvas.parentElement?.clientHeight || 0),
      };
    }

    function getTitleGlowArea(w, h, radius) {
      const target = titleGlowTarget ? document.querySelector(titleGlowTarget) : null;
      if (target) {
        const canvasRect = canvas.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(target);
        const textRect = range.getBoundingClientRect();
        range.detach?.();
        const targetRect = textRect.width > 0 && textRect.height > 0
          ? textRect
          : target.getBoundingClientRect();
        const titleLeft = targetRect.left - canvasRect.left;
        const titleTop = targetRect.top - canvasRect.top;
        const titleWidth = targetRect.width;
        const titleHeight = targetRect.height;
        return {
          centerX: titleLeft + titleWidth * 0.5 + radius * 0.52,
          centerY: titleTop + titleHeight * 0.5,
          radiusX: Math.max(titleWidth * 0.72 + radius * 2.15, radius * 4.6),
          radiusY: Math.max(titleHeight * 0.88 + radius * 0.92, radius * 2.15),
        };
      }

      return {
        centerX: w < 768 ? w * 0.5 : Math.min(w * 0.22, 290),
        centerY: w < 768 ? 104 : 132,
        radiusX: w < 768 ? Math.min(w * 0.34, 190) : 235,
        radiusY: w < 768 ? 86 : 78,
      };
    }

    function buildCells(w, h) {
      const radius = w >= 1600 ? 38 : w >= 1180 ? 34 : w >= 640 ? 31 : 29;
      const dx = radius * 1.5;
      const dy = SQRT_3 * radius;
      const cells = [];
      const cols = Math.ceil(w / dx) + 3;
      const rows = Math.ceil(h / dy) + 3;

      for (let col = -1; col < cols; col += 1) {
        for (let row = -1; row < rows; row += 1) {
          cells.push({
            x: col * dx + radius,
            y: row * dy + (col % 2 ? dy / 2 : 0),
          });
        }
      }

      s.radius = radius;
      s.cells = cells;
      const glowArea = {
        ...getTitleGlowArea(w, h, radius),
        ...(titleGlowBounds || {}),
      };
      s.persistentGlow = titleGlow
        ? cells
          .map((cell, index) => ({ cell, index }))
          .map(({ cell, index }) => {
            const nx = (cell.x - glowArea.centerX) / Math.max(1, glowArea.radiusX);
            const ny = (cell.y - glowArea.centerY) / Math.max(1, glowArea.radiusY);
            const distance = Math.sqrt(nx * nx + ny * ny);
            if (distance > 1) return { index, intensity: 0 };
            return {
              index,
              intensity: 0.42 + (1 - distance) * 0.58,
            };
          })
          .filter(({ intensity }) => intensity > 0)
        : [];
    }

    function resize() {
      const { w, h } = measure();
      if (w < 2 || h < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_LIMIT);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      s.w = w;
      s.h = h;
      s.pointerFine = finePointerMedia.matches;
      buildCells(w, h);
      draw(performance.now(), true);
    }

    function findNearestCell(x, y) {
      let best = -1;
      let bestDistance = Infinity;
      const maxDistance = s.radius * s.radius * 1.05;
      for (let i = 0; i < s.cells.length; i += 1) {
        const cell = s.cells[i];
        const dx = cell.x - x;
        const dy = cell.y - y;
        const dist = dx * dx + dy * dy;
        if (dist < bestDistance) {
          best = i;
          bestDistance = dist;
        }
      }
      return bestDistance <= maxDistance ? best : -1;
    }

    function activateFromEvent(event, force = false) {
      if (!force && !s.pointerFine) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      const index = findNearestCell(x, y);
      if (index < 0) return;
      if (!force && index === s.lastActivated) return;
      s.lastActivated = index;
      s.active.set(index, 1);
      if (force && !s.pointerFine) {
        s.touchHoldFrames.set(index, 82);
      }
      start();
    }

    function drawBackground() {
      ctx.clearRect(0, 0, s.w, s.h);
      if (background && background !== "transparent") {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, s.w, s.h);
      }

      if (wash) {
        const washGradient = ctx.createRadialGradient(s.w * 0.22, s.h * 0.12, 0, s.w * 0.22, s.h * 0.12, s.w * 0.72);
        washGradient.addColorStop(0, "rgba(255,255,255,0.46)");
        washGradient.addColorStop(0.42, "rgba(255,255,255,0.18)");
        washGradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = washGradient;
        ctx.fillRect(0, 0, s.w, s.h);
      }
    }

    function drawGlowCell(cell, intensity, radiusScale = 2.45) {
      const glow = ctx.createRadialGradient(cell.x, cell.y, 0, cell.x, cell.y, s.radius * radiusScale);
      glow.addColorStop(0, `rgba(${glowRgb},${0.24 * intensity})`);
      glow.addColorStop(0.42, `rgba(${glowRgb},${0.11 * intensity})`);
      glow.addColorStop(1, `rgba(${glowRgb},0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cell.x, cell.y, s.radius * radiusScale, 0, Math.PI * 2);
      ctx.fill();

      hexPath(ctx, cell.x, cell.y, s.radius * 0.94);
      ctx.fillStyle = `rgba(${glowRgb},${0.095 * intensity})`;
      ctx.fill();
      ctx.lineWidth = 1.05;
      ctx.strokeStyle = `rgba(${glowRgb},${0.32 * intensity})`;
      ctx.stroke();
    }

    function draw(ts, force = false) {
      if (!s.w || !s.h) {
        s.frame = 0;
        return;
      }

      drawBackground();

      ctx.save();
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = `rgba(${lineRgb},${lineOpacity})`;
      ctx.fillStyle = `rgba(255,255,255,${cellFillOpacity})`;
      for (const cell of s.cells) {
        if (
          fullCellsOnly
          && (
            cell.x - s.radius < 0
            || cell.x + s.radius > s.w
            || cell.y - s.radius < 0
            || cell.y + s.radius > s.h
          )
        ) {
          continue;
        }
        hexPath(ctx, cell.x, cell.y, s.radius);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();

      for (const glowCell of s.persistentGlow) {
        const cell = s.cells[glowCell.index];
        if (cell) drawGlowCell(cell, 0.42 + glowCell.intensity * 0.48, 1.66);
      }

      let keepAnimating = false;
      for (const [index, level] of s.active.entries()) {
        const cell = s.cells[index];
        if (!cell) {
          s.active.delete(index);
          continue;
        }

        const intensity = Math.max(0, Math.min(1, level));
        drawGlowCell(cell, intensity, 2.45);

        const holdFrames = s.touchHoldFrames.get(index) || 0;
        const next = holdFrames > 0 ? level : level - (s.pointerFine ? 0.022 : 0.0065);
        if (holdFrames > 0) {
          s.touchHoldFrames.set(index, holdFrames - 1);
        } else {
          s.touchHoldFrames.delete(index);
        }
        if (next <= 0) {
          s.active.delete(index);
          s.touchHoldFrames.delete(index);
        } else {
          s.active.set(index, next);
          keepAnimating = true;
        }
      }

      if (keepAnimating || force) {
        s.frame = requestAnimationFrame(draw);
      } else {
        s.lastActivated = -1;
        s.frame = 0;
      }
    }

    function start() {
      if (!s.frame) {
        s.frame = requestAnimationFrame(draw);
      }
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    resize();
    const handlePointerDown = (event) => activateFromEvent(event, true);
    window.addEventListener("pointermove", activateFromEvent, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    finePointerMedia.addEventListener?.("change", resize);

    return () => {
      ro.disconnect();
      if (s.frame) cancelAnimationFrame(s.frame);
      window.removeEventListener("pointermove", activateFromEvent);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", resize);
      finePointerMedia.removeEventListener?.("change", resize);
    };
  }, [background, cellFillOpacity, fullCellsOnly, glowRgb, lineOpacity, lineRgb, titleGlow, titleGlowBounds, titleGlowTarget, wash]);

  return (
    <canvas
      ref={canvasRef}
      className={`stealth-honeycomb-grid${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    />
  );
}
