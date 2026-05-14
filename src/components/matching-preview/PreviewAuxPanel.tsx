'use client'

import { PreviewProfile } from './preview-types'

function AvatarImg({ userId, name }: { userId: number; name: string }) {
  const initials = name.slice(0, 2).toUpperCase()
  return (
    <div className="aux-profile-icon">
      <div className="aux-profile-icon-initials">{initials}</div>
      <img
        src={`/api/roblox/avatar?userId=${userId}`}
        alt={name}
        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
    </div>
  )
}

function WorkThumb({ title }: { title: string }) {
  const initial = title[0]?.toUpperCase() ?? '?'
  return (
    <div className="aux-work-thumb">
      <div className="aux-work-thumb-placeholder">{initial}</div>
    </div>
  )
}

export function LeftAuxPanel({ profile }: { profile: PreviewProfile }) {
  const isDev = profile.type === 'dev'
  const profileHandle = `www.roblox.com/users/${profile.robloxUserId}/profile`

  if (isDev) {
    const slug = profile.name.toLowerCase().replace(/[^a-z0-9]+/g, '')
    const links = profile.portfolio?.links ?? [
      { name: 'Roblox Profile', url: `roblox.com/users/${profile.robloxUserId}/profile` },
      { name: 'GitHub', url: `github.com/${slug}` },
      { name: 'Portfolio Site', url: `${slug}.dev` },
    ]
    return (
      <div className="aux-panel-inner">
        <div className="aux-panel-top">
          <span className="aux-panel-eyebrow">Developer Snapshot</span>
          <div className="aux-panel-title">Skills and expertise</div>
          <div className="aux-panel-sub">A quick read on this developer&apos;s strengths and how they work.</div>
        </div>
        <div className="aux-panel-body">
          <div className="aux-profile-card">
            <AvatarImg userId={profile.robloxUserId} name={profile.name} />
            <div className="aux-profile-copy">
              <div className="aux-profile-label">Roblox profile</div>
              <div className="aux-profile-title">{profile.name}</div>
              <a className="aux-profile-link" href={`https://${profileHandle}`} target="_blank" rel="noreferrer">{profileHandle}</a>
            </div>
          </div>

          {profile.skills && profile.skills.length > 0 && (
            <div className="aux-section">
              <div className="aux-section-label">Skill expertise</div>
              <div className="aux-skills-list">
                {profile.skills.map(skill => (
                  <div key={skill.name} className="aux-skill-row">
                    <div className="aux-skill-label">{skill.name}</div>
                    <div className="aux-skill-desc">{skill.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="aux-section">
            <div className="aux-section-label">Developer metrics</div>
            <div className="aux-work-meta">
              <span className="aux-work-pill">{profile.meta}</span>
              {profile.tags.slice(0, 3).map(tag => (
                <span key={tag} className="aux-work-pill">{tag}</span>
              ))}
            </div>
          </div>

          <div className="aux-section">
            <div className="aux-section-label">Portfolio links</div>
            <div className="aux-links">
              {links.map(link => (
                <a key={link.name} href={`https://${link.url}`} target="_blank" rel="noreferrer" className="aux-link">
                  <span className="aux-link-name">{link.name}</span>
                  <span className="aux-link-url">{link.url}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Studio left panel
  const slug = profile.name.toLowerCase().replace(/[^a-z0-9]+/g, '')
  const studioLinks = [
    { name: 'Studio site',   url: `https://${slug}.studio`,                                  display: `${slug}.studio` },
    { name: 'Roblox group',  url: `https://roblox.com/groups/${8820000 + slug.length * 13}`, display: `roblox.com/groups/${8820000 + slug.length * 13}` },
    { name: 'Contact',       url: `mailto:hello@${slug}.studio`,                             display: `hello@${slug}.studio` },
  ]
  return (
    <div className="aux-panel-inner">
      <div className="aux-panel-top">
        <span className="aux-panel-eyebrow">Studio Snapshot</span>
        <div className="aux-panel-title">Unique live-op profile</div>
        <div className="aux-panel-sub">A concise studio pulse with a real Roblox profile and key team signals.</div>
      </div>
      <div className="aux-panel-body">
        <div className="aux-profile-card">
          <AvatarImg userId={profile.robloxUserId} name={profile.name} />
          <div className="aux-profile-copy">
            <div className="aux-profile-label">Roblox profile</div>
            <div className="aux-profile-title">{profile.name}</div>
            <a className="aux-profile-link" href={`https://${profileHandle}`} target="_blank" rel="noreferrer">{profileHandle}</a>
          </div>
        </div>

        <div className="aux-section">
          <div className="aux-section-label">Studio differentiator</div>
          <div className="aux-panel-note">Shipping polished social games with live events, built-in monetization, and a player-first retention strategy.</div>
        </div>

        <div className="aux-section">
          <div className="aux-section-label">Studio metrics</div>
          <div className="aux-work-meta">
            <span className="aux-work-pill">{profile.meta}</span>
            {profile.tags.slice(0, 3).map(tag => (
              <span key={tag} className="aux-work-pill">{tag}</span>
            ))}
          </div>
          <div className="aux-panel-note">This team is structured for live title maintenance and rapid shipping cycles, not just one-off prototypes.</div>
        </div>

        <div className="aux-section">
          <div className="aux-section-label">Studio links</div>
          <div className="aux-links">
            {studioLinks.map(link => (
              <a key={link.name} href={link.url} target="_blank" rel="noreferrer" className="aux-link">
                <span className="aux-link-name">{link.name}</span>
                <span className="aux-link-url">{link.display}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function RightAuxPanel({ profile }: { profile: PreviewProfile }) {
  const isDev = profile.type === 'dev'

  if (isDev) {
    const items = (profile.bestWork ?? []).slice(0, 3)
    return (
      <div className="aux-panel-inner">
        <div className="aux-panel-top">
          <span className="aux-panel-eyebrow">Best Work</span>
          <div className="aux-panel-title">Past projects at a glance</div>
          <div className="aux-panel-sub">Three sample commissions stay visible while you browse the profile.</div>
        </div>
        <div className="aux-panel-body">
          <div className="aux-work-list">
            {items.map(item => (
              <div key={item.title} className="aux-work-item">
                <WorkThumb title={item.title} />
                <div className="aux-work-copy">
                  <div className="aux-work-head">
                    <div className="aux-work-title">{item.title}</div>
                    <span className="aux-work-badge">{item.emoji}</span>
                  </div>
                  <div className="aux-work-desc">{item.desc}</div>
                  <div className="aux-work-meta">
                    <span className="aux-work-pill">Tools: {item.tools}</span>
                    <span className="aux-work-pill">Time: {item.time}</span>
                    <span className="aux-work-pill">Plays: {item.plays}</span>
                    <span className="aux-work-pill">Paid: ${item.amount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Studio right panel
  const items = (profile.topGames ?? []).slice(0, 3)
  return (
    <div className="aux-panel-inner">
      <div className="aux-panel-top">
        <span className="aux-panel-eyebrow">Top games</span>
        <div className="aux-panel-title">Live titles worth browsing</div>
        <div className="aux-panel-sub">Realistic Roblox game mocks that feel like actual published experiences.</div>
      </div>
      <div className="aux-panel-body">
        <div className="aux-work-list">
          {items.map(item => (
            <div key={item.title} className="aux-work-item">
              <WorkThumb title={item.title} />
              <div className="aux-work-copy">
                <div className="aux-work-head">
                  <div className="aux-work-title">{item.title}</div>
                  <span className="aux-work-badge">{item.emoji}</span>
                </div>
                <div className="aux-work-desc">{item.desc}</div>
                <div className="aux-work-meta">
                  <span className="aux-work-pill">Plays: {item.plays}</span>
                  <span className="aux-work-pill">Top CCU: {item.topCcu}</span>
                  <span className="aux-work-pill">Current CCU: {item.currentCcu}</span>
                </div>
                <div className="aux-work-note">A live Roblox release built around social loops, rewards, and recurring events that drive retention.</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
