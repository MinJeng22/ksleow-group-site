import React from "react";
import { Img } from "./Media.jsx";

export default function ProductPromotionBento({
  id = "promotions",
  eyebrow = "Promotion",
  title = "Current Promotions",
  items = [],
  accent = "#80c31e",
}) {
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
          grid-template-columns: minmax(0, 1.14fr) minmax(320px, 0.86fr);
          grid-template-rows: repeat(2, auto);
          gap: clamp(0.85rem, 1.8vw, 1.15rem);
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
          box-shadow: 0 24px 70px rgba(31, 34, 74, 0.09);
          isolation: isolate;
          display: block;
          text-decoration: none;
          transition: box-shadow 0.3s ease;
        }

        .product-promo-card:hover {
          box-shadow: 0 32px 84px rgba(31, 34, 74, 0.14);
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
          padding: clamp(1.25rem, 2.6vw, 2rem);
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
          font-size: clamp(1.15rem, 2vw, 1.7rem);
          font-weight: 850;
          line-height: 1.08;
          letter-spacing: 0;
        }

        .product-promo-card.is-featured .product-promo-card-title {
          font-size: clamp(1.55rem, 3vw, 2.45rem);
        }

        .product-promo-copy {
          margin: 0;
          max-width: 60ch;
          color: #656a8f;
          font-size: clamp(0.88rem, 1.2vw, 0.98rem);
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
          transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
        }

        .product-promo-link:hover {
          transform: translateY(-1px);
          border-color: color-mix(in srgb, var(--promo-accent) 58%, white);
          box-shadow: 0 14px 32px rgba(47, 49, 90, 0.12);
        }

        @media (max-width: 980px) {
          .product-promo-grid {
            overflow-x: auto;
            padding-bottom: 1rem;
            scrollbar-width: none;
            grid-template-columns: minmax(380px, 1.14fr) minmax(300px, 0.86fr);
            /* Ensure the grid takes full width of its tracks */
            display: grid;
          }
          .product-promo-grid::-webkit-scrollbar {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .product-promo-head {
            display: block;
          }

          .product-promo-card,
          .product-promo-card.is-featured {
            border-radius: 18px;
            min-height: 240px;
          }

          .product-promo-content {
            padding: 1.15rem;
          }
        }
      `}</style>

      <div className="product-promo-head">
        <div>
          <h2 className="product-promo-title">{title}</h2>
        </div>
      </div>

      <div className="product-promo-grid">
        {cards.map((item, index) => {
          const CardTag = item.cta?.href ? "a" : "article";
          const cardProps = item.cta?.href
            ? {
                href: item.cta.href,
                target: item.cta.target,
                rel: item.cta.target === "_blank" ? "noreferrer" : undefined,
              }
            : {};

          return (
            <CardTag
              key={`${item.title}-${index}`}
              className={`product-promo-card ${index === 0 ? "is-featured" : ""} ${item.image ? "has-image" : ""}`}
              {...cardProps}
            >
              {item.image ? (
                <div className="product-promo-media" aria-hidden="true">
                  <Img
                    src={item.image}
                    alt={item.title}
                    protect={false}
                    priority={index === 0}
                  />
                </div>
              ) : (
                <div className="product-promo-content">
                  {item.badge && <span className="product-promo-badge">{item.badge}</span>}
                  <h3 className="product-promo-card-title">{item.title}</h3>
                  {item.description && <p className="product-promo-copy">{item.description}</p>}
                  {item.cta && (
                    <span className="product-promo-link">
                      {item.cta.label}
                    </span>
                  )}
                </div>
              )}
            </CardTag>
          );
        })}
      </div>
    </section>
  );
}
