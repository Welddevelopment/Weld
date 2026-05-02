"use client";

import { useEffect, useRef, useState } from "react";
import { weldRoles, makeLogId, useWeldDispatch } from "@/dynamic landing page/lib/WeldPageState";
import type { WeldRole } from "@/dynamic landing page/lib/WeldPageState";

interface ProofVisitCounterProps {
  selectedRole: WeldRole;
  reducedMotion: boolean;
}

function parseVisits(visits: string): { value: number; suffix: string } {
  const m = visits.match(/^([\d.]+)([MK]?)$/);
  if (!m) return { value: 0, suffix: "" };
  const num = parseFloat(m[1]);
  return { value: num, suffix: m[2] };
}

function formatCount(current: number, suffix: string): string {
  if (suffix === "M") {
    return current.toFixed(current < 10 ? 1 : 0) + "M";
  }
  if (suffix === "K") {
    return current.toFixed(0) + "K";
  }
  return current.toFixed(0);
}

interface CounterProps {
  target: number;
  suffix: string;
  label: string;
  icon: string;
  reducedMotion: boolean;
  onComplete?: () => void;
}

function AnimatedCounter({ target, suffix, label, icon, reducedMotion, onComplete }: CounterProps) {
  const [current, setCurrent] = useState(reducedMotion ? target : 0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const doneRef = useRef(false);
  const DURATION = 1200;

  useEffect(() => {
    if (reducedMotion) {
      setCurrent(target);
      if (!doneRef.current) {
        doneRef.current = true;
        onComplete?.();
      }
      return;
    }

    doneRef.current = false;
    setCurrent(0);
    startRef.current = null;

    function tick(ts: number) {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / DURATION, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(eased * target);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCurrent(target);
        if (!doneRef.current) {
          doneRef.current = true;
          onComplete?.();
        }
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, reducedMotion, onComplete]);

  return (
    <div className="proof-counter">
      <span className="proof-counter__icon" aria-hidden="true">{icon}</span>
      <span className="proof-counter__value">{formatCount(current, suffix)}</span>
      <span className="proof-counter__label">{label}</span>
    </div>
  );
}

// Simple sparkline SVG
function Sparkline() {
  return (
    <svg
      className="proof-counter-sparkline"
      width="60"
      height="20"
      viewBox="0 0 60 20"
      fill="none"
      aria-hidden="true"
    >
      <polyline
        points="0,18 10,14 20,15 30,8 40,10 50,4 60,2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function ProofVisitCounter({ selectedRole, reducedMotion }: ProofVisitCounterProps) {
  const dispatch = useWeldDispatch();
  const role = weldRoles[selectedRole];
  const { value: visitValue, suffix: visitSuffix } = parseVisits(role.visits);
  const gamesValue = role.games;
  const completedRef = useRef(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function handleComplete() {
    completedRef.current += 1;
    if (completedRef.current >= 2) {
      dispatch({
        type: "LOG_APPENDED",
        log: {
          id: makeLogId(),
          text: `${role.shortLabel}_VISITS_COUNTED`,
          tone: "success",
        },
      });
    }
  }

  const ariaLabel = `${role.visits} visits across ${gamesValue} shipped ${gamesValue === 1 ? "game" : "games"} for ${role.label} developers`;

  // key on inView + selectedRole so counters remount and re-animate on role change or scroll into view
  const animKey = `${selectedRole}-${inView}`;

  return (
    <div
      ref={containerRef}
      className="proof-visit-counter"
      aria-label={ariaLabel}
      data-section="hero-stats"
    >
      {inView && (
        <>
          <AnimatedCounter
            key={`visits-${animKey}`}
            target={visitValue}
            suffix={visitSuffix}
            label="visits"
            icon="◈"
            reducedMotion={reducedMotion}
            onComplete={handleComplete}
          />
          <div className="proof-counter-divider" aria-hidden="true">
            <Sparkline />
          </div>
          <AnimatedCounter
            key={`games-${animKey}`}
            target={gamesValue}
            suffix=""
            label="games shipped"
            icon="◉"
            reducedMotion={reducedMotion}
            onComplete={handleComplete}
          />
        </>
      )}
    </div>
  );
}
