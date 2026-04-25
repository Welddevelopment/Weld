import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      colors: {
        "weld-red": "#E03A1E",
        "spark-pink": "#FAD4C8",
        "deep-ember": "#1A0A04",
        cream: "#FFF5F0",
        "ember-2": "#221008",
        "ember-3": "#140803",
        "red-dark": "#C42910",
        "red-darker": "#A82208",
        gold: "#7A1C07"
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
