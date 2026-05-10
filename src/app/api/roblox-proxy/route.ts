import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 5

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
  }

  const url = `https://thumbnails.roblox.com/${path}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 300 }
    });
    const data = await response.json();

    return NextResponse.json(data, {
      status: response.ok ? 200 : response.status,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch from Roblox API" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
}
