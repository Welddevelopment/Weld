import type {
  DraftStepKey,
  UTMFields
} from "@/dynamic-landing-page/lib/types";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const EMPTY_UTM_FIELDS: UTMFields = {
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmContent: "",
  utmTerm: ""
};

export const STORAGE_KEYS = {
  sessionId: "weld_session_id",
  referralCode: "weld_referral_code",
  attribution: "weld_attribution",
  audience: "weld_audience_preference"
} as const;

export const PROFILE_STEP_ORDER: DraftStepKey[] = ["identity", "proof", "fit"];

export const DEVELOPER_REQUIRED_FIELDS: Record<DraftStepKey, string[]> = {
  identity: ["displayName", "primaryRole"],
  proof: ["proofLink"],
  fit: ["availability", "rateStyle"]
};

export const STUDIO_REQUIRED_FIELDS: Record<DraftStepKey, string[]> = {
  identity: ["studioName"],
  proof: ["rolesHiring", "teamSize"],
  fit: ["budgetStyle", "shippingNote"]
};

