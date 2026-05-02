"use client";

import { useEffect, useState } from "react";

export type MotionTier = "full" | "reduced";

export function useMotionPolicy(): MotionTier {
  const [tier, setTier] = useState<MotionTier>("full");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      const next: MotionTier = mq.matches ? "reduced" : "full";
      setTier(next);
      document.documentElement.style.setProperty("--motion-tier", next);
    };

    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return tier;
}
