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

  useEffect(() => {
    if (submitState === "success" && inviteUrl) {
      const timer = window.setTimeout(() => router.push(inviteUrl), 1800);
      return () => window.clearTimeout(timer);
    }
  }, [submitState, inviteUrl, router]);

  const copy = useMemo(() => {
    if (signupType === "studio") {
      return {
        badge: "Studio Waitlist",
        title: "Tell us what you need.",
        subhead:
          "Share a little about your studio so weld. can connect you with the right Roblox developers at launch.",
        submit: "Complete studio signup",
        successTitle: "Studio signup saved.",
        successBody: "You're on the waitlist. We'll use this to shape early hiring access."
      };
    }

    return {
      badge: "Developer Waitlist",
      title: "Tell us what you make.",
      subhead:
        "Share a little about your Roblox work so weld. can match you with the right studios at launch.",
      submit: "Complete developer signup",
      successTitle: "Developer signup saved.",
      successBody: "You're on the waitlist. We'll use this to shape early developer access."
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

    if (selected.length === 0) {
      setSubmitState("error");
      setMessage(
        signupType === "studio"
          ? "Select at least one role you're hiring for."
          : "Select at least one primary skill."
      );
      return;
    }

    const payload =
      signupType === "studio"
        ? buildStudioPayload(form, normalizedEmail, selected)
        : buildDeveloperPayload(form, normalizedEmail, selected);

    if (payload.type === "studio" && (!payload.studioName || !payload.teamSize || !payload.budget)) {
      setSubmitState("error");
      setMessage("Complete the required studio fields.");
      return;
    }

    if (payload.type === "developer" && (!payload.name || !payload.experience)) {
      setSubmitState("error");
      setMessage("Complete the required developer fields.");
      return;
    }

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
          body: JSON.stringify({ email: normalizedEmail, audience: signupType, source: "signup-form" })
        });
        const data = (await res.json()) as { ok: boolean; inviteUrl?: string };
        if (data.ok && data.inviteUrl) {
          setInviteUrl(data.inviteUrl);
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
          <h1>{copy.successTitle}</h1>
          <p>{copy.successBody}</p>
          {inviteUrl ? (
            <p className="signup-redirect-hint">Taking you to your invite page…</p>
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
          <label className="signup-field">
            <span>Email address</span>
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
              <label className="signup-field">
                <span>Display name</span>
                <input
                  name="displayName"
                  type="text"
                  placeholder="How studios will see you"
                  required
                />
              </label>
              <label className="signup-field">
                <span>Years of Roblox experience</span>
                <select name="experience" required defaultValue="">
                  <option value="" disabled>
                    Select experience level
                  </option>
                  <option value="<1">Less than 1 year</option>
                  <option value="1-2">1-2 years</option>
                  <option value="3-4">3-4 years</option>
                  <option value="5+">5+ years</option>
                </select>
              </label>
              <SignupTags
                label="Primary skills"
                hint="Select all that apply"
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
              <label className="signup-field">
                <span>Studio name</span>
                <input
                  name="studioName"
                  type="text"
                  placeholder="Your studio or team name"
                  required
                />
              </label>
              <label className="signup-field">
                <span>Team size</span>
                <select name="teamSize" required defaultValue="">
                  <option value="" disabled>
                    How big is your team?
                  </option>
                  <option value="1-3">1-3 people</option>
                  <option value="4-8">4-8 people</option>
                  <option value="9-15">9-15 people</option>
                  <option value="16-30">16-30 people</option>
                  <option value="30+">30+ people</option>
                </select>
              </label>
              <SignupTags
                label="Roles you're hiring for"
                hint="Select all that apply"
                options={studioRoles}
                selected={selected}
                onToggle={toggleSelection}
              />
              <label className="signup-field">
                <span>Budget type</span>
                <select name="budget" required defaultValue="">
                  <option value="" disabled>
                    How do you pay?
                  </option>
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

          <button
            type="submit"
            className="signup-submit"
            disabled={submitState === "submitting"}
          >
            {submitState === "submitting" ? "Submitting..." : copy.submit}
          </button>

          {message ? (
            <p className="signup-message" role="status">
              {message}
            </p>
          ) : null}
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
        <div className="returning-modal-icon">✓</div>
        <h2 className="returning-modal-title">You&rsquo;re already on the list.</h2>
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
