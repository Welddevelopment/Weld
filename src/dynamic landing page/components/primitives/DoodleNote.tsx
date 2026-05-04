import type { CSSProperties } from "react";

type NoteVariant = "arrow" | "underline" | "circle" | "spark";
type NoteTone = "violet" | "spark" | "ink";

interface DoodleNoteProps {
  variant?: NoteVariant;
  tone?: NoteTone;
  label?: string;
  rotation?: number;
  className?: string;
  style?: CSSProperties;
}

const TONE_HEX: Record<NoteTone, string> = {
  violet: "#6B5CFF",
  spark: "#FF7A1A",
  ink: "#1F1B3A"
};

export function DoodleNote({
  variant = "arrow",
  tone = "violet",
  label,
  rotation = 0,
  className,
  style
}: DoodleNoteProps) {
  const stroke = TONE_HEX[tone];

  return (
    <span
      aria-hidden="true"
      className={`doodle-note doodle-note--${variant} ${className ?? ""}`}
      style={{
        position: "absolute",
        pointerEvents: "none",
        transform: `rotate(${rotation}deg)`,
        color: stroke,
        ...style
      }}
    >
      {label ? <em className="doodle-note__label">{label}</em> : null}
      {variant === "arrow" ? (
        <svg viewBox="0 0 96 64" fill="none" aria-hidden="true">
          <path
            d="M6 14c14 6 30 14 46 22M50 38l4-12M50 38l12-2"
            stroke={stroke}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
      {variant === "underline" ? (
        <svg viewBox="0 0 120 18" fill="none" aria-hidden="true">
          <path
            d="M4 12c20-8 44-10 70-6 14 2 30 6 42 8"
            stroke={stroke}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      ) : null}
      {variant === "circle" ? (
        <svg viewBox="0 0 120 80" fill="none" aria-hidden="true">
          <path
            d="M60 8c-30 0-50 14-50 32 0 18 22 32 50 32 28 0 50-14 50-32 0-12-12-24-30-30"
            stroke={stroke}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      ) : null}
      {variant === "spark" ? (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <path
            d="M32 6v14M32 44v14M6 32h14M44 32h14M14 14l10 10M40 40l10 10M50 14 40 24M14 50l10-10"
            stroke={stroke}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      ) : null}
    </span>
  );
}
