"use client";

import { useAudience } from "@/context/AudienceContext";
import ScrollReveal from "@/components/ui/ScrollReveal";

const DEV_POINTS = [
  "Verified Roblox profile linked to your shipped games",
  "Set your rate and availability — studios see it before reaching out",
  "Swipe-based matching: get found by studios that actually fit",
  "No more cold pitching in Discord servers or threads"
];

const STUDIO_POINTS = [
  "Browse pre-verified developers filtered by role, rate, and availability",
  "See portfolio proof — shipped games and visit counts — before you spark",
  "Spark with a developer to open a direct conversation",
  "Build your shortlist without posting job ads or waiting in forums"
];

export default function ForSection() {
  const { audience } = useAudience();

  const headline = audience === "developer"
    ? <>Built for people who develop. <em>Passionately.</em></>
    : <>Built for studios that ship. <em>Relentlessly.</em></>;

  return (
    <section
      id="for"
      style={{ background: "#090807", padding: "112px 44px" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
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
            Who it&rsquo;s for
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
              maxWidth: 600
            }}
          >
            {headline}
          </h2>
        </ScrollReveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20
          }}
        >
          {/* Developer card */}
          <ScrollReveal>
            <div
              style={{
                background: "#111009",
                border: "1px solid rgba(234,90,53,.14)",
                borderRadius: 24,
                padding: "48px 44px",
                position: "relative",
                overflow: "hidden",
                height: "100%"
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  width: 380,
                  height: 380,
                  borderRadius: "50%",
                  top: -160,
                  right: -130,
                  background: "radial-gradient(circle, rgba(234,90,53,.10) 0%, transparent 65%)",
                  pointerEvents: "none"
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "#EA5A35",
                  display: "block",
                  marginBottom: 12
                }}
              >
                For Developers &amp; Creators
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "clamp(24px, 2.8vw, 34px)",
                  fontWeight: 400,
                  color: "#FFF7F1",
                  letterSpacing: "-.025em",
                  lineHeight: 1.05,
                  marginBottom: 8
                }}
              >
                Display your skills for the better.
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  lineHeight: 1.72,
                  color: "rgba(255,247,241,.46)",
                  marginBottom: 28
                }}
              >
                Stop chasing. Get found by studios that match your rate, role, and vibe.
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {DEV_POINTS.map((pt) => (
                  <li key={pt} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "rgba(234,90,53,.12)",
                        border: "1px solid rgba(234,90,53,.22)",
                        color: "#EA5A35",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: 1
                      }}
                    >
                      ✓
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: "rgba(255,247,241,.65)"
                      }}
                    >
                      {pt}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Studio card — with stacked depth effect */}
          <ScrollReveal delay={100}>
            <div style={{ position: "relative" }}>
              {/* Depth layers */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  top: 14,
                  left: 12,
                  background: "#0D0A09",
                  border: "1px solid rgba(255,247,241,.04)",
                  borderRadius: 24
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  top: 7,
                  left: 6,
                  background: "#0F0C0B",
                  border: "1px solid rgba(255,247,241,.05)",
                  borderRadius: 24
                }}
              />
              <div
                style={{
                  background: "#161210",
                  border: "1px solid rgba(255,247,241,.08)",
                  borderRadius: 24,
                  padding: "48px 44px",
                  position: "relative",
                  zIndex: 2,
                  overflow: "hidden"
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    width: 350,
                    height: 350,
                    borderRadius: "50%",
                    bottom: -120,
                    left: -80,
                    background: "radial-gradient(circle, rgba(255,190,116,.06) 0%, transparent 65%)",
                    pointerEvents: "none"
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: "rgba(255,247,241,.45)",
                    display: "block",
                    marginBottom: 12
                  }}
                >
                  For Studios &amp; Teams
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: "clamp(24px, 2.8vw, 34px)",
                    fontWeight: 400,
                    color: "#FFF7F1",
                    letterSpacing: "-.025em",
                    lineHeight: 1.05,
                    marginBottom: 8
                  }}
                >
                  Hire with proof and less chasing.
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    lineHeight: 1.72,
                    color: "rgba(255,247,241,.40)",
                    marginBottom: 28
                  }}
                >
                  Verified developers, filtered for your project — no job posts, no ghost applications.
                </p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                  {STUDIO_POINTS.map((pt) => (
                    <li key={pt} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <span
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "rgba(255,247,241,.06)",
                          border: "1px solid rgba(255,247,241,.10)",
                          color: "rgba(255,247,241,.55)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 700,
                          flexShrink: 0,
                          marginTop: 1
                        }}
                      >
                        ✓
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 14,
                          lineHeight: 1.6,
                          color: "rgba(255,247,241,.55)"
                        }}
                      >
                        {pt}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
