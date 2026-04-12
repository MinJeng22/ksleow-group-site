import { useState, useEffect } from "react";
import ParticleBackground from "./ParticleBackground";
import { LOGO } from "../assets/assets.js";
import { WA_LINK } from "../constants/contact.js";

export default function Hero({ onContact }) {
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { const t = setTimeout(() => setVisible(true), 120); return () => clearTimeout(t); }, []);

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <ParticleBackground paused={paused} />

      {/* centered content */}
      <div
        style={{
          position: "relative", zIndex: 2,
          display: "flex", flexDirection: "column",
          alignItems: "center", textAlign: "center",
          padding: "0 var(--px)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 1.1s ease, transform 1.1s ease",
        }}
      >
        {/* Logo — white text version via CSS filter */}
        <div style={{ marginBottom: "2.5rem" }}>
          <img
            src={LOGO}
            alt="KSL Business Solutions"
            style={{
              height: "clamp(80px, 12vw, 130px)",
              objectFit: "contain",
              /* invert dark pixels → white, keeping gold emblem natural */
              filter: "brightness(0) invert(1)",
            }}
          />
        </div>

        {/* Tagline badge */}
        <div style={{
          display: "inline-block",
          background: "rgba(201,168,76,0.15)",
          border: "1px solid rgba(201,168,76,0.4)",
          color: "#e8c97a",
          fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.14em",
          padding: "0.35rem 1.1rem", borderRadius: 50, marginBottom: "1.4rem",
          textTransform: "uppercase",
        }}>
          Pahang's No. 1 AutoCount Authorized Dealer
        </div>

        <h1 style={{
          fontSize: "clamp(2.2rem, 5vw, 4rem)",
          fontWeight: 700, color: "#ffffff",
          lineHeight: 1.1, letterSpacing: "-0.02em",
          marginBottom: "0.5rem",
        }}>
          Hello.
        </h1>

        <p style={{
          fontSize: "clamp(1.1rem, 2.2vw, 1.55rem)",
          fontWeight: 400, color: "#e8c97a",
          fontStyle: "italic", marginBottom: "1.2rem",
        }}>
          Your Vision, Our Solution.
        </p>

        <p style={{
          fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)",
          color: "rgba(255,255,255,0.65)",
          lineHeight: 1.8, maxWidth: 580, marginBottom: "2.4rem",
        }}>
          KSL Business Solutions Sdn. Bhd. delivers comprehensive accounting software,
          expert technical services, professional training, IT networking, and plugin
          development — all under one roof.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={onContact}
            style={{
              background: "#c9a84c", color: "#1e2040",
              padding: "0.8rem 2.2rem", borderRadius: 50,
              fontSize: "0.92rem", fontWeight: 700,
              border: "none", cursor: "pointer", fontFamily: "inherit",
              transition: "opacity 0.2s",
            }}
            onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
            onMouseOut={e => e.currentTarget.style.opacity = "1"}
          >
            Get in touch
          </button>
          <a
            href="#services"
            style={{
              background: "transparent", color: "#ffffff",
              border: "1.5px solid rgba(255,255,255,0.35)",
              padding: "0.8rem 2.2rem", borderRadius: 50,
              fontSize: "0.92rem", fontWeight: 500,
              textDecoration: "none", transition: "border-color 0.2s",
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.8)"}
            onMouseOut={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"}
          >
            Our Services
          </a>
        </div>
      </div>

      {/* scroll hint */}
      <div style={{
        position: "absolute", bottom: 32, left: "50%",
        transform: "translateX(-50%)", zIndex: 2,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        opacity: 0.45,
      }}>
        <div style={{ width: 1, height: 40, background: "#e8c97a",
          animation: "scrollPulse 1.8s ease-in-out infinite" }} />
        <style>{`@keyframes scrollPulse{0%,100%{opacity:.3;transform:scaleY(.7)}50%{opacity:1;transform:scaleY(1)}}`}</style>
      </div>

      {/* pause / play button */}
      <button
        onClick={() => setPaused(p => !p)}
        title={paused ? "Play background" : "Pause background"}
        aria-label={paused ? "Play background" : "Pause background"}
        style={{
          position: "absolute", bottom: 24, right: 24, zIndex: 10,
          width: 38, height: 38, borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.22)",
          color: "#ffffff", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.2s",
        }}
        onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
        onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
      >
        {paused
          ? <svg width="12" height="14" viewBox="0 0 12 14" fill="white"><polygon points="0,0 12,7 0,14"/></svg>
          : <svg width="12" height="14" viewBox="0 0 12 14" fill="white"><rect x="0" y="0" width="4" height="14"/><rect x="8" y="0" width="4" height="14"/></svg>
        }
      </button>
    </section>
  );
}
