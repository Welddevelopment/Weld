import { createHash, randomUUID } from "crypto";

import {
  DEVELOPER_REQUIRED_FIELDS,
  EMPTY_UTM_FIELDS,
  PROFILE_STEP_ORDER,
  SITE_URL,
  STUDIO_REQUIRED_FIELDS
} from "@/dynamic-landing-page/lib/constants";
import type {
  Audience,
  DraftFieldValue,
  ProfileDraftShape,
  ShareChannel,
  UTMFields
} from "@/dynamic-landing-page/lib/types";

export function normalizeAudience(value: unknown): Audience {
  return value === "studio" ? "studio" : "developer";
}

export function normalizeEmail(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

export function isValidEmail(value: unknown) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value));
}

export function buildInviteCode(email: string) {
  const normalized = normalizeEmail(email) || randomUUID();
  const hash = createHash("sha1").update(normalized).digest("hex").toUpperCase();
  return `WLD${hash.slice(0, 6)}`;
}

export function buildShareUrl(inviteCode: string, origin = SITE_URL) {
  return `${origin.replace(/\/$/, "")}/?ref=${encodeURIComponent(inviteCode)}`;
}

export function mergeUtmFields(utm?: Partial<UTMFields>): UTMFields {
  return {
    utmSource: String(utm?.utmSource ?? EMPTY_UTM_FIELDS.utmSource),
    utmMedium: String(utm?.utmMedium ?? EMPTY_UTM_FIELDS.utmMedium),
    utmCampaign: String(utm?.utmCampaign ?? EMPTY_UTM_FIELDS.utmCampaign),
    utmContent: String(utm?.utmContent ?? EMPTY_UTM_FIELDS.utmContent),
    utmTerm: String(utm?.utmTerm ?? EMPTY_UTM_FIELDS.utmTerm)
  };
}

export function isFilledDraftValue(value: DraftFieldValue | undefined) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "number") {
    return !Number.isNaN(value);
  }

  if (typeof value === "boolean") {
    return value;
  }

  return String(value ?? "").trim().length > 0;
}

export function createEmptyDraft(): ProfileDraftShape {
  return {
    identity: {},
    proof: {},
    fit: {}
  };
}

export function calculateCompletionPercent(audience: Audience, draft: ProfileDraftShape) {
  const requiredFields =
    audience === "studio" ? STUDIO_REQUIRED_FIELDS : DEVELOPER_REQUIRED_FIELDS;
  const total = PROFILE_STEP_ORDER.reduce(
    (sum, step) => sum + requiredFields[step].length,
    0
  );
  const filled = PROFILE_STEP_ORDER.reduce((sum, step) => {
    const stepFields = draft[step];
    return (
      sum +
      requiredFields[step].filter((fieldName) => isFilledDraftValue(stepFields[fieldName])).length
    );
  }, 0);

  return Math.round((filled / total) * 100);
}

export function getCurrentStep(audience: Audience, draft: ProfileDraftShape) {
  const requiredFields =
    audience === "studio" ? STUDIO_REQUIRED_FIELDS : DEVELOPER_REQUIRED_FIELDS;

  return (
    PROFILE_STEP_ORDER.find((step) =>
      requiredFields[step].some((fieldName) => !isFilledDraftValue(draft[step][fieldName]))
    ) ?? "fit"
  );
}

export function buildShareCopy(input: {
  audience: Audience;
  channel: ShareChannel;
  shareUrl: string;
}) {
  const developerBase =
    "Weld is building a better way for Roblox talent to get found without digging through Discord threads.";
  const studioBase =
    "Weld is building a better way to screen Roblox talent by proof, rate, and availability instead of Discord chaos.";

  const base = input.audience === "studio" ? studioBase : developerBase;

  switch (input.channel) {
    case "discord":
      return `${base} Join the beta here: ${input.shareUrl}`;
    case "x":
      return `${base} I just claimed my invite. ${input.shareUrl}`;
    case "linkedin":
      return `${base} I joined the beta and thought this was worth sharing: ${input.shareUrl}`;
    case "copy":
    default:
      return input.shareUrl;
  }
}
