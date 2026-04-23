import { PreviewProfile } from './preview-types'

export const PREVIEW_DEVS: PreviewProfile[] = [
  {
    id: 'dev1',
    type: 'dev',
    name: 'MattVFX',
    badge: 'Pro Developer',
    tagline: 'Visual effects that make players stop and stare',
    bio: 'I specialize in VFX and particle systems that push Roblox to its limits. 5 years turning bland scenes into unforgettable moments.',
    tags: ['VFX', 'Particles', 'Luau', 'Lighting'],
    status: 'Available now',
    roleLine: 'VFX Developer · 5 years experience',
    headerGradient: 'linear-gradient(135deg, #E84624 0%, #FF8A5C 100%)',
    stats: [
      { label: 'Rate', value: '$65/hr' },
      { label: 'Projects', value: '38' },
      { label: 'Rating', value: '★ 4.9' },
    ],
    socials: [
      { label: 'Roblox', url: '#' },
      { label: 'Discord', url: '#' },
      { label: 'Twitter', url: '#' },
    ],
    portfolioLinks: [
      { label: 'Roblox Profile', url: 'roblox.com/users/mattvfx' },
      { label: 'Portfolio Site', url: 'mattvfx.dev' },
    ],
    bestWork: [
      {
        emoji: '✨',
        title: 'VFX commission — Combat System',
        description: 'Full VFX overhaul for a top-50 combat game. Sword trails, hit impacts, death effects.',
        meta: [
          { label: 'Tools', value: 'VFX, Luau, Roblox Studio' },
          { label: 'Time', value: '3 weeks' },
          { label: 'Paid', value: '$1,200' },
        ],
      },
      {
        emoji: '🔥',
        title: 'Environment VFX — Fantasy World',
        description: 'Ambient particles, weather system, and dynamic lighting for an open-world RPG.',
        meta: [
          { label: 'Tools', value: 'Particles, Beam, Lighting' },
          { label: 'Time', value: '2 weeks' },
          { label: 'Paid', value: '$950' },
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
    bio: 'Frontend-focused dev obsessed with clean, intuitive interfaces. From inventory systems to full HUDs — I make it feel native.',
    tags: ['UI/UX', 'GUI', 'Luau', 'Animation'],
    status: 'Available in 2 weeks',
    roleLine: 'UI Developer · 4 years experience',
    headerGradient: 'linear-gradient(135deg, #7C3AED 0%, #C084FC 100%)',
    stats: [
      { label: 'Rate', value: '$55/hr' },
      { label: 'Projects', value: '52' },
      { label: 'Rating', value: '★ 4.8' },
    ],
    socials: [
      { label: 'Roblox', url: '#' },
      { label: 'Discord', url: '#' },
    ],
    portfolioLinks: [
      { label: 'Roblox Profile', url: 'roblox.com/users/kayla_ui' },
      { label: 'GitHub', url: 'github.com/kaylaui' },
    ],
    bestWork: [
      {
        emoji: '🎯',
        title: 'Inventory system — RPG Game',
        description: 'Drag-and-drop inventory with equipment preview, sorting, and tooltips. 2M+ plays on launch.',
        meta: [
          { label: 'Tools', value: 'GUI, Luau, Tweening' },
          { label: 'Time', value: '4 weeks' },
          { label: 'Paid', value: '$1,800' },
        ],
      },
    ],
  },
  {
    id: 'dev3',
    type: 'dev',
    name: 'Ry_Scripts',
    badge: 'Verified',
    tagline: 'Backend systems that scale to millions',
    bio: 'DataStore expert with deep experience in anti-cheat, server-side validation, and high-concurrency systems. Clean code, documented output.',
    tags: ['Scripting', 'DataStore', 'Anti-cheat', 'Performance'],
    status: 'Available now',
    roleLine: 'Backend Developer · 6 years experience',
    headerGradient: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
    stats: [
      { label: 'Rate', value: '$80/hr' },
      { label: 'Projects', value: '71' },
      { label: 'Rating', value: '★ 5.0' },
    ],
    socials: [
      { label: 'Roblox', url: '#' },
      { label: 'GitHub', url: '#' },
    ],
    portfolioLinks: [
      { label: 'GitHub', url: 'github.com/ryscripts' },
      { label: 'Portfolio', url: 'ryscripts.com' },
    ],
    bestWork: [
      {
        emoji: '🛡️',
        title: 'Anti-cheat system — FPS Game',
        description: 'Full server-side validation framework catching speed hacks, aim bots, and exploit injection.',
        meta: [
          { label: 'Tools', value: 'Luau, RemoteEvents, DataStore' },
          { label: 'Time', value: '5 weeks' },
          { label: 'Paid', value: '$3,500' },
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
    bio: 'Terrain and 3D environment specialist. I build immersive worlds with attention to scale, atmosphere, and performance.',
    tags: ['Building', 'Terrain', '3D Design', 'Optimization'],
    status: 'Available now',
    roleLine: 'Environment Builder · 7 years experience',
    headerGradient: 'linear-gradient(135deg, #16A34A 0%, #4ADE80 100%)',
    stats: [
      { label: 'Rate', value: '$50/hr' },
      { label: 'Projects', value: '89' },
      { label: 'Rating', value: '★ 4.7' },
    ],
    bestWork: [
      {
        emoji: '🌍',
        title: 'Open world — Fantasy RPG',
        description: 'Full 4km² fantasy world with villages, dungeons, forests, and dynamic weather. 15M plays.',
        meta: [
          { label: 'Tools', value: 'Terrain, Studio, Plugins' },
          { label: 'Time', value: '8 weeks' },
          { label: 'Paid', value: '$4,200' },
        ],
      },
    ],
  },
  {
    id: 'dev5',
    type: 'dev',
    name: 'SoundScape',
    badge: 'Pro Developer',
    tagline: 'Audio that immerses, not just fills silence',
    bio: 'Sound designer specializing in spatial audio, dynamic music systems, and SFX layering. Published 200+ tracks.',
    tags: ['Audio', 'SFX', 'Music', 'Spatial Sound'],
    status: 'Available in 1 week',
    roleLine: 'Audio Designer · 3 years experience',
    headerGradient: 'linear-gradient(135deg, #D97706 0%, #FBBF24 100%)',
    stats: [
      { label: 'Rate', value: '$45/hr' },
      { label: 'Projects', value: '44' },
      { label: 'Rating', value: '★ 4.8' },
    ],
    bestWork: [],
  },
]

export const PREVIEW_STUDIOS: PreviewProfile[] = [
  {
    id: 'studio1',
    type: 'studio',
    name: 'Apex Games Studio',
    badge: 'Verified Studio',
    tagline: 'We ship games that top the charts',
    bio: '12-person studio behind 3 front-page games. We hire the best talent and build fast. High standards, fair pay.',
    tags: ['Action', 'FPS', 'RPG', 'Competitive'],
    status: 'Actively hiring',
    roleLine: 'Roblox Game Studio · 12 members',
    headerGradient: 'linear-gradient(135deg, #E84624 0%, #FFBE74 100%)',
    stats: [
      { label: 'Total plays', value: '180M' },
      { label: 'Budget', value: '$5k–15k' },
      { label: 'CCU', value: '28K' },
    ],
    hiringNeeds: [
      { role: 'VFX Developer', description: 'Combat-focused VFX for our new action game. 6-week contract.' },
      { role: 'UI Designer', description: 'Full HUD and menu system for an FPS. Experience with mobile preferred.' },
    ],
    bestWork: [
      {
        emoji: '🎮',
        title: 'Warfront Legends',
        description: 'Our flagship FPS with 100M+ plays. Active 12K CCU daily.',
        meta: [
          { label: 'Plays', value: '100M' },
          { label: 'Top CCU', value: '42K' },
          { label: 'Current CCU', value: '12K' },
        ],
      },
      {
        emoji: '⚔️',
        title: 'Dungeon Siege Online',
        description: 'Co-op RPG dungeon crawler. Released 2023, still growing.',
        meta: [
          { label: 'Plays', value: '55M' },
          { label: 'Top CCU', value: '18K' },
          { label: 'Current CCU', value: '6K' },
        ],
      },
    ],
  },
  {
    id: 'studio2',
    type: 'studio',
    name: 'PixelForge',
    badge: 'Studio',
    tagline: 'Indie studio, AAA polish',
    bio: '5-person team building tight, high-quality experiences. We move fast and iterate hard. Remote-friendly, async-first.',
    tags: ['Indie', 'Puzzle', 'Adventure', 'Narrative'],
    status: 'Hiring for contract',
    roleLine: 'Roblox Game Studio · 5 members',
    headerGradient: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
    stats: [
      { label: 'Total plays', value: '22M' },
      { label: 'Budget', value: '$1k–4k' },
      { label: 'CCU', value: '3.2K' },
    ],
    hiringNeeds: [
      { role: 'Scripter', description: 'Puzzle mechanics and system scripting. Luau required.' },
    ],
    bestWork: [
      {
        emoji: '🧩',
        title: 'Mindlock',
        description: 'Puzzle platformer with 20M plays. Winner of Roblox Game Fund 2023.',
        meta: [
          { label: 'Plays', value: '20M' },
          { label: 'Top CCU', value: '8K' },
          { label: 'Current CCU', value: '2K' },
        ],
      },
    ],
  },
  {
    id: 'studio3',
    type: 'studio',
    name: 'NovaStar Studios',
    badge: 'Verified Studio',
    tagline: 'Home of Roblox roleplay',
    bio: 'The team behind 3 front-page RP games. We value long-term contractors who take pride in their work.',
    tags: ['Roleplay', 'Social', 'City Life', 'RP'],
    status: 'Actively hiring',
    roleLine: 'Roblox Game Studio · 20 members',
    headerGradient: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
    stats: [
      { label: 'Total plays', value: '340M' },
      { label: 'Budget', value: '$8k–25k' },
      { label: 'CCU', value: '65K' },
    ],
    hiringNeeds: [
      { role: 'UI/UX Developer', description: 'Mobile-first UI for our city RP game. High-traffic, high polish.' },
      { role: 'Backend Dev', description: 'DataStore and economy systems for our social sim.' },
      { role: 'Builder', description: 'Interior environments, city blocks, and prop design.' },
    ],
    bestWork: [
      {
        emoji: '🏙️',
        title: 'City Life Remastered',
        description: 'The biggest RP game on Roblox by active players. 200M plays.',
        meta: [
          { label: 'Plays', value: '200M' },
          { label: 'Top CCU', value: '90K' },
          { label: 'Current CCU', value: '52K' },
        ],
      },
    ],
  },
  {
    id: 'studio4',
    type: 'studio',
    name: 'IronClad Games',
    badge: 'Studio',
    tagline: 'Grinding the simulator genre since 2019',
    bio: 'Simulator studio with proven track record. We scale fast and reward great work with rev-share options.',
    tags: ['Simulator', 'Idle', 'Tycoon', 'Casual'],
    status: 'Hiring for contract',
    roleLine: 'Roblox Game Studio · 8 members',
    headerGradient: 'linear-gradient(135deg, #16A34A 0%, #22C55E 100%)',
    stats: [
      { label: 'Total plays', value: '95M' },
      { label: 'Budget', value: '$2k–6k' },
      { label: 'CCU', value: '9K' },
    ],
    hiringNeeds: [
      { role: 'VFX Developer', description: 'Simulator-style VFX and upgrade effects.' },
    ],
    bestWork: [
      {
        emoji: '⛏️',
        title: 'Mining Empire Tycoon',
        description: 'Top-20 simulator with 80M plays. Active 7K CCU.',
        meta: [
          { label: 'Plays', value: '80M' },
          { label: 'Top CCU', value: '22K' },
          { label: 'Current CCU', value: '7K' },
        ],
      },
    ],
  },
]

export const ALL_PREVIEW_PROFILES: PreviewProfile[] = [
  ...PREVIEW_DEVS,
  ...PREVIEW_STUDIOS,
]
