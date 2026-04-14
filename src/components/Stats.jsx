const STATS = [
  { num: "500+", label: "Businesses Served" },
  { num: "8",    label: "Years in Pahang" },
  { num: "6",    label: "Service Pillars" },
  { num: "100%", label: "Authorized Dealer" },
];

export default function Stats() {
  return (
    <div
      className="stats-grid"
      style={{
        background: "#ffffff",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        borderBottom: "0.5px solid rgba(47,49,90,0.1)",
      }}
    >
      {STATS.map((s, i) => (
        <div
          key={i}
          style={{
            textAlign: "center",
            padding: "2.5rem 1rem",
            borderRight: i < STATS.length - 1
              ? "0.5px solid rgba(47,49,90,0.1)"
              : "none",
          }}
        >
          <div style={{ fontSize: "2.2rem", fontWeight: 700, color: "#2f315a", lineHeight: 1 }}>
            {s.num}
          </div>
          <div style={{
            fontSize: "0.7rem", fontWeight: 600, color: "#6b6f91",
            textTransform: "uppercase", letterSpacing: "0.09em", marginTop: "0.5rem",
          }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
