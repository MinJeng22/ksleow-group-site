import { useMemo, useState } from "react";
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
  return (
    <article style={{
      background: "#ffffff",
      border: "1px solid rgba(47,49,90,0.1)",
      borderRadius: 12,
      padding: "1.35rem",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      minHeight: 280,
      boxShadow: "0 8px 28px rgba(47,49,90,0.05)",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.68rem", fontWeight: 750, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.35rem" }}>
            {plugin.tag}
          </div>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 760, color: "#2f315a", lineHeight: 1.25 }}>
            {plugin.name}
          </h3>
        </div>
        <span style={{
          borderRadius: 50,
          padding: "0.25rem 0.65rem",
          background: plugin.status === "Available" ? "rgba(122,179,23,0.12)" : "rgba(47,49,90,0.07)",
          color: plugin.status === "Available" ? "#4f7f10" : "#6b6f91",
          fontSize: "0.68rem",
          fontWeight: 750,
          whiteSpace: "nowrap",
        }}>
          {plugin.status || "Listed"}
        </span>
      </div>

      <p style={{ color: "#555", fontSize: "0.9rem", lineHeight: 1.75, margin: 0 }}>
        {plugin.summary}
      </p>

      {plugin.features?.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: "1rem", color: "#555", fontSize: "0.84rem", lineHeight: 1.7 }}>
          {plugin.features.slice(0, 4).map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      )}

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

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", paddingTop: "0.25rem" }}>
        <div style={{ color: "#a8abcc", fontSize: "0.76rem", fontWeight: 650 }}>
          {plugin.dealer}
        </div>
        {hasRoute && (
          <button
            type="button"
            onClick={() => navigate(plugin.route)}
            style={{
              border: "none",
              borderRadius: 50,
              background: "#2f315a",
              color: "#ffffff",
              padding: "0.55rem 1rem",
              fontSize: "0.78rem",
              fontWeight: 750,
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            {plugin.ctaLabel || "View"}
          </button>
        )}
      </div>
    </article>
  );
}

function PluginSection({ section, items }) {
  return (
    <section id={section.key} style={{ padding: "2.75rem 0", borderTop: "1px solid rgba(47,49,90,0.08)" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1.2rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        <div>
          <div style={{ fontSize: "0.68rem", fontWeight: 750, letterSpacing: "0.11em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.45rem" }}>
            {section.label}
          </div>
          <h2 style={{ fontSize: "clamp(1.35rem, 2.6vw, 2rem)", color: "#2f315a", lineHeight: 1.2, fontWeight: 760 }}>
            {section.heading}
          </h2>
          <p style={{ maxWidth: 760, color: "#6b6f91", lineHeight: 1.75, fontSize: "0.94rem", marginTop: "0.55rem" }}>
            {section.body}
          </p>
        </div>
        <div style={{
          borderRadius: 50,
          background: "rgba(47,49,90,0.07)",
          color: "#2f315a",
          padding: "0.45rem 0.85rem",
          fontSize: "0.76rem",
          fontWeight: 750,
        }}>
          {items.length} plugin{items.length === 1 ? "" : "s"}
        </div>
      </div>

      {items.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "1rem" }}>
          {items.map((plugin) => <PluginCard key={`${section.key}-${plugin.name}`} plugin={plugin} />)}
        </div>
      ) : (
        <div style={{
          border: "1px dashed rgba(47,49,90,0.18)",
          borderRadius: 12,
          background: "rgba(255,255,255,0.72)",
          padding: "1.5rem",
          color: "#6b6f91",
          fontSize: "0.9rem",
        }}>
          {section.empty}
        </div>
      )}
    </section>
  );
}

export default function AutoCountPluginsPage() {
  const [search, setSearch] = useState("");
  const query = normalize(search);
  const sections = pluginContent.sections || [];
  const totalPlugins = sections.reduce((sum, section) => sum + (section.items?.length || 0), 0);

  const filteredSections = useMemo(() => sections.map((section) => {
    const items = (section.items || []).filter((plugin) => {
      if (!query) return true;
      const haystack = [
        plugin.name,
        plugin.tag,
        plugin.dealer,
        plugin.status,
        plugin.summary,
        ...(plugin.features || []),
        ...(plugin.modules || []),
      ].map(normalize).join(" ");
      return haystack.includes(query);
    });
    return { ...section, filteredItems: items };
  }), [query, sections]);

  return (
    <div style={{ background: "#f5f5f8", minHeight: "100vh" }}>
      <ProductHero
        eyebrow={pluginContent.hero?.eyebrow}
        title={pluginContent.hero?.title}
        body={pluginContent.hero?.body}
        iconSrc={acPluginIcon}
        iconAlt="AutoCount Plugin"
        primaryCta={{ label: pluginContent.hero?.primaryLabel || "Browse Plugins", href: "#plugin-library" }}
        secondaryCta={{ label: pluginContent.hero?.secondaryLabel || "WhatsApp Support", href: SUPPORT_WA_LINK, target: "_blank" }}
      />

      <main id="plugin-library" style={{ padding: "4rem 0" }}>
        <div className="content-wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "1.5rem", alignItems: "end", marginBottom: "2rem" }}>
            <div>
              <div style={{ fontSize: "0.7rem", fontWeight: 750, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.5rem" }}>
                {pluginContent.intro?.eyebrow}
              </div>
              <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.35rem)", color: "#2f315a", lineHeight: 1.15, fontWeight: 760 }}>
                {pluginContent.intro?.heading}
              </h2>
              <p style={{ color: "#6b6f91", lineHeight: 1.78, fontSize: "0.98rem", marginTop: "0.75rem", maxWidth: 800 }}>
                {pluginContent.intro?.body}
              </p>
            </div>

            <div style={{
              background: "#ffffff",
              border: "1px solid rgba(47,49,90,0.1)",
              borderRadius: 12,
              padding: "0.75rem",
              boxShadow: "0 10px 30px rgba(47,49,90,0.05)",
            }}>
              <label htmlFor="plugin-search" style={{ display: "block", color: "#6b6f91", fontSize: "0.68rem", fontWeight: 750, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.45rem" }}>
                Search {totalPlugins} plugin{totalPlugins === 1 ? "" : "s"}
              </label>
              <input
                id="plugin-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search plugin, module, dealer..."
                style={{
                  width: "100%",
                  height: 42,
                  border: "1px solid rgba(47,49,90,0.14)",
                  borderRadius: 10,
                  padding: "0 0.85rem",
                  color: "#2f315a",
                  fontSize: "0.9rem",
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {filteredSections.map((section) => (
            <PluginSection key={section.key} section={section} items={section.filteredItems} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
