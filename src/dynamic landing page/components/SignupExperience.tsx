import LegacyPageHydrator from "@/components/LegacyPageHydrator";
import { loadLegacyPage } from "@/lib/legacy-page";

export default async function SignupExperience() {
  const { bodyHtml, styles, scripts } = await loadLegacyPage("Signup.html", "signup");

  return (
    <LegacyPageHydrator
      bodyHtml={bodyHtml}
      styles={styles}
      scripts={[...scripts, { type: "inline", content: signupOverrides }]}
      page="signup"
    />
  );
}

const signupOverrides = `
(function () {
  const waitlistEndpoint = '/api/waitlist';

  function getContext() {
    const params = new URLSearchParams(window.location.search);
    return {
      email: (params.get('email') || '').trim().toLowerCase(),
      type: params.get('type') === 'studio' ? 'studio' : 'developer'
    };
  }

  async function postWaitlist(payload) {
    const response = await fetch(waitlistEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    let data = {};

    try {
      data = await response.json();
    } catch {}

    if (!response.ok || !data.ok) {
      throw new Error(data.message || 'Could not save your details right now. Please try again.');
    }

    return data;
  }

  function showSuccess() {
    const formView = document.getElementById('form-view');
    const successView = document.getElementById('success-view');

    if (formView) formView.style.display = 'none';
    if (successView) successView.style.display = 'block';
  }

  function selectedSkills(containerId) {
    return Array.from(document.querySelectorAll('#' + containerId + ' .skill-tag.selected'))
      .map(function (node) { return node.dataset.skill || ''; })
      .filter(Boolean);
  }

  window.handleSkip = async function handleSkip() {
    const context = getContext();
    const button = document.getElementById('btn-skip');

    if (button) {
      button.disabled = true;
      button.textContent = 'Saving...';
    }

    try {
      await postWaitlist({
        stage: 'profile',
        email: context.email,
        type: context.type,
        skipped: true
      });
    } catch {}

    showSuccess();
  };

  window.handleSignup = async function handleSignup(event) {
    if (event) event.preventDefault();

    const context = getContext();
    const message = document.getElementById('form-msg');
    const button = document.getElementById('btn-submit');

    if (message) {
      message.textContent = '';
      message.className = 'form-msg';
    }

    if (button) {
      button.disabled = true;
      button.textContent = 'Submitting...';
    }

    const payload = {
      stage: 'profile',
      email: context.email,
      type: context.type
    };

    try {
      if (context.type === 'studio') {
        const studioName = (document.getElementById('studio-name') || {}).value?.trim() || '';
        const teamSize = (document.getElementById('studio-size') || {}).value || '';
        const hiringRoles = selectedSkills('studio-roles');
        const budgetStyle = (document.getElementById('studio-budget') || {}).value || '';
        const projectNote = (document.getElementById('studio-desc') || {}).value?.trim() || '';

        if (!studioName || !teamSize || !hiringRoles.length || !budgetStyle) {
          throw new Error('Please complete the required studio fields.');
        }

        payload.studioName = studioName;
        payload.teamSize = teamSize;
        payload.hiringRoles = hiringRoles;
        payload.budgetStyle = budgetStyle;
        payload.projectNote = projectNote;
      } else {
        const displayName = (document.getElementById('dev-name') || {}).value?.trim() || '';
        const experience = (document.getElementById('dev-exp') || {}).value || '';
        const skills = selectedSkills('dev-skills');
        const portfolioLink = (document.getElementById('dev-portfolio') || {}).value?.trim() || '';

        if (!displayName || !experience || !skills.length) {
          throw new Error('Please complete the required developer fields.');
        }

        payload.displayName = displayName;
        payload.experience = experience;
        payload.skills = skills;
        payload.portfolioLink = portfolioLink;
      }

      await postWaitlist(payload);
      showSuccess();
    } catch (error) {
      if (message) {
        message.textContent = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      }

      if (button) {
        button.disabled = false;
        button.textContent = 'Complete Signup';
      }
    }

    return false;
  };
})();
`;
