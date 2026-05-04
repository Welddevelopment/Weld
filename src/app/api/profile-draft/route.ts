import { NextRequest, NextResponse } from "next/server";

import { saveProfileDraft } from "@/dynamic-landing-page/lib/service";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body) {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  try {
    const snapshot = await saveProfileDraft({
      inviteCode: String(body.inviteCode ?? ""),
      step: String(body.step ?? "identity") as "identity" | "proof" | "fit",
      payload:
        typeof body.payload === "object" && body.payload
          ? (body.payload as Record<string, string | string[] | number | boolean | null>)
          : {},
      sessionId: String(body.sessionId ?? "")
    });

    return NextResponse.json({
      ok: true,
      draft: snapshot.draft,
      referralCount: snapshot.referralCount,
      rewardTier: snapshot.rewardTier,
      nextReward: snapshot.nextReward,
      waveLabel: snapshot.waveLabel
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Could not save this draft step."
      },
      { status: 400 }
    );
  }
}
