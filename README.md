# weld. landing

Dynamic landing and waitlist site for weld., a Roblox talent marketplace.

The actual product app does not live in this repository. Keep this repo focused on marketing pages, the Google Sheets waitlist signup, and the lightweight hero preview.

## Getting Started

Run the local server:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Main Surfaces

- `/` developer landing page
- `/studios` studio landing page
- `/signup` Google Sheets waitlist signup form
- `/invite/[inviteCode]` invite/share flow
- `/api/waitlist`, `/api/events`, `/api/invite`, `/api/profile-draft`, `/api/roblox-proxy` support lightweight landing and invite analytics

## Key Files

- `src/dynamic-landing-page/components/MarketingPage.tsx`
- `src/components/matching-preview/SwipeCard.tsx`
- `src/app/globals.css`
- `src/dynamic-landing-page/lib/service.ts`

## Checks

```sh
npm run build
npm run typecheck
npm test
```
