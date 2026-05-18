import Link from 'next/link'

export const metadata = { title: 'Privacy Policy — weld.' }

export default function PrivacyPage() {
  return (
    <main className="legal-shell">
      <div className="legal-panel">
        <Link href="/" className="auth-brand">weld.</Link>

        <div className="auth-copy">
          <span className="auth-eyebrow">Legal</span>
          <h1 className="auth-title">Privacy Policy</h1>
          <p className="auth-body">Last updated: May 2026</p>
        </div>

        <div className="legal-card">
          <section className="legal-section">
            <h2>1. What we collect</h2>
            <p>When you sign up for weld., we collect your email address and the information you choose to add to your profile — including your Roblox username, skills, work history, and portfolio links. We also collect standard usage data (pages visited, features used) to improve the platform.</p>
          </section>

          <section className="legal-section">
            <h2>2. How we use it</h2>
            <p>We use your information to operate weld. — matching developers with studios, sending you platform notifications and password reset emails, and improving our product. We do not sell your personal data to third parties.</p>
          </section>

          <section className="legal-section">
            <h2>3. Who can see your profile</h2>
            <p>Your public profile (name, skills, portfolio, availability) is visible to studios and developers on weld. who have access to the platform. Your email address is never shown publicly. You can control your visibility from your account settings.</p>
          </section>

          <section className="legal-section">
            <h2>4. Third-party services</h2>
            <p>weld. uses Supabase for authentication and data storage, Vercel for hosting, and Resend for transactional email. These services process your data as necessary to deliver the platform. We use Roblox&apos;s public API to fetch avatar images — no Roblox credentials are stored by us.</p>
          </section>

          <section className="legal-section">
            <h2>5. Data retention</h2>
            <p>We retain your account data for as long as your account is active. If you request account deletion, we will remove your personal data within 30 days. Some anonymised analytics data may be retained for product improvement.</p>
          </section>

          <section className="legal-section">
            <h2>6. Your rights</h2>
            <p>You can request a copy of your data, ask us to correct inaccurate information, or request deletion of your account at any time by contacting us. If you are in the EU or UK, you have additional rights under GDPR.</p>
          </section>

          <section className="legal-section">
            <h2>7. Contact</h2>
            <p>Questions about this policy? Email us at <a href="mailto:hello@weldroblox.com">hello@weldroblox.com</a>.</p>
          </section>
        </div>

        <p className="legal-footer-links">
          <Link href="/terms">Terms of Service</Link>
          <span>·</span>
          <Link href="/platform-agreement">Platform Agreement</Link>
          <span>·</span>
          <Link href="/">Back to weld.</Link>
        </p>
      </div>
    </main>
  )
}
