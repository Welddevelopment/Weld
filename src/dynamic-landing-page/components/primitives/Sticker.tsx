import type { CSSProperties, ReactNode } from "react";

export type StickerTone =
  | "proof"
  | "available"
  | "spark"
  | "like"
  | "info"
  | "warning"
  | "founding"
  | "yellow";

interface StickerProps {
  tone?: StickerTone;
  icon?: ReactNode;
  label: ReactNode;
  sublabel?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const TONE_CLASS: Record<StickerTone, string> = {
  proof: "sticker--proof",
  available: "sticker--available",
  spark: "sticker--spark",
  like: "sticker--like",
  info: "sticker--info",
  warning: "sticker--warning",
  founding: "sticker--founding",
  yellow: "sticker--yellow"
};

export function Sticker({
  tone = "proof",
  icon,
  label,
  sublabel,
  className,
  style
}: StickerProps) {
  return (
    <span className={`sticker ${TONE_CLASS[tone]} ${className ?? ""}`} style={style}>
      {icon ? <span className="sticker__icon" aria-hidden="true">{icon}</span> : null}
      <span className="sticker__body">
        <strong>{label}</strong>
        {sublabel ? <em>{sublabel}</em> : null}
      </span>
    </span>
  );
}
