import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Nav           from "./components/Nav";
import ContactModal  from "./components/ContactModal";
import Hero          from "./components/Hero";
import Stats         from "./components/Stats";
import Services      from "./components/Services";
import CaseStudies   from "./components/CaseStudies";
import Products      from "./components/Products";
import Careers       from "./components/Careers";
import Footer        from "./components/Footer";
import BackToTop     from "./components/BackToTop";

import AutoCountAccountingPage from "./pages/products/AutoCountAccounting";
import Sales2DOPage            from "./pages/apps/Sales2DO";
import KSOmniPage              from "./pages/KSOmni";

import "./styles/global.css";

function Home({ onContact }) {
  return (
    <>
      <Hero onContact={onContact} />
      <Stats />
      <Services />
      <Products onContact={onContact} />
      <CaseStudies onContact={onContact} />
      <Careers />
      <Footer />
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
        <Route path="/apps/sales2do"                 element={<Sales2DOPage onContact={openContact} />} />
        <Route path="/omni"                           element={<KSOmniPage   onContact={openContact} />} />
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