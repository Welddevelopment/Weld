"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode
} from "react";

import {
  captureAttributionFromLocation,
  persistAudiencePreference,
  submitSignupCapture,
  trackEvent
} from "@/dynamic landing page/lib/browser";
import type { SourceVariant } from "@/dynamic landing page/lib/source-variant";
import type { Audience } from "@/dynamic landing page/lib/types";
import { useMotionPolicy } from "@/dynamic landing page/lib/useMotionPolicy";
import { DoodleBubble } from "@/dynamic landing page/components/primitives/DoodleBubble";
import { DoodleNote } from "@/dynamic landing page/components/primitives/DoodleNote";
import { MatchMeter } from "@/dynamic landing page/components/primitives/MatchMeter";
import { Sticker } from "@/dynamic landing page/components/primitives/Sticker";
import { getLandingCopy, type LandingCopy } from "@/dynamic landing page/lib/copy";
import {
  PROFILES,
  ROLE_LABELS,
  ROLE_ORDER,
  nextRole,
  type DetailKey,
  type RoleKey,
  type TalentProfile
} from "@/dynamic landing page/lib/role-config";

interface MarketingPageProps {
  initialMode: Audience;
  sourceVariant: SourceVariant;
  page: "landing" | "studios";
}

type SwipeState = "idle" | "reject" | "like" | "spark";
type CapturePhase = "idle" | "submitting" | "success" | "error";

const WAITLIST_URL = "https://weldroblox.com";


function joinHref(mode: Audience, search: string) {
  const base = mode === "studio" ? "/studios" : "/";
  return search ? `${base}?${search}` : base;
}

function scrollToId(id: string) {
  if (typeof window === "undefined") {
    return;
  }

  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function MarketingPage(props: MarketingPageProps) {
  return <WeldLandingPage {...props} />;
}

function WeldLandingPage({
  initialMode,
  sourceVariant,
  page
}: MarketingPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const motion = useMotionPolicy();
  const motionTier = motion.tier;
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<Audience>(initialMode);
  const [role, setRole] = useState<RoleKey>("scripter");
  const [swipeState, setSwipeState] = useState<SwipeState>("idle");
  const [detailKey, setDetailKey] = useState<DetailKey | null>(null);
  const [email, setEmail] = useState("");
  const [capturePhase, setCapturePhase] = useState<CapturePhase>("idle");
  const [captureStatus, setCaptureStatus] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const captureRef = useRef<HTMLDivElement | null>(null);
  const pageShellRef = useRef<HTMLDivElement | null>(null);

  const activeProfile = PROFILES[role];
  const modeCopy = getLandingCopy(mode);
  const activeDetail = detailKey ? activeProfile.proofDetails[detailKey] : null;

  useEffect(() => {
    captureAttributionFromLocation();
  }, []);

  useEffect(() => {
    const root = pageShellRef.current;
    if (!root) {
      return;
    }
    if (motion.reducedMotion || typeof IntersectionObserver === "undefined") {
      root
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((node) => node.setAttribute("data-reveal", "seen"));
      return;
    }

    const targets = root.querySelectorAll<HTMLElement>('[data-reveal="pending"]');
    if (targets.length === 0) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = motion.allowEntranceStagger ? Math.min(index * 50, 240) : 0;
          window.setTimeout(() => el.setAttribute("data-reveal", "seen"), delay);
          observer.unobserve(el);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    targets.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [motion.reducedMotion, motion.allowEntranceStagger]);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    void trackEvent({
      eventName: "landing_viewed",
      page,
      audience: mode,
      payload: { variant: sourceVariant }
    });
  }, [mode, page, sourceVariant]);

  function handleModeChange(nextMode: Audience) {
    if (nextMode === mode) {
      return;
    }

    setMode(nextMode);
    persistAudiencePreference(nextMode);
    setCaptureStatus("");
    setCapturePhase("idle");

    void trackEvent({
      eventName: "landing_mode_changed",
      page,
      audience: nextMode,
      payload: { from: mode, to: nextMode }
    });

    startTransition(() => {
      router.push(joinHref(nextMode, searchString));
    });
  }

  function handleRoleChange(nextRoleKey: RoleKey) {
    if (nextRoleKey === role) {
      return;
    }

    if (motion.reducedMotion) {
      setRole(nextRoleKey);
      setSwipeState("idle");
      setDetailKey(null);
    } else {
      setIsSwapping(true);
      window.setTimeout(() => {
        setRole(nextRoleKey);
        setSwipeState("idle");
        setDetailKey(null);
        setIsSwapping(false);
      }, 120);
    }

    void trackEvent({
      eventName: "landing_role_selected",
      page,
      audience: mode,
      payload: { role: nextRoleKey }
    });
  }

  function handleJoinIntent(source: "nav" | "hero") {
    void trackEvent({
      eventName: "landing_cta_clicked",
      page,
      audience: mode,
      payload: { source, variant: sourceVariant }
    });

    scrollToId("join");
  }

  function handleLearnMore() {
    void trackEvent({
      eventName: "landing_learn_more_clicked",
      page,
      audience: mode,
      payload: { role }
    });

    scrollToId("how");
  }

  function handleSwipe(nextState: Exclude<SwipeState, "idle">) {
    setSwipeState(nextState);
    setDetailKey(null);

    void trackEvent({
      eventName: "landing_card_action",
      page,
      audience: mode,
      payload: { role, action: nextState }
    });

    if (nextState === "reject") {
      window.setTimeout(
        () => {
          setRole((current) => nextRole(current));
          setSwipeState("idle");
        },
        motionTier === "reduced" ? 80 : 340
      );
      return;
    }

    if (nextState === "spark") {
      window.setTimeout(() => scrollToId("join"), motionTier === "reduced" ? 0 : 180);
    }

    window.setTimeout(
      () => setSwipeState("idle"),
      motionTier === "reduced" ? 600 : 1100
    );
  }

  async function handleCapture() {
    if (!email.trim()) {
      setCapturePhase("error");
      setCaptureStatus("Add your email to join early access.");
      captureRef.current?.querySelector("input")?.focus();
      return;
    }

    setCapturePhase("submitting");
    setCaptureStatus("Joining...");

    try {
      const response = await submitSignupCapture({
        email,
        audience: mode,
        source: "final",
        page,
        variant: sourceVariant
      });

      setCapturePhase("success");
      setCaptureStatus("You're on list. Opening your invite...");

      window.setTimeout(() => {
        router.push(response.inviteUrl || `/invite/${response.inviteCode}`);
      }, motionTier === "reduced" ? 0 : 500);
    } catch {
      setCapturePhase("error");
      setCaptureStatus("Something went wrong. Try again in a moment.");
    }
  }

  return (
    <div
      ref={pageShellRef}
      className="weld-glass-page"
      data-motion-tier={motionTier}
      style={
        {
          "--profile-accent": activeProfile.accent,
          "--profile-soft": activeProfile.soft
        } as CSSProperties
      }
    >
      <GlassNav
        mode={mode}
        copy={modeCopy}
        searchString={searchString}
        pending={isPending}
        onModeChange={handleModeChange}
        onJoinClick={() => handleJoinIntent("nav")}
      />

      <main className="weld-glass-main">
        <HeroShell>
          <HeroTalentCard
            profile={activeProfile}
            swipeState={swipeState}
            isSwapping={isSwapping}
          />
          <HeroCopyPanel copy={modeCopy} />
        </HeroShell>

        <HowItWorksStrip copy={modeCopy} />

        <RoleTalentExplorer
          copy={modeCopy}
          role={role}
          profile={activeProfile}
          isSwapping={isSwapping}
          onRoleChange={handleRoleChange}
        />

        <ProfileCreationSection copy={modeCopy} profile={activeProfile} />

        <ChatPreviewSection copy={modeCopy} profile={activeProfile} />

        <AntiDiscordSection copy={modeCopy} />

        <ProofTrustSection
          copy={modeCopy}
          profile={activeProfile}
          swipeState={swipeState}
          onDetailToggle={setDetailKey}
          onSwipe={handleSwipe}
        />

        <ComparisonTableSection />

        <StudioScoutSection copy={modeCopy} />

        <WaitlistSignupSection
          mode={mode}
          copy={modeCopy}
          email={email}
          phase={capturePhase}
          status={captureStatus}
          captureRef={captureRef}
          onEmailChange={setEmail}
          onSubmit={() => void handleCapture()}
        />

        <FriendlyFAQ copy={modeCopy} openFaq={openFaq} onToggle={setOpenFaq} />
      </main>

      <FooterCTA copy={modeCopy} />

      {activeDetail ? (
        <ProofDetailDialog
          title={activeDetail.title}
          body={activeDetail.body}
          onClose={() => setDetailKey(null)}
        />
      ) : null}
    </div>
  );
}

function GlassNav({
  mode,
  copy,
  searchString,
  pending,
  onModeChange,
  onJoinClick
}: {
  mode: Audience;
  copy: LandingCopy;
  searchString: string;
  pending?: boolean;
  onModeChange: (mode: Audience) => void;
  onJoinClick: () => void;
}) {
  return (
    <header className="glass-nav-shell">
      <Link href={joinHref(mode, searchString)} className="glass-brand" aria-label="Weld home">
        <span className="glass-brand-mark">
          <Image src="/Assets/weld-logo-official.svg" alt="" width={24} height={24} priority />
        </span>
        <span>weld.</span>
      </Link>

      <ModeToggle mode={mode} disabled={pending} onChange={onModeChange} />

      <nav className="glass-nav-links" aria-label="Primary">
        {copy.nav.links.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
        <Link href="/login">{copy.nav.logIn}</Link>
        <a
          href="#join"
          className="button-primary button-nav"
          onClick={(event) => {
            event.preventDefault();
            onJoinClick();
          }}
        >
          {copy.nav.cta}
        </a>
      </nav>
    </header>
  );
}

function HeroShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="hero-shell hero-shell-split" id="top">
      <div className="hero-shell-bloom" aria-hidden="true" />
      <div className="hero-shell-grid">{children}</div>
    </section>
  );
}

function HeroCopyPanel({ copy }: { copy: LandingCopy }) {
  return (
    <div className="hero-copy-panel hero-copy-panel-split">
      <span className="hero-mode-pill">I&apos;m a developer</span>
      <h1>The talent network for Roblox.</h1>
      <p className="hero-lead">
        Link your games, set your rate, and match with studios that actually ship.
      </p>
      <p className="hero-support">
        weld. turns shipped work, rates, availability, links, and proof into swipeable talent
        cards studios can trust.
      </p>
      <span className="hero-copy-eyebrow-hidden" aria-hidden="true">
        {copy.hero.eyebrow}
      </span>
    </div>
  );
}

function HeroTalentCard({
  profile,
  swipeState,
  isSwapping
}: {
  profile: TalentProfile;
  swipeState: SwipeState;
  isSwapping: boolean;
}) {
  const stats: Array<{ icon: ReactNode; label: string; value: string }> = [
    { icon: <UserIcon />, label: profile.years, value: "Experience" },
    { icon: <FolderIcon />, label: profile.projects, value: "Projects" },
    { icon: <ClockIcon />, label: profile.reliability, value: "Reliability" }
  ];

  return (
    <div className="hero-card-column hero-card-column-split">
      <article
        className={`hero-talent-card hero-talent-card-split is-${swipeState}`}
        data-swapping={isSwapping ? "true" : "false"}
      >
        <div className="hero-card-top-row">
          <span className="hero-card-verified-pill">
            <ShieldIcon />
            Verified
          </span>
          <div className="hero-card-corner-icons" aria-hidden="true">
            <span><GithubIcon /></span>
            <span><LinkedInIcon /></span>
          </div>
        </div>

        <div className="hero-card-identity-row">
          <div className="profile-avatar-shell hero-avatar-shell-clean">
            <div className="profile-avatar">
              <span className="avatar-hair" />
              <span className="avatar-face">
                <span className="avatar-mouth" />
              </span>
              <span className="avatar-hoodie" />
            </div>
            <span className="avatar-status-dot" />
          </div>
          <div className="hero-card-clean-identity">
            <div className="hero-card-name-row">
              <h2>{profile.name}</h2>
              <span className="verified-dot is-active" aria-hidden="true">
                <CheckIcon />
              </span>
            </div>
            <p className="hero-card-role">{profile.label}</p>
            <p className="hero-card-availability">
              <span />
              {profile.availability}
            </p>
          </div>
        </div>

        <div className="hero-stat-row-split" aria-label="Profile proof stats">
          {stats.map((stat) => (
            <div key={stat.value} className="hero-stat-chip-split">
              {stat.icon}
              <div>
                <strong>{stat.label}</strong>
                <span>{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="hero-card-headline hero-card-headline-split">{profile.headline}</p>

        <div className="hero-card-commerce-row hero-card-commerce-split">
          <div className="hero-rate-pill hero-rate-pill-split">
            <span>Rate</span>
            <strong>{profile.rate}</strong>
            <em>{profile.payment}</em>
          </div>
          <div className="hero-skill-grid hero-skill-grid-split" aria-label="Services">
            {profile.services.map((service) => (
              <span key={service}>{service}</span>
            ))}
          </div>
        </div>

        <div className="hero-link-grid hero-link-grid-split" aria-label="Profile links">
          {profile.links.map((link) => (
            <div key={link.label}>
              <span className={`hero-social-icon is-${socialIconKey(link.label)}`} aria-hidden="true">
                <SocialIcon label={link.label} />
              </span>
              <strong>{link.label}</strong>
              <em>{link.value}</em>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

function HowItWorksStrip({ copy }: { copy: LandingCopy }) {
  const steps = copy.howItWorks.steps;
  return (
    <section data-reveal="pending" className="how-strip-section" aria-label={copy.howItWorks.title}>
      <div className="glass-card how-strip">
        {steps.map(([number, title, body], index) => (
          <article key={title} className="step-card">
            <span className="step-index">{number}</span>
            <h3>{title}</h3>
            <p>{body}</p>
            {index < steps.length - 1 ? <span className="step-arrow" aria-hidden="true">→</span> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function RoleTalentExplorer({
  copy,
  role,
  profile,
  isSwapping,
  onRoleChange
}: {
  copy: LandingCopy;
  role: RoleKey;
  profile: TalentProfile;
  isSwapping: boolean;
  onRoleChange: (role: RoleKey) => void;
}) {
  const buttonRefs = useRef<Partial<Record<RoleKey, HTMLButtonElement | null>>>({});

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentRole: RoleKey) {
    const currentIndex = ROLE_ORDER.indexOf(currentRole);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % ROLE_ORDER.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + ROLE_ORDER.length) % ROLE_ORDER.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = ROLE_ORDER.length - 1;
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRoleChange(currentRole);
      return;
    } else {
      return;
    }

    event.preventDefault();
    const next = ROLE_ORDER[nextIndex];
    onRoleChange(next);
    buttonRefs.current[next]?.focus();
  }

  return (
    <section data-reveal="pending" className="glass-section how-story-section" id="how">
      <div className="how-story-grid">
        <div className="section-copy how-story-copy">
          <span className="section-kicker">{copy.howItWorks.kicker}</span>
          <h2>{copy.howItWorks.title}</h2>
          <p>{copy.howItWorks.lead}</p>
          <p>{copy.howItWorks.support}</p>

          <div className="role-explorer-tabs" role="radiogroup" aria-label="Choose a Roblox talent role">
            {ROLE_ORDER.map((entry) => (
              <button
                key={entry}
                ref={(node) => {
                  buttonRefs.current[entry] = node;
                }}
                type="button"
                role="radio"
                aria-checked={role === entry}
                className={role === entry ? "is-active" : ""}
                onClick={() => onRoleChange(entry)}
                onKeyDown={(event) => handleKeyDown(event, entry)}
              >
                {ROLE_LABELS[entry]}
              </button>
            ))}
          </div>
        </div>

        <article
          className="glass-card how-profile-card"
          data-swapping={isSwapping ? "true" : "false"}
        >
          <div className="how-profile-top">
            <div className="profile-avatar-shell">
              <div className="profile-avatar">
                <span className="avatar-hair" />
                <span className="avatar-face">
                  <span className="avatar-mouth" />
                </span>
                <span className="avatar-hoodie" />
              </div>
              <span className="avatar-status-dot" />
            </div>

            <div>
              <div className="hero-card-name-row">
                <h3>{profile.name}</h3>
                <span className="verified-dot"><CheckIcon /></span>
              </div>
              <p>{profile.label}</p>
              <p className="hero-card-availability"><span />{profile.availability}</p>
            </div>
          </div>
          <span className="demo-caption">{copy.demo.latestProjectCaption}</span>
          <p>{profile.latestProject.summary}</p>
          <div className="how-proof-list">
            {profile.latestProject.bullets.map((bullet) => (
              <span key={bullet}><SparkIcon />{bullet}</span>
            ))}
          </div>
          <p className="demo-caption" style={{ marginTop: "12px" }}>
            {copy.demo.feedbackCaption}
          </p>
        </article>
      </div>
    </section>
  );
}

function ProfileCreationSection({
  copy,
  profile
}: {
  copy: LandingCopy;
  profile: TalentProfile;
}) {
  const items: ReadonlyArray<readonly [string, string]> = [
    ["Role", profile.label],
    ["Rate", profile.rate],
    ["Availability", profile.availability],
    ["Payment", profile.payment],
    ["Proof links", copy.profileCreation.proofLinksValue],
    ["Latest project", profile.latestProject.name],
    copy.profileCreation.cardShapeNote
  ];

  return (
    <section data-reveal="pending" className="glass-section profile-section profile-creation-section" id="profile">
      <div className="section-copy">
        <span className="section-kicker">{copy.profileCreation.kicker}</span>
        <h2>{copy.profileCreation.title}</h2>
        <p>{copy.profileCreation.body}</p>
      </div>

      <div className="glass-card profile-board">
        <div className="profile-board-avatar">
          <div className="profile-avatar-shell">
            <div className="profile-avatar">
              <span className="avatar-hair" />
              <span className="avatar-face">
                <span className="avatar-mouth" />
              </span>
              <span className="avatar-hoodie" />
            </div>
            <span className="avatar-status-dot" />
          </div>
        </div>

        <div className="profile-detail-grid">
          {items.map(([label, value]) => (
            <article key={label} className={`glass-card detail-card ${label === copy.profileCreation.cardShapeNote[0] ? "profile-detail-note" : ""}`}>
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChatPreviewSection({
  copy,
  profile
}: {
  copy: LandingCopy;
  profile: TalentProfile;
}) {
  const messages: ReadonlyArray<{ side: "out" | "in"; text: string; time: string }> = [
    { side: "out", text: "Hey Eclipse!", time: "2:34 PM" },
    { side: "out", text: "I'd love to ask about your availability for a project.", time: "2:34 PM" },
    { side: "out", text: "Could you give me a quick overview of your process and timeline?", time: "2:35 PM" },
    { side: "in", text: "Hey! Thanks for reaching out.", time: "2:36 PM" },
    { side: "in", text: "Happy to help. I can share more about the scope and how I usually work.", time: "2:36 PM" },
    {
      side: "out",
      text:
        "Sounds great! The project is a combat system with custom abilities and UI integration. Could you share the expected delivery time and pricing?",
      time: "2:37 PM"
    },
    {
      side: "in",
      text: "Got it! Thanks for the details. I can deliver a high-quality solution within the discussed timeframe.",
      time: "2:38 PM"
    }
  ];

  const handle = profile.name.toLowerCase();
  const contacts = [
    { icon: <RobloxIcon />, label: "Roblox", value: "/eclipseDev" },
    { icon: <DiscordIcon />, label: "Discord", value: "eclipse.dev" },
    { icon: <GithubIcon />, label: "GitHub", value: "eclipsedevx" }
  ];

  return (
    <section data-reveal="pending" className="glass-section chat-section" id="chat">
      <div className="section-copy chat-section-copy">
        <span className="section-kicker">{copy.chatPreview.kicker}</span>
        <h2>{copy.chatPreview.headline}</h2>
        <p>{copy.chatPreview.body}</p>
      </div>

      <div className="glass-card chat-preview-shell chat-preview-shell-clean">
        <div className="chat-window-topbar">
          <div className="chat-window-topbar-left">
            <button type="button" className="chat-back-btn" aria-label="Decorative back button">
              <ArrowLeftIcon />
              <span>Back</span>
            </button>
            <div className="chat-window-identity">
              <div className="profile-avatar-shell chat-topbar-avatar" aria-hidden="true">
                <div className="profile-avatar">
                  <span className="avatar-hair" />
                  <span className="avatar-face">
                    <span className="avatar-mouth" />
                  </span>
                  <span className="avatar-hoodie" />
                </div>
                <span className="avatar-status-dot" />
              </div>
              <div>
                <strong>
                  {handle}
                  <span className="verified-dot is-active" aria-hidden="true">
                    <CheckIcon />
                  </span>
                </strong>
                <em><span className="online-dot" />Online</em>
              </div>
            </div>
          </div>
          <div className="chat-window-actions">
            <button type="button" className="chat-view-profile-btn">
              View full profile <ArrowUpRightIcon />
            </button>
            <button type="button" className="chat-more-btn" aria-label="Decorative more menu">•••</button>
          </div>
        </div>

        <aside className="chat-profile-panel" aria-label="Chat profile summary">
          <div className="chat-profile-top">
            <div className="profile-avatar-shell chat-profile-avatar">
              <div className="profile-avatar">
                <span className="avatar-hair" />
                <span className="avatar-face">
                  <span className="avatar-mouth" />
                </span>
                <span className="avatar-hoodie" />
              </div>
              <span className="avatar-status-dot" />
            </div>
            <div>
              <div className="hero-card-name-row">
                <h3>{handle}</h3>
                <span className="verified-dot is-active" aria-hidden="true"><CheckIcon /></span>
              </div>
              <p className="hero-card-role">{profile.label}</p>
              <p className="hero-card-availability"><span />{profile.availability}</p>
            </div>
          </div>

          <div className="chat-match-bar">
            <span><ShieldIcon /> 98% Match</span>
            <i aria-hidden="true" style={{ ["--match-fill" as never]: "62%" }} />
          </div>

          <div className="chat-stat-grid">
            <span><UserIcon /><strong>{profile.years}</strong><em>Experience</em></span>
            <span><ShieldIcon /><strong>98%</strong><em>Match</em></span>
            <span><ClockIcon /><strong>Replies</strong><em>Usually 1hr</em></span>
          </div>

          <p className="chat-profile-summary">{profile.headline}</p>

          <div className="chat-contact-row chat-contact-row-clean">
            {contacts.map((contact) => (
              <span key={contact.label} className="chat-contact-chip">
                <i aria-hidden="true">{contact.icon}</i>
                <strong>{contact.label}</strong>
                <em>{contact.value}</em>
              </span>
            ))}
          </div>

          <div className="chat-professional-note">
            <span className="chat-professional-icon" aria-hidden="true"><HandRaisedIcon /></span>
            <span>
              <strong>{copy.chatPreview.professionalNote[0]}</strong>
              <em>Be respectful and clear about your project needs.</em>
            </span>
          </div>
        </aside>

        <div className="chat-thread-panel">
          <div className="chat-thread-top">
            <span className="chat-day-pill">
              <strong>{copy.chatPreview.threadLabel}</strong>
              <em>2:39 PM</em>
            </span>
          </div>

          <div className="chat-bubble-list">
            {messages.map((message, index) => (
              <div key={`${index}-${message.time}`} className={`chat-row is-${message.side}`}>
                {message.side === "in" ? (
                  <div className="chat-mini-avatar" aria-hidden="true">
                    <span />
                  </div>
                ) : null}
                <p>
                  {message.text}
                  <time>
                    {message.time}
                    {message.side === "out" ? <ChatReadIcon /> : null}
                  </time>
                </p>
              </div>
            ))}
          </div>

          <div className="chat-composer chat-composer-clean" aria-label="Decorative message composer">
            <span className="chat-composer-icon" aria-hidden="true"><PaperclipIcon /></span>
            <em>{copy.chatPreview.composerHint(handle)}</em>
            <span className="chat-composer-icon" aria-hidden="true"><EmojiIcon /></span>
            <button type="button" className="chat-send-btn" aria-label="Decorative send button">
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function AntiDiscordSection({ copy }: { copy: LandingCopy }) {
  return (
    <section data-reveal="pending" className="glass-section anti-discord-section">
      <div className="glass-card anti-discord-shell">
        <div className="section-copy">
          <span className="section-kicker">{copy.antiDiscord.kicker}</span>
          <h2>{copy.antiDiscord.headline}</h2>
          <p>{copy.antiDiscord.intro}</p>
        </div>

        <div className="comparison-grid">
          <article>
            <span>{copy.antiDiscord.beforeLabel}</span>
            {copy.antiDiscord.before.map((item) => <p key={item}>{item}</p>)}
          </article>
          <article>
            <span>{copy.antiDiscord.afterLabel}</span>
            {copy.antiDiscord.after.map((item) => <p key={item}>{item}</p>)}
          </article>
        </div>
      </div>
    </section>
  );
}

function ComparisonTableSection() {
  const features = [
    { name: "Role clarity", s: "Low", c: "Medium", w: "High" },
    { name: "Verified identity", s: "Low", c: "Low", w: "High" },
    { name: "Trust signal", s: "Low", c: "Medium", w: "High" },
    { name: "Scannability", s: "Low", c: "Medium", w: "High" },
    { name: "Search & filters", s: "Poor", c: "Limited", w: "Advanced" },
    { name: "Noise level", s: "High", c: "Medium", w: "Low" },
    { name: "Direct outreach", s: "Hard", c: "Hard", w: "Easy" },
    { name: "Hiring control", s: "Low", c: "Low", w: "High" },
    { name: "Client proof", s: "Rare", c: "Rare", w: "Built-in" },
    { name: "Time to hire", s: "Long", c: "Medium", w: "Fast" },
  ];

  return (
    <section className="glass-section comparison-table-section">
      <div className="section-copy">
        <span className="section-kicker">IMPROVED VISIBILITY</span>
        <h2>Hiring channels compared.<br/>Cards that prove it.</h2>
        <p>See how Discord servers and channels stack up against Weld — then swipe through real developer and client cards.</p>
      </div>

      <div className="comparison-table-wrapper">
        <div className="comparison-table">
          <div className="comp-table-header">
            <div className="comp-col-feature">FEATURE</div>
            <div className="comp-col-discord">DISCORD SERVERS</div>
            <div className="comp-col-discord">DISCORD CHANNELS</div>
            <div className="comp-col-weld">
              <Image src="/Assets/weld-logo-official.svg" alt="Weld" width={72} height={20} />
            </div>
          </div>
          <div className="comp-table-body">
            {features.map((f, i) => (
              <div key={i} className="comp-table-row">
                <div className="comp-col-feature">{f.name}</div>
                <div className="comp-col-discord">
                  <span className={`comp-badge comp-badge-${f.s.toLowerCase()}`}>{f.s}</span>
                </div>
                <div className="comp-col-discord">
                  <span className={`comp-badge comp-badge-${f.c.toLowerCase()}`}>{f.c}</span>
                </div>
                <div className="comp-col-weld">
                  <span className={`comp-badge comp-badge-${f.w.toLowerCase()}`}>{f.w}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofTrustSection({
  copy,
  profile,
  swipeState,
  onDetailToggle,
  onSwipe
}: {
  copy: LandingCopy;
  profile: TalentProfile;
  swipeState: SwipeState;
  onDetailToggle: (key: DetailKey | null) => void;
  onSwipe: (state: Exclude<SwipeState, "idle">) => void;
}) {
  return (
    <section data-reveal="pending" className="glass-section proof-section" id="proof">
      <div className="section-copy">
        <span className="section-kicker">{copy.proof.kicker}</span>
        <h2>{copy.proof.title}</h2>
        <p>{copy.proof.lead}</p>
      </div>

      <div className="proof-layout">
        <article className="discord-mock-card proof-before-card">
          <strong>{copy.proof.beforeStrong}</strong>
          <p>{copy.proof.beforeBody}</p>
          <div className="proof-chip-row">
            {copy.proof.beforeChips.map((chip) => (
              <span key={chip}>{chip}</span>
            ))}
          </div>
        </article>

        <article className="glass-card proof-after-card">
          <strong>{copy.proof.afterStrong}</strong>
          <p>{copy.proof.afterBody}</p>
          <span className="demo-caption">{copy.demo.feedbackCaption}</span>
          <div className="proof-badge-row" aria-label="Proof badges">
            <Sticker tone="founding" icon={<SparkIcon />} label="Founding member" />
            <Sticker tone="info" icon={<FolderIcon />} label="Linked work" />
            <Sticker tone="like" icon={<HeartIcon />} label="Studio favorite" />
          </div>
          <div className="proof-cta-grid">
            <button type="button" onClick={() => onDetailToggle("verified")}>
              <span>Verified</span>
              <ArrowUpRightIcon />
            </button>
            <button type="button" onClick={() => onDetailToggle("latest")}>
              <span>{profile.latestProject.name}</span>
              <ArrowUpRightIcon />
            </button>
            <button type="button" onClick={() => onDetailToggle("feedback")}>
              <span>{profile.feedback.label}</span>
              <ArrowUpRightIcon />
            </button>
          </div>
          <div className={`proof-card-actions is-${swipeState}`} aria-label="Card actions" style={{ position: "relative" }}>
            <DoodleNote
              variant="arrow"
              tone="spark"
              label="tap Spark to send"
              rotation={12}
              style={{ top: "-44px", right: "-12px", width: "140px" }}
            />
            <button type="button" className="hero-action-button reject" onClick={() => onSwipe("reject")} aria-label={copy.proof.rejectLabel}>
              <CloseIcon />
              <span>{copy.proof.rejectLabel}</span>
            </button>
            <button type="button" className="hero-action-button like" onClick={() => onSwipe("like")} aria-label={copy.proof.likeLabel}>
              <HeartIcon />
              <span>{copy.proof.likeLabel}</span>
            </button>
            <button type="button" className="hero-action-button spark" onClick={() => onSwipe("spark")} aria-label={copy.proof.sparkLabel}>
              <SparkIcon />
              <span>{copy.proof.sparkLabel}</span>
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

function StudioScoutSection({
  copy
}: {
  copy: LandingCopy;
}) {
  return (
    <section data-reveal="pending" className="glass-section scout-section">
      <div className="glass-card scout-copy-card">
        <span className="section-kicker">{copy.studioScout.kicker}</span>
        <h2>{copy.studioScout.title}</h2>
        <p>{copy.studioScout.body}</p>
      </div>

      <div className="scout-rail">
        {copy.studioScout.rail.map(([title, body]) => (
          <article key={title} className="glass-card scout-rail-card">
            <strong>{title}</strong>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function WaitlistSignupSection({
  mode,
  copy,
  email,
  phase,
  status,
  captureRef,
  onEmailChange,
  onSubmit
}: {
  mode: Audience;
  copy: LandingCopy;
  email: string;
  phase: CapturePhase;
  status: string;
  captureRef: React.MutableRefObject<HTMLDivElement | null>;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const buttonLabel =
    phase === "submitting"
      ? copy.waitlist.submittingLabel
      : phase === "success"
        ? copy.waitlist.submittedLabel
        : copy.waitlist.button;

  const benefitIcon = (key: "shield" | "code" | "user" | "folder") => {
    if (key === "shield") return <ShieldIcon />;
    if (key === "code") return <CodeIcon />;
    if (key === "user") return <UserIcon />;
    return <FolderIcon />;
  };

  return (
    <section data-reveal="pending" className="glass-section waitlist-section" id="join">
      <div className="waitlist-shell">
        <div className="section-copy waitlist-copy">
          <span className="section-kicker">{copy.waitlist.kicker}</span>
          <h2>{copy.waitlist.headline}</h2>
          <p>{copy.waitlist.subhead}</p>
          <div className="waitlist-benefits">
            {copy.waitlist.benefits.map(([title, body, iconKey]) => (
              <span key={title}>
                {benefitIcon(iconKey)}
                <strong>
                  {title}
                  <em>{body}</em>
                </strong>
              </span>
            ))}
          </div>
        </div>

        <div
          ref={captureRef}
          className={`glass-card waitlist-form-card is-${phase}`}
        >
          <div className="waitlist-form-heading">
            <h3>{copy.waitlist.title}</h3>
            <p>{copy.waitlist.body}</p>
          </div>

          <label className="waitlist-field">
            <span>{copy.waitlist.fieldLabel}</span>
            <input
              type="email"
              value={email}
              placeholder={copy.waitlist.placeholder}
              onChange={(event) => onEmailChange(event.target.value)}
              aria-describedby={status ? `waitlist-status-${mode}` : undefined}
            />
          </label>

          <button
            type="button"
            className="button-primary waitlist-submit"
            onClick={onSubmit}
            disabled={phase === "submitting"}
          >
            {buttonLabel}
          </button>

          <p className="waitlist-privacy">{copy.waitlist.privacy}</p>

          {phase === "success" ? (
            <Sticker
              tone="spark"
              icon={<SparkIcon />}
              label={copy.waitlist.successSticker}
              className="waitlist-success-sticker"
            />
          ) : null}

          {status ? (
            <p id={`waitlist-status-${mode}`} className="waitlist-status" aria-live="polite">
              {status}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function FriendlyFAQ({
  copy,
  openFaq,
  onToggle
}: {
  copy: LandingCopy;
  openFaq: number | null;
  onToggle: (index: number | null) => void;
}) {
  return (
    <section data-reveal="pending" className="glass-section faq-section" id="faq">
      <div className="section-copy">
        <span className="section-kicker">{copy.faq.kicker}</span>
        <h2>{copy.faq.title}</h2>
      </div>

      <div className="faq-list">
        {copy.faq.items.map((faq, index) => {
          const isOpen = openFaq === index;

          return (
            <article key={faq.question} className="glass-card faq-card">
              <button
                type="button"
                className="faq-trigger"
                aria-expanded={isOpen}
                onClick={() => onToggle(isOpen ? null : index)}
              >
                <span>{faq.question}</span>
                <ChevronDownIcon className={isOpen ? "is-open" : ""} />
              </button>
              {isOpen ? <p>{faq.answer}</p> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function FooterCTA({ copy }: { copy: LandingCopy }) {
  return (
    <footer className="glass-footer">
      <div>
        <strong>weld.</strong>
        <span>{copy.footer.tagline}</span>
      </div>
      <nav aria-label="Footer">
        <a href={`${WAITLIST_URL}/privacy`}>{copy.footer.privacy}</a>
        <a href={`${WAITLIST_URL}/terms`}>{copy.footer.terms}</a>
        <a href={`${WAITLIST_URL}/contact`}>{copy.footer.contact}</a>
      </nav>
    </footer>
  );
}

function ModeToggle({
  mode,
  disabled,
  onChange
}: {
  mode: Audience;
  disabled?: boolean;
  onChange: (mode: Audience) => void;
}) {
  return (
    <div className="mode-toggle" role="radiogroup" aria-label="Audience mode">
      <span className={mode === "studio" ? "is-studio" : ""} aria-hidden="true" />
      <button
        type="button"
        role="radio"
        aria-checked={mode === "developer"}
        disabled={disabled}
        onClick={() => onChange("developer")}
      >
        I'm a developer
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={mode === "studio"}
        disabled={disabled}
        onClick={() => onChange("studio")}
      >
        I'm a studio
      </button>
    </div>
  );
}

function ProofBadge({
  detailKey,
  label,
  value,
  active,
  onToggle
}: {
  detailKey: DetailKey;
  label: string;
  value?: string;
  active: boolean;
  onToggle: (key: DetailKey | null) => void;
}) {
  return (
    <button
      type="button"
      className={`proof-badge ${active ? "is-active" : ""}`}
      aria-expanded={active}
      onClick={() => onToggle(active ? null : detailKey)}
    >
      <strong>{label}</strong>
      {value ? <span>{value}</span> : null}
    </button>
  );
}

function ProofDetailDialog({
  title,
  body,
  onClose
}: {
  title: string;
  body: string;
  onClose: () => void;
}) {
  return (
    <div className="proof-dialog-backdrop" onClick={onClose}>
      <div
        className="proof-dialog"
        role="dialog"
        aria-modal="false"
        aria-labelledby="proof-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="proof-dialog-close" onClick={onClose} aria-label="Close proof detail">
          <CloseIcon />
        </button>
        <strong id="proof-dialog-title">{title}</strong>
        <p>{body}</p>
      </div>
    </div>
  );
}

function socialIconKey(label: string) {
  const normalized = label.toLowerCase();

  if (normalized === "x") {
    return "linkedin";
  }

  return normalized.replace(/[^a-z0-9]+/g, "-");
}

function SocialIcon({ label }: { label: string }) {
  const key = socialIconKey(label);

  if (key === "roblox") {
    return <RobloxIcon />;
  }

  if (key === "discord") {
    return <DiscordIcon />;
  }

  if (key === "github") {
    return <GithubIcon />;
  }

  if (key === "linkedin") {
    return <LinkedInIcon />;
  }

  return <ArrowUpRightIcon />;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 10.5 8.2 13.7 15 6.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12.4a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.8 20.2c.7-3.7 3.3-5.6 7.2-5.6s6.5 1.9 7.2 5.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3.6 19 6v5.3c0 4.4-2.6 7.5-7 9.1-4.4-1.6-7-4.7-7-9.1V6l7-2.4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m8.7 12.1 2.2 2.1 4.4-4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3.8 7.5h6l1.8 2h8.6v9.2H3.8V7.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M3.8 10.1h16.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m9.4 7.4-4.1 4.4 4.1 4.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m14.6 7.4 4.1 4.4-4.1 4.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m13.1 5.7-2.2 12.6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7.6V12l3.1 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RobloxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M5.2 3.8 20.2 7l-3.1 15-15-3.1 3.1-15Zm5.3 6.5-.8 4 4 .8.8-4-4-.8Z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.7 6.4A15 15 0 0 0 15 5.2l-.4.9a12.9 12.9 0 0 0-5.2 0L9 5.2a15 15 0 0 0-3.7 1.2c-2.3 3.4-2.9 6.7-2.6 10a15 15 0 0 0 4.6 2.3l.9-1.5c-.5-.2-1-.4-1.5-.7l.4-.3c2.9 1.4 6.1 1.4 9 0l.4.3c-.5.3-1 .5-1.5.7l.9 1.5a15 15 0 0 0 4.6-2.3c.4-3.8-.7-7-2.8-10Zm-9.5 7.9c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Zm5.6 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3.2a8.9 8.9 0 0 0-2.8 17.3c.4.1.6-.2.6-.4v-1.7c-2.5.6-3-1.1-3-1.1-.4-1-.9-1.3-.9-1.3-.8-.5.1-.5.1-.5.9.1 1.4.9 1.4.9.8 1.4 2.1 1 2.6.8.1-.6.3-1 .6-1.2-2-.2-4.1-1-4.1-4.4 0-1 .3-1.8.9-2.4-.1-.2-.4-1.2.1-2.4 0 0 .8-.2 2.5.9a8.7 8.7 0 0 1 4.5 0c1.7-1.1 2.5-.9 2.5-.9.5 1.2.2 2.2.1 2.4.6.6.9 1.4.9 2.4 0 3.4-2.1 4.2-4.1 4.4.3.3.6.9.6 1.8v2.7c0 .2.2.5.6.4A8.9 8.9 0 0 0 12 3.2Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.8 8.9h3.1v10H6.8v-10Zm1.6-4.8a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6Zm3.5 4.8h3v1.4h.1c.4-.8 1.5-1.7 3-1.7 3.2 0 3.8 2.1 3.8 4.8v5.5h-3.1V14c0-1.2 0-2.7-1.7-2.7s-1.9 1.3-1.9 2.6v5h-3.1v-10Z" />
    </svg>
  );
}

function GamepadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7.7 9.1h8.6c2.5 0 4.1 1.8 4.4 4.6l.2 1.8c.3 2.4-1.9 3.9-3.7 2.4l-1.6-1.4H8.4l-1.6 1.4c-1.8 1.5-4-.1-3.7-2.4l.2-1.8c.3-2.8 1.9-4.6 4.4-4.6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M7.7 12.7h3.2M9.3 11.1v3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15.7 12.6h.1M18 14.2h.1" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M12.5 5 7.5 10l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M6 14 14 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7 6h7v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5.5 5.5 14.5 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14.5 5.5 5.5 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 15.2c-4.4-2.7-6.5-5-6.5-7.7 0-1.9 1.4-3.3 3.2-3.3 1.2 0 2.4.6 3.3 1.8.9-1.2 2.1-1.8 3.3-1.8 1.8 0 3.2 1.4 3.2 3.3 0 2.7-2.1 5-6.5 7.7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="m10 2 1.9 5.4L17 9l-5.1 1.6L10 16l-1.9-5.4L3 9l5.1-1.6L10 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path d="m5.5 7.5 4.5 4.8 4.5-4.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HandRaisedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11M12 11V4.5a1.5 1.5 0 0 1 3 0V11M15 11V6a1.5 1.5 0 0 1 3 0v8c0 3.5-2.5 6-6 6h-1c-2.4 0-3.7-1.2-5-3l-2.7-4.2c-.5-.8-.2-1.8.7-2.2.7-.4 1.6-.2 2 .5L9 14V7a1.5 1.5 0 0 1 3 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatReadIcon() {
  return (
    <svg viewBox="0 0 16 12" fill="none" aria-hidden="true">
      <path d="M1 6.5 4.2 9.5 10 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6.5 9.2 9.5 15 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16.5 6.5 8.7 14.3a2.5 2.5 0 0 0 3.5 3.5l8.5-8.5a4 4 0 0 0-5.7-5.7l-9 9a5.5 5.5 0 0 0 7.8 7.8L21 13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmojiIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.5 14.5c.8 1.2 2 2 3.5 2s2.7-.8 3.5-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12 19 5l-3 14-4-6-7-1Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.18"
      />
    </svg>
  );
}
