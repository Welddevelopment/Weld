import type { Audience } from "@/dynamic landing page/lib/types";

export const AUDIENCE_COPY = {
  developer: {
    eyebrow: "Developer-first beta",
    cta: "Claim your beta invite",
    headerCta: "Claim your beta invite",
    hint: "Developer path is default. Studios can switch with the toggle above.",
    finalHint: "Developer path is default. You can switch to studio mode anytime.",
    heroContext: "Developer roster preview",
    laneState: "Developer lane",
    proofState: "Verifying link",
    matchState: "Compiling filters",
    finalState: "Standby",
    finalTitle: "Spark with studios.",
    finalCopy:
      "Join the waitlist, finish the short profile flow, and keep your invite active with referrals and profile completion.",
    microProof: ["Swipe. Spark. Ship.", "Free during beta", "Kickstart the movement"],
    studioBridgeButton: "Join studio beta",
    studioBridgeLink: "Get hiring access"
  },
  studio: {
    eyebrow: "Studio scout mode",
    cta: "Get hiring access",
    headerCta: "Get hiring access",
    hint: "Studio mode stays secondary, but the same invite flow works for hiring teams.",
    finalHint: "Studio mode uses the same invite loop with hiring-specific profile fields.",
    heroContext: "Studio scout preview",
    laneState: "Studio scout lane",
    proofState: "Scanning proof",
    matchState: "Filtering roster",
    finalState: "Scout ready",
    finalTitle: "Hire Roblox talent. No thread chaos.",
    finalCopy:
      "Join the studio beta to filter by role, rate, availability, and proof. No job ads. No Discord digging.",
    microProof: ["Studio scout mode", "Proof filters", "Invite-only beta"],
    studioBridgeButton: "Stay in studio mode",
    studioBridgeLink: "Join studio beta"
  }
} as const satisfies Record<Audience, Record<string, string | string[]>>;

export const SOURCE_VARIANTS = {
  default: {
    developer: {
      title: "Spark with\nstudios.",
      copy:
        "The talent network for Roblox. Link your games, set your rate, and match with studios that actually ship.",
      sourceLine: "Swipe. Spark. Ship. Free. Kickstart the movement."
    },
    studio: {
      title: "Hire Roblox talent.\nNo thread chaos.",
      copy:
        "Filter Roblox talent by role, rate, availability, and proof. No job ads. No Discord digging.",
      sourceLine: "Built for teams that want clean signal before the first DM."
    }
  },
  discord: {
    developer: {
      title: "Stop thread diving.\nGet found.",
      copy:
        "Weld turns your shipped work into a profile studios can trust instantly. No more proving yourself inside thread chaos.",
      sourceLine: "Discord source detected: compiling thread noise into proof-first discovery."
    },
    studio: {
      title: "Stop hiring in thread chaos.",
      copy:
        "Weld turns Discord scavenger hunts into clean Roblox talent filters with proof and availability already attached.",
      sourceLine: "Discord source detected: scout signal over thread noise."
    }
  },
  x: {
    developer: {
      title: "Ship work.\nGet pulled in.",
      copy:
        "Weld packages role, rate, proof, and availability so studios can pull you in from signal instead of cold outreach.",
      sourceLine: "X source detected: compact setup, clean proof, faster discovery."
    },
    studio: {
      title: "Move fast on hires.",
      copy:
        "Filter serious Roblox talent by role fit, proof, and availability, then reach out without the usual Discord guesswork.",
      sourceLine: "X source detected: scout fast, contact with context."
    }
  },
  linkedin: {
    developer: {
      title: "Proof first.\nThen opportunity.",
      copy:
        "Weld turns shipped Roblox work into a structured profile with rate clarity, availability, and proof built in for professional review.",
      sourceLine: "LinkedIn source detected: proof-first profile language enabled."
    },
    studio: {
      title: "Proof-first Roblox hiring.",
      copy:
        "Review Roblox talent by discipline, payment style, availability, and proof links in one compact scout workflow.",
      sourceLine: "LinkedIn source detected: professional scout mode enabled."
    }
  }
} as const;

export const HERO_PROFILES = [
  {
    handle: "xarion_dev",
    displayName: "Xarion",
    role: "Scripter",
    rate: "$65/hr",
    availability: "Available now",
    availabilityDetail: "20h/wk",
    shippedGames: 8,
    responseHours: 6,
    timezone: "GMT+1",
    payment: "Hourly or milestone",
    proofSummary: "Combat core plus economy rewrite shipped",
    proofLabel: "Combat core ship proof",
    shippedWork: "Arena combat loop, progression rewrite, admin tooling",
    referralTier: "Tier 3",
    skills: ["Luau", "DataStore", "Combat", "Tooling"],
    genres: ["RPG", "Arena", "Tycoon"]
  },
  {
    handle: "novea_motion",
    displayName: "Novea",
    role: "Animator",
    rate: "$900/pack",
    availability: "2 slots open",
    availabilityDetail: "Monthly pack lane",
    shippedGames: 5,
    responseHours: 12,
    timezone: "EST",
    payment: "Per pack",
    proofSummary: "Twelve combat sets live in top battlers",
    proofLabel: "Combat pack reel",
    shippedWork: "Combat sets, emotes, movement polish, timing passes",
    referralTier: "Tier 2",
    skills: ["Moon Animator", "Combat rigs", "Blends", "Polish"],
    genres: ["Combat", "PvP", "UGC"]
  },
  {
    handle: "kaito_systems",
    displayName: "Kaito",
    role: "Full-stack / systems dev",
    rate: "$80/hr",
    availability: "Sprint ready",
    availabilityDetail: "15h/wk",
    shippedGames: 11,
    responseHours: 4,
    timezone: "PST",
    payment: "Hourly",
    proofSummary: "Matchmaking plus telemetry stack in production",
    proofLabel: "Systems proof stack",
    shippedWork: "Matchmaking, analytics, CI, live ops support",
    referralTier: "Tier 4",
    skills: ["Backend", "Matchmaking", "CI", "Analytics"],
    genres: ["Live ops", "Session", "Competitive"]
  }
];

export const ROLE_PREVIEWS = {
  scripter: {
    label: "weld.preview -- scripter_loadout",
    title: "Scripter loadout",
    summary: "Combat and systems signal, packaged so a studio can verify shipped work in one pass.",
    fields: [
      ["Role", "Scripter (gameplay + systems)"],
      ["Proof signal", "Roblox game link + shipped mechanic summary"],
      ["Rate style", "$55 - $90/hr or milestone"],
      ["Availability", "Part-time or sprint"],
      ["Shipped work", "Combat loops, persistence, admin tooling"],
      ["Response window", "Replies within eight hours"]
    ],
    tags: ["Luau", "Combat", "Systems", "Live ops"],
    filters: ["Role: Scripter", "Rate: Hourly", "Availability: Sprint", "Proof: Roblox link"],
    foot: "Studios can scan the proof link, role, and payment style before they send the first message."
  },
  ui: {
    label: "weld.preview -- ui_loadout",
    title: "UI loadout",
    summary: "Retention-sensitive UI proof with shipped screens, handoff quality, and style fit in one card.",
    fields: [
      ["Role", "UI / UX"],
      ["Proof signal", "Live HUD and shop before/after frames"],
      ["Rate style", "$40/hr or milestone"],
      ["Availability", "18h/week"],
      ["Shipped work", "HUD revamp, onboarding, shop conversion"],
      ["Response window", "Replies same day"]
    ],
    tags: ["Figma", "HUD", "Economy", "Readability"],
    filters: ["Role: UI", "Rate: Milestone", "Availability: Weekly", "Proof: Design file"],
    foot: "The preview keeps real scouting filters visible instead of dumping people into a gallery."
  },
  vfx: {
    label: "weld.preview -- vfx_loadout",
    title: "VFX loadout",
    summary: "Impact-heavy polish proof with combat readability, pack scope, and style fit already structured.",
    fields: [
      ["Role", "VFX"],
      ["Proof signal", "Combat reel + shipped title references"],
      ["Rate style", "$700 per pack"],
      ["Availability", "Three active slots"],
      ["Shipped work", "Hit confirms, trails, spell bursts"],
      ["Response window", "Replies within one day"]
    ],
    tags: ["Combat FX", "Readability", "Polish", "Particles"],
    filters: ["Role: VFX", "Rate: Package", "Availability: Slots", "Proof: Reel"],
    foot: "Weld makes VFX proof easy to scan without pretending it is a marketplace ranking."
  },
  builder: {
    label: "weld.preview -- builder_loadout",
    title: "Builder loadout",
    summary: "Environment signal focused on shipped spaces, optimization, and art direction fit.",
    fields: [
      ["Role", "Builder / environment"],
      ["Proof signal", "Live map capture + modular breakdown"],
      ["Rate style", "$50/hr"],
      ["Availability", "Weekday lane"],
      ["Shipped work", "Event maps, social hubs, traversal spaces"],
      ["Response window", "Replies in under 10 hours"]
    ],
    tags: ["Modular", "Optimization", "Stylized", "Lighting"],
    filters: ["Role: Builder", "Rate: Hourly", "Availability: Weekly", "Proof: World capture"],
    foot: "Role loadouts are meant to feel native to Roblox production teams, not generic SaaS tabs."
  },
  animator: {
    label: "weld.preview -- animator_loadout",
    title: "Animator loadout",
    summary: "Animation proof surfaces timing, pack scope, combat relevance, and slot availability immediately.",
    fields: [
      ["Role", "Animator"],
      ["Proof signal", "Combat reel + shipped movement pack"],
      ["Rate style", "$900 per set"],
      ["Availability", "Two slots this month"],
      ["Shipped work", "Movement, combat, emotes, polish"],
      ["Response window", "Replies in twelve hours"]
    ],
    tags: ["Combat rigs", "Timing", "Movement", "Polish"],
    filters: ["Role: Animator", "Rate: Package", "Availability: Monthly", "Proof: Reel"],
    foot: "Selected chips slot into the preview so studios see both craft and availability at once."
  },
  designer: {
    label: "weld.preview -- designer_loadout",
    title: "Designer loadout",
    summary: "Game design proof stays concrete: docs, progression thinking, economy balance, and scope fit.",
    fields: [
      ["Role", "Designer"],
      ["Proof signal", "Progression doc + live economy tune notes"],
      ["Rate style", "Project scope"],
      ["Availability", "Consult or sprint"],
      ["Shipped work", "Economy rebalance, loops, retention tuning"],
      ["Response window", "Replies same day"]
    ],
    tags: ["Progression", "Balance", "Economy", "Core loop"],
    filters: ["Role: Designer", "Rate: Scope", "Availability: Sprint", "Proof: Design doc"],
    foot: "Proof-first design loadouts prevent vague 'designer wanted' threads from staying vague."
  },
  systems: {
    label: "weld.preview -- systems_loadout",
    title: "Systems loadout",
    summary: "Systems proof emphasizes backend trust, live ops readiness, and response speed for serious teams.",
    fields: [
      ["Role", "Systems"],
      ["Proof signal", "Matchmaking, telemetry, backend support links"],
      ["Rate style", "$70 - $95/hr"],
      ["Availability", "Sprint or ongoing support"],
      ["Shipped work", "Telemetry, matchmaking, automation, CI"],
      ["Response window", "Replies within four hours"]
    ],
    tags: ["Backend", "CI", "Telemetry", "Live ops"],
    filters: ["Role: Systems", "Rate: Hourly", "Availability: Ongoing", "Proof: Stack link"],
    foot: "The systems preview keeps the scouting context visible so the product reads like a command center."
  }
};

export const ROLE_CHIPS = [
  ["scripter", "Scripter"],
  ["ui", "UI"],
  ["vfx", "VFX"],
  ["builder", "Builder"],
  ["animator", "Animator"],
  ["designer", "Designer"],
  ["systems", "Systems"]
] as const;

export const COMPILER_FIELDS = [
  ["Role", "Scripter (combat + systems)"],
  ["Rate", "$65/hr or milestone"],
  ["Availability", "20h/wk, sprint ready"],
  ["Shipped work", "Three live Roblox titles with proof links"],
  ["Proof link", "Combat core plus economy rewrite verified"],
  ["Response window", "Replies in under eight hours"]
];

export const COMMAND_STEPS = [
  {
    code: "weld auth roblox --proof",
    outputs: [
      ["Status", "Proof lane armed"],
      ["Result", "One verifiable link attached"],
      ["State", "Verified profile signal ready"]
    ]
  },
  {
    code: "weld profile set --role --rate --availability",
    outputs: [
      ["Role", "Role loadout saved"],
      ["Rate", "Budget style clear"],
      ["Fit", "Availability compiled"]
    ]
  },
  {
    code: "weld discover --match studios",
    outputs: [
      ["Match", "Studio filters compiled"],
      ["Contact", "Inbound reaches out with context"],
      ["Queue", "Invite loop stays active"]
    ]
  }
];

export const REFERRAL_REWARDS = [
  { count: 1, title: "1 referral", detail: "Early profile review notes." },
  { count: 2, title: "2 referrals", detail: "Priority queue bump." },
  { count: 3, title: "3 referrals", detail: "First-wave consideration." },
  { count: 4, title: "4 referrals", detail: "Founder badge review lane." },
  { count: 5, title: "5 referrals", detail: "Studio preview access." }
];

export const FOUNDING_FACTS = [
  {
    label: "Exists now",
    body: "Landing page, invite capture, referral tracking, audience memory, and profile-step saving are real today."
  },
  {
    label: "Beta includes",
    body: "Trust-verified profile setup, discovery-ready proof structure, studio scout lane, and a personal invite progress loop."
  },
  {
    label: "Comes later",
    body: "Richer roster search, deeper matching, and more collaboration signal. Not fake logos. Not invented activity."
  }
];

export const FAQ_ITEMS = [
  {
    question: "Is Weld free during beta?",
    answer: "Yes. Weld is free during beta for both developers and studios."
  },
  {
    question: "What does beta actually include?",
    answer:
      "Right now the beta is about profile proof, invite progress, referral tracking, and a cleaner discovery lane. It is not pretending to be a full public marketplace yet."
  },
  {
    question: "Do studios see my email?",
    answer:
      "No. Email is used for invite and beta communication. Discovery is based on profile-level signal rather than exposing direct email by default."
  },
  {
    question: "What if I have only one strong proof link?",
    answer:
      "That is enough to start. Weld is designed to make one clear proof signal more useful than a long thread of vague claims."
  },
  {
    question: "Is studio mode live too?",
    answer:
      "Yes, but it stays compact and secondary on the homepage. The product remains developer-first by default."
  }
];

export const TYPE_COPY = {
  developer: {
    entryEyebrow: "Developer invite",
    entryTitle: "Unlock your invite state.",
    entryCopy: "Enter your email to unlock your queue, referral progress, and role loadout.",
    winCopy: "You are in. Your Weld beta invite is active.",
    audiencePill: "Developer lane",
    profileCopy: "Build your role loadout. Each field improves matching signal.",
    identityCopy: "Name and discipline tell studios what to scan first.",
    proofCopy: "One proof link beats a paragraph of vague claims.",
    fitCopy: "Availability and rate style keep outreach honest.",
    shareCopy:
      "Channel-specific copy is ready immediately so you do not have to draft your ask from scratch."
  },
  studio: {
    entryEyebrow: "Studio invite",
    entryTitle: "Unlock studio invite state.",
    entryCopy: "Enter your email to unlock your queue, referral progress, and scout setup.",
    winCopy: "You are in. Your Weld studio beta invite is active.",
    audiencePill: "Studio lane",
    profileCopy: "Build your scout loadout. Each field sharpens your hiring signal.",
    identityCopy: "A clear studio identity helps creators trust the inbound opportunity.",
    proofCopy: "Open roles and team shape make the scout view more useful immediately.",
    fitCopy: "Budget style and timeline keep hiring conversations grounded.",
    shareCopy:
      "Studio share copy is ready for Discord, X, and LinkedIn without manual rewriting."
  }
} as const satisfies Record<Audience, Record<string, string>>;

export const SOURCE_LINES = {
  default: {
    developer:
      "Invite state tracks real actions: profile completion, referrals, and next unlock.",
    studio:
      "Invite state tracks real actions: scout completion, referrals, and next unlock."
  },
  discord: {
    developer:
      "Discord source detected: this flow replaces thread noise with proof-first signal.",
    studio: "Discord source detected: this flow removes hiring-thread chaos."
  },
  x: {
    developer:
      "X source detected: move fast, ship profile, share link, unlock faster review.",
    studio: "X source detected: fast scout setup, clear role filters, direct outreach."
  },
  linkedin: {
    developer: "LinkedIn source detected: proof-first creator language enabled.",
    studio: "LinkedIn source detected: proof-first studio language enabled."
  }
} as const;

export const DISCIPLINE_OPTIONS = [
  "Scripter",
  "UI",
  "VFX",
  "Builder",
  "Animator",
  "Designer",
  "Systems"
];
