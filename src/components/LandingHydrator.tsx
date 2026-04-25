"use client";

import { useEffect } from "react";

type LandingHydratorProps = {
  bodyHtml: string;
  styles: string;
  initialAudience?: Audience;
  hideSplitEntry?: boolean;
};

type Audience = "developer" | "studio";

const audienceContent = {
  developer: {
    heroEyebrow: "swipe. spark. ship.",
    heroLine1: "Spark with studios.",
    heroLine2: "No more discord.",
    heroSub:
      "We 'weld.' your work - shipped games, clips, and whatever represents your spark - into a professional profile studios can trust: not scattered in a discord server or thread.",
    heroPlaceholder: "your@email.com",
    heroButton: "Spark with your clients",
    heroMeta: 'Swipe. Spark. Ship. Free.<span class="trust-sep"></span>Kickstart the movement',
    heroSecondaryText: "Hiring for a studio?",
    heroSecondaryHref: "#studio",
    point1Title: "Authenticated profiles",
    point1Copy: "Secure sparking with proof studios can trust.",
    point2Title: "Rates and availability",
    point2Copy: "Rates and availability, displayed before the first message.",
    point3Title: "Digestible intros",
    point3Copy: "Digestible intros, made for swiping.",
    navCta: "Spark with your clients",
    navSection: "For studios",
    ctaTitle: "Get hired, without the noise. Start here.",
    ctaSub:
      "Sign up for the waitlist early and get benefits when we go live, to improve your sparks.",
    ctaPlaceholder: "your@email.com",
    ctaButton: "Spark with your clients"
  },
  studio: {
    heroEyebrow: "swipe. spark. ship.",
    heroLine1: "weld. with devs.",
    heroLine2: "no more discord.",
    heroSub:
      "weld. links you with developers through verified Roblox profiles - rates, availability, and shipped games all in one place, so you can focus on shipping.",
    heroPlaceholder: "studio@email.com",
    heroButton: "Weld with your devs",
    heroMeta: 'Swipe. Spark. Ship. Free.<span class="trust-sep"></span>Supercharge your studio',
    heroSecondaryText: "I'm a developer",
    heroSecondaryHref: "#top",
    point1Title: "Authenticated profiles",
    point1Copy: "See proof, rates, and shipped work in one place.",
    point2Title: "Rates and availability",
    point2Copy: "Know budget fit and timing before you reach out.",
    point3Title: "Digestible intros",
    point3Copy: "Digestible intros, made for hiring.",
    navCta: "Weld with your devs",
    navSection: "For developers",
    ctaTitle: "Hire, without the noise. Start here.",
    ctaSub:
      "Sign up for the waitlist early and get benefits when we go live, to improve your sparks.",
    ctaPlaceholder: "studio@email.com",
    ctaButton: "Weld with your devs"
  }
} satisfies Record<
  Audience,
  {
    heroEyebrow: string;
    heroLine1: string;
    heroLine2: string;
    heroSub: string;
    heroPlaceholder: string;
    heroButton: string;
    heroMeta: string;
    heroSecondaryText: string;
    heroSecondaryHref: string;
    point1Title: string;
    point1Copy: string;
    point2Title: string;
    point2Copy: string;
    point3Title: string;
    point3Copy: string;
    navCta: string;
    navSection: string;
    ctaTitle: string;
    ctaSub: string;
    ctaPlaceholder: string;
    ctaButton: string;
  }
>;

function readStored(key: string) {
  try {
    return window.localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function writeStored(key: string, value: string) {
  try {
    if (value) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // Ignore local storage failures so the funnel keeps working.
  }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

export default function LandingHydrator({
  bodyHtml,
  styles,
  initialAudience = "developer",
  hideSplitEntry: shouldHideSplitEntry = false
}: LandingHydratorProps) {
  useEffect(() => {
    const previousPage = document.body.dataset.page;
    const previousAudience = document.body.getAttribute("data-audience");
    document.body.dataset.page = "landing";

    const params = new URLSearchParams(window.location.search);
    const waitlistEndpoint = "/api/waitlist";
    const typeParam = params.get("type");
    const previewAudience = params.get("preview");
    let currentAudience: Audience =
      typeParam === "studio"
        ? "studio"
        : typeParam === "developer"
          ? "developer"
          : previewAudience === "studio"
            ? "studio"
            : previewAudience === "developer"
              ? "developer"
              : initialAudience;

    const listeners: Array<() => void> = [];
    let observer: IntersectionObserver | null = null;

    const getReferrerCode = () => params.get("ref") || readStored("weld_referrer");

    const getUtmPayload = () => ({
      utmSource: params.get("utm_source") || "",
      utmMedium: params.get("utm_medium") || "",
      utmCampaign: params.get("utm_campaign") || ""
    });

    const postWaitlist = async (payload: Record<string, unknown>) => {
      const response = await fetch(waitlistEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      let data: Record<string, unknown> = {};

      try {
        data = (await response.json()) as Record<string, unknown>;
      } catch {
        data = {};
      }

      if (!response.ok || !data.ok) {
        throw new Error(
          String(data.message || "Could not save your spot right now. Please try again.")
        );
      }

      return data;
    };

    const trackWaitlistEvent = (
      eventName: string,
      extra?: Record<string, unknown>
    ) => {
      const payload = Object.assign(
        {
          stage: "event",
          eventName,
          email: readStored("weld_waitlist_email"),
          type: readStored("weld_waitlist_type") || "developer",
          refCode: readStored("weld_ref_code"),
          referredBy: getReferrerCode()
        },
        getUtmPayload(),
        extra || {}
      );

      return fetch(waitlistEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => null);
    };

    const setFeedback = (
      container: Element | null,
      text: string,
      state: "" | "success" | "error"
    ) => {
      if (!(container instanceof HTMLElement)) {
        return;
      }

      container.textContent = text || "";

      if (state) {
        container.setAttribute("data-state", state);
      } else {
        container.removeAttribute("data-state");
      }
    };

    const setFormPresentation = (
      formId: string,
      inputId: string,
      buttonId: string,
      type: Audience,
      placeholder: string,
      buttonLabel: string,
      ariaLabel: string
    ) => {
      const form = document.getElementById(formId);
      const input = document.getElementById(inputId);
      const button = document.getElementById(buttonId);

      if (form) {
        form.setAttribute("data-type", type);
      }

      if (input instanceof HTMLInputElement) {
        input.placeholder = placeholder;
        input.setAttribute("aria-label", ariaLabel);
      }

      if (button instanceof HTMLButtonElement) {
        button.textContent = buttonLabel;
        button.setAttribute("data-default-label", buttonLabel);
      }
    };

    const setAudience = (audience: string) => {
      const nextAudience: Audience = audience === "studio" ? "studio" : "developer";
      const content = audienceContent[nextAudience];

      currentAudience = nextAudience;
      window.localStorage.setItem("weld_waitlist_type", nextAudience);
      document.body.setAttribute("data-audience", nextAudience);

      document
        .querySelectorAll<HTMLElement>("[data-audience-btn]")
        .forEach((button) => {
          button.classList.toggle(
            "active",
            button.getAttribute("data-audience-btn") === nextAudience
          );
        });

      const textTargets: Array<[string, string]> = [
        ["hero-eyebrow", content.heroEyebrow],
        ["hero-line-1", content.heroLine1],
        ["hero-line-2", content.heroLine2],
        ["hero-sub", content.heroSub],
        ["hero-point-1-title", content.point1Title],
        ["hero-point-1-copy", content.point1Copy],
        ["hero-point-2-title", content.point2Title],
        ["hero-point-2-copy", content.point2Copy],
        ["hero-point-3-title", content.point3Title],
        ["hero-point-3-copy", content.point3Copy],
        ["nav-cta-desktop", content.navCta],
        ["nav-cta-mobile", content.navCta],
        ["nav-section-link", content.navSection],
        ["cta-title", content.ctaTitle],
        ["cta-subcopy", content.ctaSub]
      ];

      textTargets.forEach(([id, value]) => {
        const node = document.getElementById(id);
        if (node) {
          node.textContent = value;
        }
      });

      const metaCopy = document.getElementById("hero-meta-copy");
      if (metaCopy) {
        metaCopy.innerHTML = content.heroMeta;
      }

      const secondaryLink = document.getElementById("hero-secondary-link");
      if (secondaryLink instanceof HTMLAnchorElement) {
        secondaryLink.textContent = content.heroSecondaryText;
        secondaryLink.href = content.heroSecondaryHref;
      }

      setFormPresentation(
        "hero-form",
        "hero-email-input",
        "hero-submit",
        nextAudience,
        content.heroPlaceholder,
        content.heroButton,
        nextAudience === "studio"
          ? "Email address for the studio waitlist"
          : "Email address for the developer waitlist"
      );

      setFormPresentation(
        "cta-form",
        "cta-email-input",
        "cta-submit",
        nextAudience,
        content.ctaPlaceholder,
        content.ctaButton,
        nextAudience === "studio"
          ? "Studio email address for beta access"
          : "Developer email address for beta access"
      );
    };

    const dismissSplitEntry = () => {
      const splitEntry = document.getElementById("split-entry");

      if (!splitEntry) {
        return;
      }

      splitEntry.classList.add("se-hidden");
      document.body.classList.remove("split-active");
    };

    const chooseAudience = (audience: string | null) => {
      setAudience(audience || "developer");
      dismissSplitEntry();

      if (window.location.hash && (window.location.hash !== "#studio" || audience === "studio")) {
        const target = document.querySelector(window.location.hash);

        if (target instanceof HTMLElement) {
          window.setTimeout(() => {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 120);
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    const handleCaptureSubmit = async (event: Event) => {
      event.preventDefault();

      const form = event.currentTarget;

      if (!(form instanceof HTMLFormElement)) {
        return;
      }

      const type = (form.getAttribute("data-type") || "developer") as Audience;
      const source = form.getAttribute("data-source") || "hero";
      const input = form.querySelector("input[type='email']");
      const submitButton = form.querySelector("button[type='submit']");
      const feedback = form.nextElementSibling;
      const email = String((input as HTMLInputElement | null)?.value || "")
        .trim()
        .toLowerCase();
      const defaultLabel =
        submitButton?.getAttribute("data-default-label") || submitButton?.textContent || "";

      if (!isValidEmail(email)) {
        (input as HTMLInputElement | null)?.focus();
        setFeedback(
          feedback,
          "Enter a valid email address so we can save your spot.",
          "error"
        );
        return;
      }

      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = true;
        submitButton.textContent = "Saving your spot...";
      }

      setFeedback(feedback, "", "");

      const referredBy = getReferrerCode();
      const capturePayload = Object.assign(
        {
          stage: "capture",
          email,
          type,
          source,
          referredBy,
          refCode: readStored("weld_ref_code")
        },
        getUtmPayload()
      );

      trackWaitlistEvent(type === "developer" ? "hero_cta_click" : "studio_cta_click", {
        email,
        type,
        source
      });

      try {
        const data = await postWaitlist(capturePayload);

        writeStored("weld_waitlist_email", email);
        writeStored("weld_waitlist_type", type);
        writeStored("weld_ref_code", String(data.refCode || ""));

        if (referredBy) {
          writeStored("weld_referrer", referredBy);
        }

        await trackWaitlistEvent("waitlist_capture_success", {
          email,
          type,
          source,
          refCode: data.refCode,
          waitlistId: data.waitlistId
        });

        setFeedback(feedback, "Spot saved. Taking you to your invite screen...", "success");

        const nextUrl = new URL("/signup", window.location.origin);
        nextUrl.searchParams.set("email", email);
        nextUrl.searchParams.set("type", type);
        nextUrl.searchParams.set("refCode", String(data.refCode || ""));
        nextUrl.searchParams.set("src", source);

        if (referredBy) {
          nextUrl.searchParams.set("ref", referredBy);
        }

        window.setTimeout(() => {
          window.location.assign(nextUrl.toString());
        }, 240);
      } catch (error) {
        setFeedback(
          feedback,
          error instanceof Error
            ? error.message
            : "Could not save your spot right now. Please try again.",
          "error"
        );

        if (submitButton instanceof HTMLButtonElement) {
          submitButton.disabled = false;
          submitButton.textContent = defaultLabel;
        }
      }
    };

    const setFaqState = (item: Element, shouldOpen: boolean) => {
      const button = item.querySelector(".faq-trigger");

      item.classList.toggle("open", shouldOpen);

      if (button instanceof HTMLButtonElement) {
        button.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
      }
    };

    const initScrollReveal = () => {
      const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");

      if (!nodes.length) {
        return;
      }

      if (!("IntersectionObserver" in window)) {
        nodes.forEach((node) => node.classList.add("is-visible"));
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          });
        },
        {
          threshold: 0.18,
          rootMargin: "0px 0px -10% 0px"
        }
      );

      nodes.forEach((node) => observer?.observe(node));
    };

    const shouldShowSplit = !shouldHideSplitEntry && !typeParam && !previewAudience;

    if (shouldShowSplit) {
      document.body.classList.add("split-active");
    } else {
      dismissSplitEntry();
    }

    setAudience(currentAudience);

    document.querySelectorAll<HTMLFormElement>(".waitlist-form").forEach((form) => {
      form.addEventListener("submit", handleCaptureSubmit);
      listeners.push(() => form.removeEventListener("submit", handleCaptureSubmit));
    });

    document.querySelectorAll<HTMLElement>("[data-audience-btn]").forEach((button) => {
      const handler = () => setAudience(button.getAttribute("data-audience-btn") || "developer");
      button.addEventListener("click", handler);
      listeners.push(() => button.removeEventListener("click", handler));
    });

    document.querySelectorAll<HTMLElement>("[data-split-target]").forEach((button) => {
      const handler = () => chooseAudience(button.getAttribute("data-split-target"));
      button.addEventListener("click", handler);
      listeners.push(() => button.removeEventListener("click", handler));
    });

    document.querySelectorAll<HTMLElement>("[data-faq-item]").forEach((item) => {
      const button = item.querySelector(".faq-trigger");
      setFaqState(item, item.classList.contains("open"));

      if (!(button instanceof HTMLButtonElement)) {
        return;
      }

      const handler = () => {
        const shouldOpen = !item.classList.contains("open");

        document.querySelectorAll<HTMLElement>("[data-faq-item]").forEach((faqItem) => {
          setFaqState(faqItem, false);
        });

        setFaqState(item, shouldOpen);
      };

      button.addEventListener("click", handler);
      listeners.push(() => button.removeEventListener("click", handler));
    });

    initScrollReveal();

    if (previewAudience === "developer" || previewAudience === "studio") {
      setAudience(previewAudience);
      dismissSplitEntry();
    }

    const incomingRef = params.get("ref");
    if (incomingRef) {
      writeStored("weld_referrer", incomingRef);
      void trackWaitlistEvent("referral_visit", {
        referredBy: incomingRef,
        source: params.get("src") || "share"
      });
    }

    void trackWaitlistEvent("landing_view", {
      type: currentAudience,
      source: params.get("src") || "direct"
    });

    return () => {
      listeners.forEach((dispose) => dispose());
      observer?.disconnect();
      document.body.classList.remove("split-active");
      document.body.removeAttribute("data-audience");

      if (previousAudience) {
        document.body.setAttribute("data-audience", previousAudience);
      }

      if (previousPage) {
        document.body.dataset.page = previousPage;
      } else {
        delete document.body.dataset.page;
      }
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div
        className="min-h-screen"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
    </>
  );
}
