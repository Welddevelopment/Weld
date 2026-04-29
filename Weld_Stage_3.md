Unrecognised paragraph style: 'Weld Mono' (Style ID: WeldMono)
__STAGE 3__

__Dynamic Motion, State Feedback, and Interaction Choreography__

Boot Feel, Breathing, and Compile Snap as a connected motion system instead of decorative animation

Dynamic\-first Roblox Studio\-native implementation document

Built from the Weld Frontend Design Master System and the original Stage 1\-5 source packet\.

__Core oath for this stage__

This stage must not create a prettier static page\. It must create a stronger dynamic product surface: state, feedback, accessibility, and implementation rules that agents can execute without inventing taste\.

# 00\. How to Use This Stage Rewrite

This document is a high\-detail rewrite of the original stage file\. It keeps the original intent, upgrades it with the master design system, and converts it into an agent\-ready execution guide\. It is written for Codex, Claude Code, human frontend engineers, and design reviewers\.

__Dynamic\-first interpretation__

The master system rejects hybrid landing pages\. Every major stage must strengthen the page as a living interface: stateful, reactive, scroll\-aware, keyboard\-safe, and visibly connected through Output logs and shared page state\.

## What this stage owns

- Owns the pagewide motion language: boot sequence, ambient breathing, role recompile, code typing, parser transitions, counters, command input, and badge unlocks\.
- Transforms motion from reveal decoration into visible state feedback\.
- Defines how animations read shared page state, emit Output logs, respect reduced motion, and avoid performance regressions\.
- Gives agents multiple implementation routes: CSS\-only, state\-orchestrated, cinematic, and performance\-first\.

## Source basis

__Source__

__What is preserved__

__What is upgraded here__

Original Stage 3

Preserves Boot Feel, Breathing, Compile Snap, particle field, card tilt, animated counters, scroll\-driven section animation, and reduced\-motion/performance constraints\.

Upgrades them into a central choreography system with event contracts, state machine, route alternatives, and QA gates\.

Master document

Preserves the dynamic\-first oath and cross\-section interaction map\.

Adds concrete event\-driven choreography for BOOT\_STARTED, ROLE\_SELECTED, PARSE\_STARTED, CLAIM\_SUBMITTED, and reduced\-motion substitutions\.

Stages 1\-2 dependency

Uses token semantics and code/text surfaces from earlier stages\.

Adds color/state/motion alignment so movement and text agree\.

## Upgrade philosophy

- Motion must communicate status: booting, compiling, inspecting, parsing, verifying, claiming, succeeding, or failing\.
- Breathing motion is allowed only when it does not steal attention or hurt performance\.
- Compile Snap should be sharp and brief, not bouncy or playful for its own sake\.
- Reduced\-motion mode must preserve meaning with instant state changes, labels, and logs\.
- A dynamic page that janks is worse than a calm one\. Performance is part of the motion design\.

## Document map

- 00\. How to Use This Stage Rewrite
- 01\. Executive Objective and Non\-Negotiables
- 02\. Source\-to\-Master Synthesis
- 03\. Dynamic\-First System Design
- 04\. Implementation Architecture
- 05\. Alternative Agent Routes
- 06\. Component and State Contracts
- 07\. Code and Token Snippet Library
- 08\. Accessibility, Performance, and Brand\-Safety Gates
- 09\. QA Rubric and Merge Checklist
- 10\. Agent Prompt Pack and Review Prompts

# 01\. Executive Objective and Non\-Negotiables

Stage 3 is where the landing page stops acting like a document\. The original file already defined the right three pillars: Boot Feel, Breathing, and Compile Snap\. This rewrite upgrades those pillars into a state\-driven choreography system that agents can wire through shared page state, IntersectionObserver triggers, requestAnimationFrame utilities, and strict reduced\-motion gates\.

__Stage non\-negotiable__

Stage 3 must be implemented as part of a connected product surface\. If the result only changes local visuals and does not improve state clarity, interaction feedback, or cross\-section consistency, it is incomplete\.

## Master\-system alignment

__Master doctrine__

__Meaning for this stage__

__Evidence of success__

Dynamic\-first

Every motion must be tied to state or user intent\.

Role clicks, tab changes, form states, and scroll sections trigger meaningful responses\.

Studio\-native

Motion should feel like a tool booting, compiling, and updating\.

Boot logs, Output status, code typing, selected row flashes, parser lines\.

Not hybrid

Static sections cannot hide behind fade\-up animation\.

Scroll reveals transform content, parse signals, count proof, or unlock state\.

Performance\-safe

No heavy animation libraries by default\.

CSS \+ RAF \+ IntersectionObserver; no jank, no layout shifts\.

Inclusive

Reduced motion keeps meaning without large transforms\.

Animations snap to final state and logs/labels communicate outcome\.

## Primary outputs

- A deterministic implementation path that agents can follow without style invention\.
- A set of tokens, components, events, or patterns that plug into the global Weld page state\.
- A route matrix so agents can choose safe, target, cinematic, or constraint\-reduced execution paths\.
- A QA checklist that catches static/hybrid drift, accessibility regressions, and performance mistakes\.
- Agent prompts for implementation, review, and regression repair\.

# 02\. Source\-to\-Master Synthesis

__Motion pillar__

__Original meaning__

__Master rewrite__

Boot Feel

Hero loads like Studio launching\.

A boot state machine that controls flash, header, Output logs, profile enter, CTA ready, and reduced\-motion fallback\.

Breathing

Particles, tilt, counters create alive idle state\.

Ambient motion becomes optional and performance\-gated; never required for meaning\.

Compile Snap

Interactions respond sharply like code executing\.

Every primary user action has a state update, micro\-interaction, Output log, and fallback\.

Scroll animations

Sections reveal with directional motion and typing\.

Scroll transforms become state transitions: parse, expand, type, count, unlock\.

Utilities

Build bootSequence, ParticleCanvas, tiltCard, compileFlash, typeCodeBlock\.

Each utility gets input/output contracts, cleanup rules, and route alternatives\.

# 03\. Dynamic Motion System Design

## Global motion event model

__Motion event and policy types__

type WeldMotionEvent =

  | \{ type: "BOOT\_STARTED" \}

  | \{ type: "BOOT\_READY" \}

  | \{ type: "ROLE\_SELECTED"; role: WeldRole \}

  | \{ type: "SCRIPT\_TAB\_CHANGED"; tab: ScriptTab \}

  | \{ type: "PROOF\_METRIC\_FOCUSED"; metric: ProofMetric \}

  | \{ type: "DISCORD\_PARSE\_STARTED" \}

  | \{ type: "DISCORD\_PARSE\_COMPLETE" \}

  | \{ type: "CLAIM\_INPUT\_CHANGED"; valid: boolean \}

  | \{ type: "CLAIM\_SUBMITTED" \}

  | \{ type: "CLAIM\_RESOLVED"; ok: boolean \};

type MotionPolicy = \{

  reducedMotion: boolean;

  compactMode: boolean;

  allowAmbient: boolean;

  allowTyping: boolean;

  allowParallax: boolean;

\};

## Boot timeline

__Frame__

__Timing__

__State/event__

__Visual__

__Reduced\-motion fallback__

0

0ms

BOOT\_STARTED

Near\-black page, low\-opacity mark\.

Show normal initial state\.

1

80ms

boot flash

Single\-frame flash overlay\.

Skip flash entirely\.

2

200ms

header enter

Toolbar materializes downward\.

Header visible instantly\.

3

300\-800ms

boot logs

Output lines type one by one\.

All lines appear instantly\.

4

900ms

profile enter

Properties panel enters with slight perspective\.

Fade or appear instantly\.

5

1100ms

BOOT\_READY

CTA ready pulse; ready log appended\.

Static ready state plus log\.

## Boot sequence code

__Boot orchestrator skeleton__

export function runBootSequence\(api: \{

  reducedMotion: boolean;

  setBootStatus: \(s: BootStatus\) => void;

  appendLog: \(message: string, severity?: WeldOutputLog\["severity"\]\) => void;

  markHeaderReady: \(\) => void;

  markProfileReady: \(\) => void;

  markCTAReady: \(\) => void;

\}\) \{

  api\.setBootStatus\("booting"\);

  if \(api\.reducedMotion\) \{

    \[

      \["Booting weld\.roster v2\.0\.\.\.", "info"\],

      \["Scanning shipped work\.\.\. OK", "success"\],

      \["Verified: 17\.3M total visits", "success"\],

      \["READY\_FOR\_DISCOVERY", "ready"\]

    \]\.forEach\(\(\[m, s\]\) => api\.appendLog\(m, s as any\)\);

    api\.markHeaderReady\(\); api\.markProfileReady\(\); api\.markCTAReady\(\);

    api\.setBootStatus\("ready"\);

    return;

  \}

  // Use setTimeout or a small scheduler; keep layout space reserved to avoid CLS\.

\}

## Compile Snap sequence for role selection

__Step__

__Action__

__Affected surface__

__Motion__

__Log__

1

User selects role in Explorer\.

Explorer row

Blue selected fill and 250ms compile flash\.

Role filter changed: Scripter

2

Shared selectedRole updates\.

Properties panel

Value scramble then resolve\.

Recompiling developer profile\.\.\.

3

Code sample switches role strings\.

LuaU editor

Tab snap and code typing if allowed\.

Opened weld\_profile\.luau

4

Stats update\.

ProofStatsGrid

Counters count or snap to new role values\.

Proof metrics loaded

5

CTA copy changes\.

StudioWelcomeCTA

Command label resolves to role\-specific claim\.

MATCH\_READY

## Scroll transformation model

__Section__

__Trigger__

__Dynamic transformation__

__Fallback__

Discord Chaos

Intersection 35%

Discord panel enters left, Weld parser enters right, parse line flashes, proof rows resolve\.

Both panels visible; parse rows appear instantly\.

Role Explorer

Intersection or role select

Folder opens, child rows stagger, indent lines draw\.

Folder open state appears instantly\.

How It Works

Intersection 50%

LuaU lines type or reveal line by line\.

Full code visible\.

Stats

Intersection 45%

Counters count up once, sparklines draw\.

Final numbers and static sparklines\.

Badges

Progress/state change

Badge unlock pop and border pulse\.

Locked/unlocked text state changes\.

CTA

Email validity

Command prompt brightens, button charges, success/error resolves\.

Static ready/error text and border state\.

# 04\. Implementation Architecture

## Reduced\-motion policy hook

__Motion policy hook__

export function useMotionPolicy\(\) \{

  const \[reducedMotion, setReducedMotion\] = useState\(false\);

  const \[compactMode, setCompactMode\] = useState\(false\);

  useEffect\(\(\) => \{

    const motion = window\.matchMedia\("\(prefers\-reduced\-motion: reduce\)"\);

    const compact = window\.matchMedia\("\(max\-width: 639px\)"\);

    const sync = \(\) => \{

      setReducedMotion\(motion\.matches\);

      setCompactMode\(compact\.matches\);

    \};

    sync\(\);

    motion\.addEventListener\("change", sync\);

    compact\.addEventListener\("change", sync\);

    return \(\) => \{

      motion\.removeEventListener\("change", sync\);

      compact\.removeEventListener\("change", sync\);

    \};

  \}, \[\]\);

  return \{

    reducedMotion,

    compactMode,

    allowAmbient: \!reducedMotion && \!compactMode,

    allowTyping: \!reducedMotion,

    allowParallax: \!reducedMotion && \!compactMode

  \};

\}

## Intersection\-once helper

__Scroll trigger helper__

export function useIntersectionOnce<T extends HTMLElement>\(threshold = 0\.35\) \{

  const ref = useRef<T | null>\(null\);

  const \[seen, setSeen\] = useState\(false\);

  useEffect\(\(\) => \{

    if \(\!ref\.current || seen\) return;

    const observer = new IntersectionObserver\(\(\[entry\]\) => \{

      if \(entry\.isIntersecting\) \{

        setSeen\(true\);

        observer\.disconnect\(\);

      \}

    \}, \{ threshold \}\);

    observer\.observe\(ref\.current\);

    return \(\) => observer\.disconnect\(\);

  \}, \[seen, threshold\]\);

  return \[ref, seen\] as const;

\}

## ParticleCanvas requirements

__Particle canvas contract__

// Rules:

// \- Canvas only; no DOM particles\.

// \- Max 80 particles desktop, 0 mobile\.

// \- pointer\-events: none\.

// \- Cleanup requestAnimationFrame on unmount\.

// \- Hidden in reduced\-motion\.

// \- Never block hero LCP\.

function ParticleCanvas\(\{ enabled \}: \{ enabled: boolean \}\) \{

  const canvasRef = useRef<HTMLCanvasElement | null>\(null\);

  useEffect\(\(\) => \{

    if \(\!enabled || \!canvasRef\.current\) return;

    let frame = 0;

    // initialize particle pool once, animate with RAF, cleanup on unmount\.

    return \(\) => cancelAnimationFrame\(frame\);

  \}, \[enabled\]\);

  if \(\!enabled\) return null;

  return <canvas ref=\{canvasRef\} className="particle\-canvas" aria\-hidden="true" />;

\}

## Compile flash CSS

__Compile flash animation__

@keyframes compile\-flash \{

  0% \{ box\-shadow: 0 0 0 rgba\(78, 201, 176, 0\); \}

  45% \{ box\-shadow: 0 0 22px rgba\(78, 201, 176, 0\.45\); \}

  100% \{ box\-shadow: 0 0 0 rgba\(78, 201, 176, 0\); \}

\}

\[data\-compile="true"\] \{

  animation: compile\-flash 250ms ease\-out 1;

\}

@media \(prefers\-reduced\-motion: reduce\) \{

  \[data\-compile="true"\] \{ animation: none; \}

\}

# 06\. Component and State Contracts

__Interaction__

__State input__

__Event emitted__

__Motion response__

__Reduced\-motion response__

Page load

bootStatus

BOOT\_STARTED/BOOT\_READY

Boot flash, logs type, header/profile enter, CTA pulse\.

Instant ready state plus logs\.

Role selection

selectedRole

ROLE\_SELECTED

Selected row flash, values scramble, code tabs update, counters run\.

Static selected row and instant values\.

Script tab

activeScriptTab

SCRIPT\_TAB\_CHANGED

Active underline snap, code type/reveal\.

Instant content switch\.

Discord parse

parseState

DISCORD\_PARSE\_STARTED/COMPLETE

Panels slide, divider flash, proof rows resolve\.

Rows appear in final parsed state\.

Email input

claimState/email

CLAIM\_INPUT\_CHANGED

Focus glow, command prompt brightens\.

Border/text state only\.

Submit

claimState

CLAIM\_SUBMITTED/RESOLVED

Button compresses, compile snap, badge unlock\.

Pressed color and success/error text\.

# 05\. Alternative Agent Routes

Agents should not be locked into a single brittle implementation path\. The best route depends on the current codebase, time budget, and whether the team wants a safe MVP, the full target experience, or a cinematic stretch\. These routes are designed to be mutually understandable: a conservative route can later evolve into the target route without throwing work away\.

__Route__

__When to choose it__

__What the agent builds__

__Risks__

__Exit criteria__

A\. CSS\-only safe

Need minimal risk and no new runtime utilities\.

Keyframes for boot/profile/CTA, CSS hover states, no particles or tilt\.

Less alive; limited cross\-section choreography\.

All core interactions still update state and logs\.

B\. State\-orchestrated target

Codebase can support hooks/provider\.

MotionPolicy, bootSequence, intersection triggers, compile events, Output logs\.

Requires careful cleanup and testing\.

Boot, role, parse, stats, CTA all feel connected\.

C\. Cinematic launch

Target route already passes QA and you want wow\.

Add ParticleCanvas, subtle tilt, Studio window breathing, polished parse flashes\.

Higher performance risk\.

60fps desktop, disabled mobile/reduced motion\.

D\. Performance\-first

Mobile/Core Web Vitals are fragile\.

No particles, no tilt, minimal transforms, instant updates, small CSS transitions\.

Less spectacle\.

INP/LCP/CLS gates pass and dynamic meaning remains clear\.

## Route selection heuristic

- If the codebase is fragile, start with the safe route and add dynamic contracts behind feature flags\.
- If the page already has clean component boundaries, use the target route and wire state immediately\.
- If the goal is a screenshot\-worthy launch, use the cinematic route after the target route passes accessibility and performance gates\.
- If mobile or performance is currently weak, choose the constraint\-reduced route before adding ambient motion or extra motifs\.

# 07\. Motion Snippet Library

## Boot keyframes

__Canonical keyframes__

@keyframes boot\-flash \{

  0% \{ opacity: 0; \}

  50% \{ opacity: 0\.9; \}

  100% \{ opacity: 0; \}

\}

@keyframes profile\-enter \{

  from \{ opacity: 0; transform: translateX\(\-40px\) rotateY\(\-8deg\); \}

  to \{ opacity: 1; transform: translateX\(0\) rotateY\(0\); \}

\}

@keyframes cta\-ready\-pulse \{

  0% \{ box\-shadow: 0 0 0 rgba\(0,162,255,0\); \}

  50% \{ box\-shadow: 0 0 40px rgba\(0,162,255,0\.6\); \}

  100% \{ box\-shadow: 0 0 0 rgba\(0,162,255,0\); \}

\}

## Text scramble utility

__Scramble values on role change__

const SCRAMBLE\_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\_";

export function scrambleText\(\{

  from,

  to,

  onUpdate,

  duration = 360,

  reducedMotion = false

\}: \{

  from: string; to: string; onUpdate: \(value: string\) => void;

  duration?: number; reducedMotion?: boolean;

\}\) \{

  if \(reducedMotion\) return onUpdate\(to\);

  const start = performance\.now\(\);

  function frame\(now: number\) \{

    const t = Math\.min\(1, \(now \- start\) / duration\);

    const keep = Math\.floor\(to\.length \* t\);

    const scrambled = to\.slice\(0, keep\) \+ Array\.from\(\{ length: to\.length \- keep \}, \(\) =>

      SCRAMBLE\_CHARS\[Math\.floor\(Math\.random\(\) \* SCRAMBLE\_CHARS\.length\)\]

    \)\.join\(""\);

    onUpdate\(scrambled\);

    if \(t < 1\) requestAnimationFrame\(frame\);

    else onUpdate\(to\);

  \}

  requestAnimationFrame\(frame\);

\}

## Number counter utility

__Proof counter animation__

export function animateCounter\(\{

  from = 0, to, duration = 1200, onUpdate, reducedMotion

\}: \{

  from?: number; to: number; duration?: number; onUpdate: \(n: number\) => void; reducedMotion?: boolean;

\}\) \{

  if \(reducedMotion\) return onUpdate\(to\);

  const start = performance\.now\(\);

  const easeOut = \(t: number\) => 1 \- Math\.pow\(1 \- t, 3\);

  function frame\(now: number\) \{

    const t = Math\.min\(1, \(now \- start\) / duration\);

    onUpdate\(from \+ \(to \- from\) \* easeOut\(t\)\);

    if \(t < 1\) requestAnimationFrame\(frame\);

  \}

  requestAnimationFrame\(frame\);

\}

# 08\. Accessibility and Performance Gates

## Reduced\-motion contract

__Reduced motion CSS__

@media \(prefers\-reduced\-motion: reduce\) \{

  \*, \*::before, \*::after \{

    animation\-duration: 0\.001ms \!important;

    animation\-iteration\-count: 1 \!important;

    transition\-duration: 0\.001ms \!important;

    scroll\-behavior: auto \!important;

  \}

  \.particle\-canvas,

  \.parallax\-layer,

  \.cursor\-trail \{

    display: none \!important;

  \}

\}

- Do not animate layout properties when transform/opacity can communicate the state\.
- Reserve hero panel dimensions before boot animation to prevent layout shift\.
- Particles, tilt, parallax, and cursor trails are decorative; disable on mobile and reduced motion\.
- ARIA live regions should announce meaningful logs, not every animated cursor tick\.
- If an animation explains state, reduced\-motion mode must show the state as text, icon, border, or log\.

# 09\. QA Rubric and Merge Checklist

This stage is ready to merge only when the checks below pass in desktop, tablet, mobile, keyboard\-only navigation, and reduced\-motion mode\.

__Check__

__Pass condition__

__Failure signal__

__Owner__

Boot Feel

Page visibly boots like a tool and ends in ready state\.

Hero only fades in like a normal site\.

Frontend

Breathing

Ambient motion subtle, desktop\-only, nonessential\.

Particles/tilt distract or run on mobile\.

Design

Compile Snap

Role, tab, input, and button interactions respond sharply\.

Interactions feel delayed, bouncy, or local only\.

Frontend

Scroll transforms

Discord, role, code, stats, badges do real state changes\.

Sections just fade upward\.

Reviewer

Reduced motion

Meaning preserved without large motion\.

Animations still run or content disappears\.

A11y

Performance

No jank, no layout shift, cleanup on unmount\.

RAF leaks or scroll jank appears\.

QA

## Static/hybrid drift test

- Can the reviewer explain what state changed after a primary interaction?
- Can the reviewer see the Output panel, focus state, selected state, or command state acknowledge the change?
- Does reduced\-motion mode keep the same meaning without heavy movement?
- Does mobile keep the same core interaction rather than hiding it behind static text?
- Would this section look at home in Roblox Studio, or could it belong to a generic AI SaaS template?

# 10\. Agent Prompt Pack

Use these prompts directly with Codex, Claude Code, or another engineering agent\. They are intentionally strict\. The goal is to prevent generic SaaS drift and make each implementation self\-reviewing\.

__Implementation prompt__

Implement Stage 3 as a dynamic motion system\. Build MotionPolicy/reduced\-motion detection, bootSequence, role

  compile snap, intersection\-triggered parse/code/stats/badge behavior, and optional ParticleCanvas/tilt only if

  performance\-safe\. Every primary motion must reflect state and append or correspond to an Output log\. Do not

  add heavy animation libraries\. Reserve layout space and clean up timers, observers, and RAF loops\.

__Review prompt__

Review Stage 3\. Reject if animations are decorative, if major sections only fade in, if reduced\-motion mode

  still runs typing/parallax/particles, if role selection does not recompile multiple surfaces, if particles run

  on mobile, if layout shifts occur during boot, or if motion obscures content\.

__Repair prompt__

Repair Stage 3 drift\. Tie motion to explicit events\. Replace generic fade\-ups with parse, expand, type, count,

  or unlock state changes\. Add reduced\-motion fallbacks that snap to final state\. Remove heavy or leaking

  animations\. Cap particles and disable mobile ambient effects\. Add Output log feedback for primary

  interactions\.

## Agent reporting format

Return this report after implementation:

1\. Files changed

2\. State inputs and events added

3\. Dynamic effects added

4\. Reduced\-motion fallback

5\. Mobile behavior

6\. Accessibility notes

7\. Performance notes

8\. Deviations from the stage doc

9\. Manual QA steps

# 11\. Agent Work Packages

The work below is deliberately packaged for coding agents\. Each package can become a Codex or Claude Code task\. Agents should complete one package, run local checks, report deviations, and then move to the next package rather than attempting a massive unreviewable rewrite\.

__Package__

__Agent task__

__Inputs__

__Outputs__

__Acceptance criteria__

1\. MotionPolicy

Implement reducedMotion, compactMode, allowAmbient, allowTyping\.

matchMedia

useMotionPolicy hook\.

All animations check policy\.

2\. Boot sequence

Wire bootStatus, logs, header/profile/CTA readiness\.

OutputPanel, hero

runBootSequence utility\.

Boot feels like tool launch, not fade\-in\.

3\. Compile Snap

Connect role/tab/input events to sharp state feedback\.

shared state

compileFlash/scramble/counter hooks\.

Interactions affect multiple surfaces\.

4\. Scroll transforms

Replace fade\-ups with parse/expand/type/count/unlock\.

IntersectionObserver

useIntersectionOnce wrappers\.

Sections transform with meaning\.

5\. Ambient layer

Add particles/tilt only if policy allows\.

ParticleCanvas, hero card

Optional breathing layer\.

Disabled mobile/reduced motion\.

6\. Cleanup pass

Cancel timers, RAFs, observers on unmount\.

animation utilities

Cleanup functions\.

No leaks or runaway CPU\.

7\. Perf QA

Measure jank, layout shifts, and input response\.

browser devtools

Performance notes\.

Dynamic feel stays fast\.

## Suggested branch and PR sequence

__PR__

__Theme__

__Scope__

__Merge gate__

PR 1

Infrastructure

Add shared config/types/tokens or component shell required by the stage\.

No visual regressions; tests/build pass\.

PR 2

Primary surface

Implement the highest\-signal user\-facing component for this stage\.

Surface matches metaphor and reacts to state\.

PR 3

Cross\-section wiring

Connect state changes to at least one dependent component and Output log\.

Interaction has visible causality\.

PR 4

Mobile compact pass

Adapt controls and layout under 640px\.

No overflow; dynamic behavior preserved\.

PR 5

Accessibility/performance pass

Keyboard, focus, labels, reduced motion, and perf gates\.

QA rubric passes\.

PR 6

Polish and docs

Finalize copy, comments, component contracts, and screenshots\.

Agent report and reviewer checklist complete\.

# 12\. Innovation Extensions

These are optional extensions that go beyond the provided source file while staying aligned with the master design system\. They are not required for the first merge, but they give agents richer routes when the basic implementation is already stable\.

__Extension__

__What it adds__

__Why it is powerful__

__Safeguard__

Event timeline debugger

Dev\-only panel lists recent motion events\.

Makes choreography testable by agents\.

Hide in production\.

Motion budget constants

Central constants for durations, delays, particle counts\.

Prevents random animation timing drift\.

Keep defaults conservative\.

State\-preserving replay

Replay boot or parse sequence in dev mode\.

Useful for QA screenshots\.

Not user\-facing\.

Reduced\-motion snapshot mode

Shows final states instantly for comparison\.

Validates accessibility path\.

Do not skip logs or labels\.

Parser choreography variants

Subtle, target, cinematic parse sequences\.

Gives agents creative options safely\.

Default to target route\.

Interaction soundless rhythm

Use timing cadence like compile/run without audio\.

Adds polish without intrusive sound\.

No autoplay audio\.

# 13\. Red\-Team Failure Patterns

Reviewers should use this section to attack the implementation before users do\. The goal is not to be negative; the goal is to prevent Weld from drifting back into generic SaaS, inaccessible UI, or expensive decorative theatre\.

__Failure pattern__

__What it looks like__

__Fix__

Template drift

Agent adds a generic dark card because it looks clean\.

Force section back to assigned metaphor and component contract\.

Local\-only interaction

Click changes only the clicked element\.

Wire event to shared state and at least one dependent surface\.

Motion theatre

Animation looks cool but communicates nothing\.

Attach motion to boot, compile, parse, verify, claim, success, or error state\.

Mobile flattening

Mobile becomes a static stack\.

Keep compact controls for role, code tab, proof, logs, and CTA\.

Token invention

New hex values appear randomly\.

Replace with Stage 1 tokens or documented state aliases\.

Brand\-risk shortcut

Agent copies official\-looking marks or names\.

Use original icons and descriptive proof wording\.

Accessibility erasure

Hover\-only info or clickable divs are introduced\.

Use semantic controls, labels, focus states, aria\-expanded/aria\-describedby\.

Performance creep

A decorative effect ships with heavy runtime cost\.

Disable on mobile/reduced motion or remove\.

# 14\. Extended Snippets and Agent Guardrails

__Motion guard comment__

// WELD MOTION RULE: this animation must communicate boot, compile, parse, verify, claim, success, or error

  state\. Otherwise remove it\.

__Reduced motion early return__

if \(policy\.reducedMotion\) \{ applyFinalState\(\); appendLog\(message\); return; \}

__Performance cap constants__

const MOTION\_BUDGET = \{ particlesDesktop: 80, particlesMobile: 0, roleCompileMs: 250, counterMs: 1200,

  maxTiltX: 8, maxTiltY: 5 \};

# 15\. Final Handoff Checklist

- Stage 3 implementation references the master dynamic\-first oath in code comments or PR description\.
- Primary components have clear state inputs and event outputs\.
- The agent report lists files changed, state changes, reduced\-motion behavior, mobile behavior, accessibility notes, and deviations\.
- No new generic SaaS cards, gradients, idle shimmer, or decorative\-only motion were introduced\.
- Keyboard navigation, focus\-visible, contrast, mobile, and reduced\-motion checks were performed\.
- A reviewer can name the Roblox Studio/LuaU/Discord/proof metaphor used by the affected section\.
- The implementation leaves future stages easier, not harder\.

