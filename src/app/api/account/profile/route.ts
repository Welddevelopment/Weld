import { NextRequest, NextResponse } from 'next/server'

import { getSupabaseUserFromRequest } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/dynamic-landing-page/lib/supabase'

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

async function prefillFromWaitlist(email: string): Promise<Record<string, unknown> | null> {
  const admin = getSupabaseAdmin()
  if (!admin) return null

  const { data: lead } = await admin
    .from('waitlist_leads')
    .select('id, audience')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle()

  if (!lead) return null

  const { data: draftRow } = await admin
    .from('profile_drafts')
    .select('draft')
    .eq('lead_id', lead.id)
    .maybeSingle()

  const type = lead.audience === 'studio' ? 'studio' : 'dev'
  const identity = isRecord(draftRow?.draft) && isRecord(draftRow.draft.identity)
    ? draftRow.draft.identity as Record<string, unknown>
    : {}
  const proof = isRecord(draftRow?.draft) && isRecord(draftRow.draft.proof)
    ? draftRow.draft.proof as Record<string, unknown>
    : {}

  const name = String(identity.displayName ?? identity.studioName ?? '')
  const proofLink = String(proof.proofLink ?? '')
  const teamSize = proof.teamSize ? parseInt(String(proof.teamSize), 10) || null : null

  return {
    type,
    ...(name && { name }),
    ...(proofLink && { portfolioLinks: [{ name: 'Portfolio', url: proofLink }] }),
    ...(teamSize && { teamSize }),
  }
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

  if (data) {
    return NextResponse.json({
      ok: true,
      profile: {
        draft: data.profile_draft,
        publishedProfile: data.published_profile,
        updatedAt: data.updated_at,
      },
    })
  }

  // No account profile yet — try to prefill from waitlist signup
  const waitlistPrefill = auth.user.email
    ? await prefillFromWaitlist(auth.user.email).catch(() => null)
    : null

  return NextResponse.json({
    ok: true,
    profile: waitlistPrefill
      ? { draft: waitlistPrefill, publishedProfile: null }
      : null,
  })
}

export async function DELETE(request: NextRequest) {
  const auth = await getSupabaseUserFromRequest(request)

  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status })
  }

  const { error } = await auth.client
    .from('user_profiles')
    .update({
      published_profile: null,
      profile_draft: {},
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', auth.user.id)

  if (error) {
    return NextResponse.json({ ok: false, message: 'Could not delete your profile.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
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
