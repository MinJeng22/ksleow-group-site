import React, { useRef, useState, useEffect } from "react";

/**
 * SectionDivider ΓÇö horizontal rule with a centred SVG icon.
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
export default function SectionDivider({ icon, color = "#2f315a", targetId }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (targetId) {
      const handleSectionChange = (e) => {
        setInView(e.detail === targetId);
      };
      window.addEventListener("sectionChange", handleSectionChange);
      return () => window.removeEventListener("sectionChange", handleSectionChange);
    } else {
      if (typeof IntersectionObserver === "undefined") {
        setInView(true);
        return;
      }
      const io = new IntersectionObserver(
        ([entry]) => {
          setInView(entry.isIntersecting);
        },
        { threshold: 0.5 }
      );
      if (ref.current) io.observe(ref.current);
      return () => io.disconnect();
    }
  }, [targetId]);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 var(--px)",
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: 1440,
        margin: "0 auto",
      }}
    >
            {/* A single solid line across the divider */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "var(--px)",
          right: "var(--px)",
          height: 1,
          background: color,
          opacity: 0.18,
          zIndex: 0,
        }}
      />

      {/* Icon wrapper with premium glassmorphism & glow */}
      <div
        style={{
          position: "relative",
          margin: "0 1rem",
          padding: "1rem",
          borderRadius: "16px",
          background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.6))",
          boxShadow: inView 
            ? `0 12px 32px ${color}15, inset 0 0 0 1px rgba(255,255,255,1), inset 0 2px 4px rgba(255,255,255,0.5)`
            : "0 4px 16px rgba(0,0,0,0.02), inset 0 0 0 1px rgba(255,255,255,0.4)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          filter: inView ? "grayscale(0)" : "grayscale(1) opacity(0.4)",
          transform: inView ? "translateY(0) scale(1)" : "translateY(8px) scale(0.95)",
          transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 0,
        }}
      >
        {/* Soft radial glow behind the icon */}
        <div style={{
          position: "absolute",
          inset: "-30%",
          borderRadius: "16px",
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
          opacity: inView ? 1 : 0,
          transition: "opacity 1.2s ease 0.3s",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1, color: color, transform: inView ? "scale(1)" : "scale(0.8)", transition: "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)" }}>
          {icon || <div style={{ width: 28, height: 28 }} />}
        </div>
      </div>

      {/* Right line */}
      <div style={{ width: 4, height: 4, borderRadius: "50%", background: `${color}80`, margin: "0 0.5rem" }} />
      <div style={{ flex: 1, height: 1, background: `linear-gradient(270deg, transparent, ${color}30, ${color}60)` }} />
    </div>
  );
}

/* ΓöÇΓöÇΓöÇ Pre-built icon library (inline SVGs with colour) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */

/** Accounting / ledger book */
export const IconLedger = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.1-.45-.75-.75-1.5-1z"/>
  </svg>
);

/** Video / tutorial play */
export const IconVideo = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
  </svg>
);

/** Grid / modules / editions */
export const IconGrid = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3v8h8V3H3zm10 0v8h8V3h-8zM3 13v8h8v-8H3zm10 0v8h8v-8h-8z"/>
  </svg>
);

/** Rocket / CTA / get started */
export const IconRocket = (
  <svg width="28" height="28" viewBox="0 0 256 256" fill="currentColor">
    <path d="M239.31,16.69a15.86,15.86,0,0,0-16-3.48c-30.82,10.62-58.46,31.78-79.62,60.91A14.62,14.62,0,0,0,140.23,73L126.79,59.54a24,24,0,0,0-36.65,2.69L67,91.31l-42.34,14.1a24,24,0,0,0-12,35.63L30.93,174,13.25,191.64a8,8,0,0,0,11.31,11.32l16.14-16.14,29,20.89a24,24,0,0,0,33.15-4.52L121,185.34l34-45.31A14.54,14.54,0,0,0,154,138.83l17-17c32.73-23.77,55.85-52.92,67.62-85.1A15.87,15.87,0,0,0,239.31,16.69ZM52.79,183.21a8,8,0,1,1,11.31-11.31A8,8,0,0,1,52.79,183.21ZM142,216H104a8,8,0,0,0,0,16h38a8,8,0,0,0,0-16Zm-24-32H88a8,8,0,0,0,0,16h30a8,8,0,0,0,0-16Zm64-6c-6.84-2-12.83-5.26-19.12-11.55s-9.52-12.28-11.55-19.12A123.63,123.63,0,0,0,172.54,92.5c24-21.72,50.13-35.43,60.71-39.75C228.3,64.21,213.56,92,192.57,117.43A123.63,123.63,0,0,0,182,178Z"/>
  </svg>
);

/** Cloud */
export const IconCloud = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
  </svg>
);

/** Shield / security */
export const IconShield = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
  </svg>
);

/** Chart / pricing / comparison */
export const IconChart = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
  </svg>
);

/** Food / restaurant */
export const IconUtensils = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
  </svg>
);

/** Link / integration */
export const IconLink = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
  </svg>
);

/** Handshake / partner / why us */
export const IconHandshake = (
  <svg width="28" height="28" viewBox="0 0 256 256" fill="currentColor">
    <path d="M245.54,124a15.82,15.82,0,0,0-9.92-5.32c-7-.6-12.82-3.8-17-9.33A31.81,31.81,0,0,0,193.31,97.7L181.79,94a11.12,11.12,0,0,1-7.85-11.31,11.23,11.23,0,0,1,10.63-10.74h.6A32.18,32.18,0,0,0,211.24,53l3.37-6.73a16,16,0,0,0-28.53-14.45L120.21,65A31.7,31.7,0,0,0,103.85,91H56A16,16,0,0,0,40,107v12.28L25.37,130A16,16,0,0,0,20.4,149.7l30.2,36.56a16,16,0,0,0,20.52,3.31L108,166.4l28.61,42.92a16,16,0,0,0,26.63,0ZM118,154.21A31.94,31.94,0,0,0,103.62,143L56,128V107h50.91a32.07,32.07,0,0,0,20.3-7.29l52-42.86a23.94,23.94,0,0,0,12.78-21.08,8.23,8.23,0,0,1,3.22,4.8l-12.74,25.48c-.06.12-.13.25-.19.38A27.24,27.24,0,0,0,158,92.51a27.1,27.1,0,0,0,19,25.32l11.52,3.71A15.8,15.8,0,0,1,201.21,127c5,6.58,11.83,10.42,20.27,11.16a15.82,15.82,0,0,1-3.66,3l-28.31,16.48,5.43,8.14a8,8,0,0,1-13.31,8.88l-18.42-27.64a8,8,0,0,0-13.32,8.88ZM60.82,175.76l-30.2-36.56,9.11-6.84L79,144.4a16,16,0,0,1,7.21,5.6l23.7,35.54Z"/>
  </svg>
);

/** Layers / modules flow */
export const IconLayers = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 16.5l-9-4v2l9 4 9-4v-2l-9 4z"/>
    <path d="M12 12.5l-9-4v2l9 4 9-4v-2l-9 4z"/>
    <path d="M12 8.5l-9-4 9-4 9 4-9 4z"/>
  </svg>
);

/** Clipboard / guide / steps */
export const IconClipboard = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
  </svg>
);

/** Star / features */
export const IconStar = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);

/** Settings / config */
export const IconSettings = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
  </svg>
);

/** Dollar / pricing */
export const IconDollar = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-3.57-1.62-3.57-3.09 0-1.53 1.16-2.53 2.5-2.88V5H14v1.88c1.39.29 2.5 1.25 2.72 2.87h-1.93c-.15-.97-.9-1.51-2.13-1.51-1.39 0-2.31.65-2.31 1.48 0 .61.35 1.15 2.37 1.63 2.87.68 3.86 1.76 3.86 3.19 0 1.57-1.12 2.51-2.67 2.92z"/>
  </svg>
);
