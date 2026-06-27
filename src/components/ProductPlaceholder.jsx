export default function ProductPlaceholder({ title }) {
  return (
    <div style={{
      padding: "8rem 2rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      background: "var(--white)",
      minHeight: "40vh",
    }}>
      <h2 style={{
        fontSize: "2rem",
        fontWeight: 600,
        color: "var(--brand)",
        marginBottom: "1rem"
      }}>
        More content for {title} will be added soon!
      </h2>
      <p style={{
        fontSize: "1rem",
        color: "var(--text-light)"
      }}>
        Stay tuned for upcoming updates.
      </p>
    </div>
  );
}
