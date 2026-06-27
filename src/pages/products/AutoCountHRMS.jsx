import { useEffect } from "react";
import Footer from "../../components/Footer";
import ProductHero from "../../components/ProductHero";

export default function AutoCountHRMSPage({ onContact }) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <div className="product-app-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ProductHero
        eyebrow="Cloud Payroll & HR"
        title="AutoCount HRMS"
        body="Automated payroll compliant with EPF, SOCSO, PCB, and EIS. Payslips in minutes."
        iconSrc="/images/products/hrms-logo-2024_white-1024x288.webp"
        backgroundImage="/images/products/autocount-hrms.webp"
        primaryCta={{ label: "Enquire Now", onClick: onContact }}
      />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 2rem", textAlign: "center" }}>
        <h2 style={{ color: "#2f315a", fontSize: "1.5rem", fontWeight: 600 }}>More content for this page will be added in the future!</h2>
      </div>
      <Footer />
    </div>
  );
}
