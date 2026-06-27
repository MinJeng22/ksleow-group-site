import { useEffect } from "react";
import Footer from "../../components/Footer";
import ProductHero from "../../components/ProductHero";
import ProductPlaceholder from "../../components/ProductPlaceholder";

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
      <ProductPlaceholder title="AutoCount HRMS" />
      <Footer />
    </div>
  );
}
