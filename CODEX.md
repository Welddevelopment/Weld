# weld. Landing Page — Codex Context

## What this is
Landing page for **weld.** — a Roblox talent marketplace where developers build swipeable profile cards and studios find/match with them. Live at weldroblox.com.

## Stack
- **Next.js 14 App Router**, TypeScript
- **Single CSS file**: `src/app/globals.css` (~11 000 lines). All styles live here — no CSS modules, no Tailwind utility classes in components.
- No backend in this repo — it's the marketing/landing site. API calls go to the separate weld-app.

## Key files

| File | Role |
|---|---|
| `src/app/page.tsx` | Entry — re-exports from HomePage |
| `src/dynamic-landing-page/routes/HomePage.tsx` | Route wrapper, renders `<MarketingPage>` |
| `src/dynamic-landing-page/components/MarketingPage.tsx` | **Main landing page component** — navbar, hero, all sections |
| `src/components/matching-preview/SwipeCard.tsx` | The interactive swipe card shown in the hero |
| `src/app/globals.css` | All CSS. Sections are commented with `/* ── Name ── */` |
| `src/app/layout.tsx` | Root layout — just fonts + globals.css import, bare `<body>` |

## CSS architecture

The landing page wraps everything in `<div class="weld-glass-page">`. The design system is a liquid-glass / glassmorphism style (lavender/purple palette, backdrop-blur cards, frosted pill nav).

**Critical CSS classes:**
- `.weld-glass-page` — root wrapper, sets CSS vars + background
- `.glass-nav-shell` — sticky floating pill navbar (`position: sticky; top: 12px`)
- `.weld-glass-main` — scrollable content below the nav
- `.hero-shell.hero-shell-split` — hero section container
- `.hero-shell-grid` — CSS grid: card column left, copy column right
- `.npc-hero-preview-container` — wraps the SwipeCard in the hero (width: 380px, margin-inline: auto)
- `.npc-root` / `.npc-*` — all SwipeCard internal styles

**Responsive breakpoints** (max-width): 1140px → single-column hero; 820px → mobile nav/layout; 639px → small mobile.

**Large-screen zoom**: `.weld-glass-main` has `zoom: 1.15/1.35/1.6` at 1440/1920/2560px breakpoints (applied to main content only, NOT the navbar — this is intentional to avoid breaking `position: sticky`).

## Known gotchas

- **`overflow-x: hidden` on `html`/`body` breaks `position: sticky`** — always use `overflow-x: clip` instead. The globals.css has been fixed to use `clip` on html, body, and the mobile `@media (max-width: 639px)` rule.
- The CSS file has **multiple cascade blocks** for the same classes (`.weld-glass-page` appears many times as the design was layered). Later rules win on equal specificity. When adding styles, put them near the end or in the most specific existing block.
- `zoom` on any ancestor of a sticky element breaks sticky in Chromium — that's why zoom lives on `.weld-glass-main`, not `.weld-glass-page`.

## Current landing page sections (top → bottom)

1. **GlassNav** — sticky pill navbar with logo, developer/studio mode toggle, nav links, CTA
2. **HeroShell (split)** — SwipeCard preview (left) + headline copy + CTA (right)
3. **HowItWorksStrip** — 3-step explainer
4. **RoleTalentExplorer** — role tabs + matching profile cards
5. **ProfileCreationSection** — "build your card" pitch
6. Various proof/social-proof sections, anti-discord section, waitlist form, footer

## SwipeCard (hero preview)

The hero shows a non-interactive preview of a fake developer profile card (`SwipeCard.tsx`). Key details:
- Social buttons use inline SVG icons: Roblox (tilted square R, red), Discord (Clyde, blurple #5865f2), X (wordmark, black). Classes: `.npc-social-btn`, `.npc-social-roblox`, `.npc-social-discord`, `.npc-social-x`.
- The "Preview card | 0 sparks" header label has been removed.
- Card is 380px wide, centered in its hero column via `margin-inline: auto`.

## Dev commands

```bash
npm run dev    # local dev server (port 3000)
npm run build  # production build
```

---

## Planned feature: animated ambient background

**Goal:** Make the background feel alive without hurting legibility or performance. Two-part approach: slow-drifting ambient orbs + a grain texture overlay. No SVG turbulence/distortion — that hurts readability and performance on mid-range hardware.

### What exists today (don't delete, build on top)

- `.weld-glass-page` — multiple cascade blocks set the background; the **last one wins** and is around line 8667 in globals.css:
  ```css
  .weld-glass-page {
    background:
      radial-gradient(circle at 88% 14%, rgba(138,120,255,0.24), transparent 30%),
      radial-gradient(circle at 6% 46%, rgba(255,255,255,0.92), transparent 26%),
      radial-gradient(circle at 80% 88%, rgba(190,178,255,0.34), transparent 28%),
      repeating-linear-gradient(135deg, rgba(105,118,195,0.026) 0 2px, transparent 2px 32px),
      linear-gradient(180deg, #fbfcff 0%, #f0f2ff 50%, #f7f7ff 100%);
  }
  ```
- `.weld-glass-page::before` — `position: fixed; inset: 0; z-index: 0; pointer-events: none` — currently holds a static specular highlight. Safe to extend.
- `.weld-glass-page > *` — already has `position: relative; z-index: 1`, so all content sits above z-index 0 layers automatically.
- Existing palette: base `#fbfcff → #f0f2ff`, blob purples `rgba(138,120,255,…)` / `rgba(190,178,255,…)`, pink accent `rgba(255,180,220,…)`.

### Layer stack (back → front)

```
[1] Base gradient       — static (keep existing, just the linear-gradient part)
[2] Blob layer div      — position: fixed; 4 blurred divs, slow CSS keyframe drift
[3] ::before            — existing specular highlight (keep as-is, no animation needed)
[4] ::after             — SVG grain texture, fixed, ~3.5% opacity
[5] Page content        — z-index: 1 (already set)
```

### Step 1 — Blob layer (MarketingPage.tsx + globals.css)

Add a `<div className="wg-blob-layer" aria-hidden="true">` as the **first child** of the `.weld-glass-page` div in `MarketingPage.tsx`. Give it 4 children:

```tsx
<div className="wg-blob-layer" aria-hidden="true">
  <div className="wg-blob wg-blob-1" />
  <div className="wg-blob wg-blob-2" />
  <div className="wg-blob wg-blob-3" />
  <div className="wg-blob wg-blob-4" />
</div>
```

CSS in globals.css (add near end of file):

```css
.wg-blob-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.wg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  will-change: transform;
}

.wg-blob-1 {
  width: clamp(480px, 55vw, 800px);
  height: clamp(480px, 55vw, 800px);
  background: rgba(148, 120, 255, 0.36);
  top: -15%;
  left: -10%;
  animation: wgBlob1 22s ease-in-out infinite alternate;
}

.wg-blob-2 {
  width: clamp(400px, 48vw, 720px);
  height: clamp(400px, 48vw, 720px);
  background: rgba(190, 160, 255, 0.26);
  top: -5%;
  right: -12%;
  animation: wgBlob2 28s ease-in-out infinite alternate;
  animation-delay: -8s;
}

.wg-blob-3 {
  width: clamp(360px, 42vw, 660px);
  height: clamp(360px, 42vw, 660px);
  background: rgba(100, 130, 255, 0.20);
  bottom: 10%;
  right: -8%;
  animation: wgBlob3 24s ease-in-out infinite alternate;
  animation-delay: -14s;
}

.wg-blob-4 {
  width: clamp(300px, 38vw, 580px);
  height: clamp(300px, 38vw, 580px);
  background: rgba(255, 180, 220, 0.16);
  bottom: -10%;
  left: -5%;
  animation: wgBlob4 20s ease-in-out infinite alternate;
  animation-delay: -4s;
}

@keyframes wgBlob1 {
  0%   { transform: translate(0, 0) scale(1); }
  100% { transform: translate(9%, 7%) scale(1.07); }
}
@keyframes wgBlob2 {
  0%   { transform: translate(0, 0) scale(1.04); }
  100% { transform: translate(-7%, 10%) scale(0.94); }
}
@keyframes wgBlob3 {
  0%   { transform: translate(0, 0) scale(0.96); }
  100% { transform: translate(-9%, -8%) scale(1.06); }
}
@keyframes wgBlob4 {
  0%   { transform: translate(0, 0) scale(1); }
  100% { transform: translate(8%, -6%) scale(1.08); }
}

@media (prefers-reduced-motion: reduce) {
  .wg-blob { animation: none !important; }
}
```

Also update the final `.weld-glass-page { background: … }` block (line ~8667) to remove the static radial-gradient blobs from it — keep only the base linear-gradient and the grid pattern, since the blobs are now handled by the animated layer:

```css
/* replace the line ~8667 block with: */
.weld-glass-page {
  background:
    repeating-linear-gradient(135deg, rgba(105,118,195,0.022) 0 2px, transparent 2px 32px),
    linear-gradient(180deg, #fbfcff 0%, #f0f2ff 50%, #f7f7ff 100%);
}
```

### Step 2 — Grain texture (globals.css only)

Add to globals.css near end of file:

```css
.weld-glass-page::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.038;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 180px 180px;
}
```

This is a static inline SVG noise tile — no JS, no external asset, no animation. Just adds the tactile grain that makes the glass feel physical.

### What NOT to do

- **Don't apply `filter: url(#anything)` to `.weld-glass-page` itself** — creates a new stacking context and breaks `position: sticky` on the navbar.
- **Don't use SVG turbulence displacement on the blob layer** — too heavy on mid-range GPUs, distorts the blobs into shapes that compete with content.
- **Don't set `will-change: filter`** on any large element — forces the whole subtree into its own compositor layer.
- **Don't animate `backdrop-filter`** — not GPU-composited, causes full repaints.
- **Don't add `overflow: hidden` to `.wg-blob-layer`** — use `overflow: clip` if needed, or just let blobs bleed (they're blurred anyway).
