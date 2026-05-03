'use client'

import { useState } from 'react'
import type { PanelKind } from '@/components/SwipeCard'

function panelEquals(a: PanelKind, b: PanelKind): boolean {
  if (typeof a === 'string' && typeof b === 'string') return a === b
  if (typeof a === 'object' && typeof b === 'object' && 'skill' in a && 'skill' in b) return a.skill === b.skill
  if (typeof a === 'object' && typeof b === 'object' && 'role' in a && 'role' in b) return a.role === b.role
  return false
}

export function usePanelQueue() {
  const [panels, setPanels] = useState<PanelKind[]>([])

  const openPanel = (panel: PanelKind) => {
    setPanels(prev => {
      const idx = prev.findIndex(p => panelEquals(p, panel))
      if (idx !== -1) return prev.filter((_, i) => i !== idx) // toggle off
      if (prev.length < 2) return [...prev, panel]            // fill empty slot
      return [prev[1], panel]                                  // replace oldest
    })
  }

  const closePanel = (idx: number) => {
    setPanels(prev => prev.filter((_, i) => i !== idx))
  }

  const clearPanels = () => setPanels([])

  const slot0 = panels[0] ?? null
  const slot1 = panels[1] ?? null
  const panelOpen = panels.length > 0

  // For SwipeCard active-state highlighting: report whichever panel type is open
  const leftPanelActive: 'games' | null = panels.some(p => p === 'games') ? 'games' : null
  const rightPanelNonGames = panels.filter(p => p !== 'games')
  const rightPanelActive: 'work' | { skill: string } | null =
    (rightPanelNonGames[rightPanelNonGames.length - 1] as 'work' | { skill: string } | undefined) ?? null

  return { slot0, slot1, panelOpen, openPanel, closePanel, clearPanels, leftPanelActive, rightPanelActive }
}
