"use client";

import { useState } from "react";
import { useAudience } from "@/context/AudienceContext";
import ScrollReveal from "@/components/ui/ScrollReveal";

const DEV_FAQS = [
  {
    q: "Is weld. free for developers?",
    a: "Yes. Building your profile and joining early access is completely free for developers. Studios are the ones who pay for access to verified talent — you keep 100% of what you negotiate directly."
  },
  {
    q: "How do developers get verified?",
    a: "You connect your Roblox account during signup. weld. pulls your shipped games, visit counts, and account metrics automatically — no portfolio uploads or copy-paste bios needed."
  },
  {
    q: "Can studios contact me privately?",
    a: "Yes. Studios can browse and spark with you privately. You get notified when there's a match — you decide whether to respond, without anyone spamming your DMs."
  },
  {
    q: "Which roles are supported first?",
    a: "We're starting with the roles studios hire most: scripters, builders, UI/UX designers, animators, and systems developers. More roles will be added based on demand."
  },
  {
    q: "How does matching work for developers?",
    a: "weld. ranks opportunities for you by role fit, rate alignment, and studio activity — so the sparks you get are actually worth your time, not just anyone who clicked a button."
  },
  {
    q: "Why should developers join early?",
    a: "You get in front of studios first. Early profiles get higher placement in studio search results, and you lock in any launch perks before we go live to the public."
  }
];

const STUDIO_FAQS = [
  {
    q: "Is weld. free for studios?",
    a: "Early access is free while we onboard the first wave of studios. Paid plans launch when the platform goes live — early studios get first pick of the pricing tiers."
  },
  {
    q: "How are developers verified?",
    a: "Developers link their Roblox account to weld. We verify their shipped games, visit counts, and platform metrics automatically — no unverified portfolios or fake experience claims."
  },
  {
    q: "Can studios hire privately?",
    a: "Yes. You can quietly browse and spark with developers without posting a public job listing. Your studio name and project details are only shared when a spark is accepted."
  },
  {
    q: "Which roles can studios hire first?",
    a: "At launch you'll find scripters, builders, UI/UX designers, animators, and systems developers. We're expanding the role list based on what studios need most."
  },
  {
    q: "How does matching work for studios?",
    a: "weld. ranks developers for each role by fit score — combining your budget, team size, project type, and developer availability. No more guessing from a bio paragraph."
  },
  {
    q: "Why should studios join early?",
    a: "You get first pick of verified talent before the platform opens broadly. Early studios also get input on features and access to developers who are actively looking for work right now."
  }
];

export default function FAQSection() {
  const { audience } = useAudience();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = audience === "developer" ? DEV_FAQS : STUDIO_FAQS;

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      id="faq"
      style={{ background: "#090807", padding: "112px 44px" }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <ScrollReveal style={{ textAlign: "center", marginBottom: 56 }}>
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
            FAQ
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(34px, 5vw, 56px)",
              fontWeight: 400,
              color: "#FFF7F1",
              letterSpacing: "-.035em",
              lineHeight: 1.0
            }}
          >
            A few things to know.
          </h2>
        </ScrollReveal>

        <div>
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <ScrollReveal
                key={`${audience}-${i}`}
                delay={i < 2 ? (i * 100 as 0 | 100) : 0}
                style={{ borderBottom: "1px solid rgba(255,247,241,.08)" }}
              >
                <button
                  aria-expanded={isOpen}
                  onClick={() => toggle(i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "22px 0",
                    gap: 16,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: 18,
                    fontWeight: 400,
                    color: isOpen ? "#FFF7F1" : "rgba(255,247,241,.72)",
                    letterSpacing: "-.01em",
                    textAlign: "left",
                    transition: "color .2s"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#FFF7F1"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = isOpen ? "#FFF7F1" : "rgba(255,247,241,.72)"; }}
                >
                  {item.q}
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: isOpen ? "#EA5A35" : "rgba(255,247,241,.06)",
                      border: isOpen ? "none" : "1px solid rgba(255,247,241,.10)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      color: isOpen ? "#FFF7F1" : "rgba(255,247,241,.42)",
                      transform: isOpen ? "rotate(45deg)" : "none",
                      transition: "transform .35s cubic-bezier(.22,1,.36,1), background .25s, color .25s",
                      flexShrink: 0
                    }}
                  >
                    +
                  </span>
                </button>
                <div className={`faq-answer${isOpen ? " open" : ""}`}>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 15,
                      lineHeight: 1.75,
                      color: "rgba(255,247,241,.58)",
                      paddingBottom: 22,
                      maxWidth: 580
                    }}
                  >
                    {item.a}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
