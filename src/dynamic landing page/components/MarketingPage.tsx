"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type CSSProperties,
  type MutableRefObject
} from "react";

import {
  captureAttributionFromLocation,
  persistAudiencePreference,
  submitSignupCapture,
  trackEvent
} from "@/dynamic landing page/lib/browser";
import {
  AUDIENCE_COPY,
  FAQ_ITEMS,
  FOUNDING_FACTS,
  HERO_PROFILES,
  ROLE_PREVIEWS,
  SOURCE_VARIANTS
} from "@/dynamic landing page/lib/sample-data";
import type { SourceVariant } from "@/dynamic landing page/lib/source-variant";
import type { Audience } from "@/dynamic landing page/lib/types";

interface MarketingPageProps {
  initialMode: Audience;
  sourceVariant: SourceVariant;
  page: "landing" | "studios";
}

type HeroProfile = (typeof HERO_PROFILES)[number];
type RoleKey = keyof typeof ROLE_PREVIEWS;
type CaptureSource = "hero" | "final-cta";
type CapturePhase = "idle" | "executing" | "saved" | "redirecting";
type BootTone = "neutral" | "active" | "success" | "muted";

interface BootLine {
  text: string;
  tone?: BootTone;
  bold?: boolean;
  delay?: number;
}

interface DiscordEntry {
  name: string;
  color: string;
  body: string;
  timestamp: string;
  badges?: string[];
  expired?: boolean;
  deleted?: boolean;
  ghost?: boolean;
  ghostLabel?: string;
  spam?: boolean;
}

interface RewardCard {
  count: number;
  label: string;
  description: string;
  badge: string;
}

interface CommandSequence {
  command: string;
  lines: BootLine[];
  summary: string;
}

const WAITLIST_URL = "https://weldroblox.com";
const HERO_ROTATION_MS = 6800;

const HERO_BOOT_LINES: Record<Audience, BootLine[]> = {
  developer: [
    { text: "> booting weld.roster...", tone: "muted", delay: 140 },
    { text: "> loading developer lane...", tone: "neutral", delay: 160 },
    { text: "> scanning shipped work... ✓", tone: "success", delay: 170 },
    { text: "> checking proof link... verified", tone: "success", delay: 180 },
    { text: "> matching studio filters...", tone: "active", delay: 170 },
    { text: "> READY_FOR_DISCOVERY", tone: "success", bold: true, delay: 220 }
  ],
  studio: [
    { text: "> booting weld.roster...", tone: "muted", delay: 140 },
    { text: "> loading studio scout mode...", tone: "neutral", delay: 160 },
    { text: "> scanning shipped work... ✓", tone: "success", delay: 170 },
    { text: "> checking proof link... verified", tone: "success", delay: 180 },
    { text: "> filtering for role, rate, and proof...", tone: "active", delay: 170 },
    { text: "> SCOUT_MODE_READY", tone: "success", bold: true, delay: 220 }
  ]
};

const DISCORD_CHAOS: DiscordEntry[] = [
  {
    name: "devhunter99",
    color: "hsl(200 50% 62%)",
    body: "anyone know a good scripter??",
    timestamp: "2:14 PM",
    badges: ["@3", "no rate"]
  },
  {
    name: "studioboss",
    color: "hsl(280 45% 62%)",
    body: "HIRING: lua dev 20R$/hr DM me",
    timestamp: "2:15 PM",
    badges: ["urgent?", "thin brief"]
  },
  {
    name: "Random42",
    color: "hsl(130 40% 62%)",
    body: "i can script lmk",
    timestamp: "2:16 PM",
    badges: ["no proof"]
  },
  {
    name: "xCodez",
    color: "hsl(30 60% 62%)",
    body: "check my portfolio [expired link]",
    timestamp: "2:18 PM",
    badges: ["expired link", "dead reel"],
    expired: true
  },
  {
    name: "studioboss",
    color: "hsl(280 45% 62%)",
    body: "what's your rate?",
    timestamp: "2:19 PM",
    badges: ["no reply"]
  },
  {
    name: "Random42",
    color: "hsl(130 40% 62%)",
    body: "",
    timestamp: "",
    ghost: true,
    ghostLabel: "(no response - 3 days later)"
  },
  {
    name: "NovaDev",
    color: "hsl(340 50% 62%)",
    body: "[deleted message]",
    timestamp: "2:22 PM",
    deleted: true
  },
  {
    name: "HireBot",
    color: "hsl(0 0% 45%)",
    body: "FIRE SCRIPTER FOR HIRE FIRE DM for rates FIRE",
    timestamp: "2:25 PM",
    badges: ["spam", "thread noise"],
    spam: true
  }
];

const COMPILER_OUTPUT: BootLine[] = [
  { text: "ROLE: Scripter ✓", tone: "success" },
  { text: "RATE: 45 R$/hr ✓", tone: "success" },
  { text: "AVAILABILITY: Now ✓", tone: "success" },
  { text: "SHIPPED_WORK: 3 games, 17.3M visits ✓", tone: "success" },
  { text: "PROOF: Roblox OAuth verified ✓", tone: "success" },
  { text: "Discord noise -> compiled into Weld signal.", tone: "success", bold: true }
];

const ROLE_CHIPS: ReadonlyArray<[RoleKey, string]> = [
  ["scripter", "SCRIPTER"],
  ["ui", "UI / UX"],
  ["vfx", "VFX"],
  ["builder", "BUILDER"],
  ["animator", "ANIMATOR"],
  ["designer", "DESIGNER"],
  ["systems", "SYSTEMS"]
];

const ROLE_EXPLORER_DATA: Record<
  RoleKey,
  {
    name: string;
    rate: string;
    visits: string;
    games: number;
    availability: string;
    verified: string;
    skills: string[];
    shippedWork: string;
  }
> = {
  scripter: {
    name: "xarion_dev",
    rate: "45-60 R$/hr",
    visits: "17.3M",
    games: 3,
    availability: "Open now",
    verified: "Roblox OAuth verified",
    skills: ["LUAU", "OOP", "DATASTORESERVICE"],
    shippedWork: "Combat loop, persistence, admin tooling"
  },
  ui: {
    name: "PixelUI",
    rate: "35-50 R$/hr",
    visits: "22M",
    games: 5,
    availability: "Open this week",
    verified: "Roblox profile proof attached",
    skills: ["UI/UX", "ROACT", "TWEEN"],
    shippedWork: "HUD revamp, onboarding, shop conversion"
  },
  vfx: {
    name: "FX_Master",
    rate: "30-45 R$/hr",
    visits: "12M",
    games: 4,
    availability: "Three slots open",
    verified: "Reel linked and verified",
    skills: ["VFX", "PARTICLES", "BEAM"],
    shippedWork: "Hit confirms, spell bursts, trails"
  },
  builder: {
    name: "BlockCraft",
    rate: "25-40 R$/hr",
    visits: "31M",
    games: 7,
    availability: "Sprint lane open",
    verified: "World capture linked",
    skills: ["BUILDING", "TERRAIN", "STUDIO"],
    shippedWork: "Event maps, social hubs, traversal spaces"
  },
  animator: {
    name: "PixelDrift",
    rate: "28-35 R$/hr",
    visits: "36.2M",
    games: 4,
    availability: "Monthly slots",
    verified: "Combat reel verified",
    skills: ["ANIMATION", "RIGGING", "MOON ANIMATOR"],
    shippedWork: "Movement packs, combat sets, emotes"
  },
  designer: {
    name: "DesignPro",
    rate: "40-60 R$/hr",
    visits: "8.5M",
    games: 2,
    availability: "Consult or sprint",
    verified: "Progression docs linked",
    skills: ["GAME DESIGN", "ECONOMY", "BALANCING"],
    shippedWork: "Progression tuning, economy rebalance"
  },
  systems: {
    name: "luamancer",
    rate: "55-80 R$/hr",
    visits: "65M",
    games: 6,
    availability: "Booked but reviewable",
    verified: "Backend stack proof verified",
    skills: ["FULL-STACK", "DATASTORESERVICE", "ECONOMY"],
    shippedWork: "Matchmaking, telemetry, CI, automation"
  }
};

const HOW_COMMANDS: CommandSequence[] = [
  {
    command: "$ weld auth roblox --proof",
    lines: [
      { text: "  -> linking Roblox account... ✓", tone: "success" },
      { text: "  -> scanning 3 shipped games... ✓", tone: "success" },
      { text: "  -> verifying 17.3M total visits... ✓", tone: "success" },
      { text: "  -> PROOF_VERIFIED", tone: "success", bold: true }
    ],
    summary: "Proof is scanned first, not guessed from DMs."
  },
  {
    command: "$ weld profile set --role scripter --rate 45 --avail now",
    lines: [
      { text: "  -> setting role: Scripter ✓", tone: "success" },
      { text: "  -> setting rate: 45 R$/hr ✓", tone: "success" },
      { text: "  -> availability: OPEN ✓", tone: "success" },
      { text: "  -> PROFILE_LIVE", tone: "success", bold: true }
    ],
    summary: "Rate and availability become visible before the first ask."
  },
  {
    command: "$ weld discover --match studios",
    lines: [
      { text: "  -> scanning studio filters...", tone: "active" },
      { text: "  -> 2 studios matched your profile ✓", tone: "success" },
      { text: "  -> incoming intro from NovaStar Studios", tone: "neutral" },
      { text: "  -> READY_FOR_DISCOVERY", tone: "success", bold: true }
    ],
    summary: "Studios pull you in with context instead of thread chaos."
  }
];

const REWARD_CARDS: RewardCard[] = [
  {
    count: 1,
    label: "Early profile review",
    description: "Your profile gets reviewed before the general queue.",
    badge: "01"
  },
  {
    count: 2,
    label: "Priority queue bump",
    description: "Move up in the beta access queue.",
    badge: "02"
  },
  {
    count: 3,
    label: "First-wave consideration",
    description: "Considered for the first beta wave.",
    badge: "03"
  },
  {
    count: 4,
    label: "Founder badge lane",
    description: "Access the founder badge review lane.",
    badge: "04"
  },
  {
    count: 5,
    label: "Studio preview access",
    description: "Early access to studio-side features.",
    badge: "05"
  }
];

const STUDIO_FILTER_STATS = [
  ["BY ROLE", "Scripter, UI, VFX, Systems"],
  ["BY RATE", "Hourly, package, milestone"],
  ["BY AVAILABILITY", "Now, next sprint, limited"],
  ["BY SHIPPED WORK", "One proof link before the DM"]
] as const;

function splitTitle(title: string) {
  return title.split("\n");
}

function joinHref(mode: Audience, search: string) {
  const base = mode === "studio" ? "/studios" : "/";
  return search ? `${base}?${search}` : base;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function prefersReducedMotion() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function cycleHeroProfile(profileIndex: number) {
  return (profileIndex + 1) % HERO_PROFILES.length;
}

function typeLine(
  targetEl: HTMLElement | null,
  text: string,
  {
    speed = 30,
    delay = 0,
    onComplete = null
  }: {
    speed?: number;
    delay?: number;
    onComplete?: (() => void) | null;
  } = {}
) {
  if (!targetEl || typeof window === "undefined") {
    return () => undefined;
  }

  if (prefersReducedMotion()) {
    targetEl.textContent = text;
    onComplete?.();
    return () => undefined;
  }

  let rafId = 0;
  let timeoutId = 0;
  let startedAt = 0;
  let cancelled = false;

  const step = (timestamp: number) => {
    if (cancelled) {
      return;
    }

    if (!startedAt) {
      startedAt = timestamp;
    }

    const characters = Math.min(
      text.length,
      Math.floor((timestamp - startedAt) / speed) + 1
    );

    targetEl.textContent = text.slice(0, characters);

    if (characters < text.length) {
      rafId = window.requestAnimationFrame(step);
      return;
    }

    onComplete?.();
  };

  targetEl.textContent = "";

  timeoutId = window.setTimeout(() => {
    rafId = window.requestAnimationFrame(step);
  }, delay);

  return () => {
    cancelled = true;
    window.clearTimeout(timeoutId);
    window.cancelAnimationFrame(rafId);
  };
}

function runBootSequence(
  containerEl: HTMLElement | null,
  lines: BootLine[],
  {
    lineDelay = 180,
    onComplete = null
  }: {
    lineDelay?: number;
    onComplete?: (() => void) | null;
  } = {}
) {
  if (!containerEl || typeof window === "undefined") {
    return () => undefined;
  }

  containerEl.innerHTML = "";

  if (prefersReducedMotion()) {
    lines.forEach((line) => {
      const row = document.createElement("div");
      row.className = "boot-line";
      row.dataset.tone = line.tone ?? "neutral";
      if (line.bold) {
        row.dataset.bold = "true";
      }
      row.textContent = line.text;
      containerEl.appendChild(row);
    });
    onComplete?.();
    return () => undefined;
  }

  let cancelled = false;
  const cleanups: Array<() => void> = [];

  const addRow = (line: BootLine) => {
    const row = document.createElement("div");
    row.className = "boot-line";
    row.dataset.tone = line.tone ?? "neutral";
    if (line.bold) {
      row.dataset.bold = "true";
    }
    const textNode = document.createElement("span");
    row.appendChild(textNode);
    containerEl.appendChild(row);
    return textNode;
  };

  void (async () => {
    for (const line of lines) {
      if (cancelled) {
        return;
      }

      const target = addRow(line);
      const stopTyping = typeLine(target, line.text, {
        speed: 18
      });
      cleanups.push(stopTyping);
      await wait(line.text.length * 18 + (line.delay ?? lineDelay));
    }

    if (!cancelled) {
      onComplete?.();
    }
  })();

  return () => {
    cancelled = true;
    cleanups.forEach((cleanup) => cleanup());
  };
}

function animateNumber(
  element: HTMLElement | null,
  from: number,
  to: number,
  {
    duration = 1200,
    suffix = ""
  }: {
    duration?: number;
    suffix?: string;
  } = {}
) {
  if (!element || typeof window === "undefined") {
    return () => undefined;
  }

  if (prefersReducedMotion()) {
    element.textContent = `${Math.round(to)}${suffix}`;
    return () => undefined;
  }

  let rafId = 0;
  let startedAt = 0;
  const range = to - from;

  const step = (timestamp: number) => {
    if (!startedAt) {
      startedAt = timestamp;
    }

    const progress = Math.min(1, (timestamp - startedAt) / duration);
    const value = from + range * progress;
    const rounded = Number.isInteger(to) ? Math.round(value) : Number(value.toFixed(1));
    element.textContent = `${rounded}${suffix}`;

    if (progress < 1) {
      rafId = window.requestAnimationFrame(step);
    }
  };

  rafId = window.requestAnimationFrame(step);

  return () => {
    window.cancelAnimationFrame(rafId);
  };
}

function flashNode(element: HTMLElement | null, className: string, duration = 300) {
  if (!element || typeof window === "undefined") {
    return () => undefined;
  }

  element.classList.add(className);
  const timeoutId = window.setTimeout(() => {
    element.classList.remove(className);
  }, duration);

  return () => {
    window.clearTimeout(timeoutId);
    element.classList.remove(className);
  };
}

function highlightSkillChips(
  containerEl: HTMLElement | null,
  { staggerMs = 80 }: { staggerMs?: number } = {}
) {
  if (!containerEl || typeof window === "undefined") {
    return () => undefined;
  }

  const chips = Array.from(
    containerEl.querySelectorAll<HTMLElement>("[data-skill-chip]")
  );

  chips.forEach((chip) => chip.classList.remove("chip-active"));

  if (prefersReducedMotion()) {
    chips.forEach((chip) => chip.classList.add("chip-active"));
    return () => undefined;
  }

  const timers: number[] = [];

  chips.forEach((chip, index) => {
    const timer = window.setTimeout(() => {
      chip.classList.add("chip-active");
    }, index * staggerMs);
    timers.push(timer);
  });

  return () => {
    timers.forEach((timer) => window.clearTimeout(timer));
  };
}

function compileDiscordThread(
  discordEl: HTMLElement | null,
  weldEl: HTMLElement | null
) {
  if (!discordEl || !weldEl || typeof window === "undefined") {
    return () => undefined;
  }

  const fields = Array.from(
    weldEl.querySelectorAll<HTMLElement>("[data-compile-field]")
  );

  if (prefersReducedMotion()) {
    discordEl.classList.add("is-compiled");
    fields.forEach((field) => field.classList.add("is-live"));
    return () => undefined;
  }

  const timers: number[] = [];
  discordEl.classList.add("is-compiled");

  fields.forEach((field, index) => {
    const timer = window.setTimeout(() => {
      field.classList.add("is-live");
    }, 180 + index * 140);
    timers.push(timer);
  });

  return () => {
    timers.forEach((timer) => window.clearTimeout(timer));
  };
}

function animateRewardProgress(
  count: number,
  {
    staggerMs = 200,
    containerEl = null
  }: {
    staggerMs?: number;
    containerEl?: HTMLElement | null;
  } = {}
) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const scope = containerEl ?? document.body;
  const cards = Array.from(scope.querySelectorAll<HTMLElement>("[data-reward-card]"));

  cards.forEach((card) => {
    card.classList.remove("reward-live", "reward-next");
  });

  if (prefersReducedMotion()) {
    cards.forEach((card) => {
      const threshold = Number(card.dataset.threshold ?? "0");
      if (threshold <= count) {
        card.classList.add("reward-live");
      } else if (threshold === count + 1) {
        card.classList.add("reward-next");
      }
    });
    return () => undefined;
  }

  const timers: number[] = [];

  cards.forEach((card) => {
    const threshold = Number(card.dataset.threshold ?? "0");

    if (threshold <= count) {
      const timer = window.setTimeout(() => {
        card.classList.add("reward-live");
      }, threshold * staggerMs);
      timers.push(timer);
      return;
    }

    if (threshold === count + 1) {
      const timer = window.setTimeout(() => {
        card.classList.add("reward-next");
      }, (count + 1) * staggerMs);
      timers.push(timer);
    }
  });

  return () => {
    timers.forEach((timer) => window.clearTimeout(timer));
  };
}

function activateInviteKey(containerEl: HTMLElement | null) {
  if (!containerEl) {
    return () => undefined;
  }

  const cleanupFlash = flashNode(containerEl, "invite-activated", 520);
  containerEl.dataset.active = "true";

  return () => {
    containerEl.dataset.active = "false";
    cleanupFlash();
  };
}

function setupMagneticButtons(selector: string) {
  if (typeof window === "undefined" || prefersReducedMotion()) {
    return () => undefined;
  }

  const buttons = Array.from(
    document.querySelectorAll<HTMLElement>(selector)
  );

  const cleanups = buttons.map((button) => {
    const handleMove = (event: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const offsetX = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
      const offsetY = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
      button.style.transform = `translate(${offsetX * 10}px, ${offsetY * 8}px)`;
    };

    const handleLeave = () => {
      button.style.transform = "translate(0px, 0px)";
    };

    button.addEventListener("mousemove", handleMove);
    button.addEventListener("mouseleave", handleLeave);

    return () => {
      button.removeEventListener("mousemove", handleMove);
      button.removeEventListener("mouseleave", handleLeave);
      button.style.transform = "translate(0px, 0px)";
    };
  });

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

function setupSectionReveals(
  selector: string,
  { threshold = 0.18 }: { threshold?: number } = {}
) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector));

  if (prefersReducedMotion()) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return () => undefined;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold }
  );

  nodes.forEach((node) => observer.observe(node));

  return () => {
    observer.disconnect();
  };
}

function scrambleText(
  targetEl: HTMLElement | null,
  text: string,
  { duration = 420 }: { duration?: number } = {}
) {
  if (!targetEl || typeof window === "undefined") {
    return () => undefined;
  }

  if (prefersReducedMotion()) {
    targetEl.textContent = text;
    return () => undefined;
  }

  const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#/<>-";
  let rafId = 0;
  let startedAt = 0;

  const step = (timestamp: number) => {
    if (!startedAt) {
      startedAt = timestamp;
    }

    const progress = Math.min(1, (timestamp - startedAt) / duration);
    const resolvedChars = Math.floor(text.length * progress);

    targetEl.textContent = text
      .split("")
      .map((char, index) => {
        if (char === " ") {
          return " ";
        }

        if (index < resolvedChars) {
          return text[index];
        }

        return glyphs[Math.floor(Math.random() * glyphs.length)];
      })
      .join("");

    if (progress < 1) {
      rafId = window.requestAnimationFrame(step);
      return;
    }

    targetEl.textContent = text;
  };

  rafId = window.requestAnimationFrame(step);

  return () => {
    window.cancelAnimationFrame(rafId);
    targetEl.textContent = text;
  };
}

function parseRateMetric(rate: string) {
  const value = Number(rate.replace(/[^\d]/g, "")) || 0;
  const suffix = rate.includes("/pack") ? "/pack" : rate.includes("/hr") ? "/hr" : "";

  return {
    value,
    suffix
  };
}

function getPrimaryCta(mode: Audience) {
  return mode === "studio" ? "GET HIRING ACCESS ->" : "CLAIM BETA INVITE ->";
}

function getInvitePrompt(mode: Audience) {
  return mode === "studio"
    ? "> get_hiring_access --email="
    : "> claim_beta_invite --email=";
}

function getCaptureLabel(mode: Audience, phase: CapturePhase) {
  if (phase === "executing") {
    return "EXECUTING...";
  }

  if (phase === "saved") {
    return "SAVED";
  }

  if (phase === "redirecting") {
    return "REDIRECTING...";
  }

  return getPrimaryCta(mode);
}

export default function MarketingPage({
  initialMode,
  sourceVariant,
  page
}: MarketingPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Audience>(initialMode);
  const [heroIndex, setHeroIndex] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);
  const [activeRole, setActiveRole] = useState<RoleKey>("scripter");
  const [heroEmail, setHeroEmail] = useState("");
  const [finalEmail, setFinalEmail] = useState("");
  const [heroStatus, setHeroStatus] = useState("");
  const [finalStatus, setFinalStatus] = useState("");
  const [capturePhase, setCapturePhase] = useState<Record<CaptureSource, CapturePhase>>({
    hero: "idle",
    "final-cta": "idle"
  });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeFaq, setActiveFaq] = useState(0);
  const [shareStatus, setShareStatus] = useState("");
  const [isPending, startTransition] = useTransition();
  const trackedDepths = useRef(new Set<number>());
  const heroCaptureRef = useRef<HTMLDivElement | null>(null);
  const finalCaptureRef = useRef<HTMLDivElement | null>(null);

  const audienceCopy = AUDIENCE_COPY[mode];
  const sourceCopy = SOURCE_VARIANTS[sourceVariant][mode];
  const activeProfile = HERO_PROFILES[heroIndex];
  const activeRolePreview = ROLE_PREVIEWS[activeRole];
  const activeRoleDetails = ROLE_EXPLORER_DATA[activeRole];
  const searchString = searchParams.toString();
  const accent = mode === "studio" ? "#229BD2" : "#FF5A2D";
  const accentSoft = mode === "studio" ? "#4CC9F0" : "#FF6B4A";
  const accentButtonClass =
    mode === "studio"
      ? "bg-[var(--roblox-blue)] text-white hover:bg-[var(--roblox-blue-light)]"
      : "bg-[var(--orange-hot)] text-[#fff7f1] hover:bg-[var(--red-l)]";
  const headerButtonClass =
    mode === "studio"
      ? "border-[rgba(34,155,210,0.34)] bg-[rgba(34,155,210,0.12)] text-[var(--roblox-blue-light)] hover:border-[rgba(76,201,240,0.42)] hover:bg-[rgba(34,155,210,0.18)]"
      : "border-[rgba(255,90,45,0.3)] bg-[rgba(255,90,45,0.1)] text-[#ffd9cd] hover:border-[rgba(255,107,74,0.4)] hover:bg-[rgba(255,90,45,0.16)]";
  const previewReferralCount = mode === "studio" ? 1 : 2;
  const rateMetric = parseRateMetric(activeProfile.rate);
  const heroBootLines = useMemo(() => HERO_BOOT_LINES[mode], [mode]);

  useEffect(() => {
    setBootComplete(false);
  }, [mode]);

  useEffect(() => {
    captureAttributionFromLocation();
    void trackEvent({
      eventName: "landing_view",
      page,
      audience: mode,
      payload: {
        variant: sourceVariant
      }
    });
  }, [mode, page, sourceVariant]);

  useEffect(() => {
    const handleScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const nextProgress = max <= 0 ? 0 : Math.min(1, window.scrollY / max);
      setScrollProgress(nextProgress);

      const percent = Math.round(nextProgress * 100);
      [25, 50, 75].forEach((threshold) => {
        if (percent >= threshold && !trackedDepths.current.has(threshold)) {
          trackedDepths.current.add(threshold);
          void trackEvent({
            eventName: "scroll_depth",
            page,
            audience: mode,
            payload: { threshold }
          });
        }
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [mode, page]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setHeroIndex((current) => cycleHeroProfile(current));
    }, HERO_ROTATION_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const cleanupReveal = setupSectionReveals("[data-reveal]", {
      threshold: 0.18
    });
    const cleanupMagnetic = setupMagneticButtons("[data-magnetic='true']");

    return () => {
      cleanupReveal();
      cleanupMagnetic();
    };
  }, [mode]);

  function handleModeChange(nextMode: Audience) {
    if (nextMode === mode) {
      return;
    }

    persistAudiencePreference(nextMode);
    void trackEvent({
      eventName: "audience_switch_clicked",
      page,
      audience: nextMode,
      payload: { from: mode, to: nextMode }
    });

    setMode(nextMode);
    startTransition(() => {
      router.push(joinHref(nextMode, searchString));
    });
  }

  async function handleCapture(source: CaptureSource) {
    const email = source === "hero" ? heroEmail : finalEmail;
    const setStatus = source === "hero" ? setHeroStatus : setFinalStatus;
    const containerRef = source === "hero" ? heroCaptureRef : finalCaptureRef;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("Enter a valid email to unlock your invite state.");
      return;
    }

    void trackEvent({
      eventName: "cta_click",
      page,
      audience: mode,
      payload: { source }
    });

    setCapturePhase((current) => ({
      ...current,
      [source]: "executing"
    }));
    setStatus("> executing invite capture...");

    try {
      if (!prefersReducedMotion()) {
        await wait(220);
      }

      const response = await submitSignupCapture({
        email,
        audience: mode,
        source,
        page,
        variant: sourceVariant
      });

      setCapturePhase((current) => ({
        ...current,
        [source]: "saved"
      }));
      setStatus("> saved.");

      activateInviteKey(containerRef.current);

      if (!prefersReducedMotion()) {
        await wait(220);
      }

      setCapturePhase((current) => ({
        ...current,
        [source]: "redirecting"
      }));
      setStatus("> redirecting to invite state...");

      if (!prefersReducedMotion()) {
        await wait(280);
      }

      router.push(`/invite/${response.inviteCode}`);
    } catch (error) {
      setCapturePhase((current) => ({
        ...current,
        [source]: "idle"
      }));
      setStatus(error instanceof Error ? error.message : "Could not save your invite.");
    }
  }

  async function handleSharePreview(channel: "discord" | "x" | "linkedin" | "copy") {
    const shareUrl = `${WAITLIST_URL}/?ref=preview`;
    const shareText =
      mode === "studio"
        ? `Weld studio beta preview -> ${shareUrl}`
        : `Weld developer beta preview -> ${shareUrl}`;

    setShareStatus("");
    void trackEvent({
      eventName: "referral_share",
      page,
      audience: mode,
      payload: { channel, surface: "landing-preview" }
    });

    if (channel === "copy") {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus("Preview share link copied.");
      } catch {
        setShareStatus("Copy failed. Use weldroblox.com directly.");
      }
      return;
    }

    if (channel === "discord") {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        setShareStatus("Discord share copy copied for paste.");
      } catch {
        setShareStatus("Discord share copy is ready to paste.");
      }
      return;
    }

    if (channel === "x") {
      window.open(
        `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
        "_blank",
        "noopener,noreferrer"
      );
      setShareStatus("X share opened.");
      return;
    }

    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setShareStatus("LinkedIn share opened.");
  }

  return (
    <div
      className="min-h-screen bg-[var(--bg)] text-[var(--cream)]"
      style={
        {
          "--accent": accent,
          "--accent-soft": accentSoft
        } as CSSProperties
      }
    >
      <ScrollProgressBar progress={scrollProgress} />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,90,45,0.12),transparent_28%),radial-gradient(circle_at_78%_10%,rgba(34,155,210,0.16),transparent_22%),linear-gradient(180deg,var(--bg)_0%,var(--bg2)_100%)]" />
      <div className="relative">
        <header
          className={`sticky top-0 z-50 border-b backdrop-blur-[12px] transition ${
            scrollProgress > 0.02
              ? "border-white/10 bg-[rgba(12,14,15,0.88)] shadow-[0_20px_54px_rgba(0,0,0,0.3)]"
              : "border-white/[0.04] bg-[rgba(12,14,15,0.74)]"
          }`}
        >
          <div className="mx-auto w-full max-w-[1240px] px-4 py-3 md:px-6 lg:px-8">
            <div className="header-rail relative overflow-hidden rounded-[30px] border border-white/[0.08] px-4 py-3 md:px-5 md:py-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 md:grid-cols-[minmax(220px,1fr)_auto_minmax(220px,1fr)] md:gap-4">
                <Link href={joinHref(mode, searchString)} className="flex min-w-0 items-center gap-3 justify-self-start">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[15px] border border-white/10 bg-white/[0.04] shadow-[0_10px_28px_rgba(0,0,0,0.16)]">
                    <Image
                      src="/Assets/weld-logo-official.svg"
                      alt="Weld logo"
                      width={24}
                      height={24}
                    />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="font-display text-[1.5rem] italic leading-none tracking-[-0.05em] text-white/92 md:text-[1.7rem]">
                      weld.
                    </span>
                    <span className="truncate font-mono text-[9px] uppercase tracking-[0.16em] text-white/42 md:text-[10px]">
                      Roblox talent roster
                    </span>
                  </span>
                </Link>

                <div className="hidden md:flex md:justify-self-center">
                  <AudienceToggle mode={mode} onChange={handleModeChange} disabled={isPending} />
                </div>

                <a
                  href="#hero-capture"
                  className={`magnetic-button header-command-button inline-flex min-h-[44px] items-center justify-center self-start rounded-full border px-4 text-center font-mono text-[9px] uppercase tracking-[0.13em] whitespace-nowrap sm:min-h-[46px] sm:px-5 sm:text-[10px] md:justify-self-end ${headerButtonClass} command-button`}
                  data-magnetic="true"
                >
                  {getPrimaryCta(mode)}
                </a>
              </div>
            </div>

            <div className="mt-3 md:hidden">
              <AudienceToggle
                mode={mode}
                onChange={handleModeChange}
                disabled={isPending}
                className="w-full"
                fullWidth
              />
            </div>
          </div>
        </header>

        <main id="top">
          <section className="relative overflow-hidden border-b border-white/[0.05]">
            <div className="mx-auto grid min-h-[calc(100vh-82px)] w-full max-w-[1200px] lg:grid-cols-[540px_minmax(0,1fr)]">
              <aside className="terminal-rail relative overflow-hidden border-b border-white/[0.05] px-5 py-16 md:px-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-[120px]">
                <div className="terminal-grid pointer-events-none absolute inset-0" />
                <div className="terminal-vignette pointer-events-none absolute inset-0" />
                <div className="scan-overlay pointer-events-none absolute inset-x-0 top-0 h-full" />

                <div className="relative">
                  <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">
                    {mode === "studio"
                      ? "// browsing verified developers"
                      : "// your verified profile"}
                  </div>

                  <div
                    className="is-visible rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,21,0.98),rgba(7,9,13,0.98))] p-5 shadow-[0_34px_90px_rgba(0,0,0,0.5)]"
                    data-reveal
                  >
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/42">
                        <span className="flex gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-[var(--orange-hot)]" />
                          <span className="h-2.5 w-2.5 rounded-full bg-[#FFBE74]" />
                          <span className="h-2.5 w-2.5 rounded-full bg-[var(--acid-green)]" />
                        </span>
                        <span>weld.roster -- live_preview</span>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/54">
                        {mode === "studio" ? "Studio lane" : "Developer lane"}
                      </span>
                    </div>

                    <div className="mt-5 rounded-[18px] border border-white/[0.08] bg-[rgba(255,255,255,0.03)] p-4">
                      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/38">
                        boot.feed
                      </div>
                      <BootFeed lines={heroBootLines} onComplete={() => setBootComplete(true)} />
                    </div>

                    <div
                      className={`mt-5 transition duration-500 ${
                        bootComplete
                          ? "translate-y-0 opacity-100"
                          : "pointer-events-none translate-y-3 opacity-0"
                      }`}
                    >
                      <div key={activeProfile.handle} className="animate-[fadeUp_.45s_cubic-bezier(.16,1,.3,1)]">
                        <HeroProfileCard
                          profile={activeProfile}
                          accent={accent}
                          audience={mode}
                        />
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/36">
                        {`${heroIndex + 1}/${HERO_PROFILES.length} live profile rotation`}
                      </div>
                      <div className="flex gap-2">
                        {HERO_PROFILES.map((profile, index) => (
                          <button
                            key={profile.handle}
                            type="button"
                            aria-label={`Preview ${profile.displayName}`}
                            onClick={() => setHeroIndex(index)}
                            className={`rounded-full border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] transition ${
                              heroIndex === index
                                ? "border-white/18 bg-white/[0.08] text-white"
                                : "border-white/10 bg-white/[0.03] text-white/52 hover:bg-white/[0.06]"
                            }`}
                          >
                            {`0${index + 1}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              <div className="relative flex items-center px-5 py-16 md:px-8 lg:px-16 lg:py-[120px]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 top-[-160px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(255,90,45,0.12),transparent_64%)]"
                />
                <div className="relative mx-auto w-full max-w-[540px] lg:mx-0">
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.18em]"
                    style={{ color: accentSoft }}
                  >
                    {audienceCopy.eyebrow}
                  </span>
                  <h1 className="mt-6 font-display text-[3.6rem] italic leading-[0.9] tracking-[-0.05em] text-white/92 md:text-[5.7rem]">
                    {splitTitle(sourceCopy.title).map((line, index) => (
                      <span key={`${line}-${index}`} className="block">
                        {line}
                      </span>
                    ))}
                  </h1>
                  <p className="mt-6 max-w-[30rem] text-[15px] leading-8 text-white/68 md:text-[16px]">
                    {sourceCopy.copy}
                  </p>
                  <p className="mt-4 max-w-[34rem] font-mono text-[10px] uppercase tracking-[0.16em] text-white/34">
                    {sourceCopy.sourceLine}
                  </p>

                  <div
                    id="hero-capture"
                    ref={heroCaptureRef}
                    className="is-visible mt-10 rounded-[22px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.24)]"
                    data-reveal
                    aria-live="polite"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                      <label className="flex-1 rounded-[16px] border border-white/10 bg-[rgba(5,7,13,0.76)] px-4 py-3">
                        <span className="sr-only">Email address</span>
                        <input
                          type="email"
                          value={heroEmail}
                          onChange={(event) => setHeroEmail(event.target.value)}
                          onFocus={() =>
                            void trackEvent({
                              eventName: "hero_input_started",
                              page,
                              audience: mode,
                              payload: { source: "hero" }
                            })
                          }
                          placeholder={getInvitePrompt(mode)}
                          className="w-full bg-transparent font-mono text-[11px] uppercase tracking-[0.1em] text-white outline-none placeholder:text-white/24"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => void handleCapture("hero")}
                        className={`magnetic-button inline-flex min-h-[54px] items-center justify-center rounded-[16px] px-6 font-mono text-[11px] uppercase tracking-[0.16em] ${accentButtonClass} command-button`}
                        data-magnetic="true"
                      >
                        {getCaptureLabel(mode, capturePhase.hero)}
                      </button>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-white/46">{audienceCopy.hint}</p>
                    {heroStatus ? (
                      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-white/72">
                        {heroStatus}
                      </p>
                    ) : null}
                  </div>

                  <div className="is-visible mt-8 flex flex-wrap gap-2" data-reveal>
                    {audienceCopy.microProof.map((item) => (
                      <span
                        key={item}
                        className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/62 ${
                          item.toLowerCase().includes("referral")
                            ? "text-[var(--acid-green-light)]"
                            : ""
                        }`}
                      >
                        {item.toLowerCase().includes("referral") ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--acid-green)] availability-pulse" />
                        ) : null}
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="is-visible mt-10 grid gap-3 md:grid-cols-3" data-reveal>
                    <AnimatedMetricCard
                      label="Shipped games"
                      value={activeProfile.shippedGames}
                      sublabel="from active preview"
                    />
                    <AnimatedMetricCard
                      label="Rate signal"
                      value={rateMetric.value}
                      prefix="$"
                      suffix={rateMetric.suffix}
                      sublabel="visible before the DM"
                    />
                    <AnimatedMetricCard
                      label="Reply window"
                      value={activeProfile.responseHours}
                      suffix="h"
                      sublabel="counted on scroll"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <PainSection accent={accent} accentSoft={accentSoft} />

          <RoleExplorerSection
            activeRole={activeRole}
            activeRolePreview={activeRolePreview}
            activeRoleDetails={activeRoleDetails}
            accent={accent}
            accentSoft={accentSoft}
            onRoleChange={(role) => setActiveRole(role)}
          />

          <HowSection accentSoft={accentSoft} />

          <BetaSection
            mode={mode}
            previewReferralCount={previewReferralCount}
            onShare={handleSharePreview}
            shareStatus={shareStatus}
          />

          <StudioBridgeSection
            mode={mode}
            accentButtonClass={accentButtonClass}
            onModeChange={handleModeChange}
          />

          <HonestySection />

          <FAQSection
            activeFaq={activeFaq}
            onToggle={(index) => setActiveFaq((current) => (current === index ? -1 : index))}
          />

          <FinalCTASection
            mode={mode}
            finalEmail={finalEmail}
            finalStatus={finalStatus}
            capturePhase={capturePhase["final-cta"]}
            accentButtonClass={accentButtonClass}
            onEmailChange={setFinalEmail}
            onSubmit={() => void handleCapture("final-cta")}
            containerRef={finalCaptureRef}
          />
        </main>

        <Footer />
      </div>
    </div>
  );
}

function ScrollProgressBar({ progress }: { progress: number }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-white/[0.04]">
      <div
        className="h-full bg-[var(--accent)] shadow-[0_0_18px_var(--accent)] transition-[width] duration-150"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}

function AudienceToggle({
  mode,
  onChange,
  disabled,
  className,
  fullWidth
}: {
  mode: Audience;
  onChange: (nextMode: Audience) => void;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}) {
  const options = [
    {
      value: "developer" as const,
      label: "I build games"
    },
    {
      value: "studio" as const,
      label: "I hire talent"
    }
  ];
  const activeTrackStyle: CSSProperties = {
    width: "calc(50% - 0.125rem)",
    transform: mode === "studio" ? "translateX(calc(100% - 0.125rem))" : "translateX(0)",
    background:
      mode === "studio"
        ? "linear-gradient(180deg, rgba(18,31,44,0.98), rgba(11,18,26,0.98))"
        : "linear-gradient(180deg, rgba(30,19,15,0.98), rgba(18,12,10,0.98))",
    boxShadow:
      mode === "studio"
        ? "0 10px 26px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px rgba(76,201,240,0.18)"
        : "0 10px 26px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px rgba(255,107,74,0.18)"
  };

  return (
    <div
      role="radiogroup"
      aria-label="Audience mode"
      className={`relative inline-grid min-h-[52px] grid-cols-2 items-center overflow-hidden rounded-full border border-white/10 bg-[rgba(255,255,255,0.03)] p-[3px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_14px_30px_rgba(0,0,0,0.18)] ${className ?? ""}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-[3px] left-[3px] z-0 rounded-full border border-white/8 transition-transform duration-300 ease-out"
        style={activeTrackStyle}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-[10px] left-1/2 z-0 w-px -translate-x-1/2 bg-white/[0.06]"
      />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={mode === option.value}
          disabled={disabled}
          onClick={() => onChange(option.value)}
          className={`relative z-10 rounded-full px-4 py-[0.8rem] font-mono text-[10px] font-medium uppercase tracking-[0.14em] transition duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
            fullWidth ? "min-w-0 flex-1" : "min-w-[150px] lg:min-w-[158px]"
          } ${
            mode === option.value
              ? "text-white"
              : "text-white/58 hover:text-white/84"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function BootFeed({
  lines,
  onComplete
}: {
  lines: BootLine[];
  onComplete: () => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return runBootSequence(containerRef.current, lines, {
      lineDelay: 160,
      onComplete
    });
  }, [lines]);

  return (
    <div
      ref={containerRef}
      className="min-h-[168px] space-y-2"
      aria-live="polite"
    />
  );
}

function HeroProfileCard({
  profile,
  accent,
  audience
}: {
  profile: HeroProfile;
  accent: string;
  audience: Audience;
}) {
  const skillContainerRef = useRef<HTMLDivElement | null>(null);
  const shippedRef = useRef<HTMLSpanElement | null>(null);
  const responseRef = useRef<HTMLSpanElement | null>(null);
  const tierRef = useRef<HTMLSpanElement | null>(null);
  const tierValue = Number(profile.referralTier.replace(/[^\d]/g, "")) || 0;

  useEffect(() => {
    const cleanups = [
      animateNumber(shippedRef.current, 0, profile.shippedGames),
      animateNumber(responseRef.current, 0, profile.responseHours, { suffix: "h" }),
      animateNumber(tierRef.current, 0, tierValue),
      highlightSkillChips(skillContainerRef.current, { staggerMs: 80 })
    ];

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [profile.handle, profile.responseHours, profile.shippedGames, tierValue]);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-[20px] border border-white/10 bg-[rgba(15,18,21,0.98)] shadow-[0_30px_90px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.03] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/34">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--orange-hot)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFBE74]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--acid-green)]" />
          </span>
          <span>{`weld.profile -- ${profile.handle}`}</span>
        </div>

        <div className="space-y-5 p-5">
          <div className="flex items-start gap-4">
            <div
              className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] font-display text-[1.75rem] italic text-white shadow-[0_12px_28px_rgba(0,0,0,0.28)]"
              style={{
                background: `linear-gradient(135deg, ${accent}, ${accent}aa)`
              }}
            >
              {profile.displayName.slice(0, 1)}
              <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border-2 border-[var(--terminal-mid)] bg-[#5865F2] text-[8px] font-bold not-italic text-white">
                R
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-[1.45rem] italic tracking-[-0.03em] text-white/94">
                  {profile.displayName}
                </h2>
                <span className="rounded-full border border-[var(--acid-green)]/20 bg-[var(--acid-green)]/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--acid-green-light)]">
                  Roblox verified
                </span>
              </div>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white/32">
                @{profile.handle}
              </p>
              <p className="mt-2 text-[13px] leading-6 text-white/58">
                {profile.proofSummary}
              </p>
            </div>

            <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--acid-green)]/20 bg-[var(--acid-green)]/10 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--acid-green-light)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--acid-green)] availability-pulse" />
              {profile.availability}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <MiniStatCard label="Shipped games" valueRef={shippedRef} />
            <MiniStatCard label="Response" valueRef={responseRef} />
            <MiniStatCard label="Tier" valueRef={tierRef} />
          </div>

          <div ref={skillContainerRef} className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                data-skill-chip
                className="terminal-chip rounded-[8px] border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.08em]"
                style={{
                  borderColor: `${accent}44`,
                  background: `${accent}14`,
                  color: accent
                }}
              >
                {skill}
              </span>
            ))}
            {profile.genres.map((genre) => (
              <span
                key={genre}
                className="rounded-[8px] border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.08em] text-white/46"
              >
                {genre}
              </span>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ProfileField label="Role" value={profile.role} />
            <ProfileField label="Rate" value={profile.rate} />
            <ProfileField label="Timezone" value={profile.timezone} />
            <ProfileField label="Payment" value={profile.payment} />
          </div>

          <div className="rounded-[14px] border border-white/[0.08] bg-white/[0.03] p-4">
            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/34">
              Proof-ready summary
            </div>
            <p className="mt-3 font-display text-[1.2rem] italic leading-7 tracking-[-0.02em] text-white/72">
              "{profile.shippedWork}"
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-white/[0.06] bg-white/[0.02] p-4">
          <div className="rounded-[10px] border border-white/[0.08] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-white/52">
            {audience === "studio" ? "review profile" : "signal visible"}
          </div>
          <div
            className="rounded-[10px] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-white"
            style={{
              background: accent,
              boxShadow: `0 10px 24px ${accent}33`
            }}
          >
            {audience === "studio" ? "invite to project" : "profile live"}
          </div>
        </div>
      </div>

      <div
        className="absolute -right-3 -top-3 inline-flex items-center gap-2 rounded-full px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white shadow-[0_10px_24px_rgba(0,0,0,0.35)]"
        style={{
          background: `linear-gradient(135deg, ${accent}, ${accent}b5)`
        }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-white/80 availability-pulse" />
        {audience === "studio" ? "new match" : "profile live"}
      </div>
    </div>
  );
}

function MiniStatCard({
  label,
  valueRef
}: {
  label: string;
  valueRef: MutableRefObject<HTMLSpanElement | null>;
}) {
  return (
    <div className="rounded-[12px] border border-white/[0.08] bg-white/[0.03] px-3 py-3 text-center">
      <div className="font-display text-[1.35rem] italic leading-none tracking-[-0.04em] text-white/92">
        <span ref={valueRef}>0</span>
      </div>
      <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.14em] text-white/34">
        {label}
      </div>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] border border-white/[0.08] bg-white/[0.03] p-4">
      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/34">
        {label}
      </div>
      <div className="mt-2 text-[14px] text-white/76">{value}</div>
    </div>
  );
}

function AnimatedMetricCard({
  label,
  value,
  sublabel,
  prefix = "",
  suffix = ""
}: {
  label: string;
  value: number;
  sublabel: string;
  prefix?: string;
  suffix?: string;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const valueRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = cardRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          animateNumber(valueRef.current, 0, value);
          observer.disconnect();
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [suffix, value]);

  return (
    <div
      ref={cardRef}
      className="rounded-[18px] border border-white/[0.08] bg-white/[0.03] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
    >
      <div className="font-display text-[1.8rem] italic leading-none tracking-[-0.04em] text-white/92">
        {prefix}
        <span ref={valueRef}>0</span>
        {!suffix ? null : <span>{suffix}</span>}
      </div>
      <div className="mt-2 font-body text-[12px] font-medium text-white/68">{label}</div>
      <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-white/32">
        {sublabel}
      </div>
    </div>
  );
}

function PainSection({
  accent,
  accentSoft
}: {
  accent: string;
  accentSoft: string;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const discordRef = useRef<HTMLDivElement | null>(null);
  const compilerRef = useRef<HTMLDivElement | null>(null);
  const [compiled, setCompiled] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          setCompiled(true);
          compileDiscordThread(discordRef.current, compilerRef.current);
          observer.disconnect();
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pain"
      className="border-b border-white/[0.05] bg-[var(--bg2)] py-[100px] md:py-[140px]"
    >
      <SectionHeading
        eyebrow="Discord chaos"
        title="6 hours in Discord. One maybe."
        copy="These are example messages, not real user activity. The product point is the workflow: Discord hides rate, availability, proof, and response signal inside thread noise."
        eyebrowClassName="text-[var(--magenta-warn)]"
      />

      <div className="mx-auto mt-12 grid w-full max-w-[1200px] gap-6 px-5 md:px-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
        <article
          ref={discordRef}
          className="discord-thread-card relative overflow-hidden rounded-[24px] border border-[var(--magenta-warn)]/25 bg-[linear-gradient(180deg,rgba(241,91,181,0.08),transparent_30%),linear-gradient(160deg,rgba(18,10,15,0.98),rgba(8,9,13,0.985)_70%)] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
          data-reveal
        >
          <div className="pointer-events-none absolute right-6 top-5 opacity-[0.08]">
            <DiscordWatermark />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">
              discord.thread -- chaos_log
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/62">
              Example messages
            </span>
          </div>

          <div className="mt-5 grid gap-3">
            {DISCORD_CHAOS.map((entry, index) => (
              <div
                key={`${entry.name}-${index}`}
                className={`discord-message rounded-[18px] border p-4 transition duration-500 ${
                  entry.deleted
                    ? "border-white/6 bg-white/[0.02] text-white/40"
                    : entry.spam
                      ? "border-[var(--magenta-warn)]/18 bg-[var(--magenta-warn)]/8"
                      : entry.expired
                        ? "border-[var(--orange-hot)]/18 bg-[var(--orange-hot)]/6"
                        : "border-white/8 bg-white/[0.03]"
                }`}
                style={{
                  transitionDelay: `${index * 70}ms`
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: entry.color }}
                    />
                    <strong className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/76">
                      @{entry.name}
                    </strong>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
                    {entry.timestamp}
                  </span>
                </div>

                {entry.ghost ? (
                  <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white/30">
                    {entry.ghostLabel}
                  </div>
                ) : (
                  <p className="mt-3 text-[15px] leading-7 text-white/68">
                    {entry.body}
                  </p>
                )}

                {entry.badges?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/56"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 rounded-[16px] border border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
              typing... but nothing useful lands
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-white/28 animate-[dotPulse_1.2s_ease-in-out_infinite]" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/28 animate-[dotPulse_1.2s_ease-in-out_.2s_infinite]" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/28 animate-[dotPulse_1.2s_ease-in-out_.4s_infinite]" />
            </span>
          </div>
        </article>

        <article
          ref={compilerRef}
          className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,21,0.98),rgba(6,8,11,0.98))] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.42)]"
          data-reveal
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">
              weld.compiler -- structured_signal
            </span>
            <span className="rounded-full border border-[var(--acid-green)]/20 bg-[var(--acid-green)]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--acid-green-light)]">
              {compiled ? "Compiled" : "Waiting"}
            </span>
          </div>

          <div className="mt-5 rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
              Compiler result
            </div>
            <strong className="mt-2 block font-display text-[2rem] italic tracking-[-0.04em] text-white/92">
              Discord chaos {"->"} structured talent signal.
            </strong>
          </div>

          <div className="mt-5 grid gap-3">
            {COMPILER_OUTPUT.map((line) => (
              <div
                key={line.text}
                data-compile-field
                className="compile-field rounded-[18px] border border-white/8 bg-white/[0.03] p-4"
              >
                <div
                  className={`font-mono text-[11px] uppercase tracking-[0.16em] ${
                    line.tone === "success"
                      ? "text-[var(--acid-green-light)]"
                      : line.tone === "active"
                        ? "text-[var(--orange-hot)]"
                        : "text-white/68"
                  }`}
                  style={line.bold ? { fontWeight: 700 } : undefined}
                >
                  {line.text}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[18px] border border-white/8 bg-white/[0.03] p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/38">
                Speed delta
              </div>
              <div className="mt-2 font-display text-[2.1rem] italic tracking-[-0.04em] text-white/92">
                6x faster
              </div>
              <p className="mt-2 text-sm leading-7 text-white/50">
                Product preview only. The point is signal density, not invented marketplace stats.
              </p>
            </div>
            <div className="rounded-[18px] border border-white/8 bg-white/[0.03] p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/38">
                Scan state
              </div>
              <div className="mt-2 text-[15px] leading-7 text-white/70">
                Role, rate, availability, shipped work, and proof become visible before the first DM.
              </div>
            </div>
          </div>
        </article>
      </div>

      <div className="mx-auto mt-8 grid w-full max-w-[1200px] gap-3 px-5 md:px-8 md:grid-cols-3">
        {[
          "Vague rates become explicit budget signal.",
          "Expired links become proof fields with verification.",
          "Ghost replies become response windows and availability."
        ].map((pain, index) => (
          <div
            key={pain}
            data-reveal
            data-delay={`${(index + 1) * 100}`}
            className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4 text-[14px] leading-7 text-white/60"
          >
            {pain}
          </div>
        ))}
      </div>
    </section>
  );
}

function RoleExplorerSection({
  activeRole,
  activeRolePreview,
  activeRoleDetails,
  accent,
  accentSoft,
  onRoleChange
}: {
  activeRole: RoleKey;
  activeRolePreview: (typeof ROLE_PREVIEWS)[RoleKey];
  activeRoleDetails: (typeof ROLE_EXPLORER_DATA)[RoleKey];
  accent: string;
  accentSoft: string;
  onRoleChange: (role: RoleKey) => void;
}) {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const nameRef = useRef<HTMLSpanElement | null>(null);
  const rateRef = useRef<HTMLSpanElement | null>(null);
  const visitsRef = useRef<HTMLSpanElement | null>(null);
  const skillsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cleanups = [
      scrambleText(titleRef.current, activeRolePreview.title),
      scrambleText(nameRef.current, activeRoleDetails.name),
      scrambleText(rateRef.current, activeRoleDetails.rate),
      scrambleText(visitsRef.current, activeRoleDetails.visits),
      highlightSkillChips(skillsRef.current, { staggerMs: 80 })
    ];

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [activeRole, activeRoleDetails, activeRolePreview.title]);

  return (
    <section
      id="role-explorer"
      className="border-b border-white/[0.05] bg-[var(--bg)] py-[96px] md:py-[120px]"
    >
      <SectionHeading
        eyebrow="Role explorer"
        title="Roblox-native loadouts, not generic talent cards."
        copy="Click a role chip and the preview rewires in place. Each profile remains a product preview, not fake public traction."
        eyebrowClassName="text-[var(--accent-soft)]"
      />

      <div className="mx-auto mt-10 w-full max-w-[1200px] px-5 md:px-8">
        <div
          className="role-chip-dock rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,34,56,0.82),rgba(9,11,18,0.94))] p-4 shadow-[0_26px_80px_rgba(0,0,0,0.36)]"
          data-reveal
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/42">
              scout.loadout -- active role filters
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/36">
                studio view
              </span>
              {activeRolePreview.filters.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/10 bg-[rgba(255,255,255,0.04)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/62"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-[22px] border border-white/8 bg-[rgba(8,13,20,0.82)] p-3">
            <div className="flex flex-wrap gap-2">
              {ROLE_CHIPS.map(([roleKey, label]) => (
                <button
                  key={roleKey}
                  type="button"
                  aria-pressed={activeRole === roleKey}
                  onClick={() => onRoleChange(roleKey)}
                  className={`role-chip-button inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition ${
                    activeRole === roleKey
                      ? "border-white/16 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.08))] text-[#ffe9df] shadow-[0_10px_24px_rgba(0,0,0,0.24)]"
                      : "border-white/10 bg-[rgba(255,255,255,0.02)] text-white/58 hover:bg-white/[0.06] hover:text-white/76"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition ${
                      activeRole === roleKey ? "bg-[var(--accent-soft)] shadow-[0_0_18px_var(--accent)]" : "bg-white/20"
                    }`}
                  />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.06fr)_minmax(320px,0.94fr)]">
          <article
            className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,21,0.98),rgba(8,9,13,0.98))] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.42)]"
            data-reveal
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/62">
                Product preview - example profiles
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/42">
                {activeRolePreview.label}
              </span>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div>
                <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/34">
                    live.role_loadout
                  </div>
                  <h3
                    ref={titleRef}
                    className="mt-3 font-display text-[2.15rem] italic tracking-[-0.04em] text-white/92"
                  >
                    {activeRolePreview.title}
                  </h3>
                  <p className="mt-3 max-w-[44ch] text-[15px] leading-8 text-white/68">
                    {activeRolePreview.summary}
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {activeRolePreview.fields.map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-[16px] border border-white/8 bg-[var(--terminal-mid)] p-4"
                      >
                        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/34">
                          {`${label.replace(/\s+/g, "_").toUpperCase()}:`}
                        </div>
                        <div className="mt-2 text-[15px] text-white/74">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <aside className="space-y-4">
                <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/34">
                    active.preview
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span ref={nameRef} className="font-display text-[1.8rem] italic text-white/92">
                      {activeRoleDetails.name}
                    </span>
                    <span
                      className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]"
                      style={{
                        borderColor: `${accent}33`,
                        background: `${accent}12`,
                        color: accentSoft
                      }}
                    >
                      {activeRoleDetails.availability}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <LoadoutStat label="RATE_MODEL" valueRef={rateRef} />
                    <LoadoutStat label="VISITS" valueRef={visitsRef} />
                    <LoadoutStaticStat label="SHIPPED_WORK" value={`${activeRoleDetails.games} games`} />
                    <LoadoutStaticStat label="VERIFIED" value={activeRoleDetails.verified} />
                  </div>
                </div>

                <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/34">
                    role.skills
                  </div>
                  <div ref={skillsRef} className="mt-4 flex flex-wrap gap-2">
                    {activeRoleDetails.skills.map((skill) => (
                      <span
                        key={skill}
                        data-skill-chip
                        className="terminal-chip rounded-[8px] border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em]"
                        style={{
                          borderColor: `${accent}44`,
                          background: `${accent}10`,
                          color: accentSoft
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-white/50">
                    {activeRoleDetails.shippedWork}
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/34">
                    scout.filters
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {activeRolePreview.filters.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/58"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-white/48">
                    {activeRolePreview.foot}
                  </p>
                </div>
              </aside>
            </div>
          </article>

          <aside
            className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,11,18,0.98),rgba(6,8,12,0.98))] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
            data-reveal
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent-soft)]">
              scout.preview -- active_filters
            </div>
            <div className="mt-5 space-y-3">
              {[
                ["SHIPPED_WORK", activeRoleDetails.shippedWork],
                ["RATE_MODEL", activeRoleDetails.rate],
                ["AVAILABILITY", activeRoleDetails.availability],
                ["VERIFIED", activeRoleDetails.verified]
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[18px] border border-white/8 bg-white/[0.03] p-4"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/34">
                    {label}
                  </div>
                  <div className="mt-2 text-[15px] text-white/74">{value}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function LoadoutStat({
  label,
  valueRef
}: {
  label: string;
  valueRef: MutableRefObject<HTMLSpanElement | null>;
}) {
  return (
    <div className="rounded-[16px] border border-white/8 bg-[var(--terminal-mid)] p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/34">
        {label}
      </div>
      <div className="mt-2 text-[15px] text-white/74">
        <span ref={valueRef} />
      </div>
    </div>
  );
}

function LoadoutStaticStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-white/8 bg-[var(--terminal-mid)] p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/34">
        {label}
      </div>
      <div className="mt-2 text-[15px] text-white/74">{value}</div>
    </div>
  );
}

function HowSection({ accentSoft }: { accentSoft: string }) {
  return (
    <section
      id="how-it-works"
      className="border-b border-white/[0.05] bg-[var(--bg2)] py-[96px] md:py-[100px]"
    >
      <SectionHeading
        eyebrow="How it works"
        title="Terminal commands, then visible signal."
        copy="Each command resolves into a status block. The terminal is there to explain the product, not just decorate it."
        eyebrowClassName="text-[var(--accent-soft)]"
      />

      <div className="mx-auto mt-10 w-full max-w-[1200px] px-5 md:px-8">
        <div
          className="command-deck rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,35,58,0.86),rgba(8,11,18,0.98))] p-5 shadow-[0_34px_100px_rgba(0,0,0,0.42)] md:p-6"
          data-reveal
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
              <span className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--orange-hot)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFBE74]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--acid-green)]" />
              </span>
              <span>weld.commands -- live_flow</span>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/58">
              3 command groups
            </span>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            {HOW_COMMANDS.map((command, index) => (
              <CommandSequenceCard
                key={command.command}
                command={command}
                accentSoft={accentSoft}
                delay={index * 120}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CommandSequenceCard({
  command,
  accentSoft,
  delay,
  index
}: {
  command: CommandSequence;
  accentSoft: string;
  delay: number;
  index: number;
}) {
  const cardRef = useRef<HTMLElement | null>(null);
  const commandRef = useRef<HTMLDivElement | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = cardRef.current;

    if (!node || !commandRef.current || !outputRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const commandCleanup = typeLine(commandRef.current, command.command, {
            speed: 18,
            delay
          });

          const timeoutId = window.setTimeout(() => {
            runBootSequence(outputRef.current, command.lines, {
              lineDelay: 120,
              onComplete: () => {
                flashNode(cardRef.current, "flash-node", 360);
              }
            });
          }, command.command.length * 18 + delay + 140);

          observer.disconnect();

          return () => {
            commandCleanup();
            window.clearTimeout(timeoutId);
          };
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [command.command, command.lines, delay]);

  return (
    <article
      ref={cardRef}
      className="command-card rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,31,51,0.44),rgba(11,16,25,0.98))] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/34">
          {`command.00${index + 1}`}
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/52">
          terminal lane
        </span>
      </div>
      <div className="mt-4 rounded-[18px] border border-white/8 bg-[rgba(10,17,26,0.86)] p-4">
        <div
          ref={commandRef}
          className="min-h-[18px] font-mono text-[11px] uppercase tracking-[0.14em]"
          style={{ color: accentSoft }}
        >
          {prefersReducedMotion() ? command.command : ""}
        </div>
      </div>
      <div className="mt-4 rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/34">
          status blocks
        </div>
        <div ref={outputRef} className="mt-4 min-h-[154px] space-y-2" />
      </div>
      <p className="mt-4 text-sm leading-7 text-white/48">{command.summary}</p>
    </article>
  );
}

function BetaSection({
  mode,
  previewReferralCount,
  onShare,
  shareStatus
}: {
  mode: Audience;
  previewReferralCount: number;
  onShare: (channel: "discord" | "x" | "linkedin" | "copy") => void;
  shareStatus: string;
}) {
  const rewardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = rewardRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          animateRewardProgress(previewReferralCount, {
            staggerMs: 180,
            containerEl: rewardRef.current
          });
          observer.disconnect();
        });
      },
      { threshold: 0.22 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [previewReferralCount]);

  return (
    <section
      id="invite-mechanics"
      className="border-b border-white/[0.05] bg-[var(--bg)] py-[96px] md:py-[100px]"
    >
      <SectionHeading
        eyebrow="Beta / referral"
        title="Early access. Real status."
        copy="The waitlist works like a personal unlock loop. What you see here is a preview of your own progress state after signup, not a fake public leaderboard."
        eyebrowClassName="text-[var(--acid-green-light)]"
      />

      <div className="mx-auto mt-10 grid w-full max-w-[1200px] gap-6 px-5 md:px-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)]">
        <article
          className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,21,0.98),rgba(8,9,13,0.98))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
          data-reveal
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--acid-green-light)]">
            // limited beta
          </span>
          <h2 className="mt-5 font-display text-[2.8rem] italic leading-[0.96] tracking-[-0.05em] text-white/92 md:text-[4rem]">
            Founder access for the first 500 developers.
          </h2>
          <p className="mt-5 max-w-[42ch] text-[15px] leading-8 text-white/68">
            Access rolls out in waves. We do not show fake live counters, fake recent signups, or a made-up public queue rank. What unlocks after signup is your own status lane.
          </p>

          <div className="mt-8 rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/38">
              <span>Founder beta cap</span>
              <span>500 developers</span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
              <div className="h-full w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02),rgba(74,222,128,0.16),rgba(255,255,255,0.02))]" />
            </div>
            <p className="mt-4 text-sm leading-7 text-white/46">
              Cap reference only. The public landing stays honest; your personal invite state activates after signup.
            </p>
          </div>

          <div className="mt-8 rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/38">
              preview.share_link
            </div>
            <div className="mt-3 rounded-[14px] border border-white/10 bg-[var(--terminal-mid)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-white/64">
              {`${WAITLIST_URL}/?ref=preview`}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(["discord", "x", "linkedin", "copy"] as const).map((channel) => (
                <button
                  key={channel}
                  type="button"
                  onClick={() => onShare(channel)}
                  className="magnetic-button rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/72 transition hover:bg-white/[0.08]"
                  data-magnetic="true"
                >
                  {channel}
                </button>
              ))}
            </div>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-white/46" aria-live="polite">
              {shareStatus || `Preview share copy is ready for ${mode === "studio" ? "hiring teams" : "creators"}.`}
            </p>
          </div>
        </article>

        <article
          ref={rewardRef}
          className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,21,0.98),rgba(8,9,13,0.98))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
          data-reveal
        >
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/42">
              referral.xp_track
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/58">
              Preview state
            </span>
          </div>

          <div className="mt-5 flex items-end justify-between gap-4 rounded-[22px] border border-white/10 bg-white/[0.03] p-5">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/38">
                personal.progress
              </div>
              <div className="mt-2 font-display text-[3.4rem] italic leading-none tracking-[-0.05em] text-white/92">
                {previewReferralCount}/5
              </div>
            </div>
            <div className="max-w-[18ch] text-sm leading-7 text-white/50">
              Your next unlock pulses instead of faking public queue vanity.
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {REWARD_CARDS.map((reward) => (
              <div
                key={reward.count}
                data-reward-card
                data-threshold={reward.count}
                className="reward-card rounded-[20px] border border-white/8 bg-white/[0.03] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-[12px] border border-white/10 bg-[var(--terminal-mid)] font-mono text-[12px] uppercase tracking-[0.12em] text-white/72">
                    {reward.badge}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/38">
                    {`${reward.count} referral${reward.count === 1 ? "" : "s"}`}
                  </span>
                </div>
                <div className="mt-4 font-display text-[1.5rem] italic tracking-[-0.04em] text-white/92">
                  {reward.label}
                </div>
                <p className="mt-3 text-[14px] leading-7 text-white/56">
                  {reward.description}
                </p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function StudioBridgeSection({
  mode,
  accentButtonClass,
  onModeChange
}: {
  mode: Audience;
  accentButtonClass: string;
  onModeChange: (mode: Audience) => void;
}) {
  return (
    <section
      id="studio-bridge"
      className="border-b border-white/[0.05] bg-[linear-gradient(180deg,rgba(8,10,11,1),rgba(7,11,18,1))] py-16"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
        <div
          className="rounded-[28px] border border-[var(--roblox-blue)]/18 bg-[linear-gradient(135deg,rgba(8,14,22,0.98),rgba(7,10,13,0.98)_42%,rgba(12,20,30,0.98))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.38)]"
          data-reveal
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--roblox-blue-light)]">
                // studio scout mode
              </span>
              <h2 className="mt-4 font-display text-[2.4rem] italic leading-[0.96] tracking-[-0.05em] text-white/92 md:text-[3.1rem]">
                Filter developers by role, rate, availability, and proof.
              </h2>
              <p className="mt-4 max-w-[40ch] text-[15px] leading-8 text-white/68">
                No job ads. No Discord digging. The studio lane stays compact here, but the scout signal is visible.
              </p>
              <button
                type="button"
                onClick={() => onModeChange("studio")}
                className={`magnetic-button mt-6 inline-flex min-h-[50px] items-center rounded-full px-5 font-mono text-[10px] uppercase tracking-[0.16em] ${accentButtonClass} command-button`}
                data-magnetic="true"
              >
                {mode === "studio" ? "GET HIRING ACCESS ->" : "SWITCH TO STUDIO MODE ->"}
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {STUDIO_FILTER_STATS.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[18px] border border-[var(--roblox-blue)]/14 bg-[rgba(34,155,210,0.08)] p-4"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--roblox-blue-light)]">
                    {label}
                  </div>
                  <div className="mt-2 text-[14px] leading-7 text-white/74">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HonestySection() {
  return (
    <section
      id="founder-note"
      className="border-b border-white/[0.05] bg-[var(--bg)] py-[88px] md:py-[96px]"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
        <article
          className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(14,16,18,0.98),rgba(9,11,13,0.98))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.46)]"
          data-reveal
        >
          <span className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white/62">
            no fake traction
          </span>
          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <div>
              <h2 className="max-w-[11ch] font-display text-[2.6rem] italic leading-[0.96] tracking-[-0.05em] text-white/92 md:text-[3.4rem]">
                What exists now, what beta includes, what comes later.
              </h2>
              <p className="mt-5 text-[15px] leading-8 text-white/72">
                <strong>Weld is honest by design.</strong> The beta is about trust-verified profile structure, filtered discovery, and an invite loop that feels earned. No fake testimonials. No fake logos. No invented marketplace volume.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {FOUNDING_FACTS.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-[22px] border border-white/8 bg-white/[0.03] p-5"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                    {fact.label}
                  </div>
                  <p className="mt-3 text-[15px] leading-7 text-white/70">{fact.body}</p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function FAQSection({
  activeFaq,
  onToggle
}: {
  activeFaq: number;
  onToggle: (index: number) => void;
}) {
  return (
    <section id="faq" className="bg-[var(--red)] py-[96px] md:py-[100px]">
      <div className="mx-auto w-full max-w-[860px] px-5 md:px-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#fff5f0]/56">
          // faq
        </span>
        <h2 className="mt-5 font-display text-[2.8rem] italic leading-[0.95] tracking-[-0.05em] text-[#fff5f0] md:text-[4rem]">
          Plain answers.
        </h2>

        <div className="mt-10 divide-y divide-[#fff5f0]/14">
          {FAQ_ITEMS.map((item, index) => (
            <div key={item.question} className="py-1">
              <button
                type="button"
                aria-expanded={activeFaq === index}
                onClick={() => onToggle(index)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#fff5f0]/42">
                    {`// faq.00${index + 1}`}
                  </div>
                  <div className="mt-3 text-[15px] font-semibold leading-7 text-[#fff5f0] md:text-[16px]">
                    {item.question}
                  </div>
                </div>
                <span
                  className={`shrink-0 font-mono text-[22px] text-[#fff5f0]/55 transition ${
                    activeFaq === index ? "rotate-45" : "rotate-0"
                  }`}
                >
                  +
                </span>
              </button>

              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                  activeFaq === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <TypedAnswer active={activeFaq === index} answer={item.answer} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TypedAnswer({
  active,
  answer
}: {
  active: boolean;
  answer: string;
}) {
  const typedRef = useRef<HTMLSpanElement | null>(null);
  const [showRest, setShowRest] = useState(prefersReducedMotion());
  const firstSentenceMatch = answer.match(/^[^.!?]+[.!?]/);
  const firstSentence = firstSentenceMatch?.[0] ?? answer;
  const remainder = answer.slice(firstSentence.length).trim();

  useEffect(() => {
    if (!active) {
      setShowRest(prefersReducedMotion());
      if (typedRef.current) {
        typedRef.current.textContent = "";
      }
      return;
    }

    if (prefersReducedMotion()) {
      if (typedRef.current) {
        typedRef.current.textContent = firstSentence;
      }
      setShowRest(true);
      return;
    }

    setShowRest(false);
    const cleanup = typeLine(typedRef.current, firstSentence, {
      speed: 18,
      onComplete: () => setShowRest(true)
    });

    return () => {
      cleanup();
    };
  }, [active, firstSentence]);

  return (
    <p className="pb-6 text-[15px] leading-8 text-[#fff5f0]/82">
      <span ref={typedRef}>{prefersReducedMotion() && active ? firstSentence : ""}</span>
      {showRest && remainder ? <span>{` ${remainder}`}</span> : null}
    </p>
  );
}

function FinalCTASection({
  mode,
  finalEmail,
  finalStatus,
  capturePhase,
  accentButtonClass,
  onEmailChange,
  onSubmit,
  containerRef
}: {
  mode: Audience;
  finalEmail: string;
  finalStatus: string;
  capturePhase: CapturePhase;
  accentButtonClass: string;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
  containerRef: MutableRefObject<HTMLDivElement | null>;
}) {
  return (
    <section
      id="final-cta"
      className="relative overflow-hidden bg-[var(--bg)] py-[80px] md:py-[88px]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="cta-radial absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,90,45,0.2),transparent_66%)] blur-[70px]" />
      </div>

      <div className="relative mx-auto w-full max-w-[920px] px-5 text-center md:px-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/32">
          free during beta - no spam - developer-first - always
        </span>
        <h2 className="mt-6 font-display text-[3rem] italic leading-[0.94] tracking-[-0.05em] text-white/92 md:text-[4.8rem]">
          Get hired. No noise.
        </h2>
        <p className="mx-auto mt-5 max-w-[44ch] text-[15px] leading-8 text-white/64">
          {mode === "studio"
            ? "Unlock hiring access, build your scout setup, and keep the invite active without messy thread ops."
            : "Join the beta, finish the short profile flow, and keep the invite active with referrals and profile completion."}
        </p>

        <div
          ref={containerRef}
          className="mx-auto mt-10 w-full max-w-[560px] rounded-[22px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.28)]"
          aria-live="polite"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex-1 rounded-[16px] border border-white/12 bg-[var(--terminal-mid)] px-4 py-4 text-left">
              <span className="sr-only">Email address</span>
              <input
                type="email"
                value={finalEmail}
                onChange={(event) => onEmailChange(event.target.value)}
                placeholder={getInvitePrompt(mode)}
                className="w-full bg-transparent font-mono text-[11px] uppercase tracking-[0.1em] text-white outline-none placeholder:text-white/24"
              />
            </label>
            <button
              type="button"
              onClick={onSubmit}
              className={`magnetic-button inline-flex min-h-[56px] items-center justify-center rounded-[16px] px-6 font-mono text-[11px] uppercase tracking-[0.16em] ${accentButtonClass} command-button cta-pulse sm:min-w-[240px]`}
              data-magnetic="true"
            >
              {getCaptureLabel(mode, capturePhase)}
            </button>
          </div>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-white/42">
            {" >"} command prompt opens the same invite flow used by the rest of the funnel
          </p>
          {finalStatus ? (
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/72">
              {finalStatus}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.05] bg-[var(--terminal-dark)] py-8">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-5 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/24">
            © 2026 weld.
          </div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/34">
            roblox talent, with more signal
          </div>
        </div>
        <div className="flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-white/34">
          <a href={`${WAITLIST_URL}/privacy`} className="hover:text-white/72">
            Privacy
          </a>
          <a href={`${WAITLIST_URL}/terms`} className="hover:text-white/72">
            Terms
          </a>
          <a href={`${WAITLIST_URL}/contact`} className="hover:text-white/72">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

function SectionHeading({
  eyebrow,
  title,
  copy,
  eyebrowClassName = "text-[var(--accent-soft)]"
}: {
  eyebrow: string;
  title: string;
  copy: string;
  eyebrowClassName?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
      <span
        className={`font-mono text-[10px] uppercase tracking-[0.18em] ${eyebrowClassName}`}
        data-reveal
      >
        {`// ${eyebrow}`}
      </span>
      <h2
        className="mt-5 max-w-[13ch] font-display text-[2.8rem] italic leading-[0.94] tracking-[-0.05em] text-white/92 md:text-[4.2rem]"
        data-reveal
      >
        {title}
      </h2>
      <p
        className="mt-4 max-w-[66ch] text-[15px] leading-8 text-white/60"
        data-reveal
      >
        {copy}
      </p>
    </div>
  );
}

function DiscordWatermark() {
  return (
    <svg width="88" height="66" viewBox="0 0 88 66" fill="none" aria-hidden="true">
      <path
        d="M18 14C25 10 33 8 44 8C55 8 63 10 70 14C73 20 75 26 76 32C72 37 68 41 64 44L60 40C55 42 50 43 44 43C38 43 33 42 28 40L24 44C20 41 16 37 12 32C13 26 15 20 18 14Z"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle cx="33" cy="30" r="4" fill="currentColor" />
      <circle cx="55" cy="30" r="4" fill="currentColor" />
    </svg>
  );
}
