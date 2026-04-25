"use client";

import { useState } from "react";
import { useAudience } from "@/context/AudienceContext";
import ScrollReveal from "@/components/ui/ScrollReveal";

const MOCK_PROFILES = [
  { initial: "K", name: "xDev_Kira", role: "Scripter · UI/UX · Systems", rate: "$42/hr", match: "94%" },
  { initial: "T", name: "TerraBuilder", role: "Builder · Terrain · GFX", rate: "$28/hr", match: "87%" },
  { initial: "L", name: "luamancer", role: "Full-stack · Systems", rate: "$60/hr", match: "81%" },
  { initial: "P", name: "PixelDrift", role: "Animator · GFX · UI", rate: "$35/hr", match: "76%" }
];

const STEPS = {
  developer: [
    {
      num: "01",
      title: "'weld.' your profile.",
      body: "Input your role, rates, availability, and link your Roblox account. Your shipped games and visit counts pull in automatically."
    },
    {
      num: "02",
      title: "Spark with clients you want.",
      body: "Instead of chasing every potential job, studios come to you. You get notified when a studio sparks with you — not the other way around."
    },
    {
      num: "03",
      title: "Swipe. Spark. Ship.",
      body: "Swipe until you match, a spark forms, and you move from profile to project — without a single cold DM."
    }
  ],
  studio: [
    {
      num: "01",
      title: "'weld.' your studio.",
      body: "Input the roles you need, your budget, and what you're building. We'll rank developers by fit — not who posted last."
    },
    {
      num: "02",
      title: "Swipe verified devs.",
      body: "Browse a curated feed of verified Roblox developers. See rates, shipped games, and availability before you spark."
    },
    {
      num: "03",
      title: "Spark and ship.",
      body: "When you find a fit, spark to open a conversation. No cold outreach, no wasted hours — just developers who are ready to build."
    }
  ]
};

const DEV_SUB = "Build once, get found forever. Your profile does the work so you can focus on shipping.";
const STUDIO_SUB = "Stop hunting in Discord. Verified developers, filtered by your needs, waiting to spark.";

export default function HowSection() {
  const { audience } = useAudience();
  const [currentCard, setCurrentCard] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const steps = STEPS[audience];
  const profile = MOCK_PROFILES[currentCard % MOCK_PROFILES.length]!;

  function handlePass() {
    setCurrentCard((c) => (c + 1) % MOCK_PROFILES.length);
    setActiveStep((s) => Math.min(s + 1, 2));
  }

  function handleSpark() {
    setCurrentCard((c) => (c + 1) % MOCK_PROFILES.length);
    setActiveStep(2);
  }

  return (
    <section
      id="how"
      style={{ background: "#080706", padding: "112px 44px" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <ScrollReveal style={{ marginBottom: 72 }}>
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
            How to weld.
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(34px, 5vw, 60px)",
              fontWeight: 400,
              color: "#FFF7F1",
              letterSpacing: "-.04em",
              lineHeight: 1.0,
              maxWidth: 560,
              marginBottom: 16
            }}
          >
            Less searching. <em>More swiping.</em>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              lineHeight: 1.75,
              color: "rgba(255,247,241,.50)",
              maxWidth: 440
            }}
          >
            {audience === "developer" ? DEV_SUB : STUDIO_SUB}
          </p>
        </ScrollReveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 72,
            alignItems: "center"
          }}
        >
          {/* Left: interactive demo card */}
          <ScrollReveal>
            <div style={{ position: "relative", maxWidth: 340, margin: "0 auto" }}>
              {/* Stacked background cards */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  top: 16,
                  left: 12,
                  background: "rgba(255,247,241,.03)",
                  border: "1px solid rgba(255,247,241,.06)",
                  borderRadius: 20,
                  transform: "rotate(3.5deg)"
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  top: 8,
                  left: 6,
                  background: "rgba(255,247,241,.04)",
                  border: "1px solid rgba(255,247,241,.07)",
                  borderRadius: 20,
                  transform: "rotate(1.8deg)"
                }}
              />

              {/* Main card */}
              <div
                style={{
                  background: "#111009",
                  border: "1px solid rgba(255,247,241,.10)",
                  borderRadius: 20,
                  padding: "28px 24px",
                  position: "relative",
                  zIndex: 2,
                  boxShadow: "0 24px 60px rgba(0,0,0,.55)"
                }}
              >
                {/* Match badge */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: 16
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: ".12em",
                      textTransform: "uppercase",
                      color: "#06D6A0",
                      background: "rgba(6,214,160,.10)",
                      border: "1px solid rgba(6,214,160,.20)",
                      borderRadius: 6,
                      padding: "3px 8px"
                    }}
                  >
                    {profile.match} match
                  </span>
                </div>

                {/* Avatar */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #EA5A35, #FFBE74)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-display)",
                      fontStyle: "italic",
                      fontSize: 24,
                      color: "#FFF7F1",
                      flexShrink: 0
                    }}
                  >
                    {profile.initial}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#FFF7F1",
                        marginBottom: 3
                      }}
                    >
                      {profile.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: "rgba(255,247,241,.40)",
                        letterSpacing: ".04em"
                      }}
                    >
                      {profile.role}
                    </div>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#EA5A35"
                      }}
                    >
                      {profile.rate}
                    </div>
                  </div>
                </div>

                {/* Roblox verified badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 12px",
                    background: "rgba(255,247,241,.04)",
                    border: "1px solid rgba(255,247,241,.07)",
                    borderRadius: 8,
                    marginBottom: 20
                  }}
                >
                  <span style={{ fontSize: 12 }}>🎮</span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "rgba(255,247,241,.50)",
                      letterSpacing: ".04em"
                    }}
                  >
                    Roblox verified · 4.8M visits · Available now
                  </span>
                </div>

                {/* Pass / Spark buttons */}
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={handlePass}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "rgba(255,247,241,.05)",
                      border: "1px solid rgba(255,247,241,.10)",
                      borderRadius: 12,
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: ".10em",
                      textTransform: "uppercase",
                      color: "rgba(255,247,241,.42)",
                      cursor: "pointer",
                      transition: "background .2s, color .2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,247,241,.09)";
                      e.currentTarget.style.color = "rgba(255,247,241,.70)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,247,241,.05)";
                      e.currentTarget.style.color = "rgba(255,247,241,.42)";
                    }}
                  >
                    Pass
                  </button>
                  <button
                    onClick={handleSpark}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "#EA5A35",
                      border: "none",
                      borderRadius: 12,
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: ".10em",
                      textTransform: "uppercase",
                      color: "#FFF7F1",
                      cursor: "pointer",
                      boxShadow: "0 4px 16px rgba(234,90,53,.40)",
                      transition: "background .2s, box-shadow .2s, transform .2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#FF7A4D";
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(234,90,53,.55)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#EA5A35";
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(234,90,53,.40)";
                    }}
                  >
                    Spark ⚡
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: numbered steps */}
          <ScrollReveal delay={100}>
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {steps.map((step, i) => {
                const isActive = i === activeStep;
                return (
                  <button
                    key={step.num}
                    onClick={() => setActiveStep(i)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 20,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      padding: 0,
                      opacity: isActive ? 1 : 0.45,
                      transition: "opacity .3s"
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: isActive ? "#EA5A35" : "rgba(255,247,241,.05)",
                        border: isActive ? "none" : "1px solid rgba(255,247,241,.10)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: isActive ? "0 6px 20px rgba(234,90,53,.40)" : "none",
                        transition: "background .3s, box-shadow .3s"
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: ".10em",
                          color: isActive ? "#FFF7F1" : "rgba(255,247,241,.40)"
                        }}
                      >
                        {step.num}
                      </span>
                    </div>
                    <div>
                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontStyle: "italic",
                          fontSize: "clamp(20px, 2vw, 24px)",
                          fontWeight: 400,
                          color: "#FFF7F1",
                          letterSpacing: "-.02em",
                          lineHeight: 1.15,
                          marginBottom: 8
                        }}
                      >
                        {step.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 14,
                          lineHeight: 1.72,
                          color: "rgba(255,247,241,.55)"
                        }}
                      >
                        {step.body}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
