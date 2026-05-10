"use client";

import { STORAGE_KEYS } from "@/dynamic-landing-page/lib/constants";
import type {
  Audience,
  EventInput,
  ShareChannel,
  UTMFields
} from "@/dynamic-landing-page/lib/types";

function emptyAttribution(): UTMFields {
  return {
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmContent: "",
    utmTerm: ""
  };
}

export function getSessionId() {
  if (typeof window === "undefined") {
    return "";
  }

  const existing = window.localStorage.getItem(STORAGE_KEYS.sessionId);
  if (existing) {
    return existing;
  }

  const sessionId = window.crypto.randomUUID();
  window.localStorage.setItem(STORAGE_KEYS.sessionId, sessionId);
  return sessionId;
}

export function captureAttributionFromLocation() {
  if (typeof window === "undefined") {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const attribution = {
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    utmContent: params.get("utm_content") || "",
    utmTerm: params.get("utm_term") || ""
  };
  const referralCode = params.get("ref") || "";

  if (referralCode) {
    window.localStorage.setItem(STORAGE_KEYS.referralCode, referralCode);
  }

  if (Object.values(attribution).some(Boolean)) {
    window.localStorage.setItem(STORAGE_KEYS.attribution, JSON.stringify(attribution));
  }
}

export function getStoredReferralCode() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(STORAGE_KEYS.referralCode) || "";
}

export function getStoredAttribution(): UTMFields {
  if (typeof window === "undefined") {
    return emptyAttribution();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.attribution);
    if (!raw) {
      return emptyAttribution();
    }

    return JSON.parse(raw) as UTMFields;
  } catch {
    return emptyAttribution();
  }
}

async function postJson<TResponse>(url: string, body: Record<string, unknown>) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = (await response.json().catch(() => null)) as TResponse | null;

  if (!response.ok || !data) {
    throw new Error("Request failed.");
  }

  return data;
}

export async function submitSignupCapture(input: {
  email: string;
  audience: Audience;
  source: string;
  page: string;
  variant?: string;
}) {
  return postJson<{
    ok: boolean;
    inviteCode: string;
    inviteUrl: string;
    shareUrl: string;
  }>("/api/waitlist/signup", {
    email: input.email,
    audience: input.audience,
    source: input.source,
    page: input.page,
    variant: input.variant ?? "",
    sessionId: getSessionId(),
    referredByInviteCode: getStoredReferralCode(),
    utm: getStoredAttribution()
  });
}

export async function trackEvent(event: EventInput) {
  try {
    await postJson<{ ok: boolean }>("/api/events", {
      ...event,
      sessionId: event.sessionId || getSessionId(),
      utm: event.utm || getStoredAttribution()
    });
  } catch {
    // Deliberately ignore analytics failures.
  }
}

export async function shareInvite(inviteCode: string, channel: ShareChannel) {
  return postJson<{ ok: boolean; shareUrl: string; copy: string }>(
    `/api/invite/${inviteCode}/share`,
    {
      channel,
      sessionId: getSessionId(),
      page: "invite"
    }
  );
}

export function persistAudiencePreference(audience: Audience) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.audience, audience);
}

export function readAudiencePreference() {
  if (typeof window === "undefined") {
    return "developer";
  }

  const stored = window.localStorage.getItem(STORAGE_KEYS.audience);
  return stored === "studio" ? "studio" : "developer";
}
