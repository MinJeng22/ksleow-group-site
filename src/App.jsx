import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Nav           from "./components/Nav";
import ContactModal  from "./components/ContactModal";
import BackToTop     from "./components/BackToTop";
import MenuButton    from "./components/MenuButton";
import GlobalSearch  from "./components/GlobalSearch";

import HomePage from "./pages/Home";
import AutoCountAccountingPage from "./pages/products/AutoCountAccounting";
import AutoCountCloudAccountingPage from "./pages/products/AutoCountCloudAccounting";
import FeedMePOSPage           from "./pages/products/FeedMePOS";
import AutoCountPluginsPage    from "./pages/apps/AutoCountPlugins";
import Sales2DOPage            from "./pages/apps/Sales2DO";
import KSOmniPage              from "./pages/KSOmni";
import QuotationViewerPage     from "./pages/QuotationViewer";
import GalleryPage             from "./pages/Gallery";
import siteRoutes from "./content/siteRoutes.json";

import "./styles/global.css";

const routePath = Object.fromEntries(siteRoutes.map((route) => [route.id, route.route]));

/* The site Nav is shown ONLY on the homepage. Every other route (including
 * /omni, product pages, app pages) provides its own page header. */
export function AppShell({ openContact, modalOpen, setModalOpen, searchOpen, setSearchOpen }) {
  const { pathname } = useLocation();
  const showNav = pathname === "/";

  return (
    <div className="app">
      {showNav && <Nav onContact={openContact} />}

      <Routes>
        <Route path={routePath.home} element={<HomePage onContact={openContact} />} />
        <Route path={routePath["autocount-accounting"]} element={<AutoCountAccountingPage onContact={openContact} />} />
        <Route path={routePath["autocount-cloud-accounting"]} element={<AutoCountCloudAccountingPage />} />
        <Route path={routePath["feedme-pos"]} element={<FeedMePOSPage onContact={openContact} />} />
        <Route path={routePath["autocount-plugin"]} element={<AutoCountPluginsPage />} />
        <Route path={routePath.sales2do} element={<Sales2DOPage onContact={openContact} />} />
        <Route path={routePath["ks-omni"]} element={<KSOmniPage onContact={openContact} />} />
        <Route path={routePath.quotation} element={<QuotationViewerPage />} />
        <Route path={routePath.gallery} element={<GalleryPage />} />
      </Routes>

      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <BackToTop hideBar={modalOpen || searchOpen} />
      <MenuButton onOpenSearch={() => setSearchOpen(true)} hideBar={modalOpen || searchOpen} />
    </div>
  );
}

export function AppContent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const openContact = () => setModalOpen(true);

  useEffect(() => {
    if (modalOpen || searchOpen) {
      document.body.classList.add("has-active-modal");
    } else {
      document.body.classList.remove("has-active-modal");
    }
  }, [modalOpen, searchOpen]);

  return (
    <AppShell
      openContact={openContact}
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      searchOpen={searchOpen}
      setSearchOpen={setSearchOpen}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
