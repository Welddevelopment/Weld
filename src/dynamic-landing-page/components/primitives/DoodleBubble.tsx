import type { CSSProperties } from "react";

type BubbleSize = "sm" | "md" | "lg" | "xl";
type BubbleTone = "lavender" | "violet" | "pink" | "white";

interface DoodleBubbleProps {
  size?: BubbleSize;
  tone?: BubbleTone;
  className?: string;
  style?: CSSProperties;
}

const SIZE_PX: Record<BubbleSize, number> = {
  sm: 80,
  md: 140,
  lg: 220,
  xl: 320
};

const TONE_GRADIENTS: Record<BubbleTone, { highlight: string; core: string; shadow: string }> = {
  lavender: {
    highlight: "rgba(255, 255, 255, 0.92)",
    core: "rgba(180, 160, 250, 0.55)",
    shadow: "rgba(120, 90, 220, 0.20)"
  },
  violet: {
    highlight: "rgba(255, 255, 255, 0.85)",
    core: "rgba(140, 110, 240, 0.62)",
    shadow: "rgba(80, 50, 200, 0.28)"
  },
  pink: {
    highlight: "rgba(255, 255, 255, 0.92)",
    core: "rgba(255, 180, 220, 0.55)",
    shadow: "rgba(220, 110, 170, 0.22)"
  },
  white: {
    highlight: "rgba(255, 255, 255, 0.98)",
    core: "rgba(255, 255, 255, 0.65)",
    shadow: "rgba(150, 140, 200, 0.18)"
  }
};

export function DoodleBubble({
  size = "md",
  tone = "lavender",
  className,
  style
}: DoodleBubbleProps) {
  const px = SIZE_PX[size];
  const colors = TONE_GRADIENTS[tone];

  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        width: px,
        height: px,
        borderRadius: "50%",
        background: `
          radial-gradient(circle at 30% 28%, ${colors.highlight} 0%, transparent 38%),
          radial-gradient(circle at 50% 50%, ${colors.core} 0%, transparent 65%),
          radial-gradient(circle at 70% 78%, ${colors.shadow} 0%, transparent 70%)
        `,
        filter: "blur(0.4px)",
        pointerEvents: "none",
        ...style
      }}
    />
  );
}
