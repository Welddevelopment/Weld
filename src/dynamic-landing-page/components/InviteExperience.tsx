"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { getBrowserSupabase, hasBrowserSupabaseConfig } from "@/lib/supabase/browser";
import ProfileBuilder from "@/components/profile/ProfileBuilder";
import { shareInvite, trackEvent } from "@/dynamic-landing-page/lib/browser";
import { REWARD_TIERS, SITE_URL } from "@/dynamic-landing-page/lib/constants";
import { TYPE_COPY, SOURCE_LINES } from "@/dynamic-landing-page/lib/sample-data";
import type { SourceVariant } from "@/dynamic-landing-page/lib/source-variant";
import type {
  InviteProgressSnapshot,
  ShareChannel
} from "@/dynamic-landing-page/lib/types";

type ShareResponse = { ok: boolean; copy: string; shareUrl: string };

const SHARE_CHANNELS: Array<{ key: ShareChannel; label: string; helper: string }> = [
  { key: "discord", label: "Discord", helper: "Drop into a server or hiring chat." },
  { key: "x", label: "X", helper: "Short public post copy." },
  { key: "linkedin", label: "LinkedIn", helper: "More polished professional share." },
  { key: "instagram", label: "Instagram", helper: "Story or DM-friendly copy." },
  { key: "snapchat", label: "Snapchat", helper: "Fast friend-share copy." },
  { key: "copy", label: "Copy link", helper: "Direct invite URL only." }
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
  const [profilePublished, setProfilePublished] = useState(false);
  const [shareChannel, setShareChannel] = useState<ShareChannel>("discord");
  const [shareStatus, setShareStatus] = useState("");
  const [shareError, setShareError] = useState(false);

  const shareRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("weld_last_invite_url", `/invite/${inviteCode}`);
    } catch {}
  }, [inviteCode]);

  async function handleSignOut() {
    if (!hasBrowserSupabaseConfig()) return;
    await getBrowserSupabase().auth.signOut();
    router.refresh();
  }

  const inviteUrl = snapshot.lead.shareUrl || `${SITE_URL}/invite/${inviteCode}`;
  const sourceLine = SOURCE_LINES[sourceVariant][audience];
  const activeShare = SHARE_CHANNELS.find((channel) => channel.key === shareChannel) ?? SHARE_CHANNELS[0];
  const selectedShareText = shareChannel === "copy"
    ? inviteUrl
    : snapshot.sharePresets[shareChannel] || inviteUrl;
  const referralCount = snapshot.referralCount;
  const activeTier =
    [...REWARD_TIERS].reverse().find((tier) => referralCount >= tier.threshold) ?? REWARD_TIERS[0];
  const nextTier = REWARD_TIERS.find((tier) => tier.threshold > referralCount);
  const progressPercent = nextTier
    ? Math.min(100, Math.round((referralCount / nextTier.threshold) * 100))
    : 100;
  const referralsRemaining = nextTier ? Math.max(nextTier.threshold - referralCount, 0) : 0;

  useEffect(() => {
    if (!hasBrowserSupabaseConfig()) {
      setSessionLoading(false);
      return;
    }
    const supabase = getBrowserSupabase();
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session?.access_token) {
        try {
          const res = await fetch("/api/account/profile", {
            headers: { Authorization: `Bearer ${data.session.access_token}` },
            cache: "no-store"
          });
          if (res.ok) {
            const json = await res.json() as { profile?: { publishedProfile?: unknown } | null };
            setProfilePublished(Boolean(json.profile?.publishedProfile));
          }
        } catch {}
      }
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
      <main className="invite-dashboard relative overflow-hidden">
        <div className="invite-dashboard-bg" aria-hidden="true" />
        <div className="relative mx-auto flex w-full max-w-[1180px] flex-col gap-5 px-4 py-5 md:px-6 md:py-8">
          <header className="invite-topbar">
            <Link href={isStudio ? "/studios" : "/"} className="invite-brand">
              <span>
                <img src="/Assets/weld-logo-official.svg" alt="" />
              </span>
              <strong>weld.</strong>
            </Link>
            <div className="invite-topbar-actions">
              <StatusPill>{copy.audiencePill}</StatusPill>
              <StatusPill>{inviteCode}</StatusPill>
              <Link href={isStudio ? "/studios" : "/"} className="invite-soft-button">
                Landing page
              </Link>
              {!sessionLoading && (
                session ? (
                  <>
                    <span className="invite-session">
                      Signed in as <strong>{session.user.email}</strong>
                    </span>
                    <button type="button" onClick={() => void handleSignOut()} className="invite-soft-button">
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link
                    href={`/login?invite=${inviteCode}&email=${encodeURIComponent(snapshot.lead.email)}`}
                    className="invite-soft-button"
                  >
                    Log in
                  </Link>
                )
              )}
            </div>
          </header>

          <section className="invite-hero-card">
            <div className="invite-hero-copy">
              <StatusPill>Invite active</StatusPill>
              <h1>You're on the Weld beta list.</h1>
              <p>
                {copy.winCopy} Your invite is live, your link is ready, and this page is your beta dashboard.
              </p>
              <p className="invite-source-line">{sourceLine}</p>
              <div className="invite-hero-actions">
                <button type="button" onClick={() => void handleShare("copy")} className="invite-primary-button">
                  Copy invite link
                </button>
                <button
                  type="button"
                  onClick={() => shareRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="invite-secondary-button"
                >
                  Share options
                </button>
              </div>
            </div>
            <aside className="invite-status-panel">
              <div>
                <span>Invite for</span>
                <strong>{snapshot.lead.email}</strong>
              </div>
              <div>
                <span>Current status</span>
                <strong>{activeTier.label}</strong>
              </div>
              <div>
                <span>Referral count</span>
                <strong>{referralCount}</strong>
              </div>
            </aside>
          </section>

          <section className="invite-dashboard-grid">
            <article className="invite-card invite-referral-card">
              <div className="invite-card-heading">
                <StatusPill>Referrals</StatusPill>
                <h2>{referralCount === 0 ? "Start with one strong share." : "Your invite is moving."}</h2>
                <p>
                  Referral counts update when people join through your invite link. No fake counters, no changed attribution.
                </p>
              </div>
              <div className="invite-referral-number">
                <strong>{referralCount}</strong>
                <span>{referralCount === 1 ? "person joined" : "people joined"} using your invite</span>
              </div>
              <div className="invite-progress-block">
                <div className="invite-progress-label">
                  <span>{activeTier.label}</span>
                  <strong>
                    {nextTier ? `${referralsRemaining} to ${nextTier.label}` : "Top visible tier"}
                  </strong>
                </div>
                <div className="invite-progress-track" aria-hidden="true">
                  <span style={{ width: `${progressPercent}%` }} />
                </div>
                <p>{activeTier.description}</p>
              </div>
            </article>

            {sessionLoading ? (
              <article className="invite-card">
                <StatusPill>Profile setup</StatusPill>
                <h2>Checking session...</h2>
                <p>Loading account state for this invite.</p>
              </article>
            ) : session ? (
              <article className="invite-card invite-profile-card">
                <StatusPill>Profile setup</StatusPill>
                {profilePublished ? (
                  <>
                    <h2>Your profile is live.</h2>
                    <p>
                      Studios can already find and match with you. Head to your profile to view or tune the details.
                    </p>
                    <Link href="/profile" className="invite-primary-button">
                      View / edit profile
                    </Link>
                  </>
                ) : (
                  <>
                    <h2>Build your proof profile.</h2>
                    <p>
                      Complete your Weld profile so studios can evaluate role, proof, rate, and fit before outreach.
                    </p>
                    <div className="invite-profile-builder">
                      <ProfileBuilder initialPhase="identity" embedded />
                    </div>
                  </>
                )}
              </article>
            ) : (
              <article className="invite-card invite-profile-card">
                <StatusPill>Account</StatusPill>
                <h2>Create your account when ready.</h2>
                <p>
                  Your invite code carries into account signup. You can still copy and share this invite without signing in.
                </p>
                <div className="invite-card-actions">
                  <Link
                    href={`/accountsignup?invite=${inviteCode}&email=${encodeURIComponent(snapshot.lead.email)}`}
                    className="invite-primary-button"
                  >
                    Create account
                  </Link>
                  <Link
                    href={`/login?invite=${inviteCode}&email=${encodeURIComponent(snapshot.lead.email)}`}
                    className="invite-secondary-button"
                  >
                    Log in
                  </Link>
                </div>
              </article>
            )}
          </section>

          <section ref={shareRef} className="invite-share-card">
            <div className="invite-share-main">
              <StatusPill>Share invite</StatusPill>
              <h2>Choose the channel. Copy the right thing.</h2>
              <p>{copy.shareCopy}</p>

              <div className="invite-share-tabs" role="tablist" aria-label="Share channels">
                {SHARE_CHANNELS.map((channel) => (
                  <button
                    key={channel.key}
                    type="button"
                    onClick={() => void handleShare(channel.key)}
                    className={shareChannel === channel.key ? "is-active" : ""}
                    aria-selected={shareChannel === channel.key}
                    role="tab"
                  >
                    <span>{channel.label}</span>
                  </button>
                ))}
              </div>

              <div className="invite-share-preview">
                <div>
                  <span>{activeShare.label}</span>
                  <strong>{activeShare.helper}</strong>
                </div>
                <textarea readOnly value={selectedShareText} />
              </div>

              <div className="invite-share-actions">
                <button
                  type="button"
                  onClick={() => void handleShare(shareChannel)}
                  className="invite-primary-button"
                >
                  {shareChannel === "copy" ? "Copy invite link" : `Copy ${activeShare.label} copy`}
                </button>
                {shareChannel === "x" && snapshot.sharePresets.x && (
                  <button
                    type="button"
                    onClick={() => {
                      const intent = new URL("https://twitter.com/intent/tweet");
                      intent.searchParams.set("text", snapshot.sharePresets.x);
                      window.open(intent.toString(), "_blank", "noopener,noreferrer");
                    }}
                    className="invite-secondary-button"
                  >
                    Post on X
                  </button>
                )}
              </div>

              {shareStatus ? (
                <p className={`invite-share-status ${shareError ? "is-error" : ""}`} aria-live="polite">
                  {shareStatus}
                </p>
              ) : null}
            </div>

            <aside className="invite-direct-panel">
              <span>Direct invite</span>
              <strong>{inviteCode}</strong>
              <input readOnly value={inviteUrl} aria-label="Direct invite link" />
              <button type="button" onClick={() => void handleShare("copy")} className="invite-primary-button">
                Copy link
              </button>
              <p>
                People must use this invite for the referral count to update. Sharing copy does not create new tracking.
              </p>
            </aside>
          </section>

          <footer className="invite-footer">
            Invite active for <strong>{snapshot.lead.email}</strong>. Return here any time to copy your link, share again, or finish your profile.
          </footer>
        </div>
      </main>
    </div>
  );
}

function StatusPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="invite-status-pill">
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
    case "instagram": return "Instagram";
    case "snapchat": return "Snapchat";
    default: return "Invite link";
  }
}
