export function SegmentedControl({
  options,
  value,
  onChange,
  ariaLabel,
  className = "",
  style,
}) {
  return (
    <div className={`ks-tab-list${className ? ` ${className}` : ""}`} style={style} role="tablist" aria-label={ariaLabel}>
      {(options || []).map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange?.(option.value)}
          className={`ks-tab-button${value === option.value ? " is-active" : ""}`}
          role="tab"
          aria-selected={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="ks-control-label">
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="ks-field"
      >
        {(options || []).map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}
