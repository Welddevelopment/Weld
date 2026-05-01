# Weld App — Codex Context Document

## What this app is

**Weld** is a Tinder-style matchmaking platform for Roblox game developers and studios. Developers swipe on studios (and vice versa) to find collaborators. Built with Next.js (App Router), Supabase, and Tailwind CSS.

---

## Tech Stack

- **Framework**: Next.js (App Router) — read `node_modules/next/dist/docs/` before writing Next.js code, this version may have breaking changes from training data
- **Auth + DB**: Supabase (`@supabase/supabase-js`)
- **Styling**: Tailwind CSS + a large hand-rolled CSS file at `src/app/globals.css` — most custom UI uses the `npc-*` and `pb-*` CSS class namespaces defined there
- **Fonts**: `var(--font-display)` (italic display), `var(--font-geist-mono)` (monospace), `var(--font-sans)` (body)
- **No component library** — all UI is custom

---

## Critical architectural constraint

**Only dev profiles exist.** Studio profile code has been stripped from the profile builder. The `ProfileDraft.type` is always forced to `'dev'` on load regardless of what's stored. Any code that branches on `isDev` in the profile builder is vestigial — assume dev-only.

---

## Key data types (`src/components/matching-preview/preview-types.ts`)

```ts
type PreviewProfileType = 'dev' | 'studio'

type TopGame = {
  emoji: string       // category label: 'Game' | 'Combat' | 'Build' | 'Art' | 'Tools' | 'VFX' | 'Audio' | 'World' | 'Launch'
  title: string
  desc: string
  plays: string       // total visits (display string e.g. "1.2M")
  topCcu: string      // peak concurrent users
  currentCcu: string  // current concurrent users
  imageUrl?: string   // 16:9 screenshot URL (Roblox screenshots are 768×432)
  gameUrl?: string    // Roblox game URL
}

type DevWork = {
  emoji: string       // same category labels as TopGame
  title: string
  desc: string
  tools: string       // comma-separated tool names
  time: string        // time taken
  amount: string      // value paid
  plays: string       // game plays
  imageUrl?: string   // project screenshot URL
}

type ProfileStats = {
  experience: string; projects: string; scriptsBuilt: string; onTime: string
}

type WorkSummary = {
  totalProjects: string; linesOfCode: string; totalHours: string; commitment: string
}

type PreviewProfile = {
  id: string
  type: PreviewProfileType
  robloxUserId: number
  bg: string          // CSS gradient string
  badge: string       // e.g. 'Verified'
  name: string
  role: string        // e.g. 'Developer - 3yr experience'
  bio: string
  tags: string[]
  meta: string        // e.g. 'Available Now - Rate: 800 Robux/hr - Remote'
  // Dev-only optional fields:
  skills?: Array<{ name: string; description: string }>
  portfolio?: { links: Array<{ name: string; url: string }> }
  bestWork?: DevWork[]
  socials?: Array<{ icon: string; label: string; url: string }>
  stats?: ProfileStats
  workSummary?: WorkSummary
  topGames?: TopGame[]
  // Studio-only (largely unused now):
  details?: string
  skillsNeeded?: Array<{ name: string; description: string }>
}
```

## Profile draft type (`src/components/profile/profile-types.ts`)

```ts
type ProfileDraft = {
  type: 'dev' | 'studio'   // always 'dev' in practice
  robloxUserId: number | null
  bg: string
  badge: string
  name: string
  bio: string
  experienceYears: number | null
  rateType: string | null
  rateAmount: string
  // Studio fields (unused): teamSize, status, budgetType, projectValue, details
  selectedSkills: Array<{ name: string; description: string }>
  portfolioLinks: Array<{ name: string; url: string }>
  socials: Array<{ icon: string; label: string; url: string }>
  bestWork: DevWork[]
  topGames: TopGame[]
}
```

Key functions in `profile-types.ts`:
- `createDraft()` — returns blank draft
- `profileToDraft(profile)` — hydrates a draft from a published PreviewProfile
- `draftToProfile(draft, id)` — converts draft → PreviewProfile for publishing

---

## Profile builder flow (`src/components/profile/ProfileBuilder.tsx`)

```
Phase: 'identity' → 'rate' → 'editor' → 'published'
```

- **identity**: `IdentityStep` — name, Roblox username, avatar bg
- **rate**: `RoleStep` — years of experience, rate type/amount
- **editor**: Live card editor (`EditableCard`) + side panels
- **published**: Overlay shown after publish

Props:
```ts
{
  onPublished?: (profile: PreviewProfile) => void
  onDelete?: () => Promise<void>
  initialPhase?: Phase   // pass 'editor' to skip quick steps
  onCancel?: () => void  // wire to return to published view
}
```

Panel state in ProfileBuilder (two independent slots):
```ts
const [leftPanel, setLeftPanel] = useState<null | 'games'>(null)
const [rightPanel, setRightPanel] = useState<null | 'work' | 'skills'>(null)
```

Editor layout: `[GamesEditPanel?] [EditableCard] [SkillsEditPanel? | WorkEditPanel?]`

---

## Card editor (`src/components/profile/EditableCard.tsx`)

The live-editable card shown in the editor phase. Props:
```ts
{
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  leftPanel: null | 'games'
  rightPanel: null | 'work' | 'skills'
  onToggleLeft: () => void
  onToggleRight: (p: 'work' | 'skills') => void
  onBack: () => void
  onBackLabel?: string
  onPublish: () => void
}
```

- Name and bio are inline-editable inputs/textareas
- Skill chips: clicking opens skills panel, × button removes skill, "+ Add skill" opens skills panel
- "Games" entry button → toggles left panel
- "My Work" entry button → toggles right panel

---

## Editor side panels

All three use `npc-panel` CSS class (380px wide, 628px tall, white bg, rounded).

### `src/components/profile/editor-panels/SkillsEditPanel.tsx`
- Grid of all available dev skills (from `DEV_SKILL_DESCS` in `preview-data.ts`)
- Select up to 5; textarea per skill for description
- Props: `{ draft, update, onClose }`

### `src/components/profile/editor-panels/GamesEditPanel.tsx`
- Lists `draft.topGames`, up to 5 entries
- **Collapsible category picker**: selecting a category auto-collapses the grid; a `pb-category-pill` button appears in the entry header showing the selected category + `···` — clicking it re-opens the grid
- Fields per entry: screenshot URL (16:9 preview), game name, Roblox game URL, description, visits/peak CCU/current CCU
- Props: `{ draft, update, onClose }`

### `src/components/profile/editor-panels/WorkEditPanel.tsx`
- Lists `draft.bestWork`, up to 3 entries
- Same collapsible category picker as GamesEditPanel
- Fields per entry: screenshot URL, project name, description, tools (comma-separated), time taken/value paid/game plays
- Props: `{ draft, update, onClose }`

---

## Swipe card (`src/components/SwipeCard.tsx`)

The card shown on the swipe screen. Props:
```ts
{
  profile: PreviewProfile
  dragOverlay?: 'like' | 'nope' | null
  dragOpacity?: number
  leftPanel?: 'games' | null
  rightPanel?: 'work' | { skill: string } | null
  onPass?: () => void
  onLike?: () => void
  onMessage?: () => void
  onOpenPanel?: (panel: PanelKind) => void
}

type PanelKind = 'games' | 'work' | { skill: string }
```

- Games button active state: `leftPanel === 'games'`
- Work button active state: `rightPanel === 'work'`
- Skill chip active state: derived from `rightPanel && typeof rightPanel === 'object'`

## Swipe stack (`src/components/SwipeStack.tsx`)

Manages drag/swipe gestures and panel state. Two independent panel slots:
```ts
const [leftPanel, setLeftPanel] = useState<null | 'games'>(null)
const [rightPanel, setRightPanel] = useState<null | 'work' | { skill: string }>(null)
```

Layout: `[GamesPanel?] [card drag container] [WorkPanel? | SkillPanel?]`

- Games opens LEFT of card
- Work and Skills open RIGHT of card
- Both can be open simultaneously
- Dragging is disabled while any panel is open

---

## Viewer panels (shown on swipe screen)

### `src/components/matching-preview/panels/GamesPanel.tsx`
- Full-width 16:9 thumbnail per game (Roblox screenshots are 768×432)
- Category-colored fallback when no imageUrl
- Shows: game title, Roblox URL link, visits/players/peak CCU stats, category tag chip, description
- CSS classes: `npc-game-item`, `npc-game-thumb` (16:9 `aspect-ratio`), `npc-game-copy`, `npc-game-title`, `npc-game-url`, `npc-game-stats`, `npc-game-stat`, `npc-game-tags`, `npc-game-tag`, `npc-game-desc`

### `src/components/matching-preview/panels/WorkPanel.tsx`
- 56×56px colored rounded square icon per project (shows imageUrl if available)
- Shows: title, description (2-line clamp), tool tag chips, time/amount/plays stats, arrow button
- Optional `workSummary` footer: 4-stat grid (totalProjects, linesOfCode, totalHours, commitment)
- CSS classes: `npc-work-item`, `npc-work-icon`, `npc-work-copy`, `npc-work-title`, `npc-work-desc`, `npc-work-tags`, `npc-work-tag`, `npc-work-stats`, `npc-work-stat`, `npc-work-arrow`, `npc-work-footer`

### `src/components/matching-preview/panels/SkillPanel.tsx`
- Detail view for a single skill

---

## CSS conventions (`src/app/globals.css`)

**Namespaces:**
- `npc-*` — swipe card, viewer panels, panel layout
- `pb-*` — profile builder UI (steps, editor, edit panels)

**Key layout classes:**
- `.npc-wrap` — outer wrapper for card + action bar (flex column)
- `.npc-card` — the visible card face (560px tall, 380px wide, white, rounded-2xl)
- `.npc-action-bar` — 68px bar below card (pass/message/like buttons)
- `.npc-editor-bar` — 68px bar below EditableCard (back/publish buttons) — **must stay 68px** to align with side panels
- `.npc-stack-row` — flex row for `[left-panel] [card] [right-panel]` layout; gap and alignment set here
- `.npc-panel` — 380px × 628px white panel (same height as card+action-bar)
- `.npc-panel-hd` — panel header (back button, title, subtitle)
- `.npc-panel-body` — scrollable panel body (scrollbar hidden)

**Edit panel classes:**
- `.pb-entry-card` — white card wrapper for each game/work entry
- `.pb-entry-card-header` — flex row: label + category pill + remove button
- `.pb-category-pill` — indigo-tinted capsule button showing selected category + `···`; clicking toggles the category grid
- `.pb-category-pill-dots` — the `···` suffix inside the pill
- `.pb-emoji-row` / `.pb-emoji-btn` / `.pb-emoji-btn--on` — category picker grid (3-col, shown/hidden via state)
- `.pb-panel-input` / `.pb-panel-textarea` — inputs with red placeholder text when empty (`:not(:placeholder-shown)` trick)
- `.pb-panel-row3` — 3-column equal-width input row
- `.pb-image-row` — container for screenshot URL input + preview
- `.pb-image-preview` — 16:9 aspect-ratio image preview box
- `.pb-edit-add-btn` — dashed "add" button at bottom of entry list

**Important specificity fix:** `.npc-panel` has `color: #111` explicitly set because it renders inside `.pb-form-shell` which sets `color: #f0f0f0`. Without this, all panel text is invisible.

---

## Profile page routing (`src/app/profile/page.tsx`)

```
mode: 'loading' | 'unauthed' | 'published' | 'editing'
```

- `editing` mode renders `<ProfileBuilder>` full-screen (before AppNav)
- When user has an existing published profile and clicks Edit: `initialPhase='editor'`, `onCancel={() => setMode('published')}`
- When user has no profile yet: `initialPhase='identity'`, no `onCancel`
- On publish: `setMode('published')`, stores `publishedProfile` in state
- On delete: clears localStorage draft + calls DELETE `/api/account/profile`, resets to editing

---

## API routes

- `GET/PUT/DELETE /api/account/profile` — load/save/delete user profile (draft + publishedProfile)
- `GET /api/swipe/profiles` — returns profiles to swipe on (excludes own, already-swiped)
- `POST /api/swipe` — record a swipe (like/pass)
- `GET /api/home/matches` — return mutual likes
- `GET/POST /api/messages` — conversations
- `GET/POST /api/messages/[id]` — single conversation messages

---

## What's intentionally stripped / not used

- `TypeStep.tsx` — exists on disk but not imported anywhere; studio type selection removed
- `EditProfileModal.tsx` — exists on disk but not used; replaced by ProfileBuilder with `initialPhase='editor'`
- Studio-specific fields on ProfileDraft (`teamSize`, `status`, `budgetType`, `projectValue`, `details`) — present in type but never populated for dev profiles
- `PreviewCard`, `PreviewStack`, `PreviewAuxPanel`, `MatchingPreview` — older preview components, may be partially used in `/preview` route

---

## Pending / known issues

- The viewer panels (GamesPanel, WorkPanel) visual styling is still being iterated — the target aesthetic is the reference mockup (white cards, clean typography, Roblox-style game thumbnails at 16:9)
- `workSummary` on PreviewProfile is not populated via the profile builder yet — it's a manual NPC data field only
- `stats` (ProfileStats) on PreviewProfile is also NPC-only; real user profiles show `—` for scripts built and on-time rate
- Socials are stored in draft but the edit UI for socials hasn't been built into the new card editor yet
