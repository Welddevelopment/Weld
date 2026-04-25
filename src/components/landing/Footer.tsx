"use client";

import Image from "next/image";

const LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "mailto:hello@weldroblox.com" }
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "#080706",
        borderTop: "1px solid rgba(255,247,241,.06)",
        padding: "52px 44px 44px"
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 24
        }}
      >
        {/* Left: logo + tagline */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a
            href="#top"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: 22,
              color: "#FFF7F1",
              letterSpacing: "-.02em",
              textDecoration: "none"
            }}
          >
            <Image
              src="/Assets/weld-logo-official.svg"
              alt="weld logo"
              width={22}
              height={22}
              style={{ objectFit: "contain" }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/Assets/weld-logo-official.jpg"; }}
            />
            weld<span style={{ color: "#EA5A35" }}>.</span>
          </a>
          <div
            style={{
              width: 1,
              height: 20,
              background: "rgba(255,247,241,.08)"
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: ".12em",
              color: "rgba(255,247,241,.22)",
              textTransform: "uppercase"
            }}
          >
            Roblox talent, with more signal
          </span>
        </div>

        {/* Right: links + copyright */}
        <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "rgba(255,247,241,.35)",
                textDecoration: "none",
                transition: "color .2s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#EA5A35"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,247,241,.35)"; }}
            >
              {l.label}
            </a>
          ))}
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "rgba(255,247,241,.18)"
            }}
          >
            &copy; 2026 Weld
          </span>
        </div>
      </div>
    </footer>
  );
}
