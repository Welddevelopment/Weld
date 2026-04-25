"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import { useTiltEffect } from "@/hooks/useTiltEffect";

const CREATORS = [
  {
    category: "Builders",
    count: "420+",
    descriptor: "Environment, level design, and world architects.",
    initial: "B",
    hue: 14
  },
  {
    category: "Scripters",
    count: "510+",
    descriptor: "Lua systems, gameplay loops, and backend wizards.",
    initial: "S",
    hue: 200
  },
  {
    category: "Animators",
    count: "180+",
    descriptor: "Character rigs, cutscenes, and motion designers.",
    initial: "A",
    hue: 280
  },
  {
    category: "UI/UX",
    count: "220+",
    descriptor: "Roblox UI/UX, interfaces, and player experience.",
    initial: "U",
    hue: 155
  }
];

function CreatorCard({ creator }: { creator: typeof CREATORS[0] }) {
  const { onMouseMove, onMouseLeave } = useTiltEffect({ maxDeg: 6 });

  return (
    <div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        background: "#221008",
        border: "1px solid rgba(250,212,200,.06)",
        borderRadius: 20,
        padding: "36px 28px",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transition: "border-color .25s, box-shadow .25s",
        boxShadow: "0 4px 0 rgba(0,0,0,.35), inset 0 1px 0 rgba(250,212,200,.06)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `hsla(${creator.hue},60%,55%,.22)`;
        e.currentTarget.style.boxShadow = `0 16px 48px hsla(${creator.hue},60%,30%,.14), 0 4px 0 rgba(0,0,0,.35), inset 0 1px 0 rgba(250,212,200,.06)`;
      }}
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "50%",
          top: -80,
          right: -60,
          background: `radial-gradient(circle,hsla(${creator.hue},60%,55%,.08) 0%,transparent 70%)`,
          pointerEvents: "none"
        }}
      />

      {/* Avatar */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: `linear-gradient(135deg,hsla(${creator.hue},60%,45%,.90),hsla(${creator.hue},40%,25%,.80))`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          boxShadow: `0 6px 20px hsla(${creator.hue},60%,35%,.28)`
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 20,
            fontWeight: 400,
            color: "#FAD4C8"
          }}
        >
          {creator.initial}
        </span>
      </div>

      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: `hsla(${creator.hue},55%,70%,.70)`,
          display: "block",
          marginBottom: 8
        }}
      >
        {creator.category}
      </span>

      <div
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "clamp(32px, 4vw, 48px)",
          fontWeight: 400,
          color: "#FAD4C8",
          letterSpacing: "-.03em",
          lineHeight: 1,
          marginBottom: 12
        }}
      >
        {creator.count}
      </div>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 13,
          lineHeight: 1.65,
          color: "rgba(250,212,200,.50)"
        }}
      >
        {creator.descriptor}
      </p>
    </div>
  );
}

export default function CreatorShowcase() {
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
            The talent pool
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 400,
              color: "#FAD4C8",
              letterSpacing: "-.04em",
              lineHeight: 1.0,
              maxWidth: 560
            }}
          >
            Every type of creator, verified.
          </h2>
        </ScrollReveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20
          }}
        >
          {CREATORS.map((creator, i) => (
            <ScrollReveal
              key={creator.category}
              delay={([0, 100, 200, 300][i] ?? 0) as 0 | 100 | 200 | 300}
            >
              <CreatorCard creator={creator} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
