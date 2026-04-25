"use client";

import { useAudience } from "@/context/AudienceContext";
import ScrollReveal from "@/components/ui/ScrollReveal";

const CARDS = {
  developer: {
    problem: {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11l19-9-9 19-2-8-8-2z" />
        </svg>
      ),
      label: "Developers today",
      title: "You get your skills, buried.",
      body: "Endless posting in hiddendevs, cold DMs into studios that ghost you, and copy-paste applications that go nowhere."
    },
    solution: {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      label: "With weld.",
      title: "Your skills, displayed.",
      body: "Make one profile, link your accounts, and let studios come to you — verified, with rates and shipped work front and centre."
    }
  },
  studio: {
    problem: {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      label: "Studios today",
      title: "You waste time.",
      body: "Sorting through copy-paste DMs, unverified portfolios, and developers who disappear after the first message."
    },
    solution: {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      label: "With weld.",
      title: "Get the signal, not noise.",
      body: "Filter through developers with your preferences — role, rate, availability — and spark only with people who actually fit."
    }
  }
};

export default function ComparisonSection() {
  const { audience } = useAudience();
  const cards = CARDS[audience];

  const headline = audience === "developer"
    ? <>Clients hide on discord. <em>That&apos;s the problem.</em></>
    : <>Developers hide on discord. <em>That&apos;s the problem.</em></>;

  const sub = audience === "developer"
    ? "You're talented, you know that. Although you're missing a better way to find real clients — not just anyone willing to pay."
    : "You're worth working for. But finding developers who can actually ship is buried under noise and copy-paste portfolios.";

  return (
    <section
      id="why"
      style={{
        background: "#0D0A09",
        padding: "112px 44px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          top: -200,
          right: -200,
          background: "radial-gradient(circle, rgba(234,90,53,.06) 0%, transparent 65%)",
          pointerEvents: "none"
        }}
      />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <ScrollReveal style={{ marginBottom: 64 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "#EA5A35",
              display: "block",
              marginBottom: 14
            }}
          >
            Why weld.
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(34px, 4.5vw, 58px)",
              fontWeight: 400,
              color: "#FFF7F1",
              letterSpacing: "-.04em",
              lineHeight: 1.05,
              maxWidth: 620,
              marginBottom: 16
            }}
          >
            {headline}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              lineHeight: 1.75,
              color: "rgba(255,247,241,.52)",
              maxWidth: 500
            }}
          >
            {sub}
          </p>
        </ScrollReveal>

        {/* 2×2 grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16
          }}
        >
          {/* Problem card */}
          <ScrollReveal>
            <div
              style={{
                background: "rgba(255,247,241,.025)",
                border: "1px solid rgba(255,247,241,.07)",
                borderRadius: 20,
                padding: "36px 32px",
                height: "100%"
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(255,247,241,.05)",
                  border: "1px solid rgba(255,247,241,.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,247,241,.40)",
                  marginBottom: 18
                }}
              >
                {cards.problem.icon}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "rgba(255,247,241,.30)",
                  marginBottom: 10
                }}
              >
                {cards.problem.label}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "clamp(20px, 2.2vw, 26px)",
                  fontWeight: 400,
                  color: "rgba(255,247,241,.65)",
                  letterSpacing: "-.02em",
                  lineHeight: 1.1,
                  marginBottom: 12
                }}
              >
                {cards.problem.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  lineHeight: 1.72,
                  color: "rgba(255,247,241,.35)"
                }}
              >
                {cards.problem.body}
              </p>
            </div>
          </ScrollReveal>

          {/* Solution card */}
          <ScrollReveal delay={100}>
            <div
              style={{
                background: "rgba(234,90,53,.07)",
                border: "1px solid rgba(234,90,53,.18)",
                borderRadius: 20,
                padding: "36px 32px",
                height: "100%",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  width: 300,
                  height: 300,
                  borderRadius: "50%",
                  top: -120,
                  right: -80,
                  background: "radial-gradient(circle, rgba(234,90,53,.14) 0%, transparent 65%)",
                  pointerEvents: "none"
                }}
              />
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(234,90,53,.15)",
                  border: "1px solid rgba(234,90,53,.28)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#EA5A35",
                  marginBottom: 18,
                  position: "relative",
                  zIndex: 1
                }}
              >
                {cards.solution.icon}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "rgba(234,90,53,.70)",
                  marginBottom: 10,
                  position: "relative",
                  zIndex: 1
                }}
              >
                {cards.solution.label}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "clamp(20px, 2.2vw, 26px)",
                  fontWeight: 400,
                  color: "#FFF7F1",
                  letterSpacing: "-.02em",
                  lineHeight: 1.1,
                  marginBottom: 12,
                  position: "relative",
                  zIndex: 1
                }}
              >
                {cards.solution.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  lineHeight: 1.72,
                  color: "rgba(255,247,241,.60)",
                  position: "relative",
                  zIndex: 1
                }}
              >
                {cards.solution.body}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
