#!/usr/bin/env npx tsx
// Migrates old waitlist Google Sheets data into profile_drafts.
//
// Usage:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/migrate-waitlist.ts
//
// Find these values in your Supabase project settings → API.
// SUPABASE_URL is the "Project URL", SUPABASE_SERVICE_ROLE_KEY is the service_role key.

import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

const SUPABASE_URL = process.env.SUPABASE_URL ?? ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// ── Types ────────────────────────────────────────────────────────────────────

interface StudioRow {
  email: string
  studioName: string
  teamSize: string
  hiringRoles: string[]
  budget: string
  website: string
  projectDesc: string
}

interface DevRow {
  email: string
  displayName: string
  experience: string
  skills: string[]
  portfolio: string
}

// ── Studio data (from Google Sheets export) ──────────────────────────────────

const studioRows: StudioRow[] = [
  { email: 'rockjoonas@gmail.com', studioName: 'Ave&4xby', teamSize: '4-8', hiringRoles: ['Scripter','UI Designer','Builder','Animator','3D Modeler','Game Designer'], budget: 'Mixed', website: '', projectDesc: "Looking for developers. Payment for some, Robux/USD for most. Need builders, scripters, game designers." },
  { email: 'pejwdauda@gmail.com', studioName: 'hizic studio', teamSize: '1-3', hiringRoles: ['Scripter','Builder'], budget: 'Revenue Share', website: '', projectDesc: 'contact me on discord zippydevx' },
  { email: 'lucvrion@gmail.com', studioName: 'Vanyra', teamSize: '1-3', hiringRoles: ['Scripter','UI Designer','Builder','VFX Artist','Animator','3D Modeler','Game Designer','Sound Designer'], budget: 'Mixed', website: '', projectDesc: '' },
  { email: 'lonelydoesbusiness@gmail.com', studioName: 'HXL Studios', teamSize: '1-3', hiringRoles: ['Scripter','VFX Artist','Animator','3D Modeler','Sound Designer'], budget: 'Mixed', website: '', projectDesc: '' },
  { email: 'qejj13@gmail.com', studioName: 'cosmos studios', teamSize: '4-8', hiringRoles: ['Scripter'], budget: 'Robux', website: '', projectDesc: 'I need a strong scripter to develop a vehicle system for my game.' },
  { email: 'aryanarjunsir@gmail.com', studioName: 'Lunar Cat Studios', teamSize: '9-15', hiringRoles: ['Scripter','UI Designer','Builder','VFX Artist','Animator','3D Modeler','Game Designer','Sound Designer'], budget: 'Revenue Share', website: '', projectDesc: '' },
  { email: 'justadude6942@gmail.com', studioName: 'PHOENIX.', teamSize: '1-3', hiringRoles: ['Scripter','UI Designer','Builder','VFX Artist','Animator','3D Modeler','Game Designer'], budget: 'Mixed', website: '', projectDesc: '' },
  { email: 'metehandmr1907@icloud.com', studioName: 'The All Blue', teamSize: '4-8', hiringRoles: ['Scripter','UI Designer','Builder','Animator'], budget: 'Mixed', website: '', projectDesc: "Building a One Piece-inspired Roblox RPG focused on realistic progression, skill-based combat, and balanced gameplay. Looking for experienced developers who can work long-term." },
  { email: 'admin@walldigital.net', studioName: 'Wall Digital Entertainment', teamSize: '1-3', hiringRoles: ['UI Designer','Builder','VFX Artist','Animator','3D Modeler'], budget: 'USD', website: '', projectDesc: '' },
  { email: 'ramenonsaturdays@gmail.com', studioName: 'Naverath', teamSize: '4-8', hiringRoles: ['UI Designer','Builder','VFX Artist','Animator','3D Modeler','Game Designer'], budget: 'Revenue Share', website: '', projectDesc: 'Developing a multiplayer medieval fantasy RPG on Roblox focused on fluid combat, exploration, and immersive world design. Inspired by Deepwoken but with unique systems.' },
  { email: 'steveuni100@icloud.com', studioName: 'earbuds make games', teamSize: '1-3', hiringRoles: ['Scripter','UI Designer','Builder','VFX Artist','Animator','3D Modeler','Game Designer','Sound Designer'], budget: 'Mixed', website: '', projectDesc: 'A detailed storm chasing game that is extremely realistic.' },
  { email: 'kacenm1000@gmail.com', studioName: 'WCL Staff', teamSize: '9-15', hiringRoles: ['Scripter','UI Designer','Builder','VFX Artist','Animator','3D Modeler','Game Designer','Sound Designer'], budget: 'Mixed', website: '', projectDesc: 'WCL - World Club League. A competitive football experience where players build careers, join clubs, and compete in high-level matches to become the best in the league.' },
  { email: 'innovativeindustriesoficial@gmail.com', studioName: 'Innovate Industries', teamSize: '30+', hiringRoles: ['VFX Artist','Animator','Sound Designer'], budget: 'Robux', website: '', projectDesc: '' },
  { email: 'narratorproductions3@gmail.com', studioName: '', teamSize: '', hiringRoles: [], budget: '', website: '', projectDesc: '' },
  { email: 'fosterobject31@outlook.com', studioName: 'derp studios', teamSize: '4-8', hiringRoles: ['3D Modeler'], budget: 'USD', website: '', projectDesc: 'just looking around' },
  { email: 'aadevbusiness@gmail.com', studioName: 'The Asura Association', teamSize: '1-3', hiringRoles: ['Scripter','UI Designer','Builder','VFX Artist','Sound Designer'], budget: 'Mixed', website: '', projectDesc: "Martial-arts 1v1 fighter inspired by UBG and Kengan Ashura. Full 75-page Game Design Document available. Seeking developers capable of working with OOP, combat mechanics engines, and physics-based interactions." },
  { email: 'v4mp20g0@gmail.com', studioName: 'Night Time Studios', teamSize: '16-30', hiringRoles: ['Builder'], budget: 'Revenue Share', website: '', projectDesc: 'Oblivious: a roguelite game built around a 3-life system. Inspired by Deepwoken and Arcane Lineage. Mixes PvP and PvE with strong focus on exploration and progression.' },
  { email: 'candysourcrush8@gmail.com', studioName: '', teamSize: '', hiringRoles: [], budget: '', website: '', projectDesc: '' },
  { email: 'sleepytaunts@gmail.com', studioName: '', teamSize: '', hiringRoles: [], budget: '', website: '', projectDesc: '' },
  { email: 'xirrrclash@gmail.com', studioName: 'Kerzion Studios', teamSize: '4-8', hiringRoles: ['Scripter','UI Designer','Builder','VFX Artist','Animator','3D Modeler','Game Designer','Sound Designer'], budget: 'Mixed', website: '', projectDesc: '' },
  { email: 'avi.aggarwal2011@gmail.com', studioName: 'RGash', teamSize: '1-3', hiringRoles: ['3D Modeler'], budget: 'Revenue Share', website: '', projectDesc: '' },
  { email: 'custom.gamingyt1020@gmail.com', studioName: 'Random Word Studio', teamSize: '4-8', hiringRoles: ['Animator','3D Modeler'], budget: 'Robux', website: '', projectDesc: '' },
  { email: 'dielogo3@gmail.com', studioName: 'Rebounded', teamSize: '16-30', hiringRoles: ['Scripter','UI Designer','Builder','VFX Artist','3D Modeler','Game Designer'], budget: 'Mixed', website: '', projectDesc: 'An asymmetrical game based on original characters created by the community. Friendly team that listens to ideas.' },
  { email: 'cherryke07@gmail.com', studioName: 'Sabor', teamSize: '1-3', hiringRoles: ['Scripter','Builder'], budget: 'Robux', website: '', projectDesc: '' },
  { email: 'abdulrahman.alselti1@gmail.com', studioName: 'Vertex Studios', teamSize: '1-3', hiringRoles: ['Scripter','UI Designer','Builder','VFX Artist','Animator','3D Modeler','Game Designer','Sound Designer'], budget: 'Revenue Share', website: '', projectDesc: 'Revenue share for now. We make a lot of games, not just one.' },
  { email: 'arthurteamohp@gmail.com', studioName: 'HardZone Studios', teamSize: '4-8', hiringRoles: ['VFX Artist','Sound Designer'], budget: 'Revenue Share', website: '', projectDesc: 'Egoist Curiosity - a game in full rework. Undergoing complete rework with investment and new developers to create a better experience.' },
  { email: 'jaxsoncoats0@gmail.com', studioName: "Makze's Universe", teamSize: '1-3', hiringRoles: ['Scripter','UI Designer','Builder','VFX Artist','Animator','3D Modeler','Game Designer','Sound Designer'], budget: 'Revenue Share', website: '', projectDesc: "Multiple projects forming a canon universe. Main project: soab! - a train-based survival game. Other projects include an EToH fangame, tycoon, and tower defense game." },
  { email: 'akhlafasabri@gmail.com', studioName: 'sabri', teamSize: '1-3', hiringRoles: ['3D Modeler'], budget: 'Mixed', website: '', projectDesc: '' },
  { email: 'sabriakhlafa@gmail.com', studioName: 'marinamation', teamSize: '1-3', hiringRoles: ['Builder'], budget: 'Mixed', website: '', projectDesc: 'Just looking for modelers for UGCs.' },
  { email: 'warmcubed.bs@gmail.com', studioName: 'PurpleStar', teamSize: '1-3', hiringRoles: ['Scripter'], budget: 'Mixed', website: '', projectDesc: '' },
]

// ── Developer data (paste rows here when you have the dev CSV) ───────────────

const devRows: DevRow[] = [
  { email: 'mohammadarhan747@gmail.com', displayName: 'NerdyGeeks', experience: '3-4', skills: ['3D Modeling'], portfolio: '' },
  { email: 'zukzhukovskyy@gmail.com', displayName: 'Zuk', experience: '1-2', skills: ['Building','3D Modeling'], portfolio: 'https://discord.gg/gFys6DA7' },
  { email: '22UJalalJ@qerdp.co.uk', displayName: 'jawad', experience: '1-2', skills: ['3D Modeling'], portfolio: 'https://cosmosmodels.lovable.app' },
  { email: 'usef.randomz@gmail.com', displayName: 'usef', experience: '3-4', skills: ['3D Modeling'], portfolio: '' },
  { email: 'devpxola@gmail.com', displayName: 'Pxola', experience: '3-4', skills: ['Building','3D Modeling','Game Design'], portfolio: 'https://pxola.carrd.co/' },
  { email: 'rockouibusiness@gmail.com', displayName: 'Rocko', experience: '<1', skills: ['UI Design'], portfolio: '' },
  { email: 'upsibey@upsilands.org', displayName: 'upsiLands', experience: '3-4', skills: ['Scripting'], portfolio: 'https://www.upsilands.org/' },
  { email: 'guillermicbrieuc@gmail.com', displayName: 'wharkk', experience: '5+', skills: ['Scripting','UI Design','Game Design'], portfolio: 'https://wharkk-developer.framer.website/' },
  { email: 'Ashrav04@hotmail.com', displayName: 'RGASH', experience: '1-2', skills: ['Scripting','Graphics','Building'], portfolio: '' },
  { email: 'SpoonfulStudio@outlook.com', displayName: '', experience: '', skills: [], portfolio: '' },
  { email: 'SkadoinkNoodle@gmail.com', displayName: 'SkadoinkNoodle', experience: '5+', skills: ['3D Modeling'], portfolio: 'https://www.artstation.com/skadoinknoodle5' },
  { email: 'georgewashingberg@gmail.com', displayName: 'gwinan', experience: '1-2', skills: ['Scripting'], portfolio: '' },
  { email: 'drwish.yo@gmail.com', displayName: 'Jo', experience: '3-4', skills: ['Scripting'], portfolio: '' },
  { email: 'monstwe_1@outlook.com', displayName: 'MONSTWE1', experience: '3-4', skills: ['Scripting'], portfolio: '' },
  { email: 'realencryptal@gmail.com', displayName: 'Encryptal', experience: '5+', skills: ['Scripting','UI Design','Game Design'], portfolio: 'https://encryptal.dev/' },
  { email: 'torchidev@gmail.com', displayName: 'TorchiDev', experience: '<1', skills: ['Scripting','UI Design'], portfolio: 'https://torchidev.carrd.co/' },
  { email: 'imhiatus.dev@gmail.com', displayName: 'Hiatus', experience: '5+', skills: ['Scripting','Game Design'], portfolio: 'https://hiatuscode.co.uk/' },
  { email: 'takuuyt.pro@gmail.com', displayName: 'Naoxiz', experience: '1-2', skills: ['Scripting','UI Design'], portfolio: '' },
  { email: 'yammmydd@gmail.com', displayName: 'Asher', experience: '3-4', skills: ['Building'], portfolio: '' },
  { email: 'knoloogz@gmail.com', displayName: 'knoloo', experience: '3-4', skills: ['Building'], portfolio: 'https://knobuilder.carrd.co' },
  { email: 'dynamexed@gmail.com', displayName: 'Dynamexed', experience: '1-2', skills: ['Animation','3D Modeling'], portfolio: 'https://blgzm18-collab.github.io/Dyna-Portfolio/' },
  { email: 'tuo28real@gmail.com', displayName: 'Tuo', experience: '3-4', skills: ['Building','Animation','3D Modeling','Game Design'], portfolio: 'https://x.com/Tuo28Real' },
  { email: 'vancehenrymar15@gmail.com', displayName: 'UnorganizedUVs', experience: '1-2', skills: ['Animation'], portfolio: '' },
  { email: 'phxntombusinessmail@gmail.com', displayName: 'phantom', experience: '1-2', skills: ['Building','3D Modeling'], portfolio: 'https://discord.gg/sajBSAZVWQ' },
  { email: 'steveuni100@icloud.com', displayName: 'ben', experience: '1-2', skills: ['VFX'], portfolio: '' },
  { email: 'cedralian@outlook.com', displayName: 'C3DS', experience: '1-2', skills: ['UI Design','Building','Game Design'], portfolio: 'https://www.roport.lol/CED7264i' },
  { email: 'perigrade1@gmail.com', displayName: 'Perigrade', experience: '<1', skills: ['Scripting','3D Modeling'], portfolio: '' },
  { email: 'vouxdev@gmail.com', displayName: 'Voux', experience: '5+', skills: ['UI Design','Graphics','2D Art'], portfolio: 'https://x.com/vouxcell?s=21' },
  { email: 'shahmeerjav@gmail.com', displayName: 'Kodex', experience: '5+', skills: ['Scripting','Game Design'], portfolio: '' },
  { email: 'harshaharshith31@gmail.com', displayName: 'Harshith Padakanti', experience: '<1', skills: ['Building'], portfolio: 'https://harshith-padakanti.vercel.app/' },
  { email: 'kovola8163@gixpos.com', displayName: 's', experience: '5+', skills: ['Animation'], portfolio: '' },
  { email: 'az09.serdten@gmail.com', displayName: 'twixi', experience: '3-4', skills: ['3D Modeling'], portfolio: 'https://www.artstation.com/nomki6' },
  { email: 'brobsthetuff@gmail.com', displayName: '', experience: '', skills: [], portfolio: '' },
  { email: 'mahmoudabudiak2@gmail.com', displayName: 'Ma_Ab', experience: '1-2', skills: ['3D Modeling'], portfolio: 'https://blulum0.my.canva.site/3dmodeler' },
  { email: 'yashp121yash@gmail.com', displayName: 'Raze', experience: '5+', skills: ['UI Design'], portfolio: 'https://razedzn.carrd.co/' },
  { email: 'nelifier143@gmail.com', displayName: 'neli', experience: '1-2', skills: ['Building','Animation'], portfolio: 'https://drive.google.com/drive/folders/1eSD3r_xStpIOa-vLes-VvEVgYWOWeiww' },
  { email: 'Metadraught@gmail.com', displayName: 'Meta', experience: '3-4', skills: ['3D Modeling'], portfolio: 'https://x.com/MetacarpetD' },
  { email: 'obsidianfx.25@gmail.com', displayName: 'Obsidianfbx', experience: '3-4', skills: ['Building','3D Modeling'], portfolio: 'https://obsidianfbx.carrd.co/' },
  { email: 'freelancervirtualrez@gmail.com', displayName: 'VirtualRez', experience: '5+', skills: ['UI Design'], portfolio: 'https://virtualrez.com' },
  { email: 'cgblends@gmail.com', displayName: 'CG Animates', experience: '1-2', skills: ['Animation'], portfolio: 'https://www.youtube.com/playlist?list=PLUOSpR_usWJIpVVexnVxS26sEnPggT_ro' },
  { email: 'notsnvzlolsnvz@gmail.com', displayName: 'softaimed', experience: '3-4', skills: ['Building'], portfolio: '' },
  { email: 'ersinxkurt@gmail.com', displayName: '3D Modeler', experience: '<1', skills: ['3D Modeling'], portfolio: '' },
  { email: 'utre3backup@gmail.com', displayName: 'utre3', experience: '3-4', skills: ['Scripting','UI Design','Building','3D Modeling'], portfolio: '' },
  { email: 'generalboom4@gmail.com', displayName: 'Catdabin', experience: '<1', skills: ['3D Modeling'], portfolio: '' },
  { email: 'qmonkbusiness@gmail.com', displayName: 'Qmonk', experience: '<1', skills: ['UI Design'], portfolio: 'https://x.com/Qmonk_dev' },
  { email: 'xkyarabusiness@gmail.com', displayName: 'Delta', experience: '5+', skills: ['VFX'], portfolio: 'https://sites.google.com/view/deltasans102vfx/home' },
  { email: 'invis0078@gmail.com', displayName: 'Invis', experience: '1-2', skills: ['Building','3D Modeling'], portfolio: '' },
  { email: 'zenixwrk@gmail.com', displayName: 'ZenixWRK', experience: '3-4', skills: ['Scripting','Animation'], portfolio: 'https://discord.gg/WCCAHdXVsw' },
  { email: 'orioxs78@gmail.com', displayName: '', experience: '', skills: [], portfolio: '' },
  { email: 'Elginloyd1012@gmail.com', displayName: 'Slowb', experience: '3-4', skills: ['2D Art','Building','Animation','3D Modeling','Sound Design'], portfolio: '' },
  { email: 'pinv@pinv.dev', displayName: 'pinv', experience: '5+', skills: ['Scripting'], portfolio: '' },
  { email: 'szymonnkolodziejczyk@gmail.com', displayName: 'MaxBurnHeart3', experience: '5+', skills: ['Scripting','UI Design','VFX','Game Design'], portfolio: '' },
  { email: 'xray050312@gmail.com', displayName: 'H', experience: '', skills: [], portfolio: '' },
  { email: 'godspowerorinya@gmail.com', displayName: 'Godspower108', experience: '3-4', skills: ['3D Modeling'], portfolio: 'https://www.artstation.com/godspower109' },
  { email: 'rakak66391@getasail.com', displayName: 'hello', experience: '5+', skills: ['Sound Design'], portfolio: '' },
  { email: 'mahnushplayzgames@gmail.com', displayName: '', experience: '', skills: [], portfolio: '' },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function isFilledValue(v: unknown): boolean {
  if (Array.isArray(v)) return v.length > 0
  return String(v ?? '').trim().length > 0
}

function computeCompletion(draft: Record<string, Record<string, unknown>>, audience: 'studio' | 'developer') {
  const required = audience === 'studio'
    ? { identity: ['studioName'], proof: ['rolesHiring', 'teamSize'], fit: ['budgetStyle', 'shippingNote'] }
    : { identity: ['displayName', 'primaryRole'], proof: ['proofLink'], fit: ['availability', 'rateStyle'] }

  let total = 0, filled = 0
  for (const [step, fields] of Object.entries(required)) {
    for (const f of fields) {
      total++
      if (isFilledValue(draft[step]?.[f])) filled++
    }
  }
  return Math.round((filled / total) * 100)
}

// ── Migration ────────────────────────────────────────────────────────────────

async function migrateStudio(row: StudioRow, seen: Set<string>) {
  const email = row.email.trim().toLowerCase()
  if (!email) return
  if (seen.has(email)) { console.log(`  dup:  ${email}`); return }
  seen.add(email)

  const { data: lead } = await supabase
    .from('waitlist_leads').select('id, invite_code').eq('email', email).maybeSingle()

  if (!lead) { console.log(`  miss: ${email} (no waitlist_leads row)`); return }

  const { data: existing } = await supabase
    .from('profile_drafts').select('id, draft, created_at').eq('lead_id', lead.id).maybeSingle()

  type DraftShape = Record<string, Record<string, unknown>>
  const prev = (existing?.draft ?? { identity: {}, proof: {}, fit: {} }) as DraftShape

  const draft: DraftShape = {
    identity: { ...prev.identity, studioName: row.studioName || prev.identity?.studioName || '' },
    proof: {
      ...prev.proof,
      rolesHiring: row.hiringRoles.length ? row.hiringRoles : (prev.proof?.rolesHiring ?? []),
      teamSize: row.teamSize || prev.proof?.teamSize || '',
      proofLink: row.website || prev.proof?.proofLink || '',
    },
    fit: {
      ...prev.fit,
      budgetStyle: row.budget || prev.fit?.budgetStyle || '',
      shippingNote: row.projectDesc || prev.fit?.shippingNote || '',
    },
  }

  const completion = computeCompletion(draft, 'studio')
  const now = new Date().toISOString()

  const { error } = await supabase.from('profile_drafts').upsert({
    id: existing?.id ?? randomUUID(),
    lead_id: lead.id,
    invite_code: lead.invite_code,
    audience: 'studio',
    current_step: 'identity',
    completion_percent: completion,
    skipped: false,
    draft,
    created_at: existing?.created_at ?? now,
    updated_at: now,
  }, { onConflict: 'lead_id' })

  if (error) console.error(`  err:  ${email} —`, error.message)
  else console.log(`  ok:   ${email} (${row.studioName || 'no name'}, ${completion}%)`)
}

async function migrateDev(row: DevRow, seen: Set<string>) {
  const email = row.email.trim().toLowerCase()
  if (!email) return
  if (seen.has(email)) { console.log(`  dup:  ${email}`); return }
  seen.add(email)

  const { data: lead } = await supabase
    .from('waitlist_leads').select('id, invite_code').eq('email', email).maybeSingle()

  if (!lead) { console.log(`  miss: ${email} (no waitlist_leads row)`); return }

  const { data: existing } = await supabase
    .from('profile_drafts').select('id, draft, created_at').eq('lead_id', lead.id).maybeSingle()

  type DraftShape = Record<string, Record<string, unknown>>
  const prev = (existing?.draft ?? { identity: {}, proof: {}, fit: {} }) as DraftShape

  const draft: DraftShape = {
    identity: {
      ...prev.identity,
      displayName: row.displayName || prev.identity?.displayName || '',
      primaryRole: row.skills[0] || prev.identity?.primaryRole || '',
    },
    proof: {
      ...prev.proof,
      proofLink: row.portfolio || prev.proof?.proofLink || '',
      skills: row.skills.length ? row.skills : (prev.proof?.skills ?? []),
      experience: row.experience || prev.proof?.experience || '',
    },
    fit: { ...prev.fit },
  }

  const completion = computeCompletion(draft, 'developer')
  const now = new Date().toISOString()

  const { error } = await supabase.from('profile_drafts').upsert({
    id: existing?.id ?? randomUUID(),
    lead_id: lead.id,
    invite_code: lead.invite_code,
    audience: 'developer',
    current_step: 'identity',
    completion_percent: completion,
    skipped: false,
    draft,
    created_at: existing?.created_at ?? now,
    updated_at: now,
  }, { onConflict: 'lead_id' })

  if (error) console.error(`  err:  ${email} —`, error.message)
  else console.log(`  ok:   ${email} (${row.displayName || 'no name'}, ${completion}%)`)
}

// ── Run ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log('Migrating waitlist profile data into profile_drafts...\n')
  const seen = new Set<string>()

  console.log(`Studios (${studioRows.length} rows):`)
  for (const row of studioRows) await migrateStudio(row, seen)

  console.log(`\nDevelopers (${devRows.length} rows):`)
  for (const row of devRows) await migrateDev(row, seen)

  console.log('\nDone.')
}

run().catch(err => { console.error(err); process.exit(1) })
