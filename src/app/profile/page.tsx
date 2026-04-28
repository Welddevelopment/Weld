import AppNav from '@/components/AppNav'
import RequireAuth from '@/components/RequireAuth'
import ProfileBuilder from '@/components/profile/ProfileBuilder'

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <AppNav />
      <RequireAuth>
        <ProfileBuilder />
      </RequireAuth>
    </div>
  )
}
