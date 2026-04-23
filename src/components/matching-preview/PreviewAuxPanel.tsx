'use client'

import { PreviewProfile } from './preview-types'

interface Props {
  profile: PreviewProfile
  side: 'left' | 'right'
}

export default function PreviewAuxPanel({ profile, side }: Props) {
  const isDev = profile.type === 'dev'

  return (
    <div
      className="flex flex-col gap-3 w-[200px] flex-shrink-0 py-4"
      style={{ color: '#FFF7F1' }}
    >
      {isDev ? (
        <>
          {/* Portfolio links */}
          {profile.portfolioLinks && profile.portfolioLinks.length > 0 && (
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-500 mb-2">Portfolio</p>
              <div className="flex flex-col gap-1.5">
                {profile.portfolioLinks.map(link => (
                  <div
                    key={link.label}
                    className="flex justify-between items-center px-3 py-2 rounded-xl"
                    style={{ border: '1px solid rgba(255,250,247,.08)', background: 'rgba(255,250,247,.03)' }}
                  >
                    <span className="text-[11px] font-medium text-white/80">{link.label}</span>
                    <span className="text-[10px] text-[#E84624] truncate max-w-[80px]">{link.url}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Socials */}
          {profile.socials && profile.socials.length > 0 && (
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-500 mb-2">Socials</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.socials.map(s => (
                  <span
                    key={s.label}
                    className="text-[11px] px-3 py-1.5 rounded-full"
                    style={{ border: '1px solid rgba(255,250,247,.10)', color: 'rgba(255,247,241,.7)' }}
                  >
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-500 mb-2">Quick stats</p>
            <div className="flex flex-col gap-1.5">
              {profile.stats.map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-[11px] text-gray-500">{label}</span>
                  <span className="text-[11px] font-bold text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Hiring needs */}
          {profile.hiringNeeds && profile.hiringNeeds.length > 0 && (
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-500 mb-2">Now hiring</p>
              <div className="flex flex-col gap-2">
                {profile.hiringNeeds.map(need => (
                  <div
                    key={need.role}
                    className="px-3 py-2.5 rounded-xl"
                    style={{ border: '1px solid rgba(255,250,247,.08)', background: 'rgba(255,250,247,.03)' }}
                  >
                    <p className="text-[11px] font-semibold text-[#FFBE74] mb-0.5">{need.role}</p>
                    <p className="text-[10px] text-gray-500 leading-relaxed">{need.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Studio stats */}
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-500 mb-2">Studio stats</p>
            <div className="flex flex-col gap-1.5">
              {profile.stats.map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-[11px] text-gray-500">{label}</span>
                  <span className="text-[11px] font-bold text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
