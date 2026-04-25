import { NextRequest, NextResponse } from "next/server";

import { recordAnalyticsEvent } from "@/dynamic landing page/lib/service";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body || !body.eventName) {
    return NextResponse.json({ ok: false, message: "eventName is required." }, { status: 400 });
  }

  try {
    await recordAnalyticsEvent({
      eventName: String(body.eventName),
      sessionId: String(body.sessionId ?? ""),
      inviteCode: String(body.inviteCode ?? ""),
      page: String(body.page ?? ""),
      audience: String(body.audience ?? ""),
      payload:
        typeof body.payload === "object" && body.payload
          ? (body.payload as Record<string, unknown>)
          : {},
      utm:
        typeof body.utm === "object" && body.utm
          ? (body.utm as Record<string, string>)
          : undefined
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Could not record event."
      },
      { status: 400 }
    );
  }
}
