import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";

const root = document.getElementById("root");

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

const clientTakeoverRoutes = [
  /^\/products(?:\/|$)/,
  /^\/apps(?:\/|$)/,
  /^\/omni\/?$/,
  /^\/quotation\/?$/,
];

const shouldClientTakeover = clientTakeoverRoutes.some((route) => route.test(window.location.pathname));

if (root?.hasChildNodes() && !shouldClientTakeover) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
