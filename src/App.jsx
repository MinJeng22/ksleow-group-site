import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigationType } from "react-router-dom";

import ContactModal  from "./components/ContactModal";
import BackToTop     from "./components/BackToTop";
import MenuButton    from "./components/MenuButton";
import GlobalSearch  from "./components/GlobalSearch";
import RouteProgressBar from "./components/RouteProgressBar";

import HomePage from "./pages/Home";
import AutoCountAccountingPage from "./pages/products/AutoCountAccounting";
import AutoCountCloudAccountingPage from "./pages/products/AutoCountCloudAccounting";
import AutoCountPOSPage          from "./pages/products/AutoCountPOS";
import FeedMePOSPage           from "./pages/products/FeedMePOS";
import AutoCountPluginsPage    from "./pages/apps/AutoCountPlugins";
import Sales2DOPage            from "./pages/apps/Sales2DO";
import KSOmniPage              from "./pages/KSOmni";
import QuotationViewerPage     from "./pages/QuotationViewer";
import GalleryPage             from "./pages/Gallery";
import siteRoutes from "./content/siteRoutes.json";
import {
  consumeRouteFeedbackPopNavigation,
  flushPostRouteRenderEffects,
  preloadRouteAssets,
  runWithProgressFeedback,
  waitForRouteAssets,
} from "./utils/routeTransitions.js";

import "./styles/global.css";

const routePath = Object.fromEntries(siteRoutes.map((route) => [route.id, route.route]));
const POP_ROUTE_RENDER_DELAY_MS = 500;
const useIsomorphicLayoutEffect = import.meta.env.SSR ? useEffect : useLayoutEffect;

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function SiteRoutes({ openContact, displayLocation }) {
  return (
    <Routes location={displayLocation}>
      <Route path={routePath.home} element={<HomePage onContact={openContact} />} />
      <Route path={routePath["autocount-accounting"]} element={<AutoCountAccountingPage onContact={openContact} />} />
      <Route path={routePath["autocount-cloud-accounting"]} element={<AutoCountCloudAccountingPage />} />
      <Route path={routePath["autocount-pos"]} element={<AutoCountPOSPage onContact={openContact} />} />
      <Route path={routePath["feedme-pos"]} element={<FeedMePOSPage onContact={openContact} />} />
      <Route path={routePath["autocount-plugin"]} element={<AutoCountPluginsPage />} />
      <Route path={routePath.sales2do} element={<Sales2DOPage onContact={openContact} />} />
      <Route path={routePath["ks-omni"]} element={<KSOmniPage onContact={openContact} />} />
      <Route path={routePath.quotation} element={<QuotationViewerPage />} />
      <Route path={routePath.gallery} element={<GalleryPage />} />
      <Route path="*" element={<Navigate to={routePath.home} replace />} />
    </Routes>
  );
}

function DelayedRoutes({ openContact }) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [displayLocation, setDisplayLocation] = useState(location);
  const displayKey = useRef(location.key);
  const renderRun = useRef(0);

  useEffect(() => {
    if (location.key === displayKey.current) return;

    const runId = ++renderRun.current;
    const target = `${location.pathname}${location.search}`;
    const alreadyWaited = navigationType === "POP" && consumeRouteFeedbackPopNavigation();
    const shouldDelayRender = navigationType === "POP" && !alreadyWaited;

    const applyLocation = () => {
      if (runId !== renderRun.current) return;
      displayKey.current = location.key;
      setDisplayLocation(location);
    };

    if (!shouldDelayRender) {
      applyLocation();
      return;
    }

    preloadRouteAssets(target, "high");
    Promise.all([
      wait(POP_ROUTE_RENDER_DELAY_MS),
      waitForRouteAssets(target, { timeout: 2200 }),
    ]).then(applyLocation);
  }, [location, navigationType]);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return undefined;
    flushPostRouteRenderEffects();
    return undefined;
  }, [displayLocation.key]);

  return <SiteRoutes openContact={openContact} displayLocation={displayLocation} />;
}

export function AppShell({ openContact, openSearch, modalOpen, setModalOpen, searchOpen, setSearchOpen }) {
  return (
    <div className="app">
      <RouteProgressBar />

      <DelayedRoutes openContact={openContact} />

      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <BackToTop hideBar={modalOpen || searchOpen} />
      <MenuButton onOpenSearch={openSearch} hideBar={modalOpen || searchOpen} />
    </div>
  );
}

export function AppContent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined" || !("scrollRestoration" in window.history)) return undefined;
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useEffect(() => {
    const currentRoute = siteRoutes.find((r) => r.route === location.pathname);
    if (currentRoute) {
      document.title = currentRoute.route === "/"
        ? currentRoute.title
        : `${currentRoute.title} | K.S. Leow Group`;
    }
  }, [location.pathname]);
  const openContact = () => runWithProgressFeedback(
    () => setModalOpen(true),
    { assets: ["/images/icons/favicon.webp", "/images/branding/service-card-back.webp"] }
  );
  const openSearch = () => setSearchOpen(true);

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
      openSearch={openSearch}
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
