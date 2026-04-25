"use client";

import Image from "next/image";
import { useAudience } from "@/context/AudienceContext";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Product flow", href: "#how" },
  { label: "Why it wins", href: "#proof" }
];

export default function Nav() {
  const { audience, setAudience } = useAudience();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(26,10,4,.92)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,247,241,.06)" : "1px solid transparent",
        padding: "0 44px",
        height: 68,
        display: "flex",
        alignItems: "center",
        transition: "background .35s, border-color .35s, backdrop-filter .35s"
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24
        }}
      >
        {/* Logo */}
        <a
          href="#top"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 22,
            color: "#FFF7F1",
            letterSpacing: "-.02em",
            textDecoration: "none",
            flexShrink: 0
          }}
        >
          <Image
            src="/Assets/weld-logo-official.svg"
            alt="weld logo"
            width={22}
            height={22}
            style={{ objectFit: "contain" }}
          />
          weld<span style={{ color: "#EA5A35" }}>.</span>
        </a>

        {/* Center: audience toggle pill */}
        <div
          style={{
            position: "relative",
            display: "flex",
            background: "rgba(255,247,241,.06)",
            border: "1px solid rgba(255,247,241,.08)",
            borderRadius: 100,
            padding: 3,
            gap: 2
          }}
        >
          {(["developer", "studio"] as const).map((aud) => (
            <button
              key={aud}
              onClick={() => setAudience(aud)}
              style={{
                position: "relative",
                zIndex: 1,
                padding: "7px 18px",
                borderRadius: 100,
                border: "none",
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background .25s cubic-bezier(.16,1,.3,1), color .25s, box-shadow .25s",
                background: audience === aud ? "#EA5A35" : "transparent",
                color: audience === aud ? "#FFF7F1" : "rgba(255,247,241,.45)",
                boxShadow: audience === aud ? "0 2px 12px rgba(234,90,53,.35)" : "none"
              }}
            >
              {aud === "developer" ? "I'm a developer" : "I'm a studio"}
            </button>
          ))}
        </div>

        {/* Right: nav links + CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 28, flexShrink: 0 }}>
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "rgba(255,247,241,.52)",
                textDecoration: "none",
                transition: "color .2s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#FFF7F1"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,247,241,.52)"; }}
            >
              {l.label}
            </a>
          ))}

          {/* CTA */}
          <a
            href="#waitlist"
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "#FFF7F1",
              background: "#EA5A35",
              padding: "9px 20px",
              borderRadius: 100,
              textDecoration: "none",
              transition: "background .2s, box-shadow .2s, transform .2s",
              boxShadow: "0 4px 16px rgba(234,90,53,.35)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#FF7A4D";
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(234,90,53,.50)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#EA5A35";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(234,90,53,.35)";
              e.currentTarget.style.transform = "none";
            }}
          >
            {audience === "developer" ? "Spark with studios" : "Weld with devs"}
          </a>

          {/* Mobile menu button */}
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#FFF7F1",
              padding: 4
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect y="3" width="20" height="1.5" rx=".75" fill="currentColor" />
              <rect y="9.25" width="20" height="1.5" rx=".75" fill="currentColor" />
              <rect y="15.5" width="20" height="1.5" rx=".75" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
