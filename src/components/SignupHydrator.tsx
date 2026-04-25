"use client";

import { useEffect } from "react";

type SignupHydratorProps = {
  bodyHtml: string;
  styles: string;
};

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
    // Ignore storage issues and keep the flow moving.
  }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

export default function SignupHydrator({ bodyHtml, styles }: SignupHydratorProps) {
  useEffect(() => {
    const previousPage = document.body.dataset.page;
    document.body.dataset.page = "signup";

    const params = new URLSearchParams(window.location.search);
    const waitlistEndpoint = "/api/waitlist";
    const listeners: Array<() => void> = [];

    const setStatus = (
      element: Element | null,
      message: string,
      state: "" | "success" | "error"
    ) => {
      if (!(element instanceof HTMLElement)) {
        return;
      }

      element.textContent = message || "";

      if (state) {
        element.setAttribute("data-state", state);
      } else {
        element.removeAttribute("data-state");
      }
    };

    const getSelectedValues = (containerId: string) =>
      Array.from(document.querySelectorAll(`#${containerId} .chip.selected`)).map(
        (chip) => chip.getAttribute("data-value") || ""
      );

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
          String(data.message || "Could not save your details right now. Please try again.")
        );
      }

      return data;
    };

    const trackWaitlistEvent = (eventName: string, extra?: Record<string, unknown>) => {
      const payload = Object.assign(
        {
          stage: "event",
          eventName,
          email: readStored("weld_waitlist_email"),
          type: readStored("weld_waitlist_type") || "developer",
          refCode: readStored("weld_ref_code"),
          referredBy: readStored("weld_referrer") || params.get("ref") || ""
        },
        extra || {}
      );

      return fetch(waitlistEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => null);
    };

    const email = (params.get("email") || readStored("weld_waitlist_email") || "")
      .trim()
      .toLowerCase();
    const type = params.get("type") || readStored("weld_waitlist_type") || "developer";
    const refCode = params.get("refCode") || readStored("weld_ref_code") || "";
    const referredBy = params.get("ref") || readStored("weld_referrer") || "";
    const shareOrigin = window.location.origin.replace(/\/$/, "");
    const shareLink = refCode
      ? `${shareOrigin}/?ref=${encodeURIComponent(refCode)}`
      : `${shareOrigin}/`;

    if (email) {
      writeStored("weld_waitlist_email", email);
    }
    if (type) {
      writeStored("weld_waitlist_type", type);
    }
    if (refCode) {
      writeStored("weld_ref_code", refCode);
    }
    if (referredBy) {
      writeStored("weld_referrer", referredBy);
    }

    const isStudio = type === "studio";
    const avatarEl = document.getElementById("identity-avatar");
    const eyebrowEl = document.getElementById("top-eyebrow");
    const topSubcopyEl = document.getElementById("top-subcopy");
    const identityTitleEl = document.getElementById("identity-title");
    const identityEmailEl = document.getElementById("identity-email");
    const statusPillEl = document.getElementById("status-pill");
    const profileTitleEl = document.getElementById("profile-title");
    const profileSubcopyEl = document.getElementById("profile-subcopy");
    const profilePillEl = document.getElementById("profile-pill");
    const shareLinkEl = document.getElementById("share-link");
    const shareMessageEl = document.getElementById("share-message");
    const developerFieldsEl = document.getElementById("developer-fields");
    const studioFieldsEl = document.getElementById("studio-fields");

    if (avatarEl) {
      avatarEl.textContent = isStudio ? "ST" : "DV";
    }
    if (eyebrowEl) {
      eyebrowEl.textContent = isStudio
        ? "Studio waitlist saved"
        : "Developer waitlist saved";
    }
    if (identityTitleEl) {
      identityTitleEl.textContent = isStudio
        ? "Studio early access"
        : "Developer early access";
    }
    if (identityEmailEl) {
      identityEmailEl.textContent = email ? `Email: ${email}` : "Email: not available yet";
    }
    if (statusPillEl) {
      statusPillEl.textContent = isStudio ? "Studio lead confirmed" : "Waitlist confirmed";
    }
    if (profileTitleEl) {
      profileTitleEl.textContent = isStudio
        ? "Add a few studio details."
        : "Add a few developer details.";
    }
    if (profileSubcopyEl) {
      profileSubcopyEl.textContent = isStudio
        ? "You are already on the list. Tell us what kind of creators you hire so we can make your studio onboarding sharper."
        : "You are already on the list. Add a few profile details if you want better matching when the first beta wave opens.";
    }
    if (profilePillEl) {
      profilePillEl.textContent = isStudio
        ? "Optional studio context"
        : "Optional creator context";
    }
    if (topSubcopyEl) {
      topSubcopyEl.textContent = isStudio
        ? "Your studio spot is saved. Share the link if you know other serious Roblox teams, then leave a little hiring context below so we understand your studio's needs."
        : "Your spot is saved. Share your personal link with other qualified Roblox creators to boost your place in line, then add a few profile details so we can match you better when beta opens.";
    }
    if (developerFieldsEl instanceof HTMLElement) {
      developerFieldsEl.hidden = isStudio;
    }
    if (studioFieldsEl instanceof HTMLElement) {
      studioFieldsEl.hidden = !isStudio;
    }
    if (shareLinkEl instanceof HTMLInputElement) {
      shareLinkEl.value = shareLink;
    }
    if (shareMessageEl instanceof HTMLInputElement) {
      shareMessageEl.value = isStudio
        ? `We just joined the weld studio waitlist. If your Roblox team wants earlier access to verified creator profiles, claim your spot here: ${shareLink}`
        : `I just joined the weld waitlist for Roblox creators. If you ship real work and want better-fit studio intros, grab your spot here: ${shareLink}`;
    }

    const bindChipSelection = (containerId: string) => {
      document.querySelectorAll<HTMLElement>(`#${containerId} .chip`).forEach((chip) => {
        const handler = () => chip.classList.toggle("selected");
        chip.addEventListener("click", handler);
        listeners.push(() => chip.removeEventListener("click", handler));
      });
    };

    bindChipSelection("developer-skills");
    bindChipSelection("studio-roles");

    const copyLinkButton = document.getElementById("copy-link-btn");
    if (copyLinkButton instanceof HTMLButtonElement) {
      const handler = async () => {
        const status = document.getElementById("share-status");

        try {
          await navigator.clipboard.writeText(
            (shareLinkEl as HTMLInputElement | null)?.value || shareLink
          );
          setStatus(
            status,
            "Invite link copied. Share it wherever Roblox creators already pay attention.",
            "success"
          );
          void trackWaitlistEvent("share_link_copied", {
            source: "invite_link",
            type,
            email,
            refCode
          });
        } catch {
          (shareLinkEl as HTMLInputElement | null)?.select();
          document.execCommand("copy");
          setStatus(status, "Invite link copied.", "success");
          void trackWaitlistEvent("share_link_copied", {
            source: "invite_link_fallback",
            type,
            email,
            refCode
          });
        }
      };

      copyLinkButton.addEventListener("click", handler);
      listeners.push(() => copyLinkButton.removeEventListener("click", handler));
    }

    const copyMessageButton = document.getElementById("copy-message-btn");
    if (copyMessageButton instanceof HTMLButtonElement) {
      const handler = async () => {
        const status = document.getElementById("share-status");

        try {
          await navigator.clipboard.writeText(
            (shareMessageEl as HTMLInputElement | null)?.value || ""
          );
          setStatus(
            status,
            "Share message copied. Send it to creators who are a real fit for the platform.",
            "success"
          );
          void trackWaitlistEvent("share_link_copied", {
            source: "share_message",
            type,
            email,
            refCode
          });
        } catch {
          (shareMessageEl as HTMLInputElement | null)?.select();
          document.execCommand("copy");
          setStatus(status, "Share message copied.", "success");
          void trackWaitlistEvent("share_link_copied", {
            source: "share_message_fallback",
            type,
            email,
            refCode
          });
        }
      };

      copyMessageButton.addEventListener("click", handler);
      listeners.push(() => copyMessageButton.removeEventListener("click", handler));
    }

    const profileForm = document.getElementById("profile-form");
    if (profileForm instanceof HTMLFormElement) {
      const handler = async (event: Event) => {
        event.preventDefault();

        const saveButton = document.getElementById("save-profile-btn");
        const status = document.getElementById("profile-status");
        const defaultLabel = "Save optional details";

        if (!isValidEmail(email)) {
          setStatus(
            status,
            "We could not find a valid waitlist email. Go back through the landing page and join again.",
            "error"
          );
          return;
        }

        if (saveButton instanceof HTMLButtonElement) {
          saveButton.disabled = true;
          saveButton.textContent = "Saving details...";
        }

        setStatus(status, "", "");

        const payload: Record<string, unknown> = {
          stage: "profile",
          email,
          type,
          refCode,
          referredBy
        };

        if (isStudio) {
          payload.studioName =
            (document.getElementById("studio-name") as HTMLInputElement | null)?.value.trim() ||
            "";
          payload.teamSize =
            (document.getElementById("team-size") as HTMLSelectElement | null)?.value || "";
          payload.hiringRoles = getSelectedValues("studio-roles");
          payload.budgetStyle =
            (document.getElementById("budget-style") as HTMLSelectElement | null)?.value || "";
          payload.projectNote =
            (document.getElementById("project-note") as HTMLTextAreaElement | null)?.value.trim() ||
            "";
        } else {
          payload.displayName =
            (document.getElementById("display-name") as HTMLInputElement | null)?.value.trim() ||
            "";
          payload.experience =
            (document.getElementById("experience") as HTMLSelectElement | null)?.value || "";
          payload.skills = getSelectedValues("developer-skills");
          payload.portfolioLink =
            (document.getElementById("portfolio-link") as HTMLInputElement | null)?.value.trim() ||
            "";
          payload.rateModel =
            (document.getElementById("rate-model") as HTMLSelectElement | null)?.value || "";
          payload.availability =
            (document.getElementById("availability") as HTMLTextAreaElement | null)?.value.trim() ||
            "";
        }

        try {
          await postWaitlist(payload);
          await trackWaitlistEvent("profile_completed", {
            email,
            type,
            refCode
          });
          setStatus(
            status,
            "Saved. These details will help us shape better matches when access starts rolling out.",
            "success"
          );
        } catch (error) {
          setStatus(
            status,
            error instanceof Error
              ? error.message
              : "Could not save your details right now. Please try again.",
            "error"
          );
        } finally {
          if (saveButton instanceof HTMLButtonElement) {
            saveButton.disabled = false;
            saveButton.textContent = defaultLabel;
          }
        }
      };

      profileForm.addEventListener("submit", handler);
      listeners.push(() => profileForm.removeEventListener("submit", handler));
    }

    return () => {
      listeners.forEach((dispose) => dispose());

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
