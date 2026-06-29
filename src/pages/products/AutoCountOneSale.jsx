import { useEffect } from "react";
import Footer from "../../components/Footer";
import ProductHero from "../../components/ProductHero";
import ProductPlaceholder from "../../components/ProductPlaceholder";

export default function AutoCountOneSalePage({ onContact }) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <div className="pinned-hero-page product-app-page" style={{ minHeight: "100vh" }}>
      <div className="pinned-hero-stage">
        <ProductHero
          eyebrow="Omnichannel Sales"
          title="AutoCount OneSale"
          body="Omnichannel sales management seamlessly integrated with AutoCount."
          iconSrc="/images/products/autocount-onesales.webp"
          backgroundImage="/images/products/autocount-onesale.webp"
          primaryCta={{ label: "Enquire Now", onClick: onContact }}
        />
      </div>

      <main className="pinned-page-content product-app-content">
        <ProductPlaceholder title="AutoCount OneSale" />
        <Footer />
      </main>
    </div>
  );
}
