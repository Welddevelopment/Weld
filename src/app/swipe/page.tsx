'use client'

import { useState } from 'react'

const profiles = [
  {
    id: 1,
    name: "TechNinja",
    role: "UI Designer",
    experience: "7yr",
    bio: "I design high-converting Roblox UI systems.",
    skills: ["UI Design", "Figma", "UX"],
    rate: "$40/hr",
    availability: "Available now",
    visits: "4.8M"
  },
  {
    id: 2,
    name: "NovaBuild",
    role: "Builder",
    experience: "3yr",
    bio: "Immersive maps and environments.",
    skills: ["Building", "Lighting", "Terrain"],
    rate: "$30/hr",
    availability: "2 weeks",
    visits: "2.1M"
  }
]

export default function SwipePage() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)

  const profile = profiles[index]

  if (!profile) {
    return (
      <div className="h-screen flex items-center justify-center">
        No more profiles
      </div>
    )
  }

  const handleSwipe = (dir: 'left' | 'right') => {
    setDirection(dir)

    setTimeout(() => {
      setIndex(i => i + 1)
      setDirection(null)
    }, 200)
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-neutral-100">

      {/* Card */}
      <div
        className={`w-[350px] bg-white rounded-2xl shadow-xl p-6 transition-transform duration-200
          ${direction === 'left' ? '-translate-x-40 rotate-[-10deg] opacity-0' : ''}
          ${direction === 'right' ? 'translate-x-40 rotate-[10deg] opacity-0' : ''}
        `}
      >
        <h2 className="text-xl font-bold">{profile.name}</h2>
        <p className="text-sm text-gray-500">
          {profile.role} · {profile.experience}
        </p>

        <p className="mt-3 italic">"{profile.bio}"</p>

        <div className="flex gap-2 flex-wrap mt-3">
          {profile.skills.map(skill => (
            <span key={skill} className="bg-gray-200 px-2 py-1 rounded-full text-xs">
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-4 text-sm">
          {profile.availability} · {profile.rate}
        </div>

        <div className="text-xs text-gray-400">
          {profile.visits} visits
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-6 mt-6">
        <button
          onClick={() => handleSwipe('left')}
          className="w-14 h-14 rounded-full bg-red-500 text-white text-xl"
        >
          ✕
        </button>

        <button
          onClick={() => handleSwipe('right')}
          className="w-14 h-14 rounded-full bg-green-500 text-white text-xl"
        >
          ♥
        </button>
      </div>
    </div>
  )
}
