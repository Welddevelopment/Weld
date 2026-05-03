'use client'

import type { PreviewProfile } from '../preview-types'
import { DEV_SKILL_DESCS } from '../preview-data'

interface Props {
  profile: PreviewProfile
  skillName: string
  onBack: () => void
}

const ICON_COLORS = ['#a78bfa', '#34d399', '#fb923c', '#60a5fa', '#f472b6', '#facc15']

function colorForSkill(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return ICON_COLORS[h % ICON_COLORS.length]
}

const ROLE_ICONS: Record<string, React.ReactNode> = {
  code: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  monitor: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  database: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>,
  art: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
  gamepad: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg>,
}

export default function StudioSkillPanel({ profile, skillName, onBack }: Props) {
  const color = colorForSkill(skillName)
  const desc = DEV_SKILL_DESCS[skillName] ?? ''
  const roles = (profile.openRoles ?? []).filter(r =>
    r.title.toLowerCase().includes(skillName.toLowerCase()) ||
    (r.description ?? '').toLowerCase().includes(skillName.toLowerCase())
  )

  return (
    <div className="npc-panel">
      <div className="npc-panel-hd">
        <button className="npc-panel-back" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
      </div>

      <div className="npc-panel-body">
        <div className="npc-skill-hd">
          <div className="npc-skill-icon-box" style={{ background: `${color}33`, color }}>
            {skillName.slice(0, 3)}
          </div>
          <div className="npc-skill-hd-copy">
            <div className="npc-skill-hd-name">{skillName}</div>
            <div className="npc-skill-hd-cat">Skill Needed</div>
          </div>
        </div>

        <div style={{ margin: '0 0 20px', padding: '12px 14px', background: 'rgba(61,199,122,0.08)', borderRadius: 10, border: '1px solid rgba(61,199,122,0.2)' }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3DC77A', marginBottom: 6 }}>
            {profile.name} is looking for
          </div>
          <p style={{ fontSize: 13, color: '#333', lineHeight: 1.6, margin: 0 }}>
            Developers with strong {skillName} experience to join their team.
          </p>
        </div>

        {desc && (
          <>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', marginBottom: 8 }}>
              About this skill
            </div>
            <p style={{ fontSize: 13, color: '#444', lineHeight: 1.65, margin: '0 0 20px' }}>
              {desc}
            </p>
          </>
        )}

        {roles.length > 0 && (
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', marginBottom: 10 }}>
              Related open roles
            </div>
            {roles.map(role => (
              <div key={role.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: '#f7f7f7', borderRadius: 10, marginBottom: 8 }}>
                <span style={{ color: '#666', marginTop: 2, flexShrink: 0 }}>
                  {ROLE_ICONS[role.icon] ?? ROLE_ICONS.code}
                </span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 3 }}>{role.title}</div>
                  {role.description && (
                    <div style={{ fontSize: 12, color: '#666', lineHeight: 1.5 }}>{role.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {roles.length === 0 && (profile.openRoles ?? []).length > 0 && (
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', marginBottom: 10 }}>
              All open roles
            </div>
            {(profile.openRoles ?? []).slice(0, 3).map(role => (
              <div key={role.title} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: '#f7f7f7', borderRadius: 8, marginBottom: 6 }}>
                <span style={{ color: '#666' }}>{ROLE_ICONS[role.icon] ?? ROLE_ICONS.code}</span>
                <span style={{ fontSize: 12, color: '#333' }}>{role.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
