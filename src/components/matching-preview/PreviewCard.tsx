'use client'

import { PreviewProfile } from './preview-types'

interface Props {
  profile: PreviewProfile
  compact?: boolean
}

function getInitials(name: string) {
  return name.replace(/[^a-zA-Z ]/g, '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || name.slice(0, 2).toUpperCase()
}

export default function PreviewCard({ profile, compact }: Props) {
  const isStudio = profile.type === 'studio'

  return (
    <div
      className="flex flex-col w-full h-full rounded-[18px] overflow-hidden select-none"
      style={{
        background: 'linear-gradient(180deg, #1E1B16 0%, #16130E 100%)',
        border: '1px solid rgba(255,250,247,.10)',
        color: '#FFF7F1',
      }}
    >
      {/* Header gradient */}
      <div
        className="relative flex items-center justify-center flex-shrink-0"
        style={{ height: compact ? 72 : 90, background: profile.headerGradient }}
      >
        <div
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full font-bold text-white z-10"
          style={{
            width: compact ? 40 : 48,
            height: compact ? 40 : 48,
            fontSize: compact ? 14 : 17,
            background: 'rgba(255,255,255,0.18)',
            border: '3px solid #16130E',
            backdropFilter: 'blur(4px)',
          }}
        >
          {getInitials(profile.name)}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 px-4 pt-7 pb-3 gap-2 min-h-0">
        {/* Badge + name */}
        <div className="text-center">
          <span
            className="inline-block text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full mb-1"
            style={{ background: 'rgba(255,190,116,.12)', color: '#FFBE74' }}
          >
            {profile.badge}
          </span>
          <p
            className="text-[#FFF7F1] leading-tight italic"
            style={{
              fontFamily: 'var(--font-instrument-serif)',
              fontSize: compact ? 16 : 20,
            }}
          >
            {profile.name}
          </p>
          <p className="text-gray-500 text-[10px] mt-0.5">{profile.roleLine}</p>
        </div>

        {/* Tagline */}
        <p className="text-[10px] italic text-gray-400 text-center line-clamp-2 leading-relaxed px-1">
          "{profile.tagline}"
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 justify-center">
          {profile.tags.slice(0, compact ? 3 : 4).map(tag => (
            <span
              key={tag}
              className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(232,70,36,.12)', color: '#E84624' }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,250,247,.08), transparent)' }} />

        {/* Status + stats */}
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#3DC77A' }} />
          <span className="text-[10px] text-gray-400 truncate">{profile.status}</span>
        </div>

        {!compact && (
          <div className="grid grid-cols-3 gap-1 mt-0.5">
            {profile.stats.map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-white font-bold text-[11px]">{value}</p>
                <p className="text-gray-600 text-[9px]">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
