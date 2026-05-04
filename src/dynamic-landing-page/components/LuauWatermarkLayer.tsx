"use client";

import type { ScriptTab } from "@/dynamic-landing-page/lib/WeldPageState";

interface LuauWatermarkLayerProps {
  activeScriptTab: ScriptTab;
  reducedMotion: boolean;
  compactMode: boolean;
}

const WATERMARK_LINES = [
  "-- weld.roster.lua",
  'local developer = weld.find({ role = "scripter", rate = "<=30" })',
  "if developer.verified then spark(developer) end",
  'local studio = weld.match({ proof = "Roblox", live = true })',
  'print("READY_FOR_DISCOVERY")',
  "return weld.spark(developer, studio)",
] as const;

/**
 * Stage 5 — LuauWatermarkLayer
 *
 * Low-opacity LuaU code fragments behind hero content. Creates the
 * "someone who has opened Studio" texture. Not readable at normal opacity —
 * just enough to feel code-native without distracting.
 *
 * Line index 3 (WeldProfile require) brightens subtly when the profile
 * script tab is active, connecting the watermark to page state.
 *
 * aria-hidden + pointer-events none — purely decorative.
 * Returns null on compactMode to keep mobile uncluttered.
 */
export function LuauWatermarkLayer({
  activeScriptTab,
  reducedMotion: _reducedMotion,
  compactMode,
}: LuauWatermarkLayerProps) {
  if (compactMode) return null;

  return (
    <div
      aria-hidden="true"
      className="luau-watermark"
    >
      {WATERMARK_LINES.map((line, index) => (
        <span
          key={line}
          data-active={activeScriptTab === "profile" && index === 3 ? "true" : "false"}
        >
          {line}
        </span>
      ))}
    </div>
  );
}
