import { useState, useEffect } from "react";
import ParticleBackground from "./ParticleBackground";
import { LOGO_HERO } from "../assets/assets.js";
import hero from "../content/hero.json";
import branding from "../content/branding.json";

export default function Hero({ onContact }) {
  const [paused, setPaused]   = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  const logoH = "clamp(80px, 11vw, 140px)";

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        overflow: "hidden",
      }}
    >
      <ParticleBackground paused={paused} />

      {/*
       * DESKTOP layout (>640px):
       *   content-wrap is a tall flex column.
       *   Logo sits at the top.
       *   Badge sits directly below the logo (no spacer between them).
       *   A flex-grow spacer then pushes the remaining text block to
       *   the bottom of the viewport.
       *
       * MOBILE layout (<640px):
       *   .hero-desktop-split overrides via CSS so everything
       *   stacks naturally in a single column, centred.
       */}
      <div
        className="content-wrap"
        style={{
          position: "relative", zIndex: 2,
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          paddingTop: "clamp(76px, 10vh, 110px)",
          paddingBottom: "clamp(56px, 9vh, 90px)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 1.1s ease, transform 1.1s ease",
        }}
      >
        {/* ── Logo + badge group ── */}
        <div className="hero-logo-group">

        {/* Logo */}
        <div style={{ marginBottom: "1.1rem" }}>
          <a href="/" onClick={() => window.scrollTo(0, 0)} style={{ display: "inline-block" }}>
            <img
              src={branding.heroLogo || LOGO_HERO}
              alt="KSL Business Solutions"
              style={{
                height: logoH,
                objectFit: "contain",
                display: "block",
                /* Don't invert when admin uploaded a custom logo (likely already on dark) */
                filter: branding.heroLogo ? "none" : "brightness(0) invert(1)",
              }}
            />
          </a>
        </div>

        {/* ── Badge — directly below logo ── */}
        <div className="hero-badge" style={{
          display: "inline-flex", alignItems: "center",
          background: "rgba(201,168,76,0.15)",
          border: "1px solid rgba(201,168,76,0.4)",
          color: "#e8c97a",
          fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.13em",
          padding: "0.35rem 1.1rem", borderRadius: 50,
          textTransform: "uppercase",
          alignSelf: "flex-start",
        }}>
          {hero.badge}
        </div>

        </div>{/* end hero-logo-group */}

        {/* ── Spacer — pushes text block to bottom on desktop ── */}
        <div className="hero-spacer" style={{ flex: 1, minHeight: "1.5rem", maxHeight: "6vh" }} />

        {/* ── Text + buttons block — bottom-left on desktop ── */}
        <div
          className="hero-content"
          style={{
            display: "flex", flexDirection: "column",
            alignItems: "flex-start", textAlign: "left",
            maxWidth: 560,
          }}
        >
          <h1 style={{
            fontSize: "clamp(2.4rem, 5.5vw, 4.4rem)",
            fontWeight: 700, color: "#ffffff",
            lineHeight: 1.08, letterSpacing: "-0.025em",
            marginBottom: "0.5rem",
          }}>
            {hero.headline}
          </h1>

          <p style={{
            fontSize: "clamp(1.05rem, 2.2vw, 1.45rem)",
            fontWeight: 400, color: "#e8c97a",
            fontStyle: "italic", marginBottom: "1.1rem",
          }}>
            {hero.tagline}
          </p>

          <p style={{
            fontSize: "clamp(0.88rem, 1.3vw, 1rem)",
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.82, marginBottom: "2rem",
          }}>
            {hero.body}
          </p>

          {/* Buttons — always side-by-side */}
          <div className="hero-btns" style={{ display: "flex", gap: "0.85rem", flexWrap: "nowrap" }}>
            <button
              onClick={onContact}
              style={{
                background: "#c9a84c", color: "#1e2040",
                padding: "0.75rem 1.75rem", borderRadius: 50,
                fontSize: "0.88rem", fontWeight: 700,
                border: "none", cursor: "pointer", fontFamily: "inherit",
                whiteSpace: "nowrap", transition: "opacity 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
              onMouseOut={e => e.currentTarget.style.opacity = "1"}
            >
              {hero.primaryButton}
            </button>
            <a
              href={hero.secondaryButtonHref || "#services"}
              style={{
                background: "transparent", color: "#ffffff",
                border: "1.5px solid rgba(255,255,255,0.35)",
                padding: "0.75rem 1.75rem", borderRadius: 50,
                fontSize: "0.88rem", fontWeight: 500,
                textDecoration: "none", whiteSpace: "nowrap",
                transition: "border-color 0.2s", display: "inline-block",
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.82)"}
              onMouseOut={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"}
            >
              {hero.secondaryButton}
            </a>
          </div>
        </div>
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
