import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import ProductHero from "../../components/ProductHero.jsx";
import pluginContent from "../../content/autocountPlugins.json";
import acPluginIcon from "../../assets/images/apps/ac-plugin-icon.png";

const SUPPORT_WA_LINK = `https://wa.me/60179052323?text=${encodeURIComponent(
  "HI KS Support Team, I would like to ask about AutoCount Accounting plugins. Thank you."
)}`;

const normalize = (value) => String(value || "").toLowerCase();

function PluginCard({ plugin }) {
  const navigate = useNavigate();
  const hasRoute = Boolean(plugin.route);
  const developerLabel = normalize(plugin.dealer).includes("ksl")
    ? "KSL Developed"
    : "Dealer Developed";
  const openRoute = () => {
    if (hasRoute) navigate(plugin.route);
  };
  return (
    <article
      onClick={openRoute}
      style={{
      background: "#ffffff",
      border: "1px solid rgba(47,49,90,0.1)",
      borderRadius: 16,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      minHeight: 360,
      cursor: hasRoute ? "pointer" : "default",
      boxShadow: "0 14px 42px rgba(47,49,90,0.08)",
      transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
    }}>
      <div style={{
        minHeight: 150,
        background: "linear-gradient(135deg, rgba(47,49,90,0.98), rgba(47,49,90,0.82))",
        color: "#ffffff",
        padding: "1.35rem",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: "1rem",
      }}>
        <div>
          <div style={{ fontSize: "0.68rem", fontWeight: 750, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.5rem" }}>
            {plugin.tag}
          </div>
          <h3 style={{ fontSize: "1.65rem", fontWeight: 800, color: "#ffffff", lineHeight: 1.05 }}>
            {plugin.name}
          </h3>
        </div>
        <span style={{
          borderRadius: 50,
          padding: "0.28rem 0.7rem",
          background: "rgba(255,255,255,0.14)",
          color: "#ffffff",
          fontSize: "0.68rem",
          fontWeight: 750,
          whiteSpace: "nowrap",
        }}>
          {developerLabel}
        </span>
      </div>

      <div style={{ padding: "1.35rem", display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
        <p style={{ color: "#555", fontSize: "0.92rem", lineHeight: 1.75, margin: 0 }}>
          {plugin.summary}
        </p>

        {plugin.modules?.length > 0 && (
          <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginTop: "auto" }}>
            {plugin.modules.map((module) => (
              <span key={module} style={{
                border: "1px solid rgba(47,49,90,0.12)",
                borderRadius: 50,
                padding: "0.22rem 0.55rem",
                color: "#6b6f91",
                fontSize: "0.68rem",
                fontWeight: 650,
              }}>
                {module}
              </span>
            ))}
          </div>
        )}

        <div style={{ color: "#a8abcc", fontSize: "0.76rem", fontWeight: 650 }}>
          Developed by {plugin.dealer}
        </div>

        <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap", paddingTop: "0.2rem" }}>
          {plugin.downloadHref && (
            <a
              href={plugin.downloadHref}
              onClick={(event) => event.stopPropagation()}
              style={{
                borderRadius: 50,
                background: "#2f315a",
                color: "#ffffff",
                padding: "0.62rem 1.05rem",
                fontSize: "0.8rem",
                fontWeight: 760,
                textDecoration: "none",
              }}
            >
              Download
            </a>
          )}
          <a
            href={SUPPORT_WA_LINK}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            style={{
              borderRadius: 50,
              border: "1px solid rgba(47,49,90,0.18)",
              padding: "0.62rem 1.05rem",
              fontSize: "0.8rem",
              fontWeight: 760,
              textDecoration: "none",
              background: "#2f315a",
              color: "#ffffff",
            }}
          >
            Enquire Now
          </a>
        </div>
      </div>
    </article>
  );
}

export default function AutoCountPluginsPage() {
  const sections = pluginContent.sections || [];
  const plugins = useMemo(() => sections.flatMap((section) => section.items || []), [sections]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="pinned-hero-page" style={{ background: "#f5f5f8", minHeight: "100vh" }}>
      <div className="pinned-hero-stage">
        <ProductHero
          eyebrow={pluginContent.hero?.eyebrow}
          title={pluginContent.hero?.title}
          body={pluginContent.hero?.body}
          iconSrc={acPluginIcon}
          iconAlt="AutoCount Plugin"
          primaryCta={{ label: pluginContent.hero?.primaryLabel || "Browse Plugins", href: "#plugin-library" }}
          secondaryCta={{ label: pluginContent.hero?.secondaryLabel || "WhatsApp Support", href: SUPPORT_WA_LINK, target: "_blank" }}
        />
      </div>

      <main className="pinned-page-content">
        <section id="plugin-library" style={{ padding: "3.5rem 0 4.5rem" }}>
        <div className="content-wrap">
          {plugins.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 360px))",
              gap: "1.25rem",
              justifyContent: "center",
            }}>
              {plugins.map((plugin) => <PluginCard key={plugin.name} plugin={plugin} />)}
            </div>
          ) : (
            <div style={{
              background: "#ffffff",
              border: "1px dashed rgba(47,49,90,0.18)",
              borderRadius: 12,
              padding: "1.5rem",
              color: "#6b6f91",
              fontSize: "0.9rem",
              textAlign: "center",
            }}>
              No plugins available.
            </div>
          )}
        </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
