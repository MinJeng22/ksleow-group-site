import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Nav           from "./components/Nav";
import ContactModal  from "./components/ContactModal";
import Hero          from "./components/Hero";
import Stats         from "./components/Stats";
import Services      from "./components/Services";
import CaseStudies   from "./components/CaseStudies";
import Products      from "./components/Products";
import Partners      from "./components/Partners";
import Careers       from "./components/Careers";
import Footer        from "./components/Footer";
import BackToTop     from "./components/BackToTop";

import AutoCountAccountingPage from "./pages/products/AutoCountAccounting";
import Sales2DOPage            from "./pages/apps/Sales2DO";

import "./styles/global.css";

function Home({ onContact }) {
  return (
    <>
      <Hero onContact={onContact} />
      <Stats />
      <Services />
      <CaseStudies onContact={onContact} />
      <Products onContact={onContact} />
      <Partners />
      <Careers />
      <Footer />
    </>
  );
}

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const openContact = () => setModalOpen(true);

  return (
    <BrowserRouter>
      <div className="app">
        <Nav onContact={openContact} />

        <Routes>
          <Route path="/"                              element={<Home onContact={openContact} />} />
          <Route path="/products/autocount-accounting" element={<AutoCountAccountingPage onContact={openContact} />} />
          <Route path="/apps/sales2do"                 element={<Sales2DOPage onContact={openContact} />} />
        </Routes>

        <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
        <BackToTop />
      </div>
    </BrowserRouter>
  );
}