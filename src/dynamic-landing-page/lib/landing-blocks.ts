/** Single source of truth for waitlist tally (update when numbers change). */
export const LANDING_TALLY = {
  developers: 71,
  studios: 41,
} as const;

export const LANDING_ACTIVITY_FEED = [
  { who: "NovaNui", action: "shipped HUD refresh", ago: "2m ago" },
  { who: "Zenith Games", action: "hiring lead scripter", ago: "4m ago" },
  { who: "lexocraft", action: "updated availability", ago: "8m ago" },
  { who: "Eclipse Studios", action: "posted combat role", ago: "12m ago" },
  { who: "FluxVFX", action: "added new reel", ago: "18m ago" },
  { who: "Cascade Labs", action: "closed UI contract", ago: "24m ago" },
] as const;

export const LANDING_QUOTE = {
  text: "Roblox shipped $923M in developer payouts last year. The hiring layer should match that bar.",
  attribution: "weld. product thesis",
} as const;

export const LANDING_DAY_ONE_TILES = [
  {
    title: "Proof card builder",
    body: "Shipped work, scope, and links in one scannable surface.",
    icon: "shield" as const,
  },
  {
    title: "Instant match",
    body: "Fit signals sit beside rate and availability before the first DM.",
    icon: "spark" as const,
  },
  {
    title: "Scope chip",
    body: "Studios see role, pay band, and expectations without chasing.",
    icon: "code" as const,
  },
  {
    title: "Encrypted intro",
    body: "Professional thread with context — not a cold ping.",
    icon: "user" as const,
  },
] as const;
