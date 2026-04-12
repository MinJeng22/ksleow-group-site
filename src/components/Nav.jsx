import { useState, useEffect, useRef } from "react";
import { LOGO } from "../assets/assets.js";
import { WA_LINK } from "../constants/contact.js";

export default function Nav({ onContact }) {
  const [visible, setVisible] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const heroEl = document.getElementById("hero");
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        /* Show nav only when hero section is NO longer intersecting viewport */
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.85rem var(--px)",
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(14px)",
        borderBottom: "0.5px solid rgba(47,49,90,0.12)",
        boxShadow: "0 2px 24px rgba(47,49,90,0.06)",
        /* slide-down animation */
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.45s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* Logo with purple text (no filter override — natural logo colors) */}
      <img
        src={LOGO}
        alt="KSL Business Solutions"
        style={{ height: 40, objectFit: "contain" }}
      />

      {/* Contact Us */}
      <button
        onClick={onContact}
        style={{
          background: "#2f315a",
          color: "#ffffff",
          padding: "0.52rem 1.5rem",
          borderRadius: 50,
          fontSize: "0.85rem",
          fontWeight: 600,
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          letterSpacing: "0.01em",
          transition: "background 0.2s",
        }}
        onMouseOver={e => e.currentTarget.style.background = "#3d4075"}
        onMouseOut={e => e.currentTarget.style.background = "#2f315a"}
      >
        Contact Us
      </button>
    </nav>
  );
}
