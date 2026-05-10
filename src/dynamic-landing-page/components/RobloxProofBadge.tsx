"use client";

import { useEffect, useState } from "react";
import type { VerificationState } from "@/dynamic-landing-page/lib/WeldPageState";

interface RobloxProofBadgeProps {
  verificationState: VerificationState;
  method?: string;
  onReveal?: () => void;
}

/**
 * Stage 5 — RobloxProofBadge
 *
 * Brand-safe proof badge. Never says "Roblox Verified" or implies official
 * Roblox endorsement. Uses original SVG icon (checkmark-in-circle in the
 * state-verified token colour #4ec9b0).
 *
 * State-driven:
 *   unverified → opacity-0, pointer-events-none
 *   checking   → pulsing opacity (proof-badge--checking)
 *   verified   → full opacity with compile-spring-in entrance
 *
 * Tooltip is accessible via focus, hover, and touch. The onReveal callback
 * fires once when transitioning to "verified" so callers can append an
 * Output log line.
 */
export function RobloxProofBadge({
  verificationState,
  method = "Roblox OAuth",
  onReveal,
}: RobloxProofBadgeProps) {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (verificationState === "verified" && !revealed) {
      setRevealed(true);
      onReveal?.();
    }
  }, [verificationState, revealed, onReveal]);

  const badgeClass = [
    "proof-badge",
    verificationState === "unverified" && "proof-badge--hidden",
    verificationState === "checking" && "proof-badge--checking",
    verificationState === "verified" && "proof-badge--verified",
  ]
    .filter(Boolean)
    .join(" ");

  const showTooltip = () => setTooltipVisible(true);
  const hideTooltip = () => setTooltipVisible(false);

  return (
    <div className="proof-badge-wrapper">
      <button
        type="button"
        className={badgeClass}
        aria-describedby="proof-badge-tip"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        onTouchStart={showTooltip}
        onTouchEnd={hideTooltip}
        tabIndex={verificationState === "unverified" ? -1 : 0}
      >
        {/* Original SVG checkmark — not a copy of Roblox's verified mark */}
        <svg
          className="proof-badge__icon"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="7"
            cy="7"
            r="6"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M4.5 7L6.5 9L9.5 5.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Proof verified</span>
      </button>

      {/* Tooltip — rendered outside button flow but associated via aria */}
      <div
        id="proof-badge-tip"
        role="tooltip"
        className={`proof-badge-tooltip ${tooltipVisible ? "proof-badge-tooltip--visible" : ""}`}
      >
        Proof checked via {method}. Visits and game data confirmed where available.
      </div>
    </div>
  );
}
