import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg,#fbfcff 0%,#eef3f8 54%,#f8fbff 100%)',
      padding: '24px',
      gap: '20px',
      textAlign: 'center',
    }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#1267d8', margin: 0 }}>
        404
      </p>
      <h1 style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic', fontSize: 40, color: '#081827', margin: 0, lineHeight: 1.15 }}>
        Page not found
      </h1>
      <p style={{ fontSize: 14, color: 'rgba(8,24,39,0.52)', maxWidth: 360, lineHeight: 1.7, margin: 0 }}>
        This link may have expired or the page was moved.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
        <Link
          href="/home"
          style={{
            borderRadius: 999, border: '1px solid rgba(18,103,216,0.35)',
            background: 'rgba(18,103,216,0.08)', padding: '10px 20px',
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.13em',
            textTransform: 'uppercase', color: '#1267d8', textDecoration: 'none',
          }}
        >
          Go home →
        </Link>
      </div>
    </div>
  )
}
