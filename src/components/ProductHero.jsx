import { useNavigate } from "react-router-dom";
import { Img } from "./Media.jsx";

/* ══════════════════════════════════════════════════════════════
 * ProductHero — shared hero band used by every product / app page
 *
 * Composition (matches the AutoCount Accounting design):
 *   1. Full-bleed lifestyle photo (background-image, cover, centered)
 *   2. Semi-transparent black overlay so white copy reads cleanly
 *   3. Centered content column: Back button, logo chip, eyebrow,
 *      title, body, primary + secondary CTA buttons
 *
 * Props:
 *   eyebrow         small uppercase line above title           (string)
 *   title           main heading                               (string)
 *   body            description paragraph                      (string)
 *   iconSrc         logo chip image, omit for no chip          (string?)
 *   iconAlt         alt text for the logo chip                 (string?)
 *   backgroundImage hero photo URL                             (string?)
 *   overlayOpacity  0–1, defaults to 0.6                       (number?)
 *   primaryCta      { label, href?, onClick?, disabled?, download?, icon? }
 *   secondaryCta    { label, href, target? }
 * ══════════════════════════════════════════════════════════════ */

const DEFAULT_BG = "/uploads/products/autocount-accounting-hero.webp";

const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default function ProductHero({
  eyebrow,
  title,
  body,
  iconSrc,
  iconAlt = "",
  backgroundImage = DEFAULT_BG,
  overlayOpacity = 0.6,
  primaryCta,
  secondaryCta,
}) {
  const navigate = useNavigate();

  return (
    <div className="product-hero" style={{
      position: "relative",
      paddingTop: "3.5rem", paddingBottom: "3.5rem",
      minHeight: "50vh",
      display: "flex", alignItems: "center",
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      /* Right-aligned so the laptop / monitor sits over the right side
       * of the hero (away from the left-aligned copy + buttons). */
      backgroundPosition: "right center",
    }}>
      {/* Dark overlay — keeps white copy legible against the photo */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: `rgba(0,0,0,${overlayOpacity})`,
        pointerEvents: "none",
      }} />

      <div className="content-wrap" style={{ position: "relative", zIndex: 1 }}>
        {/* Back button */}
        <button
          className="product-hero-back"
          onClick={() => navigate("/")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.75)",
            padding: "0.4rem 1rem", borderRadius: 50,
            fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit",
            marginBottom: "2rem", transition: "background 0.2s",
          }}
          onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
          onMouseOut ={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
        >← Back</button>

        <div className="product-hero-row" style={{
          display: "flex", alignItems: "center", gap: "2.5rem", flexWrap: "wrap",
        }}>
          <div className="product-hero-textgroup" style={{
            display: "flex", alignItems: "flex-start", gap: "2rem",
            flex: 1, minWidth: 280,
          }}>
            {/* Logo chip (optional) */}
            {iconSrc && (
              <div className="product-hero-icon" style={{
                width: 80, height: 80, borderRadius: 18,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, overflow: "hidden",
              }}>
                <Img src={iconSrc} alt={iconAlt} priority
                  style={{ width: "100%", height: "100%", objectFit: "contain", padding: 10 }} />
              </div>
            )}

            <div style={{ flex: 1, minWidth: 240 }}>
              {eyebrow && (
                <div className="product-hero-eyebrow" style={{
                  fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.5rem",
                }}>
                  {eyebrow}
                </div>
              )}

              <h1 className="product-hero-title" style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700,
                color: "#ffffff", lineHeight: 1.15, marginBottom: "1rem",
              }}>
                {title}
              </h1>

              {body && (
                <p className="product-hero-body" style={{
                  fontSize: "1rem", color: "#ffffff",
                  lineHeight: 1.78, maxWidth: 600, marginBottom: "1.5rem",
                }}>
                  {body}
                </p>
              )}

              <div className="product-hero-btns" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {primaryCta && <PrimaryButton cta={primaryCta} />}
                {secondaryCta && <SecondaryButton cta={secondaryCta} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Primary CTA — gold pill ──
 *   If cta.href → renders as <a> (with optional download attribute)
 *   If cta.onClick → renders as <button>
 *   If cta.disabled → renders as inert button (no handler, default cursor) */
function PrimaryButton({ cta }) {
  const baseStyle = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
    background: "#c9a84c", color: "#1e2040",
    padding: "0.75rem 2rem", borderRadius: 50,
    fontSize: "0.9rem", fontWeight: 700,
    fontFamily: "inherit", textDecoration: "none",
    transition: "opacity 0.2s",
  };
  const hoverIn  = e => { if (!cta.disabled) e.currentTarget.style.opacity = "0.85"; };
  const hoverOut = e => { if (!cta.disabled) e.currentTarget.style.opacity = "1"; };
  const icon = cta.icon ?? (cta.download ? <DownloadIcon /> : null);

  if (cta.disabled) {
    return (
      <button type="button" aria-disabled="true"
        style={{ ...baseStyle, border: "none", cursor: "default" }}
      >
        {icon}
        {cta.label}
      </button>
    );
  }
  if (cta.href) {
    return (
      <a href={cta.href}
        download={cta.download || undefined}
        target={cta.target}
        rel={cta.target === "_blank" ? "noreferrer" : undefined}
        style={baseStyle}
        onMouseOver={hoverIn} onMouseOut={hoverOut}
      >
        {icon}
        {cta.label}
      </a>
    );
  }
  return (
    <button type="button" onClick={cta.onClick}
      style={{ ...baseStyle, border: "none", cursor: "pointer" }}
      onMouseOver={hoverIn} onMouseOut={hoverOut}
    >
      {icon}
      {cta.label}
    </button>
  );
}

/* ── Secondary CTA — ghost outline ── */
function SecondaryButton({ cta }) {
  const baseStyle = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    background: "rgba(255,255,255,0.1)", color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.25)",
    padding: "0.75rem 2rem", borderRadius: 50,
    fontSize: "0.9rem", fontWeight: 500,
    textDecoration: "none", transition: "background 0.2s",
  };
  return (
    <a href={cta.href}
      target={cta.target}
      rel={cta.target === "_blank" ? "noreferrer" : undefined}
      style={baseStyle}
      onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
      onMouseOut ={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
    >
      {cta.label}
    </a>
  );
}
