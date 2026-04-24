import MatchingPreview from '@/components/matching-preview/MatchingPreview'

export default function PreviewPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center py-16 px-4"
      style={{ background: '#0E0C09' }}
    >
      <div className="text-center mb-8">
        <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-orange-500 mb-3">Matching Preview</p>
        <h1
          className="text-4xl italic text-[#FFF7F1] leading-tight"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          Find your perfect match
        </h1>
        <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
          Select your role to browse the right profiles, then launch the full matching preview.
        </p>
      </div>

      <MatchingPreview />
    </div>
  )
}
