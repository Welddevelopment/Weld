"use client";

import { useAudience } from "@/context/AudienceContext";
import type { Audience } from "@/lib/audience";

interface SplitEntryProps {
  initialHidden?: boolean;
}

export default function SplitEntry({ initialHidden = false }: SplitEntryProps) {
  const { setAudience } = useAudience();

  if (initialHidden) return null;

  const choose = (aud: Audience) => {
    setAudience(aud);
    document.body.classList.remove("split-active");
    // Scroll to top cleanly
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div
      id="split-entry-root"
      role="dialog"
      aria-modal="true"
      aria-label="Choose your role"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        background: "#1A0A04"
      }}
    >
      {/* Noise overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.4,
          pointerEvents: "none"
        }}
      />

      {/* Developer half */}
      <button
        onClick={() => choose("developer")}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          background: "transparent",
          border: "none",
          borderRight: "1px solid rgba(250,212,200,.06)",
          cursor: "pointer",
          padding: "48px",
          position: "relative",
          overflow: "hidden",
          transition: "background .35s"
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(224,58,30,.06)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            background: "radial-gradient(circle,rgba(224,58,30,.08) 0%,transparent 70%)",
            pointerEvents: "none",
            transition: "opacity .35s"
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "#E03A1E",
            display: "block",
            marginBottom: 20
          }}
        >
          I&rsquo;m a developer
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(36px, 5vw, 72px)",
            fontWeight: 400,
            color: "#FAD4C8",
            letterSpacing: "-.04em",
            lineHeight: 0.95,
            marginBottom: 24,
            textAlign: "center"
          }}
        >
          I ship<br />games.
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            lineHeight: 1.72,
            color: "rgba(250,212,200,.50)",
            maxWidth: 260,
            textAlign: "center"
          }}
        >
          Get matched with studios that fit your stack — no cold pitching, no Discord noise.
        </p>
        <div
          style={{
            marginTop: 36,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "rgba(250,212,200,.35)",
            transition: "color .2s"
          }}
        >
          Enter as developer →
        </div>
      </button>

      {/* Studio half */}
      <button
        onClick={() => choose("studio")}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "48px",
          position: "relative",
          overflow: "hidden",
          transition: "background .35s"
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(250,212,200,.04)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            background: "radial-gradient(circle,rgba(250,212,200,.05) 0%,transparent 70%)",
            pointerEvents: "none"
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "rgba(250,212,200,.40)",
            display: "block",
            marginBottom: 20
          }}
        >
          I run a studio
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(36px, 5vw, 72px)",
            fontWeight: 400,
            color: "#FAD4C8",
            letterSpacing: "-.04em",
            lineHeight: 0.95,
            marginBottom: 24,
            textAlign: "center"
          }}
        >
          I hire<br />talent.
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            lineHeight: 1.72,
            color: "rgba(250,212,200,.50)",
            maxWidth: 260,
            textAlign: "center"
          }}
        >
          Browse verified Roblox developers filtered by role, rate, and availability. No job ads needed.
        </p>
        <div
          style={{
            marginTop: 36,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "rgba(250,212,200,.35)",
            transition: "color .2s"
          }}
        >
          Enter as studio →
        </div>
      </button>

      {/* Centre logo */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: 28,
          color: "#FAD4C8",
          letterSpacing: "-.03em",
          background: "#1A0A04",
          padding: "12px 24px",
          borderRadius: 100,
          border: "1px solid rgba(250,212,200,.08)",
          pointerEvents: "none",
          zIndex: 10
        }}
      >
        weld<span style={{ color: "#E03A1E" }}>.</span>
      </div>
    </div>
  );
}
