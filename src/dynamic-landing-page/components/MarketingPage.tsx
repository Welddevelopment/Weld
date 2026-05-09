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
  trackEvent
} from "@/dynamic-landing-page/lib/browser";
import type { SourceVariant } from "@/dynamic-landing-page/lib/source-variant";
import type { Audience } from "@/dynamic-landing-page/lib/types";
import { useMotionPolicy } from "@/dynamic-landing-page/lib/useMotionPolicy";
import { Sticker } from "@/dynamic-landing-page/components/primitives/Sticker";
import { getLandingCopy, type LandingCopy } from "@/dynamic-landing-page/lib/copy";
import {
  PROFILES,
  ROLE_LABELS,
  ROLE_ORDER,
  type RoleKey,
  type TalentProfile
} from "@/dynamic-landing-page/lib/role-config";
import SwipeCard from "@/components/matching-preview/SwipeCard";
import { MARQUEE_PROFILES } from "@/data/marqueeProfiles";

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
  role: string;
  rate: string;
  scope: string;
  chips: string[];
  social: string;
}>> = {
  scripter: [
    {
      studio: "Eclipse Studios",
      credibility: "12 shipped · 4M plays/mo",
      role: "Combat scripter (3 mo contract)",
      rate: "$60–85 / hr · paid weekly",
      scope: "Build the ability + dodge system for our combat update. Existing codebase.",
      chips: ["Lua", "Combat systems", "EU/US TZ"],
      social: "Reply rate: 84% · avg 6h"
    },
    {
      studio: "Zenith Games",
      credibility: "8 shipped · 2.1M plays/mo",
      role: "Anti-cheat developer (ongoing)",
      rate: "$70 / hr · milestone",
      scope: "Retrofit our FPS title with server-side validation. Solo codebase.",
      chips: ["Server Lua", "Anti-cheat", "FPS experience"],
      social: "Trusted by 7 devs on Weld"
    },
    {
      studio: "Phantom Works",
      credibility: "5 shipped · 900k plays/mo",
      role: "Backend systems engineer (6 mo)",
      rate: "$8k flat · 3 milestones",
      scope: "DataStore rewrite + live-ops tooling for our RPG. Well-documented codebase.",
      chips: ["DataStore", "OOP Lua", "RPG systems"],
      social: "Reply rate: 91% · avg 4h"
    }
  ],
  builder: [
    {
      studio: "NovaBuild Co.",
      credibility: "15 shipped · 6M plays/mo",
      role: "Hub builder (2 mo contract)",
      rate: "$50 / hr · milestone",
      scope: "Design and build a central social hub. Style guide and reference assets provided.",
      chips: ["Terrain", "Props", "Social hubs"],
      social: "Trusted by 9 devs on Weld"
    },
    {
      studio: "Orbit Interactive",
      credibility: "6 shipped · 1.5M plays/mo",
      role: "Map artist (ongoing)",
      rate: "$45–55 / hr · paid weekly",
      scope: "Ongoing environment work for our open-world RPG. Biomes + POI design.",
      chips: ["Open world", "Biomes", "Terrain sculpt"],
      social: "Reply rate: 79% · avg 8h"
    },
    {
      studio: "Solstice Studio",
      credibility: "4 shipped · 700k plays/mo",
      role: "Environment lead (3 mo)",
      rate: "$6k flat · 2 milestones",
      scope: "Lead the environment team for a new horror title. Own the visual language.",
      chips: ["Team lead", "Horror", "Atmosphere design"],
      social: "Reply rate: 88% · avg 3h"
    }
  ],
  ui: [
    {
      studio: "Eclipse Studios",
      credibility: "12 shipped · 4M plays/mo",
      role: "HUD designer (6 wk contract)",
      rate: "$55–70 / hr · milestone",
      scope: "Redesign our combat HUD. Health, abilities, minimap. Figma specs provided.",
      chips: ["HUD", "Figma handoff", "Combat UI"],
      social: "Reply rate: 84% · avg 6h"
    },
    {
      studio: "Cascade Labs",
      credibility: "3 shipped · 400k plays/mo",
      role: "Onboarding flow UI (1 mo)",
      rate: "$3.5k flat",
      scope: "New player tutorial UI. Clear, mobile-friendly, low friction. Brand kit included.",
      chips: ["Onboarding", "Mobile", "Tutorial UX"],
      social: "Trusted by 4 devs on Weld"
    },
    {
      studio: "Zenith Games",
      credibility: "8 shipped · 2.1M plays/mo",
      role: "Shop interface designer (ongoing)",
      rate: "$60 / hr · paid weekly",
      scope: "Design and build our in-game shop. Cart, bundles, promotions. High traffic.",
      chips: ["Shop UI", "Monetisation", "High polish"],
      social: "Reply rate: 77% · avg 10h"
    }
  ],
  vfx: [
    {
      studio: "Phantom Works",
      credibility: "5 shipped · 900k plays/mo",
      role: "Combat VFX artist (2 mo)",
      rate: "$50–65 / hr · milestone",
      scope: "Ability FX for 12 combat skills. Style ref provided. Integrate into existing rig.",
      chips: ["Beam", "ParticleEmitter", "Combat FX"],
      social: "Reply rate: 91% · avg 4h"
    },
    {
      studio: "Orbit Interactive",
      credibility: "6 shipped · 1.5M plays/mo",
      role: "Ambient world FX (ongoing)",
      rate: "$45 / hr · paid weekly",
      scope: "Weather, foliage, water effects across 6 biomes. Perf budget is strict.",
      chips: ["Environment FX", "Optimisation", "Open world"],
      social: "Trusted by 6 devs on Weld"
    },
    {
      studio: "Solstice Studio",
      credibility: "4 shipped · 700k plays/mo",
      role: "UI motion designer (6 wk)",
      rate: "$3k flat",
      scope: "Menu transitions, feedback pulses, and HUD animations for a horror title.",
      chips: ["UI motion", "TweenService", "Horror tone"],
      social: "Reply rate: 88% · avg 3h"
    }
  ],
  animator: [
    {
      studio: "NovaBuild Co.",
      credibility: "15 shipped · 6M plays/mo",
      role: "Character animator (3 mo)",
      rate: "$60 / hr · milestone",
      scope: "Full locomotion set + 8 emotes for new character lineup. Rig provided.",
      chips: ["Locomotion", "Emotes", "Character"],
      social: "Trusted by 11 devs on Weld"
    },
    {
      studio: "Eclipse Studios",
      credibility: "12 shipped · 4M plays/mo",
      role: "Cinematic animator (2 mo)",
      rate: "$55–70 / hr · paid weekly",
      scope: "Cutscene animations for story mode. 14 scenes, mixed lengths, mocap reference.",
      chips: ["Cinematics", "Story mode", "Mocap ref"],
      social: "Reply rate: 84% · avg 6h"
    },
    {
      studio: "Cascade Labs",
      credibility: "3 shipped · 400k plays/mo",
      role: "Procedural rigging (1 mo)",
      rate: "$4k flat",
      scope: "Procedural IK rig for creature movement. Lua + animation pipeline experience needed.",
      chips: ["IK rig", "Procedural", "Creature"],
      social: "Reply rate: 72% · avg 12h"
    }
  ],
  designer: [
    {
      studio: "Orbit Interactive",
      credibility: "6 shipped · 1.5M plays/mo",
      role: "Game designer (3 mo contract)",
      rate: "$65 / hr · milestone",
      scope: "Design core loop, progression, and economy for our upcoming RPG. Design docs provided.",
      chips: ["Core loops", "Economy", "Progression"],
      social: "Reply rate: 79% · avg 8h"
    },
    {
      studio: "Eclipse Studios",
      credibility: "12 shipped · 4M plays/mo",
      role: "Systems designer (6 wk)",
      rate: "$60–75 / hr · milestone",
      scope: "Balance our combat system and reward loop. Data exports and telemetry provided.",
      chips: ["Balancing", "Combat", "Data-driven"],
      social: "Reply rate: 84% · avg 6h"
    },
    {
      studio: "Cascade Labs",
      credibility: "3 shipped · 400k plays/mo",
      role: "UX game designer (1 mo)",
      rate: "$4k flat",
      scope: "Improve new player onboarding flow. Reduce drop-off in first 5 minutes.",
      chips: ["Onboarding", "Retention", "UX thinking"],
      social: "Trusted by 4 devs on Weld"
    }
  ],
  systems: [
    {
      studio: "Zenith Games",
      credibility: "8 shipped · 2.1M plays/mo",
      role: "DataStore architect (ongoing)",
      rate: "$75 / hr · paid weekly",
      scope: "Rebuild our DataStore layer for scale. 500k+ DAU. Existing schema docs provided.",
      chips: ["DataStore", "Scale", "500k+ DAU"],
      social: "Reply rate: 77% · avg 10h"
    },
    {
      studio: "Phantom Works",
      credibility: "5 shipped · 900k plays/mo",
      role: "Economy systems (3 mo)",
      rate: "$70–85 / hr · milestone",
      scope: "Design + build virtual economy: currency, shops, sinks, sources. Solo scope.",
      chips: ["Economy design", "Balancing", "Virtual currency"],
      social: "Reply rate: 91% · avg 4h"
    },
    {
      studio: "NovaBuild Co.",
      credibility: "15 shipped · 6M plays/mo",
      role: "Live-ops tooling (2 mo)",
      rate: "$6k flat · 3 milestones",
      scope: "Admin dashboard for live events. Real-time config, flag overrides, basic analytics.",
      chips: ["Live-ops", "Admin tools", "Real-time config"],
      social: "Trusted by 9 devs on Weld"
    }
  ]
};

const MARQUEE_CARDS = [
  { name: "NovaDev", role: "Scripter", rate: "$65/hr", badge: "Verified", accent: "#4F6EF7" },
  { name: "PixelBuild", role: "Builder", rate: "$45/hr", badge: "Top 5%", accent: "#10B981" },
  { name: "FluxVFX", role: "VFX", rate: "$55/hr", badge: "Verified", accent: "#F59E0B" },
  { name: "UIcraft", role: "UI", rate: "$60/hr", badge: "Fast replies", accent: "#8B5CF6" },
  { name: "ArcSystems", role: "Systems", rate: "$75/hr", badge: "Verified", accent: "#EF4444" },
  { name: "MotionMike", role: "Animator", rate: "$50/hr", badge: "New", accent: "#06B6D4" },
  { name: "LuaKing", role: "Scripter", rate: "$80/hr", badge: "Top 5%", accent: "#F97316" },
  { name: "TerrainCo", role: "Builder", rate: "$40/hr", badge: "Verified", accent: "#84CC16" },
  { name: "FlareFX", role: "VFX", rate: "$65/hr", badge: "Fast replies", accent: "#EC4899" },
  { name: "ShopUI_Dev", role: "UI", rate: "$70/hr", badge: "Verified", accent: "#6366F1" },
  { name: "DataLord", role: "Systems", rate: "$85/hr", badge: "Top 5%", accent: "#0EA5E9" },
  { name: "AnimStudio", role: "Animator", rate: "$55/hr", badge: "Verified", accent: "#A855F7" },
  { name: "CombatDev", role: "Scripter", rate: "$70/hr", badge: "Fast replies", accent: "#14B8A6" },
  { name: "MapMaker", role: "Builder", rate: "$48/hr", badge: "New", accent: "#F59E0B" },
  { name: "NeonVFX", role: "VFX", rate: "$60/hr", badge: "Verified", accent: "#EF4444" },
  { name: "HudPro", role: "UI", rate: "$58/hr", badge: "Top 5%", accent: "#22C55E" }
];

const STUDIO_STRIP = [
  { name: "Eclipse Studios", hiring: 3, plays: "4M plays/mo", verified: true, accent: "#4F6EF7" },
  { name: "NovaBuild Co.", hiring: 5, plays: "6M plays/mo", verified: true, accent: "#10B981" },
  { name: "Zenith Games", hiring: 2, plays: "2.1M plays/mo", verified: true, accent: "#F59E0B" },
  { name: "Phantom Works", hiring: 4, plays: "900k plays/mo", verified: true, accent: "#8B5CF6" },
  { name: "Orbit Interactive", hiring: 2, plays: "1.5M plays/mo", verified: false, accent: "#EF4444" },
  { name: "Solstice Studio", hiring: 1, plays: "700k plays/mo", verified: true, accent: "#06B6D4" },
  { name: "Cascade Labs", hiring: 3, plays: "400k plays/mo", verified: false, accent: "#F97316" }
];

function joinHref(mode: Audience, search: string) {
  const base = mode === "studio" ? "/studios" : "/";
  return search ? `${base}?${search}` : base;
}

function scrollToId(id: string) {
  if (typeof window === "undefined") return;
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
  const motion = useMotionPolicy();
  const motionTier = motion.tier;
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<Audience>(initialMode);
  const [role, setRole] = useState<RoleKey>("scripter");
  const [email, setEmail] = useState("");
  const [capturePhase, setCapturePhase] = useState<CapturePhase>("idle");
  const [captureStatus, setCaptureStatus] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swipeModalOpen, setSwipeModalOpen] = useState(false);
  const [hiringPanel, setHiringPanel] = useState(0);
  const [hiringAnim, setHiringAnim] = useState<HiringAnim>("idle");
  const captureRef = useRef<HTMLDivElement | null>(null);
  const pageShellRef = useRef<HTMLDivElement | null>(null);

  const activeProfile = PROFILES[role];
  const modeCopy = getLandingCopy(mode);

  useEffect(() => {
    captureAttributionFromLocation();
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
    if (nextMode === mode) return;
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
      () => captureRef.current?.querySelector("input")?.focus(),
      motionTier === "reduced" ? 0 : 450
    );
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

  function openSignupForm() {
    if (!email.trim()) {
      setCapturePhase("error");
      setCaptureStatus("Add your email to join early access.");
      captureRef.current?.querySelector("input")?.focus();
      return;
    }

    void trackEvent({
      eventName: "landing_signup_form_opened",
      page,
      audience: mode,
      payload: { variant: sourceVariant }
    });

    setCapturePhase("submitting");
    setCaptureStatus("Opening your signup form...");

    const signupParams = new URLSearchParams({
      email: email.trim(),
      type: mode
    });

    window.setTimeout(() => {
      router.push(`/signup?${signupParams.toString()}`);
    }, motionTier === "reduced" ? 0 : 180);
  }

  return (
    <div
      ref={pageShellRef}
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
        copy={modeCopy}
        searchString={searchString}
        pending={isPending}
        onModeChange={handleModeChange}
        onJoinClick={() => handleJoinIntent("nav")}
      />

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
            <SwipeCard />
          </div>
        </div>
      )}

      <main className="weld-glass-main">

        {/* 1. Hero — untouched */}
        <HeroShell>
          <HeroCopyPanel
            copy={modeCopy}
            email={email}
            capturePhase={capturePhase}
            onEmailChange={setEmail}
            onSubmit={openSignupForm}
          />
          <div className="hero-card-column hero-card-column-split">
            <div className="npc-hero-preview-container">
              <div className="npc-hero-preview-card" aria-hidden="true">
                <SwipeCard />
              </div>
              <button
                className="npc-hero-preview-trigger"
                onClick={() => setSwipeModalOpen(true)}
                aria-label="Open interactive profile card"
              >
                <span className="npc-hero-preview-hint">Tap to interact →</span>
              </button>
            </div>
          </div>
        </HeroShell>

        {/* 2. How it works — 3-step row */}
        <HowItWorksStrip copy={modeCopy} />

        {/* 3. Live talent marquee */}
        <TalentMarqueeSection />

        {/* 4. Role switching — POV-flips per audience */}
        <RoleTalentExplorer
          mode={mode}
          copy={modeCopy}
          role={role}
          profile={activeProfile}
          isSwapping={isSwapping}
          hiringPanel={hiringPanel}
          hiringAnim={hiringAnim}
          onRoleChange={handleRoleChange}
          onHiringAction={handleHiringAction}
        />

        {/* 5. And here's who's looking */}
        <OtherSideSection mode={mode} />

        {/* 6. Chat — POV-flips per audience */}
        <ChatPreviewSection copy={modeCopy} profile={activeProfile} mode={mode} />

        {/* 7. Comparison table — dot scale */}
        <ComparisonTableSection />

        {/* 8. Get early access — combined CTA */}
        <EarlyAccessSection
          mode={mode}
          copy={modeCopy}
          email={email}
          phase={capturePhase}
          status={captureStatus}
          captureRef={captureRef}
          onEmailChange={setEmail}
          onSubmit={openSignupForm}
        />

        <FriendlyFAQ copy={modeCopy} openFaq={openFaq} onToggle={setOpenFaq} />
      </main>

      <FooterCTA copy={modeCopy} />
    </div>
  );
}

function GlassNav({
  mode,
  copy,
  searchString,
  pending,
  onModeChange,
  onJoinClick
}: {
  mode: Audience;
  copy: LandingCopy;
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
        {copy.nav.links.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
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

function HeroShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="hero-shell hero-shell-split" id="top">
      <div className="hero-shell-bloom" aria-hidden="true" />
      <div className="hero-shell-grid">{children}</div>
    </section>
  );
}

function HeroCopyPanel({
  copy,
  email,
  capturePhase,
  onEmailChange,
  onSubmit
}: {
  copy: LandingCopy;
  email: string;
  capturePhase: CapturePhase;
  onEmailChange: (v: string) => void;
  onSubmit: () => void;
}) {
  const isSubmitting = capturePhase === "submitting";
  const isSuccess = capturePhase === "success";

  return (
    <div className="hero-copy-panel hero-copy-panel-split">
      <h1>The talent network for Roblox.</h1>
      <p className="hero-lead">
        Link your games, set your rate, and match with studios that actually ship.
      </p>
      <p className="hero-support">
        weld. turns shipped work, rates, availability, links, and proof into swipeable talent
        cards studios can trust.
      </p>
      <div className="hero-capture-row">
        <input
          className="hero-capture-input"
          type="email"
          placeholder="you@example.com"
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
          {isSuccess ? "You're in ✓" : isSubmitting ? "Joining…" : "Join the beta"}
        </button>
      </div>
      <div className="hero-proof-line">
        <div aria-hidden="true" style={{width:7,height:7,borderRadius:"50%",background:"#22c55e",flexShrink:0,boxShadow:"0 0 0 2px rgba(34,197,94,0.22)"}} />
        over <strong>30</strong> studio signups
      </div>
      <span className="hero-copy-eyebrow-hidden" aria-hidden="true">
        {copy.hero.eyebrow}
      </span>
    </div>
  );
}

function HowItWorksStrip({ copy }: { copy: LandingCopy }) {
  const steps = copy.howItWorks.steps;
  return (
    <section data-reveal="pending" className="how-strip-section" id="how" aria-label={copy.howItWorks.title}>
      <div className="glass-card how-strip">
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

function TalentMarqueeSection() {
  const doubled = [...MARQUEE_PROFILES, ...MARQUEE_PROFILES];
  return (
    <section className="marquee-section" aria-label="Talent on Weld" aria-hidden="true">
      <div className="marquee-track">
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
  profile,
  isSwapping,
  hiringPanel,
  hiringAnim,
  onRoleChange,
  onHiringAction
}: {
  mode: Audience;
  copy: LandingCopy;
  role: RoleKey;
  profile: TalentProfile;
  isSwapping: boolean;
  hiringPanel: number;
  hiringAnim: HiringAnim;
  onRoleChange: (role: RoleKey) => void;
  onHiringAction: (action: "spark" | "skip") => void;
}) {
  const buttonRefs = useRef<Partial<Record<RoleKey, HTMLButtonElement | null>>>({});
  const panels = HIRING_PANELS[role];

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

  const isDev = mode === "developer";
  const headline = isDev ? "Pick what you do. See who's hiring." : copy.howItWorks.title;
  const lead = isDev
    ? "Real open roles. Real rates. Spark to apply."
    : copy.howItWorks.lead;

  return (
    <section data-reveal="pending" className="glass-section how-story-section" id="roles">
      <div className="how-story-grid">
        <div className="section-copy how-story-copy">
          <span className="section-kicker">{isDev ? "FOR DEVELOPERS" : copy.howItWorks.kicker}</span>
          <h2>{headline}</h2>
          <p>{lead}</p>
          {!isDev && <p>{copy.howItWorks.support}</p>}

          <div className="role-explorer-tabs" role="radiogroup" aria-label="Choose a Roblox talent role">
            {ROLE_ORDER.map((entry) => (
              <button
                key={entry}
                ref={(node) => { buttonRefs.current[entry] = node; }}
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

        {isDev ? (
          <HiringPanelStack
            panels={panels}
            activeIndex={hiringPanel}
            anim={hiringAnim}
            isSwapping={isSwapping}
            onAction={onHiringAction}
          />
        ) : (
          <article
            className="glass-card how-profile-card"
            data-swapping={isSwapping ? "true" : "false"}
          >
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
            <span className="demo-caption">{copy.demo.latestProjectCaption}</span>
            <p>{profile.latestProject.summary}</p>
            <div className="how-proof-list">
              {profile.latestProject.bullets.map((bullet) => (
                <span key={bullet}><SparkIcon />{bullet}</span>
              ))}
            </div>
            <p className="demo-caption" style={{ marginTop: "12px" }}>
              {copy.demo.feedbackCaption}
            </p>
          </article>
        )}
      </div>
    </section>
  );
}

function HiringPanelStack({
  panels,
  activeIndex,
  anim,
  isSwapping,
  onAction
}: {
  panels: (typeof HIRING_PANELS)[RoleKey];
  activeIndex: number;
  anim: HiringAnim;
  isSwapping: boolean;
  onAction: (action: "spark" | "skip") => void;
}) {
  const active = panels[activeIndex];
  const behind1 = panels[(activeIndex + 1) % panels.length];
  const behind2 = panels[(activeIndex + 2) % panels.length];

  return (
    <div className="hiring-stack-wrapper" data-swapping={isSwapping ? "true" : "false"}>
      <div className={`hiring-panel-stack is-${anim}`}>
        <div className="hiring-panel-behind hiring-panel-behind-2">
          <span className="hiring-panel-stub-label">{behind2.studio}</span>
        </div>
        <div className="hiring-panel-behind hiring-panel-behind-1">
          <span className="hiring-panel-stub-label">{behind1.studio}</span>
        </div>
        <article className="glass-card hiring-panel-active">
          <div className="hiring-panel-header">
            <div className="hiring-studio-logo">
              {active.studio.charAt(0)}
            </div>
            <div className="hiring-studio-meta">
              <strong>
                {active.studio}
                <span className="verified-dot is-active" aria-hidden="true">
                  <CheckIcon />
                </span>
              </strong>
              <em>{active.credibility}</em>
            </div>
          </div>
          <h3 className="hiring-panel-role">{active.role}</h3>
          <div className="hiring-panel-rate">{active.rate}</div>
          <p className="hiring-panel-scope">{active.scope}</p>
          <div className="hiring-panel-chips">
            {active.chips.map((chip) => (
              <span key={chip} className="hiring-chip">{chip}</span>
            ))}
          </div>
          <div className="hiring-panel-social">{active.social}</div>
          <div className="hiring-panel-actions">
            <button
              type="button"
              className="hiring-action-skip"
              onClick={() => onAction("skip")}
            >
              Skip
            </button>
            <button
              type="button"
              className="hiring-action-spark"
              onClick={() => onAction("spark")}
            >
              <SparkIcon /> Spark to apply →
            </button>
          </div>
        </article>
      </div>
      <p className="hiring-stack-counter">+ {panels.length - 1} more roles like this</p>
    </div>
  );
}

function OtherSideSection({ mode }: { mode: Audience }) {
  const isDev = mode === "developer";
  return (
    <section data-reveal="pending" className="glass-section other-side-section">
      <div className="section-copy other-side-copy">
        <h2>And here&rsquo;s who&rsquo;s looking.</h2>
        <p>
          {isDev
            ? "Studios put themselves on cards too. Verified studio. Active projects. What they pay."
            : "Dev cards are just as scannable as studio cards. Role, rate, and proof — same format."}
        </p>
      </div>
      <div className="other-side-strip">
        {isDev
          ? STUDIO_STRIP.map((studio) => (
              <div key={studio.name} className="glass-card studio-strip-card">
                <div className="studio-strip-logo" style={{ background: studio.accent }}>
                  {studio.name.charAt(0)}
                </div>
                <div className="studio-strip-body">
                  <strong>
                    {studio.name}
                    {studio.verified && (
                      <span className="verified-dot is-active" aria-hidden="true">
                        <CheckIcon />
                      </span>
                    )}
                  </strong>
                  <span>Hiring {studio.hiring} · {studio.plays}</span>
                </div>
              </div>
            ))
          : MARQUEE_CARDS.slice(0, 7).map((card) => (
              <div key={card.name} className="glass-card studio-strip-card">
                <div className="studio-strip-logo" style={{ background: card.accent }}>
                  {card.name.charAt(0)}
                </div>
                <div className="studio-strip-body">
                  <strong>{card.name}</strong>
                  <span>{card.role} · {card.rate}</span>
                </div>
              </div>
            ))}
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

  const contacts = [
    { icon: <RobloxIcon />, label: "Roblox", value: isDev ? "/EclipseStudios" : `/` + profile.name },
    { icon: <DiscordIcon />, label: "Discord", value: isDev ? "eclipse.studios" : profile.name.toLowerCase() + ".dev" },
    { icon: <GithubIcon />, label: "GitHub", value: isDev ? "eclipsestudios" : profile.name.toLowerCase() + "x" }
  ];

  return (
    <section data-reveal="pending" className="glass-section chat-section" id="chat">
      <div className="section-copy chat-section-copy">
        <span className="section-kicker">{copy.chatPreview.kicker}</span>
        <h2>{copy.chatPreview.headline}</h2>
        <p>{copy.chatPreview.body}</p>
      </div>

      <div className="glass-card chat-preview-shell chat-preview-shell-clean">
        <div className="chat-window-topbar">
          <div className="chat-window-topbar-left">
            <button type="button" className="chat-back-btn" aria-label="Decorative back button">
              <ArrowLeftIcon />
              <span>Back</span>
            </button>
            <div className="chat-window-identity">
              <div className="profile-avatar-shell chat-topbar-avatar" aria-hidden="true">
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
                <strong>
                  {contactName}
                  <span className="verified-dot is-active" aria-hidden="true">
                    <CheckIcon />
                  </span>
                </strong>
                <em><span className="online-dot" />Online</em>
              </div>
            </div>
          </div>
          <div className="chat-window-actions">
            <button type="button" className="chat-view-profile-btn">
              View full profile <ArrowUpRightIcon />
            </button>
            <button type="button" className="chat-more-btn" aria-label="Decorative more menu">•••</button>
          </div>
        </div>

        <aside className="chat-profile-panel" aria-label="Chat profile summary">
          <div className="chat-profile-top">
            <div className="profile-avatar-shell chat-profile-avatar">
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
                <h3>{contactName}</h3>
                <span className="verified-dot is-active" aria-hidden="true"><CheckIcon /></span>
              </div>
              <p className="hero-card-role">{isDev ? "Roblox studio" : profile.label}</p>
              <p className="hero-card-availability"><span />{isDev ? "Hiring now" : profile.availability}</p>
            </div>
          </div>

          <div className="chat-match-bar">
            <span><ShieldIcon /> 98% Match</span>
            <i aria-hidden="true" style={{ ["--match-fill" as never]: "62%" }} />
          </div>

          <div className="chat-stat-grid">
            <span><UserIcon /><strong>{isDev ? "12 shipped" : profile.years}</strong><em>{isDev ? "Games" : "Experience"}</em></span>
            <span><ShieldIcon /><strong>98%</strong><em>Match</em></span>
            <span><ClockIcon /><strong>Replies</strong><em>Usually 1hr</em></span>
          </div>

          <p className="chat-profile-summary">
            {isDev
              ? "Eclipse Studios ships combat-focused games. 4M plays/mo. Rate: $60–85/hr. Scope explained upfront."
              : profile.headline}
          </p>

          <div className="chat-contact-row chat-contact-row-clean">
            {contacts.map((contact) => (
              <span key={contact.label} className="chat-contact-chip">
                <i aria-hidden="true">{contact.icon}</i>
                <strong>{contact.label}</strong>
                <em>{contact.value}</em>
              </span>
            ))}
          </div>

          <div className="chat-professional-note">
            <span className="chat-professional-icon" aria-hidden="true"><HandRaisedIcon /></span>
            <span>
              <strong>{copy.chatPreview.professionalNote[0]}</strong>
              <em>Be respectful and clear about your project needs.</em>
            </span>
          </div>
        </aside>

        <div className="chat-thread-panel">
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
                    <span />
                  </div>
                ) : null}
                <p>
                  {message.text}
                  <time>
                    {message.time}
                    {message.side === "out" ? <ChatReadIcon /> : null}
                  </time>
                </p>
              </div>
            ))}
          </div>

          <div className="chat-composer chat-composer-clean" aria-label="Decorative message composer">
            <span className="chat-composer-icon" aria-hidden="true"><PaperclipIcon /></span>
            <em>{copy.chatPreview.composerHint(contactName)}</em>
            <span className="chat-composer-icon" aria-hidden="true"><EmojiIcon /></span>
            <button type="button" className="chat-send-btn" aria-label="Decorative send button">
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function DotScale({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span
      className="dot-scale"
      aria-label={level === 1 ? "Low" : level === 2 ? "Medium" : "High"}
    >
      <span className={`dot${level >= 1 ? " filled" : ""}`} />
      <span className={`dot${level >= 2 ? " filled" : ""}`} />
      <span className={`dot${level >= 3 ? " filled" : ""}`} />
    </span>
  );
}

function ComparisonTableSection() {
  const features: Array<{ name: string; s: 1 | 2 | 3; c: 1 | 2 | 3; w: 1 | 2 | 3 }> = [
    { name: "Role clarity",     s: 1, c: 2, w: 3 },
    { name: "Verified identity", s: 1, c: 1, w: 3 },
    { name: "Trust signal",     s: 1, c: 2, w: 3 },
    { name: "Scannability",     s: 1, c: 2, w: 3 },
    { name: "Search & filters", s: 1, c: 2, w: 3 },
    { name: "Noise level",      s: 3, c: 2, w: 1 },
    { name: "Direct outreach",  s: 1, c: 1, w: 3 },
    { name: "Hiring control",   s: 1, c: 1, w: 3 },
    { name: "Client proof",     s: 1, c: 1, w: 3 },
    { name: "Time to hire",     s: 1, c: 2, w: 3 }
  ];

  return (
    <section className="glass-section comparison-table-section" id="compare">
      <div className="section-copy">
        <span className="section-kicker">IMPROVED VISIBILITY</span>
        <h2>How hiring channels compare.</h2>
        <p>Discord servers, Discord channels, and Weld — side by side.</p>
      </div>

      <div className="comparison-table-wrapper">
        <div className="comparison-table">
          <div className="comp-table-header">
            <div className="comp-col-feature">FEATURE</div>
            <div className="comp-col-discord">DISCORD SERVERS</div>
            <div className="comp-col-discord">DISCORD CHANNELS</div>
            <div className="comp-col-weld">
              <Image src="/Assets/weld-logo-official.svg" alt="Weld" width={72} height={20} />
            </div>
          </div>
          <div className="comp-table-body">
            {features.map((f, i) => (
              <div key={i} className="comp-table-row">
                <div className="comp-col-feature">{f.name}</div>
                <div className="comp-col-discord"><DotScale level={f.s} /></div>
                <div className="comp-col-discord"><DotScale level={f.c} /></div>
                <div className="comp-col-weld"><DotScale level={f.w} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EarlyAccessSection({
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
  copy: LandingCopy;
  email: string;
  phase: CapturePhase;
  status: string;
  captureRef: React.MutableRefObject<HTMLDivElement | null>;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const buttonLabel =
    phase === "submitting"
      ? copy.waitlist.submittingLabel
      : phase === "success"
        ? copy.waitlist.submittedLabel
        : copy.waitlist.button;

  const benefitIcon = (key: "shield" | "code" | "user" | "folder") => {
    if (key === "shield") return <ShieldIcon />;
    if (key === "code") return <CodeIcon />;
    if (key === "user") return <UserIcon />;
    return <FolderIcon />;
  };

  return (
    <section data-reveal="pending" className="glass-section waitlist-section" id="join">
      <div className="waitlist-shell">
        <div className="section-copy waitlist-copy">
          <span className="section-kicker">{copy.waitlist.kicker}</span>
          <h2>{mode === "developer" ? "Join the developer beta." : "Get studio access."}</h2>
          <p>{copy.waitlist.subhead}</p>
          <div className="waitlist-benefits">
            {copy.waitlist.benefits.map(([title, body, iconKey]) => (
              <span key={title}>
                {benefitIcon(iconKey)}
                <strong>
                  {title}
                  <em>{body}</em>
                </strong>
              </span>
            ))}
          </div>
          <p className="waitlist-privacy">{copy.waitlist.privacy}</p>
        </div>

        <div
          ref={captureRef}
          className={`glass-card waitlist-form-card is-${phase}`}
        >
          <div className="waitlist-form-heading">
            <h3>{copy.waitlist.title}</h3>
            <p>{copy.waitlist.body}</p>
          </div>

          <label className="waitlist-field">
            <span>{copy.waitlist.fieldLabel}</span>
            <input
              type="email"
              value={email}
              placeholder={copy.waitlist.placeholder}
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

          {phase === "success" ? (
            <Sticker
              tone="spark"
              icon={<SparkIcon />}
              label={copy.waitlist.successSticker}
              className="waitlist-success-sticker"
            />
          ) : null}

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
  copy,
  openFaq,
  onToggle
}: {
  copy: LandingCopy;
  openFaq: number | null;
  onToggle: (index: number | null) => void;
}) {
  return (
    <section data-reveal="pending" className="glass-section faq-section" id="faq">
      <div className="section-copy">
        <span className="section-kicker">{copy.faq.kicker}</span>
        <h2>{copy.faq.title}</h2>
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

function FooterCTA({ copy }: { copy: LandingCopy }) {
  return (
    <footer className="glass-footer">
      <div>
        <strong>weld.</strong>
        <span>{copy.footer.tagline}</span>
      </div>
      <nav aria-label="Footer">
        <a href={`${WAITLIST_URL}/privacy`}>{copy.footer.privacy}</a>
        <a href={`${WAITLIST_URL}/terms`}>{copy.footer.terms}</a>
        <a href={`${WAITLIST_URL}/contact`}>{copy.footer.contact}</a>
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
