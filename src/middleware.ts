import { type NextRequest, NextResponse } from "next/server";

const ALLOWLIST = [
  "qeji13@gmail.com",
  "joeljeon7@gmail.com",
  "joeljeon25@gmail.com",
  "22hjeonj@gmail.com", // stored lowercase for case-insensitive compare
];

const BLOCKED_PREFIXES = [
  "/home",
  "/swipe",
  "/profile",
  "/account",
  "/messages",
  "/preview",
];

function isBlockedRoute(pathname: string): boolean {
  return BLOCKED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getEmailFromCookies(request: NextRequest): string | null {
  // Supabase v2 stores session as JSON in sb-<ref>-auth-token cookie
  // It may be split into chunks: sb-<ref>-auth-token.0, .1, etc.
  const ref = "zcezjycnzmfciuxomaie";
  const baseName = `sb-${ref}-auth-token`;

  let rawSession: string | null = null;

  // Try chunked format first
  const chunk0 = request.cookies.get(`${baseName}.0`)?.value;
  if (chunk0) {
    const chunk1 = request.cookies.get(`${baseName}.1`)?.value ?? "";
    rawSession = chunk0 + chunk1;
  } else {
    rawSession = request.cookies.get(baseName)?.value ?? null;
  }

  if (!rawSession) return null;

  try {
    const decoded = decodeURIComponent(rawSession);
    const session = JSON.parse(decoded) as { access_token?: string };
    if (!session.access_token) return null;
    const payload = decodeJwtPayload(session.access_token);
    const email = payload?.email;
    return typeof email === "string" ? email.toLowerCase() : null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isBlockedRoute(pathname)) {
    return NextResponse.next();
  }

  const email = getEmailFromCookies(request);

  if (email && ALLOWLIST.includes(email)) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/";
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|Assets|public|api).*)",
  ],
};
