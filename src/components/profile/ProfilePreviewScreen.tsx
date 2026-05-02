'use client'

import { PreviewProfile } from '../matching-preview/preview-types'
import { LeftAuxPanel, RightAuxPanel } from '../matching-preview/PreviewAuxPanel'
import { getInitials } from '@/lib/utils'

interface Props {
  profile: PreviewProfile
  onBioChange?: (bio: string) => void
  onSkillDescChange?: (name: string, desc: string) => void
  onDetailsChange?: (details: string) => void
  onContinue: () => void
  onBack: () => void
  isLast: boolean
}

function AvatarImg({ userId, name, bg }: { userId: number; name: string; bg: string }) {
  const initials = name ? getInitials(name) : '?'
  return (
    <div className="mp-modal-hero" style={{ background: bg }}>
      <div style={{ position: 'relative', width: 'clamp(60px,8vh,96px)', height: 'clamp(60px,8vh,96px)' }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'rgba(255,255,255,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 24, color: 'rgba(255,255,255,.9)',
          border: '3px solid rgba(255,255,255,0.55)',
        }}>
          {initials}
        </div>
        {userId !== 1 && (
          <img
            src={`https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=150&height=150&format=png`}
            alt={name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        )}
      </div>
    </div>
  )
}

function InlineEdit({
  value,
  onChange,
  placeholder = 'Click to edit…',
  darkBg = false,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  darkBg?: boolean
}) {
  const focusBorder = 'rgba(232,70,36,0.55)'
  const focusBg = darkBg ? 'rgba(232,70,36,0.08)' : 'rgba(232,70,36,0.06)'

  function autoResize(el: HTMLTextAreaElement) {
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  return (
    <textarea
      value={value}
      onChange={e => { onChange(e.target.value); autoResize(e.target) }}
      onFocus={e => {
        e.target.style.borderColor = focusBorder
        e.target.style.background = focusBg
        autoResize(e.target)
      }}
      onBlur={e => {
        e.target.style.borderColor = 'transparent'
        e.target.style.background = 'transparent'
      }}
      placeholder={placeholder}
      rows={1}
      style={{
        display: 'block',
        width: '100%',
        background: 'transparent',
        border: '1.5px dashed transparent',
        borderRadius: 6,
        outline: 'none',
        resize: 'none',
        overflow: 'hidden',
        cursor: 'text',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        lineHeight: 'inherit',
        color: 'inherit',
        letterSpacing: 'inherit',
        padding: '3px 6px',
        margin: '-3px -6px',
        boxSizing: 'border-box',
        transition: 'border-color 0.15s, background 0.15s',
      }}
    />
  )
}

export default function ProfilePreviewScreen({
  profile,
  onBioChange,
  onSkillDescChange,
  onDetailsChange,
  onContinue,
  onBack,
  isLast,
}: Props) {
  const isDev = profile.type === 'dev'
  const editable = !!(onBioChange || onSkillDescChange || onDetailsChange)

  return (
    <div className="mp-modal-overlay pb-preview-overlay">
      <button className="pb-preview-back" type="button" onClick={onBack}>
        ← Edit
      </button>

      <div className="pb-preview-label-pill">
        {editable ? 'Profile preview — click text to edit' : 'Profile preview'}
      </div>

      <div className="mp-modal-row" onClick={e => e.stopPropagation()}>
        <div className="mp-carousel-card pos-left" style={{ overflow: 'hidden' }}>
          <LeftAuxPanel profile={profile} />
        </div>

        <div className="mp-carousel-card pos-center">
          <AvatarImg userId={profile.robloxUserId} name={profile.name} bg={profile.bg} />
          <div className="mp-modal-body">
            {profile.badge && <div className="mp-modal-badge">{profile.badge}</div>}
            <div className="mp-modal-name">{profile.name || <span style={{ opacity: 0.3 }}>Your Name</span>}</div>
            <div className="mp-modal-role">{profile.role}</div>

            {/* Bio — inline editable */}
            {(profile.bio || onBioChange) && (
              <div className="mp-modal-bio" style={{ padding: 0 }}>
                {onBioChange ? (
                  <InlineEdit value={profile.bio} onChange={onBioChange} placeholder="Write your bio…" darkBg />
                ) : (
                  profile.bio
                )}
              </div>
            )}

            {/* Studio: project description — inline editable */}
            {!isDev && (profile.details || onDetailsChange) && (
              <div className="mp-modal-description" style={{ padding: onDetailsChange ? '16px' : undefined }}>
                {onDetailsChange ? (
                  <InlineEdit value={profile.details ?? ''} onChange={onDetailsChange} placeholder="Describe your project…" />
                ) : (
                  profile.details
                )}
              </div>
            )}

            {/* Studio: skills needed — descriptions inline editable */}
            {!isDev && profile.skillsNeeded && profile.skillsNeeded.length > 0 && (
              <>
                <div className="mp-modal-section-title">Skills needed</div>
                <div className="mp-profile-skills">
                  {profile.skillsNeeded.map(s => (
                    <div key={s.name} className="mp-profile-skill">
                      <div className="mp-skill-label">{s.name}</div>
                      {onSkillDescChange ? (
                        <InlineEdit
                          value={s.description}
                          onChange={desc => onSkillDescChange(s.name, desc)}
                          placeholder="Describe what you need…"
                        />
                      ) : (
                        <div className="mp-skill-desc">{s.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Dev: skills — descriptions inline editable */}
            {isDev && profile.skills && profile.skills.length > 0 && (
              <>
                <div className="mp-modal-section-title">Skills</div>
                <div className="mp-profile-skills">
                  {profile.skills.map(s => (
                    <div key={s.name} className="mp-profile-skill">
                      <div className="mp-skill-label">{s.name}</div>
                      {onSkillDescChange ? (
                        <InlineEdit
                          value={s.description}
                          onChange={desc => onSkillDescChange(s.name, desc)}
                          placeholder="Describe this skill…"
                        />
                      ) : (
                        <div className="mp-skill-desc">{s.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {profile.tags.length > 0 && (
              <div className="mp-modal-tags">
                {profile.tags.map(tag => (
                  <span key={tag} className="mp-modal-tag">{tag}</span>
                ))}
              </div>
            )}

            {profile.meta && (
              <div className="mp-modal-meta">
                <div className="mp-modal-dot" />
                {profile.meta}
              </div>
            )}

            {isDev && profile.portfolio && profile.portfolio.links.length > 0 && (
              <>
                <div className="mp-modal-divider" />
                <div className="mp-modal-section-title">Portfolio</div>
                <div className="mp-modal-portfolio-links">
                  {profile.portfolio.links.map(link => (
                    <a key={link.name} href={`https://${link.url}`} target="_blank" rel="noreferrer" className="mp-modal-portfolio-link">
                      <span className="mp-modal-portfolio-link-name">{link.name}</span>
                      <span className="mp-modal-portfolio-link-url">{link.url}</span>
                    </a>
                  ))}
                </div>
              </>
            )}

            {isDev && profile.socials && profile.socials.length > 0 && (
              <>
                <div className="mp-modal-section-title" style={{ marginTop: 14 }}>Socials</div>
                <div className="mp-modal-socials">
                  {profile.socials.map(s => (
                    <a key={s.label} href={s.url} className="mp-modal-social-btn">
                      <span className="mp-modal-social-icon">{s.icon}</span>
                      {s.label}
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mp-carousel-card pos-right" style={{ overflow: 'hidden' }}>
          <RightAuxPanel profile={profile} />
        </div>
      </div>

      <div className="pb-preview-cta">
        <button className="pb-preview-continue-btn" type="button" onClick={onContinue}>
          {isLast ? 'Publish profile' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}
