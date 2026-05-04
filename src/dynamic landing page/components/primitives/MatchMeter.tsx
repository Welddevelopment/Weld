import type { CSSProperties } from "react";

interface MatchMeterProps {
  value: number;
  label?: string;
  variant?: "horizontal" | "vertical";
  className?: string;
  style?: CSSProperties;
}

export function MatchMeter({
  value,
  label = "match preview",
  variant = "horizontal",
  className,
  style
}: MatchMeterProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const ariaLabel = `${clamped} percent ${label}`;

  if (variant === "vertical") {
    return (
      <div
        className={`match-meter match-meter--vertical ${className ?? ""}`}
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        aria-label={ariaLabel}
        style={style}
      >
        <span className="match-meter__track">
          <span
            className="match-meter__fill"
            style={{ height: `${clamped}%` }}
            aria-hidden="true"
          />
        </span>
        <span className="match-meter__value">{clamped}%</span>
        <span className="match-meter__label">{label}</span>
      </div>
    );
  }

  return (
    <div
      className={`match-meter match-meter--horizontal ${className ?? ""}`}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      aria-label={ariaLabel}
      style={style}
    >
      <span className="match-meter__head">
        <strong>{clamped}%</strong>
        <em>{label}</em>
      </span>
      <span className="match-meter__track">
        <span
          className="match-meter__fill"
          style={{ width: `${clamped}%` }}
          aria-hidden="true"
        />
      </span>
    </div>
  );
}
