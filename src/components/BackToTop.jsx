import { useState, useEffect } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      title="Back to top"
      style={{
        position: "fixed",
        bottom: 28,   /* lower slot — KS Omni FAB sits above this */
        right: 28,
        zIndex: 500,
        width: 52,    /* identical to AI FAB */
        height: 52,
        borderRadius: "50%",
        background: "#2f315a",
        border: "2px solid rgba(201,168,76,0.5)",
        color: "#c9a84c",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        boxShadow: "0 6px 24px rgba(47,49,90,0.35)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.85)",
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.3s, transform 0.3s, background 0.2s",
      }}
      onMouseOver={e => e.currentTarget.style.background = "#3d4075"}
      onMouseOut={e => e.currentTarget.style.background = "#2f315a"}
    >
      {/* Bolder up-arrow — matches the visual weight of the "?" KS Omni FAB */}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}