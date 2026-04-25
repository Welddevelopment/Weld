"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

const ITEMS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 12h.01M10 10v4M14 10v4M18 12h.01" />
      </svg>
    ),
    title: "Linked and authenticated profiles",
    body: "Profiles connect to your Roblox account so shipped work and metrics show up in real time — swipe and spark securely."
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "All important data displayed",
    body: "Rates, availability — we 'weld.' it all together so the right information is visible before anyone reaches out."
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="2" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="22" y2="12" />
      </svg>
    ),
    title: "Digestible intros, made for swiping",
    body: "Swipe through verified profiles, spark when there's a fit, and skip the dead-end DMs and scattered posts."
  }
];

export default function PulseStrip() {
  return (
    <section style={{ background: "#0D0A09", padding: "80px 44px" }}>
      <ScrollReveal>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            background: "rgba(255,247,241,.03)",
            border: "1px solid rgba(255,247,241,.07)",
            borderRadius: 24,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            overflow: "hidden"
          }}
        >
          {ITEMS.map((item, i) => (
            <div
              key={item.title}
              style={{
                padding: "44px 40px",
                borderRight: i < ITEMS.length - 1 ? "1px solid rgba(255,247,241,.07)" : "none",
                position: "relative"
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(234,90,53,.10)",
                  border: "1px solid rgba(234,90,53,.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#EA5A35",
                  marginBottom: 20
                }}
              >
                {item.icon}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#FFF7F1",
                  marginBottom: 10,
                  letterSpacing: "-.01em"
                }}
              >
                {item.title}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  lineHeight: 1.72,
                  color: "rgba(255,247,241,.46)"
                }}
              >
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
