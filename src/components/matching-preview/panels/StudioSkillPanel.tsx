'use client'

import { useState } from 'react'
import type { PreviewProfile } from '../preview-types'
import { DEV_SKILL_DESCS } from '../preview-data'

interface Props {
  profile: PreviewProfile
  skillName: string
  initialRole?: string
  onBack: () => void
}

const ICON_COLORS = ['#a78bfa', '#34d399', '#fb923c', '#60a5fa', '#f472b6', '#facc15']

function colorForSkill(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return ICON_COLORS[h % ICON_COLORS.length]
}

function formatPayDisplay(payType: string, payMin: number | null, payMax: number | null): string {
  if (payType === 'Negotiable') return 'Negotiable'
  const isRobux = payType.includes('Robux')
  const isRevShare = payType === 'Revenue Share'
  const prefix = isRevShare || isRobux ? '' : '$'
  const suffix = isRevShare ? '%' : (isRobux ? ' R$' : '')
  const fmt = (n: number) => `${prefix}${n.toLocaleString()}${suffix}`
  const range = payMin != null && payMax != null
    ? ` · ${fmt(payMin)} – ${fmt(payMax)}`
    : payMin != null ? ` · from ${fmt(payMin)}`
    : payMax != null ? ` · up to ${fmt(payMax)}`
    : ''
  return `${payType}${range}`
}

export default function StudioSkillPanel({ profile, skillName, initialRole, onBack }: Props) {
  const color = colorForSkill(skillName)
  const roles = (profile.openRoles ?? []).filter(r => r.skill === skillName)
  const initialIdx = initialRole != null ? roles.findIndex(r => r.title === initialRole) : -1
  const [selectedRole, setSelectedRole] = useState<number | null>(initialIdx >= 0 ? initialIdx : null)

  const customDesc = profile.skillsNeeded?.find(s => s.name === skillName)?.description?.trim()
  const defaultDesc = DEV_SKILL_DESCS[skillName] ?? ''
  const popupRole = selectedRole !== null ? roles[selectedRole] : null

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

      <div className="npc-panel-body" style={{ position: 'relative' }}>
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
            {customDesc || `Developers with strong ${skillName} experience to join their team.`}
          </p>
        </div>

        {!customDesc && defaultDesc && (
          <>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', marginBottom: 8 }}>
              About this skill
            </div>
            <p style={{ fontSize: 13, color: '#444', lineHeight: 1.65, margin: '0 0 20px' }}>
              {defaultDesc}
            </p>
          </>
        )}

        {roles.length > 0 && (
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', marginBottom: 10 }}>
              Open roles for this skill
            </div>
            <div style={{ overflowY: 'auto', maxHeight: 220 }}>
              {roles.map((role, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedRole(idx)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '10px 12px', background: '#f7f7f7', borderRadius: 10,
                    marginBottom: 8, border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: '0.03em' }}>{(role.skill || '').slice(0, 3)}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{role.title || 'Untitled role'}</div>
                    {role.payType && (
                      <div style={{ fontSize: 10, color: '#3DC77A', fontWeight: 600, marginTop: 2 }}>
                        {formatPayDisplay(role.payType, role.payMin ?? null, role.payMax ?? null)}
                      </div>
                    )}
                    {role.description && (
                      <div style={{ fontSize: 11, color: '#888', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {role.description}
                      </div>
                    )}
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {roles.length === 0 && (
          <div style={{ fontSize: 12, color: '#bbb', textAlign: 'center', marginTop: 8 }}>
            No specific roles listed for this skill yet.
          </div>
        )}

        {/* Role detail popup */}
        {popupRole && (
          <div
            style={{
              position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.97)',
              borderRadius: 12, display: 'flex', flexDirection: 'column',
              padding: '16px 18px', zIndex: 10,
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedRole(null)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 12, padding: 0, marginBottom: 16 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg>
              Back to roles
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color, letterSpacing: '0.02em' }}>{(popupRole.skill || '').slice(0, 3)}</span>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>{popupRole.title || 'Untitled role'}</div>
                <div style={{ fontSize: 11, color, fontWeight: 600, marginTop: 2 }}>{popupRole.skill}</div>
              </div>
            </div>

            {customDesc && (
              <>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', marginBottom: 6 }}>
                  What they&apos;re looking for
                </div>
                <p style={{ fontSize: 13, color: '#444', lineHeight: 1.65, margin: '0 0 14px' }}>
                  {customDesc}
                </p>
              </>
            )}

            {popupRole.payType && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14, padding: '7px 11px', background: 'rgba(61,199,122,0.07)', borderRadius: 8, border: '1px solid rgba(61,199,122,0.18)' }}>
                <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#3DC77A' }}>Pay</div>
                <div style={{ width: 1, height: 10, background: 'rgba(61,199,122,0.3)', flexShrink: 0 }} />
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1a7a4a' }}>
                  {formatPayDisplay(popupRole.payType, popupRole.payMin ?? null, popupRole.payMax ?? null)}
                </div>
              </div>
            )}

            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', marginBottom: 8 }}>
              Role description
            </div>
            <p style={{ fontSize: 13, color: '#333', lineHeight: 1.65, margin: 0, flex: 1 }}>
              {popupRole.description || 'No description provided.'}
            </p>

            <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(61,199,122,0.08)', borderRadius: 8, border: '1px solid rgba(61,199,122,0.2)' }}>
              <div style={{ fontSize: 11, color: '#3DC77A', fontWeight: 600, marginBottom: 4 }}>Interested in this role?</div>
              <div style={{ fontSize: 12, color: '#555' }}>Like {profile.name}&apos;s profile to connect and discuss.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
