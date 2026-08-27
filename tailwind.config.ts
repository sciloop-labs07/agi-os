import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        border: "hsl(var(--border))",
        panel: "hsl(var(--panel))",
        surface: "var(--surface)",
        "surface-secondary": "var(--surface-secondary)",
        cyan: {
          signal: "#48e5ff"
        },
        lime: {
          signal: "#b6ff61"
        },
        rose: {
          signal: "#ff5f8f"
        }
      },
      boxShadow: {
        glow: "0 0 50px rgba(72, 229, 255, 0.12)"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "SFMono-Regular", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
