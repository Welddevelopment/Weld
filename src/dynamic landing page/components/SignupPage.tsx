"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type AudienceType = "developer" | "studio";

const DEV_SKILLS = [
  "Lua / Luau", "UI/UX Design", "Systems Design", "Scripting", "Builder",
  "Animator", "GFX Artist", "Sound Design", "Game Design", "VFX"
];

const STUDIO_ROLES = [
  "Scripter", "Builder", "UI/UX Designer", "Animator", "GFX Artist",
  "Systems Dev", "Sound Designer", "Game Designer", "VFX Artist", "Producer"
];

interface FormPayload {
  stage: string;
  email: string;
  type: AudienceType;
  skipped?: boolean;
  displayName?: string;
  experience?: string;
  skills?: string[];
  portfolioLink?: string;
  studioName?: string;
  teamSize?: string;
  hiringRoles?: string[];
  budgetStyle?: string;
  projectNote?: string;
}

async function postWaitlist(payload: FormPayload) {
  const res = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  let data: { ok?: boolean; message?: string } = {};
  try { data = await res.json(); } catch {}
  if (!res.ok || !data.ok) {
    throw new Error(data.message ?? "Could not save your details right now. Please try again.");
  }
  return data;
}

export default function SignupPage() {
  const [type, setType] = useState<AudienceType>("developer");
  const [email, setEmail] = useState("");
  const [ready, setReady] = useState(false);

  // Developer fields
  const [devName, setDevName] = useState("");
  const [devExp, setDevExp] = useState("");
  const [devSkills, setDevSkills] = useState<string[]>([]);
  const [devPortfolio, setDevPortfolio] = useState("");

  // Studio fields
  const [studioName, setStudioName] = useState("");
  const [studioSize, setStudioSize] = useState("");
  const [studioRoles, setStudioRoles] = useState<string[]>([]);
  const [studioBudget, setStudioBudget] = useState("");
  const [studioDesc, setStudioDesc] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("type") === "studio" ? "studio" : "developer";
    const e = params.get("email") ?? "";
    setType(t);
    setEmail(e);
    setReady(true);
  }, []);

  function toggleSkill(skill: string, list: string[], setList: (v: string[]) => void) {
    if (list.includes(skill)) {
      setList(list.filter((s) => s !== skill));
    } else {
      setList([...list, skill]);
    }
  }

  async function handleSkip() {
    setIsSubmitting(true);
    try {
      await postWaitlist({ stage: "profile", email, type, skipped: true });
    } catch {}
    setSuccess(true);
    setIsSubmitting(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (type === "developer") {
      if (!devName.trim() || !devExp || devSkills.length === 0) {
        setErrorMsg("Please complete all required fields.");
        return;
      }
    } else {
      if (!studioName.trim() || !studioSize || studioRoles.length === 0 || !studioBudget) {
        setErrorMsg("Please complete all required fields.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload: FormPayload = { stage: "profile", email, type };
      if (type === "developer") {
        payload.displayName = devName.trim();
        payload.experience = devExp;
        payload.skills = devSkills;
        payload.portfolioLink = devPortfolio.trim();
      } else {
        payload.studioName = studioName.trim();
        payload.teamSize = studioSize;
        payload.hiringRoles = studioRoles;
        payload.budgetStyle = studioBudget;
        payload.projectNote = studioDesc.trim();
      }
      await postWaitlist(payload);
      setSuccess(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
    setIsSubmitting(false);
  }

  if (!ready) return null;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,247,241,.05)",
    border: "1.5px solid rgba(255,247,241,.10)",
    borderRadius: 12,
    padding: "13px 16px",
    fontFamily: "var(--font-body)",
    fontSize: 14,
    color: "#FFF7F1",
    outline: "none",
    transition: "border-color .2s, box-shadow .2s"
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: ".12em",
    textTransform: "uppercase",
    color: "rgba(255,247,241,.45)",
    display: "block",
    marginBottom: 8
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: "pointer",
    appearance: "none",
    WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,247,241,.38)' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#090807",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Atmospheric glows */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          width: 600,
          height: 600,
          borderRadius: "50%",
          top: -200,
          left: "50%",
          transform: "translateX(-50%)",
          background: "radial-gradient(circle, rgba(234,90,53,.12) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      {/* Nav */}
      <nav
        style={{
          position: "relative",
          zIndex: 10,
          padding: "20px 44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,247,241,.06)"
        }}
      >
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 20,
            color: "#FFF7F1",
            letterSpacing: "-.02em",
            textDecoration: "none"
          }}
        >
          <Image
            src="/Assets/weld-logo-official.svg"
            alt="weld logo"
            width={20}
            height={20}
            style={{ objectFit: "contain" }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/Assets/weld-logo-official.jpg"; }}
          />
          weld<span style={{ color: "#EA5A35" }}>.</span>
        </a>
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "rgba(255,247,241,.38)",
            textDecoration: "none",
            transition: "color .2s"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,247,241,.72)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,247,241,.38)"; }}
        >
          ← Back
        </a>
      </nav>

      {/* Main content */}
      <main
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
          padding: "60px 24px 80px"
        }}
      >
        <div style={{ width: "100%", maxWidth: 520 }}>
          {success ? (
            /* Success view */
            <div
              style={{
                background: "rgba(255,247,241,.03)",
                border: "1px solid rgba(255,247,241,.08)",
                borderRadius: 24,
                padding: "56px 48px",
                textAlign: "center"
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "rgba(6,214,160,.12)",
                  border: "1px solid rgba(6,214,160,.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  fontSize: 24
                }}
              >
                ✓
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "clamp(28px, 4vw, 40px)",
                  fontWeight: 400,
                  color: "#FFF7F1",
                  letterSpacing: "-.035em",
                  lineHeight: 1.05,
                  marginBottom: 14
                }}
              >
                You&apos;re on the list.
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: "rgba(255,247,241,.52)",
                  marginBottom: 32
                }}
              >
                We&apos;ll reach out when weld. is ready for early access. Keep an eye on your inbox.
              </p>
              <a
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: "#FFF7F1",
                  background: "#EA5A35",
                  padding: "12px 24px",
                  borderRadius: 100,
                  textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(234,90,53,.35)"
                }}
              >
                Back to weld.
              </a>
            </div>
          ) : (
            /* Form view */
            <div
              style={{
                background: "rgba(255,247,241,.03)",
                border: "1px solid rgba(255,247,241,.08)",
                borderRadius: 24,
                overflow: "hidden"
              }}
            >
              {/* Card header */}
              <div
                style={{
                  padding: "32px 40px 28px",
                  borderBottom: "1px solid rgba(255,247,241,.06)"
                }}
              >
                {/* Badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    background: "rgba(234,90,53,.10)",
                    border: "1px solid rgba(234,90,53,.20)",
                    borderRadius: 100,
                    padding: "4px 12px",
                    marginBottom: 20
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#EA5A35",
                      display: "inline-block",
                      animation: "dot-pulse 2s ease-in-out infinite"
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: ".14em",
                      textTransform: "uppercase",
                      color: "#EA5A35"
                    }}
                  >
                    {type === "developer" ? "Developer" : "Studio"} early access
                  </span>
                </div>

                <h1
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: "clamp(26px, 3.5vw, 36px)",
                    fontWeight: 400,
                    color: "#FFF7F1",
                    letterSpacing: "-.035em",
                    lineHeight: 1.05,
                    marginBottom: 10
                  }}
                >
                  Almost there!
                </h1>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    lineHeight: 1.72,
                    color: "rgba(255,247,241,.48)"
                  }}
                >
                  {type === "developer"
                    ? "A few details to make your profile stand out when studios are browsing."
                    : "Tell us about your studio so we can match you with the right developers."}
                </p>

                {/* Email display */}
                {email && (
                  <div
                    style={{
                      marginTop: 16,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: "rgba(255,247,241,.04)",
                      border: "1px solid rgba(255,247,241,.08)",
                      borderRadius: 8,
                      padding: "6px 12px"
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,247,241,.40)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "rgba(255,247,241,.45)",
                        letterSpacing: ".03em"
                      }}
                    >
                      {email}
                    </span>
                  </div>
                )}
              </div>

              {/* Form body */}
              <form onSubmit={handleSubmit} noValidate style={{ padding: "32px 40px 36px" }}>
                {type === "developer" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Display name */}
                    <div>
                      <label style={labelStyle}>
                        Display name <span style={{ color: "#EA5A35" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={devName}
                        onChange={(e) => setDevName(e.target.value)}
                        placeholder="Your Roblox username or alias"
                        style={inputStyle}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(234,90,53,.45)";
                          e.target.style.boxShadow = "0 0 0 3px rgba(234,90,53,.08)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(255,247,241,.10)";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>

                    {/* Years of experience */}
                    <div>
                      <label style={labelStyle}>
                        Years of experience <span style={{ color: "#EA5A35" }}>*</span>
                      </label>
                      <select
                        value={devExp}
                        onChange={(e) => setDevExp(e.target.value)}
                        style={selectStyle}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(234,90,53,.45)";
                          e.target.style.boxShadow = "0 0 0 3px rgba(234,90,53,.08)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(255,247,241,.10)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        <option value="" disabled>Select experience level</option>
                        <option value="less-than-1">Less than 1 year</option>
                        <option value="1-2">1–2 years</option>
                        <option value="3-5">3–5 years</option>
                        <option value="5+">5+ years</option>
                      </select>
                    </div>

                    {/* Skills */}
                    <div>
                      <label style={labelStyle}>
                        Your skills <span style={{ color: "#EA5A35" }}>*</span>
                      </label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {DEV_SKILLS.map((skill) => {
                          const selected = devSkills.includes(skill);
                          return (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => toggleSkill(skill, devSkills, setDevSkills)}
                              style={{
                                padding: "7px 14px",
                                borderRadius: 8,
                                border: selected ? "1.5px solid rgba(234,90,53,.50)" : "1.5px solid rgba(255,247,241,.10)",
                                background: selected ? "rgba(234,90,53,.12)" : "rgba(255,247,241,.03)",
                                fontFamily: "var(--font-mono)",
                                fontSize: 10,
                                fontWeight: 700,
                                letterSpacing: ".08em",
                                textTransform: "uppercase",
                                color: selected ? "#EA5A35" : "rgba(255,247,241,.42)",
                                cursor: "pointer",
                                transition: "all .2s"
                              }}
                            >
                              {skill}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Portfolio link */}
                    <div>
                      <label style={labelStyle}>
                        Portfolio link <span style={{ color: "rgba(255,247,241,.28)" }}>(optional)</span>
                      </label>
                      <input
                        type="url"
                        value={devPortfolio}
                        onChange={(e) => setDevPortfolio(e.target.value)}
                        placeholder="https://your-portfolio.com"
                        style={inputStyle}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(234,90,53,.45)";
                          e.target.style.boxShadow = "0 0 0 3px rgba(234,90,53,.08)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(255,247,241,.10)";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Studio name */}
                    <div>
                      <label style={labelStyle}>
                        Studio name <span style={{ color: "#EA5A35" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={studioName}
                        onChange={(e) => setStudioName(e.target.value)}
                        placeholder="Your studio or team name"
                        style={inputStyle}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(234,90,53,.45)";
                          e.target.style.boxShadow = "0 0 0 3px rgba(234,90,53,.08)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(255,247,241,.10)";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>

                    {/* Team size */}
                    <div>
                      <label style={labelStyle}>
                        Team size <span style={{ color: "#EA5A35" }}>*</span>
                      </label>
                      <select
                        value={studioSize}
                        onChange={(e) => setStudioSize(e.target.value)}
                        style={selectStyle}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(234,90,53,.45)";
                          e.target.style.boxShadow = "0 0 0 3px rgba(234,90,53,.08)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(255,247,241,.10)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        <option value="" disabled>Select team size</option>
                        <option value="solo">Just me</option>
                        <option value="2-5">2–5 people</option>
                        <option value="6-15">6–15 people</option>
                        <option value="15+">15+ people</option>
                      </select>
                    </div>

                    {/* Roles hiring */}
                    <div>
                      <label style={labelStyle}>
                        Roles you&apos;re hiring <span style={{ color: "#EA5A35" }}>*</span>
                      </label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {STUDIO_ROLES.map((role) => {
                          const selected = studioRoles.includes(role);
                          return (
                            <button
                              key={role}
                              type="button"
                              onClick={() => toggleSkill(role, studioRoles, setStudioRoles)}
                              style={{
                                padding: "7px 14px",
                                borderRadius: 8,
                                border: selected ? "1.5px solid rgba(234,90,53,.50)" : "1.5px solid rgba(255,247,241,.10)",
                                background: selected ? "rgba(234,90,53,.12)" : "rgba(255,247,241,.03)",
                                fontFamily: "var(--font-mono)",
                                fontSize: 10,
                                fontWeight: 700,
                                letterSpacing: ".08em",
                                textTransform: "uppercase",
                                color: selected ? "#EA5A35" : "rgba(255,247,241,.42)",
                                cursor: "pointer",
                                transition: "all .2s"
                              }}
                            >
                              {role}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Budget type */}
                    <div>
                      <label style={labelStyle}>
                        Budget type <span style={{ color: "#EA5A35" }}>*</span>
                      </label>
                      <select
                        value={studioBudget}
                        onChange={(e) => setStudioBudget(e.target.value)}
                        style={selectStyle}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(234,90,53,.45)";
                          e.target.style.boxShadow = "0 0 0 3px rgba(234,90,53,.08)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(255,247,241,.10)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        <option value="" disabled>Select budget style</option>
                        <option value="hourly">Hourly rate</option>
                        <option value="project">Per project</option>
                        <option value="revenue-share">Revenue share</option>
                        <option value="mix">Mix of the above</option>
                      </select>
                    </div>

                    {/* Project description */}
                    <div>
                      <label style={labelStyle}>
                        Project description <span style={{ color: "rgba(255,247,241,.28)" }}>(optional)</span>
                      </label>
                      <textarea
                        value={studioDesc}
                        onChange={(e) => setStudioDesc(e.target.value)}
                        placeholder="What are you building? What kind of developer are you looking for?"
                        rows={3}
                        style={{
                          ...inputStyle,
                          resize: "vertical",
                          minHeight: 88
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(234,90,53,.45)";
                          e.target.style.boxShadow = "0 0 0 3px rgba(234,90,53,.08)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(255,247,241,.10)";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Error message */}
                {errorMsg && (
                  <p
                    role="alert"
                    style={{
                      marginTop: 16,
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "#FF7A4D",
                      lineHeight: 1.5
                    }}
                  >
                    {errorMsg}
                  </p>
                )}

                {/* Buttons */}
                <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      flex: 1,
                      padding: "14px",
                      background: "#EA5A35",
                      border: "none",
                      borderRadius: 12,
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: ".12em",
                      textTransform: "uppercase",
                      color: "#FFF7F1",
                      cursor: isSubmitting ? "default" : "pointer",
                      opacity: isSubmitting ? 0.72 : 1,
                      boxShadow: "0 4px 16px rgba(234,90,53,.35)",
                      transition: "background .2s, transform .2s, box-shadow .2s"
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.background = "#FF7A4D";
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(234,90,53,.45)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#EA5A35";
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(234,90,53,.35)";
                    }}
                  >
                    {isSubmitting ? "Submitting..." : "Complete Signup"}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSkip}
                    style={{
                      padding: "14px 20px",
                      background: "rgba(255,247,241,.04)",
                      border: "1.5px solid rgba(255,247,241,.10)",
                      borderRadius: 12,
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: ".12em",
                      textTransform: "uppercase",
                      color: "rgba(255,247,241,.38)",
                      cursor: isSubmitting ? "default" : "pointer",
                      opacity: isSubmitting ? 0.6 : 1,
                      transition: "background .2s, color .2s"
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.background = "rgba(255,247,241,.07)";
                        e.currentTarget.style.color = "rgba(255,247,241,.65)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,247,241,.04)";
                      e.currentTarget.style.color = "rgba(255,247,241,.38)";
                    }}
                  >
                    Skip
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
