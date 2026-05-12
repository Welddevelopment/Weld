import type {
  DraftStepKey,
  RewardTierDefinition,
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

export const REWARD_TIERS: RewardTierDefinition[] = [
  {
    threshold: 0,
    slug: "invite-active",
    label: "Invite active",
    description: "Your invite is live. Share it or finish your profile to unlock more signal."
  },
  {
    threshold: 1,
    slug: "scout-signal",
    label: "Scout signal",
    description: "One referred signup boosts your invite status and keeps your link warm."
  },
  {
    threshold: 3,
    slug: "studio-scout",
    label: "Studio scout",
    description: "Three referred signups unlock a stronger beta review signal."
  },
  {
    threshold: 5,
    slug: "founder-lane",
    label: "Founder lane",
    description: "Five referred signups unlock the highest public beta reward tier."
  }
];
