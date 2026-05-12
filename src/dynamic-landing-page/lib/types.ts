export type Audience = "developer" | "studio";
export type DraftStepKey = "identity" | "proof" | "fit";
export type ShareChannel = "discord" | "x" | "linkedin" | "instagram" | "snapchat" | "copy";

export interface UTMFields {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
}

export interface WaitlistLeadRecord extends UTMFields {
  id: string;
  email: string;
  audience: Audience;
  inviteCode: string;
  referredByLeadId: string | null;
  source: string;
  status: string;
  rewardTier: string;
  shareUrl: string;
  createdAt: string;
  updatedAt: string;
}

export type DraftFieldValue =
  | string
  | number
  | boolean
  | null
  | string[]
  | number[];

export type DraftStepFields = Record<string, DraftFieldValue>;

export interface ProfileDraftShape {
  identity: DraftStepFields;
  proof: DraftStepFields;
  fit: DraftStepFields;
}

export interface ProfileDraftRecord {
  id: string;
  leadId: string;
  inviteCode: string;
  audience: Audience;
  currentStep: DraftStepKey;
  completionPercent: number;
  skipped: boolean;
  draft: ProfileDraftShape;
  createdAt: string;
  updatedAt: string;
}

export interface ReferralEventRecord {
  id: string;
  referrerLeadId: string | null;
  refereeLeadId: string | null;
  inviteCode: string;
  channel: string;
  eventType: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface AnalyticsEventRecord extends UTMFields {
  id: string;
  sessionId: string;
  leadId: string | null;
  inviteCode: string;
  page: string;
  audience: string;
  eventName: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface InviteProgressSnapshot {
  lead: WaitlistLeadRecord;
  draft: ProfileDraftRecord;
  referralCount: number;
  sharePresets: Record<ShareChannel, string>;
}

export interface CaptureSignupInput {
  email: string;
  audience: Audience;
  source: string;
  referredByInviteCode?: string | null;
  sessionId?: string;
  page?: string;
  variant?: string;
  origin?: string;
  utm?: Partial<UTMFields>;
}

export interface ShareInviteInput {
  inviteCode: string;
  channel: ShareChannel;
  sessionId?: string;
  page?: string;
}

export interface SaveDraftInput {
  inviteCode: string;
  step: DraftStepKey;
  payload: DraftStepFields;
  sessionId?: string;
}

export interface EventInput {
  eventName: string;
  sessionId?: string;
  inviteCode?: string;
  page?: string;
  audience?: string;
  payload?: Record<string, unknown>;
  utm?: Partial<UTMFields>;
}
