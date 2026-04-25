import { randomUUID } from "crypto";
import { readFile, writeFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";

import { createEmptyDraft } from "@/dynamic landing page/lib/utils";
import type {
  AnalyticsEventRecord,
  Audience,
  ProfileDraftRecord,
  ReferralEventRecord,
  WaitlistLeadRecord
} from "@/dynamic landing page/lib/types";

const STORE_PATH = join(tmpdir(), "weld-public-funnel-store.json");

export interface LocalStoreShape {
  waitlistLeads: WaitlistLeadRecord[];
  referralEvents: ReferralEventRecord[];
  profileDrafts: ProfileDraftRecord[];
  analyticsEvents: AnalyticsEventRecord[];
}

const EMPTY_STORE: LocalStoreShape = {
  waitlistLeads: [],
  referralEvents: [],
  profileDrafts: [],
  analyticsEvents: []
};

let writeQueue = Promise.resolve();

export async function readLocalStore(): Promise<LocalStoreShape> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<LocalStoreShape>;

    return {
      waitlistLeads: parsed.waitlistLeads ?? [],
      referralEvents: parsed.referralEvents ?? [],
      profileDrafts: parsed.profileDrafts ?? [],
      analyticsEvents: parsed.analyticsEvents ?? []
    };
  } catch {
    return EMPTY_STORE;
  }
}

export async function writeLocalStore(store: LocalStoreShape) {
  writeQueue = writeQueue.then(() =>
    writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8")
  );

  await writeQueue;
}

export function createLocalDraft(leadId: string, inviteCode: string, audience: Audience) {
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    leadId,
    inviteCode,
    audience,
    currentStep: "identity" as const,
    completionPercent: 0,
    skipped: false,
    draft: createEmptyDraft(),
    createdAt: now,
    updatedAt: now
  };
}
