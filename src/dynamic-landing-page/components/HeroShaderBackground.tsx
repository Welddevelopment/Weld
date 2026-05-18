"use client";

import { MeshGradient, PaperTexture } from "@paper-design/shaders-react";
import { useEffect, useState } from "react";

type HeroShaderBackgroundProps = {
  /** Profile accent hex — drives gradient stops */
  accentHex: string;
  /** When false, show static SVG / CSS fallback (no WebGL). */
  allowWebGl: boolean;
};

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function buildColors(accent: string): string[] {
  const { r, g, b } = hexToRgb(accent);
  const soft = `rgb(${Math.min(255, r + 120)}, ${Math.min(255, g + 110)}, ${Math.min(255, b + 140)})`;
  const deep = `rgb(${Math.max(0, r - 40)}, ${Math.max(0, g - 50)}, ${Math.max(0, b - 30)})`;
  return ["#f4f0ff", soft, accent, deep];
}

export default function HeroShaderBackground({ accentHex, allowWebGl }: HeroShaderBackgroundProps) {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const showShader = allowWebGl && !narrow;

  if (!showShader) {
    return (
      <div className="hero-shader-root" aria-hidden>
        <div className="hero-shader-fallback" />
      </div>
    );
  }

  const colors = buildColors(accentHex);

  return (
    <div className="hero-shader-root" aria-hidden>
      <MeshGradient
        className="hero-shader-canvas"
        colors={colors}
        speed={allowWebGl ? 0.45 : 0}
        distortion={0.42}
        swirl={0.18}
        grainMixer={0.08}
        grainOverlay={0.06}
      />
      <PaperTexture
        className="hero-shader-canvas"
        style={{ mixBlendMode: "soft-light", opacity: 0.55 }}
        colorFront="rgba(255,255,255,0.12)"
        colorBack="rgba(120,100,200,0.08)"
        contrast={0.25}
        scale={2.2}
        speed={0}
      />
    </div>
  );
}
