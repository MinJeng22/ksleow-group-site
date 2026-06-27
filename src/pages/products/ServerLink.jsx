import { useEffect } from "react";
import Footer from "../../components/Footer";
import ProductHero from "../../components/ProductHero";

export default function ServerLinkPage({ onContact }) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <div className="product-app-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ProductHero
        eyebrow="Remote Access Solution"
        title="ServerLink"
        body="Secure, fast, and reliable remote access solution for your business software."
        iconSrc="/images/products/serverlink-logo.webp"
        backgroundImage="/images/products/serverlink-showcase.webp"
        primaryCta={{ label: "Enquire Now", onClick: onContact }}
      />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 2rem", textAlign: "center" }}>
        <h2 style={{ color: "#2f315a", fontSize: "1.5rem", fontWeight: 600 }}>More content for this page will be added in the future!</h2>
      </div>
      <Footer />
    </div>
  );
}
