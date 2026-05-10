# Migration Brief — Landing Page into App Branch

Read this fully before writing a single line of code. This was written in a separate session on the `landing-page` branch with full knowledge of both codebases.

---

## Repo & Worktree Structure

This is **one git repo** with three branches checked out as worktrees on the same machine:

| Local Path | Branch | Role |
|---|---|---|
| `C:\Users\joelj\OneDrive\Documents\weld-app` | `app` | **You are here** — full app |
| `C:\Users\joelj\OneDrive\Documents\weld-landing` | `landing-page` | New landing/waitlist site |
| `C:\Users\joelj\OneDrive\Documents\weld-old-landing` | `main` | Old — ignore entirely |

Because they're on the same machine, you can read any file from the landing-page branch using its full path. You don't need to switch branches or copy anything via git — just read from `weld-landing` and write into `weld-app`.

Both branches are deployed separately on Vercel. After this migration, the app branch becomes the single deployment for both the landing page and the app.

---

## Goal

1. Fully replace the app branch's old landing page with the new one from the landing-page branch
2. Lock all real app routes behind a route guard (middleware), with an allowlist for the founder + co-founder
3. Update the invite experience page (`/invite/[code]`) to show an auth prompt and the real ProfileBuilder once logged in
4. Keep everything else in the app branch (swipe, profile, messages, etc.) untouched

---

## Critical Issue to Understand First

The app branch currently has its landing page in `src/dynamic landing page/` (folder name with **spaces**). The landing-page branch has it in `src/dynamic-landing-page/` (folder name with **hyphens**). These are different paths.

The app's `tsconfig.json` only defines `"@/*": ["./src/*"]`. This means `@/dynamic landing page/...` imports only work because Next.js resolves them through the filesystem (spaces in folder names get handled by the OS). After migration, everything will use `@/dynamic-landing-page/` (hyphen) and the imports in `src/app/page.tsx`, `src/app/studios/page.tsx`, and `src/app/invite/[inviteCode]/page.tsx` must all be updated accordingly.

---

## Already Done (do not redo)

### `/signup` → `/accountsignup` rename
The app's account creation route was renamed to avoid conflicting with the landing page's waitlist `/signup` route. These changes are already committed in the app branch:
- `src/app/signup/` folder → renamed to `src/app/accountsignup/`
- `src/components/account/AuthForm.tsx` line 45: `switchHref` changed from `'/signup'` to `'/accountsignup'`
- `src/components/profile/ProfileBuilder.tsx` line 100: `href` changed from `'/signup'` to `'/accountsignup'`

---

## Step-by-Step Plan

---

### Step 1 — Delete the old landing page folder

Delete the entire folder:
```
C:\Users\joelj\OneDrive\Documents\weld-app\src\dynamic landing page\
```
Everything inside it gets replaced. Do not preserve any files from it.

---

### Step 2 — Copy the new landing page folder

Copy the entire folder from:
```
C:\Users\joelj\OneDrive\Documents\weld-landing\src\dynamic-landing-page\
```
To:
```
C:\Users\joelj\OneDrive\Documents\weld-app\src\dynamic-landing-page\
```

The exact files inside (copy all of them):
```
components\FloatingStudioWindow.tsx
components\InviteExperience.tsx
components\LuauWatermarkLayer.tsx
components\MarketingPage.tsx
components\ParticleCanvas.tsx
components\ProofVisitCounter.tsx
components\RobloxProofBadge.tsx
components\primitives\DoodleBubble.tsx
components\primitives\DoodleNote.tsx
components\primitives\MatchMeter.tsx
components\primitives\Sticker.tsx
lib\browser.ts
lib\constants.ts
lib\copy.ts
lib\local-store.ts
lib\role-config.ts
lib\sample-data.ts
lib\service.ts
lib\source-variant.ts
lib\supabase.ts
lib\types.ts
lib\useMotionPolicy.ts
lib\utils.ts
lib\WeldPageState.tsx
routes\HomePage.tsx
routes\InvitePage.tsx
routes\LegacySignupPage.tsx
routes\StudiosPage.tsx
```

---

### Step 3 — Copy the data folder

Copy:
```
C:\Users\joelj\OneDrive\Documents\weld-landing\src\data\marqueeProfiles.ts
C:\Users\joelj\OneDrive\Documents\weld-landing\src\data\marqueeStudios.ts
```
To:
```
C:\Users\joelj\OneDrive\Documents\weld-app\src\data\marqueeProfiles.ts
C:\Users\joelj\OneDrive\Documents\weld-app\src\data\marqueeStudios.ts
```
Create the `src/data/` folder if it doesn't exist.

---

### Step 4 — Update the three landing page route files

These three files in the app branch import from the old spaced path. Replace their contents entirely:

**`src/app/page.tsx`** — replace with:
```typescript
export { metadata } from "@/dynamic-landing-page/routes/HomePage";
export { default } from "@/dynamic-landing-page/routes/HomePage";
```

**`src/app/studios/page.tsx`** — replace with:
```typescript
export { metadata } from "@/dynamic-landing-page/routes/StudiosPage";
export { default } from "@/dynamic-landing-page/routes/StudiosPage";
```

**`src/app/invite/[inviteCode]/page.tsx`** — replace with:
```typescript
export { dynamic } from "@/dynamic-landing-page/routes/InvitePage";
export { default } from "@/dynamic-landing-page/routes/InvitePage";
```

---

### Step 5 — Replace overlapping page routes

Copy these files from the landing-page branch, overwriting the app branch versions:

| From (weld-landing) | To (weld-app) |
|---|---|
| `src/app/signup/page.tsx` | `src/app/signup/page.tsx` |

Note: `/invite/[inviteCode]/page.tsx` and `/studios/page.tsx` were already handled in Step 4. The `/signup` page here is the **waitlist form** — not account creation (that now lives at `/accountsignup`).

---

### Step 6 — Replace overlapping API routes

Copy these from the landing-page branch (`weld-landing/src/app/api/`) to the app branch (`weld-app/src/app/api/`), overwriting existing files:

| Route | Action |
|---|---|
| `api/waitlist/route.ts` | Replace |
| `api/waitlist/signup/route.ts` | Replace |
| `api/waitlist/check/route.ts` | Copy (new — doesn't exist in app branch yet) |
| `api/invite/[inviteCode]/route.ts` | Replace |
| `api/invite/[inviteCode]/share/route.ts` | Replace |
| `api/profile-draft/route.ts` | Replace |
| `api/events/route.ts` | Replace |
| `api/roblox-proxy/route.ts` | Replace |

**Do NOT touch these app-only API routes:**
```
api/account/profile/route.ts
api/admin/reset-profiles/route.ts
api/home/matches/route.ts
api/messages/route.ts
api/messages/conversations/route.ts
api/messages/[id]/route.ts
api/swipe/route.ts
api/swipe/profiles/route.ts
```

---

### Step 7 — Merge CSS

This is the most delicate step. Read carefully.

**Current state:**
- `weld-app/src/app/globals.css` — 3,863 lines. Has `@tailwind` directives at lines 395–397. Has app-specific styles.
- `weld-landing/src/app/globals.css` — 14,072 lines. Also has `@tailwind` directives at lines 395–397. Has all the landing page styles.

**What to do:**
1. Take the landing-page branch `globals.css` (14,072 lines) as the new base
2. Open the app branch `globals.css` and extract these sections:
   - **`.auth-` classes**: lines 2201–2391 (AuthForm styles)
   - **`.pb-` classes**: lines 827–3857 (ProfileBuilder styles)
   - **`.mp-` classes**: lines 145–352 (matching preview styles)
3. Append those extracted sections to the end of the landing-page `globals.css`
4. Write the result as the new `weld-app/src/app/globals.css`

**Do not duplicate the `@tailwind` directives** — they already exist in the landing-page CSS at lines 395–397. The extracted app sections should just be appended after line 14,072.

---

### Step 8 — Fix the duplicate next.config

The app branch has both `next.config.mjs` and `next.config.ts`. This will cause a warning. Delete `next.config.ts` (it's empty) and keep `next.config.mjs`.

---

### Step 9 — Add environment variables

The landing-page's service layer (`dynamic-landing-page/lib/supabase.ts`) uses server-side admin Supabase credentials that are different from what the app currently has. Add these to `weld-app/.env.local`:

```
SUPABASE_URL=https://zcezjycnzmfciuxomaie.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<get this from Supabase dashboard → Settings → API → service_role secret>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

The `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are already in `.env.local` — do not remove them.

---

### Step 10 — Create the route guard middleware

Create a new file: `weld-app/src/middleware.ts`

**No middleware.ts exists in either branch right now** — this is entirely new.

**Logic:**
- If the request is for a blocked app route AND the user is not on the allowlist → redirect to `/`
- If the user IS on the allowlist (valid Supabase session + email in allowlist array) → let through
- All landing page routes are always open

**Blocked routes (require allowlist):**
```
/home
/swipe
/profile
/account
/messages
/preview
/login
/accountsignup
```

**Always open (no check):**
```
/                    (landing page)
/studios             (studios landing)
/signup              (waitlist form)
/invite/:code        (invite experience)
/api/*               (all API routes)
/_next/*             (Next.js internals)
/favicon.ico
/Assets/*
/public/*
```

**Auth method:** The app uses Supabase. For middleware, use `@supabase/ssr` to read the session from cookies. Check `src/lib/supabase/browser.ts` and `src/lib/supabase/server.ts` for how the app currently handles auth — replicate the same pattern in middleware.

**Allowlist:** Ask the user for the two email addresses before writing this file. Store them as a hardcoded array in the middleware for now.

**Important:** The middleware must run on the Edge runtime (Next.js middleware requirement). Do not import anything that uses Node.js APIs.

---

### Step 11 — Update the invite experience page

The current `InviteExperience.tsx` (copied from the landing-page branch in Step 2) has its own simplified profile form. This needs to be replaced with auth-gated access to the real `ProfileBuilder`.

**The updated `/invite/[code]` page behaviour:**

**State 1 — Not logged in:**
- Show the invite confirmation ("You're on the list", referral share link)
- Show a clear section prompting them to create an account or log in
- "Create your account" → links to `/accountsignup`
- "Already have an account? Log in" → links to `/login`
- Pass the invite code as a query param so they can return: `/accountsignup?invite=[code]` and `/login?invite=[code]`

**State 2 — Logged in:**
- Show the invite confirmation + referral section (keep this always visible)
- Show the real `ProfileBuilder` component from `src/components/profile/ProfileBuilder.tsx`
- Leave a placeholder section for referral count (label it "Referrals — coming soon")

**How to detect auth state on the invite page:**
The `InviteExperience.tsx` is a client component. Use `getBrowserSupabase()` from `@/lib/supabase/browser` (already in the app branch at `src/lib/supabase/browser.ts`) to check the session:
```typescript
import { getBrowserSupabase } from '@/lib/supabase/browser'
const supabase = getBrowserSupabase()
const { data: { session } } = await supabase.auth.getSession()
```

**ProfileBuilder props (all optional):**
```typescript
<ProfileBuilder
  onPublished={(profile) => { /* handle published */ }}
  initialPhase="identity"
/>
```

**Linking waitlist to account:**
When a logged-in user lands on `/invite/[code]`, look up the `waitlist_leads` record for that invite code. If the user's Supabase auth email matches the lead's email, the link is already implicit — same email = same person. No extra DB writes needed for the basic case.

---

## Key Decisions (Do Not Re-litigate These)

- **Full replacement**: Old landing page deleted entirely. No merging of the two MarketingPage versions.
- **Folder naming**: `dynamic-landing-page` (hyphen). Never `dynamic landing page` (space).
- **`/signup` = waitlist form**. `/accountsignup` = Supabase account creation. These must not be swapped.
- **Invite page auth**: No new auth UI built. Link to existing `/accountsignup` and `/login` pages.
- **Profile builder on invite page**: Use the real `ProfileBuilder` from `src/components/profile/ProfileBuilder.tsx`. Not a simplified form.
- **Route guard**: Allowlist by Supabase session email. Hardcoded array for now.
- **CSS**: Landing-page CSS is the base. App-specific styles appended at the end.
- **After login on `/accountsignup`**: The existing `AuthForm` currently redirects to `/home` after signup/login. This should be updated to redirect back to the invite page if a `?invite=[code]` query param is present.

---

## Supabase Setup

Both branches use the **same Supabase project**: `https://zcezjycnzmfciuxomaie.supabase.co`

The app branch uses two sets of credentials:
- **Client-side (anon key)**: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` — already in `.env.local`, used by `src/lib/supabase/browser.ts`
- **Server-side (service role)**: `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` — needs to be added to `.env.local`, used by `src/dynamic-landing-page/lib/supabase.ts` for waitlist admin operations

## ProfileBuilder Dependencies

`ProfileBuilder` uses these imports — all already exist in the app branch and will resolve correctly:
```typescript
import { getBrowserSupabase, hasBrowserSupabaseConfig } from '@/lib/supabase/browser'
import type { PreviewProfile } from '@/components/matching-preview/preview-types'
// + relative imports from ./steps/ and ./editor-panels/ subdirectories
```
No changes needed to ProfileBuilder itself.

---

## First Thing To Do

**Ask the user for the two allowlist email addresses** before starting anything. You need these for Step 10. Then proceed in order from Step 1.
