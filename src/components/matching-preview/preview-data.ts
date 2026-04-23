import { PreviewProfile } from './preview-types'

export const PREVIEW_DEVS: PreviewProfile[] = [
  {
    id: 'dev1',
    type: 'dev',
    name: 'GamerX',
    badge: 'Pro Developer',
    tagline: 'Building immersive worlds and VFX that players remember',
    bio: '3 years of Roblox development focused primarily on building and vfx. I have shipped multiple complete projects and work well within larger teams or solo on well-scoped commissions. My approach is to understand the player experience first and build the technical solution around that — not the other way around. Available for new projects; rates on request.',
    tags: ['Building', 'VFX', 'Scripting'],
    status: 'Available Now - Rate: Robux',
    roleLine: 'Developer - 3yr experience',
    headerGradient: 'linear-gradient(135deg, #6B52C8 0%, #9B7FE8 100%)',
    robloxUrl: 'roblox.com/users/156/profile',
    stats: [
      { label: 'Rate', value: 'Robux' },
      { label: 'Projects', value: '24' },
      { label: 'Rating', value: '★ 4.8' },
    ],
    skillExpertise: [
      {
        name: 'Building',
        description: 'Builds large-scale Roblox environments for immersion and performance. Dense city maps, sprawling open worlds, and detailed interiors using CSG, modular sets, and solid LOD structure.',
      },
      {
        name: 'VFX',
        description: 'Creates visual effects that make players stop and stare — explosions, elemental spells, portal warps, and environmental ambiance. Every effect is optimised for performance at scale.',
      },
      {
        name: 'Scripting',
        description: 'Solid Luau fundamentals for gameplay systems, tool logic, and UI interactions. Comfortable working with existing codebases and collaborating with dedicated backend devs.',
      },
    ],
    portfolioLinks: [
      { label: 'Roblox Profile', url: 'roblox.com/users/156/profile' },
      { label: 'GitHub', url: 'github.com/gamerx' },
      { label: 'Portfolio Site', url: 'gamerx.dev' },
    ],
    bestWork: [
      {
        emoji: '🏰',
        badge: 'SC',
        title: 'Fantasy fortress environment',
        description: 'Modular stone castle on elevated terrain with CSG detailing and custom Blender props. 3-week build to exact spec.',
        meta: [
          { label: 'Tools', value: 'Roblox Studio, Blender, Terrain' },
          { label: 'Time', value: '3 weeks' },
          { label: 'Paid', value: '$2200' },
        ],
      },
      {
        emoji: '🌦️',
        badge: 'BLD',
        title: 'Environmental ambiance pack',
        description: 'Dynamic weather, ambient particles, and atmospheric volumetric fog for open-world immersion.',
        meta: [
          { label: 'Tools', value: 'ParticleEmitter, Beam, Roblox Studio' },
          { label: 'Time', value: '4 weeks' },
          { label: 'Paid', value: '$2450' },
        ],
      },
      {
        emoji: '💰',
        badge: 'FX',
        title: 'Economy & leaderboard backend',
        description: 'In-game currency, shop backend, and real-time leaderboard with safe concurrent-write retry logic.',
        meta: [
          { label: 'Tools', value: 'Luau, DataStore2, Roblox Studio' },
          { label: 'Time', value: '5 weeks' },
          { label: 'Paid', value: '$2700' },
        ],
      },
    ],
  },
  {
    id: 'dev2',
    type: 'dev',
    name: 'Kayla_UI',
    badge: 'Pro Developer',
    tagline: 'UI/UX that players actually enjoy using',
    bio: 'Frontend-focused developer obsessed with clean, intuitive interfaces. From inventory systems to full HUDs, I make it feel native to Roblox while pushing what the engine can do. 4 years shipping polished UI for studios of all sizes.',
    tags: ['UI/UX', 'GUI', 'Luau'],
    status: 'Available in 2 weeks',
    roleLine: 'Developer - 4yr experience',
    headerGradient: 'linear-gradient(135deg, #7C3AED 0%, #C084FC 100%)',
    robloxUrl: 'roblox.com/users/kayla_ui',
    stats: [
      { label: 'Rate', value: '$55/hr' },
      { label: 'Projects', value: '52' },
      { label: 'Rating', value: '★ 4.9' },
    ],
    skillExpertise: [
      {
        name: 'UI/UX',
        description: 'Designs and builds complete interface systems — inventory screens, HUDs, shops, and menus. Prioritises clarity, responsiveness across devices, and smooth animation.',
      },
      {
        name: 'GUI',
        description: 'Deep knowledge of Roblox GUI constraints, ScreenGui layering, and UIAspectRatioConstraint. Builds interfaces that work cleanly across all screen sizes.',
      },
      {
        name: 'Luau',
        description: 'Handles all client-side scripting for UI — tweening, state management, remote event wiring, and modular component patterns.',
      },
    ],
    portfolioLinks: [
      { label: 'Roblox Profile', url: 'roblox.com/users/kayla_ui' },
      { label: 'GitHub', url: 'github.com/kaylaui' },
    ],
    bestWork: [
      {
        emoji: '🎒',
        badge: 'UI',
        title: 'Drag-and-drop inventory system',
        description: 'Full inventory with equipment preview, sorting, item tooltips, and smooth drag interactions. 2M+ plays on launch week.',
        meta: [
          { label: 'Tools', value: 'GUI, Luau, Tweening' },
          { label: 'Time', value: '4 weeks' },
          { label: 'Paid', value: '$1800' },
        ],
      },
      {
        emoji: '🎯',
        badge: 'HUD',
        title: 'FPS HUD system',
        description: 'Full heads-up display for a competitive FPS — ammo, health, minimap, kill feed, and round timer. Mobile-optimised.',
        meta: [
          { label: 'Tools', value: 'ScreenGui, Luau, UIConstraint' },
          { label: 'Time', value: '3 weeks' },
          { label: 'Paid', value: '$1400' },
        ],
      },
      {
        emoji: '🏪',
        badge: 'SHP',
        title: 'In-game shop with IAP',
        description: 'Animated shop UI wired to MarketplaceService. Category filtering, item preview, and purchase confirmation flow.',
        meta: [
          { label: 'Tools', value: 'GUI, MarketplaceService, Luau' },
          { label: 'Time', value: '2 weeks' },
          { label: 'Paid', value: '$950' },
        ],
      },
    ],
  },
  {
    id: 'dev3',
    type: 'dev',
    name: 'Ry_Scripts',
    badge: 'Verified',
    tagline: 'Backend systems that scale to millions of players',
    bio: 'DataStore expert with deep experience in anti-cheat, server-side validation, and high-concurrency systems. I write clean, well-documented Luau that teams can actually maintain. 6 years, 70+ shipped projects.',
    tags: ['Scripting', 'DataStore', 'Anti-cheat'],
    status: 'Available Now',
    roleLine: 'Developer - 6yr experience',
    headerGradient: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
    robloxUrl: 'roblox.com/users/ryscripts',
    stats: [
      { label: 'Rate', value: '$80/hr' },
      { label: 'Projects', value: '71' },
      { label: 'Rating', value: '★ 5.0' },
    ],
    skillExpertise: [
      {
        name: 'Scripting',
        description: 'Writes production-grade Luau — modular, typed, and documented. Comfortable with complex state machines, event-driven systems, and reusable framework design.',
      },
      {
        name: 'DataStore',
        description: 'Deep expertise in DataStore2, ProfileService, and raw DataStore with retry logic. Handles edge cases like data loss, session locking, and cross-server state.',
      },
      {
        name: 'Anti-cheat',
        description: 'Builds server-side validation layers that catch speed exploits, remote abuse, and injection attacks without impacting legitimate player experience.',
      },
    ],
    portfolioLinks: [
      { label: 'Roblox Profile', url: 'roblox.com/users/ryscripts' },
      { label: 'GitHub', url: 'github.com/ryscripts' },
      { label: 'Portfolio Site', url: 'ryscripts.com' },
    ],
    bestWork: [
      {
        emoji: '🛡️',
        badge: 'AC',
        title: 'Anti-cheat framework — FPS game',
        description: 'Full server-side validation catching speed hacks, aim bots, and exploit injection. Zero false positives over 3 months live.',
        meta: [
          { label: 'Tools', value: 'Luau, RemoteEvents, DataStore' },
          { label: 'Time', value: '5 weeks' },
          { label: 'Paid', value: '$3500' },
        ],
      },
      {
        emoji: '💾',
        badge: 'DS',
        title: 'Player data system with session locking',
        description: 'ProfileService-based data layer with migration support, schema versioning, and graceful shutdown handling.',
        meta: [
          { label: 'Tools', value: 'ProfileService, Luau' },
          { label: 'Time', value: '3 weeks' },
          { label: 'Paid', value: '$2100' },
        ],
      },
      {
        emoji: '⚙️',
        badge: 'SYS',
        title: 'Modular game framework',
        description: 'Extensible game loop framework with client/server module loading, signal bus, and hot-reload support for faster iteration.',
        meta: [
          { label: 'Tools', value: 'Luau, Module system' },
          { label: 'Time', value: '6 weeks' },
          { label: 'Paid', value: '$4200' },
        ],
      },
    ],
  },
  {
    id: 'dev4',
    type: 'dev',
    name: 'BuilderPro',
    badge: 'Pro Developer',
    tagline: 'Environments that players never want to leave',
    bio: 'Terrain and 3D environment specialist. I build immersive worlds with attention to scale, atmosphere, and performance. 7 years, 89 projects shipped across every genre.',
    tags: ['Building', 'Terrain', 'Optimization'],
    status: 'Available Now',
    roleLine: 'Developer - 7yr experience',
    headerGradient: 'linear-gradient(135deg, #16A34A 0%, #4ADE80 100%)',
    robloxUrl: 'roblox.com/users/builderpro',
    stats: [
      { label: 'Rate', value: '$50/hr' },
      { label: 'Projects', value: '89' },
      { label: 'Rating', value: '★ 4.7' },
    ],
    skillExpertise: [
      {
        name: 'Building',
        description: 'Specialises in large-scale open worlds. Efficient part usage, well-structured model hierarchies, and modular kits designed for easy handoff to other team members.',
      },
      {
        name: 'Terrain',
        description: 'Expert in Roblox terrain sculpting, painting, and waterway design. Creates believable landscapes that feel hand-crafted rather than procedurally generated.',
      },
      {
        name: 'Optimization',
        description: 'Aggressive about LOD, union count, and draw call management. Consistently hits 60 FPS targets even on large maps without sacrificing visual quality.',
      },
    ],
    portfolioLinks: [
      { label: 'Roblox Profile', url: 'roblox.com/users/builderpro' },
      { label: 'Portfolio Site', url: 'builderpro.studio' },
    ],
    bestWork: [
      {
        emoji: '🌍',
        badge: 'WLD',
        title: 'Open world — Fantasy RPG',
        description: 'Full 4km² fantasy world with villages, dungeons, forests, and dynamic weather. 15M plays within first month.',
        meta: [
          { label: 'Tools', value: 'Terrain, Studio, Plugins' },
          { label: 'Time', value: '8 weeks' },
          { label: 'Paid', value: '$4200' },
        ],
      },
      {
        emoji: '🏙️',
        badge: 'CTY',
        title: 'City map — roleplay game',
        description: 'Dense urban environment with interiors, street-level detail, and performance budget under 2000 draw calls.',
        meta: [
          { label: 'Tools', value: 'CSG, Modular kit, Studio' },
          { label: 'Time', value: '5 weeks' },
          { label: 'Paid', value: '$2800' },
        ],
      },
      {
        emoji: '⛏️',
        badge: 'DNG',
        title: 'Dungeon interior pack',
        description: 'Reusable modular dungeon kit — stone corridors, trap rooms, boss chambers. Designed for procedural assembly.',
        meta: [
          { label: 'Tools', value: 'Modular, Blender, Studio' },
          { label: 'Time', value: '3 weeks' },
          { label: 'Paid', value: '$1600' },
        ],
      },
    ],
  },
]

export const PREVIEW_STUDIOS: PreviewProfile[] = [
  {
    id: 'studio1',
    type: 'studio',
    name: 'Apex Games',
    badge: 'Verified Studio',
    tagline: 'We ship games that top the charts',
    bio: '12-person studio behind 3 front-page games. We hire the best talent and build fast. High standards, fair pay, and rev-share options for long-term contractors. Looking for developers who take craft seriously.',
    tags: ['Action', 'FPS', 'RPG'],
    status: 'Actively hiring',
    roleLine: 'Roblox Studio · 12 members',
    headerGradient: 'linear-gradient(135deg, #E84624 0%, #FFBE74 100%)',
    robloxUrl: 'roblox.com/groups/apexgames',
    stats: [
      { label: 'Total plays', value: '180M' },
      { label: 'Budget', value: '$5k–15k' },
      { label: 'Live CCU', value: '28K' },
    ],
    skillExpertise: [
      {
        name: 'VFX Developer',
        description: 'Combat-focused VFX for our new action title. Sword trails, impact effects, ability animations. 6-week contract, renewable.',
      },
      {
        name: 'UI Designer',
        description: 'Full HUD and menu system for an FPS. Mobile-first. Must have shipped at least one live game interface.',
      },
      {
        name: 'Backend Dev',
        description: 'DataStore and matchmaking systems for competitive mode. ProfileService experience required.',
      },
    ],
    hiringNeeds: [
      { role: 'VFX Developer', description: 'Combat-focused VFX. 6-week contract.' },
      { role: 'UI Designer', description: 'Full HUD and menu system for FPS.' },
    ],
    bestWork: [
      {
        emoji: '🎮',
        badge: 'FPS',
        title: 'Warfront Legends',
        description: 'Our flagship FPS with 100M+ plays. Competitive ranking, 10v10 modes, seasonal events.',
        meta: [
          { label: 'Plays', value: '100M' },
          { label: 'Top CCU', value: '42K' },
          { label: 'Now', value: '12K CCU' },
        ],
      },
      {
        emoji: '⚔️',
        badge: 'RPG',
        title: 'Dungeon Siege Online',
        description: 'Co-op RPG dungeon crawler. Released 2023, still growing with monthly content drops.',
        meta: [
          { label: 'Plays', value: '55M' },
          { label: 'Top CCU', value: '18K' },
          { label: 'Now', value: '6K CCU' },
        ],
      },
      {
        emoji: '🏆',
        badge: 'ACT',
        title: 'Combat Arena X',
        description: 'Fast-paced 1v1 and 2v2 arena game. Top 20 on release, sustained 8K daily active players.',
        meta: [
          { label: 'Plays', value: '25M' },
          { label: 'Top CCU', value: '12K' },
          { label: 'Now', value: '4K CCU' },
        ],
      },
    ],
  },
  {
    id: 'studio2',
    type: 'studio',
    name: 'PixelForge',
    badge: 'Studio',
    tagline: 'Indie studio. AAA polish.',
    bio: '5-person team building tight, high-quality experiences. We move fast and iterate hard. Remote-friendly, async-first. We pay on time and scope clearly — no vague briefs, no scope creep.',
    tags: ['Indie', 'Puzzle', 'Adventure'],
    status: 'Hiring for contract',
    roleLine: 'Roblox Studio · 5 members',
    headerGradient: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
    robloxUrl: 'roblox.com/groups/pixelforge',
    stats: [
      { label: 'Total plays', value: '22M' },
      { label: 'Budget', value: '$1k–4k' },
      { label: 'Live CCU', value: '3.2K' },
    ],
    skillExpertise: [
      {
        name: 'Scripter',
        description: 'Puzzle mechanics and system scripting. Luau required. Must be comfortable reading existing codebases and writing self-documenting code.',
      },
      {
        name: 'Builder',
        description: 'Low-poly stylised environments. Clean part counts. We favour artistic direction over photorealism.',
      },
    ],
    hiringNeeds: [
      { role: 'Scripter', description: 'Puzzle mechanics and system scripting.' },
      { role: 'Builder', description: 'Low-poly stylised environments.' },
    ],
    bestWork: [
      {
        emoji: '🧩',
        badge: 'PZL',
        title: 'Mindlock',
        description: 'Puzzle platformer with 20M plays. Winner of Roblox Game Fund 2023. Featured on front page for 6 weeks.',
        meta: [
          { label: 'Plays', value: '20M' },
          { label: 'Top CCU', value: '8K' },
          { label: 'Now', value: '2K CCU' },
        ],
      },
      {
        emoji: '🗺️',
        badge: 'ADV',
        title: 'The Lost Archipelago',
        description: 'Exploration adventure with narrative elements and hand-crafted islands. 2M plays.',
        meta: [
          { label: 'Plays', value: '2M' },
          { label: 'Top CCU', value: '1.2K' },
          { label: 'Now', value: '400 CCU' },
        ],
      },
    ],
  },
  {
    id: 'studio3',
    type: 'studio',
    name: 'NovaStar Studios',
    badge: 'Verified Studio',
    tagline: 'The home of Roblox roleplay',
    bio: 'The team behind 3 front-page RP games with a combined 340M plays. We value long-term contractors who take pride in their work and want to grow with a stable, professional studio.',
    tags: ['Roleplay', 'Social', 'City Life'],
    status: 'Actively hiring',
    roleLine: 'Roblox Studio · 20 members',
    headerGradient: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
    robloxUrl: 'roblox.com/groups/novastar',
    stats: [
      { label: 'Total plays', value: '340M' },
      { label: 'Budget', value: '$8k–25k' },
      { label: 'Live CCU', value: '65K' },
    ],
    skillExpertise: [
      {
        name: 'UI/UX Developer',
        description: 'Mobile-first UI for our city RP game. High-traffic, high polish. Must have experience with complex layered GUIs.',
      },
      {
        name: 'Backend Dev',
        description: 'DataStore and economy systems for our social sim. Experience with money systems and trading required.',
      },
      {
        name: 'Builder',
        description: 'Interior environments, city blocks, and prop design. Matching our established art direction is critical.',
      },
    ],
    hiringNeeds: [
      { role: 'UI/UX Developer', description: 'Mobile-first UI, high-traffic.' },
      { role: 'Backend Dev', description: 'Economy and trading systems.' },
      { role: 'Builder', description: 'City interiors and props.' },
    ],
    bestWork: [
      {
        emoji: '🏙️',
        badge: 'RP',
        title: 'City Life Remastered',
        description: 'The biggest RP game on Roblox by active players. 200M plays. Consistent front page placement since 2021.',
        meta: [
          { label: 'Plays', value: '200M' },
          { label: 'Top CCU', value: '90K' },
          { label: 'Now', value: '52K CCU' },
        ],
      },
      {
        emoji: '🏫',
        badge: 'SCH',
        title: 'School RP Universe',
        description: 'School roleplay with 100M plays. 40K daily active players, seasonal events, and a dedicated moderation team.',
        meta: [
          { label: 'Plays', value: '100M' },
          { label: 'Top CCU', value: '35K' },
          { label: 'Now', value: '18K CCU' },
        ],
      },
      {
        emoji: '🌆',
        badge: 'SIM',
        title: 'Urban Life Simulator',
        description: 'Open city social game with jobs, housing, and economy. 40M plays.',
        meta: [
          { label: 'Plays', value: '40M' },
          { label: 'Top CCU', value: '20K' },
          { label: 'Now', value: '8K CCU' },
        ],
      },
    ],
  },
]

export const ALL_PREVIEW_PROFILES: PreviewProfile[] = [
  ...PREVIEW_DEVS,
  ...PREVIEW_STUDIOS,
]
