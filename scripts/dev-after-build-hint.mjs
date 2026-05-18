// `npm run build` runs `prebuild`, which deletes `.next`. If `next dev` was already
// running (or you start dev without restarting after a build), the browser can keep
// old chunk URLs → ChunkLoadError (e.g. app/studios/page.js) and missing CSS.
// Fix: stop dev, then `npm run dev:clean` (or delete `.next` and run `npm run dev`).
console.warn(
  "\n[weld] Production build finished and `.next` was recreated. If `next dev` is still running from before this build, stop it and run `npm run dev:clean`. Otherwise you may see ChunkLoadError on routes like /studios or missing styles.\n"
);
