"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { getSessionId, shareInvite, trackEvent } from "@/dynamic landing page/lib/browser";
import { PROFILE_STEP_ORDER, SITE_URL } from "@/dynamic landing page/lib/constants";
import {
  DISCIPLINE_OPTIONS,
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

const STEP_LABELS: Record<DraftStepKey, string> = {
  identity: "Identity",
  proof: "Proof",
  fit: "Fit"
};

const SHARE_CHANNELS: Array<{ key: ShareChannel; label: string }> = [
  { key: "discord", label: "Discord" },
  { key: "x", label: "X" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "copy", label: "Copy link" }
];

const availabilityOptions = [
  ["", "Select availability"],
  ["10h_wk", "~10h/week"],
  ["20h_wk", "~20h/week"],
  ["full_time", "Full-time open"],
  ["sprint_only", "Sprint only"]
] as const;

const rateOptions = [
  ["", "Select rate style"],
  ["hourly", "Hourly"],
  ["milestone", "Milestone"],
  ["package", "Package"],
  ["negotiable", "Negotiable"]
] as const;

const budgetOptions = [
  ["", "Select budget style"],
  ["hourly", "Hourly"],
  ["milestone", "Milestone"],
  ["contract", "Contract"],
  ["mixed", "Mixed"]
] as const;

export default function InviteExperience({
  initialSnapshot,
  sourceVariant
}: InviteExperienceProps) {
  const audience = initialSnapshot.lead.audience;
  const copy = TYPE_COPY[audience];
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [form, setForm] = useState<InviteFormState>(() => buildFormState(initialSnapshot));
  const [currentStep, setCurrentStep] = useState<DraftStepKey>(
    initialSnapshot.draft.currentStep
  );
  const [saveStatus, setSaveStatus] = useState("Ready to save.");
  const [saveError, setSaveError] = useState(false);
  const [shareChannel, setShareChannel] = useState<ShareChannel>("discord");
  const [shareStatus, setShareStatus] = useState("");
  const [shareError, setShareError] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState("");
  const profileRef = useRef<HTMLElement | null>(null);
  const shareRef = useRef<HTMLElement | null>(null);
  const autosaveTimer = useRef<number | null>(null);

  const completionPercent = snapshot.draft.completionPercent;
  const referralGoal = 5;
  const referralCount = Math.min(snapshot.referralCount, referralGoal);
  const inviteUrl = snapshot.lead.shareUrl || `${SITE_URL}/invite/${snapshot.lead.inviteCode}`;
  const sourceLine = SOURCE_LINES[sourceVariant][audience];
  const nextReward =
    snapshot.nextReward === null
      ? "Top beta reward reached"
      : `${snapshot.nextReward.threshold} referrals unlock ${snapshot.nextReward.label}`;
  const profileSummary = useMemo(
    () => buildProfileSummary(audience, form),
    [audience, form]
  );
  const recommendedAction = useMemo(() => {
    if (completionPercent < 100) {
      return {
        title: "Finish your profile",
        body: "Save the three short profile steps so your invite has enough signal for review.",
        label: "Continue profile",
        target: "profile" as const
      };
    }

    if (snapshot.referralCount < 1) {
      return {
        title: "Share once",
        body: "One referral is the cleanest next unlock. Your copy is ready below.",
        label: "Go to share tools",
        target: "share" as const
      };
    }

    return {
      title: "Check status",
      body: "Your invite is active. Keep the link handy and return here when you want to update proof.",
      label: "Review status",
      target: "status" as const
    };
  }, [completionPercent, snapshot.referralCount]);

  useEffect(() => {
    void trackEvent({
      eventName: "invite_view",
      page: "invite",
      audience,
      inviteCode: snapshot.lead.inviteCode,
      payload: { sourceVariant }
    });
  }, [audience, snapshot.lead.inviteCode, sourceVariant]);

  useEffect(() => {
    return () => {
      if (autosaveTimer.current) {
        window.clearTimeout(autosaveTimer.current);
      }
    };
  }, []);

  function scrollTo(ref: React.RefObject<HTMLElement | null>) {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateField<K extends keyof InviteFormState>(
    key: K,
    value: InviteFormState[K],
    step: DraftStepKey
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    queueAutosave(step);
  }

  function queueAutosave(step: DraftStepKey) {
    if (autosaveTimer.current) {
      window.clearTimeout(autosaveTimer.current);
    }

    setSaveError(false);
    setSaveStatus("Autosave pending...");

    autosaveTimer.current = window.setTimeout(() => {
      void saveStep(step, { silent: true });
    }, 750);
  }

  function toggleRole(role: string) {
    if (audience === "studio") {
      const roles = form.rolesHiring.includes(role)
        ? form.rolesHiring.filter((value) => value !== role)
        : [...form.rolesHiring, role];
      updateField("rolesHiring", roles, "proof");
      return;
    }

    updateField("primaryRole", role, "identity");
  }

  async function saveStep(
    step: DraftStepKey,
    options: { silent?: boolean } = {}
  ) {
    if (autosaveTimer.current) {
      window.clearTimeout(autosaveTimer.current);
    }

    if (!options.silent) {
      setSaveStatus("Saving...");
      setSaveError(false);
    }

    try {
      const response = await fetch("/api/profile-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inviteCode: snapshot.lead.inviteCode,
          step,
          payload: getStepPayload(audience, form, step),
          sessionId: getSessionId()
        })
      });
      const result = (await response.json().catch(() => null)) as SaveResponse | null;

      if (!response.ok || !result?.ok) {
        throw new Error(result?.message || "Could not save this step.");
      }

      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });

      setSnapshot((current) => ({
        ...current,
        draft: result.draft,
        referralCount: result.referralCount,
        rewardTier: result.rewardTier,
        nextReward: result.nextReward,
        waveLabel: result.waveLabel
      }));
      setLastSavedAt(timestamp);
      setSaveStatus(options.silent ? `Autosaved at ${timestamp}.` : `Saved at ${timestamp}.`);
      setSaveError(false);
      return true;
    } catch (error) {
      setSaveStatus(error instanceof Error ? error.message : "Could not save this step.");
      setSaveError(true);
      return false;
    }
  }

  async function saveAndContinue() {
    const saved = await saveStep(currentStep);

    if (!saved) {
      return;
    }

    const index = PROFILE_STEP_ORDER.indexOf(currentStep);
    const nextStep = PROFILE_STEP_ORDER[index + 1];

    if (nextStep) {
      setCurrentStep(nextStep);
      return;
    }

    scrollTo(shareRef);
  }

  async function handleShare(channel: ShareChannel) {
    setShareChannel(channel);
    setShareError(false);
    setShareStatus("Preparing share copy...");

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
        return;
      }

      const copied = await copyToClipboard(channel === "copy" ? result.shareUrl : result.copy);
      setShareStatus(
        copied
          ? channel === "copy"
            ? "Invite link copied."
            : `${shareLabel(channel)} copy copied.`
          : "Could not copy automatically. Copy the text manually."
      );
      setShareError(!copied);
    } catch (error) {
      setShareStatus(error instanceof Error ? error.message : "Could not prepare share copy.");
      setShareError(true);
    }
  }

  function goToRecommendedAction() {
    if (recommendedAction.target === "share") {
      scrollTo(shareRef);
      return;
    }

    scrollTo(profileRef);
  }

  const isStudio = audience === "studio";

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#0d1220]">
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(91,108,255,0.16),transparent_28rem),radial-gradient(circle_at_88%_18%,rgba(190,205,255,0.42),transparent_26rem),linear-gradient(180deg,#fbfcff_0%,#f3f6fb_100%)]" />
        <div className="relative mx-auto flex w-full max-w-[1180px] flex-col gap-5 px-4 py-5 md:px-6 md:py-8">
          <header className="flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-white/80 bg-white/70 px-4 py-3 shadow-[0_18px_60px_rgba(33,41,65,0.10)] backdrop-blur-xl">
            <Link href={isStudio ? "/studios" : "/"} className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/70 shadow-inner">
                <img src="/Assets/weld-logo-official.svg" alt="" className="h-7 w-7" />
              </span>
              <span className="text-3xl font-bold tracking-[-0.04em]">weld.</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <StatusPill>{copy.audiencePill}</StatusPill>
              <StatusPill>{snapshot.lead.inviteCode}</StatusPill>
            </div>
          </header>

          <section className="grid gap-5 rounded-[34px] border border-white/80 bg-white/70 p-5 shadow-[0_28px_90px_rgba(33,41,65,0.12)] backdrop-blur-2xl lg:grid-cols-[minmax(0,1fr)_360px] md:p-7">
            <div className="min-w-0">
              <StatusPill>Invite active</StatusPill>
              <h1 className="mt-5 max-w-[780px] text-[clamp(44px,7vw,76px)] font-bold leading-[0.94] tracking-[-0.06em]">
                You are on the Weld beta list.
              </h1>
              <p className="mt-5 max-w-[58ch] text-lg leading-8 text-[#53607a]">
                {copy.winCopy} Finish the short profile pass, share your invite, and come back here for status.
              </p>
              <p className="mt-3 max-w-[58ch] text-sm leading-7 text-[#6f7c95]">
                {sourceLine}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => scrollTo(profileRef)}
                  className="min-h-[52px] rounded-full bg-[#0b0f18] px-6 text-sm font-bold text-white shadow-[0_16px_34px_rgba(10,14,26,0.24)] transition-transform hover:-translate-y-0.5"
                >
                  Complete profile
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo(shareRef)}
                  className="min-h-[52px] rounded-full border border-white/90 bg-white/60 px-6 text-sm font-bold text-[#0d1220] shadow-inner transition-transform hover:-translate-y-0.5"
                >
                  Share invite
                </button>
              </div>
            </div>

            <aside className="rounded-[28px] border border-white/90 bg-white/75 p-5 shadow-[0_18px_50px_rgba(33,41,65,0.10)]">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#5b6cff]">
                Next best step
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em]">
                {recommendedAction.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#53607a]">{recommendedAction.body}</p>
              <button
                type="button"
                onClick={goToRecommendedAction}
                className="mt-5 min-h-[48px] w-full rounded-full bg-[#0b0f18] px-5 text-sm font-bold text-white"
              >
                {recommendedAction.label}
              </button>
            </aside>
          </section>

          <section className="grid gap-5 md:grid-cols-3">
            <ProgressCard
              label="Profile"
              value={`${completionPercent}%`}
              helper={completionPercent >= 100 ? "Ready for review" : "Complete three steps"}
              progress={completionPercent}
            />
            <ProgressCard
              label="Referrals"
              value={`${referralCount}/${referralGoal}`}
              helper={nextReward}
              progress={(referralCount / referralGoal) * 100}
            />
            <ProgressCard
              label="Wave"
              value={snapshot.rewardTier.label}
              helper={snapshot.waveLabel}
              progress={100}
            />
          </section>

          <section
            ref={profileRef}
            className="grid gap-5 rounded-[34px] border border-white/80 bg-white/70 p-5 shadow-[0_28px_90px_rgba(33,41,65,0.10)] backdrop-blur-2xl lg:grid-cols-[minmax(0,1fr)_360px] md:p-7"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <StatusPill>Profile setup</StatusPill>
                  <h2 className="mt-4 text-[clamp(34px,5vw,54px)] font-bold leading-none tracking-[-0.05em]">
                    Three short steps. Save any time.
                  </h2>
                </div>
                <div
                  className={`rounded-full px-4 py-2 text-xs font-bold ${
                    saveError
                      ? "bg-[#ffe8ee] text-[#b12a42]"
                      : "bg-[#eef6ff] text-[#3150c9]"
                  }`}
                  aria-live="polite"
                >
                  {saveStatus}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {PROFILE_STEP_ORDER.map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setCurrentStep(step)}
                    className={`min-h-[44px] rounded-full border px-3 text-sm font-bold transition-colors ${
                      currentStep === step
                        ? "border-[#0b0f18] bg-[#0b0f18] text-white"
                        : "border-white/90 bg-white/60 text-[#53607a]"
                    }`}
                  >
                    {STEP_LABELS[step]}
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-[28px] border border-white/80 bg-white/60 p-5">
                <ProfileStep
                  audience={audience}
                  step={currentStep}
                  form={form}
                  onFieldChange={updateField}
                  onRoleToggle={toggleRole}
                />

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void saveStep(currentStep)}
                    className="min-h-[48px] rounded-full border border-white/90 bg-white/70 px-5 text-sm font-bold text-[#0d1220]"
                  >
                    Save now
                  </button>
                  <button
                    type="button"
                    onClick={() => void saveAndContinue()}
                    className="min-h-[48px] rounded-full bg-[#0b0f18] px-5 text-sm font-bold text-white"
                  >
                    {currentStep === "fit" ? "Save and go to share" : "Save and continue"}
                  </button>
                </div>
              </div>
            </div>

            <aside className="rounded-[28px] border border-white/90 bg-white/75 p-5 shadow-[0_18px_50px_rgba(33,41,65,0.10)]">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#5b6cff]">
                Preview
              </div>
              <h3 className="mt-3 text-3xl font-bold tracking-[-0.04em]">
                {profileSummary.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-[#53607a]">{profileSummary.subtitle}</p>
              <div className="mt-5 grid gap-3">
                {profileSummary.rows.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-white/80 bg-white/60 px-4 py-3"
                  >
                    <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#6f7c95]">
                      {label}
                    </span>
                    <strong className="max-w-[62%] text-right text-sm leading-6 text-[#0d1220]">
                      {value}
                    </strong>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-[#6f7c95]">
                {lastSavedAt ? `Last saved at ${lastSavedAt}.` : "Autosave starts after first edit."}
              </p>
            </aside>
          </section>

          <section
            ref={shareRef}
            className="grid gap-5 rounded-[34px] border border-white/80 bg-white/70 p-5 shadow-[0_28px_90px_rgba(33,41,65,0.10)] backdrop-blur-2xl lg:grid-cols-[minmax(0,1fr)_360px] md:p-7"
          >
            <div>
              <StatusPill>Share invite</StatusPill>
              <h2 className="mt-4 text-[clamp(34px,5vw,54px)] font-bold leading-none tracking-[-0.05em]">
                One link. Clear copy. No guessing.
              </h2>
              <p className="mt-4 max-w-[58ch] text-base leading-8 text-[#53607a]">
                {copy.shareCopy}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {SHARE_CHANNELS.map((channel) => (
                  <button
                    key={channel.key}
                    type="button"
                    onClick={() => void handleShare(channel.key)}
                    className={`min-h-[44px] rounded-full border px-4 text-sm font-bold ${
                      shareChannel === channel.key
                        ? "border-[#0b0f18] bg-[#0b0f18] text-white"
                        : "border-white/90 bg-white/60 text-[#53607a]"
                    }`}
                  >
                    {channel.label}
                  </button>
                ))}
              </div>

              <textarea
                readOnly
                value={
                  shareChannel === "copy"
                    ? inviteUrl
                    : snapshot.sharePresets[shareChannel] || inviteUrl
                }
                className="mt-5 min-h-[150px] w-full resize-y rounded-[24px] border border-white/90 bg-white/70 p-4 text-sm leading-7 text-[#0d1220] outline-none"
              />
              {shareStatus ? (
                <p
                  className={`mt-3 text-sm font-bold ${
                    shareError ? "text-[#b12a42]" : "text-[#3150c9]"
                  }`}
                  aria-live="polite"
                >
                  {shareStatus}
                </p>
              ) : null}
            </div>

            <aside className="rounded-[28px] border border-white/90 bg-white/75 p-5 shadow-[0_18px_50px_rgba(33,41,65,0.10)]">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#5b6cff]">
                Direct invite
              </div>
              <input
                readOnly
                value={inviteUrl}
                className="mt-4 min-h-[52px] w-full rounded-2xl border border-white/90 bg-white/70 px-4 text-sm text-[#0d1220] outline-none"
              />
              <button
                type="button"
                onClick={() => void handleShare("copy")}
                className="mt-4 min-h-[48px] w-full rounded-full bg-[#0b0f18] px-5 text-sm font-bold text-white"
              >
                Copy invite link
              </button>
              <p className="mt-5 text-sm leading-7 text-[#53607a]">
                Referral count updates when people use your invite. No fake counters, no hidden checklist.
              </p>
            </aside>
          </section>

          <footer className="rounded-[28px] border border-white/80 bg-white/60 p-5 text-sm leading-7 text-[#53607a] shadow-[0_18px_60px_rgba(33,41,65,0.08)]">
            Invite active for <strong className="text-[#0d1220]">{snapshot.lead.email}</strong>.
            Status: <strong className="text-[#0d1220]">{snapshot.rewardTier.label}</strong>.
            Return here any time to update profile proof or copy your invite.
          </footer>
        </div>
      </main>
    </div>
  );
}

function ProfileStep({
  audience,
  step,
  form,
  onFieldChange,
  onRoleToggle
}: {
  audience: Audience;
  step: DraftStepKey;
  form: InviteFormState;
  onFieldChange: <K extends keyof InviteFormState>(
    key: K,
    value: InviteFormState[K],
    step: DraftStepKey
  ) => void;
  onRoleToggle: (role: string) => void;
}) {
  const isStudio = audience === "studio";

  if (step === "identity") {
    return (
      <div>
        <h3 className="text-2xl font-bold tracking-[-0.03em]">Identity</h3>
        <p className="mt-2 text-sm leading-7 text-[#53607a]">
          {TYPE_COPY[audience].identityCopy}
        </p>
        <div className="mt-5 grid gap-5">
          {isStudio ? (
            <Field label="Studio name">
              <input
                value={form.studioName}
                onChange={(event) => onFieldChange("studioName", event.target.value, "identity")}
                placeholder="Example: Nova Studio"
                className={fieldClassName}
              />
            </Field>
          ) : (
            <>
              <Field label="Display name">
                <input
                  value={form.displayName}
                  onChange={(event) =>
                    onFieldChange("displayName", event.target.value, "identity")
                  }
                  placeholder="Example: Eclipse"
                  className={fieldClassName}
                />
              </Field>
              <RolePicker
                selected={form.primaryRole ? [form.primaryRole] : []}
                multi={false}
                onToggle={onRoleToggle}
              />
            </>
          )}
        </div>
      </div>
    );
  }

  if (step === "proof") {
    return (
      <div>
        <h3 className="text-2xl font-bold tracking-[-0.03em]">Proof</h3>
        <p className="mt-2 text-sm leading-7 text-[#53607a]">
          {TYPE_COPY[audience].proofCopy}
        </p>
        <div className="mt-5 grid gap-5">
          {isStudio ? (
            <>
              <RolePicker
                selected={form.rolesHiring}
                multi
                onToggle={onRoleToggle}
              />
              <Field label="Team size">
                <select
                  value={form.teamSize}
                  onChange={(event) => onFieldChange("teamSize", event.target.value, "proof")}
                  className={fieldClassName}
                >
                  <option value="">Select team size</option>
                  <option value="solo">Solo / founder</option>
                  <option value="small">2-5 people</option>
                  <option value="mid">6-15 people</option>
                  <option value="large">16+ people</option>
                </select>
              </Field>
            </>
          ) : (
            <Field label="Best proof link">
              <input
                value={form.proofLink}
                onChange={(event) => onFieldChange("proofLink", event.target.value, "proof")}
                placeholder="Roblox game, portfolio, reel, or GitHub link"
                className={fieldClassName}
              />
            </Field>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold tracking-[-0.03em]">Fit</h3>
      <p className="mt-2 text-sm leading-7 text-[#53607a]">
        {TYPE_COPY[audience].fitCopy}
      </p>
      <div className="mt-5 grid gap-5">
        {isStudio ? (
          <>
            <Field label="Budget style">
              <select
                value={form.budgetStyle}
                onChange={(event) => onFieldChange("budgetStyle", event.target.value, "fit")}
                className={fieldClassName}
              >
                {budgetOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Timeline / need">
              <textarea
                value={form.shippingNote}
                onChange={(event) => onFieldChange("shippingNote", event.target.value, "fit")}
                placeholder="Example: launching PvP update in 6 weeks."
                className={`${fieldClassName} min-h-[126px] resize-y py-4`}
              />
            </Field>
          </>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Availability">
                <select
                  value={form.availability}
                  onChange={(event) =>
                    onFieldChange("availability", event.target.value, "fit")
                  }
                  className={fieldClassName}
                >
                  {availabilityOptions.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Rate style">
                <select
                  value={form.rateStyle}
                  onChange={(event) => onFieldChange("rateStyle", event.target.value, "fit")}
                  className={fieldClassName}
                >
                  {rateOptions.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Short note">
              <textarea
                value={form.note}
                onChange={(event) => onFieldChange("note", event.target.value, "fit")}
                placeholder="What work are you best at right now?"
                className={`${fieldClassName} min-h-[126px] resize-y py-4`}
              />
            </Field>
          </>
        )}
      </div>
    </div>
  );
}

function RolePicker({
  selected,
  multi,
  onToggle
}: {
  selected: string[];
  multi: boolean;
  onToggle: (role: string) => void;
}) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#6f7c95]">
        {multi ? "Roles hiring" : "Primary role"}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {DISCIPLINE_OPTIONS.map((role) => {
          const active = selected.includes(role);

          return (
            <button
              key={role}
              type="button"
              onClick={() => onToggle(role)}
              className={`min-h-[40px] rounded-full border px-4 text-sm font-bold ${
                active
                  ? "border-[#5b6cff] bg-[#eef1ff] text-[#253ccf]"
                  : "border-white/90 bg-white/60 text-[#53607a]"
              }`}
            >
              {role}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProgressCard({
  label,
  value,
  helper,
  progress
}: {
  label: string;
  value: string;
  helper: string;
  progress: number;
}) {
  return (
    <article className="rounded-[28px] border border-white/80 bg-white/70 p-5 shadow-[0_18px_60px_rgba(33,41,65,0.08)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#6f7c95]">
            {label}
          </div>
          <strong className="mt-2 block text-3xl font-bold tracking-[-0.04em]">
            {value}
          </strong>
        </div>
        <span className="rounded-full bg-[#eef1ff] px-3 py-1 text-xs font-bold text-[#3150c9]">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="mt-5 h-2 rounded-full bg-[#e4e9f5]">
        <div
          className="h-full rounded-full bg-[#5b6cff]"
          style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
        />
      </div>
      <p className="mt-3 text-sm leading-6 text-[#53607a]">{helper}</p>
    </article>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-3">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#6f7c95]">
        {label}
      </span>
      {children}
    </label>
  );
}

function StatusPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex min-h-[32px] items-center rounded-full border border-white/90 bg-white/60 px-3 text-xs font-bold uppercase tracking-[0.12em] text-[#5b6cff] shadow-inner">
      {children}
    </span>
  );
}

function buildProfileSummary(audience: Audience, form: InviteFormState) {
  if (audience === "studio") {
    return {
      title: form.studioName || "Studio identity pending",
      subtitle:
        form.rolesHiring.length > 0
          ? `Hiring ${form.rolesHiring.join(", ")}`
          : "Choose roles you want to scout.",
      rows: [
        ["Team", form.teamSize || "Not set"],
        ["Budget", form.budgetStyle || "Not set"],
        ["Timeline", form.shippingNote || "Not set"]
      ]
    };
  }

  return {
    title: form.displayName || "Creator identity pending",
    subtitle: form.primaryRole || "Choose a primary role.",
    rows: [
      ["Proof", form.proofLink || "Not set"],
      ["Availability", form.availability || "Not set"],
      ["Rate", form.rateStyle || "Not set"]
    ]
  };
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
      ? { studioName: form.studioName }
      : { displayName: form.displayName, primaryRole: form.primaryRole };
  }

  if (step === "proof") {
    return audience === "studio"
      ? { rolesHiring: form.rolesHiring, teamSize: form.teamSize }
      : { proofLink: form.proofLink };
  }

  return audience === "studio"
    ? { budgetStyle: form.budgetStyle, shippingNote: form.shippingNote }
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

function shareLabel(channel: ShareChannel) {
  switch (channel) {
    case "discord":
      return "Discord";
    case "x":
      return "X";
    case "linkedin":
      return "LinkedIn";
    case "copy":
    default:
      return "Invite link";
  }
}

const fieldClassName =
  "min-h-[54px] rounded-2xl border border-white/90 bg-white/70 px-4 text-sm text-[#0d1220] outline-none placeholder:text-[#8a96ad] focus:border-[#5b6cff]";
