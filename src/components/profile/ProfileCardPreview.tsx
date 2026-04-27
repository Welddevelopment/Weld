'use client'

import { PreviewProfile } from '../matching-preview/preview-types'

interface Props {
  profile: PreviewProfile
}

export default function ProfileCardPreview({ profile }: Props) {
  const isDev = profile.type === 'dev'
  const initials = profile.name ? profile.name.slice(0, 2).toUpperCase() : '?'

  return (
    <div className="pb-card">
      <div className="pb-card-hero" style={{ background: profile.bg }}>
        <div className="pb-card-avatar">
          <span className="pb-card-initials">{initials}</span>
          {profile.robloxUserId !== 1 && (
            <img
              src={`https://www.roblox.com/headshot-thumbnail/image?userId=${profile.robloxUserId}&width=150&height=150&format=png`}
              alt={profile.name}
              className="pb-card-avatar-img"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          )}
        </div>
      </div>

      <div className="pb-card-body">
        {profile.badge && <div className="pb-card-badge">{profile.badge}</div>}
        <div className="pb-card-name">{profile.name || <span className="pb-card-placeholder">Your name</span>}</div>
        <div className="pb-card-role">{profile.role || <span className="pb-card-placeholder">{isDev ? 'Developer role' : 'Studio role'}</span>}</div>
        {profile.bio && <div className="pb-card-bio">{profile.bio}</div>}

        {profile.tags.length > 0 && (
          <div className="pb-card-tags">
            {profile.tags.map(t => <span key={t} className="pb-card-tag">{t}</span>)}
          </div>
        )}

        {profile.meta && (
          <div className="pb-card-meta">
            <span className="pb-card-dot" />
            {profile.meta}
          </div>
        )}
      </div>
    </div>
  )
}
