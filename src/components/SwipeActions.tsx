'use client'

interface Props {
  onPass: () => void
  onLike: () => void
  onSkip: () => void
}

export default function SwipeActions({ onPass, onLike, onSkip }: Props) {
  return (
    <div className="flex items-center gap-5">
      <button
        onClick={onPass}
        aria-label="Pass"
        className="w-14 h-14 rounded-full bg-white shadow-md border border-gray-100 text-red-500 text-2xl flex items-center justify-center active:scale-90 transition-transform"
      >
        ✕
      </button>
      <button
        onClick={onLike}
        aria-label="Like"
        className="w-16 h-16 rounded-full bg-black text-white text-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
      >
        ⚡
      </button>
      <button
        onClick={onSkip}
        aria-label="Skip"
        className="w-14 h-14 rounded-full bg-white shadow-md border border-gray-100 text-gray-400 text-xl flex items-center justify-center active:scale-90 transition-transform"
      >
        →
      </button>
    </div>
  )
}
