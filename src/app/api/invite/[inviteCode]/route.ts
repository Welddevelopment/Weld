import { NextRequest, NextResponse } from "next/server";

import { buildInviteProgressSnapshot } from "@/dynamic-landing-page/lib/service";

export const maxDuration = 10

export async function GET(
  _request: NextRequest,
  { params }: { params: { inviteCode: string } }
) {
  try {
    const snapshot = await buildInviteProgressSnapshot(params.inviteCode);

    return NextResponse.json({
      ok: true,
      lead: snapshot.lead,
      draft: snapshot.draft,
      referralCount: snapshot.referralCount,
      sharePresets: snapshot.sharePresets
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Invite not found."
      },
      { status: 404 }
    );
  }
}
