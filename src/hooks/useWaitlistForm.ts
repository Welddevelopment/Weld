"use client";

import { useState } from "react";
import { useOptionalAudience } from "@/context/AudienceContext";
import type { Audience } from "@/lib/audience";

function readStored(key: string): string {
  try { return window.localStorage.getItem(key) || ""; } catch { return ""; }
}

function writeStored(key: string, value: string) {
  try { if (value) window.localStorage.setItem(key, value); } catch { /* ignore */ }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

function getReferrerCode(): string {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  return params.get("ref") || readStored("weld_referrer");
}

function getUtmPayload() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    utmSource: p.get("utm_source") || "",
    utmMedium: p.get("utm_medium") || "",
    utmCampaign: p.get("utm_campaign") || ""
  };
}

async function postWaitlist(payload: Record<string, unknown>) {
  const res = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  let data: Record<string, unknown> = {};
  try { data = (await res.json()) as Record<string, unknown>; } catch { /* ignore */ }
  if (!res.ok || !data.ok) {
    throw new Error(String(data.message || "Could not save your spot right now. Please try again."));
  }
  return data;
}

function trackWaitlistEvent(eventName: string, extra?: Record<string, unknown>) {
  const payload = {
    stage: "event",
    eventName,
    email: readStored("weld_waitlist_email"),
    type: readStored("weld_waitlist_type") || "developer",
    refCode: readStored("weld_ref_code"),
    referredBy: getReferrerCode(),
    ...getUtmPayload(),
    ...extra
  };
  return fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true
  }).catch(() => null);
}

export type FeedbackState = "" | "success" | "error";

export function useWaitlistForm(overrideAudience?: Audience) {
  const ctx = useOptionalAudience();
  const audience = overrideAudience ?? ctx?.audience ?? "developer";

  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackState, setFeedbackState] = useState<FeedbackState>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (source: string) => {
    if (!isValidEmail(email)) {
      void trackWaitlistEvent(
        source === "hero" ? "hero_invalid_submit" : "waitlist_invalid_submit",
        { email, type: audience, source }
      );
      setFeedback("Enter a valid email address so we can save your spot.");
      setFeedbackState("error");
      return;
    }

    setIsSubmitting(true);
    setFeedback("");
    setFeedbackState("");

    const referredBy = getReferrerCode();
    const capturePayload = {
      stage: "capture",
      email: email.trim().toLowerCase(),
      type: audience,
      source,
      referredBy,
      refCode: readStored("weld_ref_code"),
      ...getUtmPayload()
    };

    void trackWaitlistEvent(
      audience === "developer" ? "hero_cta_click" : "studio_cta_click",
      { email, type: audience, source }
    );

    try {
      const data = await postWaitlist(capturePayload);
      writeStored("weld_waitlist_email", email.trim().toLowerCase());
      writeStored("weld_waitlist_type", audience);
      writeStored("weld_ref_code", String(data.refCode || ""));
      if (referredBy) writeStored("weld_referrer", referredBy);

      await trackWaitlistEvent("waitlist_capture_success", {
        email,
        type: audience,
        source,
        refCode: data.refCode,
        waitlistId: data.waitlistId
      });

      setFeedback("Spot saved. Taking you to your invite screen...");
      setFeedbackState("success");

      const nextUrl = new URL("/signup", window.location.origin);
      nextUrl.searchParams.set("email", email.trim().toLowerCase());
      nextUrl.searchParams.set("type", audience);
      nextUrl.searchParams.set("refCode", String(data.refCode || ""));
      nextUrl.searchParams.set("src", source);
      if (referredBy) nextUrl.searchParams.set("ref", referredBy);

      setTimeout(() => { window.location.assign(nextUrl.toString()); }, 240);
    } catch (err) {
      setFeedback(
        err instanceof Error ? err.message : "Could not save your spot right now. Please try again."
      );
      setFeedbackState("error");
      setIsSubmitting(false);
    }
  };

  return { email, setEmail, feedback, feedbackState, isSubmitting, handleSubmit };
}

export { trackWaitlistEvent, readStored, writeStored, getReferrerCode, getUtmPayload };
