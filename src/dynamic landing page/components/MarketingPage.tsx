"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode
} from "react";

import {
  captureAttributionFromLocation,
  persistAudiencePreference,
  submitSignupCapture,
  trackEvent
} from "@/dynamic landing page/lib/browser";
import type { SourceVariant } from "@/dynamic landing page/lib/source-variant";
import type { Audience } from "@/dynamic landing page/lib/types";
import { useMotionPolicy } from "@/dynamic landing page/lib/useMotionPolicy";

interface MarketingPageProps {
  initialMode: Audience;
  sourceVariant: SourceVariant;
  page: "landing" | "studios";
}

type RoleKey =
  | "scripter"
  | "builder"
  | "ui"
  | "vfx"
  | "animator"
  | "designer"
  | "systems";

type SwipeState = "idle" | "reject" | "like" | "spark";
type CapturePhase = "idle" | "submitting" | "success" | "error";
type DetailKey = "verified" | "projects" | "reliability" | "latest" | "feedback";

interface TalentProfile {
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

const ROLE_ORDER: RoleKey[] = [
  "scripter",
  "builder",
  "ui",
  "vfx",
  "animator",
  "designer",
  "systems"
];

const ROLE_LABELS: Record<RoleKey, string> = {
  scripter: "Scripter",
  builder: "Builder",
  ui: "UI Design",
  vfx: "VFX",
  animator: "Animator",
  designer: "Game Design",
  systems: "Systems"
};

const MODE_COPY = {
  developer: {
    toggle: "I'm a developer",
    navCta: "Join as a developer",
    heroTitle: "The talent network for Roblox.",
    heroCopy: "Link your games, set your rate, and match with studios that actually ship.",
    heroSupport:
      "Weld turns shipped work, rates, availability, links, and proof into swipeable talent cards studios can trust.",
    cardFrame: "Your profile preview",
    detailHeading: "Turn Roblox work into a card studios can trust.",
    detailBody:
      "One profile holds role, proof, links, rate, availability, and live work context without rebuilding your pitch every time.",
    waitlistTitle: "Get early access to Weld.",
    waitlistBody:
      "Join developer beta to shape proof-first talent cards before public launch.",
    waitlistPlaceholder: "you@example.com",
    waitlistButton: "Join as a developer",
    scoutTitle: "Studios see fit fast.",
    scoutBody:
      "Your card stays readable under pressure: who you are, what you do, how you charge, and what proves it."
  },
  studio: {
    toggle: "I'm a studio",
    navCta: "Get hiring access",
    heroTitle: "The talent network for Roblox.",
    heroCopy: "Link your games, set your rate, and match with studios that actually ship.",
    heroSupport:
      "Weld turns shipped work, rates, availability, links, and proof into swipeable talent cards studios can trust.",
    cardFrame: "Candidate preview",
    detailHeading: "Scout Roblox talent without Discord chaos.",
    detailBody:
      "Studios get one clear card for rate, availability, proof, links, and recent work instead of scattered bios and DMs.",
    waitlistTitle: "Get hiring access to Weld.",
    waitlistBody:
      "Join studio beta to shape faster scouting, clearer proof, and better first conversations.",
    waitlistPlaceholder: "studio@example.com",
    waitlistButton: "Get hiring access",
    scoutTitle: "Hire with context before first DM.",
    scoutBody:
      "Same product, different frame: card-first scouting that helps your team compare fit quickly and honestly."
  }
} as const;

const FAQS = [
  {
    question: "Are these real marketplace stats?",
    answer:
      "No. Card content is illustrative product demo data that shows how Weld packages proof, links, rate, and availability."
  },
  {
    question: "Does this change backend waitlist flow?",
    answer:
      "No. Landing redesign keeps current signup capture, invite redirect, attribution, and analytics behavior."
  },
  {
    question: "Who is Weld for?",
    answer:
      "Roblox developers who want better-fit work and studios that want to scout talent with more context."
  }
] as const;

const NAV_ITEMS = [
  { href: "#how", label: "What it does" },
  { href: "#profile", label: "Profile" },
  { href: "#chat", label: "Chat" },
  { href: "#proof", label: "Proof" },
  { href: "#faq", label: "FAQ" }
] as const;

const WAITLIST_URL = "https://weldroblox.com";

const PROFILES: Record<RoleKey, TalentProfile> = {
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

function nextRole(role: RoleKey) {
  const currentIndex = ROLE_ORDER.indexOf(role);
  return ROLE_ORDER[(currentIndex + 1) % ROLE_ORDER.length];
}

function joinHref(mode: Audience, search: string) {
  const base = mode === "studio" ? "/studios" : "/";
  return search ? `${base}?${search}` : base;
}

function scrollToId(id: string) {
  if (typeof window === "undefined") {
    return;
  }

  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function MarketingPage(props: MarketingPageProps) {
  return <WeldLandingPage {...props} />;
}

function WeldLandingPage({
  initialMode,
  sourceVariant,
  page
}: MarketingPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const motionTier = useMotionPolicy();
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<Audience>(initialMode);
  const [role, setRole] = useState<RoleKey>("scripter");
  const [swipeState, setSwipeState] = useState<SwipeState>("idle");
  const [detailKey, setDetailKey] = useState<DetailKey | null>(null);
  const [email, setEmail] = useState("");
  const [capturePhase, setCapturePhase] = useState<CapturePhase>("idle");
  const [captureStatus, setCaptureStatus] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const captureRef = useRef<HTMLDivElement | null>(null);

  const activeProfile = PROFILES[role];
  const modeCopy = MODE_COPY[mode];
  const activeDetail = detailKey ? activeProfile.proofDetails[detailKey] : null;

  useEffect(() => {
    captureAttributionFromLocation();
  }, []);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

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

    setMode(nextMode);
    persistAudiencePreference(nextMode);
    setCaptureStatus("");
    setCapturePhase("idle");

    void trackEvent({
      eventName: "landing_mode_changed",
      page,
      audience: nextMode,
      payload: { from: mode, to: nextMode }
    });

    startTransition(() => {
      router.push(joinHref(nextMode, searchString));
    });
  }

  function handleRoleChange(nextRoleKey: RoleKey) {
    if (nextRoleKey === role) {
      return;
    }

    setRole(nextRoleKey);
    setSwipeState("idle");
    setDetailKey(null);

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
  }

  function handleLearnMore() {
    void trackEvent({
      eventName: "landing_learn_more_clicked",
      page,
      audience: mode,
      payload: { role }
    });

    scrollToId("how");
  }

  function handleSwipe(nextState: Exclude<SwipeState, "idle">) {
    setSwipeState(nextState);
    setDetailKey(null);

    void trackEvent({
      eventName: "landing_card_action",
      page,
      audience: mode,
      payload: { role, action: nextState }
    });

    if (nextState === "reject") {
      window.setTimeout(
        () => {
          setRole((current) => nextRole(current));
          setSwipeState("idle");
        },
        motionTier === "reduced" ? 80 : 340
      );
      return;
    }

    if (nextState === "spark") {
      window.setTimeout(() => scrollToId("join"), motionTier === "reduced" ? 0 : 180);
    }

    window.setTimeout(
      () => setSwipeState("idle"),
      motionTier === "reduced" ? 600 : 1100
    );
  }

  async function handleCapture() {
    if (!email.trim()) {
      setCapturePhase("error");
      setCaptureStatus("Add your email to join early access.");
      captureRef.current?.querySelector("input")?.focus();
      return;
    }

    setCapturePhase("submitting");
    setCaptureStatus("Joining...");

    try {
      const response = await submitSignupCapture({
        email,
        audience: mode,
        source: "final",
        page,
        variant: sourceVariant
      });

      setCapturePhase("success");
      setCaptureStatus("You're on list. Opening your invite...");

      window.setTimeout(() => {
        router.push(response.inviteUrl || `/invite/${response.inviteCode}`);
      }, motionTier === "reduced" ? 0 : 500);
    } catch {
      setCapturePhase("error");
      setCaptureStatus("Something went wrong. Try again in a moment.");
    }
  }

  return (
    <div
      className="weld-glass-page"
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
        searchString={searchString}
        pending={isPending}
        onModeChange={handleModeChange}
        onJoinClick={() => handleJoinIntent("nav")}
      />

      <main className="weld-glass-main">
        <HeroShell>
          <HeroTalentCard
            mode={mode}
            profile={activeProfile}
            swipeState={swipeState}
            onDetailToggle={setDetailKey}
            activeDetailKey={detailKey}
          />
          <HeroCopyPanel
            copy={modeCopy}
            onJoinClick={() => handleJoinIntent("hero")}
            onLearnMore={handleLearnMore}
          />
        </HeroShell>

        <HowItWorksSection
          role={role}
          profile={activeProfile}
          onRoleChange={handleRoleChange}
        />

        <ProfileCreationSection mode={mode} profile={activeProfile} />

        <ChatPreviewSection mode={mode} profile={activeProfile} />

        <AntiDiscordSection mode={mode} />

        <ProofTrustSection
          mode={mode}
          profile={activeProfile}
          swipeState={swipeState}
          onDetailToggle={setDetailKey}
          onSwipe={handleSwipe}
        />

        <StudioScoutSection copy={modeCopy} />

        <WaitlistSignupSection
          mode={mode}
          copy={modeCopy}
          email={email}
          phase={capturePhase}
          status={captureStatus}
          captureRef={captureRef}
          onEmailChange={setEmail}
          onSubmit={() => void handleCapture()}
        />

        <FriendlyFAQ openFaq={openFaq} onToggle={setOpenFaq} />
      </main>

      <FooterCTA />

      {activeDetail ? (
        <ProofDetailDialog
          title={activeDetail.title}
          body={activeDetail.body}
          onClose={() => setDetailKey(null)}
        />
      ) : null}
    </div>
  );
}

function GlassNav({
  mode,
  searchString,
  pending,
  onModeChange,
  onJoinClick
}: {
  mode: Audience;
  searchString: string;
  pending?: boolean;
  onModeChange: (mode: Audience) => void;
  onJoinClick: () => void;
}) {
  return (
    <header className="glass-nav-shell">
      <Link href={joinHref(mode, searchString)} className="glass-brand" aria-label="Weld home">
        <span className="glass-brand-mark">
          <Image src="/Assets/weld-logo-official.svg" alt="" width={24} height={24} priority />
        </span>
        <span>weld.</span>
      </Link>

      <ModeToggle mode={mode} disabled={pending} onChange={onModeChange} />

      <nav className="glass-nav-links" aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
        <Link href="/login">Log in</Link>
        <a
          href="#join"
          className="button-primary button-nav"
          onClick={(event) => {
            event.preventDefault();
            onJoinClick();
          }}
        >
          {MODE_COPY[mode].navCta}
        </a>
      </nav>
    </header>
  );
}

function HeroShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="hero-shell" id="top">
      <div className="hero-shell-bloom" aria-hidden="true" />
      <div className="hero-shell-grid">{children}</div>
    </section>
  );
}

function HeroCopyPanel({
  copy,
  onJoinClick,
  onLearnMore
}: {
  copy: (typeof MODE_COPY)[Audience];
  onJoinClick: () => void;
  onLearnMore: () => void;
}) {
  return (
    <div className="hero-copy-panel">
      <span className="hero-mode-pill">{copy.toggle}</span>
      <h1>{copy.heroTitle}</h1>
      <p className="hero-lead">{copy.heroCopy}</p>
      <p className="hero-support">{copy.heroSupport}</p>

      <div className="hero-button-row">
        <a
          href="#join"
          className="button-primary"
          onClick={(event) => {
            event.preventDefault();
            onJoinClick();
          }}
        >
          {copy.navCta}
        </a>
        <button type="button" className="button-secondary" onClick={onLearnMore}>
          Learn more
        </button>
      </div>

      <div className="hero-proof-line" aria-label="Landing focus">
        <span><CheckIcon /> Developer-first</span>
        <span><CheckIcon /> Trust and proof</span>
        <span><CheckIcon /> Clean hierarchy</span>
      </div>
    </div>
  );
}

function HeroTalentCard({
  mode,
  profile,
  swipeState,
  activeDetailKey,
  onDetailToggle
}: {
  mode: Audience;
  profile: TalentProfile;
  swipeState: SwipeState;
  activeDetailKey: DetailKey | null;
  onDetailToggle: (key: DetailKey | null) => void;
}) {
  const heroStats: Array<{
    detailKey: DetailKey;
    label: string;
    value: string;
    icon: ReactNode;
  }> = [
    { detailKey: "projects", label: profile.years, value: "Experience", icon: <UserIcon /> },
    { detailKey: "latest", label: "75+", value: "Projects", icon: <FolderIcon /> },
    { detailKey: "feedback", label: "250+", value: "Scripts Built", icon: <CodeIcon /> },
    { detailKey: "reliability", label: "100%", value: "On-time", icon: <ClockIcon /> }
  ];

  return (
    <div className="hero-card-column">
      <div className="hero-card-frame">
        <span>{MODE_COPY[mode].cardFrame}</span>
        <span>{profile.matchScore}% match</span>
      </div>

      <article className={`hero-talent-card is-${swipeState}`}>
        <div className="hero-card-masthead">
          <button
            type="button"
            className={`profile-avatar-shell hero-avatar-shell ${activeDetailKey === "verified" ? "is-active" : ""}`}
            aria-label="Open verified proof"
            aria-expanded={activeDetailKey === "verified"}
            onClick={() => onDetailToggle(activeDetailKey === "verified" ? null : "verified")}
          >
            <div className="profile-avatar">
              <span className="avatar-hair" />
              <span className="avatar-face">
                <span className="avatar-mouth" />
              </span>
              <span className="avatar-hoodie" />
            </div>
            <span className="avatar-status-dot" />
          </button>

          <div className="hero-social-row" aria-label="Profile link types">
            {profile.links.map((link) => (
              <span key={link.label} className={`hero-social-icon is-${socialIconKey(link.label)}`} title={link.label}>
                <SocialIcon label={link.label} />
              </span>
            ))}
          </div>

          <div className="hero-stat-panel" aria-label="Profile proof stats">
            {heroStats.map((stat) => {
              const active = activeDetailKey === stat.detailKey;

              return (
                <button
                  key={stat.value}
                  type="button"
                  className={`hero-stat-chip ${active ? "is-active" : ""}`}
                  aria-expanded={active}
                  onClick={() => onDetailToggle(active ? null : stat.detailKey)}
                >
                  {stat.icon}
                  <strong>{stat.label}</strong>
                  <span>{stat.value}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="hero-card-identity hero-card-identity-stacked">
          <div className="hero-card-name-row">
            <h2>{profile.name}</h2>
            <button
              type="button"
              className={`verified-dot ${activeDetailKey === "verified" ? "is-active" : ""}`}
              aria-label="Open verified proof"
              aria-expanded={activeDetailKey === "verified"}
              onClick={() => onDetailToggle(activeDetailKey === "verified" ? null : "verified")}
            >
              <CheckIcon />
            </button>
          </div>
          <p className="hero-card-role">{profile.label}</p>
          <p className="hero-card-availability">
            <span />
            {profile.availability}
          </p>
        </div>

        <div className="hero-card-divider" />

        <p className="hero-card-headline">{profile.headline}</p>

        <div className="hero-card-commerce-row">
          <div className="hero-rate-pill">
            <span>Rate</span>
            <strong>{profile.rate}</strong>
            <em>{profile.payment}</em>
          </div>

          <div className="hero-skill-grid" aria-label="Services">
            {profile.services.map((service) => (
              <span key={service}>{service}</span>
            ))}
          </div>
        </div>

        <div className="hero-card-bottom-actions">
          <button type="button" className="hero-link-action" onClick={() => onDetailToggle("latest")}>
            <GamepadIcon />
            <span>
              <strong>Games</strong>
              <em>See games I&apos;ve worked on</em>
            </span>
            <ArrowUpRightIcon />
          </button>
          <button type="button" className="hero-link-action" onClick={() => onDetailToggle("projects")}>
            <FolderIcon />
            <span>
              <strong>My Work</strong>
              <em>View projects I&apos;ve built</em>
            </span>
            <ArrowUpRightIcon />
          </button>
        </div>
      </article>
    </div>
  );
}

function RoleTalentExplorer({
  role,
  profile,
  onRoleChange
}: {
  role: RoleKey;
  profile: TalentProfile;
  onRoleChange: (role: RoleKey) => void;
}) {
  const buttonRefs = useRef<Partial<Record<RoleKey, HTMLButtonElement | null>>>({});

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentRole: RoleKey) {
    const currentIndex = ROLE_ORDER.indexOf(currentRole);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % ROLE_ORDER.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + ROLE_ORDER.length) % ROLE_ORDER.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = ROLE_ORDER.length - 1;
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRoleChange(currentRole);
      return;
    } else {
      return;
    }

    event.preventDefault();
    const next = ROLE_ORDER[nextIndex];
    onRoleChange(next);
    buttonRefs.current[next]?.focus();
  }

  return (
    <section className="glass-section how-story-section" id="how">
      <div className="how-story-grid">
        <div className="section-copy how-story-copy">
          <span className="section-kicker">How it works</span>
          <h2>Clarity first. Friction later.</h2>
          <p>Role-first cards, not generic profiles.</p>
          <p>
            Switch roles and watch same system adapt. Card stays readable while proof, links, and pricing remain honest.
          </p>

          <div className="role-explorer-tabs" role="radiogroup" aria-label="Choose a Roblox talent role">
            {ROLE_ORDER.map((entry) => (
              <button
                key={entry}
                ref={(node) => {
                  buttonRefs.current[entry] = node;
                }}
                type="button"
                role="radio"
                aria-checked={role === entry}
                className={role === entry ? "is-active" : ""}
                onClick={() => onRoleChange(entry)}
                onKeyDown={(event) => handleKeyDown(event, entry)}
              >
                {ROLE_LABELS[entry]}
              </button>
            ))}
          </div>
        </div>

        <article className="glass-card how-profile-card">
          <div className="how-profile-top">
            <div className="profile-avatar-shell">
              <div className="profile-avatar">
                <span className="avatar-hair" />
                <span className="avatar-face">
                  <span className="avatar-mouth" />
                </span>
                <span className="avatar-hoodie" />
              </div>
              <span className="avatar-status-dot" />
            </div>

            <div>
              <div className="hero-card-name-row">
                <h3>{profile.name}</h3>
                <span className="verified-dot"><CheckIcon /></span>
              </div>
              <p>{profile.label}</p>
              <p className="hero-card-availability"><span />{profile.availability}</p>
            </div>
          </div>
          <p>{profile.latestProject.summary}</p>
          <div className="how-proof-list">
            {profile.latestProject.bullets.map((bullet) => (
              <span key={bullet}><SparkIcon />{bullet}</span>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function HowItWorksSection({
  role,
  profile,
  onRoleChange
}: {
  role: RoleKey;
  profile: TalentProfile;
  onRoleChange: (role: RoleKey) => void;
}) {
  const buttonRefs = useRef<Partial<Record<RoleKey, HTMLButtonElement | null>>>({});
  const steps = [
    ["1", "Build your card", "Add your role, rate, skills, links, proof, and projects."],
    ["2", "We verify proof", "We check links, projects, and activity so studios can trust your card."],
    ["3", "Studios match & Spark", "Studios swipe, match, and Spark the talent they want to hire."],
    ["4", "You get hired", "Chat, agree, build, and get paid with clearer context."]
  ] as const;

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentRole: RoleKey) {
    const currentIndex = ROLE_ORDER.indexOf(currentRole);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % ROLE_ORDER.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + ROLE_ORDER.length) % ROLE_ORDER.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = ROLE_ORDER.length - 1;
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRoleChange(currentRole);
      return;
    } else {
      return;
    }

    event.preventDefault();
    const next = ROLE_ORDER[nextIndex];
    onRoleChange(next);
    buttonRefs.current[next]?.focus();
  }

  return (
    <section className="glass-section how-story-section" id="how">
      <div className="how-story-grid">
        <div className="section-copy how-story-copy">
          <span className="section-kicker">How it works</span>
          <h2>Clarity first. Friction later.</h2>
          <p>Role-first cards, not generic profiles.</p>
          <p>
            Switch roles and watch same system adapt. Card stays readable while proof, links, and pricing remain honest.
          </p>

          <div className="role-explorer-tabs" role="radiogroup" aria-label="Choose a Roblox talent role">
            {ROLE_ORDER.map((entry) => (
              <button
                key={entry}
                ref={(node) => {
                  buttonRefs.current[entry] = node;
                }}
                type="button"
                role="radio"
                aria-checked={role === entry}
                className={role === entry ? "is-active" : ""}
                onClick={() => onRoleChange(entry)}
                onKeyDown={(event) => handleKeyDown(event, entry)}
              >
                {ROLE_LABELS[entry]}
              </button>
            ))}
          </div>
        </div>

        <article className="glass-card how-profile-card">
          <div className="how-profile-top">
            <div className="profile-avatar-shell">
              <div className="profile-avatar">
                <span className="avatar-hair" />
                <span className="avatar-face">
                  <span className="avatar-mouth" />
                </span>
                <span className="avatar-hoodie" />
              </div>
              <span className="avatar-status-dot" />
            </div>

            <div>
              <div className="hero-card-name-row">
                <h3>{profile.name}</h3>
                <span className="verified-dot"><CheckIcon /></span>
              </div>
              <p>{profile.label}</p>
              <p className="hero-card-availability"><span />{profile.availability}</p>
            </div>
          </div>
          <p>{profile.latestProject.summary}</p>
          <div className="how-proof-list">
            {profile.latestProject.bullets.map((bullet) => (
              <span key={bullet}><SparkIcon />{bullet}</span>
            ))}
          </div>
        </article>
      </div>

      <div className="glass-card step-rail">
        {steps.map(([number, title, body], index) => (
          <article key={title} className="step-card">
            <span className="step-index">{number}</span>
            <h3>{title}</h3>
            <p>{body}</p>
            {index < steps.length - 1 ? <span className="step-arrow" aria-hidden="true">→</span> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function ProfileCreationSection({
  mode,
  profile
}: {
  mode: Audience;
  profile: TalentProfile;
}) {
  const title =
    mode === "studio"
      ? "Scout Roblox talent without Discord chaos."
      : "Create a profile that proves the work.";
  const body =
    mode === "studio"
      ? "Studios see rate, availability, proof, links, and recent work in one stable shape instead of scattered bios and DMs."
      : "Developers turn roles, rates, skills, proof, and links into one readable card that keeps the pitch clean.";
  const items = [
    ["Role", profile.label],
    ["Rate", profile.rate],
    ["Availability", profile.availability],
    ["Payment", profile.payment],
    ["Proof links", "Roblox, GitHub, portfolio"],
    ["Latest project", profile.latestProject.name],
    ["Card shape stays stable.", "Same fields stay visible across roles, so comparison feels fast instead of noisy."]
  ] as const;

  return (
    <section className="glass-section profile-section profile-creation-section" id="profile">
      <div className="section-copy">
        <span className="section-kicker">Profile creation</span>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>

      <div className="glass-card profile-board">
        <div className="profile-board-avatar">
          <div className="profile-avatar-shell">
            <div className="profile-avatar">
              <span className="avatar-hair" />
              <span className="avatar-face">
                <span className="avatar-mouth" />
              </span>
              <span className="avatar-hoodie" />
            </div>
            <span className="avatar-status-dot" />
          </div>
        </div>

        <div className="profile-detail-grid">
          {items.map(([label, value]) => (
            <article key={label} className={`glass-card detail-card ${label === "Card shape stays stable." ? "profile-detail-note" : ""}`}>
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChatPreviewSection({
  mode,
  profile
}: {
  mode: Audience;
  profile: TalentProfile;
}) {
  const messages = [
    { side: "out", text: "Hey Eclipse! I’d love to ask about your availability for a project.", time: "2:34 PM" },
    { side: "out", text: "Could you give me a quick overview of your process and timeline?", time: "2:35 PM" },
    { side: "in", text: "Hey! Thanks for reaching out. Happy to help.", time: "2:36 PM" },
    { side: "in", text: "I can share more about scope, delivery timing, and how I usually work.", time: "2:36 PM" },
    { side: "out", text: "Sounds great. The project is a combat system with custom abilities and UI integration.", time: "2:37 PM" },
    { side: "in", text: "Got it. I can deliver a high-quality solution within the discussed timeframe.", time: "2:38 PM" }
  ] as const;

  const headline =
    mode === "studio"
      ? "First messages start with context."
      : "Professional chat, not scattered DMs.";

  return (
    <section className="glass-section chat-section" id="chat">
      <div className="section-copy chat-section-copy">
        <span className="section-kicker">Chat system</span>
        <h2>{headline}</h2>
        <p>
          Weld turns a match into a focused conversation with profile proof, scope, and availability beside the thread.
        </p>
      </div>

      <div className="glass-card chat-preview-shell">
        <aside className="chat-profile-panel" aria-label="Chat profile summary">
          <div className="chat-profile-top">
            <div className="profile-avatar-shell">
              <div className="profile-avatar">
                <span className="avatar-hair" />
                <span className="avatar-face">
                  <span className="avatar-mouth" />
                </span>
                <span className="avatar-hoodie" />
              </div>
              <span className="avatar-status-dot" />
            </div>
            <div>
              <div className="hero-card-name-row">
                <h3>{profile.name}</h3>
                <span className="verified-dot"><CheckIcon /></span>
              </div>
              <p>{profile.label}</p>
              <p className="hero-card-availability"><span />Online</p>
            </div>
          </div>

          <div className="chat-match-bar">
            <span><ShieldIcon /> 98% match</span>
            <i aria-hidden="true" />
          </div>

          <div className="chat-stat-grid">
            <span><UserIcon /><strong>{profile.years}</strong><em>Experience</em></span>
            <span><CheckIcon /><strong>{profile.matchScore}%</strong><em>Match</em></span>
            <span><ClockIcon /><strong>1 hr</strong><em>Replies</em></span>
          </div>

          <p className="chat-profile-summary">{profile.headline}</p>

          <div className="chat-contact-row">
            <span><RobloxIcon />Roblox</span>
            <span><GithubIcon />GitHub</span>
            <span><FolderIcon />Portfolio</span>
          </div>

          <div className="chat-professional-note">
            <SparkIcon />
            <span>
              <strong>Keep it professional</strong>
              <em>Clear scope, respectful asks, and no lost context.</em>
            </span>
          </div>
        </aside>

        <div className="chat-thread-panel">
          <div className="chat-thread-top">
            <span>Today</span>
            <span>2:39 PM</span>
          </div>

          <div className="chat-bubble-list">
            {messages.map((message) => (
              <div key={`${message.time}-${message.text}`} className={`chat-row is-${message.side}`}>
                {message.side === "in" ? (
                  <div className="chat-mini-avatar" aria-hidden="true">
                    <span />
                  </div>
                ) : null}
                <p>
                  {message.text}
                  <time>{message.time}</time>
                </p>
              </div>
            ))}
          </div>

          <div className="chat-composer" aria-label="Decorative message composer">
            <span><FolderIcon /></span>
            <em>Message {profile.name.toLowerCase()}...</em>
            <span><SparkIcon /></span>
            <button type="button" aria-label="Decorative send button">
              <ArrowUpRightIcon />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function AntiDiscordSection({ mode }: { mode: Audience }) {
  const intro =
    mode === "studio"
      ? "Replace scattered scouting with a profile, proof, and first-message trail."
      : "Replace scattered self-promotion with one profile and one professional thread.";

  const before = ["Rate buried in DMs", "Portfolio split across links", "Availability unclear", "Scope starts from zero"];
  const after = ["Role-first profile", "Verified proof fields", "Rate and availability visible", "Focused chat context"];

  return (
    <section className="glass-section anti-discord-section">
      <div className="glass-card anti-discord-shell">
        <div className="section-copy">
          <span className="section-kicker">Less Discord chaos</span>
          <h2>Weld keeps the useful context, not the noise.</h2>
          <p>{intro}</p>
        </div>

        <div className="comparison-grid">
          <article>
            <span>Scattered DMs</span>
            {before.map((item) => <p key={item}>{item}</p>)}
          </article>
          <article>
            <span>Weld workspace</span>
            {after.map((item) => <p key={item}>{item}</p>)}
          </article>
        </div>
      </div>
    </section>
  );
}

function ProofTrustSection({
  mode,
  profile,
  swipeState,
  onDetailToggle,
  onSwipe
}: {
  mode: Audience;
  profile: TalentProfile;
  swipeState: SwipeState;
  onDetailToggle: (key: DetailKey | null) => void;
  onSwipe: (state: Exclude<SwipeState, "idle">) => void;
}) {
  const sparkLabel = mode === "studio" ? "Spark / Hire" : "Spark";

  return (
    <section className="glass-section proof-section" id="proof">
      <div className="section-copy">
        <span className="section-kicker">Proof</span>
        <h2>Scattered links become one readable proof layer.</h2>
        <p>
          Trust comes from clarity. No fake metrics, no invented traction, no noisy admin metaphors.
        </p>
      </div>

      <div className="proof-layout">
        <article className="glass-card proof-before-card">
          <strong>Before</strong>
          <p>Portfolio link in bio. Rate in a DM. Old clip in another post. Availability maybe buried somewhere.</p>
          <div className="proof-chip-row">
            <span>portfolio link</span>
            <span>rate in DM</span>
            <span>old clip</span>
            <span>availability maybe</span>
          </div>
        </article>

        <article className="glass-card proof-after-card">
          <strong>With weld.</strong>
          <p>
            Same information, but framed with role, linked work, pricing, availability, and recent proof in one place.
          </p>
          <div className="proof-cta-grid">
            <button type="button" onClick={() => onDetailToggle("verified")}>
              <span>Verified</span>
              <ArrowUpRightIcon />
            </button>
            <button type="button" onClick={() => onDetailToggle("latest")}>
              <span>{profile.latestProject.name}</span>
              <ArrowUpRightIcon />
            </button>
            <button type="button" onClick={() => onDetailToggle("feedback")}>
              <span>{profile.feedback.label}</span>
              <ArrowUpRightIcon />
            </button>
          </div>
          <div className={`proof-card-actions is-${swipeState}`} aria-label="Card actions">
            <button type="button" className="hero-action-button reject" onClick={() => onSwipe("reject")}>
              <CloseIcon />
              <span>Reject</span>
            </button>
            <button type="button" className="hero-action-button like" onClick={() => onSwipe("like")}>
              <HeartIcon />
              <span>Like</span>
            </button>
            <button type="button" className="hero-action-button spark" onClick={() => onSwipe("spark")}>
              <SparkIcon />
              <span>{sparkLabel}</span>
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

function StudioScoutSection({
  copy
}: {
  copy: (typeof MODE_COPY)[Audience];
}) {
  return (
    <section className="glass-section scout-section">
      <div className="glass-card scout-copy-card">
        <span className="section-kicker">For both sides</span>
        <h2>{copy.scoutTitle}</h2>
        <p>{copy.scoutBody}</p>
      </div>

      <div className="scout-rail">
        <article className="glass-card scout-rail-card">
          <strong>Proof before pitch</strong>
          <p>Shipped work and scope sit beside rate and availability, not hidden behind generic claims.</p>
        </article>
        <article className="glass-card scout-rail-card">
          <strong>One calm first viewport</strong>
          <p>Big card, clear headline, obvious CTA. Hero explains product without turning into novelty UI.</p>
        </article>
        <article className="glass-card scout-rail-card">
          <strong>Honest by default</strong>
          <p>No waitlist counts, no logos, no made-up public praise. Only product shape and believable signals.</p>
        </article>
      </div>
    </section>
  );
}

function WaitlistSignupSection({
  mode,
  copy,
  email,
  phase,
  status,
  captureRef,
  onEmailChange,
  onSubmit
}: {
  mode: Audience;
  copy: (typeof MODE_COPY)[Audience];
  email: string;
  phase: CapturePhase;
  status: string;
  captureRef: React.MutableRefObject<HTMLDivElement | null>;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const buttonLabel =
    phase === "submitting"
      ? "Joining..."
      : phase === "success"
        ? "Joined"
        : copy.waitlistButton;
  const headline =
    mode === "studio" ? "find roblox talent who ship." : "earn from your talent.";
  const benefits =
    mode === "studio"
      ? [
          ["Trust & proof", "Verified talent and secure collaboration.", <ShieldIcon key="shield" />],
          ["Built for Roblox", "Role-first profiles with real experience that matters.", <CodeIcon key="code" />],
          ["Matches that work", "Smart matching connects you with the right people.", <UserIcon key="user" />]
        ]
      : [
          ["Verified talent", "Stand out with Roblox experience and proof.", <UserIcon key="user" />],
          ["Matched with right work", "Connect with projects that fit your skills and goals.", <CodeIcon key="code" />],
          ["Get paid securely", "Transparent rates, milestones, and on-time payouts.", <FolderIcon key="folder" />]
        ];

  return (
    <section className="glass-section waitlist-section" id="join">
      <div className="waitlist-shell">
        <div className="section-copy waitlist-copy">
          <span className="section-kicker">Early access</span>
          <h2>{headline}</h2>
          <p>{mode === "studio" ? "Role-first cards, not generic profiles." : "Role-first profiles. Real opportunities. Work that ships."}</p>
          <div className="waitlist-benefits">
            {benefits.map(([title, body, icon]) => (
              <span key={title as string}>
                {icon}
                <strong>
                  {title}
                  <em>{body}</em>
                </strong>
              </span>
            ))}
          </div>
        </div>

        <div
          ref={captureRef}
          className={`glass-card waitlist-form-card is-${phase}`}
        >
          <div className="waitlist-form-heading">
            <h3>{copy.waitlistTitle}</h3>
            <p>{copy.waitlistBody}</p>
          </div>

          <label className="waitlist-field">
            <span>Email address</span>
            <input
              type="email"
              value={email}
              placeholder={copy.waitlistPlaceholder}
              onChange={(event) => onEmailChange(event.target.value)}
              aria-describedby={status ? `waitlist-status-${mode}` : undefined}
            />
          </label>

          <button
            type="button"
            className="button-primary waitlist-submit"
            onClick={onSubmit}
            disabled={phase === "submitting"}
          >
            {buttonLabel}
          </button>

          <p className="waitlist-privacy">
            Invite-first beta. No fake countdowns. No public waitlist numbers.
          </p>

          {status ? (
            <p id={`waitlist-status-${mode}`} className="waitlist-status" aria-live="polite">
              {status}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function FriendlyFAQ({
  openFaq,
  onToggle
}: {
  openFaq: number | null;
  onToggle: (index: number | null) => void;
}) {
  return (
    <section className="glass-section faq-section" id="faq">
      <div className="section-copy">
        <span className="section-kicker">FAQ</span>
        <h2>A few plain answers.</h2>
      </div>

      <div className="faq-list">
        {FAQS.map((faq, index) => {
          const isOpen = openFaq === index;

          return (
            <article key={faq.question} className="glass-card faq-card">
              <button
                type="button"
                className="faq-trigger"
                aria-expanded={isOpen}
                onClick={() => onToggle(isOpen ? null : index)}
              >
                <span>{faq.question}</span>
                <ChevronDownIcon className={isOpen ? "is-open" : ""} />
              </button>
              {isOpen ? <p>{faq.answer}</p> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function FooterCTA() {
  return (
    <footer className="glass-footer">
      <div>
        <strong>weld.</strong>
        <span>Roblox talent cards for clearer proof, cleaner scouting, and better first messages.</span>
      </div>
      <nav aria-label="Footer">
        <a href={`${WAITLIST_URL}/privacy`}>Privacy</a>
        <a href={`${WAITLIST_URL}/terms`}>Terms</a>
        <a href={`${WAITLIST_URL}/contact`}>Contact</a>
      </nav>
    </footer>
  );
}

function ModeToggle({
  mode,
  disabled,
  onChange
}: {
  mode: Audience;
  disabled?: boolean;
  onChange: (mode: Audience) => void;
}) {
  return (
    <div className="mode-toggle" role="radiogroup" aria-label="Audience mode">
      <span className={mode === "studio" ? "is-studio" : ""} aria-hidden="true" />
      <button
        type="button"
        role="radio"
        aria-checked={mode === "developer"}
        disabled={disabled}
        onClick={() => onChange("developer")}
      >
        I'm a developer
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={mode === "studio"}
        disabled={disabled}
        onClick={() => onChange("studio")}
      >
        I'm a studio
      </button>
    </div>
  );
}

function ProofBadge({
  detailKey,
  label,
  value,
  active,
  onToggle
}: {
  detailKey: DetailKey;
  label: string;
  value?: string;
  active: boolean;
  onToggle: (key: DetailKey | null) => void;
}) {
  return (
    <button
      type="button"
      className={`proof-badge ${active ? "is-active" : ""}`}
      aria-expanded={active}
      onClick={() => onToggle(active ? null : detailKey)}
    >
      <strong>{label}</strong>
      {value ? <span>{value}</span> : null}
    </button>
  );
}

function ProofDetailDialog({
  title,
  body,
  onClose
}: {
  title: string;
  body: string;
  onClose: () => void;
}) {
  return (
    <div className="proof-dialog-backdrop" onClick={onClose}>
      <div
        className="proof-dialog"
        role="dialog"
        aria-modal="false"
        aria-labelledby="proof-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="proof-dialog-close" onClick={onClose} aria-label="Close proof detail">
          <CloseIcon />
        </button>
        <strong id="proof-dialog-title">{title}</strong>
        <p>{body}</p>
      </div>
    </div>
  );
}

function socialIconKey(label: string) {
  const normalized = label.toLowerCase();

  if (normalized === "x") {
    return "linkedin";
  }

  return normalized.replace(/[^a-z0-9]+/g, "-");
}

function SocialIcon({ label }: { label: string }) {
  const key = socialIconKey(label);

  if (key === "roblox") {
    return <RobloxIcon />;
  }

  if (key === "discord") {
    return <DiscordIcon />;
  }

  if (key === "github") {
    return <GithubIcon />;
  }

  if (key === "linkedin") {
    return <LinkedInIcon />;
  }

  return <ArrowUpRightIcon />;
}

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

function GamepadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7.7 9.1h8.6c2.5 0 4.1 1.8 4.4 4.6l.2 1.8c.3 2.4-1.9 3.9-3.7 2.4l-1.6-1.4H8.4l-1.6 1.4c-1.8 1.5-4-.1-3.7-2.4l.2-1.8c.3-2.8 1.9-4.6 4.4-4.6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M7.7 12.7h3.2M9.3 11.1v3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15.7 12.6h.1M18 14.2h.1" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
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
