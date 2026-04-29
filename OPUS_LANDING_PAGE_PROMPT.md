# weld. Dynamic Landing Page — Claude Code Opus Improvement Prompt
## Developer-first. Studio-aware. Roblox Studio–native.

> **How to use this document:** Feed it to Claude Code Opus as a system prompt or task brief. Work through one Stage at a time. After each Stage, run the Review Gate before proceeding. Do not collapse stages — the review gates exist to catch drift before it compounds.

---

## CONTEXT: What weld. is

**weld.** is the talent network for Roblox. It matches Roblox developers with studios through a swipe-to-match mechanic inspired by how developers actually work — fast, asynchronous, proof-first.

**Primary audience:** Roblox developers (scripters, builders, artists, UI/UX, VFX, animators). Studios are the secondary audience. The toggle between the two modes already exists and must be preserved. Developer mode is the default and the hero experience.

**Core value proposition (from the static reference page):**
- "Swipe. Spark. Ship." — the triple-verb tagline
- "The talent network for Roblox. Link your games, set your rate, and match with studios that actually ship."
- Discord is the problem: noise, expired links, cold DMs, spam, no verification
- weld. is the solution: authenticated Roblox proof, swipe-to-match, no reaching out needed

**Existing sections (preserve all, improve each):**
1. Nav with audience toggle (dev / studio)
2. Hero — headline, sub, email capture, card fan / preview visual
3. Value strip — 3 stat/value items
4. Why section — problem/solution cards (Discord chaos → weld. proof)
5. How it works — scrollable steps + interactive swipe demo
6. For who — dev card + studio card
7. Proof section — Discord mess vs weld. verified profile table
8. FAQ — audience-toggled
9. Final CTA — email capture
10. Footer

**Existing tech stack (do not change the framework):**
- Next.js (non-standard build — read `node_modules/next/dist/docs/` before writing Next.js code)
- Primary file: `src/dynamic landing page/components/MarketingPage.tsx` (~3700 lines)
- State: `WeldPageState.tsx` — shared page state, `WeldRole`, `WeldOutputLog`, audience mode
- Supporting components: `FloatingStudioWindow`, `LuauWatermarkLayer`, `ParticleCanvas`, `RobloxProofBadge`, `ProofVisitCounter`
- Fonts already loaded: Instrument Serif (display/italic), Outfit (body), DM Mono (code/mono)

---

## DESIGN SYSTEM REFERENCE (read all five stage docs before coding)

All five stage documents are in the project root. Read them in order before touching any code:

```
Weld_Stage_1_Dynamic_Color_Token_System.docx      → color tokens + state semantics
Weld_Stage_2_Dynamic_LuaU_Typography_System.docx  → type roles + code surfaces
Weld_Stage_3_Dynamic_Motion_Interaction_System.docx → motion choreography
Weld_Stage_4_Dynamic_Component_Surface_System.docx → component patterns
Weld_Stage_5_Dynamic_Motifs_Polish_System.docx    → finishing, motifs, polish
Weld_Frontend_Design_Master_System.docx           → master philosophy (read first)
```

**Master oath (from the design system):** This is not a prettier static page. Every change must strengthen the page as a living interface: stateful, reactive, scroll-aware, keyboard-safe, and visibly connected through shared page state and Output logs. If an interaction changes something only locally, it is incomplete.

---

## THE TOKEN SYSTEM (Stage 1 — memorise before Stage 1 work)

Replace all existing CSS variables with this system. Do not invent new hex values.

```css
:root {
  /* Studio Dark — depth layers */
  --bg:            #090b14;  /* page void — body, behind all panels */
  --bg2:           #0e111c;  /* panel plane — cards, section shells */
  --bg-surface:    #131726;  /* raised Studio chrome — toolbars, headers */
  --bg-hover:      #1a1f30;  /* hover/selected row backing */
  --terminal-dark: #080b18;  /* code/output interior */

  /* Studio Blue — action + selection language */
  --studio-blue:      #00a2ff;  /* CTA, focus ring, selected row, active tab */
  --studio-blue-dark: #0077cc;  /* pressed/active depth */

  /* LuaU Syntax — semantic interface colors */
  --luau-keyword:  #c792ea;  /* labels, categories, role tags */
  --luau-string:   #f78c6c;  /* rates, handles, values */
  --luau-function: #82aaff;  /* secondary action labels */
  --luau-type:     #4ec9b0;  /* verified, success, proof-checked */
  --luau-variable: #c3e88d;  /* live, available, open */
  --luau-comment:  #546e7a;  /* timestamps, metadata, hints */

  /* Weld Heat — rare, high-intent only */
  --orange-hot:    #ff5a2d;  /* final CTA claim, invite slot — NEVER every button */

  /* Readable foreground */
  --cream:         #e8eaf6;  /* body text on dark, code text */

  /* State tokens — use these in components */
  --state-selected:      var(--studio-blue);
  --state-selected-fill: rgba(0,162,255,0.20);
  --state-focused:       var(--studio-blue);
  --state-focus-ring:    0 0 0 2px rgba(0,162,255,0.35);
  --state-verified:      var(--luau-type);
  --state-verified-fill: rgba(78,201,176,0.12);
  --state-live:          var(--luau-variable);
  --state-value:         var(--luau-string);
  --state-warning:       #ffb347;
  --state-error:         #ff4d6d;
  --state-claim:         var(--orange-hot);
  --state-noise:         #313338;  /* Discord surface */
}
```

**Token rules:**
- Orange-hot is claim heat only. Use `--studio-blue` for all system/nav actions.
- Selected state = Studio Blue + shape cue (border-left OR underline, never color alone).
- Verified state = `--luau-type` teal + text or icon (never color alone).
- Live/available = `--luau-variable` green.
- Metadata, timestamps = `--luau-comment` gray.

---

## STAGE 1 — Color Token Foundation + State Semantics

**Objective:** Replace the existing coral/ember palette with the Studio Dark / Studio Blue / LuaU token system. Wire state aliases so role selection, audience toggle, proof badges, and the CTA all speak the same color language.

### What to change

1. **globals.css / root variables:** Replace all existing `--weld-red`, `--coral`, `--sunset`, `--gold`, `--ink`, `--ink2`, `--ember-*` variables with the token system above. Keep the existing CSS variable names as aliases where components already reference them, mapping them to the new tokens (so no component breaks).

2. **Audience toggle pill:** Active state uses `--studio-blue` background and glow instead of the current coral gradient.

3. **Nav CTA button:** Switch from coral gradient to `--studio-blue`. Reserve `--orange-hot` only for the final hero CTA "Claim your spot" / "Spark now" context.

4. **Hero badge (the `TALENT_NETWORK` badge):** Use `--bg-surface` background, `--studio-blue` dot glow, `--luau-comment` label text.

5. **Why cards:** 
   - Problem cards: `--bg2` background, `--state-noise` (#313338) icon fill for the Discord/chaos icon
   - Solution cards: `--bg2` background, `--studio-blue` border-left accent, `--luau-type` icon stroke for verified proof

6. **Proof section comparison table:** Discord side uses `--state-noise` surface. weld. side uses `--state-verified-fill` rows with `--luau-type` check marks.

7. **State utility classes — add these globally:**
```css
.is-selected {
  background: var(--state-selected-fill);
  border-left: 2px solid var(--studio-blue);
  color: var(--cream);
}
.is-verified {
  background: var(--state-verified-fill);
  color: var(--luau-type);
}
.is-live { color: var(--luau-variable); }
.is-warning { color: var(--state-warning); }
.is-error { color: var(--state-error); }
:where(button,a,input,[tabindex]):focus-visible {
  outline: none;
  box-shadow: var(--state-focus-ring);
  border-color: var(--studio-blue);
}
```

8. **Scan for raw hex values** after implementation. Report any that aren't in the approved token list. Replace with the nearest semantic token.

### Output log events to emit on interactions

When the audience toggle switches, emit to `WeldOutputLog`:
```
[HH:MM:SS.mmm]  AUDIENCE_CONTEXT → developer | studio
```
When the hero form email changes state (valid → invalid), emit:
```
[HH:MM:SS.mmm]  EMAIL_VALIDATE → READY | INVALID_FORMAT
```

### Review Gate — STOP before Stage 2 and confirm all of the following

- [ ] Page renders without orange dominating — orange appears only in final CTA context
- [ ] Audience toggle active state is Studio Blue, not coral
- [ ] Nav CTA is Studio Blue (system action), hero submit CTA uses orange-hot or Studio Blue heat
- [ ] Focus rings are visible and use Studio Blue on all interactive elements
- [ ] Problem why-cards read as "Discord chaos" (dark, noise gray), solution why-cards read as "weld. order" (Studio Blue accent, teal verification)
- [ ] Proof table: Discord column uses `--state-noise` surface, weld. column uses `--state-verified-fill`
- [ ] No unexplained raw hex values remain in CSS
- [ ] Reduced-motion: color and border cues preserve meaning without animation
- [ ] The page now reads as Roblox Studio–native, not generic dark SaaS

---

## STAGE 2 — LuaU Typography + Code-Surface System

**Objective:** Every text surface that needs to feel Roblox-native should feel like Studio Output, Script Editor, Properties panel, or Explorer row — not a generic terminal or a SaaS marketing page.

### What to change

1. **Hero boot sequence (the `HERO_BOOT_LINES` Output panel):**

   Transform the existing boot log component into a proper `StudioOutputPanel`:
   - Header bar: `--bg-surface` background, mono label `OUTPUT` in `--luau-comment`, a colored status dot
   - Line number gutter: right-aligned mono digits in `--luau-comment` (e.g., `1`, `2`, `3`…)
   - Timestamp prefix: `--luau-comment` (`[12:04:01.001]`)
   - Severity coloring per `BootTone`:
     - `muted` → `--luau-comment`
     - `neutral` → `--cream`
     - `active` → `--studio-blue`
     - `success` → `--luau-type`
     - Warning → `--state-warning`
     - Error → `--state-error`
   - `READY_FOR_DISCOVERY` bold line: `--studio-blue` text, left `--studio-blue` border, `--state-selected-fill` background
   - The boot panel scrolls to the bottom as new lines append; `aria-live="polite"`

2. **How It Works — step code blocks:**

   Replace any existing code/terminal blocks with proper `LuaUSyntaxBlock` style:
   ```
   ┌─ Script Editor  [weld.roster.lua] ─────────────────────┐
   │  1  -- weld.roster: developer profile loaded            │
   │  2  local rate = "25 Robux/hr"    -- luau-string color  │
   │  3  local verified = true          -- luau-type color    │
   │  4  function matchStudio()         -- luau-function      │
   │  5    return weld.spark()                                │
   │  6  end                                                  │
   └─────────────────────────────────────────────────────────┘
   ```
   - Tabs across the top: `--bg-surface`, active tab uses `--studio-blue` underline + `--cream` text
   - Code body: `--terminal-dark` background
   - Syntax colors map to LuaU token vars (see Stage 1)
   - No looping shimmer on idle. Buttons may glow briefly on hover/focus only.

3. **Explorer Role Tree (the role selector in How It Works or For Who section):**

   Replace pill-style role buttons with an Explorer-tree-style row component:
   ```
   ▼ Roles
     ├─ 🔷 Scripter          [2 matches]
     ├─ 🟣 Builder           [5 matches]  ← selected row (blue fill + left rail)
     ├─ 🟤 UI/UX             [1 match]
     └─ ◻  Artist            [4 matches]
   ```
   - Row background: `--bg-surface`
   - Hover: `--bg-hover`
   - Selected: `--state-selected-fill` + `2px left border --studio-blue`
   - Role icon colors use LuaU keyword palette
   - Selection emits `ROLE_SELECTED` to `WeldPageState` and appends Output log line

4. **Properties-style proof panel** (in the Proof section):

   The weld. side of the proof comparison should read like the Roblox Studio Properties panel:
   ```
   ┌─ Properties ──────────────────────────────────────────┐
   │  Handle        xDevKira_           --luau-string       │
   │  Visits        17.3M               --luau-variable     │
   │  Verified      ✓ Roblox proof      --luau-type         │
   │  Rate          25 Robux/hr         --luau-string       │
   │  Available     Open now            --luau-variable     │
   │  Last active   2h ago              --luau-comment      │
   └───────────────────────────────────────────────────────┘
   ```
   - Alternating row tints: `--bg2` / `--bg-surface`
   - Label column: `--luau-comment` mono
   - Value column: semantic LuaU token color per value type
   - Verified rows: `--state-verified-fill` background

5. **Information density — global rules:**

   - Section padding: 88px vertical (desktop), 56px (tablet), 40px (mobile)
   - Card padding: 36px desktop, 28px tablet, 22px mobile
   - Line heights: body 1.72, code 1.55, label 1.2
   - Remove all "airy SaaS" empty spacers. Each panel should feel like a tool surface, not a brochure.
   - Ban: looping shimmer on idle elements. Shimmer is only allowed on hover/press.

6. **Typography role map (apply consistently across all sections):**

   | Role | Font | Size | Color |
   |------|------|------|-------|
   | Hero headline | Instrument Serif italic | clamp(72px,9.4vw,148px) | --cream |
   | Section headline | Instrument Serif | clamp(42px,5vw,72px) | --cream |
   | Eyebrow label | DM Mono, uppercase, 0.12em tracking | 11px | --studio-blue |
   | Body | Outfit 400 | 15–17px | --cream opacity 0.82 |
   | Code/mono | DM Mono | 12–13px | contextual LuaU color |
   | Value/stat | Instrument Serif italic | 28–48px | --cream |
   | Metadata | DM Mono | 10–11px | --luau-comment |
   | CTA button | Outfit 700, uppercase, 0.1em tracking | 12–14px | #fff |

### Review Gate — STOP before Stage 3

- [ ] Boot output panel has gutter, timestamps, and severity-colored lines
- [ ] `READY_FOR_DISCOVERY` line is visually dominant and uses Studio Blue
- [ ] Code blocks in How It Works look like a Script Editor with tabs, not a `<pre>` block
- [ ] Role selection uses Explorer-style rows, not pills
- [ ] Proof panel reads like Properties panel with LuaU value coloring
- [ ] No looping shimmer exists on any idle element
- [ ] A Roblox developer would immediately recognize all three surfaces (Output, Script Editor, Properties) without reading any copy
- [ ] Typography scale is consistent across all sections (check eyebrow, headline, body, mono)
- [ ] Density feels like a tool, not a marketing site

---

## STAGE 3 — Motion Choreography + Boot Feel

**Objective:** Every animation must be tied to state or user intent. Motion communicates status — booting, compiling, selecting, verifying, claiming — not decoration.

### Global motion rules

```css
@media (prefers-reduced-motion: reduce) {
  /* Snap all transitions to 0ms. Replace with instant state changes + Output log lines. */
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Reduced-motion must preserve all meaning via color, border, label, and Output log changes. If removing motion makes a state invisible, the implementation is incomplete.

### Boot sequence choreography

When the page loads (or when `BOOT_STARTED` fires):

```
Phase 1 (0–120ms):   Page background fades in from void (#090b14)
Phase 2 (120–280ms): Nav slides down from translateY(-100%). Output panel header appears.
Phase 3 (280–600ms): Boot log lines append one by one (staggered by delay from HERO_BOOT_LINES config)
Phase 4 (600–900ms): Hero headline lines enter — mask reveal (clip-path expand from bottom), NOT fade-up translateY
Phase 5 (900–1100ms): Hero sub and form slide up (translateY(20px) → 0, opacity 0 → 1)
Phase 6 (1100ms+):   READY_FOR_DISCOVERY line appends to output log; CTA button does a single pulse (scale 1 → 1.04 → 1); card fan/stack enters from right
```

In reduced-motion: skip all transforms. Log lines appear instantly. CTA gets a static `--studio-blue` border instead of the pulse.

### Role selection — Compile Snap

When a user selects a role in the Explorer tree:

1. Selected row flashes `--state-selected-fill` (50ms, then settles to steady state)
2. Code block "recompiles" — lines blink off then type back in (40ms blank, then typewriter at 18ms/char)
3. Proof/Properties panel rows update with a `--studio-blue` left border sweep (200ms)
4. Output log appends: `[HH:MM:SS]  ROLE_SELECTED → Scripter  [2 studio matches found]`
5. Counter badges in the Explorer tree tick up/down with a brief scale pulse

Duration budget: total Compile Snap from click to settled = under 400ms.

In reduced-motion: instant state swap, no typewriter, log line still appends.

### Audience toggle — mode switch

When dev ↔ studio toggle fires:

1. Pill slides across with spring easing (`cubic-bezier(0.34,1.56,0.64,1)`, 350ms)
2. Content that changes (headline, sub, cards) does a micro cross-fade:
   - Exit: `opacity 0, translateY(-6px)` over 100ms
   - Enter: `opacity 1, translateY(0)` over 220ms
3. Background gradient transitions (1s ease — already in existing code)
4. Output log: `[HH:MM:SS]  AUDIENCE_CONTEXT → studio`

### Breathing motion (ambient idle)

Allowed only on the hero card fan/stack and the floating Studio window:
- `translateY` oscillation: ±5px, 9s ease-in-out infinite
- No scale changes on breathing (scale reserved for Compile Snap)
- Disable entirely under `prefers-reduced-motion`

### Swipe demo — interactive micro-interactions

When the user clicks Pass or Match in the How It Works demo:

- **Match:** Card accelerates to `translateX(120%) rotate(20deg)` over 280ms, spring overshoot. Spark particles emit from center (6–8 dots, `--studio-blue` and `--luau-type`, radius 60px, 400ms opacity decay). Output log: `SPARK_FORMED → studio match recorded`
- **Pass:** Card decelerates to `translateX(-100%) rotate(-15deg)` over 260ms. Subtle red glow pulse on pass button. Output log: `PROFILE_SKIPPED → next candidate queued`
- Next card enters from `scale(0.88) translateY(20px)` to `scale(1) translateY(0)` over 300ms spring
- Drag gesture: card rotates proportional to `dragX / viewportWidth * 25deg`, swipe overlay opacity tied to `Math.abs(dragX) / 80`

### Scroll-driven section reveals

Each section (Why, How, For, Proof, FAQ) should not simply fade up. Instead:

- **Why section:** Problem card enters from left, solution card enters from right. Simultaneous, 60ms stagger.
- **How It Works:** Steps become active as the sticky demo card comes into view. Active step gets `--studio-blue` left border + text brightens to `--cream`.
- **Proof section:** Discord column "glitches" in (slight horizontal jitter, 200ms) then the weld. Properties panel "compiles in" (typewriter row by row).
- **For Who:** Cards enter with a subtle `rotateY(4deg) → 0` perspective flip, 350ms.

All using `IntersectionObserver`, threshold 0.2. No animation library dependencies — CSS + RAF only.

### Utility functions to build/extend

```typescript
// Boot sequence — already partially exists, extend it
function bootSequence(lines: BootLine[], onComplete: () => void): Cleanup

// Compile flash — runs on role selection
function compileFlash(el: HTMLElement, durationMs: number): void

// Typewriter — for code block role switching
function typeCodeBlock(el: HTMLElement, lines: string[], msPerChar: number): Cleanup

// Spark particles — for swipe match
function emitSpark(origin: DOMRect, count: number, colors: string[]): void

// Counter tick — for stat badges
function tickCounter(el: HTMLElement, from: number, to: number, durationMs: number): void
```

### Review Gate — STOP before Stage 4

- [ ] Boot sequence has 6 distinct phases; hero does NOT simply fade in
- [ ] Compile Snap fires on role selection and completes within 400ms
- [ ] Audience toggle cross-fade is smooth and Output log receives the event
- [ ] Swipe demo: Match emits spark particles, Pass shows directional motion, both append to Output log
- [ ] Breathing motion is `translateY` only, no scale, disabled under reduced-motion
- [ ] Scroll reveals are directional and section-specific, not generic fade-up
- [ ] Reduced-motion: ALL meaning preserved via instant state + log lines + borders. No information is hidden.
- [ ] No Lottie, GSAP, Framer Motion, or other animation library added. CSS + RAF only.
- [ ] Performance: no layout shifts, no paint on scroll (use `transform` and `opacity` only)

---

## STAGE 4 — Component Surface System

**Objective:** Build or refine the five signature surfaces that make weld. feel like Roblox Studio from the inside.

### Surface 1: StudioOutputPanel

Already partially implemented. Harden it:

```
┌─ weld.output ─────────────────── [READY] ─────────┐
│ 1  [12:04:01.001]  Booting weld.roster v2.0...      │  ← muted
│ 2  [12:04:01.120]  Loading developer lane...         │  ← neutral
│ 3  [12:04:01.245]  Scanning shipped work... OK       │  ← success (luau-type)
│ 4  [12:04:01.471]  Verified: 17.3M total visits      │  ← success
│ 5  [12:04:01.620]  Matching studio filters...        │  ← active (studio-blue)
│ 6  [12:04:01.781]  READY_FOR_DISCOVERY               │  ← bold, studio-blue bg
└────────────────────────────────────────────────────┘
```

Props contract:
```typescript
interface OutputPanelProps {
  lines: WeldOutputLog[];
  status: 'booting' | 'ready' | 'error';
  maxLines?: number; // default 20, scrolls to bottom
  ariaLive?: 'polite' | 'off'; // default 'polite'
}
```

### Surface 2: ExplorerRoleTree

The role selector — used in How It Works and/or For Who section:

```typescript
interface ExplorerRole {
  key: WeldRole;
  label: string;
  icon: string;        // emoji or SVG — no official Roblox assets
  matchCount: number;
  live?: boolean;      // shows --luau-variable dot if true
}

interface ExplorerRoleTreeProps {
  roles: ExplorerRole[];
  selectedRole: WeldRole;
  onSelect: (role: WeldRole) => void;
}
```

Keyboard: Up/Down arrow keys navigate rows. Enter/Space selects. `role="tree"`, `role="treeitem"`, `aria-selected`.

### Surface 3: LuaUSyntaxBlock

Script Editor simulation — used in How It Works code display:

```typescript
interface SyntaxLine {
  num: number;
  tokens: Array<{ text: string; type: 'keyword'|'string'|'function'|'type'|'variable'|'comment'|'plain' }>;
}

interface LuaUSyntaxBlockProps {
  title: string;         // tab label, e.g. "weld.roster.lua"
  lines: SyntaxLine[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}
```

Typing animation controlled externally via `compileFlash` utility. Component itself is static — animation layer is separate.

### Surface 4: DeveloperPropertiesPanel

weld. verified profile panel — used in the Proof section:

```typescript
interface ProfileProperty {
  key: string;
  value: string;
  valueType: 'string' | 'type' | 'variable' | 'comment'; // maps to LuaU token
  verified?: boolean;  // adds --state-verified-fill row background
}

interface DeveloperPropertiesPanelProps {
  properties: ProfileProperty[];
  developerName: string;
}
```

### Surface 5: DiscordChaosPanel

Used on the problem side of the Proof section:

```typescript
interface DiscordEntry {
  name: string;
  body: string;
  timestamp: string;
  expired?: boolean;
  spam?: boolean;
  deleted?: boolean;
}

interface DiscordChaosPanelProps {
  entries: DiscordEntry[];
  channelName?: string; // e.g. "#looking-for-work"
}
```

Styling rules:
- Background: `--state-noise` (#313338)
- Expired links shown as `[link expired]` in `--state-error`
- Deleted messages shown as greyed-out italic
- Spam entries have `[BOT]` label in `--state-warning`
- Discord sidebar visible on desktop: nav items in `--luau-comment`, active item uses `#5865F2` (this is the only place a color outside the main token set is allowed — Discord's brand color for the chaos surface)

### Surface consistency rules (all five surfaces)

- Panel headers: `--bg-surface`, 1px bottom border `rgba(255,255,255,0.06)`, height 36–40px
- Panel body: `--bg2` or `--terminal-dark`
- Borders: `1px solid rgba(255,255,255,0.08)` on panel containers
- Border radius: 16px for panels, 8px for rows, 100px for pills/badges
- No box-shadows heavier than `0 24px 64px rgba(0,0,0,0.5)` — keep them purposeful

### Hero visual — card fan upgrade

The existing card fan / preview stack in the hero visual should show a weld. profile card that feels like a real product screen:

```
┌─────────────────────────────────┐
│  🎮  SPELLEX WARS               │  ← game banner (gradient, not image)
│      17.3M visits  ⚡ Active    │  ← luau-variable for active status
├─────────────────────────────────┤
│  [AV]  xDevKira               🏆│  ← avatar gradient, gold badge for top
│        Scripter · Open now      │  ← luau-variable for "Open now"
│  [LuaU] [Pathfinding] [Combat]  │  ← role tags in luau-keyword color
│  ─────────────────────────────  │
│  Visits    Rate      Response   │
│  17.3M     25R/hr    < 2h       │  ← values in luau-string color
│  ─────────────────────────────  │
│  ✓ Roblox verified              │  ← luau-type color, check icon
│   [Pass ✕]          [Spark ♦]  │
└─────────────────────────────────┘
```

The swipe overlay labels: `SPARK` (right, `--luau-type`) and `PASS` (left, `--state-error`).

### Review Gate — STOP before Stage 5

- [ ] `StudioOutputPanel` is a reusable component, handles all log severity colors correctly, `aria-live` is set
- [ ] `ExplorerRoleTree` is fully keyboard-navigable with proper ARIA tree roles
- [ ] `LuaUSyntaxBlock` renders with correct token colors for all 6 LuaU types
- [ ] `DeveloperPropertiesPanel` shows verified rows with `--state-verified-fill`
- [ ] `DiscordChaosPanel` uses `--state-noise` surface and makes chaos visually obvious
- [ ] Hero card shows real profile data structure (game banner, stats, tags, match actions)
- [ ] All five surfaces share consistent panel-header height, border radius, and border spec
- [ ] No component invents a new hex value outside the token contract

---

## STAGE 5 — Motifs, Polish, and Cross-Section Wiring

**Objective:** Tie everything together. Add the finishing details that make weld. feel like a coherent, living product rather than a collection of sections.

### LuaU watermark layer

The existing `LuauWatermarkLayer` component shows background LuaU code fragments. Upgrade it:

- Fragments should use actual weld. relevant snippets:
  ```lua
  -- weld.roster.lua
  local developer = weld.find({ role = "scripter", rate = "≤30" })
  if developer.verified then spark(developer) end
  ```
- Opacity: `0.028` max — barely perceptible
- Only visible on desktop (hide under 768px)
- Must not affect scroll performance: use `will-change: transform` and a fixed position layer

### Scan line texture

Apply a subtle scan-line overlay across the entire page (already partially exists — refine):

```css
.grain-scanlines {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9997;
  background: repeating-linear-gradient(
    180deg,
    transparent 0px, transparent 3px,
    rgba(255,255,255,0.004) 3px, rgba(255,255,255,0.004) 4px
  );
}
```

### Cross-section state wiring

This is the most important part of Stage 5. Every primary interaction must update at least two surfaces and the Output log:

| Trigger | Surface 1 | Surface 2 | Output log |
|---------|-----------|-----------|------------|
| Audience toggle → dev | Nav pill, hero headline swap | Background gradient shift | `AUDIENCE_CONTEXT → developer` |
| Audience toggle → studio | Nav pill, hero headline swap | Why/For/FAQ cards swap | `AUDIENCE_CONTEXT → studio` |
| Role selected in Explorer | Explorer row highlight | Code block recompiles | `ROLE_SELECTED → {role}` |
| Swipe Match | Card exits right | Spark particles, match count++ | `SPARK_FORMED → studio match` |
| Swipe Pass | Card exits left | Pass glow flash | `PROFILE_SKIPPED` |
| Email input → valid | Submit button brightens | Trust line updates | `EMAIL_VALIDATE → READY` |
| Email submit → success | Form replaces with success state | Sticky CTA hides | `CLAIM_SLOT_SUCCESS` |
| Email submit → error | Input border → error color | Error message appears | `INVALID_EMAIL_FORMAT` |
| Proof metric row focused | Properties row highlights | Corresponding stat in card highlights | `PROOF_METRIC_FOCUSED → visits` |

### Floating Studio Window polish

The existing `FloatingStudioWindow` should feel like a real Roblox Studio window dragging over the page:

- Title bar: `--bg-surface`, traffic-light circles (red `#ff5f57`, yellow `#febc2e`, green `#28c840` — these are the only non-token colors allowed here, as they are macOS window chrome)
- Window body: `--bg2` with panel content relevant to the current selected role
- Draggable: uses `pointer-events` and mouse/touch drag with momentum (RAF-based, no library)
- Drops a subtle `box-shadow: 0 28px 80px rgba(0,0,0,0.55)` when being dragged

### Mobile compact mode

On screens < 640px:

- Output panel collapses to last 2 lines + a "Show output" expand button
- Explorer tree collapses to a horizontal scroll row of role pills
- LuaU code block shows only the first 4 lines with a "Show full script" expand
- Properties panel shows only verified rows by default, "Show all" to expand
- Card fan becomes a single centered card (no fan perspective)
- Swipe gesture is the primary interaction — no demo pass/match buttons needed on mobile (drag handles only)
- Floating Studio Window is hidden on mobile

### Accessibility final pass

- All interactive elements have `aria-label` or visible label
- `aria-live="polite"` on Output panel
- `aria-selected` on active Explorer row
- `aria-expanded` on FAQ items
- Focus order follows visual reading order
- Color is never the only indicator of any state (always pair with icon, border, or text)
- Text contrast: body text minimum 4.5:1 against background, UI indicators minimum 3:1
- Test with keyboard-only navigation: every interactive element reachable and operable

### Performance final pass

- `will-change: transform` only on elements that animate (remove after animation ends)
- No `backdrop-filter` on more than 2 elements simultaneously
- Particle canvas disabled on mobile and under reduced-motion
- `IntersectionObserver` observers are disconnected after first trigger (one-shot reveal animations)
- LuaU watermark layer: `position: fixed`, does not trigger scroll repaints

### Copy refinements (developer-first framing)

The static reference page has some great copy. These are the highest-priority copy improvements to carry into the dynamic page:

**Hero headline (dev mode):** "Spark with studios." (keep)
**Hero sub (dev mode):** "The talent network for Roblox. Link your games, set your rate, and match with studios that actually ship."
**Hero badge:** `TALENT_NETWORK · ROBLOX`
**Hero trust line:** `Swipe. Spark. Ship. Free. · Kickstart the movement`
**Hero output panel READY line:** `READY_FOR_DISCOVERY` (keep as-is — it's perfect)

**Why section headline (dev mode):** "You're talented, you know that. Although you're missing a better way to find real clients, real work."
**Why eyebrow:** `THE PROBLEM` (problem cards) / `THE FIX` (solution cards)
**Problem card body:** "Make one profile, link your accounts, show off your skills for any client to see. No reaching out needed — studios can get to know you before that, so you can finally spark and get the jobs you need."
**Solution card body:** "We replace your sloppy search with a system that shows you the clients that you want, use an algorithm to rank them, and spark a match when both sides are interested, so you can get to work."

**Proof section headline:** `Discord profiles? Threads? Servers? *Noise.* One 'weld.' profile? *Context.*`
**Proof sub (dev mode):** "Authenticated, get the clients you want. Everything important about you is listed right there for a potential client to see, so you do not even have to lift a finger to find work. Swipe, spark, ship."

**For who (dev card):** "Built for developers that ship. *Relentlessly.*"
**For who (studio card):** "Built for studios that ship. *Relentlessly.*"

**Final CTA (dev mode):** "Spark with studios." / "The talent network for Roblox."

### Final Review Gate — Complete

- [ ] All five stage surfaces are wired through `WeldPageState` and share event dispatch
- [ ] Every primary interaction updates at least two surfaces + Output log
- [ ] Mobile compact mode works on 375px viewport — no overflow, no hidden functionality
- [ ] LuaU watermark layer is subtle and does not affect performance
- [ ] Floating Studio Window is draggable and shows role-relevant content
- [ ] All accessibility checks pass (keyboard, contrast, aria, focus order)
- [ ] Particle canvas is disabled on mobile and under reduced-motion
- [ ] Copy matches the developer-first framing from the static reference
- [ ] The page would look at home as a real Roblox Studio tool, not a generic SaaS landing page
- [ ] A Roblox developer visiting for the first time understands the value prop within 8 seconds without scrolling
- [ ] A Roblox developer can navigate the entire page with only a keyboard

---

## AGENT REPORTING FORMAT

After completing each stage, return a report in this format before proceeding:

```
STAGE [N] REPORT
Files changed: [list]
State inputs/events added: [list]
Dynamic effects added: [list]
Reduced-motion fallback: [describe]
Mobile behavior: [describe]
Accessibility notes: [list]
Performance notes: [list]
Deviations from stage doc: [list or "none"]
Manual QA steps needed: [list]
Review gate: [PASS / FAIL — list any failures]
```

Do not proceed to the next stage if the review gate has failures. Fix and re-report.

---

## RED-TEAM FAILURE PATTERNS (check before any merge)

| Pattern | What it looks like | Fix |
|---------|-------------------|-----|
| Template drift | Generic dark card added because it "looks clean" | Force back to assigned surface metaphor |
| Local-only interaction | Click changes only the clicked element | Wire to shared state + at least one dependent surface |
| Motion theatre | Animation looks good but communicates nothing | Attach to boot/compile/parse/verify/claim/error state |
| Mobile flattening | Mobile becomes a static stack of text | Keep compact controls for role, code, proof, CTA |
| Token invention | New hex values appear | Replace with Stage 1 token or documented alias |
| Brand-risk shortcut | Official Roblox logo or trademark used | Use original icons, descriptive proof wording |
| Accessibility erasure | Hover-only info, clickable divs | Semantic controls, labels, focus states |
| Performance creep | Decorative effect ships with heavy runtime cost | Disable on mobile/reduced-motion or remove |
| Copy drift | Sections revert to generic SaaS speak | Re-apply developer-first copy from static reference |
| Orange creep | Orange appears on buttons beyond the final CTA | Replace with --studio-blue for system actions |

---

## QUICK REFERENCE: FILE LOCATIONS

```
src/dynamic landing page/
├── components/
│   ├── MarketingPage.tsx          ← primary file (3700 lines — work section by section)
│   ├── FloatingStudioWindow.tsx   ← upgrade for Stage 5
│   ├── LuauWatermarkLayer.tsx     ← upgrade for Stage 5
│   ├── ParticleCanvas.tsx         ← keep, disable on mobile/reduced-motion
│   ├── RobloxProofBadge.tsx       ← apply Stage 1 token colors
│   └── ProofVisitCounter.tsx      ← apply Stage 1 token colors
├── lib/
│   ├── WeldPageState.tsx          ← shared state — add events per stage
│   ├── sample-data.ts             ← hero profiles, FAQ, role data
│   ├── useMotionPolicy.ts         ← motion policy — extend for Stage 3
│   └── types.ts                   ← Audience, WeldRole, etc.
└── routes/
    └── HomePage.tsx               ← entry point

src/app/
├── page.tsx                       ← re-exports HomePage
└── globals.css                    ← Stage 1 token system goes here
```

---

*This prompt was generated from: the weld. static reference page (index.html), the Weld Frontend Design Master System, and Stage 1–5 design documents. It targets the Next.js dynamic landing page at `src/dynamic landing page/`. Jawad — developer-first, Roblox Studio–native, dynamic-first.*
