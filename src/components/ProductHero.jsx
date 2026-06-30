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
 *   tertiaryCta     { label, href, target? }
 * ══════════════════════════════════════════════════════════════ */

const DEFAULT_BG = "/images/products/autocount-accounting-hero.webp";

const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

function LogoChip({ iconSrc, iconAlt, className = "" }) {
  if (!iconSrc) return null;
  return (
    <div className={`product-hero-icon ${className}`} style={{
      width: "var(--icon-lg)", height: "var(--icon-lg)", borderRadius: "var(--media-radius)",
      background: "rgba(255,255,255,0.1)",
      border: "1px solid rgba(255,255,255,0.15)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, overflow: "hidden",
    }}>
      <Img src={iconSrc} alt={iconAlt} priority
        style={{ width: "100%", height: "100%", objectFit: "contain", padding: 10 }} />
    </div>
  );
}

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
  tertiaryCta,
}) {

  return (
    <div className="product-hero" style={{
      position: "sticky",
      top: 0,
      zIndex: 0,
      paddingTop: "7rem", paddingBottom: "5rem",
      display: "flex", alignItems: "center",
      overflow: "hidden",
      background: "#1f2142",
    }}>
      {/* 
        Using an actual <img> tag instead of CSS backgroundImage ensures the browser's
        preload scanner discovers and downloads the LCP image immediately during HTML parsing.
      */}
      <img
        className="product-hero-bg"
        src={backgroundImage}
        alt=""
        loading="eager"
        decoding="sync"
        fetchpriority="high"
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center center",
          zIndex: 0,
        }}
      />

      {/* Mobile-only bump: shift the hero photo to the right so the
       * laptop / monitor scene stays in frame at narrow widths. Desktop
       * keeps the inline "center center" above. */}
      <style>{`
        @media (max-width: 760px) {
          .product-hero-bg { object-position: 78% center !important; }
        }
      `}</style>

      {/* Dark overlay — keeps white copy legible against the photo */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: `rgba(0,0,0,${overlayOpacity})`,
        pointerEvents: "none",
        zIndex: 0,
      }} />

      <div className="content-wrap" style={{ position: "relative", zIndex: 1 }}>

        <div className="product-hero-row" style={{
          display: "flex", alignItems: "center", gap: "2.5rem", flexWrap: "wrap",
        }}>
          <div className="product-hero-textgroup" style={{
            display: "flex", alignItems: "flex-start", gap: "2rem",
            flex: 1, minWidth: 280,
          }}>
            <div className="product-hero-mobile-topline">
              <LogoChip iconSrc={iconSrc} iconAlt={iconAlt} className="product-hero-icon-mobile" />
            </div>
            {/* Logo chip (optional) */}
            <LogoChip iconSrc={iconSrc} iconAlt={iconAlt} className="product-hero-icon-desktop" />

            <div style={{ flex: 1, minWidth: 240 }}>
              {eyebrow && (
                <div className="product-hero-eyebrow ks-eyebrow">
                  {eyebrow}
                </div>
              )}

              <h1 className="product-hero-title ks-hero-title" style={{ marginBottom: "1rem" }}>
                {title}
              </h1>

              {body && (
                <p className="product-hero-body ks-body-text ks-body-light" style={{ maxWidth: 600, marginBottom: "1.5rem" }}>
                  {body}
                </p>
              )}

              <div className="product-hero-btns" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {primaryCta && <PrimaryButton cta={primaryCta} />}
                {secondaryCta && <SecondaryButton cta={secondaryCta} />}
                {tertiaryCta && <SecondaryButton cta={tertiaryCta} />}
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
  const icon = cta.icon ?? (cta.download ? <DownloadIcon /> : null);

  if (cta.disabled) {
    return (
      <button type="button" aria-disabled="true"
        className={"ks-btn ks-btn-primary " + (cta.className || "")}
        style={{ cursor: "default", opacity: 0.72 }}
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
        className={"ks-btn ks-btn-primary " + (cta.className || "")}
        style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
      >
        {icon}
        {cta.label}
        {(!cta.href.startsWith("/") && !cta.href.startsWith("#")) && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M9 7h8v8" /></svg>
        )}
      </a>
    );
  }
  return (
    <button type="button" onClick={cta.onClick}
      className={"ks-btn ks-btn-primary " + (cta.className || "")}
    >
      {icon}
      {cta.label}
    </button>
  );
}

/* ── Secondary CTA — ghost outline ── */
function SecondaryButton({ cta }) {
  return (
    <a href={cta.href}
      className="btn-ghost-base btn-ghost-light"
      target={cta.target}
      rel={cta.target === "_blank" ? "noreferrer" : undefined}
      style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
    >
      {cta.label}
      {(!cta.href.startsWith("/") && !cta.href.startsWith("#")) && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M9 7h8v8" /></svg>
      )}
    </a>
  );
}
