// Local `npm run build` keeps `.next` unless CI/Vercel/FORCE_NEXT_CLEAN so a running
// `next dev` does not suddenly lose CSS/JS chunks. If styles still break, stop dev
// and run `npm run dev:clean`, or use `npm run build:clean` before `next start`.
console.warn(
  "\n[weld] Build finished. If `next dev` still shows missing CSS or ChunkLoadError, stop it and run `npm run dev:clean`.\n"
);
