export type Audience = "developer" | "studio";

export interface AudienceContent {
  heroEyebrow: string;
  heroLine1: string;
  heroLine2: string;
  heroSub: string;
  heroPlaceholder: string;
  heroButton: string;
  heroMetaLeft: string;
  heroMetaRight: string;
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

export const audienceContent: Record<Audience, AudienceContent> = {
  developer: {
    heroEyebrow: "swipe. spark. ship.",
    heroLine1: "Spark with studios.",
    heroLine2: "No more discord.",
    heroSub:
      "We 'weld.' your work — shipped games, clips, and whatever represents your spark — into a professional profile studios can trust: not scattered in a discord server or thread.",
    heroPlaceholder: "your@email.com",
    heroButton: "Spark with your clients",
    heroMetaLeft: "Swipe. Spark. Ship. Free.",
    heroMetaRight: "Kickstart the movement",
    heroSecondaryText: "Hiring for a studio?",
    heroSecondaryHref: "#studio",
    point1Title: "Authenticated profiles",
    point1Copy: "Secure sparking with proof studios can trust.",
    point2Title: "Rates and availability",
    point2Copy: "Displayed before the first message.",
    point3Title: "Digestible intros",
    point3Copy: "Made for swiping, not scrolling.",
    navCta: "Spark with your clients",
    navSection: "For studios",
    ctaTitle: "Get hired, without the noise.",
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
      "weld. links you with developers through verified Roblox profiles — rates, availability, and shipped games all in one place, so you can focus on shipping.",
    heroPlaceholder: "studio@email.com",
    heroButton: "Weld with your devs",
    heroMetaLeft: "Swipe. Spark. Ship. Free.",
    heroMetaRight: "Supercharge your studio",
    heroSecondaryText: "I'm a developer",
    heroSecondaryHref: "#top",
    point1Title: "Authenticated profiles",
    point1Copy: "See proof, rates, and shipped work in one place.",
    point2Title: "Rates and availability",
    point2Copy: "Know budget fit and timing before you reach out.",
    point3Title: "Digestible intros",
    point3Copy: "Made for hiring, not hunting.",
    navCta: "Weld with your devs",
    navSection: "For developers",
    ctaTitle: "Hire, without the noise.",
    ctaSub:
      "Sign up for the waitlist early and get benefits when we go live, to improve your sparks.",
    ctaPlaceholder: "studio@email.com",
    ctaButton: "Weld with your devs"
  }
};

export function getDefaultAudience(params: URLSearchParams): Audience {
  const type = params.get("type");
  const preview = params.get("preview");
  if (type === "studio" || preview === "studio") return "studio";
  return "developer";
}
