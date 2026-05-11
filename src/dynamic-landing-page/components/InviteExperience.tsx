"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { getBrowserSupabase, hasBrowserSupabaseConfig } from "@/lib/supabase/browser";
import ProfileBuilder from "@/components/profile/ProfileBuilder";
import { getSessionId, shareInvite, trackEvent } from "@/dynamic-landing-page/lib/browser";
import { SITE_URL } from "@/dynamic-landing-page/lib/constants";
import { TYPE_COPY, SOURCE_LINES } from "@/dynamic-landing-page/lib/sample-data";
import type { SourceVariant } from "@/dynamic-landing-page/lib/source-variant";
import type {
  InviteProgressSnapshot,
  ShareChannel
} from "@/dynamic-landing-page/lib/types";

type ShareResponse = { ok: boolean; copy: string; shareUrl: string };

const SHARE_CHANNELS: Array<{ key: ShareChannel; label: string }> = [
  { key: "discord", label: "Discord" },
  { key: "x", label: "X" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "copy", label: "Copy link" }
];

interface InviteExperienceProps {
  initialSnapshot: InviteProgressSnapshot;
  sourceVariant: SourceVariant;
}

export default function InviteExperience({
  initialSnapshot,
  sourceVariant
}: InviteExperienceProps) {
  const router = useRouter();
  const audience = initialSnapshot.lead.audience;
  const copy = TYPE_COPY[audience];
  const inviteCode = initialSnapshot.lead.inviteCode;
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [shareChannel, setShareChannel] = useState<ShareChannel>("discord");
  const [shareStatus, setShareStatus] = useState("");
  const [shareError, setShareError] = useState(false);

  const shareRef = useRef<HTMLElement | null>(null);

  async function handleSignOut() {
    if (!hasBrowserSupabaseConfig()) return;
    await getBrowserSupabase().auth.signOut();
    router.refresh();
  }
  const inviteUrl = snapshot.lead.shareUrl || `${SITE_URL}/invite/${inviteCode}`;
  const sourceLine = SOURCE_LINES[sourceVariant][audience];

  useEffect(() => {
    if (!hasBrowserSupabaseConfig()) {
      setSessionLoading(false);
      return;
    }
    const supabase = getBrowserSupabase();
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    void trackEvent({
      eventName: "invite_view",
      page: "invite",
      audience,
      inviteCode,
      payload: { sourceVariant }
    });
  }, [audience, inviteCode, sourceVariant]);

  async function handleShare(channel: ShareChannel) {
    setShareChannel(channel);
    setShareError(false);
    setShareStatus("Preparing share copy...");

    try {
      const result = await shareInvite(inviteCode, channel) as ShareResponse;

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

      const textToCopy = channel === "copy" ? result.shareUrl : result.copy;
      const copied = await copyToClipboard(textToCopy);
      setShareStatus(
        copied
          ? channel === "copy"
            ? "Invite link copied."
            : `${channelLabel(channel)} copy copied.`
          : "Could not copy automatically. Copy the text manually."
      );
      setShareError(!copied);
    } catch (error) {
      setShareStatus(error instanceof Error ? error.message : "Could not prepare share copy.");
      setShareError(true);
    }
  }

  const isStudio = audience === "studio";

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#0d1220]">
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(91,108,255,0.16),transparent_28rem),radial-gradient(circle_at_88%_18%,rgba(190,205,255,0.42),transparent_26rem),linear-gradient(180deg,#fbfcff_0%,#f3f6fb_100%)]" />
        <div className="relative mx-auto flex w-full max-w-[1180px] flex-col gap-5 px-4 py-5 md:px-6 md:py-8">

          {/* Header */}
          <header className="flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-white/80 bg-white/70 px-4 py-3 shadow-[0_18px_60px_rgba(33,41,65,0.10)] backdrop-blur-xl">
            <Link href={isStudio ? "/studios" : "/"} className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/70 shadow-inner">
                <img src="/Assets/weld-logo-official.svg" alt="" className="h-7 w-7" />
              </span>
              <span className="text-3xl font-bold tracking-[-0.04em]">weld.</span>
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill>{copy.audiencePill}</StatusPill>
              <StatusPill>{inviteCode}</StatusPill>
              <Link
                href={isStudio ? "/studios" : "/"}
                className="inline-flex min-h-[32px] items-center rounded-full border border-white/90 bg-white/60 px-3 text-xs font-bold text-[#53607a] transition hover:bg-white/80"
              >
                ← Landing page
              </Link>
              {!sessionLoading && (
                session ? (
                  <>
                    <span className="text-xs text-[#6f7c95]">
                      Logged in as <strong className="text-[#0d1220]">{session.user.email}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => void handleSignOut()}
                      className="inline-flex min-h-[32px] items-center rounded-full border border-white/90 bg-white/60 px-3 text-xs font-bold text-[#53607a] transition hover:bg-white/80"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link
                    href={`/login?invite=${inviteCode}&email=${encodeURIComponent(snapshot.lead.email)}`}
                    className="inline-flex min-h-[32px] items-center rounded-full border border-white/90 bg-white/60 px-3 text-xs font-bold text-[#53607a] transition hover:bg-white/80"
                  >
                    Log in
                  </Link>
                )
              )}
            </div>
          </header>

          {/* Invite confirmation hero */}
          <section className="rounded-[34px] border border-white/80 bg-white/70 p-5 shadow-[0_28px_90px_rgba(33,41,65,0.12)] backdrop-blur-2xl md:p-7">
            <StatusPill>Invite active</StatusPill>
            <h1 className="mt-5 max-w-[780px] text-[clamp(44px,7vw,76px)] font-bold leading-[0.94] tracking-[-0.06em]">
              You&rsquo;re on the Weld beta list.
            </h1>
            <p className="mt-5 max-w-[58ch] text-lg leading-8 text-[#53607a]">
              {copy.winCopy} Share your invite to move up the list, then come back here to set up your profile once your account is ready.
            </p>
            <p className="mt-3 max-w-[58ch] text-sm leading-7 text-[#6f7c95]">
              {sourceLine}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-sm text-[#6f7c95]">
              <span>Invite for</span>
              <strong className="text-[#0d1220]">{snapshot.lead.email}</strong>
              <span>·</span>
              <span>{snapshot.rewardTier.label}</span>
            </div>
          </section>

          {/* Profile section — auth-gated */}
          {sessionLoading ? (
            <section className="rounded-[34px] border border-white/80 bg-white/70 p-5 shadow-[0_28px_90px_rgba(33,41,65,0.10)] backdrop-blur-2xl md:p-7">
              <p className="text-sm text-[#6f7c95]">Checking session…</p>
            </section>
          ) : session ? (
            <>
              {/* Logged in — show real ProfileBuilder */}
              <section className="rounded-[34px] border border-white/80 bg-white/70 p-5 shadow-[0_28px_90px_rgba(33,41,65,0.10)] backdrop-blur-2xl md:p-7">
                <StatusPill>Profile setup</StatusPill>
                <h2 className="mt-4 text-[clamp(30px,4vw,48px)] font-bold leading-none tracking-[-0.05em]">
                  Build your profile.
                </h2>
                <p className="mt-3 max-w-[54ch] text-base leading-8 text-[#53607a]">
                  Complete your Weld profile so studios can find and match with you.
                </p>
                <div className="mt-6">
                  <ProfileBuilder initialPhase="identity" />
                </div>
              </section>

              {/* Referrals placeholder */}
              <section className="rounded-[34px] border border-white/80 bg-white/70 p-5 shadow-[0_28px_90px_rgba(33,41,65,0.10)] backdrop-blur-2xl md:p-7">
                <StatusPill>Referrals — coming soon</StatusPill>
                <h2 className="mt-4 text-2xl font-bold tracking-[-0.03em]">
                  Track your referrals here.
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#6f7c95]">
                  Referral count and reward tiers will appear here once the feature ships.
                </p>
              </section>
            </>
          ) : (
            /* Not logged in — auth prompt */
            <section className="rounded-[34px] border border-white/80 bg-white/70 p-5 shadow-[0_28px_90px_rgba(33,41,65,0.10)] backdrop-blur-2xl md:p-7">
              <StatusPill>Profile setup</StatusPill>
              <h2 className="mt-4 text-[clamp(30px,4vw,48px)] font-bold leading-none tracking-[-0.05em]">
                Create your account to build your profile.
              </h2>
              <p className="mt-4 max-w-[54ch] text-base leading-8 text-[#53607a]">
                Sign up or log in to complete your Weld profile. Your invite code will carry over automatically.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/accountsignup?invite=${inviteCode}&email=${encodeURIComponent(snapshot.lead.email)}`}
                  className="inline-flex min-h-[52px] items-center rounded-full bg-[#0b0f18] px-7 text-sm font-bold text-white shadow-[0_16px_34px_rgba(10,14,26,0.24)] transition-transform hover:-translate-y-0.5"
                >
                  Create your account
                </Link>
                <Link
                  href={`/login?invite=${inviteCode}&email=${encodeURIComponent(snapshot.lead.email)}`}
                  className="inline-flex min-h-[52px] items-center rounded-full border border-white/90 bg-white/60 px-7 text-sm font-bold text-[#0d1220] shadow-inner transition-transform hover:-translate-y-0.5"
                >
                  Already have an account? Log in
                </Link>
              </div>
            </section>
          )}

          {/* Share / referral section — always visible */}
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

          {/* Footer */}
          <footer className="rounded-[28px] border border-white/80 bg-white/60 p-5 text-sm leading-7 text-[#53607a] shadow-[0_18px_60px_rgba(33,41,65,0.08)]">
            Invite active for <strong className="text-[#0d1220]">{snapshot.lead.email}</strong>.
            Status: <strong className="text-[#0d1220]">{snapshot.rewardTier.label}</strong>.
            Return here any time to update your profile or copy your invite.
          </footer>

        </div>
      </main>
    </div>
  );
}

function StatusPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex min-h-[32px] items-center rounded-full border border-white/90 bg-white/60 px-3 text-xs font-bold uppercase tracking-[0.12em] text-[#5b6cff] shadow-inner">
      {children}
    </span>
  );
}

async function copyToClipboard(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

function channelLabel(channel: ShareChannel): string {
  switch (channel) {
    case "discord": return "Discord";
    case "x": return "X";
    case "linkedin": return "LinkedIn";
    default: return "Invite link";
  }
}
