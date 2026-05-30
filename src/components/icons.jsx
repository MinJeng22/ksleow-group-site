export const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export const BackIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

export const MenuIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

export const ToTopIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

export const ScrollDownIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export const MenuGlyph = ({ open, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ overflow: "visible" }}>
    <line x1="3" y1="12" x2="21" y2="12" style={{ transformOrigin: "center", transition: "transform 0.3s ease, opacity 0.3s ease", opacity: open ? 0 : 1, transform: open ? "scaleX(0)" : "scaleX(1)" }} />
    <line x1="3" y1="6" x2="21" y2="6" style={{ transformOrigin: "center", transition: "transform 0.3s ease", transform: open ? "translateY(6px) rotate(45deg)" : "translateY(0) rotate(0)" }} />
    <line x1="3" y1="18" x2="21" y2="18" style={{ transformOrigin: "center", transition: "transform 0.3s ease", transform: open ? "translateY(-6px) rotate(-45deg)" : "translateY(0) rotate(0)" }} />
  </svg>
);
