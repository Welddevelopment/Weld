"use client";

import { useAudience } from "@/context/AudienceContext";
import { useWaitlistForm } from "@/hooks/useWaitlistForm";
import type { Audience } from "@/lib/audience";

interface WaitlistFormProps {
  source: string;
  variant?: "hero" | "cta" | "studio";
  className?: string;
  overrideAudience?: Audience;
}

export default function WaitlistForm({
  source,
  variant = "hero",
  className = "",
  overrideAudience
}: WaitlistFormProps) {
  const { content } = useAudience();
  const { email, setEmail, feedback, feedbackState, isSubmitting, handleSubmit } =
    useWaitlistForm(overrideAudience);

  const placeholder =
    overrideAudience === "studio" ? "studio@email.com" : content.heroPlaceholder;
  const buttonLabel =
    overrideAudience === "studio"
      ? "Weld with your devs"
      : variant === "cta"
        ? content.ctaButton
        : content.heroButton;

  const isHero = variant === "hero";
  const isCta = variant === "cta";
  const isStudio = variant === "studio";

  return (
    <div className={className}>
      <form
        onSubmit={(e) => { e.preventDefault(); void handleSubmit(source); }}
        noValidate
        style={{ display: "flex", gap: 10, width: "100%" }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          autoComplete="email"
          required
          disabled={isSubmitting}
          aria-label={
            overrideAudience === "studio" || (!overrideAudience && isStudio)
              ? "Studio email address for beta access"
              : "Developer email address"
          }
          style={{
            flex: 1,
            minWidth: 0,
            background: isHero
              ? "rgba(250,212,200,.10)"
              : isCta
                ? "rgba(250,212,200,.10)"
                : "rgba(255,255,255,.06)",
            border: `1.5px solid ${isHero || isCta ? "rgba(250,212,200,.22)" : "rgba(255,255,255,.10)"}`,
            borderRadius: 14,
            padding: "15px 20px",
            fontFamily: "var(--font-body)",
            fontSize: 15,
            color: isHero || isCta ? "#FAD4C8" : "#FFF5F0",
            outline: "none",
            transition: "border-color .25s, background .25s, box-shadow .25s"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = isHero || isCta
              ? "rgba(250,212,200,.50)"
              : "rgba(224,58,30,.50)";
            e.target.style.boxShadow = "0 0 0 3px rgba(250,212,200,.08)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = isHero || isCta
              ? "rgba(250,212,200,.22)"
              : "rgba(255,255,255,.10)";
            e.target.style.boxShadow = "none";
          }}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            background: isHero || isCta ? "#FAD4C8" : "linear-gradient(135deg,#E03A1E,#C42910)",
            color: isHero || isCta ? "#7A1C07" : "#FFF5F0",
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: ".07em",
            textTransform: "uppercase",
            padding: "15px 28px",
            borderRadius: 14,
            border: "none",
            cursor: isSubmitting ? "default" : "pointer",
            whiteSpace: "nowrap",
            opacity: isSubmitting ? 0.72 : 1,
            boxShadow: isHero || isCta
              ? "0 4px 16px rgba(26,10,4,.22)"
              : "0 4px 16px rgba(224,58,30,.30)",
            transition: "transform .2s, box-shadow .2s, opacity .2s",
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = isHero || isCta
                ? "0 8px 24px rgba(26,10,4,.28)"
                : "0 8px 24px rgba(224,58,30,.40)";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "none";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = isHero || isCta
              ? "0 4px 16px rgba(26,10,4,.22)"
              : "0 4px 16px rgba(224,58,30,.30)";
          }}
        >
          {isSubmitting ? "Saving…" : buttonLabel}
        </button>
      </form>

      {feedback && (
        <p
          role="status"
          aria-live="polite"
          style={{
            marginTop: 10,
            fontSize: 13,
            fontFamily: "var(--font-body)",
            color: feedbackState === "success"
              ? "rgba(250,212,200,.9)"
              : feedbackState === "error"
                ? "#FAD4C8"
                : "rgba(250,212,200,.72)",
            fontWeight: feedbackState ? 500 : 400
          }}
        >
          {feedback}
        </p>
      )}
    </div>
  );
}
