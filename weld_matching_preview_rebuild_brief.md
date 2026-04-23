
# WELD MATCHING PREVIEW REBUILD BRIEF (FOR CLAUDE CODE)

## Purpose

Recreate the **matching preview** from `weldroblox.com`, but rebuild it properly for the **Next.js app** so it is:

- component-based
- driven by props/state instead of DOM manipulation
- easy to restyle later
- easy to connect to real user/profile data later
- not a static marketing-site implementation

This is **not** a request to port raw HTML/CSS/JS line-by-line.

Instead, use the existing waitlist matching preview as a **behavior + UI reference**, then rebuild it in a clean React/Next.js structure.

---

## Core context

Weld is a Tinder-style matching product for Roblox developers and studios. The waitlist site is a **single static HTML/CSS/JS landing page**, while the app is a **Next.js App Router app** with reusable components and future Supabase integration. The swipe feed is intended to show one centered profile card with actions, and the detailed profile experience belongs in an expanded view/profile route later. The existing waitlist matching preview already includes:

- a stacked hero preview
- randomized opening into a selected profile
- pass / like interactions
- an expanded modal with a centered main card
- auxiliary left/right panels for extra information in newer versions
- separate developer vs studio render logic

Do **not** preserve the current implementation style from the waitlist site. Preserve the **product feel** and **information hierarchy**.

---

## What to carry over from the waitlist preview

### 1. Card content hierarchy

Carry over the **structure of the card content**, not the code:

- avatar
- name
- badge (`Verified`, `Pro`, `Studio`, etc.)
- short tagline / short bio
- skill tags
- status line
- quick stats row

The existing preview cards render top identity info (`fc-top`, `fc-avatar`, `fc-name`, `fc-badge`), then tagline / bio (`fc-tagline`, `fc-bio-box`), then tags, then meta + stats. Keep this content hierarchy because it makes the card instantly readable.

### 2. Stack behavior

Carry over the idea of:

- a visible front card
- one or more cards behind it
- slight scale/offset/opacity difference
- active card hovering / floating slightly
- a shuffled / randomized “pick one and open it” moment

The current preview achieves this with stacked `.fc` cards inside the hero preview stack and a `shuffleAndOpen()` flow. Rebuild the effect in React state.

### 3. Expanded detail experience

Carry over the idea that clicking a card opens a more detailed experience.

The waitlist implementation opens a modal and paints:

- a centered main profile card
- neighboring slots for extra context
- in newer versions, left/right auxiliary panels for developer or studio details

In the app rebuild, keep this as a **clean expandable detail view**, but do not hardcode it as a giant DOM-driven carousel. It should be structured so that the main swipe card can later open:

- a modal first
- and later a real `/profile/[id]` page if desired

### 4. Separate dev vs studio data rendering

Carry over the idea that devs and studios share a similar interaction system but render slightly differently.

The waitlist uses separate renderers for dev cards and studio cards, with different badge/meta/stat content. Rebuild this as a shared component model with variant rendering, not two disconnected systems.

### 5. Brand feel

Carry over the visual tone:

- warm coral/red Weld palette
- rounded cards
- premium stacked-card feeling
- slightly elevated, tactile interactions
- big, legible, high-signal information layout

Do not obsess over pixel-perfect parity. Preserve the **feel**.

---

## What NOT to carry over

### Do not copy raw implementation patterns

Do **not** carry over:

- direct DOM querying (`document.getElementById`, `querySelector`, etc.)
- global mutable arrays for card slots
- window-bound action functions
- inline `onclick` handlers
- marketing-site modal/carousel glue code
- hardwired HTML string builders
- giant CSS dumps copied directly into the app

The waitlist code is fine for a static landing page preview, but it is the wrong architecture for the app.

### Do not make it a static page

This rebuild must **not** be a single static page component that contains all data, styles, and behaviors in one place.

It should be modular and reusable.

### Do not overbuild backend integration yet

Do not connect Supabase yet.
Do not add auth yet.
Do not add real profile fetching yet.

Use mock data, but structure the code so real data can plug in later.

---

## Rebuild target

Build a **copy of the matching preview experience** for the app branch **for now**, but structure it for future evolution.

That means:

- mimic the current interaction and visual hierarchy closely enough to feel familiar
- rebuild it in React/Next.js using clean props + state
- make sure it can later be adapted into the real swipe feed and real profile detail system

---

## Recommended component structure

Create something close to this:

```ts
components/matching-preview/
  MatchingPreview.tsx
  PreviewStack.tsx
  PreviewCard.tsx
  PreviewExpandedModal.tsx
  PreviewAuxPanel.tsx
  preview-data.ts
  preview-types.ts
```

### Responsibilities

#### `MatchingPreview`
- top-level orchestrator
- holds mock profiles
- tracks current audience (`developer` or `studio`)
- handles open/close state for expanded view
- passes data to child components

#### `PreviewStack`
- renders the stacked hero preview
- handles the active/front card and background cards
- handles the “shuffle/open random card” behavior
- exposes `onOpen(profileId)`

#### `PreviewCard`
- renders a single preview card
- no business logic
- receives profile data via props
- supports dev/studio variants cleanly

#### `PreviewExpandedModal`
- handles open expanded state
- shows centered main detail panel/card
- can optionally show left/right auxiliary panels
- supports pass / like action buttons visually
- should be easy to replace later with a full profile page

#### `PreviewAuxPanel`
- reusable side panel for extra info
- dev version: skills, links, best work, etc.
- studio version: hiring roles, team, games, etc.

#### `preview-data.ts`
- clean mock profile objects
- no HTML strings
- easy to replace later with real database records

#### `preview-types.ts`
- shared TypeScript types
- future-proof for real data

---

## Data model guidance

Use structured mock data now.

Recommended shape:

```ts
export type PreviewProfileType = "dev" | "studio";

export type PreviewProfile = {
  id: string;
  type: PreviewProfileType;
  name: string;
  badge: string;
  avatarUrl?: string;
  robloxUserId?: number;
  tagline: string;
  bio: string;
  tags: string[];
  status: string;
  roleLine: string;
  stats: Array<{ label: string; value: string }>;
  accent?: string;
  socials?: Array<{ label: string; url: string }>;
  portfolioLinks?: Array<{ label: string; url: string }>;
  bestWork?: Array<{
    title: string;
    description: string;
    meta: string[];
  }>;
  hiringNeeds?: Array<{
    title: string;
    description: string;
  }>;
};
```

### Why this matters

The current waitlist preview uses HTML string builders and different mock objects for devs and studios.
In the app rebuild, the mock data must already look like something that can later come from:

- Supabase `profiles`
- Roblox enrichment data
- related `projects`, `roles`, or `portfolio` tables

So use a flexible typed object now.

---

## Interaction requirements

### A. Stack preview behavior

Recreate the waitlist hero preview behavior:

- show multiple stacked cards
- only the front card should feel active/clickable
- the front card can be hovered
- add a CTA button such as `Open preview` / `Try matching preview`
- when triggered, select a card and open the expanded state

You can simplify the current shuffle behavior if needed, but preserve the feeling that one card is being selected out of the stack.

### B. Expanded modal behavior

When a card is opened:

- show a centered main detail panel/card
- optionally show left/right side context panels
- allow close
- keep it controlled by React state
- allow keyboard escape to close if easy

### C. Action buttons

Preserve the visual intent of:

- pass
- chat (visual only if necessary)
- like

These do **not** need backend logic yet.
They just need to work as UI interactions in the preview.

### D. Variant rendering

Support:

- developer card content
- studio card content

The structure should be shared, but specific copy/stats may differ.

---

## Styling guidance

You may use:

- Tailwind classes
- CSS modules
- or a small scoped stylesheet

Preferred approach:
- Tailwind or component-scoped CSS
- avoid pasting the entire waitlist CSS file verbatim

### Important styling goals

- rounded stacked cards
- premium elevated shadows
- coral/red Weld accent color
- subtle card depth and scale changes
- easy responsiveness
- not visually brittle

### Important styling non-goals

- exact pixel parity with the current waitlist
- preserving every animation from the static site
- preserving the current marketing page layout assumptions

---

## Build philosophy

This rebuild must be shaped so it can later evolve into:

1. the actual swipe feed card system
2. the actual expanded profile view
3. a real data-driven component tree

So build for **adaptability**, not only for visual duplication.

---

## Specific carry-over mapping from waitlist to app rebuild

### Carry over directly as concepts

- `fc-top` → top identity row inside `PreviewCard`
- `fc-avatar` → avatar area in card component
- `fc-name` / `fc-badge` → primary identity labels
- `fc-tagline` / `fc-bio-box` → short summary section
- `fc-tags` → tag pills
- `fc-meta` / `fc-stats` → footer metadata and stat line
- stacked card hierarchy → `PreviewStack`
- modal open/close behavior → `PreviewExpandedModal`
- aux panel idea → `PreviewAuxPanel`

### Rebuild from scratch

- `buildCardHTML`
- `fillCard`
- `paintSlots`
- `shuffleAndOpen`
- `navModal`
- `passCard`
- `likeCard`
- `advanceAfterPass`
- `advanceAfterLike`

All of those should become React state transitions and component props, not DOM mutations.

---

## Future-proofing requirements

Structure the rebuild so that later we can replace mock data with real sources:

- `profiles` table from Supabase
- Roblox avatar/thumbnail data
- real status / rate / availability
- real project lists / portfolio links

So do **not** assume data is only static marketing copy.

Make the components accept typed profile props.

---

## Deliverable

Build a reusable app-side matching preview that:

- looks and feels like the current waitlist matching preview
- is component-based
- uses mock typed data
- avoids static-site patterns
- is ready to connect to real user/profile data later

---

## Final instruction

This is a **rebuild inspired by the waitlist preview**, not a direct code conversion.

Prioritize:

1. matching the feel
2. modular component structure
3. typed data flow
4. easy future adaptation

Do not prioritize:
- exact DOM parity
- exact CSS parity
- preserving the current static implementation patterns
