"use client";

import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { BootStatus, WeldRole } from "@/dynamic-landing-page/lib/WeldPageState";
import { weldRoles } from "@/dynamic-landing-page/lib/WeldPageState";

interface FloatingStudioWindowProps {
  bootStatus: BootStatus;
  reducedMotion: boolean;
  compactMode: boolean;
  selectedRole: WeldRole;
}

/**
 * Stage 5 — FloatingStudioWindow
 *
 * CSS 3D mock of Roblox Studio with titlebar, toolbar strip, viewport grid,
 * and a mini-properties panel showing the current role.
 *
 * Purely decorative: aria-hidden, no information depends on this component.
 * Breathing animation only fires after boot completes and only when
 * reducedMotion is false. Hidden entirely on mobile (compactMode).
 */
export function FloatingStudioWindow({
  bootStatus,
  reducedMotion,
  compactMode,
  selectedRole,
}: FloatingStudioWindowProps) {
  if (compactMode) return null;

  const role = weldRoles[selectedRole];
  const dragRef = useRef({ x: 0, y: 0, startX: 0, startY: 0, dragging: false });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  function beginDrag(event: PointerEvent<HTMLDivElement>) {
    dragRef.current = {
      x: offset.x,
      y: offset.y,
      startX: event.clientX,
      startY: event.clientY,
      dragging: true
    };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function updateDrag(event: PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.dragging) return;
    setOffset({
      x: dragRef.current.x + event.clientX - dragRef.current.startX,
      y: dragRef.current.y + event.clientY - dragRef.current.startY
    });
  }

  function endDrag() {
    dragRef.current.dragging = false;
    setDragging(false);
  }

  return (
    <div
      aria-hidden="true"
      className="floating-studio-window"
      data-ready={bootStatus === "ready" ? "true" : "false"}
      data-motion={reducedMotion ? "reduced" : "full"}
      data-dragging={dragging ? "true" : "false"}
      style={
        {
          "--drag-x": `${offset.x}px`,
          "--drag-y": `${offset.y}px`
        } as CSSProperties
      }
    >
      {/* Titlebar */}
      <div
        className="studio-titlebar"
        onPointerDown={beginDrag}
        onPointerMove={updateDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <span className="studio-dots">
          <span className="studio-dot studio-dot--red" />
          <span className="studio-dot studio-dot--yellow" />
          <span className="studio-dot studio-dot--green" />
        </span>
        <span className="studio-titlebar__title">
          weld. Studio — Developer.rbxl
        </span>
      </div>

      {/* Toolbar strip */}
      <div className="studio-toolbar-strip">
        {["Home", "Model", "Test", "View"].map((tab) => (
          <span key={tab} className="studio-toolbar-tab">{tab}</span>
        ))}
      </div>

      {/* Viewport + properties */}
      <div className="studio-body">
        <div className="studio-viewport-grid">
          {/* Blocky silhouette suggests a 3D scene */}
          <div className="studio-blocky-scene">
            <div className="studio-block studio-block--a" />
            <div className="studio-block studio-block--b" />
            <div className="studio-block studio-block--c" />
          </div>
        </div>

        {/* key={selectedRole} remounts the panel on role change so the CSS
            recompile-flash animation fires — visual proof that the floating
            window is reading shared page state. */}
        <aside key={selectedRole} className="studio-mini-properties studio-mini-properties--recompile">
          <div className="studio-mini-prop-header">Properties</div>
          <div className="studio-mini-prop-row">
            <span className="studio-mini-prop-label">Role</span>
            <span className="studio-mini-prop-value studio-mini-prop-value--accent">
              {role.label}
            </span>
          </div>
          <div className="studio-mini-prop-row">
            <span className="studio-mini-prop-label">Rate</span>
            <span className="studio-mini-prop-value studio-mini-prop-value--active">
              {role.rateMin}
            </span>
          </div>
          <div className="studio-mini-prop-row">
            <span className="studio-mini-prop-label">Status</span>
            <span className="studio-mini-prop-value studio-mini-prop-value--success">
              {role.availability}
            </span>
          </div>
          <div className="studio-mini-prop-row">
            <span className="studio-mini-prop-label">Verified</span>
            <span className="studio-mini-prop-value studio-mini-prop-value--success">
              true
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}
