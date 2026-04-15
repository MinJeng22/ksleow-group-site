import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* ── Layouts & Pages ── */
import Nav          from "./components/Nav";
import ContactModal from "./components/ContactModal";

/* ── Home page sections ── */
import Hero       from "./components/Hero";
import Stats      from "./components/Stats";
import Services   from "./components/Services";
import CaseStudies from "./components/CaseStudies";
import Products   from "./components/Products";
import Partners   from "./components/Partners";
import Careers    from "./components/Careers";
import Footer     from "./components/Footer";

/* ── Product pages ── */
import AutoCountAccountingPage from "./pages/products/AutoCountAccounting";

import "./styles/global.css";

/* ── Home assembled ── */
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

/* ── Root App with router ── */
export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const openContact = () => setModalOpen(true);

  return (
    <BrowserRouter>
      <div className="app">
        <Nav onContact={openContact} />

        <Routes>
          <Route path="/"                           element={<Home onContact={openContact} />} />
          <Route path="/products/autocount-accounting" element={<AutoCountAccountingPage onContact={openContact} />} />
          {/* Add more product routes here as needed */}
        </Routes>

        <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </BrowserRouter>
  );
}
