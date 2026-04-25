"use client";

import { useAudience } from "@/context/AudienceContext";
import WaitlistForm from "@/components/ui/WaitlistForm";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function CTASection() {
  const { audience } = useAudience();

  const headline = audience === "developer"
    ? <>Get hired, without the noise. <em>Start here.</em></>
    : <>Hire, without the noise. <em>Start here.</em></>;

  return (
    <section
      style={{
        background: "#090807",
        padding: "120px 44px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Atmospheric glows */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          top: -280,
          left: "50%",
          transform: "translateX(-50%)",
          background: "radial-gradient(circle, rgba(234,90,53,.15) 0%, transparent 60%)",
          pointerEvents: "none"
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          bottom: -180,
          right: -120,
          background: "radial-gradient(circle, rgba(255,190,116,.08) 0%, transparent 65%)",
          pointerEvents: "none"
        }}
      />

      <div
        style={{
          maxWidth: 680,
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
          zIndex: 2
        }}
      >
        <ScrollReveal>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "#EA5A35",
              display: "block",
              marginBottom: 16
            }}
          >
            Join the waitlist
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(38px, 5.5vw, 68px)",
              fontWeight: 400,
              color: "#FFF7F1",
              letterSpacing: "-.045em",
              lineHeight: 1.0,
              marginBottom: 20
            }}
          >
            {headline}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 16,
              lineHeight: 1.75,
              color: "rgba(255,247,241,.52)",
              marginBottom: 40,
              maxWidth: 500,
              margin: "0 auto 40px"
            }}
          >
            Sign up for the waitlist early and get benefits when we go live, to improve your sparks.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            <WaitlistForm source="cta" variant="cta" />
          </div>
          <p
            style={{
              marginTop: 16,
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: ".12em",
              color: "rgba(255,247,241,.25)",
              textTransform: "uppercase"
            }}
          >
            Free for developers · No spam · Early access soon
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
