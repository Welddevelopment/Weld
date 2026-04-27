import assert from "node:assert/strict";
import test from "node:test";

import {
  buildSearchString,
  getSourceVariantFromRaw,
  getSourceVariantFromSearchParams
} from "../src/dynamic landing page/lib/source-variant";

test("getSourceVariantFromRaw maps known sources", () => {
  assert.equal(getSourceVariantFromRaw("discord"), "discord");
  assert.equal(getSourceVariantFromRaw("twitter"), "x");
  assert.equal(getSourceVariantFromRaw("linkedin_ads"), "linkedin");
  assert.equal(getSourceVariantFromRaw("newsletter"), "default");
});

test("getSourceVariantFromSearchParams prefers utm_source", () => {
  assert.equal(
    getSourceVariantFromSearchParams({
      utm_source: "discord",
      src: "linkedin"
    }),
    "discord"
  );
});

test("buildSearchString omits requested keys and preserves arrays", () => {
  const search = buildSearchString(
    {
      type: "studio",
      utm_source: "discord",
      tag: ["one", "two"]
    },
    ["type"]
  );

  assert.equal(search, "utm_source=discord&tag=one&tag=two");
});
