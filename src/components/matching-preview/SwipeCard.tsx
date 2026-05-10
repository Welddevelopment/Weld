"use client"

import { useEffect, useRef, useState } from "react"
import type { MarqueeProfile } from "@/data/marqueeProfiles"

type RightPanel = null | "work" | string

interface SkillCat {
  name: string
  description: string
  detail?: string
  works: number
  avgPrice: string
  priceType: "commission" | "hourly"
}

interface Skill {
  name: string
  description: string
  experienceMonths: number
  pastWorks: number
  resources?: Array<{ label: string; url: string }>
  categories?: SkillCat[]
}

const SKILLS: Skill[] = [
  {
    name: "Scripting",
    description:
      "Multi-year experience building game systems in Luau — DataStores, remote events, server-client architecture, and combat frameworks. Writes readable, documented code built to be maintained long-term.",
    experienceMonths: 48,
    pastWorks: 38,
    resources: [
      { label: "GitHub", url: "#" },
      { label: "Portfolio", url: "#" },
    ],
    categories: [
      {
        name: "Combat Frameworks",
        description:
          "Server-authoritative hitboxes, cooldowns, combo routing, weapon state, and replicated combat feedback.",
        detail:
          "I build combat frameworks with strict server validation, predictable client prediction, animation-safe state changes, and clean module boundaries. Typical delivery includes damage resolution, knockback, cooldowns, ability metadata, and debugging tools for designers.",
        works: 14,
        avgPrice: "$1.8K",
        priceType: "commission",
      },
      {
        name: "DataStore Systems",
        description:
          "Persistent player data, retry logic, backups, and ProfileService-style session locking.",
        detail:
          "I design persistent data schemas for XP, inventory, currency, settings, unlocks, cosmetics, and seasonal progression. Includes migrations, cache layers, session locking, retry handling, and admin inspection commands.",
        works: 11,
        avgPrice: "$95",
        priceType: "hourly",
      },
    ],
  },
  {
    name: "UI Design",
    description:
      "Designs reactive UI from Figma wireframes to finished Roblox builds. Smooth tweening, mobile-responsive layouts, and UX flows that eliminate friction at every screen.",
    experienceMonths: 36,
    pastWorks: 24,
    resources: [{ label: "UI reel", url: "#" }],
    categories: [
      {
        name: "HUD Systems",
        description:
          "Combat HUDs, inventory surfaces, ability bars, and responsive mobile-safe layouts.",
        detail:
          "I take a Figma file or loose gameplay spec and turn it into responsive Roblox UI with constraints, animations, button states, and readable component hierarchy.",
        works: 9,
        avgPrice: "$1.2K",
        priceType: "commission",
      },
    ],
  },
  {
    name: "VFX",
    description:
      "Creates visual effects for combat feedback, spells, portals, and environmental ambience while keeping performance under control.",
    experienceMonths: 30,
    pastWorks: 18,
    categories: [
      {
        name: "Ability Effects",
        description:
          "Particles, beams, trails, shockwaves, hit sparks, and readable timing for combat abilities.",
        detail:
          "Effects are tuned for readability first — players should know what happened, where it happened, and what state the fight is in without visual noise.",
        works: 12,
        avgPrice: "$850",
        priceType: "commission",
      },
    ],
  },
  {
    name: "DataStore",
    description:
      "Implements persistent player data — XP, inventory, currency, settings — with safe retry logic, backup pipelines, and clean API design.",
    experienceMonths: 42,
    pastWorks: 16,
    categories: [
      {
        name: "Progression Saves",
        description:
          "XP, level, battle pass, inventory, settings, currencies, and unlock history.",
        detail:
          "I build save systems with schema clarity and operational safety, including migrations and emergency recovery paths when a live game changes direction.",
        works: 16,
        avgPrice: "$110",
        priceType: "hourly",
      },
    ],
  },
]

// Wide 16:9 game screenshots — Blox Fruits, Brookhaven RP, Jailbreak
const TOP_GAMES = [
  {
    title: "Blox Fruits",
    desc: "Live co-op adventure with seasonal events, ability systems, and fast-paced combat interfaces.",
    plays: "18M",
    topCcu: "14K",
    currentCcu: "3.8K",
    thumbnailUrl: "https://tr.rbxcdn.com/180DAY-e1ce51abae5188805c3fee78ec7f4d08/768/432/Image/Png/noFilter",
    skills: ["Scripting", "DataStore"],
  },
  {
    title: "Brookhaven RP",
    desc: "Open-world roleplay with house ownership, vehicle systems, dynamic social spaces, and live events.",
    plays: "22M",
    topCcu: "18K",
    currentCcu: "4.1K",
    thumbnailUrl: "https://tr.rbxcdn.com/180DAY-1431ab1aa3fdc21c55a144b2616339fa/768/432/Image/Png/noFilter",
    skills: ["Scripting", "UI Design"],
  },
  {
    title: "Jailbreak",
    desc: "Cops-and-robbers open world with heists, pursuits, economy systems, and seasonal cosmetic drops.",
    plays: "11M",
    topCcu: "9K",
    currentCcu: "2.5K",
    thumbnailUrl: "https://tr.rbxcdn.com/180DAY-fef285ce1b8ac805b17da2a4f998ccec/768/432/Image/Png/noFilter",
    skills: ["Scripting", "VFX"],
  },
]

// Wide 16:9 game screenshots — Murder Mystery 2, Tower of Hell, Adopt Me!
const BEST_WORK = [
  {
    title: "Combat system & DataStore",
    desc: "Full server-client combat framework with hitboxes, knockback, persistent stats, and clean OOP Luau documented for handoff.",
    tools: "Luau, DataStore2, Roblox Studio",
    time: "2 weeks",
    amount: "$900",
    reach: "18M plays",
    thumbnailUrl: "https://tr.rbxcdn.com/180DAY-fe7335c3ad752e84323cd81ae38de69a/768/432/Image/Png/noFilter",
  },
  {
    title: "Multiplayer lobby system",
    desc: "Party and lobby flow with matchmaking, private servers, voting, queue status, and server-side validation throughout.",
    tools: "Luau, TeleportService, Roblox Studio",
    time: "3 weeks",
    amount: "$1,200",
    reach: "11M plays",
    thumbnailUrl: "https://tr.rbxcdn.com/180DAY-20a372111085c33de1e64004e4dca1d8/768/432/Image/Png/noFilter",
  },
  {
    title: "Ability FX integration",
    desc: "Synced ability VFX, hit sparks, cooldown events, and animation timing hooks for a fast combat prototype.",
    tools: "ParticleEmitter, TweenService, Luau",
    time: "4 weeks",
    amount: "$1,500",
    reach: "8M plays",
    thumbnailUrl: "https://tr.rbxcdn.com/180DAY-a688d1dffa1a69836e659d95e7c3e20c/768/432/Image/Png/noFilter",
  },
]

function fmtMonths(months: number) {
  if (months < 12) return `${months} mo`
  const y = months / 12
  return Number.isInteger(y) ? `${y} yrs` : `${Math.floor(y)}.5 yrs`
}

function skillColor(name: string) {
  const palette = ["#a78bfa", "#34d399", "#fb923c", "#60a5fa", "#f472b6", "#facc15"]
  let h = 0
  for (let i = 0; i < name.length; i++) h = ((h * 31 + name.charCodeAt(i)) >>> 0)
  return palette[h % palette.length]
}

function IconRoblox() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M5.24 0 0 18.75 18.76 24 24 5.25ZM15.1 15.17l-6.35-1.7 1.7-6.35 6.35 1.7Z" />
    </svg>
  )
}

function IconDiscord() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.8 19.8 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.11 13.11 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function IconExternal() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="10"
      height="10"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function IconBack() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="14"
      height="14"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

export default function SwipeCard({ profile }: { profile?: MarqueeProfile }) {
  const [leftOpen, setLeftOpen] = useState(false)
  const [rightPanel, setRightPanel] = useState<RightPanel>(null)
  const [catPopup, setCatPopup] = useState<{ skill: Skill; idx: number } | null>(null)
  const [swipeFlash, setSwipeFlash] = useState<"like" | "nope" | null>(null)
  const [flying, setFlying] = useState<"left" | "right" | null>(null)
  const [sparks, setSparks] = useState(0)
  const [toast, setToast] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(
    profile?.avatarUrl ?? "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-E3EC434BF92DD2F46E81D91592065FD9-Png/150/150/AvatarHeadshot/Png/noFilter"
  )

  const p = profile
  const displayName = p?.displayName ?? "DevDave"
  const initial = p?.initial ?? "DD"
  const avatarColor = p?.avatarColor ?? "#f5ede0"
  const verified = p?.verified ?? true
  const online = p?.online ?? true
  const bio = p?.bio ?? "I've been building Roblox games professionally for four years, shipping everything from solo indie projects to large-team live titles. My strength is owning full verticals — I can design the DataStore schema, write the server-client combat logic, wire up the UI, and layer VFX on top, all within a single project. I write clean, documented OOP Luau that the next developer on the team can actually maintain."
  const hourlyRate = p?.hourlyRate ?? 65
  const rateMode = p?.rateMode ?? "Hourly or milestone"
  const skills = p?.skills ?? SKILLS.map(s => s.name)
  const primaryRole = p?.primaryRole ?? "4yr experience"
  const externalLinks = p?.externalLinks ?? [{ label: "Roblox Profile", url: "#" }, { label: "GitHub", url: "#" }]
  const socials = p?.socials ?? ["roblox", "discord", "x"] as MarqueeProfile["socials"]
  const yearsExp = p ? (p.yearsExperience === 1 ? "1 yr" : `${p.yearsExperience}+ yrs`) : "4+ yrs"
  const projectsShipped = p?.projectsShipped ?? 38
  const scriptsCount = p?.scriptsCount ?? "120+"
  const skillCount = p?.skillCount ?? 4
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (profile?.avatarUrl) return
    const userId = profile ? profile.robloxUserId : 2837719
    fetch(
      `/api/roblox-proxy?path=v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`
    )
      .then((r) => r.json())
      .then((d: { data?: Array<{ imageUrl: string }> }) => {
        const url = d.data?.[0]?.imageUrl
        if (url) setAvatarUrl(url)
      })
      .catch(() => {})
  }, [profile])

  function showToast() {
    setToast(true)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(false), 2500)
  }

  function preventLink(e: React.MouseEvent) {
    e.preventDefault()
    showToast()
  }

  function swipe(dir: "left" | "right") {
    setLeftOpen(false)
    setRightPanel(null)
    setCatPopup(null)
    setSwipeFlash(dir === "right" ? "like" : "nope")
    setTimeout(() => {
      setFlying(dir)
      setTimeout(() => {
        setFlying(null)
        setSwipeFlash(null)
        if (dir === "right") setSparks((s) => s + 1)
      }, 460)
    }, 450)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setLeftOpen(false)
        setRightPanel(null)
        setCatPopup(null)
      }
      if (e.key === "ArrowLeft") swipe("left")
      if (e.key === "ArrowRight") swipe("right")
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const cardCls = [
    "mock-card-shell",
    swipeFlash === "like" ? "like-flash" : swipeFlash === "nope" ? "nope-flash" : "",
    flying === "right" ? "fly-right" : flying === "left" ? "fly-left" : "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className="npc-root">

      <div className="npc-stack-row">
        {/* Left panel — Games */}
        {leftOpen && (
          <aside className="npc-panel" aria-label="Games side panel">
            <div className="npc-panel-hd">
              <button className="npc-panel-back" onClick={() => setLeftOpen(false)}>
                <IconBack /> Back
              </button>
              <h2 className="npc-panel-title">My Games</h2>
              <p className="npc-panel-sub">Games I&apos;ve shipped as a developer.</p>
            </div>
            <div className="npc-panel-body">
              {TOP_GAMES.map((game) => (
                <div key={game.title} className="npc-game-item">
                  <div className="npc-game-thumb npc-thumb-wide" style={{ background: "#818cf818" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={game.thumbnailUrl} alt={game.title} />
                  </div>
                  <div className="npc-game-copy">
                    <div className="npc-game-title">{game.title}</div>
                    <a href="#" className="npc-game-url" onClick={preventLink}>
                      roblox.com/games <IconExternal />
                    </a>
                    <div className="npc-game-stats">
                      <div className="npc-game-stat">
                        <span className="npc-game-stat-val">{game.plays}</span>
                        <span className="npc-game-stat-lbl">Visits</span>
                      </div>
                      <div className="npc-game-stat">
                        <span className="npc-game-stat-val">{game.currentCcu}</span>
                        <span className="npc-game-stat-lbl">Players</span>
                      </div>
                      <div className="npc-game-stat">
                        <span className="npc-game-stat-val">{game.topCcu}</span>
                        <span className="npc-game-stat-lbl">Peak CCU</span>
                      </div>
                    </div>
                    <p className="npc-game-desc">{game.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* Card */}
        <div className={cardCls}>
          <article className="npc-wrap">
            <div className="npc-card">
              <div className="npc-overlay npc-overlay--like">
                <span className="npc-stamp npc-stamp--like">LIKE</span>
              </div>
              <div className="npc-overlay npc-overlay--nope">
                <span className="npc-stamp npc-stamp--nope">NOPE</span>
              </div>

              <div className="npc-top">
                <div className="npc-avatar-wrap">
                  <div
                    className="npc-avatar-bg"
                    style={{ background: avatarColor }}
                  />
                  <div className="npc-avatar-initials">{initial}</div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="npc-avatar-img"
                    src={avatarUrl}
                    alt={displayName}
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = "none"
                    }}
                  />
                  {online && <div className="npc-online-dot" />}
                </div>

                <div className="npc-top-right">
                  <div className="npc-stats">
                    <div className="npc-stat">
                      <div className="npc-stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <div className="npc-stat-val">{yearsExp}</div>
                      <div className="npc-stat-lbl">Experience</div>
                    </div>
                    <div className="npc-stat">
                      <div className="npc-stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="3" width="20" height="14" rx="2" />
                          <path d="M8 21h8M12 17v4" />
                        </svg>
                      </div>
                      <div className="npc-stat-val">{projectsShipped}</div>
                      <div className="npc-stat-lbl">Projects</div>
                    </div>
                    <div className="npc-stat">
                      <div className="npc-stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="16 18 22 12 16 6" />
                          <polyline points="8 6 2 12 8 18" />
                        </svg>
                      </div>
                      <div className="npc-stat-val">{scriptsCount}</div>
                      <div className="npc-stat-lbl">Scripts</div>
                    </div>
                    <div className="npc-stat">
                      <div className="npc-stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                          <line x1="7" y1="7" x2="7.01" y2="7" />
                        </svg>
                      </div>
                      <div className="npc-stat-val">{skillCount}</div>
                      <div className="npc-stat-lbl">Skills</div>
                    </div>
                  </div>
                  <div className="npc-socials">
                    {socials.includes("roblox") && <a href="#" className="npc-social-btn npc-social-roblox" title="Roblox" onClick={preventLink}><IconRoblox /></a>}
                    {socials.includes("discord") && <a href="#" className="npc-social-btn npc-social-discord" title="Discord" onClick={preventLink}><IconDiscord /></a>}
                    {socials.includes("x") && <a href="#" className="npc-social-btn npc-social-x" title="X" onClick={preventLink}><IconX /></a>}
                    {socials.includes("github") && <a href="#" className="npc-social-btn npc-social-x" title="GitHub" onClick={preventLink}><IconExternal /></a>}
                    {socials.includes("youtube") && <a href="#" className="npc-social-btn npc-social-x" title="YouTube" onClick={preventLink}><IconExternal /></a>}
                  </div>
                  {externalLinks.map((link) => (
                    <a key={link.label} href="#" className="npc-portfolio-top-link" onClick={preventLink}>
                      <IconExternal /> {link.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="npc-identity">
                <div className="npc-name-row">
                  <h2 className="npc-name">{displayName}</h2>
                  {verified && (
                    <span className="npc-verified" title="Pro Developer">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </span>
                  )}
                </div>
                <p className="npc-role">{primaryRole}</p>
              </div>

              <div className="npc-divider" />

              <p className="npc-bio">{bio}</p>

              <div className="npc-rate-skills">
                <div className="npc-rate-pill">
                  <div className="npc-rate-amount">${hourlyRate} / hr</div>
                  <div className="npc-rate-type">{rateMode}</div>
                </div>
                <div className="npc-skills-wrap">
                  {skills.map((sk) => (
                    <button
                      key={sk}
                      className={`npc-skill-chip${rightPanel === sk ? " npc-skill-chip--active" : ""}`}
                      onClick={() => setRightPanel((v) => (v === sk ? null : sk))}
                    >
                      {sk}
                    </button>
                  ))}
                </div>
              </div>

              <div className="npc-entries">
                <button
                  className={`npc-entry-btn${leftOpen ? " npc-entry-btn--active" : ""}`}
                  onClick={() => setLeftOpen((v) => !v)}
                >
                  <div className="npc-entry-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  </div>
                  <div className="npc-entry-title">Games</div>
                  <div className="npc-entry-sub">See games I&apos;ve worked on →</div>
                </button>
                <button
                  className={`npc-entry-btn${rightPanel === "work" ? " npc-entry-btn--active" : ""}`}
                  onClick={() => setRightPanel((v) => (v === "work" ? null : "work"))}
                >
                  <div className="npc-entry-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div className="npc-entry-title">My Work</div>
                  <div className="npc-entry-sub">View projects I&apos;ve built →</div>
                </button>
              </div>
            </div>

            <div className="npc-action-bar">
              <button className="npc-action-seg" aria-label="Pass" onClick={() => swipe("left")}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E84624" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <button className="npc-action-seg" aria-label="Message" onClick={() => setRightPanel("work")}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>
              <button className="npc-action-seg" aria-label="Like" onClick={() => swipe("right")}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#3DC77A" stroke="#3DC77A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </article>
        </div>

        {/* Right panel — Work or Skill */}
        {rightPanel !== null && (
          <aside className="npc-panel npc-panel--relative" aria-label="Work or skill side panel">
            {rightPanel === "work" ? (
              <>
                <div className="npc-panel-hd">
                  <button className="npc-panel-back" onClick={() => setRightPanel(null)}>
                    <IconBack /> Back
                  </button>
                  <h2 className="npc-panel-title">My Work</h2>
                  <p className="npc-panel-sub">Projects, systems, and tools I&apos;ve built.</p>
                </div>
                <div className="npc-panel-body">
                  {BEST_WORK.map((item) => {
                    return (
                      <div key={item.title} className="npc-game-item">
                        <div className="npc-game-thumb npc-thumb-wide">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.thumbnailUrl} alt={item.title} />
                        </div>
                        <div className="npc-game-copy">
                          <div className="npc-game-title">{item.title}</div>
                          <div className="npc-game-stats">
                            <div className="npc-game-stat">
                              <span className="npc-game-stat-val">{item.time}</span>
                              <span className="npc-game-stat-lbl">Time</span>
                            </div>
                            <div className="npc-game-stat">
                              <span className="npc-game-stat-val">{item.amount}</span>
                              <span className="npc-game-stat-lbl">Paid</span>
                            </div>
                            <div className="npc-game-stat">
                              <span className="npc-game-stat-val">{item.reach}</span>
                              <span className="npc-game-stat-lbl">Reach</span>
                            </div>
                          </div>
                          <div className="npc-game-tags">
                            {item.tools.split(",").map((t) => (
                              <span key={t} className="npc-game-tag" style={{ background: "#e8e8f5", color: "#555" }}>
                                {t.trim()}
                              </span>
                            ))}
                          </div>
                          <p className="npc-game-desc">{item.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              (() => {
                const sk = SKILLS.find((s) => s.name === rightPanel)
                if (!sk) return null
                const c = skillColor(sk.name)
                return (
                  <>
                    <div className="npc-panel-hd">
                      <button className="npc-panel-back" onClick={() => setRightPanel(null)}>
                        <IconBack /> Back
                      </button>
                    </div>
                    <div className="npc-panel-body">
                      <div className="npc-skill-hd">
                        <div className="npc-skill-icon-box" style={{ background: `${c}33`, color: c }}>
                          {sk.name.slice(0, 3)}
                        </div>
                        <div className="npc-skill-hd-copy">
                          <div className="npc-skill-hd-name">{sk.name}</div>
                          <div className="npc-skill-hd-cat">Development Skill</div>
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: "#444", lineHeight: 1.6, margin: "0 0 16px" }}>
                        {sk.description}
                      </p>
                      {sk.resources && sk.resources.length > 0 && (
                        <div className="npc-skill-refs">
                          {sk.resources.map((r) => (
                            <a key={r.label} href="#" className="npc-skill-ref-link" onClick={preventLink}>
                              <IconExternal /> {r.label}
                            </a>
                          ))}
                        </div>
                      )}
                      <div className="npc-section-title">What I can build with {sk.name}</div>
                      <div className="npc-cap-grid">
                        {(sk.categories ?? []).map((cat, i) => (
                          <button
                            key={cat.name}
                            className="npc-cap-card"
                            onClick={() => setCatPopup({ skill: sk, idx: i })}
                          >
                            <div className="npc-cap-name">{cat.name}</div>
                            <div className="npc-cap-desc">{cat.description}</div>
                          </button>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                        <div className="npc-stat-box">
                          <div className="npc-stat-box-val">{fmtMonths(sk.experienceMonths)}</div>
                          <div className="npc-stat-box-lbl">Experience</div>
                        </div>
                        <div className="npc-stat-box">
                          <div className="npc-stat-box-val">{sk.pastWorks}</div>
                          <div className="npc-stat-box-lbl">Past works</div>
                        </div>
                      </div>
                    </div>
                    {catPopup && catPopup.skill.name === sk.name && (
                      <div
                        className="npc-cat-popup-overlay"
                        onClick={(e) => {
                          if (e.target === e.currentTarget) setCatPopup(null)
                        }}
                      >
                        <div className="npc-cat-popup">
                          <button
                            className="npc-cat-popup-close"
                            onClick={() => setCatPopup(null)}
                            aria-label="Close"
                          >
                            ✕
                          </button>
                          <div className="npc-cat-popup-name">
                            {sk.categories![catPopup.idx].name}
                          </div>
                          <p className="npc-cat-popup-desc">
                            {sk.categories![catPopup.idx].detail ??
                              sk.categories![catPopup.idx].description}
                          </p>
                          <div className="npc-cat-popup-stats">
                            <div className="npc-cat-popup-stat">
                              <div className="npc-cat-popup-stat-val">
                                {sk.categories![catPopup.idx].works}
                              </div>
                              <div className="npc-cat-popup-stat-lbl">Works</div>
                            </div>
                            <div className="npc-cat-popup-stat">
                              <div className="npc-cat-popup-stat-val">
                                {sk.categories![catPopup.idx].avgPrice}
                              </div>
                              <div className="npc-cat-popup-stat-lbl">
                                {sk.categories![catPopup.idx].priceType === "commission"
                                  ? "Avg commission"
                                  : "Avg hourly"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )
              })()
            )}
          </aside>
        )}
      </div>

      {toast && (
        <div className="npc-preview-toast" role="status" aria-live="polite">
          This is just a preview — links aren&apos;t active here
        </div>
      )}
    </div>
  )
}
