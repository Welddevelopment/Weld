"use client";

import { useAudience } from "@/context/AudienceContext";
import WaitlistForm from "@/components/ui/WaitlistForm";
import ScrollReveal from "@/components/ui/ScrollReveal";

const HERO_POINTS = [
  "Authenticated profiles, secure sparking",
  "Rates and availability displayed",
  "Digestible intros, made for swiping"
];

const MOCK_SKILLS = ["Scripter", "UI/UX", "Systems", "Animator"];
const MOCK_STATS = [
  { label: "Visits", value: "4.8M" },
  { label: "Rating", value: "4.7 ★" },
  { label: "Match", value: "94%" }
];

export default function HeroSection() {
  const { audience, content } = useAudience();

  return (
    <header
      id="top"
      style={{
        background: "#090807",
        padding: "128px 44px 96px",
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center"
      }}
    >
      {/* Atmospheric glows */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 760,
          height: 760,
          borderRadius: "50%",
          top: -240,
          left: -280,
          background: "radial-gradient(circle, rgba(234,90,53,.18) 0%, transparent 65%)",
          pointerEvents: "none",
          animation: "orb-drift-a 18s ease-in-out infinite"
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 580,
          height: 580,
          borderRadius: "50%",
          bottom: -200,
          right: -160,
          background: "radial-gradient(circle, rgba(255,190,116,.10) 0%, transparent 65%)",
          pointerEvents: "none",
          animation: "orb-drift-b 22s ease-in-out infinite"
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 420px",
          gap: 72,
          alignItems: "center",
          position: "relative",
          zIndex: 2
        }}
      >
        {/* Left column */}
        <div>
          <ScrollReveal>
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(234,90,53,.10)",
                border: "1px solid rgba(234,90,53,.22)",
                borderRadius: 100,
                padding: "6px 14px",
                marginBottom: 28
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#EA5A35",
                  display: "inline-block",
                  animation: "dot-pulse 2s ease-in-out infinite",
                  flexShrink: 0
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "#EA5A35"
                }}
              >
                Verified Roblox talent matching
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(52px, 7.5vw, 100px)",
                fontWeight: 400,
                color: "#FFF7F1",
                letterSpacing: "-.055em",
                lineHeight: 0.94,
                marginBottom: 28
              }}
            >
              {content.heroLine1}
              <br />
              <span style={{ color: "rgba(255,247,241,.45)" }}>{content.heroLine2}</span>
            </h1>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 16,
                lineHeight: 1.78,
                color: "rgba(255,247,241,.65)",
                maxWidth: 480,
                marginBottom: 36
              }}
            >
              {content.heroSub}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div id="waitlist" style={{ maxWidth: 480 }}>
              <WaitlistForm source="hero" variant="hero" />
            </div>

            <p
              style={{
                marginTop: 16,
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: ".12em",
                color: "rgba(255,247,241,.30)",
                textTransform: "uppercase"
              }}
            >
              Swipe. Spark. Ship. Free. · Kickstart the movement
            </p>
          </ScrollReveal>

          {/* 3 hero points */}
          <ScrollReveal delay={200}>
            <div
              style={{
                marginTop: 44,
                display: "flex",
                flexDirection: "column",
                gap: 10
              }}
            >
              {HERO_POINTS.map((pt) => (
                <div
                  key={pt}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "rgba(234,90,53,.14)",
                      border: "1px solid rgba(234,90,53,.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: 9,
                      color: "#EA5A35"
                    }}
                  >
                    ✓
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "rgba(255,247,241,.58)"
                    }}
                  >
                    {pt}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Right column — Live profile preview panel */}
        <ScrollReveal delay={100} style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "100%",
              maxWidth: 380,
              background: "rgba(255,247,241,.03)",
              border: "1px solid rgba(255,247,241,.08)",
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 32px 80px rgba(0,0,0,.55), 0 0 0 1px rgba(255,247,241,.04)"
            }}
          >
            {/* Panel header */}
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid rgba(255,247,241,.06)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,247,241,.02)"
              }}
            >
              <div style={{ display: "flex", gap: 5 }}>
                {["#FF5F57","#FFBD2E","#28CA41"].map((c) => (
                  <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "inline-block" }} />
                ))}
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "rgba(255,247,241,.28)",
                  letterSpacing: ".08em",
                  marginLeft: 4
                }}
              >
                Live profile preview
              </span>
            </div>

            {/* Mock profile card */}
            <div style={{ padding: "28px 24px", animation: "demo-breathe 6s ease-in-out infinite" }}>
              {/* Avatar + name */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #EA5A35, #FFBE74)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: 22,
                    color: "#FFF7F1",
                    flexShrink: 0
                  }}
                >
                  K
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#FFF7F1",
                      marginBottom: 2
                    }}
                  >
                    xDev_Kira
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#06D6A0",
                        display: "inline-block"
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        color: "#06D6A0",
                        letterSpacing: ".06em"
                      }}
                    >
                      Verified · Available now
                    </span>
                  </div>
                </div>
                <div style={{ marginLeft: "auto", textAlign: "right" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#EA5A35"
                    }}
                  >
                    $42/hr
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
                {MOCK_SKILLS.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      color: "rgba(255,247,241,.65)",
                      background: "rgba(255,247,241,.06)",
                      border: "1px solid rgba(255,247,241,.08)",
                      borderRadius: 6,
                      padding: "4px 8px"
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Stats row */}
              <div
                style={{
                  display: "flex",
                  gap: 0,
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid rgba(255,247,241,.06)"
                }}
              >
                {MOCK_STATS.map((stat, i) => (
                  <div
                    key={stat.label}
                    style={{
                      flex: 1,
                      padding: "12px 8px",
                      textAlign: "center",
                      background: "rgba(255,247,241,.03)",
                      borderRight: i < MOCK_STATS.length - 1 ? "1px solid rgba(255,247,241,.06)" : "none"
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#FFF7F1",
                        marginBottom: 2
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 8,
                        color: "rgba(255,247,241,.30)",
                        letterSpacing: ".08em",
                        textTransform: "uppercase"
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button
                  style={{
                    flex: 1,
                    padding: "11px",
                    background: "rgba(255,247,241,.05)",
                    border: "1px solid rgba(255,247,241,.10)",
                    borderRadius: 10,
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".10em",
                    textTransform: "uppercase",
                    color: "rgba(255,247,241,.45)",
                    cursor: "pointer"
                  }}
                >
                  Pass
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: "11px",
                    background: "#EA5A35",
                    border: "none",
                    borderRadius: 10,
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".10em",
                    textTransform: "uppercase",
                    color: "#FFF7F1",
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(234,90,53,.40)"
                  }}
                >
                  Spark ⚡
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </header>
  );
}
