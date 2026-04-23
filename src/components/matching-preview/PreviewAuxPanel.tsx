'use client'

import { PreviewProfile } from './preview-types'

const PANEL_BG = '#FDF8F4'
const PANEL_TEXT = '#1A1614'
const LABEL_COLOR = '#9B8278'
const BORDER = 'rgba(0,0,0,0.07)'

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  SC:  { bg: '#E8F4FD', color: '#2563EB' },
  BLD: { bg: '#FEF3E2', color: '#D97706' },
  FX:  { bg: '#FDE8E8', color: '#DC2626' },
  UI:  { bg: '#F3E8FF', color: '#7C3AED' },
  HUD: { bg: '#E8F5E9', color: '#16A34A' },
  SHP: { bg: '#FFF3E0', color: '#EA580C' },
  AC:  { bg: '#FCE7F3', color: '#BE185D' },
  DS:  { bg: '#E0F2FE', color: '#0284C7' },
  SYS: { bg: '#F0FDF4', color: '#15803D' },
  WLD: { bg: '#F0FDF4', color: '#16A34A' },
  CTY: { bg: '#EFF6FF', color: '#1D4ED8' },
  DNG: { bg: '#FDF4FF', color: '#9333EA' },
  FPS: { bg: '#FEF2F2', color: '#DC2626' },
  RPG: { bg: '#FFF7ED', color: '#C2410C' },
  ACT: { bg: '#FDF4FF', color: '#7C3AED' },
  PZL: { bg: '#EFF6FF', color: '#2563EB' },
  ADV: { bg: '#F0FDF4', color: '#15803D' },
  RP:  { bg: '#FEF9EC', color: '#B45309' },
  SCH: { bg: '#F0F9FF', color: '#0369A1' },
  SIM: { bg: '#F7F7F7', color: '#374151' },
}

function getBadgeStyle(badge: string) {
  return BADGE_COLORS[badge] ?? { bg: '#F3F4F6', color: '#6B7280' }
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: LABEL_COLOR }}>
      {children}
    </p>
  )
}

interface LeftProps { profile: PreviewProfile }
interface RightProps { profile: PreviewProfile }

export function LeftAuxPanel({ profile }: LeftProps) {
  const isDev = profile.type === 'dev'
  const panelLabel = isDev ? 'Developer Snapshot' : 'Studio Snapshot'
  const expertiseLabel = isDev ? 'Skill Expertise' : 'Now Hiring'
  const metricsLabel = isDev ? 'Developer Metrics' : 'Studio Metrics'

  return (
    <div
      className="flex flex-col gap-5 h-full overflow-y-auto"
      style={{ background: PANEL_BG, color: PANEL_TEXT, padding: '20px 22px' }}
    >
      {/* Panel label */}
      <div>
        <span
          className="text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded"
          style={{ background: 'rgba(232,70,36,.10)', color: '#E84624' }}
        >
          {panelLabel}
        </span>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-0.5" style={{ color: PANEL_TEXT }}>
          Skills and expertise
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: LABEL_COLOR }}>
          A quick read on this {isDev ? "developer's" : "studio's"} strengths and how they work.
        </p>
      </div>

      {/* Profile link */}
      {profile.robloxUrl && (
        <div>
          <SectionLabel>Roblox Profile</SectionLabel>
          <div
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
            style={{ border: `1px solid ${BORDER}`, background: 'white' }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: profile.headerGradient }}
            >
              {profile.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: PANEL_TEXT }}>{profile.name}</p>
              <p className="text-[11px] truncate" style={{ color: '#E84624' }}>{profile.robloxUrl}</p>
            </div>
          </div>
        </div>
      )}

      {/* Skill expertise / hiring needs */}
      {isDev ? (
        profile.skillExpertise && profile.skillExpertise.length > 0 && (
          <div>
            <SectionLabel>{expertiseLabel}</SectionLabel>
            <div className="flex flex-col gap-3">
              {profile.skillExpertise.map(skill => (
                <div key={skill.name}>
                  <span
                    className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5"
                    style={{ background: 'rgba(232,70,36,.10)', color: '#E84624' }}
                  >
                    {skill.name.toUpperCase()}
                  </span>
                  <p className="text-xs leading-relaxed" style={{ color: '#5C4A44' }}>{skill.description}</p>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        profile.hiringNeeds && profile.hiringNeeds.length > 0 && (
          <div>
            <SectionLabel>{expertiseLabel}</SectionLabel>
            <div className="flex flex-col gap-3">
              {profile.hiringNeeds.map(need => (
                <div key={need.role}>
                  <span
                    className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5"
                    style={{ background: 'rgba(232,70,36,.10)', color: '#E84624' }}
                  >
                    {need.role.toUpperCase()}
                  </span>
                  <p className="text-xs leading-relaxed" style={{ color: '#5C4A44' }}>{need.description}</p>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {/* Metrics pills */}
      <div>
        <SectionLabel>{metricsLabel}</SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {profile.tags.map(tag => (
            <span
              key={tag}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full"
              style={{ border: `1px solid ${BORDER}`, background: 'white', color: PANEL_TEXT }}
            >
              {tag}
            </span>
          ))}
          <span
            className="text-[11px] font-medium px-2.5 py-1 rounded-full"
            style={{ border: `1px solid ${BORDER}`, background: 'white', color: PANEL_TEXT }}
          >
            {profile.status}
          </span>
        </div>
      </div>

      {/* Portfolio links */}
      {profile.portfolioLinks && profile.portfolioLinks.length > 0 && (
        <div>
          <SectionLabel>Portfolio Links</SectionLabel>
          <div className="flex flex-col gap-2">
            {profile.portfolioLinks.map(link => (
              <div
                key={link.label}
                className="px-3 py-2.5 rounded-xl"
                style={{ border: `1px solid ${BORDER}`, background: 'white' }}
              >
                <p className="text-sm font-semibold mb-0.5" style={{ color: PANEL_TEXT }}>{link.label}</p>
                <p className="text-[11px]" style={{ color: '#E84624' }}>{link.url}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function RightAuxPanel({ profile }: RightProps) {
  const isDev = profile.type === 'dev'
  const panelLabel = isDev ? 'Best Work' : 'Top Games'
  const subtitle = isDev
    ? 'Three sample commissions stay visible while you browse the profile.'
    : 'Top games from this studio with live player numbers.'

  return (
    <div
      className="flex flex-col gap-5 h-full overflow-y-auto"
      style={{ background: PANEL_BG, color: PANEL_TEXT, padding: '20px 22px' }}
    >
      {/* Panel label */}
      <div>
        <span
          className="text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded"
          style={{ background: 'rgba(232,70,36,.10)', color: '#E84624' }}
        >
          {panelLabel}
        </span>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-0.5" style={{ color: PANEL_TEXT }}>
          Past projects at a glance
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: LABEL_COLOR }}>{subtitle}</p>
      </div>

      {/* Project cards */}
      {profile.bestWork && profile.bestWork.length > 0 ? (
        <div className="flex flex-col gap-3">
          {profile.bestWork.map(work => {
            const badgeStyle = getBadgeStyle(work.badge)
            return (
              <div
                key={work.title}
                className="rounded-xl overflow-hidden"
                style={{ border: `1px solid ${BORDER}`, background: 'white' }}
              >
                <div className="flex gap-3 p-3">
                  {/* Thumbnail */}
                  <div
                    className="w-20 h-20 rounded-lg flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: profile.headerGradient }}
                  >
                    {work.emoji}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <p className="text-sm font-bold leading-tight" style={{ color: PANEL_TEXT }}>{work.title}</p>
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                        style={{ background: badgeStyle.bg, color: badgeStyle.color }}
                      >
                        {work.badge}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed mb-2" style={{ color: '#6B5E58' }}>{work.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {work.meta.map(({ label, value }) => (
                        <span
                          key={label}
                          className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: '#FFF0EC', color: '#C04A28', border: '1px solid rgba(232,70,36,.15)' }}
                        >
                          {label}: {value}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-xs" style={{ color: LABEL_COLOR }}>No portfolio items yet.</p>
      )}
    </div>
  )
}
