import { useEffect } from "react";
import Footer from "../../components/Footer";
import ProductHero from "../../components/ProductHero";
import ProductPlaceholder from "../../components/ProductPlaceholder";

export default function ServerLinkPage({ onContact }) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <div className="pinned-hero-page product-app-page" style={{ minHeight: "100vh" }}>
      <div className="pinned-hero-stage">
        <ProductHero
          eyebrow="Remote Access Solution"
          title="ServerLink"
          body="Secure, fast, and reliable remote access solution for your business software."
          iconSrc="/images/products/serverlink-logo.webp"
          backgroundImage="/images/products/serverlink-showcase.webp"
          primaryCta={{ label: "Enquire Now", onClick: onContact }}
        />
      </div>

      <main className="pinned-page-content product-app-content">
        <ProductPlaceholder title="ServerLink" />
        <Footer />
      </main>
    </div>
  );
}
