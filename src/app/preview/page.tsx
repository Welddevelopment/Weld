import AppNav from '@/components/AppNav'
import MatchingPreview from '@/components/matching-preview/MatchingPreview'

export default function PreviewPage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: '#0E0C09' }}>
      <AppNav />
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="mb-8 text-center">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-orange-500">
            Matching Preview
          </p>
          <h1
            className="text-4xl italic leading-tight text-[#FFF7F1]"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            Find your perfect match
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-sm text-gray-500">
            Select your role to browse the right profiles, then launch the full matching preview.
          </p>
        </div>
        <MatchingPreview />
      </div>
    </div>
  )
}
