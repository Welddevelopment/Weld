import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 10

// One-time admin route — delete after use.
// Call: POST /api/admin/reset-profiles
// Header: x-admin-secret: <value of ADMIN_RESET_SECRET env var>

export async function POST(request: NextRequest) {
  const secret = process.env.ADMIN_RESET_SECRET
  if (!secret) {
    return NextResponse.json({ ok: false, message: 'ADMIN_RESET_SECRET not set.' }, { status: 503 })
  }

  const provided = request.headers.get('x-admin-secret')
  if (provided !== secret) {
    return NextResponse.json({ ok: false, message: 'Unauthorized.' }, { status: 401 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    return NextResponse.json({ ok: false, message: 'Supabase service role not configured.' }, { status: 503 })
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { error } = await admin
    .from('user_profiles')
    .update({
      published_profile: null,
      profile_draft: null,
      updated_at: new Date().toISOString(),
    })
    .neq('user_id', '00000000-0000-0000-0000-000000000000')

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
