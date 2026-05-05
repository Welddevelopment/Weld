import { PreviewProfile } from './preview-types'

export const BG = [
  'linear-gradient(135deg,#E84624,#FF8A5C)',
  'linear-gradient(135deg,#FFF5F0,#FF8A5C)',
  'linear-gradient(135deg,#FFB5A7,#E84624)',
  'linear-gradient(135deg,#5DCAA5,#1D9E75)',
  'linear-gradient(135deg,#534AB7,#7F77DD)',
  'linear-gradient(135deg,#378ADD,#85B7EB)',
  'linear-gradient(135deg,#FF6B6B,#FFB5A7)',
  'linear-gradient(135deg,#2D2D2D,#555)',
]

// Real Roblox creator IDs — recognisable avatars
const RBX = [
  1,          // Roblox (official)
  156,        // builderman
  80254,      // Stickmasterluke
  82471,      // Dued1
  123247,     // alexnewtron
  2025110,    // badcc
  2207291,    // Linkmon99
  2312310,    // loleris
  2837719,    // asimo3089
  3965809,    // po_ke
  3991272,    // Pokediger1
  4397833,    // Quenty
  13953438,   // NewFissy
  63700903,   // Coeptus
  89174331,   // greenlegocats123
  121823922,  // DenisDaily
  140258990,  // KreekCraft
  339310190,  // mrflimflam (Flamingo)
]

const STUDIO_DETAILS = 'We are an established studio focused on creating highly immersive, monetizable games. Our next phase is about building polished, feature-rich systems with strong UX and beautiful motion work across the whole experience.'

export const DEV_SKILL_DESCS: Record<string, string> = {
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
  { title: 'Blox Fruits', placeId: 2753915549, url: 'https://www.roblox.com/games/2753915549/Blox-Fruits' },
  { title: 'Jailbreak', placeId: 606849621, url: 'https://www.roblox.com/games/606849621/Jailbreak' },
  { title: 'Arsenal', placeId: 286090429, url: 'https://www.roblox.com/games/286090429/Arsenal' },
  { title: 'Adopt Me!', placeId: 920587237, url: 'https://www.roblox.com/games/920587237/Adopt-Me' },
  { title: 'Brookhaven 🏡RP', placeId: 185655149, url: 'https://www.roblox.com/games/185655149/Brookhaven-RP' },
  { title: 'Slap Battles', placeId: 6403373529, url: 'https://www.roblox.com/games/6403373529/Slap-Battles' },
  { title: 'Build a Boat for Treasure', placeId: 537413528, url: 'https://www.roblox.com/games/537413528/Build-a-Boat-for-Treasure' },
  { title: 'Fishing Simulator', placeId: 1623582750, url: 'https://www.roblox.com/games/1623582750/Fishing-Simulator' },
  { title: 'Lumber Tycoon 2', placeId: 207517599, url: 'https://www.roblox.com/games/207517599/Lumber-Tycoon-2' },
  { title: 'Murder Mystery 2', placeId: 142823291, url: 'https://www.roblox.com/games/142823291/Murder-Mystery-2' },
  { title: 'Royale High', placeId: 735030788, url: 'https://www.roblox.com/games/735030788/Royale-High' },
  { title: 'Natural Disaster Survival', placeId: 189707, url: 'https://www.roblox.com/games/189707/Natural-Disaster-Survival' },
]

const WORK_GAME_IDS = [
  2753915549,  // Blox Fruits - combat systems
  606849621,   // Jailbreak - heist gameplay
  286090429,   // Arsenal - action/competitive
  920587237,   // Adopt Me - social systems
  185655149,   // Brookhaven - roleplay
  6403373529,  // Slap Battles - minigame/competitive
  537413528,   // Build a Boat - building
  1623582750,  // Fishing Simulator - systems
  207517599,   // Lumber Tycoon 2 - economy
  142823291,   // Murder Mystery 2 - game design
  735030788,   // Royale High - UI/UX
  189707,      // Natural Disaster - effects/systems
]

function devWork(tags: string[], idx: number) {
  return tags.slice(0, 3).map((tag, offset) => {
    const sp = SKILL_PORTFOLIO[tag]
    const ti = (idx + offset) % 3
    const gameId = WORK_GAME_IDS[(idx + offset) % WORK_GAME_IDS.length]
    return {
      emoji: WORK_MARKS[(idx + offset) % WORK_MARKS.length],
      title: sp ? sp.titles[ti] : `${tag} commission`,
      desc:  sp ? sp.descs[ti]  : `${tag} work delivered on time.`,
      tools: sp ? sp.tools      : `${tag}, Roblox Studio`,
      time:  `${2 + ((idx + offset) % 5)} weeks`,
      amount: `${700 + (idx + offset) * 250}`,
      plays: `${4 + ((idx * 13 + offset * 9) % 42)}M`,
      imageUrl: `https://www.roblox.com/asset-thumbnail/image?assetId=${gameId}&width=432&height=243&format=png`,
    }
  })
}

function studioGames(studioIdx: number, gameOffset: number) {
  return [0, 1, 2].map(offset => {
    const seed = studioIdx + offset + 1
    const base = 6 + (seed % 18)
    const currentBase = Math.max(1, Math.floor(base / 3))
    const game = GAMES[(gameOffset + offset) % GAMES.length]
    return {
      emoji: GAME_MARKS[(studioIdx + offset) % GAME_MARKS.length],
      title: game.title,
      desc:  `${game.title} is a polished Roblox ${GENRES[offset % 5]} title with daily events, badge progression, and an active live economy built for strong player retention.`,
      plays: `${base + 2}M`,
      topCcu: `${base}K`,
      currentCcu: `${currentBase}.${seed % 9}K`,
      gameUrl: game.url,
      imageUrl: `https://www.roblox.com/asset-thumbnail/image?assetId=${game.placeId}&width=768&height=432&format=png`,
    }
  })
}

const BASE_PREVIEW_STUDIOS: PreviewProfile[] = [
  {
    id: 'studio1', type: 'studio', robloxUserId: RBX[5], bg: BG[0], badge: 'Studio',
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
    id: 'studio2', type: 'studio', robloxUserId: RBX[12], bg: BG[1], badge: 'Studio',
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
    id: 'studio3', type: 'studio', robloxUserId: RBX[13], bg: BG[2], badge: 'Studio',
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
    id: 'studio4', type: 'studio', robloxUserId: RBX[10], bg: BG[3], badge: 'Studio',
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
    id: 'studio5', type: 'studio', robloxUserId: RBX[11], bg: BG[4], badge: 'Studio',
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
    id: 'studio6', type: 'studio', robloxUserId: RBX[7], bg: BG[5], badge: 'Studio',
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
    id: 'studio7', type: 'studio', robloxUserId: RBX[8], bg: BG[6], badge: 'Studio',
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
    id: 'studio8', type: 'studio', robloxUserId: RBX[9], bg: BG[7], badge: 'Studio',
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
  {
    id: 'studio9', type: 'studio', robloxUserId: RBX[0], bg: BG[0], badge: 'Studio',
    name: 'Quantum Interactive', role: 'Roblox Game Studio - 14 members',
    bio: 'We make physics-driven Roblox experiences where the environment is the mechanic. Gravity puzzles, momentum combat, and simulation depth that Roblox has never seen. We want engineers who think in systems.',
    details: STUDIO_DETAILS, tags: ['Scripting', 'VFX', 'Game Design', 'UI Design'],
    meta: 'Hiring Now - Budget: USD - Remote',
    skillsNeeded: [
      { name: 'Scripting',   description: 'Seeking engineers fluent in physics simulations, momentum-based mechanics, and server-authoritative state management.' },
      { name: 'Game Design', description: 'Looking for designers who can design around emergent physics and systemic mechanics, not just traditional progression loops.' },
    ],
    topGames: studioGames(8, 3),
  },
  {
    id: 'studio10', type: 'studio', robloxUserId: RBX[1], bg: BG[1], badge: 'Studio',
    name: 'Neon Sphere', role: 'Roblox Game Studio - 7 members',
    bio: 'Cyberpunk aesthetics, neon-lit cityscapes, and fast-paced arcade action. Every game we ship has a distinct visual identity and a tight core loop. Small team, outsized output.',
    details: STUDIO_DETAILS, tags: ['VFX', 'Lighting', 'UI Design', 'Scripting'],
    meta: 'Open to Offers - Budget: Robux - Remote',
    skillsNeeded: [
      { name: 'VFX',     description: 'Seeking VFX artists with a strong aesthetic eye for neon, glow, and cyberpunk particle language that sells the world.' },
      { name: 'Lighting', description: 'Looking for lighting specialists to animate neon cityscapes with dynamic scripts, atmospheric fog, and colour grading.' },
    ],
    topGames: studioGames(9, 7),
  },
  {
    id: 'studio11', type: 'studio', robloxUserId: RBX[2], bg: BG[2], badge: 'Studio',
    name: 'Cobalt Studios', role: 'Roblox Game Studio - 11 members',
    bio: 'We specialise in third-person action games. Tight combat, smooth animations, and server-authoritative hit detection built to withstand competitive play. We care about game feel above everything.',
    details: STUDIO_DETAILS, tags: ['Scripting', 'Animation', 'Building', 'VFX'],
    meta: 'Hiring Now - Budget: USD - Remote',
    skillsNeeded: [
      { name: 'Scripting',  description: 'Seeking engineers with server-authoritative combat experience — hitboxes, knockback, and player-state machines for action games.' },
      { name: 'Animation',  description: 'Looking for animators who understand game feel — snappy attacks, smooth dodges, and idles that make characters feel alive.' },
    ],
    topGames: studioGames(10, 11),
  },
  {
    id: 'studio12', type: 'studio', robloxUserId: RBX[3], bg: BG[3], badge: 'Studio',
    name: 'Prisma Games', role: 'Roblox Game Studio - 4 members',
    bio: 'A small, design-led studio shipping puzzle and narrative games with exceptional UI. We want a scripter and a UI developer to join a lean team that finishes everything it starts.',
    details: STUDIO_DETAILS, tags: ['Game Design', 'UI Design', 'Scripting', 'Figma'],
    meta: 'Open to Offers - Budget: Mixed - Remote',
    skillsNeeded: [
      { name: 'UI Design',  description: 'Seeking a UI designer who leads with craft — Figma-first, component-driven, obsessed with flow and micro-interactions.' },
      { name: 'Scripting',  description: 'Looking for a scripter who can implement complex puzzle mechanics cleanly and collaborate closely with a design-led team.' },
    ],
    topGames: studioGames(11, 9),
  },
  {
    id: 'studio13', type: 'studio', robloxUserId: RBX[4], bg: BG[4], badge: 'Studio',
    name: 'Echo Labs', role: 'Roblox Game Studio - 16 members',
    bio: 'Social gaming is our DNA. We build experiences where the social layer is the product — friend groups, live events, user-generated moments. Looking for engineers who understand what makes players bring their friends.',
    details: STUDIO_DETAILS, tags: ['Scripting', 'Game Design', 'DataStore', 'UI Design'],
    meta: 'Hiring Now - Budget: USD - Remote',
    skillsNeeded: [
      { name: 'Scripting',  description: 'Seeking engineers who understand social systems — friend flows, shared sessions, live event triggers, and notification stacks.' },
      { name: 'DataStore',  description: 'Looking for DataStore engineers to build reliable, scalable player-data infrastructure for large daily active user counts.' },
    ],
    topGames: studioGames(12, 13),
  },
  {
    id: 'studio14', type: 'studio', robloxUserId: RBX[5], bg: BG[5], badge: 'Studio',
    name: 'Titan Forge', role: 'Roblox Game Studio - 22 members',
    bio: 'One of the largest independent Roblox studios. Full production pipeline, weekly playtests, dedicated QA, and a clear roadmap. We want senior developers who are done with hobby projects.',
    details: STUDIO_DETAILS, tags: ['Building', 'Scripting', '3D Modeling', 'VFX'],
    meta: 'Open to Offers - Budget: USD - Remote',
    skillsNeeded: [
      { name: 'Building',   description: 'Seeking senior builders for large-scale environment production — modular kits, multi-biome worlds, and detailed interiors at production pace.' },
      { name: 'Scripting',  description: 'Looking for senior scripting engineers able to own complete game systems from design through QA in a full production pipeline.' },
    ],
    topGames: studioGames(13, 12),
  },
  {
    id: 'studio15', type: 'studio', robloxUserId: RBX[6], bg: BG[6], badge: 'Studio',
    name: 'Mythic Hub', role: 'Roblox Game Studio - 9 members',
    bio: 'RPG is all we do. Skill trees, class systems, boss fights with scripted phases, and persistent guild economies. If you have shipped an RPG system on Roblox, we want to talk.',
    details: STUDIO_DETAILS, tags: ['Game Design', 'Scripting', 'VFX', 'Animation'],
    meta: 'Hiring Now - Budget: Robux - Remote',
    skillsNeeded: [
      { name: 'Game Design', description: 'Seeking game designers with RPG systems experience — skill trees, class balance, economy design, and boss encounter scripting.' },
      { name: 'Scripting',   description: 'Looking for scripting engineers who have shipped RPG mechanics — combat systems, loot tables, and persistent progression.' },
    ],
    topGames: studioGames(14, 1),
  },
  {
    id: 'studio16', type: 'studio', robloxUserId: RBX[7], bg: BG[7], badge: 'Studio',
    name: 'PolyWorks', role: 'Roblox Game Studio - 6 members',
    bio: 'Low-poly art direction with high-production-value execution. We prove that restraint and craft beat raw fidelity every time. Looking for artists and builders who understand the discipline of minimalism.',
    details: STUDIO_DETAILS, tags: ['3D Modeling', 'Building', 'VFX', 'Lighting'],
    meta: 'Open to Offers - Budget: Fixed - Remote',
    skillsNeeded: [
      { name: '3D Modeling', description: 'Seeking Blender artists with a strong low-poly aesthetic sensibility and discipline to work within tight poly and texture budgets.' },
      { name: 'Building',    description: 'Looking for builders who understand restraint — clean modular sets, good LOD discipline, and compositional minimalism.' },
    ],
    topGames: studioGames(15, 5),
  },
  {
    id: 'studio17', type: 'studio', robloxUserId: RBX[8], bg: BG[0], badge: 'Studio',
    name: 'Arcade Zero', role: 'Roblox Game Studio - 3 members',
    bio: 'Retro arcade games rebuilt for Roblox. Fast rounds, high scores, leaderboards, and pure fun. A micro-studio that ships frequently and keeps scope tight.',
    details: STUDIO_DETAILS, tags: ['Scripting', 'UI Design', 'Sound Design', 'Game Design'],
    meta: 'Hiring Now - Budget: Robux - Remote',
    skillsNeeded: [
      { name: 'Scripting',  description: 'Seeking a scripter for round-based game logic, leaderboard systems, and the responsive input handling that arcade games demand.' },
      { name: 'UI Design',  description: 'Looking for a UI designer to create clean, readable arcade-style HUDs and score displays that work at a glance.' },
    ],
    topGames: studioGames(16, 0),
  },
  {
    id: 'studio18', type: 'studio', robloxUserId: RBX[9], bg: BG[1], badge: 'Studio',
    name: 'GigaByte Studios', role: 'Roblox Game Studio - 19 members',
    bio: 'Performance is our obsession. Every system we ship is profiled, optimised, and stress-tested at scale. We build the infrastructure other studios wish they had and we are growing the team to match.',
    details: STUDIO_DETAILS, tags: ['Scripting', 'DataStore', 'Game Design', 'UI Design'],
    meta: 'Hiring Now - Budget: USD - Remote',
    skillsNeeded: [
      { name: 'Scripting',  description: 'Seeking engineers with a track record of optimising server performance — profiling tools, memory management, and clean async patterns.' },
      { name: 'DataStore',  description: 'Looking for DataStore specialists with experience maintaining large-scale player-data systems under heavy concurrent load.' },
    ],
    topGames: studioGames(17, 4),
  },
  {
    id: 'studio19', type: 'studio', robloxUserId: RBX[10], bg: BG[2], badge: 'Studio',
    name: 'Skybound Co.', role: 'Roblox Game Studio - 8 members',
    bio: 'Aviation, exploration, and open-world flight experiences. We are the only studio making serious flight mechanics on Roblox. Huge maps, realistic physics-adjacent handling, and a passionate community.',
    details: STUDIO_DETAILS, tags: ['Building', 'Terrain', 'Scripting', 'VFX'],
    meta: 'Open to Offers - Budget: Mixed - Remote',
    skillsNeeded: [
      { name: 'Building', description: 'Seeking environment builders to create large-scale outdoor maps — airfields, elevated terrain, and open skies with controlled performance.' },
      { name: 'Terrain',  description: 'Looking for terrain artists to sculpt natural elevated landscapes that give our flight experiences compelling scenery to fly through.' },
    ],
    topGames: studioGames(18, 8),
  },
  {
    id: 'studio20', type: 'studio', robloxUserId: RBX[11], bg: BG[3], badge: 'Studio',
    name: 'Lumina Interactive', role: 'Roblox Game Studio - 13 members',
    bio: 'Lighting and atmosphere are our signature. We use every Roblox lighting tool — Atmosphere, SurfaceAppearance, dynamic scripts — to create worlds that feel alive and different at every time of day.',
    details: STUDIO_DETAILS, tags: ['Lighting', 'Building', 'VFX', 'Particles'],
    meta: 'Hiring Now - Budget: USD - Remote',
    skillsNeeded: [
      { name: 'Lighting',  description: 'Seeking lighting specialists who work with Atmosphere, SurfaceAppearance, and dynamic scripts to create time-of-day systems and event-driven lighting.' },
      { name: 'Particles', description: 'Looking for particle artists to add ambient environmental FX — dust, fog wisps, fireflies, and weather particles — across our game worlds.' },
    ],
    topGames: studioGames(19, 12),
  },
  {
    id: 'studio21', type: 'studio', robloxUserId: RBX[12], bg: BG[4], badge: 'Studio',
    name: 'Shadow Play', role: 'Roblox Game Studio - 5 members',
    bio: 'We make horror games that earn their scares through tension, not jumpscares. Scripted sequences, environmental storytelling, and audio direction that makes players not want to play alone.',
    details: STUDIO_DETAILS, tags: ['Building', 'Lighting', 'Scripting', 'Sound Design'],
    meta: 'Open to Offers - Budget: USD - Remote',
    skillsNeeded: [
      { name: 'Building',     description: 'Seeking environment builders who understand horror design — constrained space, sightlines, and hiding spots that create tension through layout.' },
      { name: 'Sound Design', description: 'Looking for a sound designer to create original horror SFX — ambient dread, jump scare stings, and environmental audio that makes the space feel alive.' },
    ],
    topGames: studioGames(20, 3),
  },
  {
    id: 'studio22', type: 'studio', robloxUserId: RBX[13], bg: BG[5], badge: 'Studio',
    name: 'Astral Studios', role: 'Roblox Game Studio - 17 members',
    bio: 'Sci-fi world-building at Roblox scale. Space stations, alien planets, and zero-gravity mechanics. Our team has shipped three space games with a combined 80M visits and we are building the fourth.',
    details: STUDIO_DETAILS, tags: ['Building', '3D Modeling', 'VFX', 'Scripting'],
    meta: 'Hiring Now - Budget: USD - Remote',
    skillsNeeded: [
      { name: '3D Modeling', description: 'Seeking modellers with hard-surface and sci-fi asset experience — spacecraft, station modules, and alien props that look native to Roblox.' },
      { name: 'Scripting',   description: 'Looking for engineers experienced with physics-adjacent mechanics, zero-gravity systems, and large-scale multiplayer space environments.' },
    ],
    topGames: studioGames(21, 7),
  },
  {
    id: 'studio23', type: 'studio', robloxUserId: RBX[14], bg: BG[6], badge: 'Studio',
    name: 'Redline Games', role: 'Roblox Game Studio - 10 members',
    bio: 'Racing and competitive action is our lane. Physics-respecting vehicle systems, time-trial leaderboards, and live competitive events. Looking for developers who want to work on technically demanding vehicle code.',
    details: STUDIO_DETAILS, tags: ['Scripting', 'UI Design', 'Game Design', 'VFX'],
    meta: 'Open to Offers - Budget: Robux - Remote',
    skillsNeeded: [
      { name: 'Scripting',   description: 'Seeking engineers with vehicle system experience — physics tuning, controller handling, and server-authoritative race validation.' },
      { name: 'Game Design', description: 'Looking for game designers who specialise in competitive racing — track design, race rules, leaderboard structure, and live event formats.' },
    ],
    topGames: studioGames(22, 11),
  },
  {
    id: 'studio24', type: 'studio', robloxUserId: RBX[15], bg: BG[7], badge: 'Studio',
    name: 'Byte Crafters', role: 'Roblox Game Studio - 12 members',
    bio: 'Simulation and strategy games built for long sessions. Factory builders, city sims, and tycoon loops with genuine economic depth. We design for the players who stay online for hours, not minutes.',
    details: STUDIO_DETAILS, tags: ['Game Design', 'Scripting', 'UI Design', 'DataStore'],
    meta: 'Hiring Now - Budget: Mixed - Remote',
    skillsNeeded: [
      { name: 'Game Design', description: 'Seeking game designers with simulation experience — factory loops, resource economies, progression pacing, and long-session retention design.' },
      { name: 'DataStore',   description: 'Looking for DataStore engineers to build the persistent economic state that simulation games require across long player sessions.' },
    ],
    topGames: studioGames(23, 2),
  },
  {
    id: 'studio25', type: 'studio', robloxUserId: RBX[16], bg: BG[0], badge: 'Studio',
    name: 'Vanguard', role: 'Roblox Game Studio - 21 members',
    bio: 'Bringing FPS-adjacent competitive mechanics to Roblox — hit detection, movement systems, and ranked infrastructure that can hold up under real competitive play.',
    details: STUDIO_DETAILS, tags: ['Scripting', 'Game Design', 'DataStore', 'UI Design'],
    meta: 'Open to Offers - Budget: USD - Remote',
    skillsNeeded: [
      { name: 'Scripting',  description: 'Seeking engineers with competitive multiplayer experience — hit detection, lag compensation, and ranked match infrastructure.' },
      { name: 'DataStore',  description: 'Looking for DataStore specialists to build ELO systems, match history storage, and season-based leaderboard infrastructure.' },
    ],
    topGames: studioGames(24, 6),
  },
  {
    id: 'studio26', type: 'studio', robloxUserId: RBX[17], bg: BG[1], badge: 'Studio',
    name: 'Genesis Devs', role: 'Roblox Game Studio - 7 members',
    bio: 'Sandbox world-building games where players shape the environment. Terraforming, construction systems, and player-driven economies. We want builders and engineers who understand emergent design.',
    details: STUDIO_DETAILS, tags: ['Building', 'Terrain', 'Scripting', 'Game Design'],
    meta: 'Hiring Now - Budget: USD - Remote',
    skillsNeeded: [
      { name: 'Building',    description: 'Seeking builders who understand sandbox design — terrain systems, construction grids, player-placed structures, and dynamic environment updates.' },
      { name: 'Game Design', description: 'Looking for game designers experienced in emergent systems — player economies, sandbox progression, and open-ended objective design.' },
    ],
    topGames: studioGames(25, 9),
  },
  {
    id: 'studio27', type: 'studio', robloxUserId: RBX[0], bg: BG[2], badge: 'Studio',
    name: 'Ignite Studios', role: 'Roblox Game Studio - 15 members',
    bio: 'Action-adventure games with polished combat, hand-crafted level design, and a strong creative vision. We hold every feature to a bar and only ship when it is ready.',
    details: STUDIO_DETAILS, tags: ['Scripting', 'VFX', 'Animation', 'Building'],
    meta: 'Open to Offers - Budget: Robux - Remote',
    skillsNeeded: [
      { name: 'Animation', description: 'Seeking animators with polished action-adventure experience — combat set pieces, enemy movement, and cinematic transitions between states.' },
      { name: 'VFX',       description: 'Looking for VFX artists to add visual punch to our combat systems — hits, spells, explosions, and environmental effects.' },
    ],
    topGames: studioGames(26, 13),
  },
  {
    id: 'studio28', type: 'studio', robloxUserId: RBX[1], bg: BG[3], badge: 'Studio',
    name: 'Apex Forge', role: 'Roblox Game Studio - 20 members',
    bio: 'Ranked competitive games with DataStore infrastructure built for millions of daily players. Matchmaking, ELO systems, anti-cheat, and spectator tools. We hire the best and hold ourselves to it.',
    details: STUDIO_DETAILS, tags: ['Scripting', 'DataStore', 'Game Design', 'UI Design'],
    meta: 'Hiring Now - Budget: USD - Remote',
    skillsNeeded: [
      { name: 'Scripting',  description: 'Seeking top-tier scripting engineers for matchmaking systems, ranked infrastructure, and competitive match validation at scale.' },
      { name: 'UI Design',  description: 'Looking for UI specialists with competitive game experience — match HUDs, scoreboard displays, and ranked progression screens.' },
    ],
    topGames: studioGames(27, 4),
  },
]

const BASE_PREVIEW_DEVS: PreviewProfile[] = [
  {
    id: 'dev1', type: 'dev', robloxUserId: RBX[8], bg: BG[0], badge: 'Pro Developer',
    name: 'DevDave', role: 'Developer - 4yr experience',
    bio: "I've been building Roblox games professionally for four years, shipping everything from solo indie projects to large-team live titles. My strength is owning full verticals — I can design the DataStore schema, write the server-client combat logic, wire up the UI, and layer VFX on top, all within a single project. I write clean, documented OOP Luau that the next developer on the team can actually maintain.",
    tags: ['Scripting', 'UI Design', 'VFX', 'DataStore'], meta: 'Available Now - Rate: USD',
    skills: [{ name: 'Scripting', description: DEV_SKILL_DESCS['Scripting'] }, { name: 'UI Design', description: DEV_SKILL_DESCS['UI Design'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/2837719/profile' }, { name: 'GitHub', url: 'github.com/devdave' }, { name: 'Portfolio Site', url: 'devdave.dev' }] },
    bestWork: devWork(['Scripting', 'UI Design', 'VFX'], 0),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev2', type: 'dev', robloxUserId: RBX[9], bg: BG[1], badge: 'Verified',
    name: 'PixelCrafter', role: 'Developer - 3yr experience',
    bio: "Three years into UI work on Roblox and I still design every screen like it is the first thing a player will see. My process starts in Figma, where I build full component libraries before touching Studio, so clients know exactly what they are getting before a line is written. Implementation follows with proper scaling constraints, mobile-responsive layouts, and TweenService transitions that make every state change feel deliberate.",
    tags: ['UI Design', 'Figma', 'Tweening'], meta: 'Available Now - Rate: Fixed',
    skills: [{ name: 'UI Design', description: DEV_SKILL_DESCS['UI Design'] }, { name: 'Figma', description: DEV_SKILL_DESCS['Figma'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/3965809/profile' }, { name: 'GitHub', url: 'github.com/pixelcrafter' }, { name: 'Portfolio Site', url: 'pixelcrafter.dev' }] },
    bestWork: devWork(['UI Design', 'Figma', 'Tweening'], 1),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev3', type: 'dev', robloxUserId: RBX[6], bg: BG[2], badge: 'Pro Developer',
    name: 'VFXVirtuoso', role: 'Developer - 5yr experience',
    bio: "Five years of visual effects work across some of Roblox's most effects-heavy projects. I work with particles, beams, and trails, but the real skill is knowing how to layer them so the result reads clearly under any lighting, holds together at 60fps with a full server, and still lands with impact. I have built ability suites for combat games, environmental systems like weather and God rays, and full character animations.",
    tags: ['VFX', 'Particles', 'Animation'], meta: 'Available Now - Rate: Hourly',
    skills: [{ name: 'VFX', description: DEV_SKILL_DESCS['VFX'] }, { name: 'Particles', description: DEV_SKILL_DESCS['Particles'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/2207291/profile' }, { name: 'GitHub', url: 'github.com/vfxvirtuoso' }, { name: 'Portfolio Site', url: 'vfxvirtuoso.dev' }] },
    bestWork: devWork(['VFX', 'Particles', 'Animation'], 2),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev4', type: 'dev', robloxUserId: RBX[2], bg: BG[3], badge: 'Pro Developer',
    name: 'BuilderBen', role: 'Developer - 6yr experience',
    bio: "Six years building environments for Roblox, from small commissions to multi-biome open worlds with over 150,000 parts. I work in Studio and Blender — CSG, modular kits, and custom props to hit whatever visual target the project needs. My builds are made to run, not just to look good: part counts, draw calls, and shadow budgets are managed from the first block placed, not patched in at the end.",
    tags: ['Building', '3D Modeling', 'Lighting'], meta: 'Available Now - Rate: Fixed',
    skills: [{ name: 'Building', description: DEV_SKILL_DESCS['Building'] }, { name: '3D Modeling', description: DEV_SKILL_DESCS['3D Modeling'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/80254/profile' }, { name: 'GitHub', url: 'github.com/builderben' }, { name: 'Portfolio Site', url: 'builderben.dev' }] },
    bestWork: devWork(['Building', '3D Modeling', 'Lighting'], 3),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev5', type: 'dev', robloxUserId: RBX[3], bg: BG[4], badge: 'Verified',
    name: 'SonicSam', role: 'Developer - 4yr experience',
    bio: "Four years of audio work split between original composition and sound design for Roblox. On the music side, I write adaptive scores that crossfade based on game state. My SFX covers the full range: weapons, UI tones, environmental ambiance, creature audio, and impact layers, all designed in Logic Pro and Audacity. I also handle the scripting side — SoundService integration, proximity triggers, volume fading, and playlist controllers.",
    tags: ['Sound Design', 'Music', 'Scripting'], meta: 'Available Now - Rate: Hourly',
    skills: [{ name: 'Sound Design', description: DEV_SKILL_DESCS['Sound Design'] }, { name: 'Music', description: DEV_SKILL_DESCS['Music'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/82471/profile' }, { name: 'GitHub', url: 'github.com/sonicsam' }, { name: 'Portfolio Site', url: 'sonicsam.dev' }] },
    bestWork: devWork(['Sound Design', 'Music', 'Scripting'], 4),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev6', type: 'dev', robloxUserId: RBX[4], bg: BG[5], badge: 'Verified',
    name: 'LuaLegend', role: 'Developer - 3yr experience',
    bio: "Three years of Roblox development focused primarily on scripting and game design. I have shipped multiple complete projects and work well within larger teams or solo on well-scoped commissions. My approach is to understand the player experience first and build the technical solution around that — not the other way around.",
    tags: ['Scripting', 'Game Design', 'DataStore'], meta: 'Available Now - Rate: USD',
    skills: [{ name: 'Scripting', description: DEV_SKILL_DESCS['Scripting'] }, { name: 'Game Design', description: DEV_SKILL_DESCS['Game Design'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/123247/profile' }, { name: 'GitHub', url: 'github.com/lualegend' }, { name: 'Portfolio Site', url: 'lualegend.dev' }] },
    bestWork: devWork(['Scripting', 'Game Design', 'DataStore'], 5),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev7', type: 'dev', robloxUserId: RBX[5], bg: BG[6], badge: 'Pro Developer',
    name: 'AnimatrixPro', role: 'Developer - 5yr experience',
    bio: "Five years of animation work on Roblox covering character rigs, cutscenes, NPC state machines, and procedural motion. I use Moon Animator for all my work and deliver R15-compatible outputs with clean blend trees. I have animated everything from idle loops to 90-second cinematic sequences with voice-acted characters.",
    tags: ['Animation', 'VFX', 'Building'], meta: 'Available Now - Rate: Fixed',
    skills: [{ name: 'Animation', description: DEV_SKILL_DESCS['Animation'] }, { name: 'VFX', description: DEV_SKILL_DESCS['VFX'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/2025110/profile' }, { name: 'GitHub', url: 'github.com/animatrixpro' }, { name: 'Portfolio Site', url: 'animatrixpro.dev' }] },
    bestWork: devWork(['Animation', 'VFX', 'Building'], 6),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev8', type: 'dev', robloxUserId: RBX[1], bg: BG[7], badge: 'Verified',
    name: 'TerrainTitan', role: 'Developer - 4yr experience',
    bio: "Four years sculpting Roblox terrain across a range of project types — tropical islands, mountain ranges, underground caves, and dense urban areas. I combine Roblox's terrain tools with Blender for detail work and always optimise for render performance from day one. Every environment I ship is built for the players who will explore it, not just for screenshots.",
    tags: ['Terrain', 'Building', 'Lighting'], meta: 'Available Now - Rate: USD',
    skills: [{ name: 'Terrain', description: DEV_SKILL_DESCS['Terrain'] }, { name: 'Building', description: DEV_SKILL_DESCS['Building'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/156/profile' }, { name: 'GitHub', url: 'github.com/terraintitan' }, { name: 'Portfolio Site', url: 'terraintitan.dev' }] },
    bestWork: devWork(['Terrain', 'Building', 'Lighting'], 7),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev9', type: 'dev', robloxUserId: RBX[2], bg: BG[0], badge: 'Verified',
    name: 'ScriptKiddie', role: 'Developer - 2yr experience',
    bio: "Two years in and already shipping production Roblox systems that would embarrass most five-year veterans. I started with tutorials, rewrote them from scratch six months later, and have been building reliable DataStore pipelines and combat frameworks ever since. The name is a joke. The code is not.",
    tags: ['Scripting', 'DataStore', 'Luau'], meta: 'Available Now - Rate: Robux',
    skills: [{ name: 'Scripting', description: DEV_SKILL_DESCS['Scripting'] }, { name: 'DataStore', description: DEV_SKILL_DESCS['DataStore'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/80254/profile' }, { name: 'GitHub', url: 'github.com/scriptkiddie' }, { name: 'Portfolio Site', url: 'scriptkiddie.dev' }] },
    bestWork: devWork(['Scripting', 'DataStore', 'Game Design'], 8),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev10', type: 'dev', robloxUserId: RBX[3], bg: BG[1], badge: 'Verified',
    name: 'GamerX', role: 'Developer - 3yr experience',
    bio: "Three years building games I actually want to play. I come from a player perspective first — I have hundreds of hours across the top Roblox titles and use that to pressure-test every design decision I make. My scripts follow the design, not the other way around.",
    tags: ['Game Design', 'Scripting', 'Luau'], meta: 'Available Now - Rate: USD',
    skills: [{ name: 'Game Design', description: DEV_SKILL_DESCS['Game Design'] }, { name: 'Scripting', description: DEV_SKILL_DESCS['Scripting'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/82471/profile' }, { name: 'GitHub', url: 'github.com/gamerx' }, { name: 'Portfolio Site', url: 'gamerx.dev' }] },
    bestWork: devWork(['Game Design', 'Scripting', 'DataStore'], 9),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev11', type: 'dev', robloxUserId: RBX[4], bg: BG[2], badge: 'Pro Developer',
    name: 'CodeMaster', role: 'Developer - 7yr experience',
    bio: "Seven years of Roblox scripting, from the pre-DataStore era to modern ProfileService pipelines. I have maintained live codebases with millions of daily players, led technical direction for studios with ten-plus engineers, and debugged production incidents at 3am. I write code that does not need fixing twice.",
    tags: ['Scripting', 'DataStore', 'Architecture'], meta: 'Available Now - Rate: USD',
    skills: [{ name: 'Scripting', description: DEV_SKILL_DESCS['Scripting'] }, { name: 'DataStore', description: DEV_SKILL_DESCS['DataStore'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/123247/profile' }, { name: 'GitHub', url: 'github.com/codemaster' }, { name: 'Portfolio Site', url: 'codemaster.dev' }] },
    bestWork: devWork(['Scripting', 'DataStore', 'Game Design'], 10),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev12', type: 'dev', robloxUserId: RBX[5], bg: BG[3], badge: 'Pro Developer',
    name: 'UI_God', role: 'Developer - 4yr experience',
    bio: "Four years turning Figma mockups into flawless Roblox UI. My process is tight — full component library in Figma before I open Studio, mobile constraints built from frame one, and TweenService animations that match spec exactly. I have built UI systems for games with over 30M plays.",
    tags: ['UI Design', 'Figma', 'Tweening'], meta: 'Available Now - Rate: Fixed',
    skills: [{ name: 'UI Design', description: DEV_SKILL_DESCS['UI Design'] }, { name: 'Figma', description: DEV_SKILL_DESCS['Figma'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/2025110/profile' }, { name: 'GitHub', url: 'github.com/uigod' }, { name: 'Portfolio Site', url: 'uigod.dev' }] },
    bestWork: devWork(['UI Design', 'Figma', 'Tweening'], 11),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev13', type: 'dev', robloxUserId: RBX[6], bg: BG[4], badge: 'Pro Developer',
    name: 'VisualVortex', role: 'Developer - 5yr experience',
    bio: "Five years of visual effects work, mainly for high-budget Roblox projects. I design particle systems from the physics up — custom textures, emission curves, and layered depth effects — and optimise them to hold 60fps with a full server. If it moves on screen and players notice it, that is my work.",
    tags: ['VFX', 'Particles', 'Lighting'], meta: 'Available Now - Rate: Hourly',
    skills: [{ name: 'VFX', description: DEV_SKILL_DESCS['VFX'] }, { name: 'Particles', description: DEV_SKILL_DESCS['Particles'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/2207291/profile' }, { name: 'GitHub', url: 'github.com/visualvortex' }, { name: 'Portfolio Site', url: 'visualvortex.dev' }] },
    bestWork: devWork(['VFX', 'Particles', 'Animation'], 12),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev14', type: 'dev', robloxUserId: RBX[7], bg: BG[5], badge: 'Verified',
    name: 'BuilderBob', role: 'Developer - 4yr experience',
    bio: "Four years building Roblox environments. I specialise in large-scale outdoor spaces — open worlds, terrain, exploration maps — but I can work interior or procedural. Every build I deliver is clean: sensible part counts, no floating parts, and optimised for the device tier the project targets.",
    tags: ['Building', 'Terrain', '3D Modeling'], meta: 'Available Now - Rate: USD',
    skills: [{ name: 'Building', description: DEV_SKILL_DESCS['Building'] }, { name: 'Terrain', description: DEV_SKILL_DESCS['Terrain'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/2312310/profile' }, { name: 'GitHub', url: 'github.com/builderbob' }, { name: 'Portfolio Site', url: 'builderbob.dev' }] },
    bestWork: devWork(['Building', 'Terrain', '3D Modeling'], 13),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev15', type: 'dev', robloxUserId: RBX[8], bg: BG[6], badge: 'Pro Developer',
    name: 'AnimatrixDev', role: 'Developer - 6yr experience',
    bio: "Six years of Roblox animation. I live in Moon Animator and have shipped everything from simple idle loops to full cinematic sequences with dozens of characters. My animations work on first handoff — clean R15 rigs, proper blend trees, and no jitter.",
    tags: ['Animation', 'VFX', 'Scripting'], meta: 'Available Now - Rate: Fixed',
    skills: [{ name: 'Animation', description: DEV_SKILL_DESCS['Animation'] }, { name: 'VFX', description: DEV_SKILL_DESCS['VFX'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/2837719/profile' }, { name: 'GitHub', url: 'github.com/animatrixdev' }, { name: 'Portfolio Site', url: 'animatrixdev.dev' }] },
    bestWork: devWork(['Animation', 'VFX', 'Building'], 14),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev16', type: 'dev', robloxUserId: RBX[9], bg: BG[7], badge: 'Verified',
    name: 'MusicMaestro', role: 'Developer - 3yr experience',
    bio: "Three years composing and designing audio specifically for Roblox. I understand the SoundService constraints, write seamless loop points, and compose adaptive scores that crossfade cleanly. My clients tell me the audio is the first thing players mention.",
    tags: ['Music', 'Sound Design', 'Scripting'], meta: 'Available Now - Rate: Robux',
    skills: [{ name: 'Music', description: DEV_SKILL_DESCS['Music'] }, { name: 'Sound Design', description: DEV_SKILL_DESCS['Sound Design'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/3965809/profile' }, { name: 'GitHub', url: 'github.com/musicmaestro' }, { name: 'Portfolio Site', url: 'musicmaestro.dev' }] },
    bestWork: devWork(['Music', 'Sound Design', 'Scripting'], 15),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev17', type: 'dev', robloxUserId: RBX[10], bg: BG[0], badge: 'Pro Developer',
    name: 'LevelDesignerLola', role: 'Developer - 5yr experience',
    bio: "Five years in level design and game design for Roblox. I bring structure — detailed GDDs, flow diagrams, and balance sheets — before a single part is placed. Then I build it myself. The result is levels that play as well as they look.",
    tags: ['Game Design', 'Building', 'Lighting'], meta: 'Available Now - Rate: USD',
    skills: [{ name: 'Game Design', description: DEV_SKILL_DESCS['Game Design'] }, { name: 'Building', description: DEV_SKILL_DESCS['Building'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/3991272/profile' }, { name: 'GitHub', url: 'github.com/leveldesignerlola' }, { name: 'Portfolio Site', url: 'leveldesignerlola.dev' }] },
    bestWork: devWork(['Game Design', 'Building', 'Lighting'], 16),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev18', type: 'dev', robloxUserId: RBX[11], bg: BG[1], badge: 'Verified',
    name: 'TechNinja', role: 'Developer - 4yr experience',
    bio: "Four years working across scripting and animation on Roblox. I build the technical side of character systems — state machines, animation controllers, and the DataStore pipelines that track what state each player is in. Clean integration between the two disciplines is what I do best.",
    tags: ['Scripting', 'Animation', 'DataStore'], meta: 'Available Now - Rate: Hourly',
    skills: [{ name: 'Scripting', description: DEV_SKILL_DESCS['Scripting'] }, { name: 'Animation', description: DEV_SKILL_DESCS['Animation'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/4397833/profile' }, { name: 'GitHub', url: 'github.com/techninja' }, { name: 'Portfolio Site', url: 'techninja.dev' }] },
    bestWork: devWork(['Scripting', 'Animation', 'DataStore'], 17),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev19', type: 'dev', robloxUserId: RBX[12], bg: BG[2], badge: 'Pro Developer',
    name: 'RobloxianPro', role: 'Developer - 8yr experience',
    bio: "Eight years on Roblox, the last five building professionally. I have worked on some of the platform's most recognisable maps and have a catalogue of 200-plus commissions. My speed is the differentiator — I deliver large builds on schedule without cutting corners on optimisation.",
    tags: ['Building', 'Terrain', 'Lighting'], meta: 'Available Now - Rate: USD',
    skills: [{ name: 'Building', description: DEV_SKILL_DESCS['Building'] }, { name: 'Terrain', description: DEV_SKILL_DESCS['Terrain'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/13953438/profile' }, { name: 'GitHub', url: 'github.com/robloxianpro' }, { name: 'Portfolio Site', url: 'robloxianpro.dev' }] },
    bestWork: devWork(['Building', 'Terrain', 'Lighting'], 18),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev20', type: 'dev', robloxUserId: RBX[13], bg: BG[3], badge: 'Verified',
    name: 'DesignDiva', role: 'Developer - 3yr experience',
    bio: "Three years of Roblox UI with a background in graphic design. I treat every screen as a product design problem — user flow, visual hierarchy, and feedback loops — then execute it in Studio with the same care I put into the prototype.",
    tags: ['UI Design', 'Figma', 'Tweening'], meta: 'Available Now - Rate: Fixed',
    skills: [{ name: 'UI Design', description: DEV_SKILL_DESCS['UI Design'] }, { name: 'Figma', description: DEV_SKILL_DESCS['Figma'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/63700903/profile' }, { name: 'GitHub', url: 'github.com/designdiva' }, { name: 'Portfolio Site', url: 'designdiva.dev' }] },
    bestWork: devWork(['UI Design', 'Figma', 'Tweening'], 19),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev21', type: 'dev', robloxUserId: RBX[14], bg: BG[4], badge: 'Verified',
    name: 'SoundSmith', role: 'Developer - 4yr experience',
    bio: "Four years creating original audio for Roblox. I design every sound from raw source material — I record, synthesise, and mix in Logic Pro. My deliverables are broadcast-ready: correct loudness, clean stereo image, and seamless loop points already trimmed for SoundService.",
    tags: ['Sound Design', 'Music', 'Scripting'], meta: 'Available Now - Rate: Hourly',
    skills: [{ name: 'Sound Design', description: DEV_SKILL_DESCS['Sound Design'] }, { name: 'Music', description: DEV_SKILL_DESCS['Music'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/89174331/profile' }, { name: 'GitHub', url: 'github.com/soundsmith' }, { name: 'Portfolio Site', url: 'soundsmith.dev' }] },
    bestWork: devWork(['Sound Design', 'Music', 'Scripting'], 20),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev22', type: 'dev', robloxUserId: RBX[15], bg: BG[5], badge: 'Pro Developer',
    name: 'VFXWizard', role: 'Developer - 6yr experience',
    bio: "Six years of visual effects with a focus on environmental and atmospheric FX. I work best on projects where the world needs to feel alive — weather systems, God rays, and dynamic ambient effects that make players pause to look around.",
    tags: ['VFX', 'Lighting', 'Particles'], meta: 'Available Now - Rate: USD',
    skills: [{ name: 'VFX', description: DEV_SKILL_DESCS['VFX'] }, { name: 'Lighting', description: DEV_SKILL_DESCS['Lighting'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/121823922/profile' }, { name: 'GitHub', url: 'github.com/vfxwizard' }, { name: 'Portfolio Site', url: 'vfxwizard.dev' }] },
    bestWork: devWork(['VFX', 'Lighting', 'Particles'], 21),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev23', type: 'dev', robloxUserId: RBX[16], bg: BG[6], badge: 'Verified',
    name: 'CraftyCreator', role: 'Developer - 3yr experience',
    bio: "Three years building detailed Roblox environments from Blender asset creation through to in-game placement. I produce custom prop kits, modular building sets, and full scene layouts, all managed to tight poly budgets.",
    tags: ['Building', '3D Modeling', 'VFX'], meta: 'Available Now - Rate: Robux',
    skills: [{ name: 'Building', description: DEV_SKILL_DESCS['Building'] }, { name: '3D Modeling', description: DEV_SKILL_DESCS['3D Modeling'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/140258990/profile' }, { name: 'GitHub', url: 'github.com/craftycreator' }, { name: 'Portfolio Site', url: 'craftycreator.dev' }] },
    bestWork: devWork(['Building', '3D Modeling', 'VFX'], 22),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev24', type: 'dev', robloxUserId: RBX[17], bg: BG[7], badge: 'Pro Developer',
    name: 'PolyArtist', role: 'Developer - 5yr experience',
    bio: "Five years of 3D art for Roblox, specialising in characters and hard-surface props. I model in Blender with PBR textures, rig for R15, and UV-unwrap to exactly the resolution the project needs. Zero texture stretching, guaranteed.",
    tags: ['3D Modeling', 'Building', 'VFX'], meta: 'Available Now - Rate: Fixed',
    skills: [{ name: '3D Modeling', description: DEV_SKILL_DESCS['3D Modeling'] }, { name: 'Building', description: DEV_SKILL_DESCS['Building'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/339310190/profile' }, { name: 'GitHub', url: 'github.com/polyartist' }, { name: 'Portfolio Site', url: 'polyartist.dev' }] },
    bestWork: devWork(['3D Modeling', 'Building', 'VFX'], 23),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev25', type: 'dev', robloxUserId: RBX[0], bg: BG[0], badge: 'Pro Developer',
    name: 'GameGuru', role: 'Developer - 7yr experience',
    bio: "Seven years of Roblox game design, from early hobby projects to published titles with 100M-plus combined plays. I write GDDs, balance economy sheets, design progression systems, and script enough of the implementation to know whether my designs are technically feasible.",
    tags: ['Game Design', 'Scripting', 'DataStore'], meta: 'Available Now - Rate: USD',
    skills: [{ name: 'Game Design', description: DEV_SKILL_DESCS['Game Design'] }, { name: 'Scripting', description: DEV_SKILL_DESCS['Scripting'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/1/profile' }, { name: 'GitHub', url: 'github.com/gameguru' }, { name: 'Portfolio Site', url: 'gameguru.dev' }] },
    bestWork: devWork(['Game Design', 'Scripting', 'DataStore'], 24),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev26', type: 'dev', robloxUserId: RBX[1], bg: BG[1], badge: 'Verified',
    name: 'SpeedScripter', role: 'Developer - 4yr experience',
    bio: "Four years scripting for speed — fast turnaround, clean code, minimal back-and-forth. I scope projects accurately upfront, build to spec, and deliver. My DataStore pipelines and combat systems are in a dozen currently live Roblox games.",
    tags: ['Scripting', 'DataStore', 'UI Design'], meta: 'Available Now - Rate: Hourly',
    skills: [{ name: 'Scripting', description: DEV_SKILL_DESCS['Scripting'] }, { name: 'DataStore', description: DEV_SKILL_DESCS['DataStore'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/156/profile' }, { name: 'GitHub', url: 'github.com/speedscripter' }, { name: 'Portfolio Site', url: 'speedscripter.dev' }] },
    bestWork: devWork(['Scripting', 'DataStore', 'UI Design'], 25),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev27', type: 'dev', robloxUserId: RBX[2], bg: BG[2], badge: 'Pro Developer',
    name: 'LightingLord', role: 'Developer - 5yr experience',
    bio: "Five years of Roblox lighting design. I work with every tool on the platform and write the companion scripts myself — dynamic day/night cycles, scripted events, and conditional atmosphere shifts that respond to game state. Lighting is not decoration. It is communication.",
    tags: ['Lighting', 'VFX', 'Terrain'], meta: 'Available Now - Rate: USD',
    skills: [{ name: 'Lighting', description: DEV_SKILL_DESCS['Lighting'] }, { name: 'VFX', description: DEV_SKILL_DESCS['VFX'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/80254/profile' }, { name: 'GitHub', url: 'github.com/lightinglord' }, { name: 'Portfolio Site', url: 'lightinglord.dev' }] },
    bestWork: devWork(['Lighting', 'VFX', 'Terrain'], 26),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev28', type: 'dev', robloxUserId: RBX[3], bg: BG[3], badge: 'Pro Developer',
    name: 'MeshMaster', role: 'Developer - 6yr experience',
    bio: "Six years of 3D modelling for Roblox — hard surface, organic, and modular sets. I build in Blender, bake my own normal maps, and export with LODs where the project needs them. I have shipped custom asset kits used by multiple studios.",
    tags: ['3D Modeling', 'Building', 'Lighting'], meta: 'Available Now - Rate: Fixed',
    skills: [{ name: '3D Modeling', description: DEV_SKILL_DESCS['3D Modeling'] }, { name: 'Lighting', description: DEV_SKILL_DESCS['Lighting'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/82471/profile' }, { name: 'GitHub', url: 'github.com/meshmaster' }, { name: 'Portfolio Site', url: 'meshmaster.dev' }] },
    bestWork: devWork(['3D Modeling', 'Building', 'Lighting'], 27),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev29', type: 'dev', robloxUserId: RBX[4], bg: BG[4], badge: 'Verified',
    name: 'TextureTitan', role: 'Developer - 4yr experience',
    bio: "Four years specialising in textures and material work for Roblox. SurfaceAppearance, PBR pipelines, and custom decals built to the platform's resolution limits. My textures make Blender assets look like they belong on Roblox natively.",
    tags: ['3D Modeling', 'Particles', 'VFX'], meta: 'Available Now - Rate: Robux',
    skills: [{ name: '3D Modeling', description: DEV_SKILL_DESCS['3D Modeling'] }, { name: 'Particles', description: DEV_SKILL_DESCS['Particles'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/123247/profile' }, { name: 'GitHub', url: 'github.com/texturetitan' }, { name: 'Portfolio Site', url: 'texturetitan.dev' }] },
    bestWork: devWork(['3D Modeling', 'Particles', 'VFX'], 28),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
  {
    id: 'dev30', type: 'dev', robloxUserId: RBX[5], bg: BG[5], badge: 'Pro Developer',
    name: 'CodeCrusher', role: 'Developer - 5yr experience',
    bio: "Five years writing the kind of Roblox code that does not come back to bite you. Combat systems, DataStore schemas, multiplayer event infrastructure — all documented, all tested, all maintainable. I also design the systems I build, which means fewer revisions.",
    tags: ['Scripting', 'Game Design', 'DataStore'], meta: 'Available Now - Rate: USD',
    skills: [{ name: 'Scripting', description: DEV_SKILL_DESCS['Scripting'] }, { name: 'Game Design', description: DEV_SKILL_DESCS['Game Design'] }],
    portfolio: { links: [{ name: 'Roblox Profile', url: 'roblox.com/users/2025110/profile' }, { name: 'GitHub', url: 'github.com/codecrusher' }, { name: 'Portfolio Site', url: 'codecrusher.dev' }] },
    bestWork: devWork(['Scripting', 'Game Design', 'DataStore'], 29),
    socials: [{ icon: 'RBX', label: 'Roblox', url: '#' }, { icon: 'DIS', label: 'Discord', url: '#' }, { icon: 'X', label: 'Twitter', url: '#' }],
  },
]

const TARGET_PROFILE_COUNT = 100

const TEAM_SIZES = [1, 2, 3, 4, 5, 7, 9, 10, 14, 19, 20, 24, 32]
const DEV_EXPERIENCE_YEARS = [0, 1, 2, 3, 4, 5, 6, 8]
const STUDIO_STATUSES = ['Hiring Now', 'Open to Offers']
const BUDGET_TYPES = ['USD', 'Robux', 'Mixed', 'Fixed']
const RATE_TYPES = ['USD', 'Robux', 'Fixed', 'Hourly']
const CREATOR_BADGES = ['Verified', 'Pro Developer']

const STUDIO_PLAY_BUCKETS = [
  [6, 8, 10],
  [12, 15, 20],
  [18, 23, 29],
]
const STUDIO_TOP_CCU_BUCKETS = [
  [9, 11, 14],
  [15, 19, 22],
  [21, 24, 28],
]
const STUDIO_CURRENT_CCU_BUCKETS = [
  [1.6, 2.7, 4.4],
  [4.2, 6.1, 7.5],
  [7.4, 8.6, 9.7],
]
const DEV_PLAY_BUCKETS = [
  [8, 12, 16],
  [18, 22, 28],
  [25, 30, 35],
  [42, 36, 30],
]
const DEV_VALUE_BUCKETS = [
  [900, 1200, 1500],
  [900, 2200, 1500],
  [1800, 1700, 1600],
  [2400, 2600, 2700],
  [5200, 1300, 1500],
  [3400, 3500, 3600],
  [5200, 6400, 7800],
]

function variantName(name: string, index: number, baseCount: number) {
  const round = Math.floor(index / baseCount)
  return round === 0 ? name : `${name} ${round + 1}`
}

function formatExperienceRole(years: number) {
  if (years === 0) return 'Developer - <1yr experience'
  if (years === 1) return 'Developer - 1yr experience'
  return `Developer - ${years}yr experience`
}

function createStudioVariant(seed: PreviewProfile, index: number): PreviewProfile {
  const plays = STUDIO_PLAY_BUCKETS[index % STUDIO_PLAY_BUCKETS.length]
  const topCcu = STUDIO_TOP_CCU_BUCKETS[Math.floor(index / STUDIO_PLAY_BUCKETS.length) % STUDIO_TOP_CCU_BUCKETS.length]
  const currentCcu = STUDIO_CURRENT_CCU_BUCKETS[Math.floor(index / (STUDIO_PLAY_BUCKETS.length * STUDIO_TOP_CCU_BUCKETS.length)) % STUDIO_CURRENT_CCU_BUCKETS.length]
  const games = studioGames(index + 40, index % GAMES.length).map((game, offset) => ({
    ...game,
    plays: `${plays[offset]}M`,
    topCcu: `${topCcu[offset]}K`,
    currentCcu: `${currentCcu[offset]}K`,
  }))
  const teamSize = TEAM_SIZES[index % TEAM_SIZES.length]
  const status = STUDIO_STATUSES[Math.floor(index / TEAM_SIZES.length) % STUDIO_STATUSES.length]
  const budget = BUDGET_TYPES[Math.floor(index / (TEAM_SIZES.length * STUDIO_STATUSES.length)) % BUDGET_TYPES.length]

  return {
    ...seed,
    id: index < BASE_PREVIEW_STUDIOS.length ? seed.id : `${seed.id}-mock-${index + 1}`,
    name: variantName(seed.name, index, BASE_PREVIEW_STUDIOS.length),
    role: `Roblox Game Studio - ${teamSize} members`,
    meta: `${status} - Budget: ${budget} - Remote`,
    robloxUserId: RBX[index % RBX.length],
    bg: BG[index % BG.length],
    topGames: games,
  }
}

function createDevVariant(seed: PreviewProfile, index: number): PreviewProfile {
  const sourceTags = seed.tags.length > 0 ? seed.tags : ['Scripting', 'Game Design', 'UI Design']
  const plays = DEV_PLAY_BUCKETS[Math.floor(index / DEV_VALUE_BUCKETS.length) % DEV_PLAY_BUCKETS.length]
  const values = DEV_VALUE_BUCKETS[index % DEV_VALUE_BUCKETS.length]
  const bestWork = devWork(sourceTags, index + 50).map((item, offset) => ({
    ...item,
    amount: `${values[offset]}`,
    plays: `${plays[offset]}M`,
  }))
  const years = DEV_EXPERIENCE_YEARS[index % DEV_EXPERIENCE_YEARS.length]
  const rate = RATE_TYPES[Math.floor(index / DEV_EXPERIENCE_YEARS.length) % RATE_TYPES.length]

  return {
    ...seed,
    id: index < BASE_PREVIEW_DEVS.length ? seed.id : `${seed.id}-mock-${index + 1}`,
    name: variantName(seed.name, index, BASE_PREVIEW_DEVS.length),
    role: formatExperienceRole(years),
    meta: `Available Now - Rate: ${rate}`,
    badge: CREATOR_BADGES[Math.floor(index / (DEV_EXPERIENCE_YEARS.length * RATE_TYPES.length)) % CREATOR_BADGES.length],
    robloxUserId: RBX[index % RBX.length],
    bg: BG[index % BG.length],
    bestWork,
  }
}

export const PREVIEW_STUDIOS: PreviewProfile[] = Array.from(
  { length: TARGET_PROFILE_COUNT },
  (_, index) => createStudioVariant(BASE_PREVIEW_STUDIOS[index % BASE_PREVIEW_STUDIOS.length], index)
)

export const PREVIEW_DEVS: PreviewProfile[] = Array.from(
  { length: TARGET_PROFILE_COUNT },
  (_, index) => createDevVariant(BASE_PREVIEW_DEVS[index % BASE_PREVIEW_DEVS.length], index)
)
