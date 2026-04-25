"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { type Audience, type AudienceContent, audienceContent } from "@/lib/audience";

interface AudienceContextValue {
  audience: Audience;
  content: AudienceContent;
  setAudience: (a: Audience) => void;
}

export const AudienceContext = createContext<AudienceContextValue | null>(null);

export function AudienceProvider({
  initialAudience,
  children
}: {
  initialAudience: Audience;
  children: React.ReactNode;
}) {
  const [audience, setAudienceState] = useState<Audience>(initialAudience);

  const setAudience = (next: Audience) => {
    setAudienceState(next);
  };

  useEffect(() => {
    document.body.setAttribute("data-audience", audience);
    try {
      localStorage.setItem("weld_waitlist_type", audience);
    } catch {
      // ignore
    }
    return () => {
      document.body.removeAttribute("data-audience");
    };
  }, [audience]);

  return (
    <AudienceContext.Provider
      value={{ audience, content: audienceContent[audience], setAudience }}
    >
      {children}
    </AudienceContext.Provider>
  );
}

export function useOptionalAudience(): AudienceContextValue | null {
  return useContext(AudienceContext);
}

export function useAudience(): AudienceContextValue {
  const ctx = useOptionalAudience();
  if (!ctx) throw new Error("useAudience must be used inside AudienceProvider");
  return ctx;
}
