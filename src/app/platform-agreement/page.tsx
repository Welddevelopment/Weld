import Link from 'next/link'

export const metadata = { title: 'Platform Agreement — weld.' }

export default function PlatformAgreementPage() {
  return (
    <main className="legal-shell">
      <div className="legal-panel">
        <Link href="/" className="auth-brand">weld.</Link>

        <div className="auth-copy">
          <span className="auth-eyebrow">Legal</span>
          <h1 className="auth-title">Platform Agreement</h1>
          <p className="auth-body">How studios and developers engage through weld. — Last updated: May 2026</p>
        </div>

        <div className="legal-card">
          <section className="legal-section">
            <h2>1. How weld. works</h2>
            <p>weld. connects Roblox game studios with developers. Studios post their open roles and hiring criteria; developers post their skills, experience, and portfolio. weld. surfaces matches — the rest of the relationship is between the studio and the developer.</p>
          </section>

          <section className="legal-section">
            <h2>2. For studios</h2>
            <p>By posting roles on weld., you confirm that the opportunity is real and that you have the authority to hire on behalf of your studio. You agree not to post misleading pay rates, non-existent roles, or roles that violate Roblox&apos;s Terms of Service. Studios are responsible for conducting their own vetting of developers before engagement.</p>
          </section>

          <section className="legal-section">
            <h2>3. For developers</h2>
            <p>By listing your profile on weld., you confirm that the information you provide — skills, experience, portfolio, and availability — is accurate. You agree not to misrepresent your work history or capabilities. Developers are responsible for agreeing on terms directly with studios before starting any project.</p>
          </section>

          <section className="legal-section">
            <h2>4. Payments and contracts</h2>
            <p>weld. does not process payments or hold funds. Any financial arrangement — hourly rates, per-project fees, revenue share, or otherwise — is agreed directly between the studio and the developer. We strongly recommend both parties confirm terms in writing before work begins. weld. is not responsible for payment disputes.</p>
          </section>

          <section className="legal-section">
            <h2>5. Intellectual property</h2>
            <p>Ownership of work created during an engagement is determined by the agreement between the studio and the developer. weld. has no claim over any work produced. We recommend studios and developers explicitly address IP ownership in their project agreement.</p>
          </section>

          <section className="legal-section">
            <h2>6. Disputes between users</h2>
            <p>weld. is not a mediator or arbitrator for disputes between studios and developers. If a dispute arises, the parties should first attempt to resolve it directly. weld. may remove users from the platform who repeatedly act in bad faith, but we do not adjudicate financial or contractual disputes.</p>
          </section>

          <section className="legal-section">
            <h2>7. Referrals</h2>
            <p>weld. operates an invite-based referral system. Referral rewards (if any) are subject to change and will be communicated through the platform. Attempting to game the referral system through fake accounts or fraudulent signups will result in account termination and forfeiture of any rewards.</p>
          </section>

          <section className="legal-section">
            <h2>8. Changes to this agreement</h2>
            <p>We may update this agreement as the platform evolves. We will notify users of material changes via email. Continued use of weld. after changes take effect constitutes acceptance.</p>
          </section>

          <section className="legal-section">
            <h2>9. Contact</h2>
            <p>Questions about this agreement? Email <a href="mailto:hello@weldroblox.com">hello@weldroblox.com</a>.</p>
          </section>
        </div>

        <p className="legal-footer-links">
          <Link href="/privacy">Privacy Policy</Link>
          <span>·</span>
          <Link href="/terms">Terms of Service</Link>
          <span>·</span>
          <Link href="/">Back to weld.</Link>
        </p>
      </div>
    </main>
  )
}
