'use client'

import type { PreviewProfile } from '@/components/matching-preview/preview-types'
import SwipeCard from '@/components/SwipeCard'

interface Props {
  profile: PreviewProfile
  onContinue: () => void
  onBack: () => void
  isLast: boolean
}

export default function ProfilePreviewScreen({ profile, onContinue, onBack, isLast }: Props) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(6px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 20, padding: 24,
    }}>
      <div style={{
        fontFamily: 'var(--font-geist-mono)', fontSize: 10, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 999, padding: '5px 14px',
      }}>
        Profile preview
      </div>

      <SwipeCard profile={profile} />

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            fontFamily: 'var(--font-geist-mono)', fontSize: 11, letterSpacing: '0.1em',
            textTransform: 'uppercase', padding: '10px 22px', borderRadius: 999,
            border: '1.5px solid rgba(255,255,255,0.14)', background: 'transparent',
            color: 'rgba(255,255,255,0.55)', cursor: 'pointer',
          }}
        >
          ← Edit
        </button>
        <button
          type="button"
          onClick={onContinue}
          style={{
            fontFamily: 'var(--font-geist-mono)', fontSize: 11, letterSpacing: '0.1em',
            textTransform: 'uppercase', padding: '10px 28px', borderRadius: 999,
            border: '1.5px solid #E84624', background: 'rgba(232,70,36,0.15)',
            color: '#E84624', cursor: 'pointer',
          }}
        >
          {isLast ? 'Publish profile' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}
