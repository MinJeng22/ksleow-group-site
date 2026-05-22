import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Nav           from "./components/Nav";
import ContactModal  from "./components/ContactModal";
import Hero          from "./components/Hero";
import HomeImagePreloader from "./components/HomeImagePreloader";
import Stats         from "./components/Stats";
import Services      from "./components/Services";
import CaseStudies   from "./components/CaseStudies";
import Products      from "./components/Products";
import Careers       from "./components/Careers";
import Footer        from "./components/Footer";
import BackToTop     from "./components/BackToTop";

import AutoCountAccountingPage from "./pages/products/AutoCountAccounting";
import AutoCountCloudAccountingPage from "./pages/products/AutoCountCloudAccounting";
import FeedMePOSPage           from "./pages/products/FeedMePOS";
import AutoCountPluginsPage    from "./pages/apps/AutoCountPlugins";
import Sales2DOPage            from "./pages/apps/Sales2DO";
import KSOmniPage              from "./pages/KSOmni";
import QuotationViewerPage     from "./pages/QuotationViewer";

import "./styles/global.css";

function Home({ onContact }) {
  return (
    <>
      <HomeImagePreloader />
      <div className="home-pinned-layout">
        <div className="home-hero-layer">
          <Hero onContact={onContact} />
        </div>
        <main className="home-content-layer">
          <Stats />
          <Services />
          <Products onContact={onContact} />
          <CaseStudies onContact={onContact} />
          <Careers />
          <Footer />
        </main>
      </div>
    </>
  );
}

/* The site Nav is shown ONLY on the homepage. Every other route (including
 * /omni, product pages, app pages) provides its own page header. */
function AppShell({ openContact, modalOpen, setModalOpen }) {
  const { pathname } = useLocation();
  const showNav = pathname === "/";

  return (
    <div className="app">
      {showNav && <Nav onContact={openContact} />}

      <Routes>
        <Route path="/"                              element={<Home onContact={openContact} />} />
        <Route path="/products/autocount-accounting" element={<AutoCountAccountingPage onContact={openContact} />} />
        <Route path="/products/autocount-cloud-accounting" element={<AutoCountCloudAccountingPage />} />
        <Route path="/products/feedme-pos"           element={<FeedMePOSPage           onContact={openContact} />} />
        <Route path="/apps/autocount-plugin"         element={<AutoCountPluginsPage />} />
        <Route path="/apps/sales2do"                 element={<Sales2DOPage onContact={openContact} />} />
        <Route path="/omni"                           element={<KSOmniPage   onContact={openContact} />} />
        <Route path="/quotation"                      element={<QuotationViewerPage />} />
      </Routes>

      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <BackToTop />
    </div>
  );
}

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const openContact = () => setModalOpen(true);

  return (
    <BrowserRouter>
      <AppShell openContact={openContact} modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </BrowserRouter>
  );
}
