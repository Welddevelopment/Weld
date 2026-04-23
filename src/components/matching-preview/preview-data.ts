import { PreviewProfile } from './preview-types'

const BG = [
  'linear-gradient(135deg,#E84624,#FF8A5C)',
  'linear-gradient(135deg,#FFF5F0,#FF8A5C)',
  'linear-gradient(135deg,#FFB5A7,#E84624)',
  'linear-gradient(135deg,#5DCAA5,#1D9E75)',
  'linear-gradient(135deg,#534AB7,#7F77DD)',
  'linear-gradient(135deg,#378ADD,#85B7EB)',
  'linear-gradient(135deg,#FF6B6B,#FFB5A7)',
  'linear-gradient(135deg,#2D2D2D,#555)',
]

const STUDIO_DETAILS = 'We are an established studio focused on creating highly immersive, monetizable games. Our next phase is about building polished, feature-rich systems with strong UX and beautiful motion work across the whole experience.'

const DEV_SKILL_DESCS: Record<string, string> = {
  'Scripting':    'Multi-year experience building game systems in Luau — DataStores, remote events, server-client architecture, and combat frameworks. Writes readable, documented code that is built to be maintained long-term.',
  'UI Design':    'Designs reactive UI from Figma wireframes to finished Roblox builds. Smooth tweening, mobile-responsive layouts, and UX flows that eliminate friction at every screen.',
  'VFX':          'Creates visual effects that make players stop and stare — explosions, elemental spells, portal warps, and environmental ambiance. Every effect is optimised for performance at scale.',
  'Building':     'Builds large-scale Roblox environments for immersion and performance. Dense city maps, sprawling open worlds, and detailed interiors using CSG, modular sets, and solid LOD structure.',
  '3D Modeling':  'Produces custom assets in Blender — hard-surface props, organic sculpts, and modular kits with PBR textures. All exports are optimised for Roblox poly and texture budgets.',
  'Lighting':     'Combines Atmosphere, Surface Appearance, and dynamic lighting scripts to set the mood — from golden-hour open worlds to tight horror corridors and clean competitive arenas.',
  'Animation':    'Builds character animations, procedural motion rigs, and state-machine controllers. Capable of everything from fluid attack combos to full cinematic cutscenes using Moon Animator.',
  'DataStore':    'Implements persistent player data — XP, inventory, currency, settings — using DataStore2 and ProfileService. Safe retry logic, backup pipelines, and clean API design throughout.',
  'Sound Design': 'Designs original SFX in Logic Pro and Audacity — footsteps, impacts, UI tones, and ambient loops. Mixed to broadcast loudness standards for consistent, professional in-game clarity.',
  'Music':        'Composes adaptive game soundtracks that crossfade between exploration, tension, and combat states. Loop points are seamless and all stems are delivered ready for SoundService integration.',
  'Figma':        'Runs a full design pipeline from wireframe to developer handoff — components, auto-layout, and interactive prototypes so clients know exactly what they are getting before a line is written.',
  'Tweening':     'Specialises in micro-animations that make UI feel alive — entry and exit transitions, button feedback, and animated indicators — all running at 60fps with TweenService.',
  'Particles':    'Advanced particle systems using ParticleEmitter, Beam, and Trail objects — custom textures, emission curves, and layered depth for complex elemental and environmental effects.',
  'Terrain':      'Sculpts natural Roblox terrain with a focus on visual variety and performance — rolling hills, river valleys, island chains, and cave systems across all device tiers.',
  'Game Design':  'Brings structured, GDD-level thinking to Roblox projects — core loop design, economy balance, progression curves, and multiplayer flow designed to drive long-term retention.',
}

type SkillPort = { titles: string[]; descs: string[]; tools: string }
const SKILL_PORTFOLIO: Record<string, SkillPort> = {
  'Scripting':    { titles: ['Combat system & DataStore', 'Multiplayer lobby system', 'Economy & leaderboard backend'], descs: ['Full server-client combat framework with hitboxes, knockback, and persistent stats. Clean OOP Luau documented for handoff.', 'Party/lobby system with matchmaking, private servers, and vote-kick. Server-side validated throughout.', 'In-game currency, shop backend, and real-time leaderboard with safe concurrent-write retry logic.'], tools: 'Luau, DataStore2, Roblox Studio' },
  'UI Design':    { titles: ['Combat HUD & inventory UI', 'Shop & progression screens', 'Mobile-responsive main menu'], descs: ['Health bars, ability icons, and bag grid — designed in Figma and rebuilt with smooth TweenService animations.', 'In-game shop with item previews, currency display, and animated cart. Scales across desktop and mobile.', 'Polished main menu with animated title card, server browser, and settings panel — all tweened at 60fps.'], tools: 'Figma, TweenService, Roblox Studio' },
  'VFX':          { titles: ['Elemental spells — 12 ability FX', 'Environmental ambiance pack', 'Combat hit-reaction effects'], descs: ['Fire, ice, lightning, and void ability effects with custom particle textures. Optimised to 60fps at 50+ players.', 'Dynamic weather, ambient particles, and atmospheric volumetric fog for open-world immersion.', 'On-hit sparks, shockwaves, and screen vignettes for a melee RPG. Layered for visual depth.'], tools: 'ParticleEmitter, Beam, Roblox Studio' },
  'Building':     { titles: ['Fantasy fortress environment', 'Urban map — 5-block city district', 'Underground dungeon biome'], descs: ['Modular stone castle on elevated terrain with CSG detailing and custom Blender props. 3-week build to exact spec.', 'Dense city blocks with interior rooms, road network, and atmospheric lighting. Optimised under 1.2K parts.', 'Multi-room dungeon with fog, a custom tile set, and scripted torch flicker lighting.'], tools: 'Roblox Studio, Blender, Terrain' },
  '3D Modeling':  { titles: ['Custom prop kit — 40 Blender assets', 'Character model & full rig', 'Modular sci-fi building set'], descs: ['40 hand-crafted low-poly props — furniture, crates, barrels — exported from Blender with PBR textures and UV-unwrapped.', 'Original humanoid character modelled and rigged in Blender, imported with custom R15-compatible animations.', 'Tileable wall, floor, and roof modules for a sci-fi base. Clean quad topology, 512px PBR textures throughout.'], tools: 'Blender, Substance Painter, Roblox Studio' },
  'Lighting':     { titles: ['Golden-hour open world pass', 'Horror atmosphere rig', 'Arena PvP lighting setup'], descs: ['Outdoor atmospheric lighting with volumetric fog, dynamic sun angle, and SurfaceAppearance applied across terrain.', 'Dark dungeon rig with scripted torch flicker, ambient fog planes, and jump-scare lighting triggers.', 'Competitive arena with clean, even coverage — no dark-corner exploits, shadow budget tightly optimised.'], tools: 'Atmosphere, SurfaceAppearance, Roblox Studio' },
  'Animation':    { titles: ['Combat animation set — 15 clips', 'NPC idle & patrol cycle', 'Cutscene sequence — 45 seconds'], descs: ['Attack, dodge, block, and death animations for a melee combat system. Built in Moon Animator, exported for R15.', 'Looping walk, idle, and alert states for enemy NPCs with smooth blend transitions via AnimationController.', 'Cinematic cutscene with camera movement, character blocking, and emotion-matched facial rigs.'], tools: 'Moon Animator, Roblox Studio, R15' },
  'DataStore':    { titles: ['Player progression system', 'Inventory & currency backend', 'Cross-server data sync'], descs: ['Complete save/load pipeline for XP, level, inventory, and settings with retry logic and session locking.', 'Stackable item inventory, wallet system, and shop backend — fully persistent across server rejoins.', 'Global leaderboard synced across servers using OrderedDataStore with live-cache invalidation.'], tools: 'DataStore2, ProfileService, Luau' },
  'Sound Design': { titles: ['Full SFX pack — 40 custom sounds', 'Adaptive combat audio system', 'Environmental soundscape'], descs: ['40 original SFX — footsteps, UI clicks, weapon impacts, and ambient loops. Mixed at -14 LUFS for in-game clarity.', 'Dynamic audio that crossfades between exploration and combat states using proximity and health triggers.', 'Layered ambient loops — wind, water, crowd noise, wildlife — for a large open-world biome.'], tools: 'Logic Pro, Audacity, Roblox Studio' },
  'Music':        { titles: ['Game OST — 8 adaptive tracks', 'Combat theme with intensity layers', 'Menu & lobby music pack'], descs: ['8-track adaptive soundtrack that crossfades between exploration, tension, and full combat states via SoundService.', 'Layered combat theme — light, medium, and boss-phase intensity tracks with seamless loop points.', 'Upbeat main menu theme and three lobby variations to keep idle players engaged between rounds.'], tools: 'Logic Pro, FL Studio, Roblox Studio' },
  'Figma':        { titles: ['Full game UI design handoff', 'Onboarding & tutorial flow', 'Brand identity & icon set'], descs: ['Complete component library — HUD, menus, shop, and settings — exported from Figma and rebuilt pixel-perfect in Roblox.', 'New player tutorial overlay with pointer callouts, animated arrows, and a multi-step progress indicator.', 'Logo, colour palette, icon set, and animated splash screen designed for a seasonal Roblox event.'], tools: 'Figma, Photoshop, Roblox Studio' },
  'Tweening':     { titles: ['Animated notification system', 'Smooth loading & transition FX', 'Button & input feedback pack'], descs: ['Popup toast notifications with slide-in, hold, and slide-out cycles — queued to prevent visual overlap.', 'Screen fade, map-load warp, and dimension-transition effects polished to 60fps using TweenService.', 'Button press feedback, hover glow, and toggle state animations rolled out across a full UI component library.'], tools: 'TweenService, Luau, Roblox Studio' },
  'Particles':    { titles: ['Spell particle pack — 8 types', 'Dynamic weather system', 'Hit-reaction FX suite'], descs: ['8 elemental spell particles with custom textures, emission curves, and soft additive shadows. GPU-optimised.', 'Dynamic rain, snow, and fog that responds to in-game weather events using Atmosphere and ParticleEmitter.', 'On-hit sparks, shockwaves, and screen vignettes for a melee combat system. Layered for physical realism.'], tools: 'ParticleEmitter, Beam, Roblox Studio' },
  'Terrain':      { titles: ['Open-world terrain sculpt', 'Mountain biome with caves', 'Island chain map'], descs: ['Rolling hills, river valleys, and dramatic cliff faces sculpted in Roblox Studio with custom grass and rock textures.', 'High-altitude mountain terrain with interior cave systems, stalactites, and underground water pools.', 'Tropical island chain with varied biomes — beach, jungle, volcanic — optimised for smooth rendering on all devices.'], tools: 'Roblox Terrain, Studio, Blender' },
  'Game Design':  { titles: ['Full GDD — combat RPG', 'Economy & progression design', 'Multiplayer loop design'], descs: ['Complete game design document covering core loop, combat system, progression curve, and monetisation for a Roblox RPG.', 'Economy balance sheet, XP curve, shop pricing, and battle pass structure designed around 30-day retention targets.', 'Multiplayer loop design with party flow, matchmaking criteria, and anti-frustration mechanisms.'], tools: 'GDD, Figma, Balancing Sheets' },
}

const WORK_MARKS = ['SC', 'BLD', 'FX', 'HIT', 'TOP', 'ART']
const GAME_MARKS = ['RBX', 'TOP', 'WIN', 'EXP', 'PVP', 'HIT']
const GENRES = ['adventure', 'battler', 'social', 'sim', 'racing']

const GAMES = [
  'Escape Protocol', 'Shadowed Suspects', 'Ascent Challenge', 'Creature Companions',
  'Rogue Seas', 'Rapid Strike', 'Meadowville Life', 'Pet Realm', 'Vault Runners',
  'Hive Empire', 'Prestige Academy', 'Neon District', 'Suburbia RP', 'City Social',
]

function devWork(tags: string[], idx: number) {
  return tags.slice(0, 3).map((tag, offset) => {
    const sp = SKILL_PORTFOLIO[tag]
    const ti = (idx + offset) % 3
    return {
      emoji: WORK_MARKS[(idx + offset) % WORK_MARKS.length],
      title: sp ? sp.titles[ti] : `${tag} commission`,
      desc:  sp ? sp.descs[ti]  : `${tag} work delivered on time.`,
      tools: sp ? sp.tools      : `${tag}, Roblox Studio`,
      time:  `${2 + ((idx + offset) % 5)} weeks`,
      amount: `${700 + (idx + offset) * 250}`,
    }
  })
}

function studioGames(studioIdx: number, gameOffset: number) {
  return [0, 1, 2].map(offset => {
    const seed = studioIdx + offset + 1
    const base = 6 + (seed % 18)
    const currentBase = Math.max(1, Math.floor(base / 3))
    return {
      emoji: GAME_MARKS[(studioIdx + offset) % GAME_MARKS.length],
      title: GAMES[(gameOffset + offset) % GAMES.length],
      desc:  `${GAMES[(gameOffset + offset) % GAMES.length]} is a polished Roblox ${GENRES[offset % 5]} title with daily events, badge progression, and an active live economy built for strong player retention.`,
      plays: `${base + 2}M`,
      topCcu: `${base}K`,
      currentCcu: `${currentBase}.${seed % 9}K`,
    }
  })
}

export const PREVIEW_STUDIOS: PreviewProfile[] = [
  {
    id: 'studio1', type: 'studio', robloxUserId: 2025110, bg: BG[0], badge: 'Studio',
    name: 'NovaStar Studios', role: 'Roblox Game Studio - 12 members',
    bio: 'We build polished, player-first Roblox experiences. Our last game hit 50M visits in 3 months. We move fast and ship quality.',
    details: STUDIO_DETAILS, tags: ['Scripting', 'UI Design', 'VFX', 'Building'],
    meta: 'Hiring Now - Budget: USD - Remote',
    skillsNeeded: [
      { name: 'Scripting', description: 'Looking for scripting specialists to deliver smooth, scalable gameplay systems and server-client architecture in Luau.' },
      { name: 'UI Design',  description: 'Seeking UI designers to build responsive, polished interfaces that work across desktop and mobile.' },
    ],
    topGames: studioGames(0, 0),
  },
  {
    id: 'studio2', type: 'studio', robloxUserId: 13953438, bg: BG[1], badge: 'Studio',
    name: 'PixelForge Co.', role: 'Roblox Game Studio - 6 members',
    bio: 'Fast-paced indie studio obsessed with game feel. We prototype fast, iterate faster, and always ship. Looking for talented scripters and builders.',
    details: STUDIO_DETAILS, tags: ['Building', 'Animation', 'Scripting'],
    meta: 'Hiring Now - Budget: Robux - Remote',
    skillsNeeded: [
      { name: 'Building',   description: 'Looking for builders to rapidly prototype and ship polished game environments that match our fast iteration pace.' },
      { name: 'Animation',  description: 'Seeking animators who can create snappy, game-feel-focused animations on tight timelines.' },
    ],
    topGames: studioGames(1, 4),
  },
  {
    id: 'studio3', type: 'studio', robloxUserId: 63700903, bg: BG[2], badge: 'Studio',
    name: 'Apex Realms', role: 'Roblox Game Studio - 20 members',
    bio: 'We hold ourselves to AAA standards on Roblox. Every detail matters. Looking for senior developers who share that obsession.',
    details: STUDIO_DETAILS, tags: ['Scripting', 'Game Design', 'Lighting'],
    meta: 'Open to Offers - Budget: USD - Remote',
    skillsNeeded: [
      { name: 'Scripting',   description: 'Seeking senior scripting engineers with AAA sensibility — clean architecture, no shortcuts, built to maintain.' },
      { name: 'Game Design', description: 'Looking for game designers who bring structured, data-informed thinking to core loops and progression systems.' },
    ],
    topGames: studioGames(2, 8),
  },
  {
    id: 'studio4', type: 'studio', robloxUserId: 3991272, bg: BG[3], badge: 'Studio',
    name: 'Vortex Labs', role: 'Roblox Game Studio - 8 members',
    bio: 'We push Roblox to its limits. Experimental mechanics, procedural generation, and bleeding-edge tech wrapped in clean UX.',
    details: STUDIO_DETAILS, tags: ['Scripting', 'VFX', 'Building'],
    meta: 'Hiring Now - Budget: USD - Remote',
    skillsNeeded: [
      { name: 'Scripting', description: 'Looking for engineers comfortable with experimental systems, procedural generation, and performance-critical code.' },
      { name: 'VFX',       description: 'Seeking VFX artists who can push Roblox visuals into cutting-edge territory without breaking frame rate.' },
    ],
    topGames: studioGames(3, 2),
  },
  {
    id: 'studio5', type: 'studio', robloxUserId: 4397833, bg: BG[4], badge: 'Studio',
    name: 'Horizon Interactive', role: 'Roblox Game Studio - 15 members',
    bio: 'We create story-driven Roblox experiences with cinematic cutscenes, voice acting, and narrative branching.',
    details: STUDIO_DETAILS, tags: ['Building', 'Animation', 'Lighting'],
    meta: 'Hiring Now - Budget: Mixed - Remote',
    skillsNeeded: [
      { name: 'Building',   description: 'Looking for builders who can create cinematic-quality environments that serve narrative and atmospheric storytelling.' },
      { name: 'Animation',  description: 'Seeking animators with experience in cutscene production, character acting, and emotion-driven motion.' },
    ],
    topGames: studioGames(4, 6),
  },
  {
    id: 'studio6', type: 'studio', robloxUserId: 2312310, bg: BG[5], badge: 'Studio',
    name: 'Deepwater Games', role: 'Roblox Game Studio - 10 members',
    bio: 'We specialise in open-world exploration games. Vast oceans, hidden islands, and emergent multiplayer gameplay.',
    details: STUDIO_DETAILS, tags: ['Building', 'Scripting', 'Terrain'],
    meta: 'Hiring Now - Budget: USD - Remote',
    skillsNeeded: [
      { name: 'Building', description: 'Looking for environment builders to create immersive ocean worlds, hidden islands, and layered exploration spaces.' },
      { name: 'Scripting', description: 'Seeking scripting engineers for open-world multiplayer systems, emergent event logic, and navigation systems.' },
    ],
    topGames: studioGames(5, 10),
  },
  {
    id: 'studio7', type: 'studio', robloxUserId: 2837719, bg: BG[6], badge: 'Studio',
    name: 'Carnival Works', role: 'Roblox Game Studio - 5 members',
    bio: 'Party games, minigame hubs, and social experiences. We make games that groups of friends keep coming back to.',
    details: STUDIO_DETAILS, tags: ['UI Design', 'Scripting', 'Animation'],
    meta: 'Open to Offers - Budget: Robux - Remote',
    skillsNeeded: [
      { name: 'UI Design',  description: 'Looking for UI specialists to create fun, vibrant interfaces that make our social games feel immediately approachable.' },
      { name: 'Scripting',  description: 'Seeking scripting engineers for party game logic, multiplayer minigame systems, and social features.' },
    ],
    topGames: studioGames(6, 1),
  },
  {
    id: 'studio8', type: 'studio', robloxUserId: 3965809, bg: BG[7], badge: 'Studio',
    name: 'Iron Circuit', role: 'Roblox Game Studio - 18 members',
    bio: 'We build competitive multiplayer games with ranked ladders, anti-cheat, and spectator tools. Looking for backend-heavy scripters.',
    details: STUDIO_DETAILS, tags: ['Scripting', 'Game Design', 'UI Design'],
    meta: 'Hiring Now - Budget: USD - Remote',
    skillsNeeded: [
      { name: 'Scripting',   description: 'Looking for backend scripting engineers to build ranked systems, anti-cheat, match validation, and spectator infrastructure.' },
      { name: 'Game Design', description: 'Seeking game designers with competitive multiplayer experience — ladder design, rank calibration, and retention mechanics.' },
    ],
    topGames: studioGames(7, 5),
  },
]

export const PREVIEW_DEVS: PreviewProfile[] = [
  {
    id: 'dev1', type: 'dev', robloxUserId: 2837719, bg: BG[0], badge: 'Pro Developer',
    name: 'DevDave', role: 'Developer - 4yr experience',
    bio: "I've been building Roblox games professionally for four years, shipping everything from solo indie projects to large-team live titles. My strength is owning full verticals — I can design the DataStore schema, write the server-client combat logic, wire up the UI, and layer VFX on top, all within a single project. I write clean, documented OOP Luau that the next developer on the team can actually maintain.",
    tags: ['Scripting', 'UI Design', 'VFX', 'DataStore'], meta: 'Available Now - Rate: USD',
    skills: [{ name: 'Scripting', description: DEV_SKILL_DESCS['Scripting'] }, { name: 'UI Design', description: DEV_SKILL_DESCS['UI Design'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/2837719/profile' }, { name: 'GitHub', url: 'github.com/devdave' }, { name: 'Portfolio Site', url: 'devdave.dev' }] },
    bestWork: devWork(['Scripting', 'UI Design', 'VFX'], 0),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev2', type: 'dev', robloxUserId: 3965809, bg: BG[1], badge: 'Verified',
    name: 'PixelCrafter', role: 'Developer - 3yr experience',
    bio: "Three years into UI work on Roblox and I still design every screen like it is the first thing a player will see. My process starts in Figma, where I build full component libraries before touching Studio, so clients know exactly what they are getting before a line is written. Implementation follows with proper scaling constraints, mobile-responsive layouts, and TweenService transitions that make every state change feel deliberate.",
    tags: ['UI Design', 'Figma', 'Tweening'], meta: 'Available Now - Rate: Fixed',
    skills: [{ name: 'UI Design', description: DEV_SKILL_DESCS['UI Design'] }, { name: 'Figma', description: DEV_SKILL_DESCS['Figma'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/3965809/profile' }, { name: 'GitHub', url: 'github.com/pixelcrafter' }, { name: 'Portfolio Site', url: 'pixelcrafter.dev' }] },
    bestWork: devWork(['UI Design', 'Figma', 'Tweening'], 1),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev3', type: 'dev', robloxUserId: 2207291, bg: BG[2], badge: 'Pro Developer',
    name: 'VFXVirtuoso', role: 'Developer - 5yr experience',
    bio: "Five years of visual effects work across some of Roblox's most effects-heavy projects. I work with particles, beams, and trails, but the real skill is knowing how to layer them so the result reads clearly under any lighting, holds together at 60fps with a full server, and still lands with impact. I have built ability suites for combat games, environmental systems like weather and God rays, and full character animations.",
    tags: ['VFX', 'Particles', 'Animation'], meta: 'Available Now - Rate: Hourly',
    skills: [{ name: 'VFX', description: DEV_SKILL_DESCS['VFX'] }, { name: 'Particles', description: DEV_SKILL_DESCS['Particles'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/2207291/profile' }, { name: 'GitHub', url: 'github.com/vfxvirtuoso' }, { name: 'Portfolio Site', url: 'vfxvirtuoso.dev' }] },
    bestWork: devWork(['VFX', 'Particles', 'Animation'], 2),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev4', type: 'dev', robloxUserId: 80254, bg: BG[3], badge: 'Pro Developer',
    name: 'BuilderBen', role: 'Developer - 6yr experience',
    bio: "Six years building environments for Roblox, from small commissions to multi-biome open worlds with over 150,000 parts. I work in Studio and Blender — CSG, modular kits, and custom props to hit whatever visual target the project needs. My builds are made to run, not just to look good: part counts, draw calls, and shadow budgets are managed from the first block placed, not patched in at the end.",
    tags: ['Building', '3D Modeling', 'Lighting'], meta: 'Available Now - Rate: Fixed',
    skills: [{ name: 'Building', description: DEV_SKILL_DESCS['Building'] }, { name: '3D Modeling', description: DEV_SKILL_DESCS['3D Modeling'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/80254/profile' }, { name: 'GitHub', url: 'github.com/builderben' }, { name: 'Portfolio Site', url: 'builderben.dev' }] },
    bestWork: devWork(['Building', '3D Modeling', 'Lighting'], 3),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev5', type: 'dev', robloxUserId: 82471, bg: BG[4], badge: 'Verified',
    name: 'SonicSam', role: 'Developer - 4yr experience',
    bio: "Four years of audio work split between original composition and sound design for Roblox. On the music side, I write adaptive scores that crossfade based on game state. My SFX covers the full range: weapons, UI tones, environmental ambiance, creature audio, and impact layers, all designed in Logic Pro and Audacity. I also handle the scripting side — SoundService integration, proximity triggers, volume fading, and playlist controllers.",
    tags: ['Sound Design', 'Music', 'Scripting'], meta: 'Available Now - Rate: Hourly',
    skills: [{ name: 'Sound Design', description: DEV_SKILL_DESCS['Sound Design'] }, { name: 'Music', description: DEV_SKILL_DESCS['Music'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/82471/profile' }, { name: 'GitHub', url: 'github.com/sonicsam' }, { name: 'Portfolio Site', url: 'sonicsam.dev' }] },
    bestWork: devWork(['Sound Design', 'Music', 'Scripting'], 4),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev6', type: 'dev', robloxUserId: 123247, bg: BG[5], badge: 'Verified',
    name: 'LuaLegend', role: 'Developer - 3yr experience',
    bio: "Three years of Roblox development focused primarily on scripting and game design. I have shipped multiple complete projects and work well within larger teams or solo on well-scoped commissions. My approach is to understand the player experience first and build the technical solution around that — not the other way around.",
    tags: ['Scripting', 'Game Design', 'DataStore'], meta: 'Available Now - Rate: USD',
    skills: [{ name: 'Scripting', description: DEV_SKILL_DESCS['Scripting'] }, { name: 'Game Design', description: DEV_SKILL_DESCS['Game Design'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/123247/profile' }, { name: 'GitHub', url: 'github.com/lualegend' }, { name: 'Portfolio Site', url: 'lualegend.dev' }] },
    bestWork: devWork(['Scripting', 'Game Design', 'DataStore'], 5),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev7', type: 'dev', robloxUserId: 2025110, bg: BG[6], badge: 'Pro Developer',
    name: 'AnimatrixPro', role: 'Developer - 5yr experience',
    bio: "Five years of animation work on Roblox covering character rigs, cutscenes, NPC state machines, and procedural motion. I use Moon Animator for all my work and deliver R15-compatible outputs with clean blend trees. I have animated everything from idle loops to 90-second cinematic sequences with voice-acted characters.",
    tags: ['Animation', 'VFX', 'Building'], meta: 'Available Now - Rate: Fixed',
    skills: [{ name: 'Animation', description: DEV_SKILL_DESCS['Animation'] }, { name: 'VFX', description: DEV_SKILL_DESCS['VFX'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/2025110/profile' }, { name: 'GitHub', url: 'github.com/animatrixpro' }, { name: 'Portfolio Site', url: 'animatrixpro.dev' }] },
    bestWork: devWork(['Animation', 'VFX', 'Building'], 6),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev8', type: 'dev', robloxUserId: 156, bg: BG[7], badge: 'Verified',
    name: 'TerrainTitan', role: 'Developer - 4yr experience',
    bio: "Four years sculpting Roblox terrain across a range of project types — tropical islands, mountain ranges, underground caves, and dense urban areas. I combine Roblox's terrain tools with Blender for detail work and always optimise for render performance from day one. Every environment I ship is built for the players who will explore it, not just for screenshots.",
    tags: ['Terrain', 'Building', 'Lighting'], meta: 'Available Now - Rate: USD',
    skills: [{ name: 'Terrain', description: DEV_SKILL_DESCS['Terrain'] }, { name: 'Building', description: DEV_SKILL_DESCS['Building'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/156/profile' }, { name: 'GitHub', url: 'github.com/terraintitan' }, { name: 'Portfolio Site', url: 'terraintitan.dev' }] },
    bestWork: devWork(['Terrain', 'Building', 'Lighting'], 7),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
]
