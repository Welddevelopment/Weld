import assert from "node:assert/strict";
import test from "node:test";

import {
  INITIAL_WELD_PAGE_STATE,
  weldReducer,
  type WeldOutputLog
} from "../src/dynamic-landing-page/lib/WeldPageState";

function log(text: string, tone: WeldOutputLog["tone"] = "neutral"): WeldOutputLog {
  return {
    id: text,
    text,
    tone
  };
}

test("role selection updates shared state and output log", () => {
  const state = weldReducer(INITIAL_WELD_PAGE_STATE, {
    type: "ROLE_SELECTED",
    role: "builder"
  });

  assert.equal(state.selectedRole, "builder");
  assert.equal(state.activeScriptTab, "profile");
  assert.match(state.dynamicLogs.at(-1)?.text ?? "", /ROLE_CHANGED/);
});

test("required landing interactions append output events", () => {
  const events = [
    "AUDIENCE_CONTEXT -> developer",
    "EMAIL_VALIDATE -> READY",
    "SPARK_FORMED -> studio match recorded",
    "PROFILE_SKIPPED -> next candidate queued",
    "PROOF_METRIC_FOCUSED -> visits"
  ];

  const state = events.reduce(
    (current, event) =>
      weldReducer(current, {
        type: "LOG_APPENDED",
        log: log(event, event.includes("SKIPPED") ? "warning" : "active")
      }),
    INITIAL_WELD_PAGE_STATE
  );

  assert.deepEqual(
    state.dynamicLogs.map((entry) => entry.text),
    events
  );
});

