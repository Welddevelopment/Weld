"use client";

import { useEffect, useState } from "react";
import { AudienceProvider } from "@/context/AudienceContext";
import type { Audience } from "@/lib/audience";
import { getDefaultAudience } from "@/lib/audience";

import SplitEntry from "./SplitEntry";
import Nav from "./Nav";
import HeroSection from "./HeroSection";
import PulseStrip from "./PulseStrip";
import ComparisonSection from "./ComparisonSection";
import HowSection from "./HowSection";
import ForSection from "./ForSection";
import ProofSection from "./ProofSection";
import FAQSection from "./FAQSection";
import CTASection from "./CTASection";
import Footer from "./Footer";

export default function LandingPage() {
  const [initialAudience, setInitialAudience] = useState<Audience>("developer");
  const [showSplit, setShowSplit] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const aud = getDefaultAudience(params);
    setInitialAudience(aud);

    const preview = params.get("preview");
    const type = params.get("type");
    const skipSplit = preview != null || type != null;
    setShowSplit(!skipSplit);

    if (!skipSplit) {
      document.body.classList.add("split-active");
    }

    // Referral
    const ref = params.get("ref");
    if (ref) {
      try { localStorage.setItem("weld_referral_code", ref); } catch {}
    }

    // Analytics
    try {
      (window as unknown as Record<string, unknown> & { weldTrack?: (event: string, data: Record<string, unknown>) => void }).weldTrack?.("landing_view", {
        audience: aud,
        ref: ref ?? undefined,
        src: params.get("src") ?? undefined
      });
    } catch {}

    document.body.dataset.page = "landing";
    setReady(true);

    return () => {
      document.body.classList.remove("split-active");
      delete document.body.dataset.page;
    };
  }, []);

  if (!ready) return null;

  return (
    <AudienceProvider initialAudience={initialAudience}>
      {showSplit && <SplitEntry initialHidden={false} />}
      <Nav />
      <HeroSection />
      <PulseStrip />
      <ComparisonSection />
      <HowSection />
      <ForSection />
      <ProofSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </AudienceProvider>
  );
}
