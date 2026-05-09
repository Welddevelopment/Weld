import type { Audience } from "./types";

export interface LandingCopy {
  nav: {
    modeToggleDeveloper: string;
    modeToggleStudio: string;
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
  };
  howItWorks: {
    kicker: string;
    title: string;
    lead: string;
    support: string;
    steps: ReadonlyArray<readonly [string, string, string]>;
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
      cta: "Join as a developer",
      links: NAV_LINKS
    },
    hero: {
      eyebrow: "Built for Roblox devs",
      title: "find roblox studios worth shipping for.",
      lead: "Set your role, rate, and proof. Match with studios that ship and pay on time.",
      support:
        "Weld turns shipped work, rates, availability, and links into one swipeable talent card studios can trust.",
      primaryCta: "Build my talent card",
      secondaryCta: "See example card",
      cardFrame: "Your profile preview",
      helperLine: "Developer mode previews the card studios will scan before they Spark."
    },
    howItWorks: {
      kicker: "How it works",
      title: "Clarity first. Friction later.",
      lead: "Role-first cards, not generic profiles.",
      support:
        "Switch roles and watch the same card adapt. Proof, links, and pricing stay honest across every preview.",
      steps: [
        ["01", "Build your card", "Add role, rate, skills, links, proof, and shipped projects."],
        ["02", "Studios swipe", "Studios browse by role, scan your proof, and Spark the right fit."],
        ["03", "You get hired", "Chat, agree on scope, build it, and get paid."]
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
      headline: "Weld keeps the useful context, not the noise.",
      intro: "Replace scattered self-promotion with one profile and one professional thread.",
      beforeLabel: "Scattered DMs",
      afterLabel: "Weld workspace",
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
      headline: "earn from your talent.",
      subhead: "Role-first profiles. Real opportunities. Work that ships.",
      title: "Get early access to Weld.",
      body: "Join the developer beta to shape proof-first talent cards before public launch.",
      benefits: [
        ["Founding member badge", "Locked in early with a badge that proves it.", "shield"],
        ["Lower fee, locked in", "Beta members get the reduced rate. Forever.", "code"],
        ["Direct line to founders", "Shape the product while we're still building it.", "user"]
      ],
      button: "Join as a developer",
      placeholder: "you@example.com",
      fieldLabel: "Email address",
      privacy: "Invite-first beta. No fake countdowns. No public waitlist numbers.",
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
      title: "A few plain answers.",
      items: [
        {
          question: "Is this official Roblox?",
          answer:
            "No. Weld is independent. We use Roblox-talent-specific language, not Roblox logos or official verification marks."
        },
        {
          question: "What is Weld?",
          answer:
            "Weld is a Roblox talent network. Developers turn role, rate, availability, links, and proof into one swipeable card."
        },
        {
          question: "Who can join the developer beta?",
          answer:
            "Roblox developers building real systems, UIs, builds, animations, or VFX who want better-fit work without Discord chaos."
        },
        {
          question: "What goes on a talent card?",
          answer:
            "Role, rate, availability, services, links, latest project, client notes, and proof badges that explain what is checked."
        },
        {
          question: "Are these real marketplace stats?",
          answer:
            "No. Card content is illustrative product demo data showing how Weld packages proof, links, rate, and availability."
        },
        {
          question: "When will access open?",
          answer:
            "Invite-first beta. We'll send the next step to your email when developer access opens."
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
      cta: "Get hiring access",
      links: NAV_LINKS
    },
    hero: {
      eyebrow: "Built for Roblox studios",
      title: "find roblox talent who ship.",
      lead: "Filter by role, rate, proof, and availability before the first message.",
      support:
        "Weld turns scattered Discord scouting into clear talent cards your team can scan, compare, and Spark.",
      primaryCta: "Get hiring access",
      secondaryCta: "See example card",
      cardFrame: "Candidate preview",
      helperLine: "Studio mode previews the card your team will scan before they reach out."
    },
    howItWorks: {
      kicker: "How it works",
      title: "Scout faster. Hire with context.",
      lead: "Role-first cards, not bios to decode.",
      support:
        "Same card shape across every role, so your team compares fit fast instead of digging through Discord.",
      steps: [
        ["01", "Browse by role", "Filter Scripters, Builders, UI, VFX, Animators, and Systems devs."],
        ["02", "Spark the fit", "Scan verified proof, rate, and availability. Spark talent that matches your scope."],
        ["03", "Start the hire", "First message lands with proof, scope, and availability beside the thread."]
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
      headline: "Weld keeps the useful context, not the noise.",
      intro: "Replace scattered scouting with one profile, one proof layer, and one focused first-message trail.",
      beforeLabel: "Scattered DMs",
      afterLabel: "Weld workspace",
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
      headline: "find roblox talent who ship.",
      subhead: "Role-first cards, not generic profiles.",
      title: "Get hiring access to Weld.",
      body: "Join the studio beta to shape faster scouting, clearer proof, and better first conversations.",
      benefits: [
        ["Founding studio badge", "Locked in early as a verified hiring studio.", "shield"],
        ["Lower fee, locked in", "Beta studios get the reduced rate. Forever.", "code"],
        ["Direct line to founders", "Shape the product while we're still building it.", "user"]
      ],
      button: "Get hiring access",
      placeholder: "studio@example.com",
      fieldLabel: "Studio email",
      privacy: "Invite-first beta. No fake countdowns. No public waitlist numbers.",
      successMessage: "Studio spot saved. We'll send the next step soon.",
      successSticker: "Studio spot saved ✨",
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
      title: "A few plain answers.",
      items: [
        {
          question: "Is this official Roblox?",
          answer:
            "No. Weld is independent. We use Roblox-talent-specific language, not Roblox logos or official verification marks."
        },
        {
          question: "What is Weld?",
          answer:
            "Weld is a Roblox talent network. Studios scan role-first cards with proof, rate, availability, and shipped work in one place."
        },
        {
          question: "Who can join the studio beta?",
          answer:
            "Roblox studios actively hiring scripters, builders, UI, VFX, animators, or systems devs who want clearer scouting."
        },
        {
          question: "What goes on a talent card?",
          answer:
            "Role, rate, availability, services, links, latest project, client notes, and proof badges that explain what is checked."
        },
        {
          question: "Are these real marketplace stats?",
          answer:
            "No. Card content is illustrative product demo data showing how Weld packages proof, links, rate, and availability."
        },
        {
          question: "When will access open?",
          answer:
            "Invite-first beta. We'll send the next step to your studio email when hiring access opens."
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
