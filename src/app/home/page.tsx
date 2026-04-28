import AppNav from '@/components/AppNav'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0c0e0f]">
      <AppNav />
      <main className="flex flex-1 flex-col items-center justify-center text-white/60">
        <p className="font-mono text-sm uppercase tracking-[0.16em]">More coming soon</p>
      </main>
    </div>
  )
}
