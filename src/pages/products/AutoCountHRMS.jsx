import { useEffect } from "react";
import Footer from "../../components/Footer";
import ProductHero from "../../components/ProductHero";
import ProductPlaceholder from "../../components/ProductPlaceholder";
import useFavicon from "../../hooks/useFavicon.js";

const WA_LINK = `https://wa.me/60179052323?text=${encodeURIComponent("Hi KS Support Team, I would like to learn more about AutoCount HRMS. Thank you.")}`;

export default function AutoCountHRMSPage({ onContact }) {
  useFavicon("/images/products/hrms-icon.webp");
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <div className="pinned-hero-page product-app-page" style={{ minHeight: "100vh" }}>
      <div className="pinned-hero-stage">
        <ProductHero
          eyebrow="Cloud Payroll & HR"
          title="AutoCount HRMS"
          body="Automated payroll compliant with EPF, SOCSO, PCB, and EIS. Payslips in minutes."
          iconSrc="/images/products/hrms-icon.webp"
          backgroundImage="/images/products/autocount-hrms.webp"
          primaryCta={{ label: "Start Free Trial", onClick: onContact, className: "ks-btn-hrms" }}
          secondaryCta={{ label: "WhatsApp Us", href: WA_LINK, target: "_blank" }}
        />
      </div>

      <main className="pinned-page-content product-app-content">
        <ProductPlaceholder title="AutoCount HRMS" />
        <Footer />
      </main>
    </div>
  );
}
