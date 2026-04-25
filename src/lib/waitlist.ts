const DEFAULT_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwyxAWzgt8KTCm3fT3KXmGCSnZ8UTYpiXcPm9Eq0P4rkfiiBmIGLQQ-D8mtEFmo4iCd6A/exec";

type WaitlistStage = "capture" | "profile" | "event";

type WaitlistPayload = Record<string, unknown> & {
  stage?: string;
  email?: string;
  type?: string;
  refCode?: string;
  waitlistId?: string;
  eventName?: string;
  referredBy?: string;
  source?: string;
  src?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

type WaitlistRequestOptions = {
  body: WaitlistPayload;
  headers?: Headers;
  origin?: string;
  env?: NodeJS.ProcessEnv;
};

type WaitlistResponseBody = {
  ok: boolean;
  message: string;
  waitlistId?: string;
  refCode?: string;
  shareUrl?: string;
  detail?: string;
};

function normalizeType(value: unknown) {
  return value === "studio" ? "studio" : "developer";
}

function isValidEmail(value: unknown) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? "").trim());
}

function hashString(input: string) {
  let hash = 5381;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 33) ^ input.charCodeAt(index);
  }

  return hash >>> 0;
}

function buildRefCode(email: string) {
  const seed = hashString(email.trim().toLowerCase() || String(Date.now()));
  return `WLD${seed.toString(36).toUpperCase().padStart(6, "0").slice(0, 6)}`;
}

function buildWaitlistId(email: string, type: string) {
  const seed = hashString(email || type || String(Date.now()));
  return `wl_${type.slice(0, 3)}_${seed.toString(36).padStart(7, "0").slice(0, 7)}`;
}

function normalizeOrigin(headers: Headers | undefined, fallbackOrigin: string | undefined) {
  if (fallbackOrigin) {
    return fallbackOrigin.replace(/\/$/, "");
  }

  const host = headers?.get("x-forwarded-host") ?? headers?.get("host");
  const proto = headers?.get("x-forwarded-proto") ?? "https";

  if (!host) {
    return "https://weldroblox.com";
  }

  return `${proto}://${host}`;
}

async function forwardToScript(payload: Record<string, unknown>, scriptUrl: string) {
  const response = await fetch(scriptUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Storage request failed with status ${response.status}`);
  }

  return response.text();
}

export async function handleWaitlistRequest(
  options: WaitlistRequestOptions
): Promise<{ status: number; body: WaitlistResponseBody }> {
  const payload = options.body;
  const stage = String(payload.stage ?? "").trim().toLowerCase() as WaitlistStage;
  const validStages = new Set<WaitlistStage>(["capture", "profile", "event"]);

  if (!validStages.has(stage)) {
    return {
      status: 400,
      body: { ok: false, message: "Unsupported waitlist stage." }
    };
  }

  const type = normalizeType(payload.type);
  const email = String(payload.email ?? "").trim().toLowerCase();
  const refCode = String(payload.refCode ?? (email ? buildRefCode(email) : "")).trim();
  const waitlistId = String(
    payload.waitlistId ??
      (email ? buildWaitlistId(email, type) : `evt_${Date.now().toString(36)}`)
  );
  const origin = normalizeOrigin(options.headers, options.origin);
  const shareUrl = refCode ? `${origin}/?ref=${encodeURIComponent(refCode)}` : "";

  if ((stage === "capture" || stage === "profile") && !isValidEmail(email)) {
    return {
      status: 400,
      body: { ok: false, message: "A valid email address is required." }
    };
  }

  if (stage === "event" && !String(payload.eventName ?? "").trim()) {
    return {
      status: 400,
      body: { ok: false, message: "An event name is required." }
    };
  }

  const record = {
    stage,
    type,
    email,
    waitlistId,
    refCode,
    shareUrl,
    referredBy: String(payload.referredBy ?? "").trim(),
    source: String(payload.source ?? "").trim(),
    src: String(payload.src ?? "").trim(),
    eventName: String(payload.eventName ?? "").trim(),
    utmSource: String(payload.utmSource ?? "").trim(),
    utmMedium: String(payload.utmMedium ?? "").trim(),
    utmCampaign: String(payload.utmCampaign ?? "").trim(),
    payload,
    createdAt: new Date().toISOString()
  };

  try {
    await forwardToScript(
      record,
      options.env?.GOOGLE_APPS_SCRIPT_URL || DEFAULT_SCRIPT_URL
    );
  } catch (error) {
    return {
      status: 502,
      body: {
        ok: false,
        message: "Could not save your spot right now. Please try again.",
        detail: error instanceof Error ? error.message : "Unknown upstream error."
      }
    };
  }

  return {
    status: 200,
    body: {
      ok: true,
      waitlistId,
      refCode,
      shareUrl,
      message:
        stage === "profile"
          ? "Profile details saved."
          : stage === "event"
            ? "Event recorded."
            : "Spot saved."
    }
  };
}
