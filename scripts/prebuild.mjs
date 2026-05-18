import fs from "node:fs";

const shouldClean =
  process.env.FORCE_NEXT_CLEAN === "1" ||
  process.env.CI === "true" ||
  process.env.VERCEL === "1";

if (shouldClean) {
  fs.rmSync(".next", { recursive: true, force: true });
  console.warn(
    "[weld] prebuild: removed .next (CI, Vercel, or FORCE_NEXT_CLEAN=1)."
  );
} else {
  console.warn(
    "[weld] prebuild: keeping existing .next (local). This avoids breaking a running next dev (missing CSS / ChunkLoadError). For a pristine prod build locally, run: npm run build:clean"
  );
}
