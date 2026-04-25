"use client";

import { useAudience } from "@/context/AudienceContext";
import ScrollReveal from "@/components/ui/ScrollReveal";

const DISCORD_MESSAGES = [
  { letter: "D", name: "devhunter99", color: "#5865F2", msg: "anyone know a good scripter for hire??", time: "2:14 PM" },
  { letter: "S", name: "studioboss", color: "#3BA55C", msg: "HIRING: lua dev 20R$/hr DM me ASAP", time: "2:15 PM" },
  { letter: "R", name: "RandomUser42", color: "#ED4245", msg: "i can script lmk — check my server", time: "2:16 PM" }
];

const TABLE_ROWS = {
  developer: [
    { what: "Verification", discord: "None — anyone can claim anything", weld: "Roblox account linked, metrics real" },
    { what: "Rates", discord: "Hidden until after you DM", weld: "Shown before the first spark" },
    { what: "Availability", discord: "Never displayed", weld: "Set once, visible always" },
    { what: "Fit", discord: "You guess from a paragraph", weld: "Matched by role, rate, and style" },
    { what: "First conversation", discord: "Cold DM into the void", weld: "Studio sparks — you respond when ready" }
  ],
  studio: [
    { what: "Verification", discord: "None — portfolios are unverified", weld: "Roblox account linked, ships proven" },
    { what: "Rates", discord: "Negotiated blind after contact", weld: "Visible before you reach out" },
    { what: "Availability", discord: "Ask and wait", weld: "Always current on every profile" },
    { what: "Fit", discord: "Guess from a paragraph bio", weld: "Filtered by role, rate, and team size" },
    { what: "First conversation", discord: "You cold-DM into the void", weld: "You spark — developer responds when ready" }
  ]
};

export default function ProofSection() {
  const { audience } = useAudience();

  const tableRows = TABLE_ROWS[audience];

  const devSub = "Discord has millions of messages and zero structure. weld. has one profile and everything a studio needs to say yes.";
  const studioSub = "Discord has thousands of devs and zero filters. weld. has verified profiles with rates, availability, and shipped proof.";

  return (
    <section
      id="proof"
      style={{ background: "#0D0A09", padding: "112px 44px" }}
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
            Proof
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(30px, 4.5vw, 54px)",
              fontWeight: 400,
              color: "#FFF7F1",
              letterSpacing: "-.04em",
              lineHeight: 1.05,
              maxWidth: 700,
              marginBottom: 16
            }}
          >
            Discord profiles? Threads? Servers? <em style={{ color: "rgba(255,247,241,.45)" }}>Noise.</em> One &lsquo;weld.&rsquo; profile? <em>Context.</em>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              lineHeight: 1.75,
              color: "rgba(255,247,241,.50)",
              maxWidth: 500
            }}
          >
            {audience === "developer" ? devSub : studioSub}
          </p>
        </ScrollReveal>

        {/* Two cards side by side */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 48
          }}
        >
          {/* Discord card */}
          <ScrollReveal>
            <div
              style={{
                background: "#111009",
                border: "1px solid rgba(255,247,241,.07)",
                borderRadius: 20,
                padding: "32px 28px",
                height: "100%"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: "rgba(255,247,241,.28)",
                    background: "rgba(88,101,242,.10)",
                    border: "1px solid rgba(88,101,242,.20)",
                    borderRadius: 6,
                    padding: "3px 8px"
                  }}
                >
                  On discord
                </span>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#ED4245",
                    display: "inline-block"
                  }}
                />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "clamp(18px, 2vw, 22px)",
                  fontWeight: 400,
                  color: "rgba(255,247,241,.55)",
                  letterSpacing: "-.02em",
                  lineHeight: 1.15,
                  marginBottom: 24
                }}
              >
                Urgent. Scattered. A mess of copy-paste bios and ghost applicants.
              </h3>

              {/* Mock discord messages */}
              <div
                style={{
                  background: "#1E1F22",
                  borderRadius: 10,
                  padding: "12px 0",
                  marginBottom: 16
                }}
              >
                {DISCORD_MESSAGES.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "8px 16px"
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: m.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#fff",
                        flexShrink: 0
                      }}
                    >
                      {m.letter}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 2 }}>
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 12,
                            fontWeight: 600,
                            color: m.color
                          }}
                        >
                          {m.name}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 9,
                            color: "rgba(255,255,255,.22)"
                          }}
                        >
                          {m.time}
                        </span>
                      </div>
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 13,
                          color: "rgba(255,255,255,.65)",
                          lineHeight: 1.5
                        }}
                      >
                        {m.msg}
                      </p>
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    padding: "4px 16px 0",
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    color: "rgba(255,255,255,.18)",
                    letterSpacing: ".05em"
                  }}
                >
                  ... 1,397 more messages
                </div>
              </div>

              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "rgba(255,247,241,.22)",
                  letterSpacing: ".10em",
                  textTransform: "uppercase"
                }}
              >
                Good luck finding a fit.
              </p>
            </div>
          </ScrollReveal>

          {/* Weld card */}
          <ScrollReveal delay={100}>
            <div
              style={{
                background: "rgba(234,90,53,.06)",
                border: "1px solid rgba(234,90,53,.18)",
                borderRadius: 20,
                padding: "32px 28px",
                height: "100%",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  width: 320,
                  height: 320,
                  borderRadius: "50%",
                  top: -120,
                  right: -100,
                  background: "radial-gradient(circle, rgba(234,90,53,.12) 0%, transparent 65%)",
                  pointerEvents: "none"
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, position: "relative", zIndex: 1 }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: "rgba(234,90,53,.80)",
                    background: "rgba(234,90,53,.10)",
                    border: "1px solid rgba(234,90,53,.22)",
                    borderRadius: 6,
                    padding: "3px 8px"
                  }}
                >
                  With weld.
                </span>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#06D6A0",
                    display: "inline-block"
                  }}
                />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "clamp(18px, 2vw, 22px)",
                  fontWeight: 400,
                  color: "#FFF7F1",
                  letterSpacing: "-.02em",
                  lineHeight: 1.15,
                  marginBottom: 24,
                  position: "relative",
                  zIndex: 1
                }}
              >
                Calm. Structured. Built before you have to say hello.
              </h3>

              {/* Weld profile mock */}
              <div
                style={{
                  background: "#111009",
                  border: "1px solid rgba(255,247,241,.08)",
                  borderRadius: 14,
                  padding: "20px",
                  marginBottom: 16,
                  position: "relative",
                  zIndex: 1
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #EA5A35, #FFBE74)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-display)",
                      fontStyle: "italic",
                      fontSize: 18,
                      color: "#FFF7F1",
                      flexShrink: 0
                    }}
                  >
                    K
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#FFF7F1"
                        }}
                      >
                        xDev_Kira
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 8,
                          fontWeight: 700,
                          letterSpacing: ".10em",
                          textTransform: "uppercase",
                          color: "#06D6A0",
                          background: "rgba(6,214,160,.10)",
                          border: "1px solid rgba(6,214,160,.18)",
                          borderRadius: 4,
                          padding: "1px 5px"
                        }}
                      >
                        Verified
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        color: "rgba(255,247,241,.38)",
                        letterSpacing: ".04em"
                      }}
                    >
                      Scripter · UI/UX · Systems
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#EA5A35"
                    }}
                  >
                    $42/hr
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: "flex", gap: 12 }}>
                  {[
                    { label: "4.8M visits" },
                    { label: "4.7 ★ rating" },
                    { label: "94% match" }
                  ].map((stat) => (
                    <span
                      key={stat.label}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: ".06em",
                        color: "rgba(255,247,241,.42)",
                        background: "rgba(255,247,241,.04)",
                        border: "1px solid rgba(255,247,241,.07)",
                        borderRadius: 5,
                        padding: "3px 7px"
                      }}
                    >
                      {stat.label}
                    </span>
                  ))}
                </div>
              </div>

              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "rgba(255,247,241,.40)",
                  letterSpacing: ".10em",
                  textTransform: "uppercase",
                  position: "relative",
                  zIndex: 1
                }}
              >
                Everything you need. Before hello.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Comparison table */}
        <ScrollReveal>
          <div
            style={{
              background: "rgba(255,247,241,.025)",
              border: "1px solid rgba(255,247,241,.07)",
              borderRadius: 20,
              overflow: "hidden"
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                borderBottom: "1px solid rgba(255,247,241,.07)"
              }}
            >
              {["What matters", "On Discord", "With weld."].map((h, i) => (
                <div
                  key={h}
                  style={{
                    padding: "16px 24px",
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: i === 2 ? "#EA5A35" : "rgba(255,247,241,.30)",
                    borderRight: i < 2 ? "1px solid rgba(255,247,241,.07)" : "none"
                  }}
                >
                  {h}
                </div>
              ))}
            </div>

            {/* Table rows */}
            {tableRows.map((row, i) => (
              <div
                key={row.what}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  borderBottom: i < tableRows.length - 1 ? "1px solid rgba(255,247,241,.05)" : "none"
                }}
              >
                <div
                  style={{
                    padding: "16px 24px",
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "rgba(255,247,241,.60)",
                    borderRight: "1px solid rgba(255,247,241,.05)"
                  }}
                >
                  {row.what}
                </div>
                <div
                  style={{
                    padding: "16px 24px",
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "rgba(255,247,241,.28)",
                    borderRight: "1px solid rgba(255,247,241,.05)"
                  }}
                >
                  {row.discord}
                </div>
                <div
                  style={{
                    padding: "16px 24px",
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "rgba(255,247,241,.70)"
                  }}
                >
                  {row.weld}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
