"use client";

import { useTiltEffect } from "@/hooks/useTiltEffect";

const SKILLS = ["Scripting", "UI/UX", "Systems", "GFX"];
const GAMES = [
  { title: "Neon Frontier", visits: "4.2M", genre: "Open World" },
  { title: "Velocity PvP", visits: "1.8M", genre: "Combat" }
];

export default function ProfileCard() {
  const tilt = useTiltEffect({ maxDeg: 4 });

  return (
    <div
      style={{
        position: "relative",
        width: 280,
        maxWidth: "100%",
        margin: "0 auto",
        zIndex: 2
      }}
    >
      {/* Ghost cards behind */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 22,
          background: "#FAD4C8",
          transform: "translateY(10px) scaleX(0.93) rotate(-2deg)",
          opacity: 0.35,
          zIndex: -1
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 22,
          background: "#FFF5F0",
          transform: "translateY(5px) scaleX(0.97) rotate(-1deg)",
          opacity: 0.55,
          zIndex: -1
        }}
      />

      {/* Main card */}
      <div
        className="profile-card-outer tilt-card"
        {...tilt}
        style={{
          background: "#FFFFFF",
          borderRadius: 22,
          overflow: "hidden",
          boxShadow: "0 24px 56px rgba(26,10,4,.28), 0 8px 20px rgba(26,10,4,.14)"
        }}
      >
        {/* Swipe labels */}
        <span className="swipe-label swipe-label-match" aria-hidden="true">Match</span>
        <span className="swipe-label swipe-label-pass" aria-hidden="true">Pass</span>

        {/* Game banner */}
        <div
          style={{
            height: 148,
            position: "relative",
            background: "linear-gradient(150deg, #0D0B1A 0%, #1A0E2E 30%, #2D1654 60%, #1A0E2E 100%)",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 72% 32%,rgba(224,58,30,.32) 0%,transparent 55%)," +
                "radial-gradient(ellipse at 22% 72%,rgba(108,67,255,.14) 0%,transparent 55%)"
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              zIndex: 2
            }}
          >
            {["4.2M visits", "#1 trending"].map((stat) => (
              <span
                key={stat}
                style={{
                  background: "rgba(0,0,0,.55)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 100,
                  padding: "3px 10px",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "rgba(255,255,255,.85)"
                }}
              >
                {stat}
              </span>
            ))}
          </div>
          <span
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              background: "rgba(0,0,0,.60)",
              backdropFilter: "blur(10px)",
              borderRadius: 100,
              padding: "4px 12px",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "rgba(255,255,255,.90)",
              letterSpacing: ".03em"
            }}
          >
            Neon Frontier · Open World
          </span>
        </div>

        {/* Card body */}
        <div style={{ padding: "16px 18px 18px" }}>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(140deg,#E03A1E,#C42910)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontSize: 14,
                fontWeight: 700,
                color: "#FFF5F0",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(224,58,30,.25)"
              }}
            >
              K
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#0A0806",
                  lineHeight: 1.1,
                  letterSpacing: "-.01em"
                }}
              >
                Kai Atlas
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "rgba(10,8,6,.50)",
                  fontWeight: 500,
                  marginTop: 1
                }}
              >
                Full-stack developer
              </div>
            </div>
            <span
              style={{
                background: "rgba(255,200,87,.10)",
                border: "1px solid rgba(255,200,87,.22)",
                borderRadius: 100,
                padding: "3px 9px",
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                fontWeight: 700,
                color: "#B8860B",
                letterSpacing: ".04em",
                whiteSpace: "nowrap"
              }}
            >
              ✓ Verified
            </span>
          </div>

          {/* Skills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
            {SKILLS.map((s) => (
              <span
                key={s}
                style={{
                  background: "rgba(224,58,30,.07)",
                  borderRadius: 7,
                  padding: "3px 10px",
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#E03A1E",
                  letterSpacing: ".01em"
                }}
              >
                {s}
              </span>
            ))}
            <span
              style={{
                background: "rgba(6,214,160,.08)",
                border: "1px solid rgba(6,214,160,.15)",
                borderRadius: 7,
                padding: "3px 10px",
                fontFamily: "var(--font-body)",
                fontSize: 10,
                fontWeight: 600,
                color: "#059669"
              }}
            >
              Available
            </span>
          </div>

          {/* Games */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 6,
              marginBottom: 12
            }}
          >
            {GAMES.map((g) => (
              <div
                key={g.title}
                style={{
                  background: "rgba(10,8,6,.04)",
                  border: "1px solid rgba(10,8,6,.06)",
                  borderRadius: 10,
                  padding: "8px 10px",
                  textAlign: "center"
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: 15,
                    color: "#0A0806",
                    lineHeight: 1
                  }}
                >
                  {g.visits}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    color: "rgba(10,8,6,.45)",
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                    marginTop: 2
                  }}
                >
                  {g.title}
                </div>
              </div>
            ))}
          </div>

          {/* Rate + availability */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(10,8,6,.06)",
              paddingTop: 10
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "rgba(10,8,6,.42)",
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                  marginBottom: 2
                }}
              >
                Rate
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: 14,
                  color: "#0A0806"
                }}
              >
                50–80 R$/hr
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                aria-label="Pass"
                style={{
                  flex: 1,
                  padding: "8px 14px",
                  borderRadius: 10,
                  background: "rgba(10,8,6,.05)",
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: ".03em",
                  textTransform: "uppercase",
                  color: "rgba(10,8,6,.40)",
                  transition: "background .2s"
                }}
                onMouseEnter={(e) => { (e.currentTarget).style.background = "rgba(10,8,6,.10)"; }}
                onMouseLeave={(e) => { (e.currentTarget).style.background = "rgba(10,8,6,.05)"; }}
              >
                Pass
              </button>
              <button
                aria-label="Match"
                style={{
                  flex: 1,
                  padding: "8px 14px",
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#E03A1E,#C42910)",
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: ".03em",
                  textTransform: "uppercase",
                  color: "#FFF5F0",
                  boxShadow: "0 2px 10px rgba(224,58,30,.28)",
                  transition: "box-shadow .2s, transform .2s"
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget).style.boxShadow = "0 4px 18px rgba(224,58,30,.44)";
                  (e.currentTarget).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget).style.boxShadow = "0 2px 10px rgba(224,58,30,.28)";
                  (e.currentTarget).style.transform = "none";
                }}
              >
                Spark ✦
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating match badge */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -14,
          right: -16,
          background: "linear-gradient(135deg,#E03A1E,#C42910)",
          borderRadius: 100,
          padding: "7px 14px 7px 11px",
          display: "flex",
          alignItems: "center",
          gap: 7,
          boxShadow: "0 4px 20px rgba(224,58,30,.38)",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          fontWeight: 700,
          color: "#FFF5F0",
          letterSpacing: ".10em",
          animation: "badgeFloat 4s ease-in-out infinite",
          zIndex: 10
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#FFF5F0",
            animation: "dotPulse 2s ease-in-out infinite"
          }}
        />
        New match
      </div>
    </div>
  );
}
