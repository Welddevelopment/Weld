"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { getSessionId, shareInvite, trackEvent } from "@/dynamic landing page/lib/browser";
import { PROFILE_STEP_ORDER } from "@/dynamic landing page/lib/constants";
import {
  DISCIPLINE_OPTIONS,
  REFERRAL_REWARDS,
  SOURCE_LINES,
  TYPE_COPY
} from "@/dynamic landing page/lib/sample-data";
import type { SourceVariant } from "@/dynamic landing page/lib/source-variant";
import type {
  Audience,
  DraftStepKey,
  InviteProgressSnapshot,
  ShareChannel
} from "@/dynamic landing page/lib/types";

type InviteFormState = {
  displayName: string;
  primaryRole: string;
  proofLink: string;
  availability: string;
  rateStyle: string;
  note: string;
  studioName: string;
  rolesHiring: string[];
  teamSize: string;
  budgetStyle: string;
  shippingNote: string;
};

type SaveResponse = {
  ok: boolean;
  draft: InviteProgressSnapshot["draft"];
  referralCount: number;
  rewardTier: InviteProgressSnapshot["rewardTier"];
  nextReward: InviteProgressSnapshot["nextReward"];
  waveLabel: string;
  message?: string;
};

interface InviteExperienceProps {
  initialSnapshot: InviteProgressSnapshot;
  sourceVariant: SourceVariant;
}

const BOOT_LINES = [
  "generating invite key...",
  "checking lane...",
  "loading referral state...",
  "arming profile autosave..."
];

const SHARE_PREVIEW_COPY = {
  developer: {
    discord: {
      kicker: "Discord-ready",
      title: "No more thread diving",
      body:
        "I just activated my invite state for Weld. If you are building Roblox and want proof-first discovery instead of Discord noise, join here:"
    },
    x: {
      kicker: "X-ready",
      title: "Proof-first, fast",
      body:
        "Short, punchy, and creator-native. This version keeps the ask light and the link front and center:"
    },
    linkedin: {
      kicker: "LinkedIn-ready",
      title: "Professional proof language",
      body:
        "Use the cleaner proof-first framing when the audience skews more professional or studio-adjacent:"
    },
    copy: {
      kicker: "Link-ready",
      title: "Invite link copied",
      body: "The raw invite link is available if you want to write your own message from scratch:"
    }
  },
  studio: {
    discord: {
      kicker: "Discord-ready",
      title: "Less thread chaos",
      body:
        "Share the studio angle directly: cleaner Roblox talent filtering, no scavenger hunt ops:"
    },
    x: {
      kicker: "X-ready",
      title: "Studio access unlocked",
      body: "Keep the copy short and hiring-focused for quick social sharing:"
    },
    linkedin: {
      kicker: "LinkedIn-ready",
      title: "Proof-first scout mode",
      body:
        "This version frames Weld as a structured hiring workflow for studio and producer audiences:"
    },
    copy: {
      kicker: "Link-ready",
      title: "Studio invite link",
      body: "Use the direct studio link if you want to write your own outreach or team note:"
    }
  }
} as const;

const STEP_TITLES: Record<DraftStepKey, string> = {
  identity: "Identity",
  proof: "Proof",
  fit: "Fit"
};

export default function InviteExperience({
  initialSnapshot,
  sourceVariant
}: InviteExperienceProps) {
  const audience = initialSnapshot.lead.audience;
  const audienceCopy = TYPE_COPY[audience];
  const sourceLine = SOURCE_LINES[sourceVariant][audience];
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [currentStep, setCurrentStep] = useState<DraftStepKey>(
    initialSnapshot.draft.currentStep
  );
  const [form, setForm] = useState<InviteFormState>(() => buildFormState(initialSnapshot));
  const [shareChannel, setShareChannel] = useState<ShareChannel>("discord");
  const [bootIndex, setBootIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState("");
  const [saveError, setSaveError] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [shareError, setShareError] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState("");
  const [returnNote, setReturnNote] = useState(
    "Save your link and come back after sharing to check progress."
  );
  const progressRef = useRef<HTMLElement | null>(null);
  const shareRef = useRef<HTMLElement | null>(null);
  const profileRef = useRef<HTMLElement | null>(null);
  const returnRef = useRef<HTMLElement | null>(null);
  const autosaveTimer = useRef<number | null>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mediaQuery.matches;

    if (mediaQuery.matches) {
      setBootIndex(BOOT_LINES.length);
      return;
    }

    const timeout = window.setInterval(() => {
      setBootIndex((current) => {
        if (current >= BOOT_LINES.length) {
          window.clearInterval(timeout);
          return current;
        }
        return current + 1;
      });
    }, 180);

    return () => window.clearInterval(timeout);
  }, []);

  useEffect(() => {
    void trackEvent({
      eventName: "invite_view",
      page: "invite",
      audience,
      inviteCode: snapshot.lead.inviteCode,
      payload: {
        sourceVariant
      }
    });
  }, [audience, snapshot.lead.inviteCode, sourceVariant]);

  useEffect(() => {
    return () => {
      if (autosaveTimer.current) {
        window.clearTimeout(autosaveTimer.current);
      }
    };
  }, []);

  const maxReferrals = REFERRAL_REWARDS[REFERRAL_REWARDS.length - 1]?.count ?? 5;
  const referralProgress = Math.max(0, Math.min(snapshot.referralCount, maxReferrals));
  const queueLabel = snapshot.rewardTier.label;
  const waveHint = snapshot.waveLabel;
  const nextUnlock =
    snapshot.nextReward === null
      ? "Top tier unlocked"
      : `${snapshot.nextReward.threshold} referrals`;
  const shareTemplate =
    shareChannel === "copy"
      ? snapshot.lead.shareUrl
      : snapshot.sharePresets[shareChannel];
  const sharePreview = SHARE_PREVIEW_COPY[audience][shareChannel];
  const completionPercent = snapshot.draft.completionPercent;
  const boostCaption =
    completionPercent > 0
      ? `Profile boost is at ${completionPercent}%. Keep stacking proof and fit signal.`
      : "Each saved field boosts matching signal and queue clarity.";
  const nextAction = useMemo(() => {
    if (completionPercent >= 100 && snapshot.referralCount >= 1) {
      return {
        title: "Check wave status",
        copy:
          "Your core setup is in. Use your return state to watch queue and next unlock details.",
        label: "Check wave status",
        target: "progress" as const
      };
    }

    if (completionPercent >= 60 && snapshot.referralCount < 1) {
      return {
        title: "Share your invite",
        copy:
          "One referral is the next clean unlock. Your channel-specific copy is already prepared.",
        label: "Share invite",
        target: "share" as const
      };
    }

    return {
      title: "Finish your profile loadout",
      copy: "Each finished field improves matching signal and queue clarity.",
      label: "Finish profile",
      target: "profile" as const
    };
  }, [completionPercent, snapshot.referralCount]);

  const activeProfileRows = useMemo(() => {
    if (audience === "studio") {
      return [
        ["Team", form.teamSize || "Team size not set"],
        ["Budget", form.budgetStyle || "Budget style not set"],
        ["Timeline", form.shippingNote || "Timeline not set"]
      ];
    }

    return [
      ["Proof", form.proofLink || "Proof link not set"],
      ["Availability", form.availability || "Availability not set"],
      ["Rate", form.rateStyle || "Rate style not set"]
    ];
  }, [audience, form.availability, form.budgetStyle, form.proofLink, form.rateStyle, form.shippingNote, form.teamSize]);

  const activeChips = useMemo(() => {
    if (audience === "studio") {
      return form.rolesHiring;
    }

    return [form.primaryRole, form.availability, form.rateStyle].filter(Boolean);
  }, [audience, form.availability, form.primaryRole, form.rateStyle, form.rolesHiring]);

  const previewName =
    audience === "studio"
      ? form.studioName || "Pending studio identity"
      : form.displayName || "Pending creator identity";
  const previewRole =
    audience === "studio"
      ? form.rolesHiring.length > 0
        ? `Hiring: ${form.rolesHiring.join(", ")}`
        : "Select roles hiring"
      : form.primaryRole || "Choose a primary discipline";
  const ringCircumference = 2 * Math.PI * 70;
  const ringOffset =
    ringCircumference - ringCircumference * (referralProgress / maxReferrals);

  function scrollToSection(ref: React.RefObject<HTMLElement | null>) {
    ref.current?.scrollIntoView({
      behavior: prefersReducedMotion.current ? "auto" : "smooth",
      block: "start"
    });
  }

  function queueAutosave(step: DraftStepKey) {
    if (autosaveTimer.current) {
      window.clearTimeout(autosaveTimer.current);
    }

    setSaveStatus("Autosave armed");
    setSaveError(false);

    autosaveTimer.current = window.setTimeout(() => {
      void saveStep(step, { silent: true });
    }, 700);
  }

  function updateField<K extends keyof InviteFormState>(
    key: K,
    value: InviteFormState[K],
    step: DraftStepKey
  ) {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
    queueAutosave(step);
  }

  function toggleRoleChip(value: string) {
    if (audience === "studio") {
      const nextRoles = form.rolesHiring.includes(value)
        ? form.rolesHiring.filter((role) => role !== value)
        : [...form.rolesHiring, value];

      updateField("rolesHiring", nextRoles, "proof");
      return;
    }

    updateField("primaryRole", value, "identity");
  }

  async function saveStep(
    step: DraftStepKey,
    options: { silent?: boolean } = {}
  ) {
    if (autosaveTimer.current) {
      window.clearTimeout(autosaveTimer.current);
    }

    if (!options.silent) {
      setSaveStatus("Saving step...");
      setSaveError(false);
    }

    try {
      const response = await fetch("/api/profile-draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inviteCode: snapshot.lead.inviteCode,
          step,
          payload: getStepPayload(audience, form, step),
          sessionId: getSessionId()
        })
      });

      const result = (await response.json().catch(() => null)) as SaveResponse | null;

      if (!response.ok || !result?.ok) {
        throw new Error(result?.message || "Could not save profile right now.");
      }

      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });

      setLastSavedAt(timestamp);
      setSaveStatus(options.silent ? `Autosaved (${timestamp}).` : `Saved (${timestamp}).`);
      setSaveError(false);
      setSnapshot((current) => ({
        ...current,
        draft: result.draft,
        referralCount: result.referralCount,
        rewardTier: result.rewardTier,
        nextReward: result.nextReward,
        waveLabel: result.waveLabel
      }));
      return true;
    } catch (error) {
      setSaveStatus(
        error instanceof Error ? error.message : "Could not save profile right now."
      );
      setSaveError(true);
      return false;
    }
  }

  async function handleShare(channel: ShareChannel) {
    setShareChannel(channel);
    setShareStatus("");
    setShareError(false);

    try {
      const result = await shareInvite(snapshot.lead.inviteCode, channel);

      setSnapshot((current) => ({
        ...current,
        sharePresets: {
          ...current.sharePresets,
          [channel]: result.copy,
          copy: result.shareUrl
        }
      }));

      if (channel === "x") {
        const intent = new URL("https://twitter.com/intent/tweet");
        intent.searchParams.set("text", result.copy);
        window.open(intent.toString(), "_blank", "noopener,noreferrer");
        setShareStatus("Opened X share window.");
        setShareError(false);
        return;
      }

      const copied = await copyToClipboard(channel === "copy" ? result.shareUrl : result.copy);

      setShareStatus(
        copied
          ? channel === "copy"
            ? "Invite link copied."
            : `Prepared ${channel} copy copied.`
          : "Could not copy automatically. You can still copy manually from the field above."
      );
      setShareError(!copied);
    } catch (error) {
      setShareStatus(
        error instanceof Error ? error.message : "Could not prepare share copy."
      );
      setShareError(true);
    }
  }

  async function handleNextStep() {
    const saved = await saveStep(currentStep);

    if (!saved) {
      return;
    }

    const currentIndex = PROFILE_STEP_ORDER.indexOf(currentStep);
    const nextStep = PROFILE_STEP_ORDER[currentIndex + 1];

    if (!nextStep) {
      setReturnNote(
        "Profile pass saved. Come back to check wave status and keep sharing your invite link."
      );
      scrollToSection(returnRef);
      return;
    }

    setCurrentStep(nextStep);
  }

  async function handleSaveForLater() {
    const saved = await saveStep(currentStep);

    if (!saved) {
      return;
    }

    setReturnNote("Saved for later. Come back to check wave status and continue where you left off.");
    scrollToSection(returnRef);
  }

  function handlePrimaryReturnAction() {
    if (nextAction.target === "share") {
      scrollToSection(shareRef);
      return;
    }

    if (nextAction.target === "progress") {
      scrollToSection(progressRef);
      return;
    }

    scrollToSection(profileRef);
  }

  const accentPrimary =
    audience === "studio"
      ? "bg-[#229bd2] text-[#f3fbff] hover:bg-[#32b1ea] focus-visible:outline-[#32b1ea]"
      : "bg-[#ff5a2d] text-[#fff7f1] hover:bg-[#ff734d] focus-visible:outline-[#ff734d]";
  const accentPill =
    audience === "studio"
      ? "border-[#4cc9f0]/30 bg-[#4cc9f0]/12 text-[#b8efff]"
      : "border-[#ff8c67]/30 bg-[#ff8c67]/12 text-[#ffb59c]";
  const accentPreview =
    audience === "studio"
      ? "from-[#08111c] via-[#09101a] to-[#061018]"
      : "from-[#120d14] via-[#0c0f17] to-[#080911]";
  const accentShadow =
    audience === "studio"
      ? "shadow-[0_28px_90px_rgba(34,155,210,0.16)]"
      : "shadow-[0_28px_90px_rgba(255,90,45,0.16)]";

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f3f5ff]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(255,90,45,0.12),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(34,155,210,0.14),transparent_24%),linear-gradient(180deg,#06070b_0%,#080912_100%)]" />
      <div className="relative">
        <header className="sticky top-0 z-40 border-b border-white/6 bg-[#090b10]/88 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-5 py-4 md:px-7">
            <Link href={audience === "studio" ? "/studios" : "/"} className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
                <Image
                  src="/Assets/weld-logo-official.svg"
                  alt="Weld logo"
                  width={28}
                  height={28}
                />
              </span>
              <span className="flex flex-col">
                <span className="font-display text-[1.6rem] italic leading-none tracking-[-0.04em]">
                  Weld
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/42">
                  Invite State
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <span
                className={`hidden rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] md:inline-flex ${accentPill}`}
              >
                {audienceCopy.audiencePill}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/65">
                {snapshot.lead.inviteCode}
              </span>
            </div>
          </div>
        </header>

        <main className="pb-12 pt-10 md:pb-16 md:pt-14">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-5 md:px-7">
            <section
              id="win-state"
              className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,19,28,0.96),rgba(9,12,18,0.98))] p-6 shadow-[0_32px_90px_rgba(0,0,0,0.42)]"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/44">
                State 1 - Win
              </span>
              <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,0.98fr)_minmax(300px,0.82fr)]">
                <div>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${accentPill}`}
                  >
                    {bootIndex >= BOOT_LINES.length ? "Invite active" : "Generating"}
                  </span>
                  <h1 className="mt-5 font-display text-[2.8rem] italic leading-[0.94] tracking-[-0.05em] md:text-[3.8rem]">
                    Invite active.
                  </h1>
                  <p className="mt-4 max-w-[46ch] text-[15px] leading-8 text-white/70">
                    {audienceCopy.winCopy}
                  </p>
                  <p className="mt-3 max-w-[54ch] text-[14px] leading-7 text-white/52">
                    {sourceLine}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/64">
                      {audienceCopy.audiencePill}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/64">
                      {queueLabel}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/64">
                      {waveHint}
                    </span>
                  </div>
                </div>

                <article
                  className={`rounded-[28px] border border-white/10 bg-gradient-to-br ${accentPreview} p-5 ${accentShadow}`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-white/46">
                    <span className="flex items-center gap-2">
                      <span className="flex gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5a2d]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd71]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#59d98e]" />
                      </span>
                      <span>{`invite.weld -- ${snapshot.lead.inviteCode}`}</span>
                    </span>
                  </div>
                  <h2 className="mt-5 font-display text-[2rem] italic tracking-[-0.04em] md:text-[2.4rem]">
                    {snapshot.lead.inviteCode}
                  </h2>
                  <ul className="mt-5 grid gap-2">
                    {BOOT_LINES.map((line, index) => {
                      const active = index < bootIndex;
                      const done = index < bootIndex - 1;

                      return (
                        <li
                          key={line}
                          className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[18px] border px-3 py-3 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                            active
                              ? "border-white/10 bg-white/[0.06] text-white/68"
                              : "border-white/6 bg-white/[0.03] text-white/34"
                          }`}
                        >
                          <span className={audience === "studio" ? "text-[#7addff]" : "text-[#ff9a7a]"}>
                            &gt;
                          </span>
                          <span>{line}</span>
                          <span className={done ? "text-[#9ce7bf]" : "text-white/42"}>
                            {active ? (index === BOOT_LINES.length - 1 ? "ready" : "ok") : "..."}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-5 grid gap-3">
                    <InviteInfoRow label="Email" value={snapshot.lead.email} />
                    <InviteInfoRow
                      label="Audience"
                      value={audience === "studio" ? "Studio" : "Developer"}
                    />
                    <InviteInfoRow label="Ref code" value={snapshot.lead.inviteCode} />
                    <InviteInfoRow label="Share link" value={snapshot.lead.shareUrl} wrap />
                  </div>
                </article>
              </div>
            </section>

            <section
              id="progress-state"
              ref={progressRef}
              className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,17,25,0.96),rgba(8,11,18,0.99))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.44)]"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/44">
                State 2 - Progress
              </span>
              <h2 className="mt-4 font-display text-[2.1rem] italic tracking-[-0.04em] md:text-[2.8rem]">
                Track your queue and unlocks.
              </h2>
              <p className="mt-3 max-w-[56ch] text-[15px] leading-8 text-white/64">
                No fake ranking. Just your queue hint, referral progress, next unlock, and profile boost.
              </p>

              <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(300px,1.08fr)]">
                <article className="grid gap-5 rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                  <div className="grid gap-5 lg:grid-cols-[minmax(220px,0.52fr)_minmax(0,1fr)] lg:items-center">
                    <div className="mx-auto grid w-full max-w-[220px] place-items-center">
                      <div className="relative grid aspect-square w-full place-items-center">
                        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90 overflow-visible">
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            className="fill-none stroke-[10] text-white/10"
                            stroke="currentColor"
                          />
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            className={audience === "studio" ? "fill-none stroke-[10] text-[#4cc9f0]" : "fill-none stroke-[10] text-[#ff5a2d]"}
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeDasharray={ringCircumference}
                            strokeDashoffset={ringOffset}
                            style={{
                              transition: prefersReducedMotion.current
                                ? "none"
                                : "stroke-dashoffset 520ms cubic-bezier(.22,1,.36,1)"
                            }}
                          />
                        </svg>
                        <div className="absolute inset-0 grid place-items-center text-center">
                          <div>
                            <div className="font-display text-[2.8rem] italic leading-none tracking-[-0.05em]">
                              {`${referralProgress}/${maxReferrals}`}
                            </div>
                            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/42">
                              referrals
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <MetricCard label="Queue" value={queueLabel} />
                      <MetricCard label="Wave hint" value={waveHint} />
                      <MetricCard label="Next unlock" value={nextUnlock} />
                      <MetricCard
                        label="Profile boost"
                        value={`${completionPercent}%`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {REFERRAL_REWARDS.map((reward) => {
                      const isActive = referralProgress >= reward.count;
                      const isNext = !isActive && reward.count === referralProgress + 1;

                      return (
                        <div
                          key={reward.count}
                          className={`grid h-11 place-items-center rounded-[14px] border font-mono text-[11px] uppercase tracking-[0.14em] ${
                            isActive
                              ? audience === "studio"
                                ? "border-[#4cc9f0]/30 bg-[#4cc9f0]/16 text-[#d7f7ff]"
                                : "border-[#ff8c67]/30 bg-[#ff8c67]/16 text-[#ffe1d7]"
                              : isNext
                                ? "border-white/12 bg-white/[0.05] text-white/76"
                                : "border-white/8 bg-white/[0.02] text-white/35"
                          }`}
                        >
                          {reward.count}
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/42">
                      Profile completion
                    </div>
                    <div className="mt-3 h-3 rounded-full border border-white/8 bg-[#0a0c12] p-[2px]">
                      <div
                        className={`h-full rounded-full ${
                          audience === "studio" ? "bg-[#4cc9f0]" : "bg-[#ff5a2d]"
                        }`}
                        style={{
                          width: `${completionPercent}%`,
                          transition: prefersReducedMotion.current
                            ? "none"
                            : "width 320ms cubic-bezier(.22,1,.36,1)"
                        }}
                      />
                    </div>
                  </div>
                </article>

                <aside className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/68">
                    Reward ladder
                  </span>
                  <div className="mt-5 grid gap-3">
                    {REFERRAL_REWARDS.map((reward) => {
                      const active = referralProgress >= reward.count;
                      const next = !active && snapshot.nextReward?.threshold === reward.count;

                      return (
                        <article
                          key={reward.count}
                          className={`grid grid-cols-[48px_1fr] gap-4 rounded-[20px] border p-4 ${
                            active
                              ? audience === "studio"
                                ? "border-[#4cc9f0]/24 bg-[#4cc9f0]/10"
                                : "border-[#ff8c67]/24 bg-[#ff8c67]/10"
                              : next
                                ? "border-white/12 bg-white/[0.04]"
                                : "border-white/8 bg-white/[0.03]"
                          }`}
                        >
                          <div
                            className={`grid h-12 w-12 place-items-center rounded-2xl font-display text-[1.4rem] italic ${
                              active
                                ? audience === "studio"
                                  ? "bg-[#4cc9f0]/16 text-[#d7f7ff]"
                                  : "bg-[#ff8c67]/16 text-[#ffe2d9]"
                                : "bg-white/[0.04] text-white/54"
                            }`}
                          >
                            {reward.count}
                          </div>
                          <div>
                            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/42">
                              {reward.title}
                            </div>
                            <p className="mt-2 text-[15px] leading-7 text-white/72">
                              {reward.detail}
                            </p>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </aside>
              </div>
            </section>

            <section
              id="share-state"
              ref={shareRef}
              className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,18,30,0.96),rgba(8,11,19,0.99))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.44)]"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/44">
                State 3 - Share
              </span>
              <h2 className="mt-4 font-display text-[2.1rem] italic tracking-[-0.04em] md:text-[2.8rem]">
                Share in your voice, fast.
              </h2>
              <p className="mt-3 max-w-[58ch] text-[15px] leading-8 text-white/64">
                {audienceCopy.shareCopy}
              </p>

              <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.92fr)]">
                <article className="grid gap-4 rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                  <div className="flex flex-wrap gap-3">
                    {(["discord", "x", "copy", "linkedin"] as ShareChannel[]).map((channel) => {
                      if (
                        channel === "linkedin" &&
                        audience !== "studio" &&
                        sourceVariant !== "linkedin"
                      ) {
                        return null;
                      }

                      return (
                        <button
                          key={channel}
                          type="button"
                          onClick={() => void handleShare(channel)}
                          className={`rounded-full border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-transform transition-colors hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                            shareChannel === channel
                              ? audience === "studio"
                                ? "border-[#4cc9f0]/26 bg-[#4cc9f0]/14 text-[#e4f9ff]"
                                : "border-[#ff8c67]/26 bg-[#ff8c67]/14 text-[#fff1eb]"
                              : "border-white/12 bg-white/[0.04] text-white/72 hover:bg-white/[0.08]"
                          }`}
                        >
                          {shareButtonLabel(channel)}
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid gap-3">
                    <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                      Invite link
                    </label>
                    <input
                      readOnly
                      value={snapshot.lead.shareUrl}
                      className="min-h-[56px] rounded-[16px] border border-white/10 bg-[#0b0f16] px-4 text-[15px] text-white/76 outline-none"
                    />
                    <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                      Prepared share copy
                    </label>
                    <textarea
                      readOnly
                      value={shareTemplate}
                      className="min-h-[140px] rounded-[20px] border border-white/10 bg-[#0b0f16] px-4 py-4 text-[15px] leading-7 text-white/76 outline-none"
                    />
                  </div>

                  <p
                    className={`min-h-[1.35rem] text-sm ${
                      shareError ? "text-[#ffc1d6]" : "text-[#9ce7bf]"
                    }`}
                  >
                    {shareStatus}
                  </p>
                </article>

                <aside
                  className={`grid gap-3 rounded-[28px] border border-white/8 bg-gradient-to-br ${accentPreview} p-5 ${accentShadow}`}
                >
                  <span
                    className={`inline-flex w-fit rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${accentPill}`}
                  >
                    {sharePreview.kicker}
                  </span>
                  <h3 className="font-display text-[1.8rem] italic tracking-[-0.04em]">
                    {sharePreview.title}
                  </h3>
                  <p className="text-[15px] leading-8 text-white/70">{sharePreview.body}</p>
                  <code className="rounded-[16px] border border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-[12px] text-[#9ce7bf]">
                    {snapshot.lead.shareUrl}
                  </code>
                </aside>
              </div>
            </section>

            <section
              id="profile-state"
              ref={profileRef}
              className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,18,30,0.96),rgba(8,11,19,0.99))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.44)]"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/44">
                State 4 - Profile
              </span>
              <h2 className="mt-4 font-display text-[2.1rem] italic tracking-[-0.04em] md:text-[2.8rem]">
                Build your role loadout.
              </h2>
              <p className="mt-3 max-w-[56ch] text-[15px] leading-8 text-white/64">
                {audienceCopy.profileCopy}
              </p>

              <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)]">
                <article className="grid gap-5 rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap gap-3" role="tablist" aria-label="Profile steps">
                      {PROFILE_STEP_ORDER.map((step) => (
                        <button
                          key={step}
                          type="button"
                          onClick={() => setCurrentStep(step)}
                          className={`rounded-full border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-transform transition-colors hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                            currentStep === step
                              ? audience === "studio"
                                ? "border-[#4cc9f0]/26 bg-[#4cc9f0]/14 text-[#f1fcff]"
                                : "border-[#ff8c67]/26 bg-[#ff8c67]/14 text-[#fff5f1]"
                              : "border-white/12 bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"
                          }`}
                        >
                          {STEP_TITLES[step]}
                        </button>
                      ))}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/42">
                      {`Step ${PROFILE_STEP_ORDER.indexOf(currentStep) + 1} of 3`}
                    </div>
                  </div>

                  <p
                    className={`min-h-[1.35rem] text-sm ${
                      saveError ? "text-[#ffc1d6]" : "text-[#9ce7bf]"
                    }`}
                  >
                    {saveStatus}
                  </p>

                  {currentStep === "identity" ? (
                    <section className="grid gap-5">
                      <div>
                        <h3 className="font-display text-[1.6rem] italic tracking-[-0.04em]">
                          Identity
                        </h3>
                        <p className="mt-2 text-[15px] leading-7 text-white/62">
                          {audienceCopy.identityCopy}
                        </p>
                      </div>

                      {audience === "studio" ? (
                        <FieldBlock label="Studio name">
                          <input
                            value={form.studioName}
                            onChange={(event) =>
                              updateField("studioName", event.target.value, "identity")
                            }
                            placeholder="Your studio or team name"
                            className={fieldClassName}
                          />
                        </FieldBlock>
                      ) : (
                        <>
                          <FieldBlock label="Display name">
                            <input
                              value={form.displayName}
                              onChange={(event) =>
                                updateField("displayName", event.target.value, "identity")
                              }
                              placeholder="How studios should see you"
                              className={fieldClassName}
                            />
                          </FieldBlock>

                          <FieldBlock label="Primary discipline">
                            <div className="flex flex-wrap gap-2">
                              {DISCIPLINE_OPTIONS.map((item) => (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() => toggleRoleChip(item)}
                                  className={`rounded-full border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-transform transition-colors hover:-translate-y-0.5 ${
                                    form.primaryRole === item
                                      ? "border-[#ff8c67]/26 bg-[#ff8c67]/14 text-[#fff1eb]"
                                      : "border-white/12 bg-white/[0.04] text-white/68 hover:bg-white/[0.08]"
                                  }`}
                                >
                                  {item}
                                </button>
                              ))}
                            </div>
                            <p className="mt-3 text-sm leading-7 text-white/46">
                              Each selected discipline improves how studios filter your loadout.
                            </p>
                          </FieldBlock>
                        </>
                      )}
                    </section>
                  ) : null}

                  {currentStep === "proof" ? (
                    <section className="grid gap-5">
                      <div>
                        <h3 className="font-display text-[1.6rem] italic tracking-[-0.04em]">
                          Proof
                        </h3>
                        <p className="mt-2 text-[15px] leading-7 text-white/62">
                          {audienceCopy.proofCopy}
                        </p>
                      </div>

                      {audience === "studio" ? (
                        <>
                          <FieldBlock label="Roles hiring for">
                            <div className="flex flex-wrap gap-2">
                              {DISCIPLINE_OPTIONS.map((item) => (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() => toggleRoleChip(item)}
                                  className={`rounded-full border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-transform transition-colors hover:-translate-y-0.5 ${
                                    form.rolesHiring.includes(item)
                                      ? "border-[#4cc9f0]/26 bg-[#4cc9f0]/14 text-[#f1fcff]"
                                      : "border-white/12 bg-white/[0.04] text-white/68 hover:bg-white/[0.08]"
                                  }`}
                                >
                                  {item}
                                </button>
                              ))}
                            </div>
                            <p className="mt-3 text-sm leading-7 text-white/46">
                              Selected roles show up live in your scout preview.
                            </p>
                          </FieldBlock>

                          <FieldBlock label="Team size">
                            <input
                              value={form.teamSize}
                              onChange={(event) =>
                                updateField("teamSize", event.target.value, "proof")
                              }
                              placeholder="e.g. 4-8 core members"
                              className={fieldClassName}
                            />
                          </FieldBlock>
                        </>
                      ) : (
                        <FieldBlock label="One proof link">
                          <input
                            value={form.proofLink}
                            onChange={(event) =>
                              updateField("proofLink", event.target.value, "proof")
                            }
                            placeholder="Roblox game, portfolio, or reel link"
                            className={fieldClassName}
                          />
                          <p className="mt-3 text-sm leading-7 text-white/46">
                            One link is enough if it clearly proves shipped work.
                          </p>
                        </FieldBlock>
                      )}
                    </section>
                  ) : null}

                  {currentStep === "fit" ? (
                    <section className="grid gap-5">
                      <div>
                        <h3 className="font-display text-[1.6rem] italic tracking-[-0.04em]">
                          Fit
                        </h3>
                        <p className="mt-2 text-[15px] leading-7 text-white/62">
                          {audienceCopy.fitCopy}
                        </p>
                      </div>

                      {audience === "studio" ? (
                        <>
                          <FieldBlock label="Budget style">
                            <select
                              value={form.budgetStyle}
                              onChange={(event) =>
                                updateField("budgetStyle", event.target.value, "fit")
                              }
                              className={fieldClassName}
                            >
                              <option value="">Select style</option>
                              <option value="hourly">Hourly</option>
                              <option value="milestone">Milestone</option>
                              <option value="contract">Contract</option>
                              <option value="mixed">Mixed</option>
                            </select>
                          </FieldBlock>

                          <FieldBlock label="Timeline / what are you building?">
                            <textarea
                              value={form.shippingNote}
                              onChange={(event) =>
                                updateField("shippingNote", event.target.value, "fit")
                              }
                              placeholder="Short version only. Example: launching PvP update in 6 weeks."
                              className={`${fieldClassName} min-h-[132px] resize-y py-4`}
                            />
                          </FieldBlock>
                        </>
                      ) : (
                        <>
                          <div className="grid gap-5 md:grid-cols-2">
                            <FieldBlock label="Availability">
                              <select
                                value={form.availability}
                                onChange={(event) =>
                                  updateField("availability", event.target.value, "fit")
                                }
                                className={fieldClassName}
                              >
                                <option value="">Select availability</option>
                                <option value="10h_wk">~10h/week</option>
                                <option value="20h_wk">~20h/week</option>
                                <option value="full_time">Full-time open</option>
                                <option value="sprint_only">Sprint only</option>
                              </select>
                            </FieldBlock>

                            <FieldBlock label="Rate / budget style">
                              <select
                                value={form.rateStyle}
                                onChange={(event) =>
                                  updateField("rateStyle", event.target.value, "fit")
                                }
                                className={fieldClassName}
                              >
                                <option value="">Select style</option>
                                <option value="hourly">Hourly</option>
                                <option value="milestone">Milestone</option>
                                <option value="package">Package</option>
                                <option value="negotiable">Negotiable</option>
                              </select>
                            </FieldBlock>
                          </div>

                          <FieldBlock label="Short note">
                            <textarea
                              value={form.note}
                              onChange={(event) => updateField("note", event.target.value, "fit")}
                              placeholder="What work are you best at right now? Keep it short."
                              className={`${fieldClassName} min-h-[132px] resize-y py-4`}
                            />
                          </FieldBlock>
                        </>
                      )}
                    </section>
                  ) : null}

                  <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        const currentIndex = PROFILE_STEP_ORDER.indexOf(currentStep);
                        const previous = PROFILE_STEP_ORDER[currentIndex - 1];
                        if (previous) {
                          setCurrentStep(previous);
                        }
                      }}
                      disabled={PROFILE_STEP_ORDER.indexOf(currentStep) === 0}
                      className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white/78 transition-transform transition-colors hover:-translate-y-0.5 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => void saveStep(currentStep)}
                      className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white/78 transition-transform transition-colors hover:-translate-y-0.5 hover:bg-white/[0.08]"
                    >
                      Save now
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleNextStep()}
                      className={`rounded-full px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-transform transition-colors hover:-translate-y-0.5 ${accentPrimary}`}
                    >
                      {PROFILE_STEP_ORDER.indexOf(currentStep) === PROFILE_STEP_ORDER.length - 1
                        ? "Finish this pass"
                        : "Save and continue"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleSaveForLater()}
                      className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white/78 transition-transform transition-colors hover:-translate-y-0.5 hover:bg-white/[0.08]"
                    >
                      Save and exit for now
                    </button>
                  </div>
                </article>

                <aside className={`grid gap-4 rounded-[28px] border border-white/8 bg-gradient-to-br ${accentPreview} p-5 ${accentShadow}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${accentPill}`}
                    >
                      Live loadout preview
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
                        saveError
                          ? "border-[#ff85b0]/25 bg-[#ff85b0]/14 text-[#ffd8e7]"
                          : "border-white/10 bg-white/[0.04] text-white/74"
                      }`}
                    >
                      {saveError ? "Save error" : saveStatus ? "Saved state" : "Autosave armed"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-[1.9rem] italic tracking-[-0.04em]">
                      {previewName}
                    </h3>
                    <p className="mt-2 text-[15px] text-white/70">{previewRole}</p>
                  </div>
                  <div className="grid gap-3">
                    {activeProfileRows.map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-4 rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3"
                      >
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/42">
                          {label}
                        </span>
                        <strong className="max-w-[60%] text-right text-[14px] leading-6 text-white/78">
                          {value}
                        </strong>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(activeChips.length > 0 ? activeChips : ["Signal pending"]).map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/72"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/42">
                      Boost meter
                    </div>
                    <div className="mt-3 h-3 rounded-full border border-white/8 bg-[#0a0c12] p-[2px]">
                      <div
                        className={`h-full rounded-full ${
                          audience === "studio" ? "bg-[#4cc9f0]" : "bg-[#ff5a2d]"
                        }`}
                        style={{
                          width: `${completionPercent}%`,
                          transition: prefersReducedMotion.current
                            ? "none"
                            : "width 320ms cubic-bezier(.22,1,.36,1)"
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-[14px] leading-7 text-white/64">{boostCaption}</p>
                </aside>
              </div>
            </section>

            <section
              id="return-state"
              ref={returnRef}
              className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,18,30,0.96),rgba(8,11,19,0.99))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.44)]"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/44">
                State 5 - Return
              </span>
              <h2 className="mt-4 font-display text-[2.1rem] italic tracking-[-0.04em] md:text-[2.8rem]">
                Come back with one clear next action.
              </h2>
              <p className="mt-3 max-w-[60ch] text-[15px] leading-8 text-white/64">
                Your invite link stays active. Return any time to push profile completion, watch referral progress, and check wave status.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/64">
                  {`Profile ${completionPercent}%`}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/64">
                  {`Referrals ${referralProgress}/${maxReferrals}`}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/64">
                  {nextUnlock}
                </span>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.92fr)]">
                <article className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                  <h3 className="font-display text-[1.8rem] italic tracking-[-0.04em]">
                    Invite link
                  </h3>
                  <input
                    readOnly
                    value={snapshot.lead.shareUrl}
                    className="mt-4 min-h-[56px] w-full rounded-[16px] border border-white/10 bg-[#0b0f16] px-4 text-[15px] text-white/76 outline-none"
                  />
                  <p className="mt-4 text-[14px] leading-7 text-white/58">{returnNote}</p>
                  <p className="mt-2 text-[14px] leading-7 text-white/48">
                    {lastSavedAt ? `Last saved: ${lastSavedAt}.` : "Last saved: waiting for first save."}
                  </p>
                </article>

                <article className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                  <h3 className="font-display text-[1.8rem] italic tracking-[-0.04em]">
                    {nextAction.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-7 text-white/58">{nextAction.copy}</p>
                  <div className="mt-5 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={handlePrimaryReturnAction}
                      className={`rounded-full px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-transform transition-colors hover:-translate-y-0.5 ${accentPrimary}`}
                    >
                      {nextAction.label}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleShare("copy")}
                      className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white/78 transition-transform transition-colors hover:-translate-y-0.5 hover:bg-white/[0.08]"
                    >
                      Copy invite link
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToSection(profileRef)}
                      className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white/78 transition-transform transition-colors hover:-translate-y-0.5 hover:bg-white/[0.08]"
                    >
                      Reopen profile builder
                    </button>
                  </div>
                </article>
              </div>
            </section>

            <p className="text-center text-[12px] uppercase tracking-[0.12em] text-white/36">
              Weld invite state keeps referral, share, and profile actions honest. Product previews are examples only.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

function InviteInfoRow({
  label,
  value,
  wrap
}: {
  label: string;
  value: string;
  wrap?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/42">
        {label}
      </span>
      <strong
        className={`max-w-[65%] text-right text-[13px] leading-6 text-white/78 ${
          wrap ? "break-all" : ""
        }`}
      >
        {value}
      </strong>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-white/[0.04] p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
        {label}
      </div>
      <div className="mt-2 text-[15px] leading-7 text-white/78">{value}</div>
    </div>
  );
}

function FieldBlock({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/42">
        {label}
      </span>
      {children}
    </label>
  );
}

function shareButtonLabel(channel: ShareChannel) {
  switch (channel) {
    case "discord":
      return "Copy for Discord";
    case "x":
      return "Share on X";
    case "linkedin":
      return "Copy for LinkedIn";
    case "copy":
    default:
      return "Copy link";
  }
}

function buildFormState(snapshot: InviteProgressSnapshot): InviteFormState {
  const { identity, proof, fit } = snapshot.draft.draft;

  return {
    displayName: String(identity.displayName ?? ""),
    primaryRole: String(identity.primaryRole ?? ""),
    proofLink: String(proof.proofLink ?? ""),
    availability: String(fit.availability ?? ""),
    rateStyle: String(fit.rateStyle ?? ""),
    note: String(fit.note ?? ""),
    studioName: String(identity.studioName ?? ""),
    rolesHiring: Array.isArray(proof.rolesHiring)
      ? proof.rolesHiring.map((value) => String(value))
      : [],
    teamSize: String(proof.teamSize ?? ""),
    budgetStyle: String(fit.budgetStyle ?? ""),
    shippingNote: String(fit.shippingNote ?? "")
  };
}

function getStepPayload(
  audience: Audience,
  form: InviteFormState,
  step: DraftStepKey
) {
  if (step === "identity") {
    return audience === "studio"
      ? {
          studioName: form.studioName
        }
      : {
          displayName: form.displayName,
          primaryRole: form.primaryRole
        };
  }

  if (step === "proof") {
    return audience === "studio"
      ? {
          rolesHiring: form.rolesHiring,
          teamSize: form.teamSize
        }
      : {
          proofLink: form.proofLink
        };
  }

  return audience === "studio"
    ? {
        budgetStyle: form.budgetStyle,
        shippingNote: form.shippingNote
      }
    : {
        availability: form.availability,
        rateStyle: form.rateStyle,
        note: form.note
      };
}

async function copyToClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

const fieldClassName =
  "min-h-[56px] rounded-[16px] border border-white/10 bg-[#0b0f16] px-4 text-[15px] text-white/76 outline-none placeholder:text-white/28";
