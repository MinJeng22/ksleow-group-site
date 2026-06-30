import { useEffect, useRef, useState } from "react";
import { SERVICE_CONTACTS, CONTACT } from "../constants/contact.js";
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
    ? { label: s.badgeLabel, logos: s.logos.map(l => ({ ...l, h: l.h || 60, hoverSrc: l.hoverSrc || null, hoverH: l.hoverH || null })) }
    : null;
  return {
    key: s.key,
    title: s.title,
    desc: s.desc,
    officeKey: s.officeKey || null,
    backgroundImage: s.backgroundImage || null,

    hideBadge: !!s.hideBadge,
    ...(s.badgeType === "dealer"    && badge ? { dealer:    badge } : {}),
    ...(s.badgeType === "certified" && badge ? { certified: badge } : {}),
  };
});

/* ── Badge row — used for both Authorized Dealer and Certified By ── */
function BadgeRow({ badge, onImage = false, forceWhiteLabel = false }) {
  /* Both labels use the same neutral grey (per design spec) */
  const labelColor = forceWhiteLabel ? "#ffffff" : (onImage ? "#2f315a" : "#6b6f91");

  /* Filter out logos whose src starts with /cert- (placeholders — hide until file exists) */
  const visibleLogos = badge.logos.filter(l => !l.src.startsWith("/cert-"));
  const showPlaceholder = visibleLogos.length === 0;

  return (
    <div className="service-badge-row" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", width: "100%" }}>
      <div className="service-badge-label" style={{
        fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em",
        textTransform: "uppercase", color: labelColor, textAlign: "center",
        transition: "color 0.3s ease",
      }}>
        {badge.label}
      </div>
      <div className="service-badge-logos" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0" }}>
        {showPlaceholder ? (
          /* Placeholder slots until real logos are added */
          [0, 1].map(i => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                height: 36, width: 60,
                borderRadius: 6,
                background: forceWhiteLabel ? "rgba(255,255,255,0.06)" : "rgba(47,49,90,0.06)",
                border: `1px dashed ${forceWhiteLabel ? "rgba(255,255,255,0.2)" : "rgba(47,49,90,0.18)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s ease",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={forceWhiteLabel ? "rgba(255,255,255,0.4)" : "rgba(47,49,90,0.3)"} strokeWidth="1.5" style={{ transition: "stroke 0.3s ease" }}>
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M9 9h1M14 9h1M9 12c0 0 1.5 2 3 2s3-2 3-2"/>
                </svg>
              </div>
              {i === 0 && (
                <div style={{ width: 2, height: 44, background: forceWhiteLabel ? "rgba(255,255,255,0.25)" : "rgba(47,49,90,0.15)", margin: "0 0.6rem", transition: "background 0.3s ease", borderRadius: 1 }} />
              )}
            </div>
          ))
        ) : (
          visibleLogos.map((logo, i) => (
            <div key={logo.alt} style={{ display: "flex", alignItems: "center" }}>
              <img src={logo.src} alt={logo.alt}
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                style={{ height: logo.h, maxWidth: 160, objectFit: "contain", transition: "height 0.3s ease" }} />
              {i < visibleLogos.length - 1 && (
                <div style={{ width: 2, height: 44, background: forceWhiteLabel ? "rgba(255,255,255,0.25)" : "rgba(47,49,90,0.2)", margin: "0 0.7rem", transition: "background 0.3s ease", borderRadius: 1 }} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ── Flip card ── */
function ServiceCard({ service, index = 0 }) {
  const [flipped, setFlipped] = useState(false);
  const [flipDirection, setFlipDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isDelayedHover, setIsDelayedHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const cardRef = useRef(null);
  const contact = SERVICE_CONTACTS[service.key] || {};
  const office  = (service.officeKey && OFFICES[service.officeKey]) || null;
  
  const cmsPhones = office?.phones?.map(p => p.number).filter(Boolean);
  const phoneArray = (cmsPhones && cmsPhones.length > 0)
    ? cmsPhones
    : (Array.isArray(contact.phone) ? contact.phone : (contact.phone || "017-905 2323").split(/[,/]/).map(s => s.trim()));
  const primaryPhone = phoneArray[0];

  const cmsAddresses = office?.addresses?.map(a => a.address).filter(Boolean);
  const addressArray = (cmsAddresses && cmsAddresses.length > 0)
    ? cmsAddresses
    : [
        (contact.address || "Taman Zabidin, Mentakab, Pahang")
          .replace("No.8-9, Ground Floor, ", "")
          .replace("No.8-9, 1st Floor, ", "")
          .replace("No.8-9, 2nd Floor, ", "")
          .replace("Kampung Catin, 28400 ", "")
      ];

  const cmsEmails = office?.emails?.map(e => e.email).filter(Boolean);
  const emailArray = (cmsEmails && cmsEmails.length > 0)
    ? cmsEmails
    : [contact.email || "support@ksleow.com.my"];

  const fbLink = office?.facebook || CONTACT.facebook;

  let waNumber = primaryPhone.replace(/\D/g, "");
  if (waNumber.startsWith("0")) {
    waNumber = "6" + waNumber;
  }
  if (!waNumber) {
    waNumber = CONTACT.whatsapp || "60179052323";
  }
  const waMessage = `Hi! I'm interested in ${service.title}. Could you provide more details?`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  // QR code points to the same WhatsApp link — scan with phone to open chat
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&margin=2&bgcolor=ffffff&color=2f315a&data=${encodeURIComponent(waLink)}`;

  const isWebinar = service.key === "webinar";
  const showBadge = !isWebinar && !service.hideBadge;
  const hasFrontBackground = false;

  useEffect(() => {
    if (isHovered) {
      const timer = setTimeout(() => setIsDelayedHover(true), 500);
      return () => clearTimeout(timer);
    } else {
      setIsDelayedHover(false);
    }
  }, [isHovered]);

  useEffect(() => {
    const preload = (src) => {
      if (!src) return;
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    };

    preload(service.backgroundImage);
    const logos = service.dealer?.logos || service.certified?.logos || [];
    logos.forEach((logo) => preload(logo.hoverSrc || logo.src));
  }, [service]);

  useEffect(() => {
    const node = cardRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      setHasRevealed(true);
      return undefined;
    }
    const mql = window.matchMedia("(max-width: 1024px)");
    setIsMobile(mql.matches);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
          if (entry.isIntersecting) {
            setHasRevealed(true);
          } else {
            setFlipped(false);
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: mql.matches ? "0px 0px 28% 0px" : "0px 0px 22% 0px",
      }
    );
    observer.observe(node);

    const mqlHandler = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", mqlHandler);

    return () => {
      observer.disconnect();
      mql.removeEventListener("change", mqlHandler);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsHovered(false);
    }
  }, [isMobile]);

  const isActive = service.backgroundImage && isDelayedHover;

  let activeBadge = service.dealer || service.certified;
  if (isActive && activeBadge) {
    activeBadge = { ...activeBadge, logos: activeBadge.logos.map(l => ({ 
      ...l, 
      src: l.hoverSrc || l.src,
      h: l.hoverH || l.h 
    })) };
  }

    return (
      <div
        id={`service-${service.key}`}
        ref={cardRef}
        className={`service-card-shell service-card-reveal${hasRevealed ? " is-in-view" : ""}`}
        style={{
          perspective: "1200px",
          height: 290,
          "--service-reveal-delay": `${Math.min(index * 95, 570)}ms`,
        }}
      >
      <div style={{
        position: "relative", width: "100%", height: "100%",
        transformStyle: "preserve-3d",
        WebkitTransformStyle: "preserve-3d",
        transition: "transform 0.48s cubic-bezier(0.22, 1, 0.36, 1)",
        transform: flipped ? `rotateY(${180 * flipDirection}deg)` : "rotateY(0deg)",
        willChange: "transform",
      }}>

        {/* ── FRONT — click anywhere to flip ── */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const isLeft = clickX < rect.width / 2;
            setFlipDirection(isLeft ? -1 : 1);
            setFlipped(true);
          }}
          style={{
            position: "absolute", inset: 0,
            backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg) translateZ(0.1px)",
            willChange: "transform",
            contain: "paint",
            borderRadius: 18,
            background: "#f5f5f8",
            border: "1px solid #d8dbe8",
            boxShadow: "none",
            padding: "1.4rem",
            display: "flex", flexDirection: "column",
            overflow: "hidden",
            pointerEvents: flipped ? "none" : "auto",
            cursor: "pointer",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onMouseOver={e => {
            if (!isMobile) setIsHovered(true);
            e.currentTarget.style.borderColor = "#bfc4d8";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(47,49,90,0.09)";
          }}
          onMouseOut={e => {
            if (!isMobile) setIsHovered(false);
            e.currentTarget.style.borderColor = "#d8dbe8";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {/* Hover Background Image with Overlay */}
          {service.backgroundImage && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 0,
              backgroundImage: `url(${service.backgroundImage})`,
              backgroundSize: "cover", backgroundPosition: "center",
              opacity: isActive ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}>
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
            </div>
          )}

          {/* Top row — badge centered horizontally */}
          {showBadge && (
            <div className="service-badge-wrap" style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", marginBottom: "1rem" }}>
              {activeBadge
                ? <BadgeRow badge={activeBadge} onImage={hasFrontBackground || isActive} forceWhiteLabel={isActive} />
                : <div />
              }
            </div>
          )}
          <h3 style={{
            position: "relative", zIndex: 1,
            fontSize: "clamp(1.18rem, 1.5vw, 1.38rem)",
            fontWeight: 800,
            color: isActive ? "#ffffff" : "#2f315a",
            marginTop: "auto",
            marginBottom: "0.6rem",
            lineHeight: 1.22,
            textShadow: "none",
            transition: "color 0.3s ease",
          }}>
            {service.title}
          </h3>
          <p style={{
            position: "relative", zIndex: 1,
            fontSize: "0.83rem",
            color: isActive ? "rgba(255,255,255,0.9)" : (hasFrontBackground ? "#4f577f" : "#6b6f91"),
            lineHeight: 1.6,
            margin: 0,
            /* Clamp to 4 lines max — paired with shorter descriptions in
               services.json so lines never get visually cut. */
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            transition: "color 0.3s ease",
          }}>
            {service.desc}
          </p>

          {/* Subtle "tap to flip" hint — bottom-right */}
          <div style={{
            position: "relative", zIndex: 1,
            display: "inline-flex", alignItems: "center", gap: "0.35rem",
            marginTop: "0.6rem",
            alignSelf: "flex-end",
            fontSize: "0.84rem", 
            color: isActive ? "#ffffff" : (hasFrontBackground ? "#2f315a" : "#c9a84c"), 
            fontWeight: 700,
            transition: "color 0.3s ease",
          }}>
            Tap for contact
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
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
            transform: "rotateY(180deg) translateZ(0.1px)",
            willChange: "transform",
            contain: "paint",
            borderRadius: 18, overflow: "hidden",
            cursor: "pointer",
            background: "#20255a",
            border: "none",
            display: "flex", flexDirection: "column",
            pointerEvents: flipped ? "auto" : "none",
            color: "#ffffff",
            boxShadow: "0 10px 32px rgba(15,17,40,0.22)",
          }}
        >
          {/* Decorative background — defaults to the WebP at /images/branding/service-card-back.webp.
           * Place your image at:  public/images/branding/service-card-back.webp
           * Admins can also override via CMS → Brand Logos → Service card back. */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${branding.serviceCardBack || "/images/branding/service-card-back.webp"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            pointerEvents: "none",
          }} aria-hidden="true" />

          {/* Top header strip — office identity (sits above the gold accents thanks to z-index) */}
          <div style={{
            position: "relative", zIndex: 1,
            padding: "0.95rem 1.15rem 0.7rem",
            display: "flex", alignItems: "center", gap: "0.65rem",
          }}>
            <div style={{
              width: 36, height: 36,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <img
                src={office?.logo || "/images/icons/favicon.webp"}
                alt={office?.name || "K.S. Leow Group"}
                loading="lazy"
                decoding="async"
                fetchpriority="low"
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
            <div
              className="custom-scrollbar"
              style={{
                flex: 1, minWidth: 0,
                display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: "0.5rem",
                overflowY: "auto", paddingRight: "4px"
              }}
            >
              {phoneArray.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {phoneArray.map((phone, idx) => (
                    <ContactLine
                      key={`phone-${idx}`}
                      icon={idx === 0 ? <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l1-1a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /> : null}
                      label={phone}
                      isSingleItem={phoneArray.length === 1}
                    />
                  ))}
                </div>
              )}
              {addressArray.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {addressArray.map((addr, idx) => (
                    <ContactLine
                      key={`addr-${idx}`}
                      icon={idx === 0 ? <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></> : null}
                      label={addr}
                      isSingleItem={addressArray.length === 1}
                    />
                  ))}
                </div>
              )}
              {emailArray.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {emailArray.map((email, idx) => (
                    <ContactLine
                      key={`email-${idx}`}
                      icon={idx === 0 ? <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></> : null}
                      label={email}
                      isSingleItem={emailArray.length === 1}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right: QR code panel */}
            {!isMobile && (
              <div
                onClick={() => setFlipped(false)}
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
            )}
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
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M9 7h8v8" /></svg>
            </a>
            <a href={fbLink} target="_blank" rel="noreferrer"
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
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.412c0-3.026 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97H15.83c-1.491 0-1.955.931-1.955 1.886v2.266h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
              </svg>
              Facebook
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M9 7h8v8" /></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Single contact line on the back of the card — icon chip + label.
 * All rows share identical typography (size / weight / colour). */
function ContactLine({ icon, label, isSingleItem }) {
  return (
    <div style={{ display: "flex", alignItems: isSingleItem ? "center" : "flex-start", gap: "0.55rem" }}>
      <div style={{
        width: 22, height: 22, borderRadius: 6,
        background: icon ? "rgba(201,168,76,0.15)" : "transparent",
        border: icon ? "1px solid rgba(201,168,76,0.32)" : "1px solid transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, marginTop: isSingleItem ? 0 : 1,
      }}>
        {icon && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#e8c97a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {icon}
          </svg>
        )}
      </div>
      <span style={{
        fontSize: "0.78rem",
        color: "#ffffff",
        fontWeight: 500,
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
      <style>{`
        @keyframes cardFlip { from { opacity: 0; } to { opacity: 1; } }
        #services .services-bg-fade {
          background: linear-gradient(
            to bottom,
            rgba(245,245,248,0.98) 0%,
            rgba(245,245,248,0.74) 7%,
            rgba(245,245,248,0.34) 18%,
            rgba(245,245,248,0.08) 30%,
            rgba(245,245,248,0) 40%,
            rgba(245,245,248,0) 100%
          );
        }
        @media (min-width: 768px) {
          #services .services-bg-fade {
            background: linear-gradient(
              to bottom,
              rgba(245,245,248,0.96) 0%,
              rgba(245,245,248,0.78) 5%,
              rgba(245,245,248,0.42) 14%,
              rgba(245,245,248,0.16) 25%,
              rgba(245,245,248,0.03) 34%,
              rgba(245,245,248,0) 43%,
              rgba(245,245,248,0) 100%
            );
          }
        }
      `}</style>
      <section
        id="services"
        className="home-section"
        style={{ position: "relative", overflow: "hidden", background: "#f5f5f8", padding: "var(--section-py) 0" }}
      >
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/images/services/ksLeow-group-bg.webp)",
          backgroundSize: "cover",
          backgroundPosition: "left center",
          opacity: 0.35,
          zIndex: 0
        }} />
        <div className="services-bg-fade" style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none"
        }} />

        <div className="content-wrap" style={{ position: "relative", zIndex: 1 }}>
          <div className="ks-eyebrow" style={{ marginBottom: "0.75rem" }}>
            {servicesContent.eyebrow}
          </div>
          <h2 className="ks-section-title ks-section-title-lg" style={{ marginBottom: "0.75rem" }}>
            {servicesContent.heading}
          </h2>
          <p className="ks-body-text" style={{ marginBottom: "3rem" }}>
            {servicesContent.intro}
          </p>
          <div
            className="services-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 500px))", justifyContent: "center", gap: "1.1rem" }}
          >
            {SERVICES.map((s, index) => (
              <ServiceCard key={s.key} service={s} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
