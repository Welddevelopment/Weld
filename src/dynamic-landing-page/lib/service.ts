import { randomUUID } from "crypto";

import {
  createLocalDraft,
  readLocalStore,
  writeLocalStore
} from "@/dynamic-landing-page/lib/local-store";
import { getSupabaseAdmin } from "@/dynamic-landing-page/lib/supabase";
import type {
  AnalyticsEventRecord,
  CaptureSignupInput,
  DraftStepFields,
  EventInput,
  InviteProgressSnapshot,
  ProfileDraftRecord,
  SaveDraftInput,
  ShareInviteInput,
  UTMFields,
  WaitlistLeadRecord
} from "@/dynamic-landing-page/lib/types";
import {
  buildInviteCode,
  buildShareCopy,
  buildShareUrl,
  calculateCompletionPercent,
  createEmptyDraft,
  getCurrentStep,
  isValidEmail,
  mergeUtmFields,
  normalizeAudience,
  normalizeEmail
} from "@/dynamic-landing-page/lib/utils";

function mapLeadRecord(record: Record<string, unknown> | null) {
  if (!record) return null;

  return {
    id: String(record.id),
    email: normalizeEmail(record.email),
    audience: normalizeAudience(record.audience),
    inviteCode: String(record.invite_code ?? record.inviteCode),
    referredByLeadId: record.referred_by_lead_id
      ? String(record.referred_by_lead_id)
      : null,
    source: String(record.source ?? ""),
    status: String(record.status ?? "invite_active"),
    rewardTier: String(record.reward_tier ?? record.rewardTier ?? "invite-active"),
    shareUrl: String(record.share_url ?? record.shareUrl ?? ""),
    utmSource: String(record.utm_source ?? record.utmSource ?? ""),
    utmMedium: String(record.utm_medium ?? record.utmMedium ?? ""),
    utmCampaign: String(record.utm_campaign ?? record.utmCampaign ?? ""),
    utmContent: String(record.utm_content ?? record.utmContent ?? ""),
    utmTerm: String(record.utm_term ?? record.utmTerm ?? ""),
    createdAt: String(record.created_at ?? record.createdAt ?? new Date().toISOString()),
    updatedAt: String(record.updated_at ?? record.updatedAt ?? new Date().toISOString())
  };
}

function mapDraftRecord(record: Record<string, unknown> | null) {
  if (!record) return null;

  return {
    id: String(record.id),
    leadId: String(record.lead_id ?? record.leadId),
    inviteCode: String(record.invite_code ?? record.inviteCode),
    audience: normalizeAudience(record.audience),
    currentStep: String(record.current_step ?? record.currentStep ?? "identity") as
      | "identity"
      | "proof"
      | "fit",
    completionPercent: Number(record.completion_percent ?? record.completionPercent ?? 0),
    skipped: Boolean(record.skipped ?? false),
    draft: (record.draft as ProfileDraftRecord["draft"]) ?? createEmptyDraft(),
    createdAt: String(record.created_at ?? record.createdAt ?? new Date().toISOString()),
    updatedAt: String(record.updated_at ?? record.updatedAt ?? new Date().toISOString())
  };
}

async function findLeadByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase
      .from("waitlist_leads")
      .select("*")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (error) throw error;
    return mapLeadRecord(data);
  }

  const store = await readLocalStore();
  return store.waitlistLeads.find((lead) => lead.email === normalizedEmail) ?? null;
}

async function findLeadByInviteCode(inviteCode: string) {
  const normalizedCode = String(inviteCode ?? "").trim().toUpperCase();
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase
      .from("waitlist_leads")
      .select("*")
      .eq("invite_code", normalizedCode)
      .maybeSingle();

    if (error) throw error;
    return mapLeadRecord(data);
  }

  const store = await readLocalStore();
  return store.waitlistLeads.find((lead) => lead.inviteCode === normalizedCode) ?? null;
}

async function upsertLeadRecord(lead: WaitlistLeadRecord) {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { error } = await supabase.from("waitlist_leads").upsert(
      {
        id: lead.id,
        email: lead.email,
        audience: lead.audience,
        invite_code: lead.inviteCode,
        referred_by_lead_id: lead.referredByLeadId,
        source: lead.source,
        status: lead.status,
        reward_tier: lead.rewardTier,
        share_url: lead.shareUrl,
        utm_source: lead.utmSource,
        utm_medium: lead.utmMedium,
        utm_campaign: lead.utmCampaign,
        utm_content: lead.utmContent,
        utm_term: lead.utmTerm,
        created_at: lead.createdAt,
        updated_at: lead.updatedAt
      },
      { onConflict: "email" }
    );

    if (error) throw error;
    return lead;
  }

  const store = await readLocalStore();
  const existingIndex = store.waitlistLeads.findIndex((entry) => entry.email === lead.email);

  if (existingIndex >= 0) {
    store.waitlistLeads[existingIndex] = lead;
  } else {
    store.waitlistLeads.push(lead);
  }

  await writeLocalStore(store);
  return lead;
}

async function getProfileDraftByLeadId(leadId: string) {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase
      .from("profile_drafts")
      .select("*")
      .eq("lead_id", leadId)
      .maybeSingle();

    if (error) throw error;
    return mapDraftRecord(data);
  }

  const store = await readLocalStore();
  return store.profileDrafts.find((draft) => draft.leadId === leadId) ?? null;
}

async function upsertProfileDraftRecord(draft: ProfileDraftRecord) {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { error } = await supabase.from("profile_drafts").upsert(
      {
        id: draft.id,
        lead_id: draft.leadId,
        invite_code: draft.inviteCode,
        audience: draft.audience,
        current_step: draft.currentStep,
        completion_percent: draft.completionPercent,
        skipped: draft.skipped,
        draft: draft.draft,
        created_at: draft.createdAt,
        updated_at: draft.updatedAt
      },
      { onConflict: "lead_id" }
    );

    if (error) throw error;
    return draft;
  }

  const store = await readLocalStore();
  const existingIndex = store.profileDrafts.findIndex((entry) => entry.leadId === draft.leadId);

  if (existingIndex >= 0) {
    store.profileDrafts[existingIndex] = draft;
  } else {
    store.profileDrafts.push(draft);
  }

  await writeLocalStore(store);
  return draft;
}

async function countReferredSignups(referrerLeadId: string) {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { count, error } = await supabase
      .from("referral_events")
      .select("id", { count: "exact", head: true })
      .eq("referrer_lead_id", referrerLeadId)
      .eq("event_type", "referred_signup");

    if (error) throw error;
    return count ?? 0;
  }

  const store = await readLocalStore();
  return store.referralEvents.filter(
    (event) =>
      event.referrerLeadId === referrerLeadId && event.eventType === "referred_signup"
  ).length;
}

async function insertReferralEvent(event: {
  referrerLeadId: string | null;
  refereeLeadId: string | null;
  inviteCode: string;
  channel: string;
  eventType: string;
  metadata?: Record<string, unknown>;
}) {
  const record = {
    id: randomUUID(),
    referrerLeadId: event.referrerLeadId,
    refereeLeadId: event.refereeLeadId,
    inviteCode: event.inviteCode,
    channel: event.channel,
    eventType: event.eventType,
    metadata: event.metadata ?? {},
    createdAt: new Date().toISOString()
  };
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { error } = await supabase.from("referral_events").insert({
      id: record.id,
      referrer_lead_id: record.referrerLeadId,
      referee_lead_id: record.refereeLeadId,
      invite_code: record.inviteCode,
      channel: record.channel,
      event_type: record.eventType,
      metadata: record.metadata,
      created_at: record.createdAt
    });

    if (error && !String(error.message).includes("duplicate key")) {
      throw error;
    }

    return record;
  }

  const store = await readLocalStore();
  const alreadyRecorded = store.referralEvents.some(
    (existing) =>
      existing.referrerLeadId === record.referrerLeadId &&
      existing.refereeLeadId === record.refereeLeadId &&
      existing.eventType === record.eventType
  );

  if (!alreadyRecorded) {
    store.referralEvents.push(record);
    await writeLocalStore(store);
  }

  return record;
}

export async function recordAnalyticsEvent(input: EventInput & { leadId?: string | null }) {
  const payload = input.payload ?? {};
  const utm = mergeUtmFields(input.utm);
  const record: AnalyticsEventRecord = {
    id: randomUUID(),
    sessionId: String(input.sessionId ?? ""),
    leadId: input.leadId ?? null,
    inviteCode: String(input.inviteCode ?? ""),
    page: String(input.page ?? ""),
    audience: String(input.audience ?? ""),
    eventName: input.eventName,
    payload,
    createdAt: new Date().toISOString(),
    ...utm
  };

  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { error } = await supabase.from("analytics_events").insert({
      id: record.id,
      session_id: record.sessionId,
      lead_id: record.leadId,
      invite_code: record.inviteCode,
      page: record.page,
      audience: record.audience,
      event_name: record.eventName,
      utm_source: record.utmSource,
      utm_medium: record.utmMedium,
      utm_campaign: record.utmCampaign,
      utm_content: record.utmContent,
      utm_term: record.utmTerm,
      payload: record.payload,
      created_at: record.createdAt
    });

    if (error) throw error;
    return record;
  }

  const store = await readLocalStore();
  store.analyticsEvents.push(record);
  await writeLocalStore(store);
  return record;
}

function ensureDraftRecord(lead: WaitlistLeadRecord, existingDraft: ProfileDraftRecord | null) {
  if (existingDraft) {
    return existingDraft;
  }

  return createLocalDraft(lead.id, lead.inviteCode, lead.audience);
}

export async function checkWaitlistEmail(email: string): Promise<{
  exists: boolean;
  inviteUrl?: string;
  inviteCode?: string;
}> {
  if (!isValidEmail(email)) return { exists: false };
  const lead = await findLeadByEmail(normalizeEmail(email));
  if (!lead) return { exists: false };
  return { exists: true, inviteUrl: `/invite/${lead.inviteCode}`, inviteCode: lead.inviteCode };
}

export async function captureWaitlistSignup(input: CaptureSignupInput) {
  if (!isValidEmail(input.email)) {
    throw new Error("A valid email address is required.");
  }

  const now = new Date().toISOString();
  const email = normalizeEmail(input.email);
  const audience = normalizeAudience(input.audience);
  const utm = mergeUtmFields(input.utm);
  const existingLead = await findLeadByEmail(email);
  const referrerLead = input.referredByInviteCode
    ? await findLeadByInviteCode(input.referredByInviteCode)
    : null;
  const inviteCode = existingLead?.inviteCode ?? buildInviteCode(email);

  const lead: WaitlistLeadRecord = {
    id: existingLead?.id ?? randomUUID(),
    email,
    audience,
    inviteCode,
    referredByLeadId:
      referrerLead && referrerLead.email !== email
        ? referrerLead.id
        : existingLead?.referredByLeadId ?? null,
    source: input.source,
    status: "invite_active",
    rewardTier: existingLead?.rewardTier ?? "invite-active",
    shareUrl: buildShareUrl(inviteCode, input.origin),
    createdAt: existingLead?.createdAt ?? now,
    updatedAt: now,
    ...utm
  };

  await upsertLeadRecord(lead);

  const existingDraft = await getProfileDraftByLeadId(lead.id);
  const draft = ensureDraftRecord(lead, existingDraft);
  await upsertProfileDraftRecord(draft);

  if (!existingLead && referrerLead && referrerLead.id !== lead.id) {
    await insertReferralEvent({
      referrerLeadId: referrerLead.id,
      refereeLeadId: lead.id,
      inviteCode: referrerLead.inviteCode,
      channel: "invite",
      eventType: "referred_signup",
      metadata: { referredEmail: lead.email }
    });
  }

  await recordAnalyticsEvent({
    eventName: "signup_success",
    sessionId: input.sessionId,
    inviteCode: lead.inviteCode,
    leadId: lead.id,
    page: input.page ?? "landing",
    audience: lead.audience,
    utm,
    payload: {
      source: input.source,
      variant: input.variant ?? "",
      referredByInviteCode: input.referredByInviteCode ?? ""
    }
  });

  return buildInviteProgressSnapshot(lead.inviteCode);
}

export async function buildInviteProgressSnapshot(inviteCode: string): Promise<InviteProgressSnapshot> {
  const lead = await findLeadByInviteCode(inviteCode);

  if (!lead) {
    throw new Error("Invite not found.");
  }

  const existingDraft = await getProfileDraftByLeadId(lead.id);
  const draft = ensureDraftRecord(lead, existingDraft);
  const referralCount = await countReferredSignups(lead.id);
  const completionPercent = draft.completionPercent;
  const shareUrl = buildShareUrl(lead.inviteCode);

  if (!existingDraft) {
    await upsertProfileDraftRecord(draft);
  }

  return {
    lead: { ...lead, shareUrl },
    draft: {
      ...draft,
      completionPercent
    },
    referralCount,
    sharePresets: {
      discord: buildShareCopy({ audience: lead.audience, channel: "discord", shareUrl }),
      x: buildShareCopy({ audience: lead.audience, channel: "x", shareUrl }),
      linkedin: buildShareCopy({ audience: lead.audience, channel: "linkedin", shareUrl }),
      instagram: buildShareCopy({ audience: lead.audience, channel: "instagram", shareUrl }),
      snapchat: buildShareCopy({ audience: lead.audience, channel: "snapchat", shareUrl }),
      copy: buildShareCopy({ audience: lead.audience, channel: "copy", shareUrl })
    }
  };
}

export async function saveProfileDraft(input: SaveDraftInput) {
  const snapshot = await buildInviteProgressSnapshot(input.inviteCode);
  const previous = snapshot.draft;
  const nextDraft = {
    ...previous,
    draft: {
      ...previous.draft,
      [input.step]: {
        ...previous.draft[input.step],
        ...input.payload
      }
    },
    skipped: false,
    updatedAt: new Date().toISOString()
  };

  nextDraft.completionPercent = calculateCompletionPercent(
    nextDraft.audience,
    nextDraft.draft
  );
  nextDraft.currentStep = getCurrentStep(nextDraft.audience, nextDraft.draft);

  await upsertProfileDraftRecord(nextDraft);

  if (previous.completionPercent === 0 && nextDraft.completionPercent > 0) {
    await recordAnalyticsEvent({
      eventName: "profile_completion_started",
      sessionId: input.sessionId,
      inviteCode: snapshot.lead.inviteCode,
      leadId: snapshot.lead.id,
      page: "invite",
      audience: snapshot.lead.audience,
      payload: { step: input.step }
    });
  }

  await recordAnalyticsEvent({
    eventName: "profile_step_completed",
    sessionId: input.sessionId,
    inviteCode: snapshot.lead.inviteCode,
    leadId: snapshot.lead.id,
    page: "invite",
    audience: snapshot.lead.audience,
    payload: {
      step: input.step,
      completionPercent: nextDraft.completionPercent
    }
  });

  if (previous.completionPercent < 100 && nextDraft.completionPercent >= 100) {
    await recordAnalyticsEvent({
      eventName: "profile_completed",
      sessionId: input.sessionId,
      inviteCode: snapshot.lead.inviteCode,
      leadId: snapshot.lead.id,
      page: "invite",
      audience: snapshot.lead.audience,
      payload: {
        completionPercent: nextDraft.completionPercent
      }
    });
  }

  return buildInviteProgressSnapshot(input.inviteCode);
}

export async function applyLegacyProfilePayload(
  inviteCode: string,
  payload: Record<string, unknown>,
  sessionId?: string
) {
  const snapshot = await buildInviteProgressSnapshot(inviteCode);
  let identityPatch: DraftStepFields;
  let proofPatch: DraftStepFields;
  let fitPatch: DraftStepFields;

  if (snapshot.lead.audience === "studio") {
    identityPatch = {
      studioName: String(payload.studioName ?? "")
    };
    proofPatch = {
      rolesHiring: Array.isArray(payload.hiringRoles) ? payload.hiringRoles : [],
      teamSize: String(payload.teamSize ?? "")
    };
    fitPatch = {
      budgetStyle: String(payload.budgetStyle ?? ""),
      shippingNote: String(payload.projectNote ?? "")
    };
  } else {
    identityPatch = {
      displayName: String(payload.displayName ?? ""),
      primaryRole: Array.isArray(payload.skills)
        ? String(payload.skills[0] ?? "")
        : String(payload.primaryRole ?? "")
    };
    proofPatch = {
      proofLink: String(payload.portfolioLink ?? ""),
      skills: Array.isArray(payload.skills) ? payload.skills : [],
      experience: String(payload.experience ?? "")
    };
    fitPatch = {
      availability: String(payload.availability ?? ""),
      rateStyle: String(payload.rateStyle ?? "")
    };
  }

  await saveProfileDraft({
    inviteCode,
    step: "identity",
    payload: identityPatch,
    sessionId
  });
  await saveProfileDraft({
    inviteCode,
    step: "proof",
    payload: proofPatch,
    sessionId
  });
  await saveProfileDraft({
    inviteCode,
    step: "fit",
    payload: fitPatch,
    sessionId
  });

  if (payload.skipped === true) {
    const nextSnapshot = await buildInviteProgressSnapshot(inviteCode);
    await upsertProfileDraftRecord({
      ...nextSnapshot.draft,
      skipped: true,
      updatedAt: new Date().toISOString()
    });
  }

  return buildInviteProgressSnapshot(inviteCode);
}

export async function recordInviteShare(input: ShareInviteInput) {
  const snapshot = await buildInviteProgressSnapshot(input.inviteCode);
  const copy = snapshot.sharePresets[input.channel];

  await insertReferralEvent({
    referrerLeadId: snapshot.lead.id,
    refereeLeadId: null,
    inviteCode: snapshot.lead.inviteCode,
    channel: input.channel,
    eventType: "share_dispatched",
    metadata: {
      page: input.page ?? "invite"
    }
  });

  await recordAnalyticsEvent({
    eventName: "referral_share",
    sessionId: input.sessionId,
    inviteCode: snapshot.lead.inviteCode,
    leadId: snapshot.lead.id,
    page: input.page ?? "invite",
    audience: snapshot.lead.audience,
    payload: {
      channel: input.channel
    },
    utm: {
      utmSource: snapshot.lead.utmSource,
      utmMedium: snapshot.lead.utmMedium,
      utmCampaign: snapshot.lead.utmCampaign,
      utmContent: snapshot.lead.utmContent,
      utmTerm: snapshot.lead.utmTerm
    }
  });

  return {
    ok: true,
    shareUrl: snapshot.lead.shareUrl,
    copy
  };
}

export async function resolveLegacySignup(
  params: Record<string, string | string[] | undefined>
) {
  const rawEmail = Array.isArray(params.email) ? params.email[0] : params.email;
  const rawType = Array.isArray(params.type) ? params.type[0] : params.type;
  const rawRef = Array.isArray(params.ref) ? params.ref[0] : params.ref;
  const rawSrc = Array.isArray(params.src) ? params.src[0] : params.src;
  const rawInviteCode = Array.isArray(params.refCode) ? params.refCode[0] : params.refCode;

  if (rawInviteCode) {
    const existing = await findLeadByInviteCode(rawInviteCode);
    if (existing) {
      return existing.inviteCode;
    }
  }

  if (!rawEmail || !isValidEmail(rawEmail)) {
    return null;
  }

  const snapshot = await captureWaitlistSignup({
    email: rawEmail,
    audience: normalizeAudience(rawType),
    source: rawSrc || "legacy-signup",
    referredByInviteCode: rawRef || undefined
  });

  return snapshot.lead.inviteCode;
}

export async function handleLegacyWaitlistRequest(
  body: Record<string, unknown>,
  origin?: string
) {
  const stage = String(body.stage ?? "").trim().toLowerCase();

  if (stage === "capture") {
    const snapshot = await captureWaitlistSignup({
      email: String(body.email ?? ""),
      audience: normalizeAudience(body.type),
      source: String(body.source ?? body.src ?? "legacy-capture"),
      referredByInviteCode: String(body.referredBy ?? ""),
      origin,
      utm: {
        utmSource: String(body.utmSource ?? ""),
        utmMedium: String(body.utmMedium ?? ""),
        utmCampaign: String(body.utmCampaign ?? ""),
        utmContent: String(body.utmContent ?? ""),
        utmTerm: String(body.utmTerm ?? "")
      }
    });

    return {
      ok: true,
      waitlistId: snapshot.lead.id,
      refCode: snapshot.lead.inviteCode,
      shareUrl: snapshot.lead.shareUrl,
      message: "Spot saved."
    };
  }

  if (stage === "profile") {
    const email = String(body.email ?? "");
    const inviteCode =
      String(body.refCode ?? "") ||
      (await resolveLegacySignup({
        email,
        type: String(body.type ?? "developer"),
        ref: String(body.referredBy ?? ""),
        src: String(body.source ?? "legacy-profile")
      }));

    if (!inviteCode) {
      throw new Error("A valid email address is required.");
    }

    await applyLegacyProfilePayload(inviteCode, body);

    return {
      ok: true,
      waitlistId: inviteCode,
      refCode: inviteCode,
      shareUrl: buildShareUrl(inviteCode, origin),
      message: "Profile details saved."
    };
  }

  if (stage === "event") {
    const inviteCode = String(body.refCode ?? "");
    const lead = inviteCode ? await findLeadByInviteCode(inviteCode) : null;
    const utm: Partial<UTMFields> = {
      utmSource: String(body.utmSource ?? lead?.utmSource ?? ""),
      utmMedium: String(body.utmMedium ?? lead?.utmMedium ?? ""),
      utmCampaign: String(body.utmCampaign ?? lead?.utmCampaign ?? ""),
      utmContent: String(body.utmContent ?? lead?.utmContent ?? ""),
      utmTerm: String(body.utmTerm ?? lead?.utmTerm ?? "")
    };

    await recordAnalyticsEvent({
      eventName: String(body.eventName ?? "legacy_event"),
      inviteCode,
      leadId: lead?.id ?? null,
      page: String(body.page ?? "legacy"),
      audience: String(body.type ?? lead?.audience ?? ""),
      utm,
      payload: body
    });

    return {
      ok: true,
      message: "Event recorded."
    };
  }

  throw new Error("Unsupported waitlist stage.");
}
