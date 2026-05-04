import type { Audience } from "./types";

export type RoleKey =
  | "scripter"
  | "builder"
  | "ui"
  | "vfx"
  | "animator"
  | "designer"
  | "systems";

export type DetailKey = "verified" | "projects" | "reliability" | "latest" | "feedback";

export interface TalentProfile {
  role: RoleKey;
  label: string;
  name: string;
  handle: string;
  headline: string;
  availability: string;
  rate: string;
  payment: string;
  matchScore: number;
  years: string;
  projects: string;
  reliability: string;
  services: string[];
  links: Array<{ label: string; value: string }>;
  latestProject: {
    name: string;
    summary: string;
    bullets: string[];
  };
  feedback: {
    label: string;
    note: string;
  };
  proofDetails: Record<DetailKey, { title: string; body: string }>;
  accent: string;
  soft: string;
}

export const ROLE_ORDER: ReadonlyArray<RoleKey> = [
  "scripter",
  "builder",
  "ui",
  "vfx",
  "animator",
  "designer",
  "systems"
];

export const ROLE_LABELS: Record<RoleKey, string> = {
  scripter: "Scripter",
  builder: "Builder",
  ui: "UI Design",
  vfx: "VFX",
  animator: "Animator",
  designer: "Game Design",
  systems: "Systems"
};

export const PROFILES: Record<RoleKey, TalentProfile> = {
  scripter: {
    role: "scripter",
    label: "Roblox scripter",
    name: "Eclipse",
    handle: "@EclipseRBLX",
    headline: "Builds clean Roblox systems, ships fast, and shows real proof of work.",
    availability: "Available for work",
    rate: "$65/hr",
    payment: "Hourly or milestone",
    matchScore: 92,
    years: "3+ yrs",
    projects: "Linked work",
    reliability: "On-time notes",
    services: ["Lua", "Roblox API", "Remote Events", "Data Stores", "Optimization", "Game Systems"],
    links: [
      { label: "Roblox", value: "/EclipseDev" },
      { label: "Discord", value: "eclipse.dev" },
      { label: "X", value: "@EclipseRBLX" },
      { label: "GitHub", value: "eclipsedevx" }
    ],
    latestProject: {
      name: "Treasure Quest",
      summary: "Systems architecture and save-data cleanup.",
      bullets: ["Scope explained", "Role credited", "Live work linked"]
    },
    feedback: {
      label: "Client feedback",
      note: "Structured notes can show how a teammate shipped, not fake public praise."
    },
    proofDetails: {
      verified: {
        title: "Verified profile",
        body:
          "Verified means Weld can explain what is confirmed, such as account ownership and linked work, without pretending demo data is live reputation."
      },
      projects: {
        title: "Linked work",
        body:
          "Project proof connects shipped work, role, scope, and links so studios can inspect fit before messaging."
      },
      reliability: {
        title: "Reliability notes",
        body:
          "Reliability is framed as inspectable context from completed work notes, not as a fake marketplace score."
      },
      latest: {
        title: "Latest project",
        body:
          "Latest project area gives one readable work sample with scope, links, and proof context at card speed."
      },
      feedback: {
        title: "Feedback details",
        body:
          "Feedback stays structured and honest. It should explain collaboration quality without made-up public praise."
      }
    },
    accent: "#5b6cff",
    soft: "#eef1ff"
  },
  builder: {
    role: "builder",
    label: "Roblox builder",
    name: "BlockCraft",
    handle: "@BlockCraftRBLX",
    headline: "Designs readable maps, social hubs, and optimized worlds studios can ship with.",
    availability: "Sprint lane open",
    rate: "$50/hr",
    payment: "Hourly or scoped build",
    matchScore: 88,
    years: "4+ yrs",
    projects: "World links",
    reliability: "Scope notes",
    services: ["Terrain", "Lighting", "Modular Builds", "Optimization", "Event Maps", "Social Hubs"],
    links: [
      { label: "Roblox", value: "/BlockCraft" },
      { label: "Discord", value: "blockcraft" },
      { label: "X", value: "@BlockCraftRBLX" },
      { label: "Portfolio", value: "world reel" }
    ],
    latestProject: {
      name: "Skyline Social Hub",
      summary: "Modular lobby, shop plaza, and event pathing.",
      bullets: ["Map capture", "Optimization notes", "Before and after"]
    },
    feedback: {
      label: "Build notes",
      note: "Teams can inspect scope, delivery quality, and style fit in one place."
    },
    proofDetails: {
      verified: {
        title: "Verified links",
        body:
          "Builder proof should show ownership or contribution through linked places, captures, and portfolio context."
      },
      projects: {
        title: "World proof",
        body:
          "World proof focuses on screenshots, optimization notes, and exact build scope instead of vague aesthetic claims."
      },
      reliability: {
        title: "Scope clarity",
        body:
          "Scope notes help studios understand what this builder actually handled before a call starts."
      },
      latest: {
        title: "Latest build",
        body:
          "One focused project keeps card fast to scan while still giving studios an honest path to inspect more."
      },
      feedback: {
        title: "Client notes",
        body:
          "Feedback details stay contextual and non-performative, with no made-up praise or brand borrowing."
      }
    },
    accent: "#1d9b74",
    soft: "#eefaf6"
  },
  ui: {
    role: "ui",
    label: "Roblox UI designer",
    name: "PixelUI",
    handle: "@PixelUIRBLX",
    headline: "Builds readable HUDs, shops, and onboarding flows that hold up in live games.",
    availability: "Open this week",
    rate: "$45/hr",
    payment: "Hourly or screen package",
    matchScore: 91,
    years: "3+ yrs",
    projects: "Screen links",
    reliability: "Handoff notes",
    services: ["HUD", "Shop UI", "Onboarding", "Figma", "Readability", "Economy Screens"],
    links: [
      { label: "Roblox", value: "/PixelUI" },
      { label: "Discord", value: "pixel.ui" },
      { label: "X", value: "@PixelUIRBLX" },
      { label: "Figma", value: "case study" }
    ],
    latestProject: {
      name: "Shop Refresh",
      summary: "HUD cleanup and store purchase flow redesign.",
      bullets: ["Before and after", "Screen states", "Handoff linked"]
    },
    feedback: {
      label: "Handoff feedback",
      note: "Studios can check how clean handoff is before starting conversation."
    },
    proofDetails: {
      verified: {
        title: "Verified UI work",
        body:
          "UI proof should show shipped screens, design files, and role context without burying team in tabs."
      },
      projects: {
        title: "Screen proof",
        body:
          "Project proof highlights finished screens, state coverage, and implementation context in one clean path."
      },
      reliability: {
        title: "Handoff quality",
        body:
          "Handoff notes explain whether assets, specs, and states are included before studio has to ask."
      },
      latest: {
        title: "Latest screen set",
        body:
          "Latest project module gives one concrete UI example at glance instead of a generic portfolio dump."
      },
      feedback: {
        title: "Feedback details",
        body:
          "Feedback remains inspectable and specific instead of becoming fake social proof."
      }
    },
    accent: "#4d6bff",
    soft: "#eef2ff"
  },
  vfx: {
    role: "vfx",
    label: "Roblox VFX artist",
    name: "RikuFX",
    handle: "@RikuFX",
    headline: "Creates readable hits, trails, bursts, and ability polish without muddy combat.",
    availability: "Slots open",
    rate: "$700/pack",
    payment: "Pack or milestone",
    matchScore: 86,
    years: "2+ yrs",
    projects: "Reel linked",
    reliability: "Pack scope",
    services: ["Particles", "Trails", "Combat FX", "Ability Bursts", "Hit Confirms", "Polish"],
    links: [
      { label: "Roblox", value: "/RikuFX" },
      { label: "Discord", value: "rikufx" },
      { label: "X", value: "@RikuFX" },
      { label: "Reel", value: "VFX pack" }
    ],
    latestProject: {
      name: "Spell Pack",
      summary: "Ability impact set with hit confirms and elemental trails.",
      bullets: ["Video reel", "Pack scope", "Style tags"]
    },
    feedback: {
      label: "Pack feedback",
      note: "Pack work can show scope, revisions, and final usage context."
    },
    proofDetails: {
      verified: {
        title: "Verified reel",
        body:
          "VFX proof should connect reel to actual usage, scope, and contribution notes."
      },
      projects: {
        title: "VFX proof",
        body:
          "Project card should explain pack, not only show flash. Studios need style and scope together."
      },
      reliability: {
        title: "Pack scope",
        body:
          "Scope clarity helps teams compare deliverables before messaging."
      },
      latest: {
        title: "Latest pack",
        body:
          "One featured pack keeps card readable while links carry deeper inspection."
      },
      feedback: {
        title: "Review notes",
        body:
          "Feedback stays contextual and honest, with no invented volume claims."
      }
    },
    accent: "#6578ff",
    soft: "#f2f4ff"
  },
  animator: {
    role: "animator",
    label: "Roblox animator",
    name: "Novea",
    handle: "@NoveaMotion",
    headline: "Ships combat timing, movement packs, emotes, and polish that feel game-ready.",
    availability: "Monthly slots",
    rate: "$900/pack",
    payment: "Per set",
    matchScore: 84,
    years: "3+ yrs",
    projects: "Reel linked",
    reliability: "Revision notes",
    services: ["Combat Rigs", "Movement", "Emotes", "Timing", "Blends", "Polish"],
    links: [
      { label: "Roblox", value: "/NoveaMotion" },
      { label: "Discord", value: "novea.motion" },
      { label: "X", value: "@NoveaMotion" },
      { label: "Reel", value: "motion reel" }
    ],
    latestProject: {
      name: "Movement Pack",
      summary: "Run, dash, idle, and combat transition set.",
      bullets: ["Clip reel", "Rig notes", "Pack list"]
    },
    feedback: {
      label: "Motion feedback",
      note: "Studios can review timing, style, and revision context before call."
    },
    proofDetails: {
      verified: {
        title: "Verified reel",
        body:
          "Animation proof should connect reel to rig details, shipped use, and exact scope."
      },
      projects: {
        title: "Animation proof",
        body:
          "Project proof highlights pack contents and where they were used, not vague style language."
      },
      reliability: {
        title: "Revision clarity",
        body:
          "Revision notes make collaboration expectations visible before first message."
      },
      latest: {
        title: "Latest motion work",
        body:
          "Latest project preview gives one practical example without flooding hero with clips."
      },
      feedback: {
        title: "Feedback context",
        body:
          "Feedback remains a structured field, not a wall of made-up praise."
      }
    },
    accent: "#7d66ff",
    soft: "#f4f0ff"
  },
  designer: {
    role: "designer",
    label: "Roblox game designer",
    name: "LoopLab",
    handle: "@LoopLabRBLX",
    headline: "Shapes loops, economies, progression, and balance with readable design logic.",
    availability: "Consult or sprint",
    rate: "Scoped",
    payment: "Project scope",
    matchScore: 87,
    years: "4+ yrs",
    projects: "Docs linked",
    reliability: "Scope notes",
    services: ["Core Loops", "Economy", "Progression", "Balancing", "Design Docs", "Retention"],
    links: [
      { label: "Roblox", value: "/LoopLab" },
      { label: "Discord", value: "loop.lab" },
      { label: "X", value: "@LoopLabRBLX" },
      { label: "Docs", value: "sample doc" }
    ],
    latestProject: {
      name: "Progression Tune",
      summary: "Economy pass, reward loop, and milestone pacing.",
      bullets: ["Design doc", "Scope summary", "Balance notes"]
    },
    feedback: {
      label: "Design feedback",
      note: "Teams can inspect design thinking, docs, and scope before a call."
    },
    proofDetails: {
      verified: {
        title: "Verified design proof",
        body:
          "Design proof can include docs, shipped systems, and contribution context without performance theatre."
      },
      projects: {
        title: "Design sample",
        body:
          "Card should surface one concrete sample instead of vague strategy language."
      },
      reliability: {
        title: "Scope clarity",
        body:
          "Scope notes help teams know what kind of design help is actually available."
      },
      latest: {
        title: "Latest design work",
        body:
          "Latest project details show practical thinking and deliverables in one quick read."
      },
      feedback: {
        title: "Review notes",
        body:
          "Feedback stays specific and grounded, with no inflated momentum or client logos."
      }
    },
    accent: "#5e73ff",
    soft: "#f0f3ff"
  },
  systems: {
    role: "systems",
    label: "Roblox systems developer",
    name: "Kaito",
    handle: "@KaitoSystems",
    headline: "Builds matchmaking, telemetry, live ops, and backend trust for scaling teams.",
    availability: "Reviewable",
    rate: "$80/hr",
    payment: "Hourly or sprint",
    matchScore: 89,
    years: "5+ yrs",
    projects: "Stack proof",
    reliability: "Live ops notes",
    services: ["Matchmaking", "Telemetry", "Backend", "Data Stores", "Live Ops", "Automation"],
    links: [
      { label: "Roblox", value: "/KaitoSystems" },
      { label: "Discord", value: "kaito.systems" },
      { label: "X", value: "@KaitoSystems" },
      { label: "GitHub", value: "kaitosystems" }
    ],
    latestProject: {
      name: "Match Stack",
      summary: "Queue logic, telemetry events, and live ops support.",
      bullets: ["Architecture notes", "Ops scope", "System links"]
    },
    feedback: {
      label: "Ops feedback",
      note: "Systems cards should make trust signals easy to inspect."
    },
    proofDetails: {
      verified: {
        title: "Verified systems proof",
        body:
          "Systems proof should show contribution context, stack notes, and linked work where appropriate."
      },
      projects: {
        title: "Architecture proof",
        body:
          "Card gives enough signal to start a serious technical conversation without acting like admin chrome."
      },
      reliability: {
        title: "Live ops notes",
        body:
          "Reliability is framed as inspectable context, not as a public marketplace score."
      },
      latest: {
        title: "Latest system",
        body:
          "Latest project highlights scope and responsibility so teams know what was actually owned."
      },
      feedback: {
        title: "Feedback details",
        body:
          "Feedback explains what real profile history will eventually show, without invention."
      }
    },
    accent: "#5570ff",
    soft: "#edf2ff"
  }
};

export function nextRole(role: RoleKey): RoleKey {
  const currentIndex = ROLE_ORDER.indexOf(role);
  return ROLE_ORDER[(currentIndex + 1) % ROLE_ORDER.length];
}

export interface RoleFraming {
  cardCta: string;
  latestProjectLabel: string;
  feedbackLabel: string;
}

export function getRoleFraming(profile: TalentProfile, mode: Audience): RoleFraming {
  if (mode === "studio") {
    return {
      cardCta: `Scout ${ROLE_LABELS[profile.role]} talent early`,
      latestProjectLabel: "Latest shipped project",
      feedbackLabel: profile.feedback.label
    };
  }
  return {
    cardCta: `Build my ${ROLE_LABELS[profile.role]} card`,
    latestProjectLabel: "Latest project",
    feedbackLabel: profile.feedback.label
  };
}
