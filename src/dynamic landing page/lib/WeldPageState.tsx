"use client";

/**
 * WELD PAGE STATE — Stage 4 Dynamic Component Surface System
 * (Stage 5: added bootStatus, compactMode, verificationState, parseState)
 *
 * Shared state provider that enables cross-section reactivity.
 * Role selection cascades to: Properties panel, Output logs, LuaU editor,
 * Explorer rows, and CTA tiles — five surfaces simultaneously.
 *
 * Dynamic-first oath: this module must never be used to hold purely local
 * UI state. Only cross-section concerns live here.
 */

import { createContext, useContext, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Matches existing RoleKey from sample-data so no cascading renames needed */
export type WeldRole =
  | "scripter"
  | "builder"
  | "ui"
  | "vfx"
  | "animator"
  | "designer"
  | "systems";

export type ScriptTab = "auth" | "profile" | "discover";

export interface WeldOutputLog {
  id: string;
  text: string;
  tone: "neutral" | "active" | "success" | "muted" | "warning" | "error";
  bold?: boolean;
}

// ─── Stage 5 state types ──────────────────────────────────────────────────────

/** Controls FloatingStudioWindow breathing animation */
export type BootStatus = "booting" | "ready";

/** Drives RobloxProofBadge reveal sequence */
export type VerificationState = "unverified" | "checking" | "verified";

/** Controls Discord parser section state machine */
export type ParseState = "chaos" | "parsing" | "compiled";

// ─── Page state interface ─────────────────────────────────────────────────────

export interface WeldPageState {
  selectedRole: WeldRole;
  activeScriptTab: ScriptTab;
  /** Role-change and event logs appended after the boot sequence */
  dynamicLogs: WeldOutputLog[];
  /** Stage 5: FloatingStudioWindow breathing only fires when "ready" */
  bootStatus: BootStatus;
  /** Stage 5: < 640px — hides heavy decorative motifs, preserves interactivity */
  compactMode: boolean;
  /** Stage 5: RobloxProofBadge reveal state */
  verificationState: VerificationState;
  /** Stage 5: Discord parser section state machine */
  parseState: ParseState;
}

export type WeldAction =
  | { type: "ROLE_SELECTED"; role: WeldRole }
  | { type: "SCRIPT_TAB_CHANGED"; tab: ScriptTab }
  | { type: "LOG_APPENDED"; log: WeldOutputLog }
  // Stage 5 actions
  | { type: "BOOT_COMPLETE" }
  | { type: "COMPACT_MODE_CHANGED"; compact: boolean }
  | { type: "VERIFICATION_STARTED" }
  | { type: "VERIFICATION_COMPLETE" }
  | { type: "PARSE_STARTED" }
  | { type: "PARSE_COMPLETE" }
  | { type: "PARSE_RESET" };

// ─── Role Config ──────────────────────────────────────────────────────────────

export interface WeldRoleConfig {
  /** Display label, e.g. "Scripter" */
  label: string;
  /** Short uppercase label used in Explorer rows */
  shortLabel: string;
  /** Rate range, e.g. "45-60 R$/hr" */
  rate: string;
  /** Min rate only (for tiles), e.g. "45 R$/hr" */
  rateMin: string;
  availability: string;
  visits: string;
  games: number;
  verified: string;
  skills: string[];
  shippedWork: string;
  /** Example profile handle */
  name: string;
  responseTime: string;
  ctaDeveloper: string;
  ctaStudio: string;
}

export const weldRoles: Record<WeldRole, WeldRoleConfig> = {
  scripter: {
    label: "Scripter",
    shortLabel: "SCRIPTER",
    rate: "45-60 R$/hr",
    rateMin: "45 R$/hr",
    availability: "Open now",
    visits: "17.3M",
    games: 3,
    verified: "Roblox OAuth verified",
    skills: ["LUAU", "OOP", "DATASTORESERVICE"],
    shippedWork: "Combat loop, persistence, admin tooling",
    name: "xarion_dev",
    responseTime: "~2h",
    ctaDeveloper: "Claim your Scripter slot",
    ctaStudio: "Scout Scripters with proof",
  },
  builder: {
    label: "Builder",
    shortLabel: "BUILDER",
    rate: "25-40 R$/hr",
    rateMin: "25 R$/hr",
    availability: "Sprint lane open",
    visits: "31M",
    games: 7,
    verified: "World capture linked",
    skills: ["BUILDING", "TERRAIN", "STUDIO"],
    shippedWork: "Event maps, social hubs, traversal spaces",
    name: "BlockCraft",
    responseTime: "~4h",
    ctaDeveloper: "Claim your Builder slot",
    ctaStudio: "Scout Builders with proof",
  },
  ui: {
    label: "UI/UX",
    shortLabel: "UI / UX",
    rate: "35-50 R$/hr",
    rateMin: "35 R$/hr",
    availability: "Open this week",
    visits: "22M",
    games: 5,
    verified: "Roblox profile proof attached",
    skills: ["UI/UX", "ROACT", "TWEEN"],
    shippedWork: "HUD revamp, onboarding, shop conversion",
    name: "PixelUI",
    responseTime: "~3h",
    ctaDeveloper: "Claim your UI/UX slot",
    ctaStudio: "Scout UI/UX with proof",
  },
  vfx: {
    label: "VFX",
    shortLabel: "VFX",
    rate: "30-45 R$/hr",
    rateMin: "30 R$/hr",
    availability: "Three slots open",
    visits: "12M",
    games: 4,
    verified: "Reel linked and verified",
    skills: ["VFX", "PARTICLES", "BEAM"],
    shippedWork: "Hit confirms, spell bursts, trails",
    name: "FX_Master",
    responseTime: "~3h",
    ctaDeveloper: "Claim your VFX slot",
    ctaStudio: "Scout VFX artists with proof",
  },
  animator: {
    label: "Animator",
    shortLabel: "ANIMATOR",
    rate: "28-35 R$/hr",
    rateMin: "28 R$/hr",
    availability: "Monthly slots",
    visits: "36.2M",
    games: 4,
    verified: "Combat reel verified",
    skills: ["ANIMATION", "RIGGING", "MOON ANIMATOR"],
    shippedWork: "Movement packs, combat sets, emotes",
    name: "PixelDrift",
    responseTime: "~6h",
    ctaDeveloper: "Claim your Animator slot",
    ctaStudio: "Scout Animators with proof",
  },
  designer: {
    label: "Designer",
    shortLabel: "DESIGNER",
    rate: "40-60 R$/hr",
    rateMin: "40 R$/hr",
    availability: "Consult or sprint",
    visits: "8.5M",
    games: 2,
    verified: "Progression docs linked",
    skills: ["GAME DESIGN", "ECONOMY", "BALANCING"],
    shippedWork: "Progression tuning, economy rebalance",
    name: "DesignPro",
    responseTime: "~5h",
    ctaDeveloper: "Claim your Designer slot",
    ctaStudio: "Scout Designers with proof",
  },
  systems: {
    label: "Systems",
    shortLabel: "SYSTEMS",
    rate: "55-80 R$/hr",
    rateMin: "55 R$/hr",
    availability: "Booked, reviewable",
    visits: "65M",
    games: 6,
    verified: "Backend stack proof verified",
    skills: ["FULL-STACK", "DATASTORESERVICE", "ECONOMY"],
    shippedWork: "Matchmaking, telemetry, CI, automation",
    name: "luamancer",
    responseTime: "~8h",
    ctaDeveloper: "Claim your Systems slot",
    ctaStudio: "Scout Systems devs with proof",
  },
} as const;

// ─── Reducer ──────────────────────────────────────────────────────────────────

const INITIAL_STATE: WeldPageState = {
  selectedRole: "scripter",
  activeScriptTab: "auth",
  dynamicLogs: [],
  // Stage 5
  bootStatus: "booting",
  compactMode: false,
  verificationState: "unverified",
  parseState: "chaos",
};

export const INITIAL_WELD_PAGE_STATE: WeldPageState = INITIAL_STATE;

export function makeLogId(prefix: string = "log"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function appendLog(state: WeldPageState, log: WeldOutputLog): WeldPageState {
  return {
    ...state,
    dynamicLogs: [...state.dynamicLogs, log].slice(-12), // keep last 12
  };
}

export function weldReducer(state: WeldPageState, action: WeldAction): WeldPageState {
  switch (action.type) {
    case "ROLE_SELECTED":
      return appendLog(
        {
          ...state,
          selectedRole: action.role,
          // Automatically open profile tab so the role-reactive code is visible
          activeScriptTab: "profile",
          // Stage 5: reset verification on role change for proof badge re-reveal
          verificationState: "unverified",
        },
        {
          id: makeLogId(),
          text: `ROLE_CHANGED: ${weldRoles[action.role].label} — inspecting...`,
          tone: "active",
        }
      );

    case "SCRIPT_TAB_CHANGED":
      return appendLog(
        { ...state, activeScriptTab: action.tab },
        {
          id: makeLogId(),
          text: `Opened weld_${action.tab}.luau`,
          tone: "neutral",
        }
      );

    case "LOG_APPENDED":
      return appendLog(state, action.log);

    // ── Stage 5 actions ──────────────────────────────────────────────────────
    case "BOOT_COMPLETE":
      return { ...state, bootStatus: "ready" };

    case "COMPACT_MODE_CHANGED":
      return { ...state, compactMode: action.compact };

    case "VERIFICATION_STARTED":
      return { ...state, verificationState: "checking" };

    case "VERIFICATION_COMPLETE":
      return appendLog(
        { ...state, verificationState: "verified" },
        {
          id: makeLogId(),
          text: `PROOF_VERIFIED — data confirmed via Roblox OAuth`,
          tone: "success",
          bold: true,
        }
      );

    case "PARSE_STARTED":
      return { ...state, parseState: "parsing" };

    case "PARSE_COMPLETE":
      return { ...state, parseState: "compiled" };

    case "PARSE_RESET":
      return { ...state, parseState: "chaos" };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const WeldStateContext = createContext<WeldPageState | null>(null);
const WeldDispatchContext = createContext<Dispatch<WeldAction> | null>(null);

export function WeldPageProvider({
  initialRole = "scripter",
  children,
}: {
  initialRole?: WeldRole;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(weldReducer, {
    ...INITIAL_STATE,
    selectedRole: initialRole,
  });

  return (
    <WeldStateContext.Provider value={state}>
      <WeldDispatchContext.Provider value={dispatch}>
        {children}
      </WeldDispatchContext.Provider>
    </WeldStateContext.Provider>
  );
}

export function useWeldState(): WeldPageState {
  const ctx = useContext(WeldStateContext);
  if (!ctx) throw new Error("useWeldState must be used inside WeldPageProvider");
  return ctx;
}

export function useWeldDispatch(): Dispatch<WeldAction> {
  const ctx = useContext(WeldDispatchContext);
  if (!ctx) throw new Error("useWeldDispatch must be used inside WeldPageProvider");
  return ctx;
}
