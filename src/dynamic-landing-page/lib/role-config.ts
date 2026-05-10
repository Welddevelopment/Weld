import type { Audience } from "./types";

export type RoleKey =
  | "scripting"
  | "ui"
  | "graphics"
  | "art2d"
  | "building"
  | "vfx"
  | "animation"
  | "modeling3d"
  | "gamedesign"
  | "sounddesign"
  | "sfx";

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
  "scripting",
  "ui",
  "graphics",
  "art2d",
  "building",
  "vfx",
  "animation",
  "modeling3d",
  "gamedesign",
  "sounddesign",
  "sfx"
];

export const ROLE_LABELS: Record<RoleKey, string> = {
  scripting:   "Scripting",
  ui:          "UI Design",
  graphics:    "Graphics",
  art2d:       "2D Art",
  building:    "Building",
  vfx:         "VFX",
  animation:   "Animation",
  modeling3d:  "3D Modeling",
  gamedesign:  "Game Design",
  sounddesign: "Sound Design",
  sfx:         "SFX",
};

export const PROFILES: Record<RoleKey, TalentProfile> = {
  scripting: {
    role: "scripting",
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
    feedback: { label: "Client feedback", note: "Structured notes can show how a teammate shipped." },
    proofDetails: {
      verified:    { title: "Verified profile",   body: "Account ownership and linked work confirmed." },
      projects:    { title: "Linked work",         body: "Shipped work, role, scope, and links." },
      reliability: { title: "Reliability notes",   body: "Inspectable context from completed work notes." },
      latest:      { title: "Latest project",      body: "One readable work sample with scope and proof." },
      feedback:    { title: "Feedback details",    body: "Structured and honest collaboration context." }
    },
    accent: "#5b6cff",
    soft: "#eef1ff"
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
    feedback: { label: "Handoff feedback", note: "Studios can check how clean handoff is before starting." },
    proofDetails: {
      verified:    { title: "Verified UI work",    body: "Shipped screens, design files, and role context." },
      projects:    { title: "Screen proof",        body: "Finished screens, state coverage, and implementation." },
      reliability: { title: "Handoff quality",     body: "Assets, specs, and states documented upfront." },
      latest:      { title: "Latest screen set",   body: "One concrete UI example at a glance." },
      feedback:    { title: "Feedback details",    body: "Inspectable and specific, not invented social proof." }
    },
    accent: "#4d6bff",
    soft: "#eef2ff"
  },
  graphics: {
    role: "graphics",
    label: "Roblox graphic artist",
    name: "FrameWork",
    handle: "@FrameWorkRBLX",
    headline: "Creates eye-catching thumbnails, store art, and marketing visuals that drive clicks.",
    availability: "Taking commissions",
    rate: "$120/thumbnail",
    payment: "Per asset or batch",
    matchScore: 88,
    years: "2+ yrs",
    projects: "Portfolio linked",
    reliability: "Turnaround notes",
    services: ["Thumbnails", "Store Art", "GFX", "Marketing", "Banners", "Icon Design"],
    links: [
      { label: "Roblox", value: "/FrameWorkGFX" },
      { label: "Discord", value: "framework.gfx" },
      { label: "X", value: "@FrameWorkRBLX" },
      { label: "Portfolio", value: "portfolio" }
    ],
    latestProject: {
      name: "Thumbnail Batch",
      summary: "12-thumbnail series for a simulator launch.",
      bullets: ["Before CTR", "After CTR", "Style brief"]
    },
    feedback: { label: "Client feedback", note: "Turnaround, revisions, and click-rate results visible." },
    proofDetails: {
      verified:    { title: "Verified GFX work",   body: "Portfolio and shipped thumbnails with CTR context." },
      projects:    { title: "GFX proof",           body: "Each asset linked to live usage and style notes." },
      reliability: { title: "Turnaround clarity",  body: "Delivery windows and revision count documented." },
      latest:      { title: "Latest batch",        body: "One recent series with results and brief summary." },
      feedback:    { title: "Feedback context",    body: "Structured notes on delivery and style alignment." }
    },
    accent: "#e05aff",
    soft: "#faf0ff"
  },
  art2d: {
    role: "art2d",
    label: "Roblox 2D artist",
    name: "Inkwell",
    handle: "@InkwellArt",
    headline: "Illustrates characters, items, and concept art that give games a distinctive visual identity.",
    availability: "Slots open",
    rate: "$55/hr",
    payment: "Hourly or per piece",
    matchScore: 85,
    years: "3+ yrs",
    projects: "Art linked",
    reliability: "Brief notes",
    services: ["Character Art", "Concept Art", "Item Icons", "Splash Art", "UI Illustration", "Emotes"],
    links: [
      { label: "Roblox", value: "/InkwellArt" },
      { label: "Discord", value: "inkwell.art" },
      { label: "X", value: "@InkwellArt" },
      { label: "Portfolio", value: "artstation" }
    ],
    latestProject: {
      name: "Character Sheet Pack",
      summary: "Full character lineup with expressions and outfit variants.",
      bullets: ["Sheet linked", "Turnaround", "Style guide"]
    },
    feedback: { label: "Art feedback", note: "Style alignment, revision history, and final usage noted." },
    proofDetails: {
      verified:    { title: "Verified art",        body: "Portfolio and shipped art with usage context." },
      projects:    { title: "Art proof",           body: "Character sheets, icons, and concept usage." },
      reliability: { title: "Brief quality",       body: "How well this artist interprets a brief." },
      latest:      { title: "Latest piece",        body: "One recent work sample with scope summary." },
      feedback:    { title: "Review notes",        body: "Honest context on style fit and delivery." }
    },
    accent: "#ff5a8a",
    soft: "#fff0f5"
  },
  building: {
    role: "building",
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
    feedback: { label: "Build notes", note: "Teams can inspect scope, delivery quality, and style fit." },
    proofDetails: {
      verified:    { title: "Verified links",      body: "Ownership or contribution through linked places." },
      projects:    { title: "World proof",         body: "Screenshots, optimization notes, and exact scope." },
      reliability: { title: "Scope clarity",       body: "Notes on what this builder actually handled." },
      latest:      { title: "Latest build",        body: "One focused project with proof path." },
      feedback:    { title: "Client notes",        body: "Contextual, non-performative feedback." }
    },
    accent: "#1d9b74",
    soft: "#eefaf6"
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
    feedback: { label: "Pack feedback", note: "Pack work showing scope, revisions, and final usage." },
    proofDetails: {
      verified:    { title: "Verified reel",       body: "Reel connected to actual usage, scope, and contribution." },
      projects:    { title: "VFX proof",           body: "Pack, not just flash — style and scope together." },
      reliability: { title: "Pack scope",          body: "Scope clarity helps teams compare deliverables." },
      latest:      { title: "Latest pack",         body: "One featured pack with links for deeper inspection." },
      feedback:    { title: "Review notes",        body: "Contextual and honest, no invented volume claims." }
    },
    accent: "#6578ff",
    soft: "#f2f4ff"
  },
  animation: {
    role: "animation",
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
    feedback: { label: "Motion feedback", note: "Timing, style, and revision context before call." },
    proofDetails: {
      verified:    { title: "Verified reel",       body: "Reel connected to rig details, usage, and scope." },
      projects:    { title: "Animation proof",     body: "Pack contents and where they were used." },
      reliability: { title: "Revision clarity",    body: "Collaboration expectations visible before first message." },
      latest:      { title: "Latest motion work",  body: "One practical example without flooding the card." },
      feedback:    { title: "Feedback context",    body: "Structured field, not a wall of praise." }
    },
    accent: "#7d66ff",
    soft: "#f4f0ff"
  },
  modeling3d: {
    role: "modeling3d",
    label: "Roblox 3D modeler",
    name: "MeshForge",
    handle: "@MeshForgeRBLX",
    headline: "Models characters, environments, and props optimised for Roblox's constraints.",
    availability: "Taking work",
    rate: "$60/hr",
    payment: "Hourly or per asset",
    matchScore: 83,
    years: "3+ yrs",
    projects: "Model links",
    reliability: "Poly notes",
    services: ["Character Models", "Prop Modeling", "Environment Assets", "LODs", "Rigging", "UVs"],
    links: [
      { label: "Roblox", value: "/MeshForge" },
      { label: "Discord", value: "mesh.forge" },
      { label: "X", value: "@MeshForgeRBLX" },
      { label: "Portfolio", value: "sketchfab" }
    ],
    latestProject: {
      name: "Character Pack",
      summary: "6-character lineup with LODs and weapon attachment rigs.",
      bullets: ["Poly counts", "Rig notes", "Live game link"]
    },
    feedback: { label: "Build feedback", note: "Poly budget, style fit, and delivery notes available." },
    proofDetails: {
      verified:    { title: "Verified models",     body: "Portfolio connected to live game usage." },
      projects:    { title: "Model proof",         body: "Poly counts, rig setup, and scope clarity." },
      reliability: { title: "Delivery notes",      body: "Timeline and revision expectations explained." },
      latest:      { title: "Latest asset pack",   body: "One concrete deliverable with full context." },
      feedback:    { title: "Review notes",        body: "Structured context on fit and delivery quality." }
    },
    accent: "#f59e0b",
    soft: "#fffbeb"
  },
  gamedesign: {
    role: "gamedesign",
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
    feedback: { label: "Design feedback", note: "Design thinking, docs, and scope inspectable before a call." },
    proofDetails: {
      verified:    { title: "Verified design proof", body: "Docs, shipped systems, and contribution context." },
      projects:    { title: "Design sample",       body: "One concrete sample over vague strategy language." },
      reliability: { title: "Scope clarity",       body: "Notes on what kind of design help is available." },
      latest:      { title: "Latest design work",  body: "Practical thinking and deliverables in one read." },
      feedback:    { title: "Review notes",        body: "Specific and grounded, no inflated momentum." }
    },
    accent: "#5e73ff",
    soft: "#f0f3ff"
  },
  sounddesign: {
    role: "sounddesign",
    label: "Roblox sound designer",
    name: "WaveSet",
    handle: "@WaveSetAudio",
    headline: "Crafts atmospheric soundscapes, ambient audio, and music that make worlds feel alive.",
    availability: "Open to contracts",
    rate: "$50/hr",
    payment: "Hourly or per track",
    matchScore: 82,
    years: "2+ yrs",
    projects: "Audio linked",
    reliability: "Revision notes",
    services: ["Ambient Audio", "Music Composition", "Loops", "Soundscapes", "Audio Direction", "Mixing"],
    links: [
      { label: "Roblox", value: "/WaveSetAudio" },
      { label: "Discord", value: "waveset.audio" },
      { label: "X", value: "@WaveSetAudio" },
      { label: "SoundCloud", value: "portfolio" }
    ],
    latestProject: {
      name: "Ambient Pack",
      summary: "4 biome soundscapes with day/night variants.",
      bullets: ["Audio demo", "Loop notes", "Game link"]
    },
    feedback: { label: "Audio feedback", note: "Style fit, file formats, and revision context available." },
    proofDetails: {
      verified:    { title: "Verified audio work", body: "Linked audio with game usage context." },
      projects:    { title: "Audio proof",         body: "Demo clips, scope, and integration notes." },
      reliability: { title: "Delivery clarity",    body: "Format, revision, and timeline expectations." },
      latest:      { title: "Latest audio work",   body: "One concrete pack with listening links." },
      feedback:    { title: "Review notes",        body: "Style and delivery feedback from past work." }
    },
    accent: "#0ea5e9",
    soft: "#f0faff"
  },
  sfx: {
    role: "sfx",
    label: "Roblox SFX artist",
    name: "PulseKit",
    handle: "@PulseKitSFX",
    headline: "Designs punchy ability sounds, UI clicks, hit confirms, and combat audio feedback.",
    availability: "Taking packs",
    rate: "$600/pack",
    payment: "Per pack or flat",
    matchScore: 80,
    years: "2+ yrs",
    projects: "SFX demo linked",
    reliability: "Pack notes",
    services: ["Combat SFX", "Ability Sounds", "UI Audio", "Hit Confirms", "Foley", "Polish"],
    links: [
      { label: "Roblox", value: "/PulseKitSFX" },
      { label: "Discord", value: "pulsekit.sfx" },
      { label: "X", value: "@PulseKitSFX" },
      { label: "Demo", value: "audio reel" }
    ],
    latestProject: {
      name: "Combat SFX Pack",
      summary: "32-sound combat pack with ability cues and hit confirms.",
      bullets: ["Audio demo", "Pack manifest", "Game link"]
    },
    feedback: { label: "Pack feedback", note: "Pack contents, style fit, and usage context noted." },
    proofDetails: {
      verified:    { title: "Verified SFX work",   body: "Demo reel connected to shipped game usage." },
      projects:    { title: "SFX proof",           body: "Pack manifest, demo clips, and integration scope." },
      reliability: { title: "Pack scope",          body: "Deliverable count and revision terms documented." },
      latest:      { title: "Latest pack",         body: "One featured pack with demo and manifest." },
      feedback:    { title: "Review notes",        body: "Style fit and delivery from past clients." }
    },
    accent: "#10b981",
    soft: "#ecfdf5"
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
