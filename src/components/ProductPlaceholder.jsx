import { Hammer, Sparkles, Rocket } from "lucide-react";

export default function ProductPlaceholder({ title }) {
  return (
    <div style={{
      padding: "10rem 2rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      background: "linear-gradient(to bottom, var(--white), #f8fafc)",
      minHeight: "50vh",
    }}>
      <div style={{
        background: "rgba(31, 33, 66, 0.04)",
        padding: "1.5rem",
        borderRadius: "50%",
        marginBottom: "2rem",
        display: "inline-flex"
      }}>
        <Hammer size={48} color="var(--brand)" strokeWidth={1.5} />
      </div>
      
      <h2 style={{
        fontSize: "2.5rem",
        fontWeight: 700,
        color: "var(--brand)",
        marginBottom: "1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        justifyContent: "center"
      }}>
        <Sparkles size={32} color="var(--brand-gold)" />
        Coming Soon
        <Sparkles size={32} color="var(--brand-gold)" />
      </h2>
      
      <p style={{
        fontSize: "1.125rem",
        color: "var(--text-light)",
        maxWidth: "600px",
        lineHeight: 1.6,
        margin: "0 auto 2.5rem"
      }}>
        We are crafting something amazing for <strong>{title}</strong>. 
        More detailed content, features, and resources will be added to this page in the near future. 
        Stay tuned!
      </p>

      <div style={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        padding: "1rem 2rem",
        background: "var(--white)",
        borderRadius: "100px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        border: "1px solid rgba(0,0,0,0.05)"
      }}>
        <Rocket size={20} color="var(--brand-gold)" />
        <span style={{ fontWeight: 600, color: "var(--brand)", letterSpacing: "0.5px" }}>
          EXCITING UPDATES AHEAD
        </span>
      </div>
    </div>
  );
}
