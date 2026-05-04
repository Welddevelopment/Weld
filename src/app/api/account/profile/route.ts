import { NextRequest, NextResponse } from 'next/server'

import { getSupabaseUserFromRequest } from '@/lib/supabase/server'

export const maxDuration = 30

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

export async function GET(request: NextRequest) {
  const auth = await getSupabaseUserFromRequest(request)

  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status })
  }

  const { data, error } = await auth.client
    .from('user_profiles')
    .select('profile_draft,published_profile,updated_at')
    .eq('user_id', auth.user.id)
    .maybeSingle()

  if (error) {
    return NextResponse.json(
      { ok: false, message: 'Could not load your profile.' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    ok: true,
    profile: data
      ? {
          draft: data.profile_draft,
          publishedProfile: data.published_profile,
          updatedAt: data.updated_at,
        }
      : null,
  })
}

export async function PUT(request: NextRequest) {
  const auth = await getSupabaseUserFromRequest(request)

  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status })
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!isRecord(body)) {
    return NextResponse.json({ ok: false, message: 'Invalid request body.' }, { status: 400 })
  }

  const payload: Record<string, unknown> = {
    user_id: auth.user.id,
    updated_at: new Date().toISOString(),
  }

  if ('draft' in body) {
    if (!isRecord(body.draft)) {
      return NextResponse.json({ ok: false, message: 'Invalid profile draft.' }, { status: 400 })
    }
    payload.profile_draft = body.draft
  }

  if ('publishedProfile' in body) {
    if (!isRecord(body.publishedProfile)) {
      return NextResponse.json({ ok: false, message: 'Invalid published profile.' }, { status: 400 })
    }
    payload.published_profile = body.publishedProfile
  }

  if (!('profile_draft' in payload) && !('published_profile' in payload)) {
    return NextResponse.json({ ok: false, message: 'Nothing to save.' }, { status: 400 })
  }

  const { data, error } = await auth.client
    .from('user_profiles')
    .upsert(payload, { onConflict: 'user_id' })
    .select('profile_draft,published_profile,updated_at')
    .single()

  if (error) {
    return NextResponse.json(
      { ok: false, message: 'Could not save your profile.' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    ok: true,
    profile: {
      draft: data.profile_draft,
      publishedProfile: data.published_profile,
      updatedAt: data.updated_at,
    },
  })
}
