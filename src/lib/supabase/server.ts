import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'

type SupabaseAuthSuccess = {
  ok: true
  user: User
  accessToken: string
  client: SupabaseClient
}

type SupabaseAuthFailure = {
  ok: false
  status: number
  message: string
}

function getPublicSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return { url, anonKey }
}

function createRequestSupabase(accessToken: string) {
  const { url, anonKey } = getPublicSupabaseConfig()
  if (!url || !anonKey) return null

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  })
}

export async function getSupabaseUserFromRequest(
  request: NextRequest
): Promise<SupabaseAuthSuccess | SupabaseAuthFailure> {
  const authHeader = request.headers.get('authorization') ?? ''
  const accessToken = authHeader.match(/^Bearer\s+(.+)$/i)?.[1]

  if (!accessToken) {
    return { ok: false, status: 401, message: 'Sign in to continue.' }
  }

  const client = createRequestSupabase(accessToken)
  if (!client) {
    return { ok: false, status: 503, message: 'Supabase is not configured.' }
  }

  const { data, error } = await client.auth.getUser(accessToken)

  if (error || !data.user) {
    return { ok: false, status: 401, message: 'Your session has expired. Please log in again.' }
  }

  return {
    ok: true,
    user: data.user,
    accessToken,
    client,
  }
}
