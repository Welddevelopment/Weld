"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  alpha: number; size: number; color: string;
  burst?: boolean; // burst particles decay faster
}

interface ParticleCanvasProps {
  mouseRepulsion?: boolean;
  burstTrigger?: number; // increment to fire a burst
  burstOrigin?: { x: number; y: number };
  burstColor?: string;
}

export function ParticleCanvas({
  mouseRepulsion = true,
  burstTrigger = 0,
  burstOrigin,
  burstColor
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  // Track mouse position via a stable ref
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Main particle render loop
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    if (isMobile) return;
    const MAX_PARTICLES = 60;

    const COLORS = [
      getComputedStyle(document.documentElement).getPropertyValue("--studio-blue").trim(),
      getComputedStyle(document.documentElement).getPropertyValue("--luau-keyword").trim(),
      getComputedStyle(document.documentElement).getPropertyValue("--luau-type").trim(),
    ].filter(Boolean);

    let particles: Particle[] = [];
    let rafId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const spawn = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.18 + 0.04,
      size: Math.random() * 1.5 + 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)] || "white",
    });

    const addBurst = (event: Event) => {
      const detail = (event as CustomEvent<Particle>).detail;
      particles.push({
        x: detail.x,
        y: detail.y,
        vx: detail.vx,
        vy: detail.vy,
        alpha: detail.alpha ?? 0.55,
        size: detail.size ?? 2,
        color: detail.color || COLORS[0] || "white",
        burst: true
      });

      if (particles.length > MAX_PARTICLES + 24) {
        particles = particles.slice(-MAX_PARTICLES);
      }
    };

    resize();
    particles = Array.from({ length: MAX_PARTICLES }, spawn);

    const REPULSION_RADIUS = 80;
    const REPULSION_FORCE = 0.28;
    const MAX_SPEED = 1.8;
    const DAMPING = 0.96;

    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const canvasRect = canvas.getBoundingClientRect();
      const mx = mouseRef.current.x - canvasRect.left;
      const my = mouseRef.current.y - canvasRect.top;

      for (const p of particles) {
        // Mouse repulsion
        if (mouseRepulsion && !isMobile) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPULSION_RADIUS && dist > 0) {
            const force = (REPULSION_RADIUS - dist) / REPULSION_RADIUS;
            p.vx += (dx / dist) * force * REPULSION_FORCE;
            p.vy += (dy / dist) * force * REPULSION_FORCE;
          }
        }

        // Speed cap + damping
        p.vx = clamp(p.vx * DAMPING, -MAX_SPEED, MAX_SPEED);
        p.vy = clamp(p.vy * DAMPING, -MAX_SPEED, MAX_SPEED);

        p.x += p.vx;
        p.y += p.vy;

        // Burst particles decay alpha
        if (p.burst) {
          p.alpha *= 0.97;
          if (p.alpha < 0.005) {
            Object.assign(p, spawn());
            p.burst = false;
          }
        }

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("resize", resize);
    canvas.addEventListener("weld:particle-burst", addBurst);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("weld:particle-burst", addBurst);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mouseRepulsion]);

  // Burst effect on burstTrigger change
  useEffect(() => {
    if (!burstTrigger || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasRect = canvas.getBoundingClientRect();
    const bx = burstOrigin ? burstOrigin.x - canvasRect.left : canvas.width / 2;
    const by = burstOrigin ? burstOrigin.y - canvasRect.top : canvas.height / 2;
    const color = burstColor || getComputedStyle(document.documentElement).getPropertyValue("--studio-blue").trim() || "white";

    // Emit 12 burst particles from origin
    const BURST_COUNT = 12;
    for (let i = 0; i < BURST_COUNT; i++) {
      const angle = (i / BURST_COUNT) * Math.PI * 2;
      const speed = Math.random() * 1.6 + 0.6;
      ctx.beginPath();
      ctx.arc(bx, by, Math.random() * 2 + 1, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.6;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Inject burst particles into the live particle array via a DOM event trick
      // (We can't access the particles array from this effect — emit a custom event instead)
      const burstEvent = new CustomEvent("weld:particle-burst", {
        detail: {
          x: bx, y: by,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          alpha: 0.45 + Math.random() * 0.2
        }
      });
      canvas.dispatchEvent(burstEvent);
    }
  }, [burstTrigger, burstOrigin, burstColor]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
