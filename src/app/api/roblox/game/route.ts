import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 10;

function parsePlaceId(url: string): string | null {
  const match = url.match(/roblox\.com\/games\/(\d+)/);
  if (match) return match[1];
  if (/^\d+$/.test(url.trim())) return url.trim();
  return null;
}

function formatCount(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url") ?? "";
  const placeId = parsePlaceId(url);

  if (!placeId) {
    return NextResponse.json({ ok: false, message: "Invalid Roblox game URL." }, { status: 400 });
  }

  try {
    // 1. Resolve universeId from placeId
    const univRes = await fetch(
      `https://apis.roblox.com/universes/v1/places/${placeId}/universe`,
      { next: { revalidate: 300 } }
    );
    if (!univRes.ok) throw new Error("Could not resolve game.");
    const univJson = await univRes.json() as { universeId?: number };
    const universeId = univJson.universeId;
    if (!universeId) throw new Error("Game not found.");

    // 2. Fetch game details + thumbnail in parallel
    const [gameRes, thumbRes] = await Promise.all([
      fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`, { next: { revalidate: 300 } }),
      fetch(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png&isCircular=false`, { next: { revalidate: 3600 } }),
    ]);

    const gameJson = await gameRes.json() as { data?: Array<{ name?: string; visits?: number; playing?: number; genre?: string }> };
    const thumbJson = await thumbRes.json() as { data?: Array<{ imageUrl?: string }> };

    const game = gameJson.data?.[0];
    if (!game) throw new Error("Game data unavailable.");

    return NextResponse.json({
      ok: true,
      title: game.name ?? "",
      plays: game.visits != null ? formatCount(game.visits) : "",
      currentCcu: game.playing != null ? formatCount(game.playing) : "",
      genre: game.genre ?? "",
      imageUrl: thumbJson.data?.[0]?.imageUrl ?? "",
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to fetch game." },
      { status: 502 }
    );
  }
}
