"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

type SignupType = "developer" | "studio";
type SubmitState = "idle" | "submitting" | "success" | "error";

const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbwyxAWzgt8KTCm3fT3KXmGCSnZ8UTYpiXcPm9Eq0P4rkfiiBmIGLQQ-D8mtEFmo4iCd6A/exec";

const developerSkills = [
  "Scripting",
  "UI Design",
  "Building",
  "VFX",
  "3D Modeling",
  "Animation",
  "SFX",
  "Sound Design",
  "Game Design"
];

const studioRoles = [
  "Scripter",
  "UI Designer",
  "Builder",
  "VFX Artist",
  "3D Modeler",
  "Animator",
  "SFX Artist",
  "Sound Designer",
  "Game Designer"
];

function normalizeType(value: string | null): SignupType {
  return value === "studio" ? "studio" : "developer";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupLoading />}>
      <SignupContent />
    </Suspense>
  );
}

function SignupLoading() {
  return (
    <main className="signup-page-shell">
      <section className="signup-card signup-card-success">
        <Link href="/" className="signup-brand" aria-label="Back to weld home">
          <Image src="/Assets/weld-logo-official.svg" alt="" width={30} height={30} />
          <span>weld.</span>
        </Link>
        <span className="signup-badge">Waitlist</span>
        <h1>Loading signup.</h1>
      </section>
    </main>
  );
}

function buildStudioProfilePayload(form: FormData, email: string, selected: string[], inviteCode: string) {
  return {
    stage: "profile",
    refCode: inviteCode,
    email,
    type: "studio",
    studioName: String(form.get("studioName") ?? "").trim(),
    teamSize: String(form.get("teamSize") ?? ""),
    hiringRoles: selected,
    budgetStyle: String(form.get("budget") ?? ""),
    projectNote: String(form.get("projectDesc") ?? "").trim(),
    portfolioLink: String(form.get("studioWebsite") ?? "").trim(),
  };
}

function buildDeveloperProfilePayload(form: FormData, email: string, selected: string[], inviteCode: string) {
  return {
    stage: "profile",
    refCode: inviteCode,
    email,
    type: "developer",
    displayName: String(form.get("displayName") ?? "").trim(),
    portfolioLink: String(form.get("portfolio") ?? "").trim(),
    skills: selected,
    primaryRole: selected[0] ?? "",
    experience: String(form.get("experience") ?? ""),
  };
}

function SignupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const signupType = normalizeType(searchParams.get("type"));
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [selected, setSelected] = useState<string[]>([]);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [returningInviteUrl, setReturningInviteUrl] = useState<string | null>(null);
  const [allowOverride, setAllowOverride] = useState(false);
  const [referralCode, setReferralCode] = useState(searchParams.get("ref") ?? "");

  useEffect(() => {
    if (submitState === "success" && inviteUrl) {
      const timer = window.setTimeout(() => router.push(inviteUrl), 2200);
      return () => window.clearTimeout(timer);
    }
  }, [submitState, inviteUrl, router]);

  useEffect(() => {
    if (!referralCode) {
      try {
        const stored = localStorage.getItem("weld_referral_code");
        if (stored) setReferralCode(stored);
      } catch {}
    }
  }, [referralCode]);

  const copy = useMemo(() => {
    if (signupType === "studio") {
      return {
        badge: "Studio Waitlist",
        title: "Reserve your Weld access.",
        subhead:
          "Email is all we need. Studio details are optional and help us tune early hiring access.",
        submit: "Join the studio waitlist",
        successTitle: "You're on the Weld studio waitlist.",
        successBody:
          "Your invite is being prepared. Optional details, if provided, help shape early access."
      };
    }

    return {
      badge: "Developer Waitlist",
      title: "Join with email. Add proof when ready.",
      subhead:
        "Only your email is required. Skills, experience, portfolio, and referral details can be skipped for now.",
      submit: "Join the developer waitlist",
      successTitle: "You're on the Weld developer waitlist.",
      successBody:
        "Your invite is being prepared. Optional details, if provided, help studios understand your signal sooner."
    };
  }, [signupType]);

  function toggleSelection(value: string) {
    setSelected((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const normalizedEmail = email.trim();

    if (!isValidEmail(normalizedEmail)) {
      setSubmitState("error");
      setMessage("Add a valid email address.");
      return;
    }

    const payload =
      signupType === "studio"
        ? buildStudioPayload(form, normalizedEmail, selected)
        : buildDeveloperPayload(form, normalizedEmail, selected);

    setSubmitState("submitting");
    setMessage("");

    if (!allowOverride) {
      try {
        const checkRes = await fetch(`/api/waitlist/check?email=${encodeURIComponent(normalizedEmail)}`);
        const checkData = await checkRes.json() as { exists: boolean; inviteUrl?: string };
        if (checkData.exists && checkData.inviteUrl) {
          setReturningInviteUrl(checkData.inviteUrl);
          setSubmitState("idle");
          return;
        }
      } catch {
        // proceed with submission if check fails
      }
    }

    try {
      await fetch(SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      // Get invite code from Weld backend (non-blocking if it fails)
      try {
        const res = await fetch("/api/waitlist/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: normalizedEmail,
            audience: signupType,
            source: "signup-form",
            referredByInviteCode: referralCode.trim().toUpperCase() || undefined
          })
        });
        const data = (await res.json()) as { ok: boolean; inviteUrl?: string; inviteCode?: string };
        if (data.ok && data.inviteUrl) {
          setInviteUrl(data.inviteUrl);

          // Save profile fields to profile_drafts (fire-and-forget)
          if (data.inviteCode) {
            const profilePayload = signupType === "studio"
              ? buildStudioProfilePayload(form, normalizedEmail, selected, data.inviteCode)
              : buildDeveloperProfilePayload(form, normalizedEmail, selected, data.inviteCode);
            fetch("/api/waitlist", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(profilePayload)
            }).catch(() => { /* non-critical */ });
          }
        }
      } catch {
        // non-critical
      }

      setSubmitState("success");
      setMessage("");
    } catch {
      setSubmitState("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (returningInviteUrl) {
    return (
      <ReturningOverlay
        inviteUrl={returningInviteUrl}
        onOverride={() => {
          setReturningInviteUrl(null);
          setAllowOverride(true);
        }}
      />
    );
  }

  if (submitState === "success") {
    return (
      <main className="signup-page-shell">
        <section className="signup-card signup-card-success">
          <Link href="/" className="signup-brand" aria-label="Back to weld home">
            <Image src="/Assets/weld-logo-official.svg" alt="" width={30} height={30} />
            <span>weld.</span>
          </Link>
          <span className="signup-badge">{copy.badge}</span>
          <div className="signup-success-mark" aria-hidden="true">
            <span />
          </div>
          <h1>{copy.successTitle}</h1>
          <p>{copy.successBody}</p>
          <div className="signup-success-steps" aria-label="What happens next">
            <div>
              <strong>Invite page</strong>
              <span>Your beta dashboard opens next.</span>
            </div>
            <div>
              <strong>Share link</strong>
              <span>Copy your invite or use channel-ready copy.</span>
            </div>
            <div>
              <strong>Profile later</strong>
              <span>Finish optional proof when you have time.</span>
            </div>
          </div>
          {inviteUrl ? (
            <>
              <div className="signup-redirect-track" aria-hidden="true">
                <span />
              </div>
              <p className="signup-redirect-hint">Taking you to your invite page...</p>
              <Link href={inviteUrl} className="signup-secondary-link">
                Continue to invite page
              </Link>
            </>
          ) : (
            <Link href="/" className="signup-secondary-link">
              Back to landing page
            </Link>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="signup-page-shell">
      <section className="signup-card">
        <header className="signup-card-header">
          <Link href="/" className="signup-brand" aria-label="Back to weld home">
            <Image src="/Assets/weld-logo-official.svg" alt="" width={30} height={30} />
            <span>weld.</span>
          </Link>
          <Link href={signupType === "studio" ? "/" : "/studios"} className="signup-switch-link">
            {signupType === "studio" ? "I'm a developer" : "I'm a studio"}
          </Link>
        </header>

        <span className="signup-badge">{copy.badge}</span>
        <h1>{copy.title}</h1>
        <p className="signup-subhead">{copy.subhead}</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-flow-meter" aria-hidden="true">
            <span className="is-active">Email</span>
            <span>Optional profile</span>
            <span>Invite</span>
          </div>

          <label className="signup-field">
            <span>Email address <strong>required</strong></span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          {signupType === "developer" ? (
            <>
              <div className="signup-optional-panel">
                <div>
                  <span>Optional profile details</span>
                  <p>Add signal now, or skip and finish later from your invite page.</p>
                </div>
              </div>
              <label className="signup-field">
                <span>Display name <em>optional</em></span>
                <input
                  name="displayName"
                  type="text"
                  placeholder="How studios will see you"
                />
              </label>
              <label className="signup-field">
                <span>Years of Roblox experience <em>optional</em></span>
                <select name="experience" defaultValue="">
                  <option value="">Skip for now</option>
                  <option value="<1">Less than 1 year</option>
                  <option value="1-2">1-2 years</option>
                  <option value="3-4">3-4 years</option>
                  <option value="5+">5+ years</option>
                </select>
              </label>
              <SignupTags
                label="Primary skills optional"
                hint="Select any that help describe your work, or leave blank."
                options={developerSkills}
                selected={selected}
                onToggle={toggleSelection}
              />
              <label className="signup-field">
                <span>Portfolio link <em>optional</em></span>
                <input
                  name="portfolio"
                  type="url"
                  placeholder="https://your-portfolio.com"
                />
              </label>
            </>
          ) : (
            <>
              <div className="signup-optional-panel">
                <div>
                  <span>Optional studio details</span>
                  <p>Add context now, or skip and finish after your invite is active.</p>
                </div>
              </div>
              <label className="signup-field">
                <span>Studio name <em>optional</em></span>
                <input
                  name="studioName"
                  type="text"
                  placeholder="Your studio or team name"
                />
              </label>
              <label className="signup-field">
                <span>Team size <em>optional</em></span>
                <select name="teamSize" defaultValue="">
                  <option value="">Skip for now</option>
                  <option value="1-3">1-3 people</option>
                  <option value="4-8">4-8 people</option>
                  <option value="9-15">9-15 people</option>
                  <option value="16-30">16-30 people</option>
                  <option value="30+">30+ people</option>
                </select>
              </label>
              <SignupTags
                label="Roles you're hiring for optional"
                hint="Select any likely roles, or leave blank."
                options={studioRoles}
                selected={selected}
                onToggle={toggleSelection}
              />
              <label className="signup-field">
                <span>Budget type <em>optional</em></span>
                <select name="budget" defaultValue="">
                  <option value="">Skip for now</option>
                  <option value="USD">USD</option>
                  <option value="Robux">Robux</option>
                  <option value="Revenue Share">Revenue share</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </label>
              <label className="signup-field">
                <span>Portfolio or studio website <em>optional</em></span>
                <input
                  name="studioWebsite"
                  type="url"
                  placeholder="https://your-studio.com"
                />
              </label>
              <label className="signup-field">
                <span>Project description <em>optional</em></span>
                <textarea
                  name="projectDesc"
                  placeholder="Briefly describe what you're building and what kind of help you need."
                />
              </label>
            </>
          )}

          <label className="signup-field">
            <span>Referral code <em>optional</em></span>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="e.g. WLDA9F02A"
              autoComplete="off"
              spellCheck={false}
            />
          </label>

          <button
            type="submit"
            className="signup-submit"
            disabled={submitState === "submitting"}
          >
            {submitState === "submitting" ? "Submitting..." : copy.submit}
          </button>

          <button
            type="submit"
            className="signup-skip-submit"
            disabled={submitState === "submitting"}
          >
            Skip optional details and join
          </button>

          {message ? (
            <p className="signup-message" role="status">
              {message}
            </p>
          ) : null}

          <p className="signup-secondary-link signup-find-invite">
            Already signed up?{" "}
            <Link href="/find-invite" className="underline underline-offset-2">
              Find your invite
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

function buildStudioPayload(form: FormData, email: string, selected: string[]) {
  const studioWebsite = String(form.get("studioWebsite") ?? "").trim();

  return {
    type: "studio" as const,
    email,
    studioName: String(form.get("studioName") ?? "").trim(),
    teamSize: String(form.get("teamSize") ?? ""),
    hiringRoles: selected.join(", "),
    budget: String(form.get("budget") ?? ""),
    studioWebsite,
    studioWebiste: studioWebsite,
    studioLink: studioWebsite,
    website: studioWebsite,
    portfolio: studioWebsite,
    projectDesc: String(form.get("projectDesc") ?? "").trim(),
    source: "next-landing",
    submittedAt: new Date().toISOString()
  };
}

function buildDeveloperPayload(form: FormData, email: string, selected: string[]) {
  return {
    type: "developer" as const,
    email,
    name: String(form.get("displayName") ?? "").trim(),
    experience: String(form.get("experience") ?? ""),
    skills: selected.join(", "),
    portfolio: String(form.get("portfolio") ?? "").trim(),
    source: "next-landing",
    submittedAt: new Date().toISOString()
  };
}

function ReturningOverlay({ inviteUrl, onOverride }: { inviteUrl: string; onOverride: () => void }) {
  const router = useRouter();
  return (
    <div className="returning-modal-overlay">
      <div className="returning-modal-card">
        <div className="returning-modal-icon">OK</div>
        <h2 className="returning-modal-title">You're already on the list.</h2>
        <p className="returning-modal-body">Your Weld invite is waiting for you.</p>
        <div className="returning-modal-actions">
          <button
            type="button"
            className="returning-modal-primary"
            onClick={() => router.push(inviteUrl)}
          >
            Go to my invite page
          </button>
          <button
            type="button"
            className="returning-modal-secondary"
            onClick={onOverride}
          >
            Update my submission
          </button>
        </div>
      </div>
    </div>
  );
}

function SignupTags({
  label,
  hint,
  options,
  selected,
  onToggle
}: {
  label: string;
  hint: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset className="signup-tags-field">
      <legend>{label}</legend>
      <p>{hint}</p>
      <div className="signup-tags">
        {options.map((option) => {
          const isSelected = selected.includes(option);

          return (
            <button
              key={option}
              type="button"
              className={`signup-tag ${isSelected ? "is-selected" : ""}`}
              aria-pressed={isSelected}
              onClick={() => onToggle(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
