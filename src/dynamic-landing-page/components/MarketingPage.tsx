"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
  type ReactNode,
  type Ref
} from "react";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform
} from "motion/react";

import {
  captureAttributionFromLocation,
  persistAudiencePreference,
  trackEvent
} from "@/dynamic-landing-page/lib/browser";
import type { SourceVariant } from "@/dynamic-landing-page/lib/source-variant";
import type { Audience } from "@/dynamic-landing-page/lib/types";
import { useMotionPolicy } from "@/dynamic-landing-page/lib/useMotionPolicy";
import { getLandingCopy, type HowItWorksIcon, type LandingCopy } from "@/dynamic-landing-page/lib/copy";
import {
  PROFILES,
  ROLE_CATEGORY_GROUPS,
  ROLE_DEMAND,
  ROLE_LABELS,
  type RoleCategoryId,
  type RoleKey,
  roleDemandSum,
  type TalentProfile
} from "@/dynamic-landing-page/lib/role-config";
import {
  LANDING_ACTIVITY_FEED,
  LANDING_DAY_ONE_TILES,
  LANDING_QUOTE,
  LANDING_TALLY
} from "@/dynamic-landing-page/lib/landing-blocks";
import {
  IconArrowLeft,
  IconArrowUpRight,
  IconCheck,
  IconChevronDown,
  IconClock,
  IconCode,
  IconDiscord,
  IconFolder,
  IconGithub,
  IconLinkedIn,
  IconPaperclip,
  IconRoblox,
  IconSend,
  IconShield,
  IconSmile,
  IconUser
} from "@/dynamic-landing-page/icons";
import HeroShaderBackground from "@/dynamic-landing-page/components/HeroShaderBackground";
import { PaperTexture } from "@paper-design/shaders-react";
import "@/dynamic-landing-page/styles/landing.css";
import { MARQUEE_PROFILES } from "@/data/marqueeProfiles";
import { MARQUEE_STUDIOS } from "@/data/marqueeStudios";
import ComparisonSection from "@/dynamic-landing-page/components/ComparisonSection";
import SwipeCard from "@/components/matching-preview/SwipeCard";
import StudioCard from "@/components/matching-preview/StudioCard";

const SwipeCardModal = dynamic(() => import("@/components/matching-preview/SwipeCard"), { ssr: false });

interface MarketingPageProps {
  initialMode: Audience;
  sourceVariant: SourceVariant;
  page: "landing" | "studios";
}

type CapturePhase = "idle" | "submitting" | "success" | "error";
type HiringAnim = "idle" | "spark" | "skip";

const WAITLIST_URL = "https://weldroblox.com";

const HIRING_PANELS: Record<RoleKey, Array<{
  studio: string;
  credibility: string;
  roleTitle: string;
  roleCategory: string;
  roleChip: string;
  chipBg: string;
  chipColor: string;
  whatLookingFor: string;
  payType: string;
  payRange: string;
  roleDescription: string;
}>> = {
  scripting: [
    {
      studio: "Eclipse Studios",
      credibility: "12 shipped · 4M plays/mo",
      roleTitle: "Lead scripter",
      roleCategory: "Scripting",
      roleChip: "Sc",
      chipBg: "#dcfce7", chipColor: "#15803d",
      whatLookingFor: "Looking for an experienced lead scripter to lead a team of multiple scripters. Needs to be confident in independently developing code for combat systems. Experience building anime RP games is preferred but not required — make sure to let us know what your role was at studios you've previously worked for. We're open to both a seasoned lead or a talented junior who's ready to step up.",
      payType: "Hourly (USD)",
      payRange: "$25 – $60",
      roleDescription: "You will lead a team of 3–5 scripters and help us build at an insanely fast rate. Pay will depend heavily on results — we reward hard work. The game is in a very early stage and you will be responsible for overseeing much of its development."
    },
    {
      studio: "Zenith Games",
      credibility: "8 shipped · 2.1M plays/mo",
      roleTitle: "Anti-cheat developer",
      roleCategory: "Scripting",
      roleChip: "Sc",
      chipBg: "#dcfce7", chipColor: "#15803d",
      whatLookingFor: "Looking for a developer with hands-on experience implementing server-side validation and anti-cheat systems. Must have shipped at least one FPS or competitive title. Show us a specific example of an exploit you caught and patched — we want to see your approach, not just your resume.",
      payType: "Hourly (USD)",
      payRange: "$70 – $90",
      roleDescription: "Retrofit our existing FPS title with server-side hit validation and basic anti-cheat logic. You'll be working solo on a well-documented codebase with full repository access. Ongoing retainer available after the initial scope is complete."
    },
    {
      studio: "Phantom Works",
      credibility: "5 shipped · 900k plays/mo",
      roleTitle: "Backend engineer",
      roleCategory: "Scripting",
      roleChip: "Sc",
      chipBg: "#dcfce7", chipColor: "#15803d",
      whatLookingFor: "We need an experienced backend engineer to overhaul our DataStore layer across four data profiles. Must be comfortable with OOP Lua, profile migration, and live-ops tooling. RPG systems experience is a strong plus. Please link previous DataStore or backend work.",
      payType: "Milestone (USD)",
      payRange: "$8,000 flat",
      roleDescription: "Full DataStore rewrite plus live-ops dashboards for our content team. Well-documented existing codebase. Delivered across three milestones with clear gate criteria. Timeline is flexible for the right person."
    }
  ],
  ui: [
    {
      studio: "Eclipse Studios",
      credibility: "12 shipped · 4M plays/mo",
      roleTitle: "HUD designer",
      roleCategory: "UI Design",
      roleChip: "UI",
      chipBg: "#fce7f3", chipColor: "#be185d",
      whatLookingFor: "Looking for a UI designer who can redesign our combat HUD from scratch. Must have experience with health bars, ability cooldown indicators, and minimaps. Figma specs and brand kit will be provided. Show us shipped HUD work — we want to see real in-game screens, not mockups.",
      payType: "Milestone (USD)",
      payRange: "$55 – $70 / hr",
      roleDescription: "Redesign the full combat HUD covering health, abilities, minimap, and death screen. Implementation support required. Figma handoff to our lead scripter at completion. 6-week contract with potential extension."
    },
    {
      studio: "Cascade Labs",
      credibility: "3 shipped · 400k plays/mo",
      roleTitle: "Onboarding UI designer",
      roleCategory: "UI Design",
      roleChip: "UI",
      chipBg: "#fce7f3", chipColor: "#be185d",
      whatLookingFor: "We're looking for a UI designer to own the new player tutorial experience. Must understand mobile constraints and low-friction onboarding principles. Brand kit and UX brief are ready. Experience shipping onboarding flows in live Roblox games is essential.",
      payType: "Flat (USD)",
      payRange: "$3,500",
      roleDescription: "Design the full new player tutorial UI — welcome screen, objective cards, reward pop-ups, and exit flow. Mobile-first. Two rounds of revisions included. Handoff to our scripter at completion."
    },
    {
      studio: "Zenith Games",
      credibility: "8 shipped · 2.1M plays/mo",
      roleTitle: "Shop interface designer",
      roleCategory: "UI Design",
      roleChip: "UI",
      chipBg: "#fce7f3", chipColor: "#be185d",
      whatLookingFor: "Looking for a UI designer to design and build our in-game shop. High traffic — this screen needs to convert. Must have shipped shop or monetisation UI before. Cart flow, bundle cards, promotional banners, and limited-time offer states all required.",
      payType: "Hourly (USD)",
      payRange: "$55 – $70",
      roleDescription: "Design and implement the full in-game shop: item grid, cart, bundle detail, purchase confirmation, and promo banner states. Work directly with our lead scripter for implementation. Ongoing engagement after initial scope."
    }
  ],
  graphics: [
    {
      studio: "NovaBuild Co.",
      credibility: "15 shipped · 6M plays/mo",
      roleTitle: "Thumbnail artist",
      roleCategory: "Graphics",
      roleChip: "Gr",
      chipBg: "#f3e8ff", chipColor: "#7e22ce",
      whatLookingFor: "We need a thumbnail artist who consistently produces click-worthy results. Must have a portfolio showing Roblox thumbnails with visible CTR improvement data. Our current thumbnail CTR is 4.2% — we want to break 7%. Show us your approach, not just your art.",
      payType: "Per thumbnail (USD)",
      payRange: "$80 – $150",
      roleDescription: "Produce thumbnails for our main game and seasonal update campaigns. Brief and character assets provided for each commission. Fast turnaround expected — typically 2–3 days per thumbnail. Ongoing relationship for the right artist."
    },
    {
      studio: "Phantom Works",
      credibility: "5 shipped · 900k plays/mo",
      roleTitle: "Marketing graphic designer",
      roleCategory: "Graphics",
      roleChip: "Gr",
      chipBg: "#f3e8ff", chipColor: "#7e22ce",
      whatLookingFor: "Looking for a graphic designer to own our visual marketing presence — social posts, Discord banners, game store art, and seasonal campaigns. Must understand Roblox's aesthetic and player base. Show us social content you've made that drove real engagement.",
      payType: "Flat (USD)",
      payRange: "$2,000",
      roleDescription: "Four-week contract covering rebranded store art, a launch-week social kit (8 posts), and Discord server graphics. Brand guidelines provided. Future retainer arrangement on the table after delivery."
    },
    {
      studio: "Orbit Interactive",
      credibility: "6 shipped · 1.5M plays/mo",
      roleTitle: "UI graphic asset artist",
      roleCategory: "Graphics",
      roleChip: "Gr",
      chipBg: "#f3e8ff", chipColor: "#7e22ce",
      whatLookingFor: "We need a graphic artist to produce UI-ready assets for our RPG — icons, frames, borders, and decorative elements that match our existing visual style. Must be able to work from a style guide and deliver layered files. Roblox UI integration experience preferred.",
      payType: "Hourly (USD)",
      payRange: "$40 – $55",
      roleDescription: "Produce a full icon set (60+ items), UI frame templates, and decorative borders for our RPG interface. Style guide and reference assets provided. Layered PSDs required at delivery. Ongoing batches available."
    }
  ],
  art2d: [
    {
      studio: "Cascade Labs",
      credibility: "3 shipped · 400k plays/mo",
      roleTitle: "Character concept artist",
      roleCategory: "2D Art",
      roleChip: "2D",
      chipBg: "#ffe4e6", chipColor: "#be123c",
      whatLookingFor: "Looking for a 2D character concept artist who can define the visual style for our new title. Must be comfortable with anime-adjacent aesthetics. We'll provide lore and personality briefs for each character — you bring them to life. Show us a range of character styles in your portfolio.",
      payType: "Hourly (USD)",
      payRange: "$45 – $65",
      roleDescription: "Concept and finalise 8 hero characters with full expression sheets and outfit variants. Lore briefs and mood boards provided. Two revision rounds per character. Final files in layered PSD format."
    },
    {
      studio: "Eclipse Studios",
      credibility: "12 shipped · 4M plays/mo",
      roleTitle: "Item icon artist",
      roleCategory: "2D Art",
      roleChip: "2D",
      chipBg: "#ffe4e6", chipColor: "#be123c",
      whatLookingFor: "We need a 2D artist to produce high-quality item icons for our combat RPG. Weapons, armour, consumables, and accessories — around 80 icons in the first batch. Must be able to maintain a consistent style across a large volume. Speed and consistency matter as much as quality.",
      payType: "Per batch (USD)",
      payRange: "$500 – $800",
      roleDescription: "First batch: 80 icons across four categories with consistent lighting and perspective. Style guide provided. Delivered in 512×512 PNG. Ongoing batches likely — this is a long-running project with regular content drops."
    },
    {
      studio: "NovaBuild Co.",
      credibility: "15 shipped · 6M plays/mo",
      roleTitle: "Environment concept artist",
      roleCategory: "2D Art",
      roleChip: "2D",
      chipBg: "#ffe4e6", chipColor: "#be123c",
      whatLookingFor: "Looking for an environment concept artist to define the visual direction for four distinct biomes in our open-world game. Must have experience with landscape and architectural concepts. We want painterly style with strong colour palette work — show us environment pieces, not characters.",
      payType: "Hourly (USD)",
      payRange: "$50 – $70",
      roleDescription: "Concept four biomes — each with a hero establishing shot and two detail studies. Mood board collaboration upfront. Revisions included at each biome checkpoint. Finals used directly by our builder team."
    }
  ],
  building: [
    {
      studio: "NovaBuild Co.",
      credibility: "15 shipped · 6M plays/mo",
      roleTitle: "Social hub builder",
      roleCategory: "Building",
      roleChip: "Bu",
      chipBg: "#fef3c7", chipColor: "#b45309",
      whatLookingFor: "Looking for an experienced builder to design and construct a central social hub — the main gathering space for our game. Must have shipped a social space or lobby before. Style guide and reference assets will be provided. We want modularity and low drawcall discipline baked in from the start.",
      payType: "Milestone (USD)",
      payRange: "$50 / hr",
      roleDescription: "Design and build the full social hub: main plaza, shop building exteriors, event stage, and NPC placement zones. Style kit provided. Optimisation benchmarks required at delivery. Two-month contract with handoff to our QA team."
    },
    {
      studio: "Orbit Interactive",
      credibility: "6 shipped · 1.5M plays/mo",
      roleTitle: "Map artist",
      roleCategory: "Building",
      roleChip: "Bu",
      chipBg: "#fef3c7", chipColor: "#b45309",
      whatLookingFor: "We need a skilled map artist for ongoing environment work on our open-world RPG. Biome design, POI construction, and terrain sculpting. Must have shipped open-world or exploration games before. Show us a map you're proud of and tell us your drawcall approach.",
      payType: "Hourly (USD)",
      payRange: "$45 – $55",
      roleDescription: "Ongoing biome and POI work across a 6-biome open world. Weekly deliverable check-ins. Terrain sculpting, asset placement, and atmospheric lighting all in scope. Collaboration with our VFX artist on ambient effects."
    },
    {
      studio: "Solstice Studio",
      credibility: "4 shipped · 700k plays/mo",
      roleTitle: "Environment lead",
      roleCategory: "Building",
      roleChip: "Bu",
      chipBg: "#fef3c7", chipColor: "#b45309",
      whatLookingFor: "Looking for an environment lead to own the visual language of our new horror title. This is a leadership role — you'll manage one junior builder and set the aesthetic direction. Must have led a build team or owned a full environment before. Show us horror or atmospheric work.",
      payType: "Flat (USD)",
      payRange: "$6,000",
      roleDescription: "Lead environment development for the full game across two milestones. Manage one junior builder. Own style decisions, lighting, and atmospheric consistency. Direct line to creative director throughout. Three-month contract."
    }
  ],
  vfx: [
    {
      studio: "Phantom Works",
      credibility: "5 shipped · 900k plays/mo",
      roleTitle: "Combat VFX artist",
      roleCategory: "VFX",
      roleChip: "FX",
      chipBg: "#ecfdf5", chipColor: "#059669",
      whatLookingFor: "Looking for a VFX artist to create ability effects for 12 combat skills. Style references provided — think fast, readable, and impact-clear. Must have shipped combat FX in Roblox before. Show us hit confirms and ability bursts from live games. Integration into existing rig required.",
      payType: "Milestone (USD)",
      payRange: "$50 – $65 / hr",
      roleDescription: "Create and integrate FX for 12 combat abilities: cast, projectile, impact, and cooldown states per skill. Style ref and rig provided. Two revision rounds per ability. Two-month contract, potential extension for additional skills."
    },
    {
      studio: "Orbit Interactive",
      credibility: "6 shipped · 1.5M plays/mo",
      roleTitle: "World ambient FX artist",
      roleCategory: "VFX",
      roleChip: "FX",
      chipBg: "#ecfdf5", chipColor: "#059669",
      whatLookingFor: "We need a VFX artist for ongoing world ambience work across our open-world RPG. Weather effects, foliage movement, water surfaces, and atmospheric particles. Performance budget is strict — we run on mobile. Must show optimised open-world FX in your portfolio.",
      payType: "Hourly (USD)",
      payRange: "$40 – $55",
      roleDescription: "Ongoing FX work across 6 biomes: rain, wind, dust, water ripples, and firefly particles. Performance-budget sign-off required at each biome. Collaboration with the builder team for placement. Weekly deliverables."
    },
    {
      studio: "Solstice Studio",
      credibility: "4 shipped · 700k plays/mo",
      roleTitle: "UI motion designer",
      roleCategory: "VFX",
      roleChip: "FX",
      chipBg: "#ecfdf5", chipColor: "#059669",
      whatLookingFor: "Looking for a motion designer to bring our horror title's UI to life. Menu transitions, tension-building feedback pulses, and HUD animations. Must understand TweenService deeply. Show us UI motion from a shipped game — ideally something atmospheric or dark in tone.",
      payType: "Flat (USD)",
      payRange: "$3,000",
      roleDescription: "Design and implement UI motion across main menu, HUD, and inventory screens. TweenService implementation required — no third-party plugins. Horror tone throughout. Six-week contract. Handoff documentation included."
    }
  ],
  animation: [
    {
      studio: "NovaBuild Co.",
      credibility: "15 shipped · 6M plays/mo",
      roleTitle: "Character animator",
      roleCategory: "Animation",
      roleChip: "An",
      chipBg: "#fff7ed", chipColor: "#c2410c",
      whatLookingFor: "Looking for a character animator to deliver a full locomotion set plus 8 emotes for our new character lineup. Must have shipped locomotion in Roblox before — walk, run, jump, fall, idle at minimum. Rig will be provided. Show us a movement reel with timing notes.",
      payType: "Milestone (USD)",
      payRange: "$60 / hr",
      roleDescription: "Full locomotion set (8 states) plus 8 emotes with loop points and export manifests. Rig and style references provided. Checkpoints at locomotion complete and emotes complete. Three-month contract."
    },
    {
      studio: "Eclipse Studios",
      credibility: "12 shipped · 4M plays/mo",
      roleTitle: "Cinematic animator",
      roleCategory: "Animation",
      roleChip: "An",
      chipBg: "#fff7ed", chipColor: "#c2410c",
      whatLookingFor: "We need an animator to produce cutscene animations for our story mode. 14 scenes of mixed length — dialogue exchanges, action beats, and emotional moments. Mocap reference provided for the action scenes. Must have cinematic or cutscene work in your portfolio.",
      payType: "Hourly (USD)",
      payRange: "$55 – $70",
      roleDescription: "Animate 14 cutscenes using provided mocap reference and storyboards. Scene lengths range from 8 to 45 seconds. Two revision rounds per scene. Delivery in batches of four scenes. Two-month contract."
    },
    {
      studio: "Cascade Labs",
      credibility: "3 shipped · 400k plays/mo",
      roleTitle: "Procedural rigger",
      roleCategory: "Animation",
      roleChip: "An",
      chipBg: "#fff7ed", chipColor: "#c2410c",
      whatLookingFor: "Looking for an animator with procedural rigging experience to build an IK rig for creature movement. Must be comfortable with Lua-driven animation logic. Creature reference designs and movement briefs provided. Show us procedural or IK work — ideally creature-based.",
      payType: "Flat (USD)",
      payRange: "$4,000",
      roleDescription: "Build a full IK rig for a quadruped creature: spine, limbs, head-tracking, and ground adaptation. Lua animation driver included. One-month contract with one revision milestone. Documentation required at delivery."
    }
  ],
  modeling3d: [
    {
      studio: "Orbit Interactive",
      credibility: "6 shipped · 1.5M plays/mo",
      roleTitle: "Character modeler",
      roleCategory: "3D Modeling",
      roleChip: "3D",
      chipBg: "#fef9c3", chipColor: "#854d0e",
      whatLookingFor: "Looking for a character modeler to produce 6 hero characters with LODs and weapon attachment rigs. Must be comfortable with Roblox's polygon constraints and UV mapping. Style guide provided — semi-realistic with clean silhouettes. Show us character models with poly count notes.",
      payType: "Hourly (USD)",
      payRange: "$55 – $75",
      roleDescription: "Model 6 hero characters: base mesh, two LOD levels, UV unwrap, and weapon attachment points. Style guide and concept art provided. Delivery in pairs across three milestones. Three-month contract."
    },
    {
      studio: "Phantom Works",
      credibility: "5 shipped · 900k plays/mo",
      roleTitle: "Prop artist",
      roleCategory: "3D Modeling",
      roleChip: "3D",
      chipBg: "#fef9c3", chipColor: "#854d0e",
      whatLookingFor: "We need a prop artist for ongoing asset production on our RPG. Weapons, furniture, containers, and interactive objects. Must be fast — we're shipping content updates monthly. Show us a prop pack with consistent style and polygon discipline across all assets.",
      payType: "Per asset (USD)",
      payRange: "$100 – $300",
      roleDescription: "Ongoing prop production across weapon, furniture, and interactive categories. Style sheet provided. Deliverables in FBX with LODs. Turnaround of 3–5 days per prop. Ongoing engagement — first batch is 20 props."
    },
    {
      studio: "Solstice Studio",
      credibility: "4 shipped · 700k plays/mo",
      roleTitle: "Environment modeler",
      roleCategory: "3D Modeling",
      roleChip: "3D",
      chipBg: "#fef9c3", chipColor: "#854d0e",
      whatLookingFor: "Looking for an environment modeler to produce modular building and ruin assets for our horror title. Must understand modular design principles and tileable textures. Dark and detailed aesthetic — show us atmospheric or horror environment work from your portfolio.",
      payType: "Hourly (USD)",
      payRange: "$50 – $65",
      roleDescription: "Produce a modular building kit: walls, floors, ceilings, doors, windows, and ruin variants. Style references and UV atlas template provided. Tileable textures included in scope. Two-month contract with bi-weekly delivery checkpoints."
    }
  ],
  gamedesign: [
    {
      studio: "Orbit Interactive",
      credibility: "6 shipped · 1.5M plays/mo",
      roleTitle: "Core loop designer",
      roleCategory: "Game Design",
      roleChip: "GD",
      chipBg: "#f0fdf4", chipColor: "#15803d",
      whatLookingFor: "We need a game designer to own the core loop, progression system, and economy design for our upcoming RPG. Must have shipped a game with a functional economy before. Design doc experience required — we use Notion. Show us a progression system you designed and what the retention data looked like.",
      payType: "Milestone (USD)",
      payRange: "$65 / hr",
      roleDescription: "Design core gameplay loop, XP curve, item economy, and seasonal content framework. Design docs in Notion. Work directly with our lead scripter and producer. Three-month contract across two milestones."
    },
    {
      studio: "Eclipse Studios",
      credibility: "12 shipped · 4M plays/mo",
      roleTitle: "Systems designer",
      roleCategory: "Game Design",
      roleChip: "GD",
      chipBg: "#f0fdf4", chipColor: "#15803d",
      whatLookingFor: "Looking for a systems designer to balance our combat system and reward loop. Must be data-comfortable — we provide full telemetry exports. Ability to write clear balance changelogs required. Show us a combat system you balanced and the reasoning behind your decisions.",
      payType: "Milestone (USD)",
      payRange: "$60 – $75 / hr",
      roleDescription: "Balance combat abilities, weapon stats, and reward loop pacing across a 6-week sprint. Telemetry data and player retention reports provided. Weekly design review with the lead. Deliverables: balance changelog, tuning sheet, and post-sprint summary."
    },
    {
      studio: "Cascade Labs",
      credibility: "3 shipped · 400k plays/mo",
      roleTitle: "UX game designer",
      roleCategory: "Game Design",
      roleChip: "GD",
      chipBg: "#f0fdf4", chipColor: "#15803d",
      whatLookingFor: "We need a UX-focused game designer to reduce first-five-minute drop-off in our game. Must understand onboarding flow design and have experience improving retention metrics. Show us a before-and-after where your UX decisions moved the numbers.",
      payType: "Flat (USD)",
      payRange: "$4,000",
      roleDescription: "Audit current new player experience, redesign the first 5 minutes, and brief the UI designer and scripter on implementation. Deliverables: UX audit, redesign doc, and implementation brief. One-month contract."
    }
  ],
  sounddesign: [
    {
      studio: "NovaBuild Co.",
      credibility: "15 shipped · 6M plays/mo",
      roleTitle: "Ambient sound designer",
      roleCategory: "Sound Design",
      roleChip: "SD",
      chipBg: "#eff6ff", chipColor: "#1d4ed8",
      whatLookingFor: "Looking for a sound designer to create atmospheric soundscapes for four distinct biomes in our open-world game. Must have shipped ambient audio for games before — ideally open-world or exploration titles. Show us a soundscape demo and describe your layering approach.",
      payType: "Hourly (USD)",
      payRange: "$40 – $60",
      roleDescription: "Design ambient soundscapes for four biomes with day and night variants. Each biome: base layer, dynamic weather layer, and proximity audio triggers. Delivered as loopable WAV files with an integration guide for our scripter. Four-month contract."
    },
    {
      studio: "Zenith Games",
      credibility: "8 shipped · 2.1M plays/mo",
      roleTitle: "Audio director",
      roleCategory: "Sound Design",
      roleChip: "SD",
      chipBg: "#eff6ff", chipColor: "#1d4ed8",
      whatLookingFor: "We're looking for an audio director to take ownership of our entire game's audio — music, SFX, ambient, and UI sounds. Must have directed audio for a shipped Roblox or Unity/Godot title. We want someone who can set the sonic identity, not just execute briefs.",
      payType: "Hourly (USD)",
      payRange: "$65 – $80",
      roleDescription: "Own all audio direction: brief and manage freelance SFX and music artists, set style guides, and implement key audio yourself. Weekly review with the producer. Ongoing engagement — target launch in 5 months."
    },
    {
      studio: "Phantom Works",
      credibility: "5 shipped · 900k plays/mo",
      roleTitle: "Music composer",
      roleCategory: "Sound Design",
      roleChip: "SD",
      chipBg: "#eff6ff", chipColor: "#1d4ed8",
      whatLookingFor: "Looking for a composer to score our horror RPG. Dark orchestral with electronic undertones — think tension over jump scares. Must have shipped music for a game before. Send us a demo reel with at least one piece that builds and releases tension deliberately.",
      payType: "Flat (USD)",
      payRange: "$5,000",
      roleDescription: "Compose 6 original tracks: main theme, 3 area themes, combat loop, and credits. Stems required for dynamic layering. Revisions at demo stage and final stage per track. Three-month delivery schedule."
    }
  ],
  sfx: [
    {
      studio: "Eclipse Studios",
      credibility: "12 shipped · 4M plays/mo",
      roleTitle: "Combat SFX artist",
      roleCategory: "SFX",
      roleChip: "SX",
      chipBg: "#ecfdf5", chipColor: "#047857",
      whatLookingFor: "Looking for an SFX artist to design and deliver a full combat audio pack for our action RPG. Weapon swings, ability activations, hit confirms, and critical sounds. Must have shipped combat audio in a live game. Show us a reel with impact punch and clear audio-visual sync.",
      payType: "Per pack (USD)",
      payRange: "$800 – $1,500",
      roleDescription: "First pack: 40 combat sounds across melee, ranged, and ability categories. WAV + OGG delivery. Manifest with naming convention included. Integration notes for the scripter. Two-month contract with ongoing packs based on game updates."
    },
    {
      studio: "Orbit Interactive",
      credibility: "6 shipped · 1.5M plays/mo",
      roleTitle: "UI sound effects designer",
      roleCategory: "SFX",
      roleChip: "SX",
      chipBg: "#ecfdf5", chipColor: "#047857",
      whatLookingFor: "We need an SFX designer to create all UI audio for our RPG — button clicks, menu transitions, notification chimes, error sounds, and purchase confirmations. Must understand UI audio psychology. Light, satisfying, non-fatiguing. Show us UI audio from a shipped game.",
      payType: "Flat (USD)",
      payRange: "$2,000",
      roleDescription: "Produce a complete UI SFX kit: 25 sounds covering navigation, feedback, notifications, and purchase flows. Consistent sonic identity throughout. WAV delivery with naming guide. One-month contract."
    },
    {
      studio: "Cascade Labs",
      credibility: "3 shipped · 400k plays/mo",
      roleTitle: "Ability SFX pack artist",
      roleCategory: "SFX",
      roleChip: "SX",
      chipBg: "#ecfdf5", chipColor: "#047857",
      whatLookingFor: "Looking for an SFX artist to design sounds for 10 player abilities. Each ability needs cast, travel, impact, and cooldown-end sounds. Must understand ability audio readability — players need to hear what just happened. Show us ability audio from a combat game.",
      payType: "Flat (USD)",
      payRange: "$1,800",
      roleDescription: "Design 40 sounds across 10 abilities (4 per ability: cast, travel, impact, cooldown). Style brief and ability descriptions provided. WAV + OGG delivery. Six-week contract with two check-in reviews during production."
    }
  ]
};

function joinHref(mode: Audience, search: string, hash = "") {
  const base = mode === "studio" ? "/studios" : "/";
  const query = search ? `?${search}` : "";
  return `${base}${query}${hash}`;
}

/** Strip `type` — HomePage/StudiosPage use it for server redirects; keeping it fights client audience navigation. */
function navigationSearchString(params: { toString(): string }) {
  const next = new URLSearchParams(params.toString());
  next.delete("type");
  return next.toString();
}

function scrollToId(id: string) {
  if (typeof window === "undefined") return;
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function LiveTallyBand() {
  const { developers, studios } = LANDING_TALLY;
  return (
    <div id="join" className="landing-tally-band" aria-live="polite">
      <span className="landing-tally-dot" aria-hidden />
      <span>
        {developers} developers waitlisted · {studios} studios reviewing ·{" "}
        <em style={{ fontStyle: "normal", fontWeight: 500, color: "var(--wg-muted)" }}>updated live</em>
      </span>
    </div>
  );
}

function LiveActivityTicker() {
  const doubled = [...LANDING_ACTIVITY_FEED, ...LANDING_ACTIVITY_FEED];
  return (
    <div className="landing-activity-ticker" aria-label="Recent activity">
      <span className="landing-tally-dot" style={{ marginLeft: 14 }} aria-hidden />
      <div className="landing-activity-inner">
        {doubled.map((row, i) => (
          <span key={`${row.who}-${row.action}-${i}`}>
            <strong>{row.who}</strong> · {row.action} · <em>{row.ago}</em>
            <span style={{ opacity: 0.35 }}> &nbsp;•&nbsp; </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function HowItWorksSection({ copy }: { copy: LandingCopy }) {
  const pinnedRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: pinnedRef,
    offset: ["start start", "end end"]
  });
  const [seg, setSeg] = useState(0);
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      if (v < 0.34) setSeg(0);
      else if (v < 0.68) setSeg(1);
      else setSeg(2);
    });
    return () => unsub();
  }, [scrollYProgress]);
  const beamW = useTransform(scrollYProgress, [0.45, 0.92], ["0%", "100%"]);

  const labels = ["Drop your proof", "Your card fills in", "Studios match you"];
  const bodies = [
    "Shipped work, links, and rate become one scannable surface.",
    "Role, availability, and proof stay visible as studios swipe.",
    "A Spark opens a focused thread — no cold ping."
  ];

  return (
    <>
      <div ref={pinnedRef} className="how-pinned-section">
        <div className="how-pinned-sticky">
          <motion.div className="how-pinned-card" layout>
            <p className="how-pinned-label">{labels[seg]}</p>
            <p className="how-pinned-body">{bodies[seg]}</p>
            <motion.div className="how-pinned-beam" style={{ width: beamW }} />
          </motion.div>
        </div>
      </div>
      <HowItWorksStrip copy={copy} />
    </>
  );
}

function LandingQuoteSection({
  accentHex,
  allowWebGl
}: {
  accentHex: string;
  allowWebGl: boolean;
}) {
  return (
    <section className="landing-quote-section" aria-label="Why now">
      {allowWebGl ? (
        <div className="quote-shader" aria-hidden>
          <HeroShaderBackground accentHex={accentHex} allowWebGl={allowWebGl} />
        </div>
      ) : (
        <div className="hero-shader-fallback quote-shader" aria-hidden style={{ position: "absolute", inset: 0 }} />
      )}
      <blockquote cite="weld.">
        {LANDING_QUOTE.text}
        <cite>{LANDING_QUOTE.attribution}</cite>
      </blockquote>
    </section>
  );
}

function LandingDayOneGrid() {
  const iconFor = (key: (typeof LANDING_DAY_ONE_TILES)[number]["icon"]) => {
    if (key === "shield") return <IconShield className="dayone-ic" />;
    if (key === "spark") return <StepSparkIcon />;
    if (key === "code") return <IconCode className="dayone-ic" />;
    return <IconUser className="dayone-ic" />;
  };
  return (
    <div className="landing-dayone-grid" aria-label="Day one on weld.">
      {LANDING_DAY_ONE_TILES.map((t) => (
        <div key={t.title} className="landing-dayone-tile">
          <span style={{ display: "flex", marginBottom: 8 }}>{iconFor(t.icon)}</span>
          <strong>{t.title}</strong>
          <span>{t.body}</span>
        </div>
      ))}
    </div>
  );
}

export default function MarketingPage(props: MarketingPageProps) {
  return <WeldLandingPage {...props} />;
}

function WeldLandingPage({
  initialMode,
  sourceVariant,
  page
}: MarketingPageProps) {
  void initialMode;
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const navSearchString = navigationSearchString(searchParams);
  const motion = useMotionPolicy();
  const motionTier = motion.tier;
  const mode: Audience = pathname.startsWith("/studios") ? "studio" : "developer";
  const [role, setRole] = useState<RoleKey>("scripting");
  const [email, setEmail] = useState("");
  const [capturePhase, setCapturePhase] = useState<CapturePhase>("idle");
  const [captureStatus, setCaptureStatus] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [swipeModalOpen, setSwipeModalOpen] = useState(false);
  const heroShellRef = useRef<HTMLElement | null>(null);
  const heroInView = useInView(heroShellRef, { amount: 0.12, margin: "0px 0px -40% 0px" });
  useEffect(() => {
    if (!swipeModalOpen) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [swipeModalOpen]);
  const [hiringPanel, setHiringPanel] = useState(0);
  const [hiringAnim, setHiringAnim] = useState<HiringAnim>("idle");
  const heroInputRef = useRef<HTMLInputElement | null>(null);
  const pageShellRef = useRef<HTMLDivElement | null>(null);
  const [returningInvite, setReturningInvite] = useState<{ inviteUrl: string } | null>(null);

  const activeProfile = PROFILES[role];
  const modeCopy = getLandingCopy(mode);

  const [savedInviteUrl, setSavedInviteUrl] = useState<string | null>(null);

  useEffect(() => {
    captureAttributionFromLocation();
    try {
      setSavedInviteUrl(localStorage.getItem("weld_last_invite_url"));
    } catch {}
  }, []);

  useEffect(() => {
    const root = pageShellRef.current;
    if (!root) return;
    if (motion.reducedMotion || typeof IntersectionObserver === "undefined") {
      root
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((node) => node.setAttribute("data-reveal", "seen"));
      return;
    }

    const targets = root.querySelectorAll<HTMLElement>('[data-reveal="pending"]');
    if (targets.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = motion.allowEntranceStagger ? Math.min(index * 50, 240) : 0;
          window.setTimeout(() => el.setAttribute("data-reveal", "seen"), delay);
          observer.unobserve(el);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    targets.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [motion.reducedMotion, motion.allowEntranceStagger]);

  useEffect(() => {
    void trackEvent({
      eventName: "landing_viewed",
      page,
      audience: mode,
      payload: { variant: sourceVariant }
    });
  }, [mode, page, sourceVariant]);

  function handleModeChange(nextMode: Audience) {
    if (nextMode === mode) {
      return;
    }
    persistAudiencePreference(nextMode);
    setCaptureStatus("");
    setCapturePhase("idle");

    void trackEvent({
      eventName: "landing_mode_changed",
      page,
      audience: nextMode,
      payload: { from: mode, to: nextMode }
    });

    const href = joinHref(nextMode, navSearchString, window.location.hash);
    router.push(href, { scroll: false });
  }

  function handleRoleChange(nextRoleKey: RoleKey) {
    if (nextRoleKey === role) return;

    if (motion.reducedMotion) {
      setRole(nextRoleKey);
      setHiringPanel(0);
      setHiringAnim("idle");
    } else {
      setIsSwapping(true);
      window.setTimeout(() => {
        setRole(nextRoleKey);
        setHiringPanel(0);
        setHiringAnim("idle");
        setIsSwapping(false);
      }, 120);
    }

    void trackEvent({
      eventName: "landing_role_selected",
      page,
      audience: mode,
      payload: { role: nextRoleKey }
    });
  }

  function handleJoinIntent(source: "nav" | "hero") {
    void trackEvent({
      eventName: "landing_cta_clicked",
      page,
      audience: mode,
      payload: { source, variant: sourceVariant }
    });
    scrollToId("join");
    window.setTimeout(
      () => heroInputRef.current?.focus(),
      motionTier === "reduced" ? 0 : 450
    );
  }

  function handleSecondaryCta() {
    void trackEvent({
      eventName: "landing_secondary_cta_clicked",
      page,
      audience: mode,
      payload: { variant: sourceVariant }
    });
    setSwipeModalOpen(true);
  }

  function handleHiringAction(action: "spark" | "skip") {
    const panels = HIRING_PANELS[role];
    setHiringAnim(action);

    void trackEvent({
      eventName: "landing_hiring_action",
      page,
      audience: mode,
      payload: { role, action, panel: hiringPanel }
    });

    if (action === "spark") {
      window.setTimeout(() => scrollToId("join"), motionTier === "reduced" ? 0 : 180);
    }

    window.setTimeout(() => {
      setHiringPanel((current) => (current + 1) % panels.length);
      setHiringAnim("idle");
    }, motionTier === "reduced" ? 80 : 360);
  }

  async function openSignupForm() {
    if (!email.trim()) {
      setCapturePhase("error");
      setCaptureStatus("Add your email to join early access.");
      heroInputRef.current?.focus();
      return;
    }

    setCapturePhase("submitting");

    try {
      const res = await fetch(`/api/waitlist/check?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json() as { exists: boolean; inviteUrl?: string };
      if (data.exists && data.inviteUrl) {
        setReturningInvite({ inviteUrl: data.inviteUrl });
        setCapturePhase("idle");
        return;
      }
    } catch {
      // proceed to signup if check fails
    }

    void trackEvent({
      eventName: "landing_signup_form_opened",
      page,
      audience: mode,
      payload: { variant: sourceVariant }
    });

    setCaptureStatus("Opening your signup form...");

    const refCode = searchParams.get("ref") ?? "";
    const signupParams = new URLSearchParams({
      email: email.trim(),
      type: mode,
      ...(refCode ? { ref: refCode } : {})
    });

    window.setTimeout(() => {
      router.push(`/signup?${signupParams.toString()}`);
    }, motionTier === "reduced" ? 0 : 180);
  }

  return (
    <MotionConfig reducedMotion="user">
    <div
      ref={pageShellRef}
      className="weld-glass-page"
      data-mode={mode}
      data-motion-tier={motionTier}
      style={
        {
          "--profile-accent": activeProfile.accent,
          "--profile-soft": activeProfile.soft
        } as CSSProperties
      }
    >
      <GlassNav
        mode={mode}
        copy={modeCopy}
        searchString={navSearchString}
        onModeChange={handleModeChange}
        onJoinClick={() => handleJoinIntent("nav")}
        stickyJoin={!heroInView}
        email={email}
        capturePhase={capturePhase}
        onEmailChange={setEmail}
        onSubmit={() => void openSignupForm()}
      />

      {returningInvite && (
        <ReturningModal
          inviteUrl={returningInvite.inviteUrl}
          onDismiss={() => setReturningInvite(null)}
        />
      )}

      {swipeModalOpen && (
        <div
          className="swipe-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setSwipeModalOpen(false); }}
        >
          <div className="swipe-modal-inner">
            <button
              className="swipe-modal-close"
              onClick={() => setSwipeModalOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <SwipeCardModal />
          </div>
        </div>
      )}

      <main className="weld-glass-main">

        {/* 1. Hero */}
        <HeroShell
          sectionRef={heroShellRef}
          accentHex={activeProfile.accent}
          allowWebGl={motion.allowAmbient}
        >
          <HeroCopyPanel
            copy={modeCopy}
            email={email}
            capturePhase={capturePhase}
            onEmailChange={setEmail}
            onSubmit={openSignupForm}
            onSecondaryCta={handleSecondaryCta}
            inputRef={heroInputRef}
            savedInviteUrl={savedInviteUrl}
            showCaptureInline={heroInView}
          />
          <HeroProductPreview
            mode={mode}
            profile={activeProfile}
            onOpenCard={() => setSwipeModalOpen(true)}
            onJoin={() => handleJoinIntent("hero")}
            joinCtaLabel={modeCopy.nav.cta}
            allowAmbient={motion.allowAmbient}
          />
        </HeroShell>

        <LiveTallyBand />

        <HowItWorksSection copy={modeCopy} />

        {/* 3. Live talent marquee */}
        {mode === "studio" ? (
          <OtherSideSection copy={modeCopy} mode={mode} primary />
        ) : (
          <TalentMarqueeSection copy={modeCopy} mode={mode} primary />
        )}

        <LiveActivityTicker />

        {/* 4. Role switching — POV-flips per audience */}
        <RoleTalentExplorer
          mode={mode}
          copy={modeCopy}
          role={role}
          isSwapping={isSwapping}
          hiringPanel={hiringPanel}
          hiringAnim={hiringAnim}
          onRoleChange={handleRoleChange}
          onHiringAction={handleHiringAction}
        />

        <LandingQuoteSection accentHex={activeProfile.accent} allowWebGl={motion.allowAmbient} />

        {/* 5. And here's who's looking */}
        {mode === "studio" ? (
          <TalentMarqueeSection copy={modeCopy} mode={mode} />
        ) : (
          <OtherSideSection copy={modeCopy} mode={mode} />
        )}

        {/* 6. Chat — POV-flips per audience */}
        <ChatPreviewSection copy={modeCopy} profile={activeProfile} mode={mode} />

        {/* 7. Comparison — Discord hides them, weld. shows them */}
        <ComparisonSection audience={mode} />

        <FriendlyFAQ copy={modeCopy} />

        <LandingDayOneGrid />
      </main>

      <FooterCTA copy={modeCopy} mode={mode} />
    </div>
    </MotionConfig>
  );
}

function GlassNav({
  mode,
  copy,
  searchString,
  onModeChange,
  onJoinClick,
  stickyJoin,
  email,
  capturePhase,
  onEmailChange,
  onSubmit
}: {
  mode: Audience;
  copy: LandingCopy;
  searchString: string;
  onModeChange: (mode: Audience) => void;
  onJoinClick: () => void;
  stickyJoin: boolean;
  email: string;
  capturePhase: CapturePhase;
  onEmailChange: (v: string) => void;
  onSubmit: () => void;
}) {
  const isSubmitting = capturePhase === "submitting";
  const isSuccess = capturePhase === "success";

  return (
    <header className="glass-nav-shell">
      <Link href={joinHref(mode, searchString)} className="glass-brand" aria-label="weld. home">
        <span className="glass-brand-mark">
          <Image src="/Assets/weld-logo-official.svg" alt="" width={24} height={24} priority />
        </span>
        <span>weld.</span>
      </Link>

      <ModeToggle
        mode={mode}
        labels={{
          developer: copy.nav.modeToggleDeveloper,
          studio: copy.nav.modeToggleStudio
        }}
        onChange={onModeChange}
      />

      {stickyJoin ? (
        <motion.div
          layoutId="join-cta-bar"
          className="glass-nav-join-slot"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        >
          <input
            type="email"
            placeholder={copy.waitlist.placeholder}
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            disabled={isSubmitting || isSuccess}
            aria-label="Email address"
          />
          <button
            type="button"
            className="button-primary"
            onClick={onSubmit}
            disabled={isSubmitting || isSuccess}
          >
            {isSuccess ? copy.hero.submittedLabel : isSubmitting ? copy.hero.submittingLabel : copy.hero.primaryCta}
          </button>
        </motion.div>
      ) : null}

      <nav className="glass-nav-links" aria-label="Primary">
        {copy.nav.links.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
        <a href="/find-invite" className="glass-nav-subtle">
          {copy.nav.alreadySignedUp}
        </a>
        <a
          href="#join"
          className="button-primary button-nav"
          onClick={(event) => {
            event.preventDefault();
            onJoinClick();
          }}
        >
          {copy.nav.cta}
        </a>
      </nav>
    </header>
  );
}

function HeroShell({
  children,
  sectionRef,
  accentHex,
  allowWebGl
}: {
  children: React.ReactNode;
  sectionRef: React.RefObject<HTMLElement | null>;
  accentHex: string;
  allowWebGl: boolean;
}) {
  return (
    <section
      ref={sectionRef as Ref<HTMLElement>}
      className="hero-shell hero-shell-split" id="top" style={{ position: "relative" }}>
      <HeroShaderBackground accentHex={accentHex} allowWebGl={allowWebGl} />
      <div className="hero-shell-grid" style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </section>
  );
}

function HeroCopyPanel({
  copy,
  email,
  capturePhase,
  onEmailChange,
  onSubmit,
  onSecondaryCta,
  inputRef,
  savedInviteUrl,
  showCaptureInline
}: {
  copy: LandingCopy;
  email: string;
  capturePhase: CapturePhase;
  onEmailChange: (v: string) => void;
  onSubmit: () => void;
  onSecondaryCta: () => void;
  inputRef?: MutableRefObject<HTMLInputElement | null>;
  savedInviteUrl?: string | null;
  showCaptureInline: boolean;
}) {
  const isSubmitting = capturePhase === "submitting";
  const isSuccess = capturePhase === "success";

  return (
    <div className="hero-copy-panel hero-copy-panel-split">
      <div className="section-index-row">
        <span className="section-index" aria-hidden>
          01
        </span>
        <p className="hero-eyebrow" style={{ margin: 0, textTransform: "none", letterSpacing: "0.02em" }}>
          {copy.hero.eyebrow}
        </p>
      </div>
      <h1>{copy.hero.title}</h1>
      <p className="hero-lead">{copy.hero.lead}</p>
      <p className="hero-support">{copy.hero.support}</p>
      {showCaptureInline ? (
        <motion.div
          layoutId="join-cta-bar"
          className="hero-capture-row"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        >
          <input
            ref={inputRef}
            className="hero-capture-input"
            type="email"
            placeholder={copy.waitlist.placeholder}
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            disabled={isSubmitting || isSuccess}
            aria-label="Email address"
          />
          <button
            type="button"
            className="hero-capture-btn button-primary"
            onClick={onSubmit}
            disabled={isSubmitting || isSuccess}
          >
            {isSuccess ? copy.hero.submittedLabel : isSubmitting ? copy.hero.submittingLabel : copy.hero.primaryCta}
          </button>
        </motion.div>
      ) : null}
      <p className="hero-trust-line">{copy.hero.trustLine}</p>
      <div className="hero-secondary-row">
        <button
          type="button"
          className="button-secondary hero-secondary-cta"
          onClick={onSecondaryCta}
          disabled={isSubmitting || isSuccess}
        >
          {copy.hero.secondaryCta}
        </button>
      </div>
      <div className="hero-proof-line">
        <div
          aria-hidden="true"
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#22c55e",
            flexShrink: 0,
            boxShadow: "0 0 0 2px rgba(34,197,94,0.22)"
          }}
        />
        {copy.hero.proofPrefix} <strong>{copy.hero.proofStrong}</strong> {copy.hero.proofSuffix}
      </div>
      {savedInviteUrl ? (
        <Link href={savedInviteUrl} className="hero-invite-return">
          {copy.hero.inviteReturn}
        </Link>
      ) : null}
    </div>
  );
}

function HeroProductPreview({
  mode,
  profile,
  onOpenCard,
  onJoin,
  joinCtaLabel,
  allowAmbient
}: {
  mode: Audience;
  profile: TalentProfile;
  onOpenCard: () => void;
  onJoin: () => void;
  joinCtaLabel: string;
  allowAmbient: boolean;
}) {
  const stackProfiles = useMemo(() => [MARQUEE_PROFILES[0], MARQUEE_PROFILES[1], MARQUEE_PROFILES[2]], []);

  return (
    <div className="hero-card-column hero-card-column-split hero-product-preview">
      <div className="hero-preview-shell">
        <div className="hero-preview-stage">
          <div className="hero-preview-card-frame">
            <div className="npc-hero-preview-container" style={{ position: "relative" }}>
              <motion.div
                className="hero-card-stack"
                animate={allowAmbient ? { y: [0, -4, 0] } : undefined}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {stackProfiles.map((p, i) => (
                  <div key={p.id} className="hero-card-stack-layer" data-depth={i}>
                    <div className="npc-hero-preview-card">
                      <SwipeCard profile={p} />
                    </div>
                  </div>
                ))}
                <div className="hero-match-chip">
                  {profile.matchScore}% match · {profile.availability}
                </div>
              </motion.div>
              <button
                type="button"
                className="npc-hero-preview-trigger"
                onClick={onOpenCard}
                aria-label="Open interactive profile card"
              >
                <span className="npc-hero-preview-hint">Open interactive card</span>
              </button>
            </div>
          </div>

          <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
            <button type="button" className="button-secondary hero-preview-join-btn" onClick={onJoin}>
              {joinCtaLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HowItWorksStrip({ copy }: { copy: LandingCopy }) {
  const steps = copy.howItWorks.steps;
  return (
    <section data-reveal="pending" className="how-strip-section" id="how" aria-label={copy.howItWorks.title}>
      <div className="section-index-row" style={{ maxWidth: "min(1180px, 100% - 32px)", margin: "0 auto 16px", padding: "0 16px" }}>
        <span className="section-index" aria-hidden>
          02
        </span>
        <div>
          <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: "var(--wg-muted)", letterSpacing: "0.08em" }}>
            {copy.howItWorks.kicker}
          </p>
          <h2 style={{ margin: 0, fontSize: "clamp(1.5rem, 3vw, 2.1rem)" }}>{copy.howItWorks.title}</h2>
        </div>
      </div>
      <div className="glass-card how-strip">
        {steps.map((step, index) => (
          <article key={step.title} className="step-card">
            <div className="step-card-copy">
              <span className="step-index">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
            <span className="step-illustration" aria-hidden="true">
              <HowStepIcon icon={step.icon} />
            </span>
            {index < steps.length - 1 ? (
              <span className="step-arrow" aria-hidden="true">
                <HowStepArrowIcon />
              </span>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function TalentMarqueeSection({
  copy,
  mode,
  primary
}: {
  copy: LandingCopy;
  mode: Audience;
  primary?: boolean;
}) {
  const teaser = primary ? copy.marquee.talentPrimary : copy.marquee.talentSecondary;
  const doubled = [...MARQUEE_PROFILES, ...MARQUEE_PROFILES];

  return (
    <section
      className="marquee-section"
      data-audience={mode}
      aria-label={`${teaser.kicker}: ${teaser.title}`}
    >
      <div className="marquee-header">
        <div className="section-index-row" style={{ marginBottom: 4 }}>
          <span className="section-index" aria-hidden>
            {primary ? "02" : "03"}
          </span>
          <p className="marquee-eyebrow" style={{ margin: 0, textTransform: "none", letterSpacing: "0.06em" }}>
            {teaser.kicker}
          </p>
        </div>
        <h2 className="marquee-heading">{teaser.title}</h2>
        <p className="marquee-subtext">
          {teaser.body}
          {teaser.strong ? (
            <>
              {" "}
              <strong>{teaser.strong}</strong>
            </>
          ) : null}
        </p>
      </div>
      <div className="marquee-track" aria-hidden="true">
        <div className="marquee-inner">
          {doubled.map((profile, i) => (
            <div key={`${profile.id}-${i}`} className="marquee-card-wrap">
              <div className="npc-hero-preview-card">
                <SwipeCard profile={profile} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function RoleTalentExplorer({
  mode,
  copy,
  role,
  isSwapping,
  hiringPanel,
  hiringAnim,
  onRoleChange,
  onHiringAction
}: {
  mode: Audience;
  copy: LandingCopy;
  role: RoleKey;
  isSwapping: boolean;
  hiringPanel: number;
  hiringAnim: HiringAnim;
  onRoleChange: (role: RoleKey) => void;
  onHiringAction: (action: "spark" | "skip") => void;
}) {
  const panels = HIRING_PANELS[role];
  let activeCategory: RoleCategoryId = "engineering";
  for (const id of Object.keys(ROLE_CATEGORY_GROUPS) as RoleCategoryId[]) {
    if (ROLE_CATEGORY_GROUPS[id].roles.includes(role)) {
      activeCategory = id;
      break;
    }
  }
  const categoryIds = Object.keys(ROLE_CATEGORY_GROUPS) as RoleCategoryId[];

  return (
    <section data-reveal="pending" className="glass-section how-story-section" id="roles">
      <div className="how-story-grid">
        <div className="section-copy how-story-copy">
          <div className="section-index-row">
          <span className="section-index" aria-hidden>
            05
          </span>
            <div>
              <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: "var(--wg-muted)", letterSpacing: "0.08em" }}>
                {copy.roleExplorer.kicker}
              </p>
              <h2 style={{ margin: 0 }}>{copy.roleExplorer.title}</h2>
            </div>
          </div>
          <p>{copy.roleExplorer.lead}</p>

          <div className="role-category-grid" role="group" aria-label="Role categories">
            {categoryIds.map((cid) => {
              const g = ROLE_CATEGORY_GROUPS[cid];
              const count = roleDemandSum(g.roles);
              return (
                <button
                  key={cid}
                  type="button"
                  className={`role-category-card${activeCategory === cid ? " is-active" : ""}`}
                  onClick={() => onRoleChange(g.roles[0])}
                >
                  <p className="rc-title">{g.label}</p>
                  <p className="rc-count">{count}+ open roles (sample)</p>
                </button>
              );
            })}
          </div>
          <div className="role-subchips" role="radiogroup" aria-label="Choose a discipline">
            {ROLE_CATEGORY_GROUPS[activeCategory].roles.map((rk) => (
              <button
                key={rk}
                type="button"
                role="radio"
                aria-checked={role === rk}
                className={`role-subchip${role === rk ? " is-active" : ""}`}
                onClick={() => onRoleChange(rk)}
              >
                {ROLE_LABELS[rk]}
              </button>
            ))}
          </div>
        </div>

        <HiringPanelStack
          mode={mode}
          hiringCopy={copy.roleExplorer.hiring}
          panels={panels}
          role={role}
          activeIndex={hiringPanel}
          anim={hiringAnim}
          isSwapping={isSwapping}
          onAction={onHiringAction}
        />
      </div>
    </section>
  );
}

function compactSentences(text: string, limit: number) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?:\.|\?|!)\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .slice(0, limit);
}

function hiringPreviewBullets(panel: (typeof HIRING_PANELS)[RoleKey][number]) {
  const requirements = compactSentences(panel.whatLookingFor, 2);
  const scope = compactSentences(panel.roleDescription, 1);
  return [...requirements, ...scope].slice(0, 3);
}

function HiringPanelStack({
  mode,
  hiringCopy,
  panels,
  role,
  activeIndex,
  anim,
  isSwapping,
  onAction
}: {
  mode: Audience;
  hiringCopy: LandingCopy["roleExplorer"]["hiring"];
  panels: (typeof HIRING_PANELS)[RoleKey];
  role: RoleKey;
  activeIndex: number;
  anim: HiringAnim;
  isSwapping: boolean;
  onAction: (action: "spark" | "skip") => void;
}) {
  const active = panels[activeIndex];
  const behind1 = panels[(activeIndex + 1) % panels.length];
  const behind2 = panels[(activeIndex + 2) % panels.length];
  const bullets = hiringPreviewBullets(active);
  const ctaBody =
    mode === "developer"
      ? hiringCopy.goodFitBodyDev.split("{studio}").join(active.studio)
      : hiringCopy.goodFitBodyStudio;

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 260, damping: 24 });
  const springY = useSpring(tiltY, { stiffness: 260, damping: 24 });

  return (
    <div className="hiring-stack-wrapper" data-swapping={isSwapping ? "true" : "false"}>
      <div className={`hiring-panel-stack is-${anim}`}>
        <div className="hiring-panel-behind hiring-panel-behind-2">
          <span className="hiring-panel-stub-label">{behind2.studio}</span>
        </div>
        <div className="hiring-panel-behind hiring-panel-behind-1">
          <span className="hiring-panel-stub-label">{behind1.studio}</span>
        </div>
        <div className="hiring-tilt-wrap">
          <motion.article
            className="glass-card hiring-panel-active hiring-tilt-inner"
            style={{
              rotateX: springY,
              rotateY: springX,
              transformPerspective: 900
            }}
            onMouseMove={(e) => {
              const el = e.currentTarget;
              const r = el.getBoundingClientRect();
              const px = (e.clientX - r.left) / r.width - 0.5;
              const py = (e.clientY - r.top) / r.height - 0.5;
              tiltX.set(px * 7);
              tiltY.set(py * -6);
            }}
            onMouseLeave={() => {
              tiltX.set(0);
              tiltY.set(0);
            }}
          >
            <div className="hp-title-row" style={{ alignItems: "flex-start", gap: "12px" }}>
              <div>
                <h3 className="hp-title">{active.roleTitle}</h3>
                <span className="hp-category">{active.roleCategory}</span>
              </div>
            </div>

            <div className="hp-studio-context">
              <span>{active.studio}</span>
              <strong>{active.credibility}</strong>
            </div>

            <div className="hp-pay-box" style={{ borderStyle: "solid", padding: "10px 14px" }}>
              <span className="hp-pay-value" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif", fontSize: 15 }}>
                {active.payType} · {active.payRange}
              </span>
            </div>

            <p className="hp-section-label">ROLE SNAPSHOT</p>
            <ul className="hp-bullet-list">
              {bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>

            <div className="hp-cta-box">
              <p className="hp-cta-title">{hiringCopy.goodFitTitle}</p>
              <p className="hp-cta-body">{ctaBody}</p>
            </div>

            <div className="hiring-panel-actions" style={{ alignItems: "center", gap: 12 }}>
              <button type="button" className="hiring-action-spark" onClick={() => onAction("spark")}>
                See this fit
              </button>
              <button
                type="button"
                className="hiring-action-next"
                onClick={() => onAction("skip")}
                style={{ background: "transparent", border: "none", textDecoration: "underline", cursor: "pointer" }}
              >
                Next role →
              </button>
            </div>
          </motion.article>
        </div>
      </div>
      <p className="hiring-stack-counter" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span>+ {ROLE_DEMAND[role]} more roles like this</span>
        <span style={{ opacity: 0.55, fontSize: 12 }}>
          {activeIndex + 1} / {panels.length}
        </span>
      </p>
    </div>
  );
}
function OtherSideSection({
  copy,
  mode,
  primary
}: {
  copy: LandingCopy;
  mode: Audience;
  primary?: boolean;
}) {
  const teaser = primary ? copy.marquee.studioPrimary : copy.marquee.studioSecondary;
  const doubled = [...MARQUEE_STUDIOS, ...MARQUEE_STUDIOS];

  return (
    <section
      data-reveal="pending"
      className="other-side-section"
      data-audience={mode}
      aria-label={`${teaser.kicker}: ${teaser.title}`}
    >
      <div className="marquee-header">
        <div className="section-index-row" style={{ marginBottom: 4 }}>
          <span className="section-index" aria-hidden>
            {primary ? "02" : "03"}
          </span>
          <p className="marquee-eyebrow" style={{ margin: 0, textTransform: "none", letterSpacing: "0.06em" }}>
            {teaser.kicker}
          </p>
        </div>
        <h2 className="marquee-heading">{teaser.title}</h2>
        <p className="marquee-subtext">
          {teaser.body}
          {teaser.strong ? (
            <>
              {" "}
              <strong>{teaser.strong}</strong>
            </>
          ) : null}
        </p>
      </div>
      <div className="marquee-track" aria-hidden="true">
        <div className="marquee-inner">
          {doubled.map((studio, i) => (
            <div key={`studio-${studio.id}-${i}`} className="marquee-card-wrap marquee-card-wrap--studio">
              <div className="npc-hero-preview-card">
                <StudioCard studio={studio} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function ChatPreviewSection({
  copy,
  profile,
  mode
}: {
  copy: LandingCopy;
  profile: TalentProfile;
  mode: Audience;
}) {
  const isDev = mode === "developer";

  const devMessages: ReadonlyArray<{ side: "out" | "in"; text: string; time: string }> = [
    { side: "in", text: "Hey! Sparked on your combat card — love the scope breakdown.", time: "3:12 PM" },
    { side: "out", text: "Thanks! Free from next Monday. $65/hr or happy to scope a milestone.", time: "3:14 PM" },
    { side: "in", text: "Works for us. 6-week scope: combat + dodge system. Existing codebase.", time: "3:15 PM" },
    { side: "out", text: "That works. Can we jump on a quick 15-min call?", time: "3:16 PM" },
    { side: "in", text: "Call booked. Tuesday at 3pm. Sending details now.", time: "3:17 PM" }
  ];

  const studioMessages: ReadonlyArray<{ side: "out" | "in"; text: string; time: string }> = [
    { side: "out", text: "Hey! Sparked on your combat card — love the scope breakdown.", time: "3:12 PM" },
    { side: "in", text: "Thanks! Free from next Monday. $65/hr or happy to scope a milestone.", time: "3:14 PM" },
    { side: "out", text: "Works for us. 6-week scope: combat + dodge system. Existing codebase.", time: "3:15 PM" },
    { side: "in", text: "That works. Can we jump on a quick 15-min call?", time: "3:16 PM" },
    { side: "out", text: "Call booked. Tuesday at 3pm. Sending details now.", time: "3:17 PM" }
  ];

  const messages = isDev ? devMessages : studioMessages;
  const contactName = isDev ? "eclipse studios" : profile.name.toLowerCase();
  const chatAvatarUrl =
    "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-E3EC434BF92DD2F46E81D91592065FD9-Png/150/150/AvatarHeadshot/Png/noFilter";

  return (
    <div className="chat-section-shell-outer">
      <section data-reveal="pending" className="glass-section chat-section" id="chat">
        <div className="section-copy chat-section-copy">
          <div className="section-index-row">
            <span className="section-index" aria-hidden>
              05
            </span>
            <div>
              <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: "var(--wg-muted)", letterSpacing: "0.08em" }}>
                {copy.chatPreview.kicker}
              </p>
              <h2 style={{ margin: 0 }}>{copy.chatPreview.headline}</h2>
            </div>
          </div>
          <p>{copy.chatPreview.body}</p>
        </div>

        <div className="glass-card chat-preview-shell chat-preview-shell-clean" style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.06, pointerEvents: "none" }} aria-hidden>
            <PaperTexture speed={0} scale={3} contrast={0.15} />
          </div>
          <div className="chat-window-topbar" style={{ position: "relative", zIndex: 1 }}>
            <div className="chat-window-topbar-left">
              <button type="button" className="chat-back-btn" aria-label="Decorative back button">
                <IconArrowLeft />
                <span>Back</span>
              </button>
              <div className="chat-window-identity">
                <div className="chat-topbar-avatar chat-roblox-avatar" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={chatAvatarUrl} alt="" />
                  <span className="avatar-status-dot" />
                </div>
                <div>
                  <strong>
                    {contactName}
                    <span className="verified-dot is-active" aria-hidden="true">
                      <IconCheck />
                    </span>
                  </strong>
                  <em>
                    <span className="online-dot" />
                    Online
                  </em>
                </div>
              </div>
            </div>
            <div className="chat-window-actions">
              <motion.button
                type="button"
                className="chat-view-profile-btn"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
              >
                View full profile <IconArrowUpRight />
              </motion.button>
              <button type="button" className="chat-more-btn" aria-label="Decorative more menu">
                •••
              </button>
            </div>
          </div>

          <aside className="chat-profile-panel" aria-label="Chat profile summary" style={{ position: "relative", zIndex: 1 }}>
            <div className="chat-profile-top">
              <div className="chat-profile-avatar chat-roblox-avatar">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={chatAvatarUrl} alt="" />
                <span className="avatar-status-dot" />
              </div>
              <div>
                <div className="hero-card-name-row">
                  <h3>{contactName}</h3>
                  <span className="verified-dot is-active" aria-hidden="true">
                    <IconCheck />
                  </span>
                </div>
                <p className="hero-card-role">{isDev ? "Roblox studio" : profile.label}</p>
                <p className="hero-card-availability">
                  <span />
                  {isDev ? "Hiring now" : profile.availability}
                </p>
              </div>
            </div>

            <p className="chat-profile-summary" style={{ marginTop: 12 }}>
              {isDev
                ? "Eclipse Studios ships combat-focused games. 4M plays/mo. Rate: $60–85/hr. Scope explained upfront."
                : profile.headline}
            </p>
            <p style={{ marginTop: 10, fontSize: 12, fontWeight: 700 }}>
              <IconShield style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
              98% match
            </p>
          </aside>

          <div className="chat-thread-panel" style={{ position: "relative", zIndex: 1 }}>
            <div className="chat-thread-top">
              <span className="chat-day-pill">
                <strong>{copy.chatPreview.threadLabel}</strong>
                <em>3:17 PM</em>
              </span>
            </div>

            <div className="chat-bubble-list">
              {messages.map((message, index) => (
                <div key={`${index}-${message.time}`} className={`chat-row is-${message.side}`}>
                  {message.side === "in" ? (
                    <div className="chat-mini-avatar" aria-hidden="true">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={chatAvatarUrl} alt="" />
                      <span className="avatar-status-dot" />
                    </div>
                  ) : null}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ delay: index * 0.12, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {message.side === "in" ? (
                      <span className="chat-typing" aria-hidden>
                        <span />
                        <span />
                        <span />
                      </span>
                    ) : null}
                    {message.text}
                    <time>
                      {message.time}
                      {message.side === "out" ? <ChatReadIcon /> : null}
                    </time>
                  </motion.p>
                </div>
              ))}
            </div>

            <div className="chat-composer chat-composer-clean" aria-label="Decorative message composer">
              <span className="chat-composer-icon" aria-hidden="true">
                <IconPaperclip />
              </span>
              <em>{copy.chatPreview.composerHint(contactName)}</em>
              <span className="chat-composer-icon" aria-hidden="true">
                <IconSmile />
              </span>
              <button type="button" className="chat-send-btn" aria-label="Decorative send button">
                <IconSend />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FriendlyFAQ({ copy }: { copy: LandingCopy }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section data-reveal="pending" className="glass-section faq-section" id="faq">
      <div className="section-copy">
        <div className="section-index-row">
          <span className="section-index" aria-hidden>
            06
          </span>
          <div>
            <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: "var(--wg-muted)", letterSpacing: "0.08em" }}>
              {copy.faq.kicker}
            </p>
            <h2 style={{ margin: 0 }}>{copy.faq.title}</h2>
          </div>
        </div>
      </div>

      <div className="faq-list">
        {copy.faq.items.map((faq, index) => {
          const isOpen = openFaq === index;

          return (
            <article key={faq.question} className="glass-card faq-card">
              <button
                type="button"
                className="faq-trigger"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                onClick={() => setOpenFaq(isOpen ? null : index)}
              >
                <span>{faq.question}</span>
                <motion.span
                  className={`faq-icon${isOpen ? " is-open" : ""}`}
                  aria-hidden
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                >
                  <IconChevronDown />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    key={`faq-${index}`}
                    id={`faq-answer-${index}`}
                    className="faq-response"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    style={{ overflow: "hidden" }}
                  >
                    <p style={{ margin: 0 }}>{faq.answer}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function FooterCTA({ copy, mode }: { copy: LandingCopy; mode: Audience }) {
  const benefitIcon = (key: "shield" | "code" | "user" | "folder") => {
    if (key === "shield") return <IconShield />;
    if (key === "code") return <IconCode />;
    if (key === "user") return <IconUser />;
    return <IconFolder />;
  };

  return (
    <footer className="glass-footer glass-footer-cta-band" data-mode={mode}>
      <div className="glass-footer-inner">
        <div className="glass-footer-cta-grid" style={{ gridTemplateColumns: "1fr", maxWidth: 720, margin: "0 auto" }}>
          <div className="glass-footer-copy-col" style={{ alignItems: "center", textAlign: "center" }}>
            <span className="glass-footer-badge">{copy.waitlist.kicker}</span>
            <h2 className="glass-footer-headline">{copy.waitlist.headline}</h2>
            <p className="glass-footer-sub">{copy.waitlist.subhead}</p>
            <div className="glass-footer-benefits" aria-label="Beta benefits">
              {copy.waitlist.benefits.map(([title, body, iconKey]) => (
                <div key={title} className="glass-footer-benefit">
                  <span className="glass-footer-benefit-icon" aria-hidden="true">
                    {benefitIcon(iconKey)}
                  </span>
                  <div className="glass-footer-benefit-text">
                    <strong>{title}</strong>
                    <span>{body}</span>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 16 }}>
              <Link href="/find-invite" className="glass-nav-subtle" style={{ fontWeight: 700 }}>
                Already have an invite? →
              </Link>
            </p>
            <div className="glass-footer-brand-block" style={{ marginTop: 24 }}>
              <span className="glass-footer-wordmark">weld.</span>
              <p className="glass-footer-tagline">{copy.footer.tagline}</p>
              <nav className="glass-footer-links" aria-label="Legal">
                <a href={`${WAITLIST_URL}/privacy`}>{copy.footer.privacy}</a>
                <a href={`${WAITLIST_URL}/terms`}>{copy.footer.terms}</a>
                <a href={`${WAITLIST_URL}/contact`}>{copy.footer.contact}</a>
              </nav>
            </div>
          </div>
        </div>
        <p className="glass-footer-copyright">© {new Date().getFullYear()} weld.</p>
      </div>
    </footer>
  );
}

function ModeToggle({
  mode,
  labels,
  onChange
}: {
  mode: Audience;
  labels: { developer: string; studio: string };
  onChange: (mode: Audience) => void;
}) {
  return (
    <div className="mode-toggle" role="radiogroup" aria-label="Audience mode">
      <span className={mode === "studio" ? "is-studio" : ""} aria-hidden="true" />
      <button type="button" role="radio" aria-checked={mode === "developer"} onClick={() => onChange("developer")}>
        {labels.developer}
      </button>
      <button type="button" role="radio" aria-checked={mode === "studio"} onClick={() => onChange("studio")}>
        {labels.studio}
      </button>
    </div>
  );
}

function socialIconKey(label: string) {
  const normalized = label.toLowerCase();
  if (normalized === "x") return "linkedin";
  return normalized.replace(/[^a-z0-9]+/g, "-");
}

function SocialIcon({ label }: { label: string }) {
  const key = socialIconKey(label);
  if (key === "roblox") return <RobloxIcon />;
  if (key === "discord") return <DiscordIcon />;
  if (key === "github") return <GithubIcon />;
  if (key === "linkedin") return <LinkedInIcon />;
  return <ArrowUpRightIcon />;
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 10.5 8.2 13.7 15 6.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12.4a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.8 20.2c.7-3.7 3.3-5.6 7.2-5.6s6.5 1.9 7.2 5.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3.6 19 6v5.3c0 4.4-2.6 7.5-7 9.1-4.4-1.6-7-4.7-7-9.1V6l7-2.4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m8.7 12.1 2.2 2.1 4.4-4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3.8 7.5h6l1.8 2h8.6v9.2H3.8V7.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M3.8 10.1h16.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m9.4 7.4-4.1 4.4 4.1 4.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m14.6 7.4 4.1 4.4-4.1 4.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m13.1 5.7-2.2 12.6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7.6V12l3.1 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RobloxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M5.2 3.8 20.2 7l-3.1 15-15-3.1 3.1-15Zm5.3 6.5-.8 4 4 .8.8-4-4-.8Z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.7 6.4A15 15 0 0 0 15 5.2l-.4.9a12.9 12.9 0 0 0-5.2 0L9 5.2a15 15 0 0 0-3.7 1.2c-2.3 3.4-2.9 6.7-2.6 10a15 15 0 0 0 4.6 2.3l.9-1.5c-.5-.2-1-.4-1.5-.7l.4-.3c2.9 1.4 6.1 1.4 9 0l.4.3c-.5.3-1 .5-1.5.7l.9 1.5a15 15 0 0 0 4.6-2.3c.4-3.8-.7-7-2.8-10Zm-9.5 7.9c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Zm5.6 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3.2a8.9 8.9 0 0 0-2.8 17.3c.4.1.6-.2.6-.4v-1.7c-2.5.6-3-1.1-3-1.1-.4-1-.9-1.3-.9-1.3-.8-.5.1-.5.1-.5.9.1 1.4.9 1.4.9.8 1.4 2.1 1 2.6.8.1-.6.3-1 .6-1.2-2-.2-4.1-1-4.1-4.4 0-1 .3-1.8.9-2.4-.1-.2-.4-1.2.1-2.4 0 0 .8-.2 2.5.9a8.7 8.7 0 0 1 4.5 0c1.7-1.1 2.5-.9 2.5-.9.5 1.2.2 2.2.1 2.4.6.6.9 1.4.9 2.4 0 3.4-2.1 4.2-4.1 4.4.3.3.6.9.6 1.8v2.7c0 .2.2.5.6.4A8.9 8.9 0 0 0 12 3.2Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.8 8.9h3.1v10H6.8v-10Zm1.6-4.8a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6Zm3.5 4.8h3v1.4h.1c.4-.8 1.5-1.7 3-1.7 3.2 0 3.8 2.1 3.8 4.8v5.5h-3.1V14c0-1.2 0-2.7-1.7-2.7s-1.9 1.3-1.9 2.6v5h-3.1v-10Z" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M12.5 5 7.5 10l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M6 14 14 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7 6h7v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5.5 5.5 14.5 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14.5 5.5 5.5 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 15.2c-4.4-2.7-6.5-5-6.5-7.7 0-1.9 1.4-3.3 3.2-3.3 1.2 0 2.4.6 3.3 1.8.9-1.2 2.1-1.8 3.3-1.8 1.8 0 3.2 1.4 3.2 3.3 0 2.7-2.1 5-6.5 7.7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HowStepIcon({ icon }: { icon: HowItWorksIcon }) {
  if (icon === "card") return <CardProofIcon />;
  if (icon === "shield") return <ShieldCheckIcon />;
  if (icon === "spark") return <StepSparkIcon />;
  if (icon === "search") return <SearchRoleIcon />;
  if (icon === "message") return <MessageProofIcon />;
  return <HandshakeIcon />;
}

function HowStepArrowIcon() {
  return (
    <svg viewBox="0 0 28 18" fill="none" aria-hidden="true">
      <path d="M2 9h22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="m18 3 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CardProofIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="12" y="8" width="24" height="32" rx="5" fill="rgba(255, 255, 255, 0.72)" stroke="currentColor" strokeWidth="2" />
      <path d="M18 18h12M18 25h9M18 32h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="34" cy="33" r="7" fill="rgba(255, 214, 102, 0.42)" stroke="currentColor" strokeWidth="2" />
      <path d="m31.5 33.1 1.8 1.8 3.4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 6 38 11v10c0 9.3-5.8 16.8-14 20-8.2-3.2-14-10.7-14-20V11l14-5Z" fill="rgba(111, 231, 168, 0.24)" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="24" cy="23" r="8" fill="rgba(63, 211, 139, 0.46)" stroke="currentColor" strokeWidth="2" />
      <path d="m20.5 23.1 2.4 2.4 5-5.6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StepSparkIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="m27 4-15 23h11l-3 17 16-24H25l2-16Z" fill="rgba(255, 211, 87, 0.5)" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M11 12h6M34 34h5M8 35h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function HandshakeIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M18 27 28.5 16.5c2.2-2.2 5.7-2.2 7.9 0l2.4 2.4-12 12" fill="rgba(119, 207, 231, 0.26)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 29.5 20.5 20c-2-2-5.2-2-7.2 0l-4.1 4.1 12.1 12.1c1.7 1.7 4.5 1.7 6.2 0l4.9-4.9c.9-.9.9-2.4 0-3.3-.9-.9-2.4-.9-3.3 0l-4.4 4.4" fill="rgba(255, 214, 102, 0.3)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchRoleIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="9" y="10" width="25" height="25" rx="6" fill="rgba(255, 255, 255, 0.68)" stroke="currentColor" strokeWidth="2" />
      <path d="M16 18h11M16 24h8M16 30h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="31" r="6" fill="rgba(120, 112, 255, 0.22)" stroke="currentColor" strokeWidth="2" />
      <path d="m36.5 35.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MessageProofIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M10 13h28a5 5 0 0 1 5 5v12a5 5 0 0 1-5 5H25l-8 6v-6h-7a5 5 0 0 1-5-5V18a5 5 0 0 1 5-5Z" fill="rgba(255, 255, 255, 0.7)" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 22h16M16 28h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="m32 28 2.2 2.2 4.3-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="m10 2 1.9 5.4L17 9l-5.1 1.6L10 16l-1.9-5.4L3 9l5.1-1.6L10 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path d="m5.5 7.5 4.5 4.8 4.5-4.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HandRaisedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11M12 11V4.5a1.5 1.5 0 0 1 3 0V11M15 11V6a1.5 1.5 0 0 1 3 0v8c0 3.5-2.5 6-6 6h-1c-2.4 0-3.7-1.2-5-3l-2.7-4.2c-.5-.8-.2-1.8.7-2.2.7-.4 1.6-.2 2 .5L9 14V7a1.5 1.5 0 0 1 3 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatReadIcon() {
  return (
    <svg viewBox="0 0 16 12" fill="none" aria-hidden="true">
      <path d="M1 6.5 4.2 9.5 10 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6.5 9.2 9.5 15 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16.5 6.5 8.7 14.3a2.5 2.5 0 0 0 3.5 3.5l8.5-8.5a4 4 0 0 0-5.7-5.7l-9 9a5.5 5.5 0 0 0 7.8 7.8L21 13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmojiIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.5 14.5c.8 1.2 2 2 3.5 2s2.7-.8 3.5-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12 19 5l-3 14-4-6-7-1Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.18"
      />
    </svg>
  );
}

function ReturningModal({ inviteUrl, onDismiss }: { inviteUrl: string; onDismiss: () => void }) {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => router.push(inviteUrl), 2500);
    return () => window.clearTimeout(timer);
  }, [inviteUrl, router]);

  return (
    <div className="returning-modal-overlay" onClick={onDismiss}>
      <div className="returning-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="returning-modal-icon">✓</div>
        <h2 className="returning-modal-title">You&rsquo;re already on the list.</h2>
        <p className="returning-modal-body">Your weld. invite is waiting for you.</p>
        <p className="returning-modal-hint">Taking you there now&hellip;</p>
      </div>
    </div>
  );
}
