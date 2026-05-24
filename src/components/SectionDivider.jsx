import React, { useRef, useState, useEffect } from "react";

/**
 * SectionDivider — horizontal rule with a centred SVG icon.
 *
 * Usage:
 *   <SectionDivider icon={<MyIcon />} />
 *
 * The SVG starts grayscale + faded. When the divider scrolls into view
 * (IntersectionObserver, threshold 0.5) it transitions to full colour.
 *
 * The `icon` prop should be a React element (inline SVG). The component
 * applies CSS filter transitions on the wrapper so any SVG works.
 */
export default function SectionDivider({ icon, color = "#2f315a" }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem var(--px)",
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: 1440,
        margin: "0 auto",
      }}
    >
      {/* Left line (gradient fade) */}
      <div style={{ 
        flex: 1, height: 1, 
        background: `linear-gradient(90deg, transparent, ${color}40)` 
      }} />

      {/* Icon wrapper with premium glassmorphism & glow */}
      <div
        style={{
          position: "relative",
          margin: "0 2rem",
          padding: "1.1rem",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.4))",
          boxShadow: inView 
            ? "0 12px 32px rgba(47, 49, 90, 0.08), inset 0 0 0 1px rgba(255,255,255,1)"
            : "0 4px 16px rgba(0,0,0,0.02), inset 0 0 0 1px rgba(255,255,255,0.4)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          filter: inView ? "grayscale(0)" : "grayscale(1) opacity(0.3)",
          transform: inView ? "scale(1) translateY(0)" : "scale(0.8) translateY(15px)",
          transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 0,
        }}
      >
        {/* Soft radial glow behind the icon */}
        <div style={{
          position: "absolute",
          inset: "-20%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}25 0%, transparent 60%)`,
          opacity: inView ? 1 : 0,
          transition: "opacity 1.5s ease 0.4s",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1, color: color }}>
          {icon || <div style={{ width: 28, height: 28 }} />}
        </div>
      </div>

      {/* Right line (gradient fade) */}
      <div style={{ 
        flex: 1, height: 1, 
        background: `linear-gradient(270deg, transparent, ${color}40)` 
      }} />
    </div>
  );
}

/* ─── Pre-built icon library (inline SVGs with colour) ──────────────── */

/** Accounting / ledger book */
export const IconLedger = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.8" />
    <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z" stroke="currentColor" strokeWidth="1.8" />
    <line x1="9" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="1.6" opacity="0.6" />
    <line x1="9" y1="11" x2="13" y2="11" stroke="currentColor" strokeWidth="1.6" opacity="0.6" />
  </svg>
);

/** Video / tutorial play */
export const IconVideo = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
    <polygon points="10,8.5 16,12 10,15.5" fill="currentColor" opacity="0.8" />
  </svg>
);

/** Grid / modules / editions */
export const IconGrid = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" opacity="0.6" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" opacity="0.6" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

/** Rocket / CTA / get started */
export const IconRocket = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" stroke="currentColor" strokeWidth="1.8" opacity="0.7" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

/** Cloud */
export const IconCloud = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1" />
    <path d="M13 14l-2 2 2 2" stroke="currentColor" strokeWidth="1.6" opacity="0.6" />
    <path d="M11 14l2 2-2 2" stroke="currentColor" strokeWidth="1.6" opacity="0.6" />
  </svg>
);

/** Shield / security */
export const IconShield = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1" />
    <polyline points="9,12 11,14 15,10" stroke="currentColor" strokeWidth="2" opacity="0.7" />
  </svg>
);

/** Chart / pricing / comparison */
export const IconChart = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2.2" />
    <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2.2" opacity="0.6" />
    <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2.2" opacity="0.8" />
  </svg>
);

/** Food / restaurant */
export const IconUtensils = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" stroke="currentColor" strokeWidth="1.8" />
    <line x1="7" y1="2" x2="7" y2="22" stroke="currentColor" strokeWidth="1.8" />
    <path d="M21 15V2c-2.76 0-5 3.13-5 7v6" stroke="currentColor" strokeWidth="1.8" opacity="0.6" />
    <line x1="18" y1="15" x2="18" y2="22" stroke="currentColor" strokeWidth="1.8" opacity="0.6" />
  </svg>
);

/** Link / integration */
export const IconLink = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.8" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.8" opacity="0.6" />
  </svg>
);

/** Handshake / partner / why us */
export const IconHandshake = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3" stroke="currentColor" strokeWidth="1.8" />
    <path d="M13 7h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3" stroke="currentColor" strokeWidth="1.8" opacity="0.6" />
    <path d="M8 12h8" stroke="currentColor" strokeWidth="2" />
    <circle cx="8" cy="12" r="1" fill="currentColor" />
    <circle cx="16" cy="12" r="1" fill="currentColor" />
  </svg>
);

/** Layers / modules flow */
export const IconLayers = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12,2 2,7 12,12 22,7" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.05" />
    <polyline points="2,17 12,22 22,17" stroke="currentColor" strokeWidth="1.8" opacity="0.6" />
    <polyline points="2,12 12,17 22,12" stroke="currentColor" strokeWidth="1.8" opacity="0.8" />
  </svg>
);

/** Clipboard / guide / steps */
export const IconClipboard = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="1.8" />
    <rect x="8" y="2" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1" />
    <line x1="8" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    <line x1="8" y1="15" x2="13" y2="15" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
  </svg>
);

/** Star / features */
export const IconStar = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1" />
  </svg>
);

/** Settings / config */
export const IconSettings = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" opacity="0.6" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

/** Dollar / pricing */
export const IconDollar = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
    <line x1="12" y1="1" x2="12" y2="5" stroke="currentColor" strokeWidth="1.8" />
    <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="1.8" />
    <path d="M16 8a4 4 0 0 0-4-1c-2.21 0-4 1.34-4 3s1.79 3 4 3 4 1.34 4 3-1.79 3-4 3a4 4 0 0 1-4-1" stroke="currentColor" strokeWidth="1.8" opacity="0.6" />
  </svg>
);
