import { NextRequest, NextResponse } from "next/server";

import { recordInviteShare } from "@/dynamic-landing-page/lib/service";

export const maxDuration = 10

export async function POST(
  request: NextRequest,
  { params }: { params: { inviteCode: string } }
) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body) {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  try {
    const result = await recordInviteShare({
      inviteCode: params.inviteCode,
      channel: String(body.channel ?? "copy") as "discord" | "x" | "linkedin" | "copy",
      sessionId: String(body.sessionId ?? ""),
      page: String(body.page ?? "invite"),
      origin: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || request.nextUrl.origin
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Could not prepare share copy."
      },
      { status: 400 }
    );
  }
}
