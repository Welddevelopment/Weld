import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateCompletionPercent,
  buildInviteCode,
  getRewardTier
} from "../src/dynamic-landing-page/lib/utils";

test("buildInviteCode is deterministic and uppercase", () => {
  const first = buildInviteCode("Creator@Example.com");
  const second = buildInviteCode("creator@example.com");

  assert.equal(first, second);
  assert.match(first, /^WLD[A-F0-9]{6}$/);
});

test("getRewardTier follows configured thresholds", () => {
  assert.equal(getRewardTier(0).slug, "invite-active");
  assert.equal(getRewardTier(1).slug, "scout-signal");
  assert.equal(getRewardTier(3).slug, "studio-scout");
  assert.equal(getRewardTier(6).slug, "founder-lane");
});

test("calculateCompletionPercent tracks developer required fields", () => {
  const percent = calculateCompletionPercent("developer", {
    identity: {
      displayName: "Xarion",
      primaryRole: "Scripter"
    },
    proof: {
      proofLink: "https://example.com/proof"
    },
    fit: {
      availability: "20h_wk",
      rateStyle: "hourly"
    }
  });

  assert.equal(percent, 100);
});

test("calculateCompletionPercent tracks studio required fields", () => {
  const percent = calculateCompletionPercent("studio", {
    identity: {
      studioName: "Loop Forge"
    },
    proof: {
      rolesHiring: ["Scripter", "Animator"],
      teamSize: "4-8"
    },
    fit: {
      budgetStyle: "milestone",
      shippingNote: "PvP update in 6 weeks"
    }
  });

  assert.equal(percent, 100);
});
