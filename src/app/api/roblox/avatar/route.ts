import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 5;

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId || !/^\d+$/.test(userId)) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`,
      { next: { revalidate: 3600 } }
    );
    const json = await res.json() as { data?: Array<{ imageUrl?: string }> };
    const imageUrl = json?.data?.[0]?.imageUrl;

    if (!imageUrl) {
      return new NextResponse(null, { status: 404 });
    }

    return NextResponse.redirect(imageUrl, 302);
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
