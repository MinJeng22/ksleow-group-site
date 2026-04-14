import { useState, useEffect } from "react";
import ParticleBackground from "./ParticleBackground";
import { LOGO_HERO } from "../assets/assets.js";

/* ══════════════════════════════════════════════════════════════
 * HERO LOGO
 * To swap: replace  src/assets/logos/logo-hero.png
 * filter: brightness(0) invert(1) — renders every pixel white,
 * no background box needed on the dark animated canvas.
 * ══════════════════════════════════════════════════════════════ */

export default function Hero({ onContact }) {
  const [paused, setPaused]   = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  const logoH = "clamp(90px, 13vw, 155px)";

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <ParticleBackground paused={paused} />

      {/* content-wrap constrains width and adds side padding — same as all other sections */}
      <div className="content-wrap" style={{ position: "relative", zIndex: 2, width: "100%" }}>
        <div
          className="hero-content"
          style={{
            display: "flex", flexDirection: "column",
            alignItems: "flex-start", textAlign: "left",
            maxWidth: 580,
            marginTop: "-6vh",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 1.1s ease, transform 1.1s ease",
          }}
        >
          {/* ── Hero Logo — full white, no background box ── */}
          <div style={{ marginBottom: "2.2rem" }}>
            <img
              src={LOGO_HERO}
              alt="KSL Business Solutions"
              style={{
                height: logoH,
                objectFit: "contain",
                display: "block",
                filter: "brightness(0) invert(1)",
              }}
            />
          </div>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center",
            background: "rgba(201,168,76,0.15)",
            border: "1px solid rgba(201,168,76,0.4)",
            color: "#e8c97a",
            fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.13em",
            padding: "0.35rem 1.1rem", borderRadius: 50, marginBottom: "1.4rem",
            textTransform: "uppercase",
          }}>
            Pahang's No. 1 AutoCount Authorized Dealer
          </div>

          <h1 style={{
            fontSize: "clamp(2.4rem, 5.5vw, 4.4rem)",
            fontWeight: 700, color: "#ffffff",
            lineHeight: 1.08, letterSpacing: "-0.025em",
            marginBottom: "0.5rem",
          }}>
            Hello.
          </h1>

          {/* Slogan */}
          <p style={{
            fontSize: "clamp(1.05rem, 2.2vw, 1.45rem)",
            fontWeight: 400, color: "#e8c97a",
            fontStyle: "italic", marginBottom: "1.2rem",
          }}>
            Your Vision, Our Solutions.
          </p>

          {/* Updated company description */}
          <p style={{
            fontSize: "clamp(0.88rem, 1.3vw, 1rem)",
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.82, marginBottom: "2.4rem",
          }}>
            K.S. Leow Group, established in 1981, provides a comprehensive suite
            of services including accounting, secretarial, taxation, management,
            and auditing, alongside computer hardware wholesale, technical services,
            and training — all under one roof.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              onClick={onContact}
              style={{
                background: "#c9a84c", color: "#1e2040",
                padding: "0.82rem 2.2rem", borderRadius: 50,
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
                padding: "0.82rem 2.2rem", borderRadius: 50,
                fontSize: "0.92rem", fontWeight: 500,
                textDecoration: "none", transition: "border-color 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.82)"}
              onMouseOut={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"}
            >
              Our Services
            </a>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{
        position: "absolute", bottom: 32, left: "50%",
        transform: "translateX(-50%)", zIndex: 2,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        opacity: 0.4, pointerEvents: "none",
      }}>
        <div style={{
          width: 1, height: 40, background: "#e8c97a",
          animation: "scrollPulse 1.8s ease-in-out infinite",
        }} />
        <style>{`@keyframes scrollPulse{0%,100%{opacity:.25;transform:scaleY(.6)}50%{opacity:1;transform:scaleY(1)}}`}</style>
      </div>

      {/* Pause / Play */}
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
