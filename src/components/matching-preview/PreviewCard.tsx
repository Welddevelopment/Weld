'use client'

import { PreviewProfile } from './preview-types'

function truncate(text: string, max = 132) {
  const s = String(text || '').replace(/\s+/g, ' ').trim()
  if (s.length <= max) return s
  return s.slice(0, max).replace(/[,\s.;:!?-]+$/, '') + '…'
}

function roleFit(profile: PreviewProfile) {
  const tags = profile.tags.slice(0, 3)
  if (!tags.length) return truncate(profile.bio, 78)
  return profile.type === 'studio'
    ? `Hiring for ${tags.join(', ')}`
    : `Strong in ${tags.join(', ')}`
}

function factTriplet(profile: PreviewProfile) {
  if (profile.type === 'studio') {
    const budget = profile.meta.match(/Budget:\s*([^-]+)/)?.[1]?.trim() ?? 'TBD'
    const status = profile.meta.split(' - ')[0] ?? 'Hiring Now'
    const team   = profile.role.match(/(\d+)\s*members/)?.[1] ?? 'Team'
    return [{ label: 'Status', value: status }, { label: 'Budget', value: budget }, { label: 'Team', value: team }]
  }
  const status = profile.meta.split(' - ')[0] ?? 'Available'
  const rate   = profile.meta.match(/Rate:\s*([^-]+)/)?.[1]?.trim() ?? 'Flexible'
  const exp    = profile.role.match(/(\d+yr)/)?.[1] ?? 'Exp'
  return [{ label: 'Status', value: status }, { label: 'Rate', value: rate }, { label: 'Exp', value: exp }]
}

function AvatarImg({ userId, name, bg }: { userId: number; name: string; bg: string }) {
  const initials = name.slice(0, 2).toUpperCase()
  return (
    <div className="fc-avatar" style={{ background: bg }}>
      <div className="fc-avatar-initials">{initials}</div>
      <img
        src={`https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=150&height=150&format=png`}
        alt={name}
        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
    </div>
  )
}

export default function PreviewCard({ profile }: { profile: PreviewProfile }) {
  const isDev      = profile.type === 'dev'
  const typeClass  = isDev ? 'hero-brief-card--developer' : 'hero-brief-card--studio'
  const focusLabel = isDev ? 'Primary skills' : 'Hiring focus'
  const pills      = profile.tags.slice(0, 3)
  const facts      = factTriplet(profile)

  return (
    <div className={`fc hero-brief-card ${typeClass}`}>
      <div className="fc-top">
        <AvatarImg userId={profile.robloxUserId} name={profile.name} bg={profile.bg} />
        <div className="fc-info">
          <div className="fc-name">{profile.name}</div>
          <div className="fc-badge">{profile.badge}</div>
          <div className="hero-brief-fit">{roleFit(profile)}</div>
        </div>
      </div>

      <div className="hero-brief-focus-wrap">
        <div className="hero-brief-focus">
          <div className="hero-brief-kicker">{focusLabel}</div>
          <div className="hero-brief-pill-row">
            {pills.length
              ? pills.map(p => <span key={p} className="hero-brief-pill">{p}</span>)
              : <span className="hero-brief-pill">{isDev ? 'Available now' : 'Open brief'}</span>
            }
          </div>
        </div>
      </div>

      <div className="hero-brief-summary">{truncate(profile.bio, 132)}</div>

      <div className="hero-brief-facts">
        {facts.map(f => (
          <div key={f.label} className="hero-brief-fact">
            <span className="hero-brief-fact-label">{f.label}</span>
            <span className="hero-brief-fact-value">{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
