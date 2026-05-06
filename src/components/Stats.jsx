import { useEffect, useRef, useState } from "react";
import stats from "../content/stats.json";

/* Parse a stat string like "500+", "40+", "6", "100%" into:
 *   { target: number, prefix: string, suffix: string }
 * so we can animate just the numeric portion and preserve the rest. */
function parseStat(raw) {
  const str = String(raw ?? "").trim();
  const match = str.match(/^([^\d-]*)(-?\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { target: null, prefix: "", suffix: str };
  return {
    target: parseFloat(match[2]),
    prefix: match[1] || "",
    suffix: match[3] || "",
    decimals: (match[2].split(".")[1] || "").length,
  };
}

/* Count-up number that animates 0 → target the first time it scrolls into view.
 * Falls back to displaying the raw string if it's not numeric. */
function CountUp({ raw, duration = 1800 }) {
  const { target, prefix, suffix, decimals } = parseStat(raw);
  const [value, setValue] = useState(0);
  const [played, setPlayed] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (target === null || played) return;
    const node = ref.current;
    if (!node) return;

    const start = () => {
      setPlayed(true);
      const startTime = performance.now();
      const tick = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        // ease-out cubic for a satisfying decelerating count
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(target * eased);
        if (t < 1) requestAnimationFrame(tick);
        else setValue(target);
      };
      requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === "undefined") {
      start();
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          start();
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(node);
    return () => io.disconnect();
  }, [target, duration, played]);

  if (target === null) {
    return <span ref={ref}>{raw}</span>;
  }

  const display = decimals > 0
    ? value.toFixed(decimals)
    : Math.floor(value).toLocaleString();

  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

export default function Stats() {
  const items = stats.items || [];
  return (
    <div style={{ background: "#ffffff", borderBottom: "0.5px solid rgba(47,49,90,0.1)" }}>
      <div
        className="content-wrap stats-grid"
        style={{ display: "grid", gridTemplateColumns: `repeat(${items.length || 4}, 1fr)` }}
      >
        {items.map((s, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
              padding: "2.5rem 1rem",
              borderRight: i < items.length - 1
                ? "0.5px solid rgba(47,49,90,0.1)"
                : "none",
            }}
          >
            <div style={{ fontSize: "2.2rem", fontWeight: 700, color: "#2f315a", lineHeight: 1 }}>
              <CountUp raw={s.num} />
            </div>
            <div style={{
              fontSize: "0.7rem", fontWeight: 600, color: "#6b6f91",
              textTransform: "uppercase", letterSpacing: "0.09em", marginTop: "0.5rem",
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
