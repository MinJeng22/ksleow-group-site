import { useState, useEffect, useRef } from "react";
import ParticleBackground from "./ParticleBackground";
import { LOGO_HERO } from "../assets/assets.js";
import hero from "../content/hero.json";
import branding from "../content/branding.json";

export default function Hero({ onContact }) {
  const [paused, setPaused]     = useState(false);
  const [visible, setVisible]   = useState(false);
  const [introSettled, setIntroSettled] = useState(false);
  /* Scroll hint appears 5 seconds after the page settles — gives the
   * viewer time to read the hero copy first, then quietly invites
   * them downward. Fades out as soon as they start scrolling. */
  const [hintShown, setHintShown] = useState(false);
  const hintRef = useRef(null);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 120);
    const settleTimer = setTimeout(() => setIntroSettled(true), 1400);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(settleTimer);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setHintShown(true);
      if (hintRef.current) {
        const opacity = Math.max(0, 1 - Math.max(0, window.scrollY - 40) / 120);
        hintRef.current.style.opacity = opacity;
        hintRef.current.style.pointerEvents = opacity > 0 ? "auto" : "none";
      }
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let rafId = 0;
    const updateScrollState = () => {
      rafId = 0;
      const y = window.scrollY || 0;
      const opacity = Math.max(0, 1 - Math.max(0, y - 40) / 120);

      if (hintShown && hintRef.current) {
        hintRef.current.style.opacity = opacity;
        hintRef.current.style.pointerEvents = opacity > 0 ? "auto" : "none";
      }
    };
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(updateScrollState);
    };
    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [hintShown]);

  const logoH = "clamp(80px, 11vw, 140px)";

  const [density, setDensity] = useState(1.6);
  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDensity(0.58);
      } else if (width < 1280) {
        setDensity(0.92);
      } else {
        setDensity(1.6);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        overflow: "hidden",
      }}
    >
      <ParticleBackground
        active={!paused}
        paused={paused}
        densityScale={density}
        mobileDensityScale={1.08}
      />

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
        className="content-wrap hero-content-wrap"
        style={{
          position: "relative", zIndex: 2,
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          paddingTop: "clamp(76px, 10vh, 110px)",
          paddingBottom: "clamp(56px, 9vh, 90px)",
          opacity: visible ? 1 : 0,
          transform: visible
            ? introSettled ? "none" : "translate3d(0, 0, 0)"
            : "translate3d(0, 28px, 0)",
          transition: introSettled
            ? "opacity 1.1s ease"
            : "opacity 1.1s ease, transform 1.1s ease",
          willChange: introSettled ? "auto" : "opacity, transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        {/* ── Logo + badge group ── */}
        <div className="hero-logo-group">

        {/* Logo */}
        <div style={{ marginBottom: "1.1rem" }}>
          <img
            src={branding.heroLogo || LOGO_HERO}
            alt="KSL Business Solutions"
            loading="eager"
            decoding="async"
            fetchpriority="high"
            style={{
              height: logoH,
              objectFit: "contain",
              display: "block",
              /* Don't invert when admin uploaded a custom logo (likely already on dark) */
              filter: branding.heroLogo ? "none" : "brightness(0) invert(1)",
            }}
          />
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
            marginBottom: "1.1rem",
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
              className="hero-primary-cta"
              onClick={onContact}
            >
              {hero.primaryButton}
            </button>
            <a
              href={hero.secondaryButtonHref || "#services"}
              className="btn-ghost-base btn-ghost-light"
            >
              {hero.secondaryButton}
            </a>
          </div>
        </div>
      </div>

      {/* ── Scroll-for-more hint — premium minimal design ──
       *   • "SCROLL" wordmark in fine letter-spacing (gold)
       *   • Thin vertical hairline with a small gold dot that travels
       *     from the top of the line to the bottom on a slow loop —
       *     reads as "this is where to go next" without being noisy
       *   • Appears 5 s after page load, fades out the moment the
       *     viewer starts scrolling
       *   • Click scrolls ~72% of the viewport (keeps the bottom of
       *     the hero visible above the next section) */}
      <style>{`
        @keyframes scrollHintFadeIn {
          from { opacity: 0; filter: blur(6px); }
          to { opacity: 1; filter: blur(0); }
        }
        .hero-scroll-hint {
          position: absolute;
          left: 50%;
          bottom: 32px;
          z-index: 10;
          gap: 0.55rem;
          color: rgba(255,255,255,0.82);
          font-family: inherit;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .hero-scroll-hint svg {
          transition: transform 0.48s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero-scroll-hint:hover svg {
          transform: translateY(2px);
        }
        @media (max-width: 767px) {
          .hero-scroll-hint {
            display: none !important;
          }
        }
      `}</style>
      <button
        ref={hintRef}
        className="hero-scroll-hint lg-glass lg-glass-btn lg-glass-pill"
        onClick={() => {
          /* Hand-paced scroll — native "smooth" is too fast and feels
           * like a jump cut. We RAF a slow ease-in-out over ~1.8s so it
           * reads as "someone gently dragging the page down". Distance
           * is 72% of the viewport so the bottom of the hero stays
           * visible at the top of the screen after the scroll. */
          const distance = window.innerHeight * 0.9;
          const duration = 200;
          const startY = window.scrollY;
          const t0 = performance.now();
          const easeInOut = (t) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          const tick = (now) => {
            const p = Math.min((now - t0) / duration, 1);
            window.scrollTo(0, startY + distance * easeInOut(p));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }}
        aria-label="Scroll for more"
        style={{
          "--lg-height": "44px",
          "--lg-px": "1.15rem",
          "--lg-rest-transform": "translateX(-50%) translateY(0) scale(1)",
          "--lg-hover-transform": "translateX(-50%) translateY(-2px) scale(1.018)",
          "--lg-active-transform": "translateX(-50%) translateY(0) scale(0.97)",
          opacity: 0,
          pointerEvents: "none",
          animation: hintShown
            ? "scrollHintFadeIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) both"
            : "none",
        }}
      >
        {/* Static chevron — no animation */}
        <span className="lg-glass-icon" aria-hidden="true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
        <span style={{ textIndent: "0.18em" /* compensate trailing letter-spacing for visual centering */ }}>
          Scroll for more
        </span>
      </button>

      {/* Pause / Play */}
      <style>{`
        .hero-glass-btn {
          position: absolute;
          bottom: 28px;
          right: 28px;
          z-index: 10;
          color: #ffffff;
          --lg-size: 48px;
        }
        /* Mobile: sit beside the bottom Search/Menu/Scroll bar. */
        @media (max-width: 767px) {
          .hero-glass-btn {
            bottom: calc(20px + env(safe-area-inset-bottom, 0px));
            right: 14px;
            --lg-size: 42px;
          }
        }
      `}</style>
      <button
        className="hero-glass-btn lg-glass lg-glass-btn lg-glass-circle"
        onClick={() => setPaused(p => !p)}
        title={paused ? "Play background" : "Pause background"}
        aria-label={paused ? "Play background" : "Pause background"}
      >
        {paused
          ? <svg width="14" height="16" viewBox="0 0 12 14" fill="currentColor"><polygon points="0,0 12,7 0,14"/></svg>
          : <svg width="14" height="16" viewBox="0 0 12 14" fill="currentColor"><rect x="0" y="0" width="4" height="14"/><rect x="8" y="0" width="4" height="14"/></svg>
        }
      </button>
    </section>
  );
}
