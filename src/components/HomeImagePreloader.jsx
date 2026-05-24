import { useEffect } from "react";
import branding from "../content/branding.json";
import otherServicesContent from "../content/otherServices.json";
import productsContent from "../content/products.json";
import servicesContent from "../content/services.json";

function compactUnique(values) {
  return [...new Set(values.filter(src => typeof src === "string" && src.trim()))];
}

function warmImages(sources, priority = "low") {
  compactUnique(sources).forEach(src => {
    const img = new Image();
    img.decoding = "async";
    img.fetchPriority = priority;
    img.src = src;
  });
}

export default function HomeImagePreloader() {
  useEffect(() => {
    warmImages([branding.heroLogo, branding.navLogo], "high");

    const preloadLater = () => {
      warmImages([
        branding.footerLogo,
        branding.serviceCardBack,
        ...(servicesContent.items || []).map(item => item.backgroundImage),
        ...(servicesContent.items || []).flatMap(item => (item.logos || []).map(logo => logo.src)),
        ...(productsContent.items || []).flatMap(item => [item.image, item.background]),
        ...(otherServicesContent.items || []).map(item => item.image),
      ]);
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(preloadLater, { timeout: 1500 });
      return () => window.cancelIdleCallback?.(id);
    }

    const id = window.setTimeout(preloadLater, 450);
    return () => window.clearTimeout(id);
  }, []);

  return null;
}
