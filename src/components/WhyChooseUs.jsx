import React from "react";
import SectionDivider, { IconTrophy } from "./SectionDivider";

export const AWARDS_IMAGES = [
  "/images/awards/top-dealer-2019-trophy.png",
  "/images/awards/top-dealer-2019-modal.png",
  "/images/awards/top-dealer-2021-trophy.png",
  "/images/awards/top-dealer-2021-modal.png",
  "/images/awards/top-dealer-2022-trophy.png",
  "/images/awards/top-dealer-2022-modal.png",
  "/images/awards/top-dealer-2023-trophy.png",
  "/images/awards/top-dealer-2023-modal.png",
  "/images/awards/top-dealer-2024-trophy.png",
  "/images/awards/top-dealer-2024-modal.png",
  "/images/awards/top-dealer-2025-trophy.png",
  "/images/awards/top-dealer-2025-modal.png",
];

export default function WhyChooseUs({ section, sectionFrom = "var(--ks-page-cloud)", sectionTo = "var(--ks-page-warm)" }) {
  return (
    <>
      <div className="product-app-divider" style={{ "--section-from": sectionFrom, "--section-to": sectionTo }}>
        <SectionDivider section={section || { id: "why-ksl", icon: IconTrophy }} />
      </div>
      <div id="why-ksl" className="product-app-section product-app-section-warm" style={{ padding: "4rem 0", scrollMarginTop: 24 }}>
        <style>{`
          .ac-awards-container-new {
            margin-top: 1.5rem;
            padding: 2.5rem 0;
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          }
          .ac-awards-item {
            flex: 0 0 auto;
            width: 80px;
            height: 110px;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            padding: 0 0.5rem;
          }
          .ac-awards-item:nth-child(even) {
            margin-right: 1.5rem;
          }
          .ac-awards-item:hover {
            transform: translateY(-5px);
            z-index: 10;
          }
          .ac-awards-item img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            transition: transform 0.4s ease;
          }
          .ac-awards-item:hover img {
            transform: scale(1.15);
          }
          .ac-awards-container-new:hover .ac-brand-marquee {
            animation-play-state: paused !important;
          }

          /* Desktop: Static, fit 12 items exactly to screen */
          @media (min-width: 1025px) {
            .ac-awards-container-new {
              mask-image: none;
              -webkit-mask-image: none;
              max-width: 1200px; /* Limit max width on very large screens */
              margin-left: auto;
              margin-right: auto;
            }
            .ac-awards-marquee-track {
              animation: none !important;
              justify-content: space-between;
              width: 100%;
            }
            .ac-awards-item.dup {
              display: none;
            }
            .ac-awards-item {
              flex: 1;
              max-width: calc(100% / 12);
              height: 140px;
              padding: 0 5px;
              margin-right: 0 !important;
            }
            .ac-awards-item img {
              width: 100%;
              object-fit: contain;
            }
          }
          /* Mobile: Keep marquee sizes */
          @media (max-width: 1024px) {
            .ac-awards-item {
              width: 80px;
              height: 110px;
              padding: 0 0.5rem;
            }
          }
        `}</style>
        <div className="content-wrap" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700, color: "#2f315a", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>Why Choose Us?</h2>
          
          <p style={{
            textAlign: "center", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.15em",
            color: "#6b6f91", textTransform: "uppercase", marginBottom: "2.5rem", maxWidth: "1000px", margin: "0 auto 2.5rem", lineHeight: 1.6
          }}>
            Top AutoCount Dealer in Pahang State for 6 Award-Winning Years - Empowering Your Business with Proven Expertise, Prompt On-Site Support & Dedicated Training
          </p>

          <div className="ac-brand-marquee-container ac-awards-container-new">
            <div className="ac-brand-marquee ac-awards-marquee-track" style={{ animationDuration: "35s" }}>
              {AWARDS_IMAGES.map((src, i) => (
                <div key={`orig-${i}`} className="ac-awards-item">
                  <img src={src} alt="Top AutoCount Dealer Award" loading="lazy" />
                </div>
              ))}
              {[...AWARDS_IMAGES, ...AWARDS_IMAGES, ...AWARDS_IMAGES].map((src, i) => (
                <div key={`dup-${i}`} className="ac-awards-item dup">
                  <img src={src} alt="Top AutoCount Dealer Award" loading="lazy" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
