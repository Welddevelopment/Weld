import ScrollReveal from "@/components/ui/ScrollReveal";

// Placeholder testimonials — replace with real quotes before launch
const TESTIMONIALS = [
  {
    quote: "I got matched with three studios in my first week. No spam, no ghost-read Discord messages.",
    name: "DevXarion",
    role: "Full-stack developer · 2.1M visits",
    initial: "D"
  },
  {
    quote: "Finally a place where my portfolio does the talking. Landed a long-term studio gig through weld.",
    name: "PixelDrift",
    role: "GFX & animator · 840k visits",
    initial: "P"
  },
  {
    quote: "We hired two scripters in a week. Verified rates upfront meant no awkward negotiation.",
    name: "Nova Studios",
    role: "Studio · 14 shipped games",
    initial: "N"
  },
  {
    quote: "The swipe mechanic sounds gimmicky but it works. Our hiring pipeline is 10x faster.",
    name: "Apex Forge",
    role: "Studio · Simulator specialist",
    initial: "A"
  }
];

export default function TestimonialSection() {
  return (
    <section
      id="proof"
      style={{ background: "#FAD4C8", padding: "112px 44px" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <ScrollReveal style={{ textAlign: "center", marginBottom: 64 }}>
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
            Early feedback
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 400,
              color: "#1A0A04",
              letterSpacing: "-.04em",
              lineHeight: 1.0
            }}
          >
            People are already talking.
          </h2>
        </ScrollReveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <ScrollReveal
              key={t.name}
              delay={([0, 100, 200, 300][i] ?? 0) as 0 | 100 | 200 | 300}
              style={{
                background: "#1A0A04",
                borderRadius: 20,
                padding: "36px 32px",
                boxShadow: "0 12px 40px rgba(26,10,4,.22), 0 4px 12px rgba(26,10,4,.12)"
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: 42,
                  color: "#E03A1E",
                  lineHeight: 1,
                  marginBottom: 16,
                  opacity: 0.7
                }}
              >
                "
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  lineHeight: 1.72,
                  color: "rgba(250,212,200,.82)",
                  marginBottom: 28,
                  fontStyle: "italic"
                }}
              >
                {t.quote}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#E03A1E,#7A1C07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#FAD4C8",
                    flexShrink: 0
                  }}
                >
                  {t.initial}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#FAD4C8"
                    }}
                  >
                    {t.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "rgba(250,212,200,.48)",
                      letterSpacing: ".04em",
                      marginTop: 2
                    }}
                  >
                    {t.role}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
