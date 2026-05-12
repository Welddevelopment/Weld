"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function FindInvitePage() {
  return (
    <Suspense fallback={<div className="signup-page-shell" />}>
      <FindInviteContent />
    </Suspense>
  );
}

function FindInviteContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "not-found">("idle");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const normalised = email.trim();
    if (!isValidEmail(normalised)) return;

    setState("loading");
    try {
      const res = await fetch(`/api/waitlist/check?email=${encodeURIComponent(normalised)}`);
      const data = await res.json() as { exists: boolean; inviteUrl?: string };
      if (data.exists && data.inviteUrl) {
        router.push(data.inviteUrl);
      } else {
        setState("not-found");
      }
    } catch {
      setState("not-found");
    }
  }

  return (
    <main className="signup-page-shell">
      <section className="signup-card">
        <header className="signup-card-header">
          <Link href="/" className="signup-brand" aria-label="Back to weld home">
            <Image src="/Assets/weld-logo-official.svg" alt="" width={30} height={30} />
            <span>weld.</span>
          </Link>
        </header>

        <span className="signup-badge">Find your invite</span>
        <h1>Get back to your invite page.</h1>
        <p className="signup-subhead">
          Enter the email you signed up with and we&rsquo;ll take you straight there.
        </p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label className="signup-field">
            <span>Email address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setState("idle"); }}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <button
            type="submit"
            className="signup-submit"
            disabled={state === "loading"}
          >
            {state === "loading" ? "Looking up…" : "Find my invite"}
          </button>

          {state === "not-found" && (
            <p className="signup-message" role="status">
              No invite found for that email.{" "}
              <Link href="/signup" className="underline underline-offset-2">
                Sign up for the waitlist
              </Link>
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
