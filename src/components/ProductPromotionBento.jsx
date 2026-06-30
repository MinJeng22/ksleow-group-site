import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Img } from "./Media.jsx";
import { preloadImages, runWithProgressFeedback } from "../utils/routeTransitions.js";

export default function ProductPromotionBento({
  id = "promotions",
  eyebrow = "Promotion",
  title = "Current Promotions",
  items = [],
  accent = "#80c31e",
}) {
  const [lightboxImage, setLightboxImage] = useState(null);
  const openLightbox = (image) => {
    runWithProgressFeedback(() => setLightboxImage(image), { assets: [image] });
  };

  useEffect(() => {
    if (lightboxImage) {
      document.body.classList.add("partner-modal-open");
    } else {
      document.body.classList.remove("partner-modal-open");
    }
    return () => document.body.classList.remove("partner-modal-open");
  }, [lightboxImage]);

  const cards = items.slice(0, 3);

  if (!cards.length) return null;

  return (
    <section id={id} className="content-wrap product-promo-bento" style={{ "--promo-accent": accent }}>
      <style suppressHydrationWarning>{`
        .product-promo-bento {
          scroll-margin-top: 24px;
        }

        .product-promo-head {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 1.25rem;
          margin-bottom: clamp(1rem, 2.2vw, 1.5rem);
        }

        .product-promo-title {
          margin: 0;
          color: #2f315a;
          font-size: clamp(1.45rem, 3vw, 2.35rem);
          font-weight: 850;
          line-height: 1.06;
          letter-spacing: 0;
        }

        .product-promo-grid {
          display: grid;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          grid-template-columns: 1.15fr 1fr;
          grid-template-rows: repeat(2, auto);
          gap: clamp(0.5rem, 1.8vw, 1.15rem);
          align-items: stretch;
        }

        .product-promo-card {
          position: relative;
          min-height: 0;
          overflow: hidden;
          border: 1px solid rgba(47, 49, 90, 0.11);
          border-radius: 22px;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.96), rgba(247,248,253,0.88)),
            #ffffff;
          box-shadow: none;
          isolation: isolate;
          display: block;
          text-decoration: none;
          transition: border-color 0.3s ease;
        }

        .product-promo-card.has-image {
          cursor: pointer;
        }

        .product-promo-card:hover {
          border-color: color-mix(in srgb, var(--promo-accent) 34%, rgba(47, 49, 90, 0.11));
        }

        .product-promo-card.is-featured {
          grid-row: span 2;
          min-height: 100%;
        }

        .product-promo-card:not(.is-featured) {
          aspect-ratio: 16 / 9;
        }

        .product-promo-media {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .product-promo-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-promo-content {
          position: relative;
          z-index: 3;
          display: flex;
          min-height: inherit;
          flex-direction: column;
          justify-content: flex-end;
          gap: 0.8rem;
          padding: clamp(0.8rem, 2.6vw, 2rem);
        }

        .product-promo-badge {
          width: fit-content;
          border-radius: 999px;
          background: color-mix(in srgb, var(--promo-accent) 16%, white);
          color: #2f315a;
          font-size: 0.66rem;
          font-weight: 850;
          letter-spacing: 0.12em;
          padding: 0.36rem 0.72rem;
          text-transform: uppercase;
        }

        .product-promo-card-title {
          margin: 0;
          color: #2f315a;
          font-size: clamp(0.9rem, 2vw, 1.7rem);
          font-weight: 850;
          line-height: 1.08;
          letter-spacing: 0;
        }

        .product-promo-card.is-featured .product-promo-card-title {
          font-size: clamp(1.1rem, 3vw, 2.45rem);
        }

        .product-promo-copy {
          margin: 0;
          max-width: 60ch;
          color: #656a8f;
          font-size: clamp(0.7rem, 1.2vw, 0.98rem);
          line-height: 1.68;
        }

        .product-promo-link {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(47, 49, 90, 0.13);
          border-radius: 999px;
          background: #ffffff;
          color: #2f315a;
          font-size: 0.78rem;
          font-weight: 850;
          padding: 0.68rem 1rem;
          text-decoration: none;
          transition: transform 180ms ease, border-color 180ms ease;
        }

        .product-promo-link:hover {
          transform: translateY(-1px);
          border-color: color-mix(in srgb, var(--promo-accent) 58%, white);
        }

        @keyframes promo-lightbox-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .promo-lightbox-frame {
          position: relative;
          max-width: 95%;
          max-height: 95vh;
          border-radius: 20px;
          display: inline-flex;
          animation: promo-lightbox-zoom 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          background: #ffffff;
          box-shadow: 0 36px 100px rgba(10,11,24,0.36);
        }

        .promo-lightbox-img {
          max-width: 100%;
          max-height: 95vh;
          object-fit: contain;
          border-radius: 20px;
          display: block;
        }

        @keyframes promo-lightbox-zoom {
          from { transform: scale(0.95); }
          to { transform: scale(1); }
        }

        @media (max-width: 640px) {
          .product-promo-card {
            border-radius: 12px;
          }
        }
      `}</style>

      <div className="product-promo-head">
        <div>
          <h2 className="product-promo-title ks-section-title">{title}</h2>
        </div>
      </div>

      <div className="product-promo-grid">
        {cards.map((item, index) => {
          return (
            <article
              key={`${item.title}-${index}`}
              className={`product-promo-card ${index === 0 ? "is-featured" : ""} ${item.image ? "has-image" : ""}`}
              onClick={item.image ? () => openLightbox(item.image) : undefined}
              onPointerEnter={item.image ? () => preloadImages([item.image], "high") : undefined}
            >
              {item.image ? (
                <div className="product-promo-media" aria-hidden="true">
                  <Img
                    src={item.image}
                    alt={item.title}
                    protect={false}
                    priority={true}
                  />
                </div>
              ) : (
                <div className="product-promo-content">
                  {item.badge && <span className="product-promo-badge">{item.badge}</span>}
                  <h3 className="product-promo-card-title">{item.title}</h3>
                  {item.description && <p className="product-promo-copy">{item.description}</p>}
                  {item.cta && (
                    <a
                      href={item.cta.href}
                      target={item.cta.target}
                      rel={item.cta.target === "_blank" ? "noreferrer" : undefined}
                      className="product-promo-link"
                    >
                      {item.cta.label}
                    </a>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {lightboxImage && typeof document !== "undefined" && createPortal(
        <div 
          className="partner-modal-backdrop" 
          onClick={() => setLightboxImage(null)} 
          style={{ zIndex: 99999, animation: "promo-lightbox-fade 0.2s ease forwards", cursor: "zoom-out" }}
        >
          <div className="promo-lightbox-frame" onClick={(e) => e.stopPropagation()} style={{ cursor: "default" }}>
            <button className="partner-modal-close" onClick={() => setLightboxImage(null)} aria-label="Close" style={{ top: 16, right: 16 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <img src={lightboxImage} alt="Promotion Fullscreen" className="promo-lightbox-img" loading="eager" decoding="async" fetchpriority="high" />
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
