import { useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Services from "./components/Services";
import CaseStudies from "./components/CaseStudies";
import Products from "./components/Products";
import Partners from "./components/Partners";
import Careers from "./components/Careers";
import Footer from "./components/Footer";
import ContactModal from "./components/ContactModal";
import "./styles/global.css";

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const openContact = () => setModalOpen(true);

  return (
    <div className="app">
      <Nav onContact={openContact} />
      <Hero onContact={openContact} />
      <Stats />
      <Services />
      <CaseStudies onContact={openContact} />
      <Products onContact={openContact} />
      <Partners />
      <Careers />
      <Footer onContact={openContact} />
      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
