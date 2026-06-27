import { useEffect } from "react";
import Footer from "../../components/Footer";
import ProductHero from "../../components/ProductHero";
import ProductPlaceholder from "../../components/ProductPlaceholder";

export default function AutoCountOneSalePage({ onContact }) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <div className="product-app-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ProductHero
        eyebrow="Omnichannel Sales"
        title="AutoCount OneSale"
        body="Omnichannel sales management seamlessly integrated with AutoCount."
        iconSrc="/images/products/autocount-onesales.webp"
        backgroundImage="/images/products/autocount-onesale.webp"
        primaryCta={{ label: "Enquire Now", onClick: onContact }}
      />
      <ProductPlaceholder title="AutoCount OneSale" />
      <Footer />
    </div>
  );
}
