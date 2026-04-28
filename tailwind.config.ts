import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      colors: {
        /* Stage 1 — background depth stack */
        bg:           "var(--bg)",
        bg2:          "var(--bg2)",
        "bg-surface": "var(--bg-surface)",
        "bg-hover":   "var(--bg-hover)",
        /* Stage 1 — primary interactive */
        "studio-blue":      "var(--studio-blue)",
        "studio-blue-dark": "var(--studio-blue-dark)",
        /* Stage 1 — LuaU syntax / UI semantic palette */
        "luau-keyword":  "var(--luau-keyword)",
        "luau-string":   "var(--luau-string)",
        "luau-function": "var(--luau-function)",
        "luau-type":     "var(--luau-type)",
        "luau-variable": "var(--luau-variable)",
        "luau-comment":  "var(--luau-comment)",
        "luau-number":   "var(--luau-number)",
        /* Stage 1 — brand accent + UI chrome */
        "orange-hot":    "var(--orange-hot)",
        "window-yellow": "var(--window-yellow)",
        cream:           "var(--cream)",
        "terminal-dark": "var(--terminal-dark)",
        /* Stage 1 — semantic state tokens */
        "state-booting":  "var(--state-booting)",
        "state-selected": "var(--state-selected)",
        "state-focused":  "var(--state-focused)",
        "state-verified": "var(--state-verified)",
        "state-live":     "var(--state-live)",
        "state-warning":  "var(--state-warning)",
        "state-error":    "var(--state-error)",
        "state-claim":    "var(--state-claim)",
        "state-claiming": "var(--state-claiming)",
        "state-claimed":  "var(--state-claimed)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
