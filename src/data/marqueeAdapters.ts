import type { MarqueeProfile } from "./marqueeProfiles";
import type { MarqueeStudio } from "./marqueeStudios";
import type { PreviewProfile } from "@/components/matching-preview/preview-types";

export function marqueeProfileToPreview(p: MarqueeProfile): PreviewProfile {
  return {
    id: p.id,
    type: "dev",
    robloxUserId: p.robloxUserId,
    bg: p.avatarColor,
    badge: p.verified ? "Verified" : "",
    name: p.displayName,
    role: `Developer - ${p.primaryRole} · ${p.yearsExperience}yr`,
    bio: p.bio,
    tags: p.skills,
    meta: `Rate: $${p.hourlyRate}`,
    stats: {
      experience: p.yearsExperience === 1 ? "1 yr" : `${p.yearsExperience}+ yrs`,
      projects: String(p.projectsShipped),
      scriptsBuilt: p.scriptsCount,
      onTime: "—",
    },
    skills: p.skills.map((name) => ({ name, description: "" })),
    socials: p.socials.map((s) => ({ icon: s[0].toUpperCase(), label: s, url: "#" })),
    portfolio: {
      links: p.externalLinks.map((l) => ({ name: l.label, url: l.url })),
    },
  };
}

export function marqueeStudioToPreview(s: MarqueeStudio): PreviewProfile {
  return {
    id: s.id,
    type: "studio",
    robloxUserId: 1,
    bg: s.avatarColor,
    badge: s.verified ? "Verified" : "",
    name: s.displayName,
    role: `${s.studioType} · ${s.memberCount} members`,
    bio: s.bio,
    tags: s.lookingFor,
    meta: `Rate: $${s.hiringRateMin}–$${s.hiringRateMax}`,
    hiring: s.hiringStatus === "Actively Hiring",
    rateMin: s.hiringRateMin,
    rateMax: s.hiringRateMax,
    rateType: "Hourly (USD)",
    rateNote: s.rateNote,
    skillsNeeded: s.lookingFor.map((name) => ({ name, description: "" })),
    openRoles: s.openRoles.map((r) => ({ skill: r.type, title: r.title })),
    about: s.about,
    studioStats: {
      yearsBuilding: String(s.gamesShipped),
      projectsShipped: s.projectsCount,
      totalVisits: s.visits,
      onTimeDelivery: `${s.onTimeRate}%`,
    },
  };
}
