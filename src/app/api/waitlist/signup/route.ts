import { NextRequest, NextResponse } from "next/server";

import { captureWaitlistSignup } from "@/dynamic-landing-page/lib/service";
import { normalizeAudience } from "@/dynamic-landing-page/lib/utils";

export const maxDuration = 10

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body) {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  try {
    const snapshot = await captureWaitlistSignup({
      email: String(body.email ?? ""),
      audience: normalizeAudience(body.audience),
      source: String(body.source ?? "landing"),
      page: String(body.page ?? "landing"),
      variant: String(body.variant ?? ""),
      origin: request.nextUrl.origin,
      sessionId: String(body.sessionId ?? ""),
      referredByInviteCode: String(body.referredByInviteCode ?? ""),
      utm:
        typeof body.utm === "object" && body.utm
          ? (body.utm as Record<string, string>)
          : undefined
    });

    return NextResponse.json({
      ok: true,
      inviteCode: snapshot.lead.inviteCode,
      inviteUrl: `/invite/${snapshot.lead.inviteCode}`,
      shareUrl: snapshot.lead.shareUrl
    });
  } catch (error) {
    console.error("[waitlist/signup] error:", JSON.stringify(error, null, 2), error)
    const message =
      error instanceof Error
        ? error.message
        : (error as { message?: string })?.message ?? "Could not save your invite right now."
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
