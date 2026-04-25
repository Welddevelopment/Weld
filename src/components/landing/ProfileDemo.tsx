"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useTiltEffect } from "@/hooks/useTiltEffect";

type ViewMode = "developer" | "studio";

const ANNOTATIONS: Record<ViewMode, { field: string; note: string; color: string }[]> = {
  developer: [
    { field: "Verified badge", note: "Roblox OAuth confirms this is a real account with shipped games", color: "#E03A1E" },
    { field: "Rate display", note: "Set your rate range — studios see it upfront, no awkward negotiation", color: "#7A9E7E" },
    { field: "Game portfolio", note: "Visit counts pulled live from Roblox API — proof, not promises", color: "#6B8EBD" },
    { field: "Availability chip", note: "Toggle on/off — studios only see you when you're open to work", color: "#BDA96B" }
  ],
  studio: [
    { field: "Verified badge", note: "Every developer on weld is identity-verified — no fake profiles", color: "#E03A1E" },
    { field: "Rate display", note: "Budget match before you even reach out — no wasted conversations", color: "#7A9E7E" },
    { field: "Game portfolio", note: "Real shipped games with real visit data — judge quality, not claims", color: "#6B8EBD" },
    { field: "Spark button", note: "One tap to open a conversation — developer gets notified instantly", color: "#C4845A" }
  ]
};

function ProfileMock() {
  const { onMouseMove, onMouseLeave } = useTiltEffect({ maxDeg: 4 });

  return (
    <div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        background: "#221008",
        border: "1px solid rgba(250,212,200,.10)",
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,.40), 0 8px 24px rgba(0,0,0,.20)",
        transition: "box-shadow .3s"
      }}
    >
      {/* Banner */}
      <div
        style={{
          height: 100,
          background: "linear-gradient(135deg,#3D1A6E,#1A0A3E)",
          position: "relative"
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 70% 50%,rgba(100,60,200,.35) 0%,transparent 65%)"
          }}
        />
      </div>

      <div style={{ padding: "0 24px 24px" }}>
        {/* Avatar row */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: -28, marginBottom: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#E03A1E,#7A1C07)",
              border: "3px solid #221008",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: 20,
              color: "#FAD4C8"
            }}
          >
            X
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {/* Verified badge */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: ".1em",
                color: "#E03A1E",
                background: "rgba(224,58,30,.12)",
                border: "1px solid rgba(224,58,30,.20)",
                padding: "4px 8px",
                borderRadius: 100
              }}
            >
              ✓ VERIFIED
            </span>
            {/* Availability */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: ".08em",
                color: "#4ADE80",
                background: "rgba(74,222,128,.08)",
                border: "1px solid rgba(74,222,128,.18)",
                padding: "4px 8px",
                borderRadius: 100
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ADE80", display: "inline-block" }} />
              AVAILABLE
            </span>
          </div>
        </div>

        {/* Name + rate */}
        <div style={{ marginBottom: 14 }}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: 20,
              fontWeight: 400,
              color: "#FAD4C8",
              letterSpacing: "-.02em",
              marginBottom: 4
            }}
          >
            xarion_dev
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "rgba(250,212,200,.55)" }}>
              50–80 R$/hr
            </span>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(250,212,200,.25)", display: "inline-block" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "rgba(250,212,200,.55)" }}>
              Full-stack
            </span>
          </div>
        </div>

        {/* Skills */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {["Scripting", "UI/UX", "Systems", "GFX"].map((skill) => (
            <span
              key={skill}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: ".08em",
                textTransform: "uppercase",
                color: "rgba(250,212,200,.65)",
                background: "rgba(255,255,255,.06)",
                border: "1px solid rgba(250,212,200,.08)",
                padding: "4px 10px",
                borderRadius: 100
              }}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Games */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
          {[
            { name: "Blade Realms", visits: "1.2M" },
            { name: "Neon City RP", visits: "890k" }
          ].map((game) => (
            <div
              key={game.name}
              style={{
                background: "rgba(255,255,255,.04)",
                border: "1px solid rgba(250,212,200,.06)",
                borderRadius: 10,
                padding: "10px 12px"
              }}
            >
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(250,212,200,.80)", marginBottom: 3 }}>
                {game.name}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(250,212,200,.38)" }}>
                {game.visits} visits
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 10,
              background: "#E03A1E",
              border: "none",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".10em",
              textTransform: "uppercase",
              color: "#FAD4C8",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(224,58,30,.30)"
            }}
          >
            Spark ⚡
          </button>
          <button
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 10,
              background: "rgba(255,255,255,.06)",
              border: "1px solid rgba(250,212,200,.08)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".10em",
              textTransform: "uppercase",
              color: "rgba(250,212,200,.45)",
              cursor: "pointer"
            }}
          >
            Pass
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfileDemo() {
  const [view, setView] = useState<ViewMode>("developer");

  return (
    <section style={{ background: "#1A0A04", padding: "112px 44px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <ScrollReveal style={{ marginBottom: 64 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "#E03A1E",
              display: "block",
              marginBottom: 14
            }}
          >
            The profile
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 24
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(36px, 5vw, 60px)",
                fontWeight: 400,
                color: "#FAD4C8",
                letterSpacing: "-.04em",
                lineHeight: 1.0,
                maxWidth: 480
              }}
            >
              One profile. Two perspectives.
            </h2>
            {/* View toggle */}
            <div
              style={{
                display: "flex",
                background: "#221008",
                border: "1px solid rgba(250,212,200,.08)",
                borderRadius: 100,
                padding: 4,
                gap: 4
              }}
            >
              {(["developer", "studio"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 100,
                    border: "none",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "background .2s, color .2s",
                    background: view === v ? "#E03A1E" : "transparent",
                    color: view === v ? "#FAD4C8" : "rgba(250,212,200,.40)"
                  }}
                >
                  {v === "developer" ? "Developer view" : "Studio view"}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "start"
          }}
        >
          {/* Profile card */}
          <ScrollReveal>
            <ProfileMock />
          </ScrollReveal>

          {/* Annotations */}
          <ScrollReveal delay={100}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 8 }}>
              {ANNOTATIONS[view].map((ann, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: "20px 24px",
                    background: "#221008",
                    border: `1px solid ${ann.color}22`,
                    borderLeft: `3px solid ${ann.color}`,
                    borderRadius: 14
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: ".12em",
                        textTransform: "uppercase",
                        color: ann.color,
                        marginBottom: 6
                      }}
                    >
                      {ann.field}
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        lineHeight: 1.65,
                        color: "rgba(250,212,200,.65)"
                      }}
                    >
                      {ann.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
