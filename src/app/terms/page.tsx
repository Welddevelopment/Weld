import Link from 'next/link'

export const metadata = { title: 'Terms of Service — weld.' }

export default function TermsPage() {
  return (
    <main className="legal-shell">
      <div className="legal-panel">
        <Link href="/" className="auth-brand">weld.</Link>

        <div className="auth-copy">
          <span className="auth-eyebrow">Legal</span>
          <h1 className="auth-title">Terms of Service</h1>
          <p className="auth-body">Last updated: May 2026</p>
        </div>

        <div className="legal-card">
          <section className="legal-section">
            <h2>1. Acceptance</h2>
            <p>By creating an account on weld., you agree to these Terms of Service. If you do not agree, do not use the platform. We may update these terms from time to time — continued use after changes means you accept the updated terms.</p>
          </section>

          <section className="legal-section">
            <h2>2. Eligibility</h2>
            <p>weld. is intended for users who are at least 13 years old. By using the platform you confirm you meet this requirement. Studios using the platform to hire developers are responsible for ensuring any payments or contracts comply with applicable laws.</p>
          </section>

          <section className="legal-section">
            <h2>3. Your account</h2>
            <p>You are responsible for maintaining the security of your account credentials. Do not share your password. You are responsible for all activity that occurs under your account. Notify us immediately if you suspect unauthorised access.</p>
          </section>

          <section className="legal-section">
            <h2>4. Acceptable use</h2>
            <p>You may not use weld. to post false or misleading information, harass other users, spam, scrape data without permission, or engage in any activity that violates Roblox&apos;s Terms of Service. We reserve the right to suspend or terminate accounts that violate these rules.</p>
          </section>

          <section className="legal-section">
            <h2>5. Content you post</h2>
            <p>You retain ownership of content you post on weld. (portfolio links, bio, work history). By posting it, you grant weld. a non-exclusive licence to display it on the platform. Do not post content you do not have the right to share.</p>
          </section>

          <section className="legal-section">
            <h2>6. No employment relationship</h2>
            <p>weld. is a matching platform. We are not a party to any agreement between studios and developers. We do not guarantee any hiring outcome, payment, or project completion. Any contract or payment arrangement is solely between the studio and the developer.</p>
          </section>

          <section className="legal-section">
            <h2>7. Limitation of liability</h2>
            <p>weld. is provided &quot;as is.&quot; We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability to you shall not exceed the amount you have paid us in the past 12 months.</p>
          </section>

          <section className="legal-section">
            <h2>8. Governing law</h2>
            <p>These terms are governed by the laws of the jurisdiction in which weld. is registered. Disputes shall be resolved through binding arbitration where permitted by law.</p>
          </section>

          <section className="legal-section">
            <h2>9. Contact</h2>
            <p>Questions? Email <a href="mailto:hello@weldroblox.com">hello@weldroblox.com</a>.</p>
          </section>
        </div>

        <p className="legal-footer-links">
          <Link href="/privacy">Privacy Policy</Link>
          <span>·</span>
          <Link href="/platform-agreement">Platform Agreement</Link>
          <span>·</span>
          <Link href="/">Back to weld.</Link>
        </p>
      </div>
    </main>
  )
}
