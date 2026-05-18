import type { Audience } from "./types";
import { LANDING_TALLY } from "./landing-blocks";

export type HowItWorksIcon = "card" | "shield" | "spark" | "hire" | "search" | "message";

export interface LandingCopy {
  nav: {
    modeToggleDeveloper: string;
    modeToggleStudio: string;
    alreadySignedUp: string;
    cta: string;
    links: ReadonlyArray<{ href: string; label: string }>;
  };
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    support: string;
    primaryCta: string;
    secondaryCta: string;
    cardFrame: string;
    helperLine: string;
    proofPrefix: string;
    proofStrong: string;
    proofSuffix: string;
    submittingLabel: string;
    submittedLabel: string;
    inviteReturn: string;
    /** Short reassurance under the hero email row (footer keeps full `waitlist.privacy`). */
    trustLine: string;
    signalTabProof: string;
    signalTabMatch: string;
    signalTabContext: string;
  };
  marquee: {
    talentPrimary: { kicker: string; title: string; body: string; strong?: string };
    talentSecondary: { kicker: string; title: string; body: string; strong?: string };
    studioPrimary: { kicker: string; title: string; body: string; strong?: string };
    studioSecondary: { kicker: string; title: string; body: string; strong?: string };
  };
  roleExplorer: {
    kicker: string;
    title: string;
    lead: string;
    hiring: {
      goodFitTitle: string;
      /** Use `{studio}` placeholder; only shown in developer mode. */
      goodFitBodyDev: string;
      goodFitBodyStudio: string;
      primaryCta: string;
      secondaryCta: string;
    };
  };
  comparison: {
    kicker: string;
    title: string;
    body: string;
  };
  howItWorks: {
    kicker: string;
    title: string;
    lead: string;
    support: string;
    steps: ReadonlyArray<{
      number: string;
      title: string;
      body: string;
      icon: HowItWorksIcon;
    }>;
  };
  profileCreation: {
    kicker: string;
    title: string;
    body: string;
    proofLinksValue: string;
    cardShapeNote: readonly [string, string];
  };
  chatPreview: {
    kicker: string;
    headline: string;
    body: string;
    professionalNote: readonly [string, string];
    threadLabel: string;
    composerHint: (handle: string) => string;
  };
  antiDiscord: {
    kicker: string;
    headline: string;
    intro: string;
    beforeLabel: string;
    afterLabel: string;
    before: ReadonlyArray<string>;
    after: ReadonlyArray<string>;
  };
  proof: {
    kicker: string;
    title: string;
    lead: string;
    beforeStrong: string;
    beforeBody: string;
    beforeChips: ReadonlyArray<string>;
    afterStrong: string;
    afterBody: string;
    sparkLabel: string;
    likeLabel: string;
    rejectLabel: string;
  };
  studioScout: {
    kicker: string;
    title: string;
    body: string;
    rail: ReadonlyArray<readonly [string, string]>;
  };
  waitlist: {
    kicker: string;
    headline: string;
    subhead: string;
    title: string;
    body: string;
    benefits: ReadonlyArray<readonly [string, string, "shield" | "code" | "user" | "folder"]>;
    button: string;
    placeholder: string;
    fieldLabel: string;
    privacy: string;
    successMessage: string;
    successSticker: string;
    submittingLabel: string;
    submittedLabel: string;
  };
  demo: {
    latestProjectCaption: string;
    feedbackCaption: string;
    matchPreviewLabel: string;
  };
  faq: {
    kicker: string;
    title: string;
    items: ReadonlyArray<{ question: string; answer: string }>;
  };
  footer: {
    tagline: string;
    privacy: string;
    terms: string;
    contact: string;
  };
}

const NAV_LINKS = [
  { href: "#how", label: "What it does" },
  { href: "#chat", label: "Chat" },
  { href: "#compare", label: "Compare" },
  { href: "#faq", label: "FAQ" }
] as const;

const COPY: Record<Audience, LandingCopy> = {
  developer: {
    nav: {
      modeToggleDeveloper: "I'm a developer",
      modeToggleStudio: "I'm a studio",
      alreadySignedUp: "Already signed up?",
      cta: "Join as a developer",
      links: NAV_LINKS
    },
    hero: {
      eyebrow: "Built for Roblox devs",
      title: "The talent network for Roblox.",
      lead: "Link your games, set your rate, and match with studios that actually ship.",
      support:
        "weld. turns shipped work, rates, availability, links, and proof into swipeable talent cards studios can trust.",
      primaryCta: "Build my talent card",
      secondaryCta: "See example card",
      cardFrame: "Your profile preview",
      helperLine: "Developer mode previews the card studios will scan before they Spark.",
      proofPrefix: "over",
      proofStrong: String(LANDING_TALLY.studios),
      proofSuffix: "studio signups",
      submittingLabel: "Joining...",
      submittedLabel: "You're in",
      inviteReturn: "Back to my invite page",
      trustLine: "Invite-first beta. No fake countdowns or public waitlist numbers.",
      signalTabProof: "Proof",
      signalTabMatch: "Fit",
      signalTabContext: "Studio view"
    },
    marquee: {
      talentPrimary: {
        kicker: "WHEN WE OPEN",
        title: "This is who'll be here.",
        body: "Sample cards showing the format.",
        strong: `${LANDING_TALLY.developers} devs on the waitlist and counting`
      },
      talentSecondary: {
        kicker: "MEET THE NETWORK",
        title: "More builders, scripters, and artists are joining.",
        body: "Every profile keeps rate, proof, links, and availability in the same scannable card shape."
      },
      studioPrimary: {
        kicker: "WE'RE OPENING SOON",
        title: "And here's who's looking.",
        body: `${LANDING_TALLY.studios} studios waitlisted already. Sign up today and get exposed to them immediately on launch.`
      },
      studioSecondary: {
        kicker: "HIRING SIDE",
        title: "Studios scan fit the same way.",
        body: "Role, rate, and proof stay visible before the first DM."
      }
    },
    roleExplorer: {
      kicker: "FOR DEVELOPERS",
      title: "Pick what you do. See who's hiring.",
      lead: "Real open roles, cleaner scope, and visible rates before you Spark.",
      hiring: {
        goodFitTitle: "Good fit?",
        goodFitBodyDev: "Spark {studio} to open a focused hiring thread.",
        goodFitBodyStudio: "",
        primaryCta: "Spark role",
        secondaryCta: "Next job"
      }
    },
    comparison: {
      kicker: "IMPROVED VISIBILITY",
      title: "Where your signal gets seen.",
      body: "Discord spreads your pitch around. weld. keeps proof, rate, role, and first-message context together."
    },
    howItWorks: {
      kicker: "How it works",
      title: "Clarity first. Friction later.",
      lead: "Role-first cards, not generic profiles.",
      support:
        "Switch roles and watch the same card adapt. Proof, links, and pricing stay honest across every preview.",
      steps: [
        {
          number: "1",
          title: "Build your card",
          body: "Add role, rate, skills, links, proof, and projects.",
          icon: "card"
        },
        {
          number: "2",
          title: "We verify proof",
          body: "We check links, projects, and activity so studios can trust your card.",
          icon: "shield"
        },
        {
          number: "3",
          title: "Studios match & Spark",
          body: "Studios swipe, match, and Spark the talent they want to hire.",
          icon: "spark"
        },
        {
          number: "4",
          title: "You get hired",
          body: "Chat, agree on scope, build awesome games, and get paid.",
          icon: "hire"
        }
      ]
    },
    profileCreation: {
      kicker: "Profile creation",
      title: "Create a profile that proves the work.",
      body:
        "Turn role, rate, skills, proof, and links into one readable card that keeps your pitch clean across every studio.",
      proofLinksValue: "Roblox, GitHub, portfolio",
      cardShapeNote: [
        "Card shape stays stable.",
        "Same fields across every role, so studios compare fast instead of decoding bios."
      ]
    },
    chatPreview: {
      kicker: "Chat system",
      headline: "Professional chat, not scattered DMs.",
      body:
        "A match becomes a focused conversation with proof, scope, and availability sitting beside the thread.",
      professionalNote: ["Keep it professional", "Clear scope, respectful asks, no lost context."],
      threadLabel: "Today",
      composerHint: (handle) => `Message ${handle}...`
    },
    antiDiscord: {
      kicker: "Less Discord chaos",
      headline: "weld. keeps the useful context, not the noise.",
      intro: "Replace scattered self-promotion with one profile and one professional thread.",
      beforeLabel: "Scattered DMs",
      afterLabel: "weld. workspace",
      before: ["Rate buried in DMs", "Portfolio split across links", "Availability unclear", "Scope starts from zero"],
      after: ["Role-first profile", "Verified proof fields", "Rate and availability visible", "Focused chat context"]
    },
    proof: {
      kicker: "Proof",
      title: "Scattered links become one readable proof layer.",
      lead: "Trust comes from clarity. No fake metrics, no invented traction, no noisy admin metaphors.",
      beforeStrong: "Before",
      beforeBody:
        "Portfolio link in bio. Rate in a DM. Old clip in another post. Availability maybe buried somewhere.",
      beforeChips: ["portfolio link", "rate in DM", "old clip", "availability maybe"],
      afterStrong: "With weld.",
      afterBody:
        "Same information, framed with role, linked work, pricing, availability, and recent proof in one place.",
      sparkLabel: "Spark",
      likeLabel: "Like",
      rejectLabel: "Reject"
    },
    studioScout: {
      kicker: "For both sides",
      title: "Studios see fit fast.",
      body: "Your card stays readable under pressure: who you are, what you do, how you charge, and what proves it.",
      rail: [
        ["Proof before pitch", "Shipped work and scope sit beside rate and availability, not behind generic claims."],
        ["One calm first viewport", "Big card, clear headline, obvious CTA. Hero explains product without novelty UI."],
        ["Honest by default", "No waitlist counts, no logos, no made-up praise. Only product shape and real signals."]
      ]
    },
    waitlist: {
      kicker: "Early access",
      headline: "Build a talent card studios can trust.",
      subhead: "Package your role, rate, availability, links, and shipped work into one clean card.",
      title: "Join the developer beta.",
      body: "Start with your email. The next step helps you shape a role-first profile with proof up front.",
      benefits: [
        ["Proof-first card", "Show what you shipped before the first DM.", "shield"],
        ["Better-fit work", "Make rate, availability, and role clear upfront.", "code"],
        ["Founder access", "Help tune the product while the beta is still small.", "user"]
      ],
      button: "Join as a developer",
      placeholder: "you@example.com",
      fieldLabel: "Email address",
      privacy: "Invite-first beta for Roblox talent. No fake countdowns or public waitlist numbers.",
      successMessage: "Spot saved. We'll send the next step soon.",
      successSticker: "Spot saved ✨",
      submittingLabel: "Joining...",
      submittedLabel: "Joined"
    },
    demo: {
      latestProjectCaption: "Example project",
      feedbackCaption: "Feedback preview — real notes appear after verification.",
      matchPreviewLabel: "Match preview"
    },
    faq: {
      kicker: "FAQ",
      title: "Quick answers, no fine print.",
      items: [
        {
          question: "Is weld. official Roblox?",
          answer:
            "No. weld. is independent. We speak directly to Roblox talent, but we do not use Roblox logos or official verification marks."
        },
        {
          question: "What is weld.?",
          answer:
            "weld. turns your role, rate, availability, links, and proof into a clean Roblox talent card studios can scan fast."
        },
        {
          question: "Who can join the developer beta?",
          answer:
            "Roblox developers with real scripting, UI, building, animation, VFX, or systems work who want better-fit opportunities beyond Discord."
        },
        {
          question: "What goes on a talent card?",
          answer:
            "Your card can show role, rate, availability, services, links, latest project, client notes, and proof badges that explain what was checked."
        },
        {
          question: "Are the demo stats real?",
          answer:
            "No. The current card content is illustrative demo data showing how weld. packages proof, links, rate, and availability."
        },
        {
          question: "When will access open?",
          answer:
            "Access is invite-first. When developer access opens, the next step goes to the email you joined with."
        }
      ]
    },
    footer: {
      tagline: "Roblox talent cards for clearer proof, cleaner scouting, and better first messages.",
      privacy: "Privacy",
      terms: "Terms",
      contact: "Contact"
    }
  },
  studio: {
    nav: {
      modeToggleDeveloper: "I'm a developer",
      modeToggleStudio: "I'm a studio",
      alreadySignedUp: "Already signed up?",
      cta: "Get hiring access",
      links: NAV_LINKS
    },
    hero: {
      eyebrow: "Built for Roblox studios",
      title: "Find Roblox talent with proof upfront.",
      lead: "Scan focused cards by role, rate, proof, and availability before the first message.",
      support:
        "weld. turns scattered Discord scouting into clear talent cards your team can scan, compare, and Spark.",
      primaryCta: "Get hiring access",
      secondaryCta: "See example card",
      cardFrame: "Candidate preview",
      helperLine: "Studio mode previews the card your team will scan before they reach out.",
      proofPrefix: "over",
      proofStrong: String(LANDING_TALLY.studios),
      proofSuffix: "studios preparing to hire",
      submittingLabel: "Opening...",
      submittedLabel: "You're in",
      inviteReturn: "Back to my invite page",
      trustLine: "Invite-first beta for hiring teams. No fake countdowns or public waitlist numbers.",
      signalTabProof: "Proof",
      signalTabMatch: "Fit",
      signalTabContext: "Talent view"
    },
    marquee: {
      talentPrimary: {
        kicker: "CANDIDATE PIPELINE",
        title: "This is who you'll scan.",
        body: "Developer cards are built for comparison.",
        strong: `${LANDING_TALLY.developers} devs on the waitlist and counting`
      },
      talentSecondary: {
        kicker: "TALENT SIDE",
        title: "Dev cards are ready for fast review.",
        body: "Role, rate, proof, and links stay in one format your team can trust."
      },
      studioPrimary: {
        kicker: "WHEN WE OPEN",
        title: "This is who's hiring.",
        body: `${LANDING_TALLY.studios} studios waitlisted already. Browse the hiring side and see how your team will appear.`
      },
      studioSecondary: {
        kicker: "HIRING DEMAND",
        title: "Studios are already lining up roles.",
        body: "Preview demand, scope, and rate clarity before opening access."
      }
    },
    roleExplorer: {
      kicker: "FOR STUDIOS",
      title: "Pick a role. See market demand.",
      lead: "Preview role demand, rates, and scope the same way talent sees hiring cards.",
      hiring: {
        goodFitTitle: "Posting preview",
        goodFitBodyDev: "",
        goodFitBodyStudio:
          "This is how talent reads a hiring card before they reply — scope, pay band, and credibility in one scan.",
        primaryCta: "Get hiring access",
        secondaryCta: "Next listing"
      }
    },
    comparison: {
      kicker: "HIRING CLARITY",
      title: "Compare channels before you scout.",
      body: "Discord can create reach, but weld. keeps candidate signal and first-message context in one place."
    },
    howItWorks: {
      kicker: "How it works",
      title: "Scout faster. Hire with context.",
      lead: "Role-first cards, not bios to decode.",
      support:
        "Same card shape across every role, so your team compares fit fast instead of digging through Discord.",
      steps: [
        {
          number: "1",
          title: "Browse by role",
          body: "Filter scripters, builders, UI, VFX, animators, and systems devs.",
          icon: "search"
        },
        {
          number: "2",
          title: "Review proof",
          body: "Check links, projects, and activity before your first message.",
          icon: "shield"
        },
        {
          number: "3",
          title: "Spark the fit",
          body: "Match with talent whose rate, proof, and availability fit your scope.",
          icon: "spark"
        },
        {
          number: "4",
          title: "Start the hire",
          body: "Open a focused thread with proof, scope, and availability beside it.",
          icon: "message"
        }
      ]
    },
    profileCreation: {
      kicker: "Candidate cards",
      title: "Scout Roblox talent without Discord chaos.",
      body:
        "Studios see rate, availability, proof, links, and recent work in one stable card shape instead of scattered bios and DMs.",
      proofLinksValue: "Roblox, GitHub, portfolio",
      cardShapeNote: [
        "Card shape stays stable.",
        "Same fields across every role, so your team compares fit fast instead of decoding bios."
      ]
    },
    chatPreview: {
      kicker: "Chat system",
      headline: "First messages start with context.",
      body: "A match becomes a focused conversation with proof, scope, and availability sitting beside the thread.",
      professionalNote: ["Keep it professional", "Clear scope, respectful asks, no lost context."],
      threadLabel: "Today",
      composerHint: (handle) => `Message ${handle}...`
    },
    antiDiscord: {
      kicker: "Less Discord chaos",
      headline: "weld. keeps the useful context, not the noise.",
      intro: "Replace scattered scouting with one profile, one proof layer, and one focused first-message trail.",
      beforeLabel: "Scattered DMs",
      afterLabel: "weld. workspace",
      before: ["Rate hidden in DMs", "Portfolio split across servers", "Availability unclear", "Scope starts from zero"],
      after: ["Role-first candidate cards", "Verified proof fields", "Rate and availability visible", "Focused thread context"]
    },
    proof: {
      kicker: "Proof",
      title: "Scattered claims become one scannable proof layer.",
      lead: "Hire on signal, not vibes. No fake metrics, no invented traction, no noisy admin metaphors.",
      beforeStrong: "Before",
      beforeBody:
        "Bio link in Discord. Rate in a thread reply. Old clip in another channel. Availability anyone's guess.",
      beforeChips: ["bio link", "rate in thread", "old clip", "availability maybe"],
      afterStrong: "With weld.",
      afterBody:
        "Same information, framed with role, linked work, pricing, availability, and recent proof in one card.",
      sparkLabel: "Spark / Hire",
      likeLabel: "Shortlist",
      rejectLabel: "Pass"
    },
    studioScout: {
      kicker: "For both sides",
      title: "Hire with context before first DM.",
      body: "Same product, different frame: card-first scouting that helps your team compare fit quickly and honestly.",
      rail: [
        ["Proof before pitch", "Shipped work and scope sit beside rate and availability, not behind generic claims."],
        ["One calm first viewport", "Scan the card, not five tabs. Hero explains product without novelty UI."],
        ["Honest by default", "No fake testimonials, no public waitlist numbers, no made-up traction."]
      ]
    },
    waitlist: {
      kicker: "Early access",
      headline: "Find Roblox talent with proof upfront.",
      subhead: "Scan focused cards with role, rate, availability, shipped work, and links in one place.",
      title: "Get studio hiring access.",
      body: "Start with your studio email. The next step helps us open the right scouting lane for your team.",
      benefits: [
        ["Proof before pitch", "See shipped work and context before outreach.", "shield"],
        ["Cleaner scouting", "Compare role, rate, and availability without tab chaos.", "folder"],
        ["Founder access", "Shape hiring workflows while the beta is still small.", "user"]
      ],
      button: "Get hiring access",
      placeholder: "studio@example.com",
      fieldLabel: "Studio email",
      privacy: "Invite-first beta for hiring teams. No fake countdowns or public waitlist numbers.",
      successMessage: "Studio spot saved. We'll send the next step soon.",
      successSticker: "Studio spot saved ✨",
      submittingLabel: "Opening...",
      submittedLabel: "Joined"
    },
    demo: {
      latestProjectCaption: "Example project",
      feedbackCaption: "Feedback preview — real notes appear after verification.",
      matchPreviewLabel: "Match preview"
    },
    faq: {
      kicker: "FAQ",
      title: "Quick answers, no fine print.",
      items: [
        {
          question: "Is weld. official Roblox?",
          answer:
            "No. weld. is independent. We speak directly to Roblox talent and studios, but we do not use Roblox logos or official verification marks."
        },
        {
          question: "What is weld.?",
          answer:
            "weld. is a Roblox talent network where studios scan role-first cards with proof, rate, availability, and shipped work in one place."
        },
        {
          question: "Who can join the studio beta?",
          answer:
            "Roblox studios actively hiring scripters, builders, UI designers, VFX artists, animators, or systems developers can request early access."
        },
        {
          question: "What goes on a talent card?",
          answer:
            "Each card can show role, rate, availability, services, links, latest project, client notes, and proof badges that explain what was checked."
        },
        {
          question: "Are the demo stats real?",
          answer:
            "No. The current card content is illustrative demo data showing how weld. packages proof, links, rate, and availability."
        },
        {
          question: "When will access open?",
          answer:
            "Access is invite-first. When hiring access opens, the next step goes to the studio email you joined with."
        }
      ]
    },
    footer: {
      tagline: "Roblox talent cards for clearer proof, cleaner scouting, and better first messages.",
      privacy: "Privacy",
      terms: "Terms",
      contact: "Contact"
    }
  }
} as const;

export function getLandingCopy(mode: Audience): LandingCopy {
  return COPY[mode];
}

export type { Audience };
