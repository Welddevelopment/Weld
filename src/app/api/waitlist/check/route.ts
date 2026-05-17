import { NextRequest, NextResponse } from "next/server";

import { checkWaitlistEmail } from "@/dynamic-landing-page/lib/service";

export const maxDuration = 10;

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email") ?? "";
  try {
    const result = await checkWaitlistEmail(email);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[waitlist/check] error:", err);
    return NextResponse.json({ exists: false, error: "lookup_failed" });
  }
}
