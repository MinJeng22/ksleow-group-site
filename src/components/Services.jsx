import { useState } from "react";
import { SERVICE_CONTACTS } from "../constants/contact.js";
import servicesContent from "../content/services.json";
import officesContent  from "../content/offices.json";
import branding        from "../content/branding.json";

/* Office lookup by key for the card-back business card */
const OFFICES = Object.fromEntries(
  (officesContent.items || []).map(o => [o.key, o])
);

/* Normalise CMS shape (badgeType + badgeLabel + logos) into the
 * { dealer | certified } shape the existing render code expects. */
const SERVICES = (servicesContent.items || []).map(s => {
  const badge = s.badgeLabel && s.logos
    ? { label: s.badgeLabel, logos: s.logos.map(l => ({ ...l, h: l.h || 60 })) }
    : null;
  return {
    key: s.key,
    title: s.title,
    desc: s.desc,
    officeKey: s.officeKey || null,
    ...(s.badgeType === "dealer"    && badge ? { dealer:    badge } : {}),
    ...(s.badgeType === "certified" && badge ? { certified: badge } : {}),
  };
});

/* ── Badge row — used for both Authorized Dealer and Certified By ── */
function BadgeRow({ badge }) {
  const isDealer = badge.label.toLowerCase().includes("dealer") || badge.label.toLowerCase().includes("authorized");
  const labelColor = isDealer ? "#c9a84c" : "#6b6f91";

  /* Filter out logos whose src starts with /cert- (placeholders — hide until file exists) */
  const visibleLogos = badge.logos.filter(l => !l.src.startsWith("/cert-"));
  const showPlaceholder = visibleLogos.length === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <div style={{
        fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em",
        textTransform: "uppercase", color: labelColor,
      }}>
        {badge.label}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
        {showPlaceholder ? (
          /* Placeholder slots until real logos are added */
          [0, 1].map(i => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                height: 36, width: 60,
                borderRadius: 6,
                background: "rgba(47,49,90,0.06)",
                border: "1px dashed rgba(47,49,90,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(47,49,90,0.3)" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M9 9h1M14 9h1M9 12c0 0 1.5 2 3 2s3-2 3-2"/>
                </svg>
              </div>
              {i === 0 && (
                <div style={{ width: 1, height: 18, background: "rgba(47,49,90,0.15)", margin: "0 0.5rem" }} />
              )}
            </div>
          ))
        ) : (
          visibleLogos.map((logo, i) => (
            <div key={logo.alt} style={{ display: "flex", alignItems: "center" }}>
              <img src={logo.src} alt={logo.alt}
                style={{ height: logo.h, maxWidth: 160, objectFit: "contain" }} />
              {i < visibleLogos.length - 1 && (
                <div style={{ width: 1, height: 18, background: "rgba(47,49,90,0.2)", margin: "0 0.6rem" }} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ── Flip card ── */
function ServiceCard({ service }) {
  const [flipped, setFlipped] = useState(false);
  const contact = SERVICE_CONTACTS[service.key] || {};
  const office  = (service.officeKey && OFFICES[service.officeKey]) || null;
  const waNumber  = contact.whatsapp || "60179052323";
  const waMessage = `Hi, I would like to enquire about your ${service.title} service. Thank you.`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;
  const emailHref = `mailto:${contact.email || "support@ksleow.com.my"}`;

  // QR code points to the same WhatsApp link — scan with phone to open chat
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&margin=2&bgcolor=ffffff&color=2f315a&data=${encodeURIComponent(waLink)}`;

  // Clean address (drop redundant building/street prefix & postal code so it fits)
  const cleanAddress = (contact.address || "Taman Zabidin, Mentakab, Pahang")
    .replace("No.8-9, Ground Floor, ", "")
    .replace("No.8-9, 1st Floor, ", "")
    .replace("No.8-9, 2nd Floor, ", "")
    .replace("Kampung Catin, 28400 ", "");

  return (
    <div style={{ perspective: "1000px", height: 260 }}>
      <div style={{
        position: "relative", width: "100%", height: "100%",
        transformStyle: "preserve-3d",
        transition: "transform 0.55s cubic-bezier(0.4,0.2,0.2,1)",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>

        {/* ── FRONT — click anywhere to flip ── */}
        <div
          onClick={() => setFlipped(true)}
          style={{
            position: "absolute", inset: 0,
            backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
            borderRadius: 18, background: "#f5f5f8",
            border: "1px solid rgba(47,49,90,0.09)",
            padding: "1.4rem",
            display: "flex", flexDirection: "column",
            cursor: "pointer",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onMouseOver={e => {
            e.currentTarget.style.borderColor = "rgba(47,49,90,0.22)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(47,49,90,0.09)";
          }}
          onMouseOut={e => {
            e.currentTarget.style.borderColor = "rgba(47,49,90,0.09)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {/* Top row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            {(service.dealer || service.certified)
              ? <BadgeRow badge={service.dealer || service.certified} />
              : <div />
            }
          </div>

          <h3 style={{ fontSize: "0.97rem", fontWeight: 700, color: "#2f315a", marginBottom: "0.55rem", lineHeight: 1.3 }}>
            {service.title}
          </h3>
          <p style={{
            fontSize: "0.83rem", color: "#6b6f91", lineHeight: 1.6,
            flex: 1, margin: 0,
            /* Clamp to 3 lines so the front stays compact */
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {service.desc}
          </p>

          {/* Subtle "tap to flip" hint at the bottom */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.35rem",
            marginTop: "0.6rem",
            fontSize: "0.68rem", color: "#a8abcc", fontWeight: 500,
          }}>
            Tap for contact
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
         * BACK — premium business card design.
         * Layout:
         *   • Decorative gold geometric shapes in the upper-right corner
         *   • Top header strip: small office logo + tagline + company name
         *   • Two-column body: contact details (left) | QR code panel (right)
         *   • Bottom: WhatsApp + Email CTA buttons
         * Click anywhere on the back to flip; CTAs and QR stop propagation.
         * ══════════════════════════════════════════════════════════════ */}
        <div
          onClick={() => setFlipped(false)}
          style={{
            position: "absolute", inset: 0,
            backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: 18, overflow: "hidden",
            cursor: "pointer",
            background: "#1d2050",
            border: "1px solid rgba(201,168,76,0.2)",
            display: "flex", flexDirection: "column",
            color: "#ffffff",
            boxShadow: "0 10px 32px rgba(15,17,40,0.22)",
          }}
        >
          {/* Decorative background — admins upload the card back image via CMS
           * (Brand Logos → Service card back background image). When unset,
           * the card just shows the solid navy background above. */}
          {branding.serviceCardBack && (
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `url(${branding.serviceCardBack})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              pointerEvents: "none",
            }} aria-hidden="true" />
          )}

          {/* Top header strip — office identity (sits above the gold accents thanks to z-index) */}
          <div style={{
            position: "relative", zIndex: 1,
            padding: "0.95rem 1.15rem 0.7rem",
            display: "flex", alignItems: "center", gap: "0.65rem",
            maxWidth: "65%",
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 7,
              background: "#ffffff",
              border: "1px solid rgba(201,168,76,0.45)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, overflow: "hidden",
              padding: 3,
            }}>
              <img
                src={office?.logo || "/favicon.png"}
                alt={office?.name || "K.S. Leow Group"}
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
              />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.18em",
                textTransform: "uppercase", color: "#e8c97a", marginBottom: 1,
              }}>
                {service.title}
              </div>
              <div style={{
                fontSize: "0.7rem", fontWeight: 700, color: "#ffffff",
                lineHeight: 1.25,
              }}>
                {office?.name || "K.S. Leow Group"}
              </div>
            </div>
          </div>

          {/* Two-column body: contacts (left) + QR code (right) */}
          <div style={{
            position: "relative", zIndex: 1,
            flex: 1,
            padding: "0.4rem 1.15rem 0.5rem",
            display: "flex", gap: "0.85rem",
            alignItems: "stretch",
          }}>
            {/* Left: contact details */}
            <div style={{
              flex: 1, minWidth: 0,
              display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.5rem",
            }}>
              <ContactLine
                icon={<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l1-1a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />}
                label={contact.phone || "017-905 2323"}
                bold
              />
              <ContactLine
                icon={<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>}
                label={contact.email || "support@ksleow.com.my"}
              />
              <ContactLine
                icon={<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>}
                label={cleanAddress}
                small
              />
            </div>

            {/* Right: QR code panel */}
            <div
              onClick={e => e.stopPropagation()}
              style={{
                flexShrink: 0,
                alignSelf: "center",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}
            >
              <div style={{
                background: "#ffffff",
                padding: 4,
                borderRadius: 8,
                boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
                lineHeight: 0,
              }}>
                <img src={qrUrl} alt="WhatsApp QR code"
                  width={84} height={84}
                  style={{ display: "block", borderRadius: 4 }} />
              </div>
              <div style={{
                fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "#e8c97a",
              }}>
                Scan to chat
              </div>
            </div>
          </div>

          {/* Bottom CTA buttons */}
          <div style={{
            position: "relative", zIndex: 1,
            padding: "0.55rem 1.15rem 1rem",
            display: "flex", gap: "0.5rem",
          }}>
            <a href={waLink} target="_blank" rel="noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                background: "#c9a84c", color: "#1e2040",
                borderRadius: 50, padding: "0.5rem 0",
                fontSize: "0.74rem", fontWeight: 700,
                textDecoration: "none", transition: "background 0.2s",
              }}
              onMouseOver={e => { e.currentTarget.style.background = "#e8c97a"; }}
              onMouseOut={e => { e.currentTarget.style.background = "#c9a84c"; }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
              WhatsApp
            </a>
            <a href={emailHref}
              onClick={e => e.stopPropagation()}
              style={{
                flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                background: "rgba(255,255,255,0.06)", color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.22)",
                borderRadius: 50, padding: "0.5rem 0",
                fontSize: "0.74rem", fontWeight: 600,
                textDecoration: "none", transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Single contact line on the back of the card — icon chip + label */
function ContactLine({ icon, label, bold = false, small = false }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.55rem" }}>
      <div style={{
        width: 22, height: 22, borderRadius: 6,
        background: "rgba(201,168,76,0.15)",
        border: "1px solid rgba(201,168,76,0.32)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, marginTop: 1,
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#e8c97a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>
      </div>
      <span style={{
        fontSize: small ? "0.7rem" : "0.78rem",
        color: small ? "rgba(255,255,255,0.72)" : "#ffffff",
        fontWeight: bold ? 700 : 500,
        lineHeight: 1.45,
        wordBreak: "break-word",
        minWidth: 0,
      }}>
        {label}
      </span>
    </div>
  );
}

export default function Services() {
  return (
    <>
      <style>{`@keyframes cardFlip { from { opacity: 0; } to { opacity: 1; } }`}</style>
      <section id="services" style={{ background: "#ffffff", padding: "6rem 0" }}>
        <div className="content-wrap">
          <div style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.75rem" }}>
            {servicesContent.eyebrow}
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700, color: "#2f315a", lineHeight: 1.2, marginBottom: "0.75rem" }}>
            {servicesContent.heading}
          </h2>
          <p style={{ fontSize: "1rem", color: "#6b6f91", lineHeight: 1.75, maxWidth: 540, marginBottom: "3rem" }}>
            {servicesContent.intro}
          </p>
          <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.1rem" }}>
            {SERVICES.map(s => (
              <ServiceCard key={s.key} service={s} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
