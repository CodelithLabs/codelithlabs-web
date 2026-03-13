import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#121212",
        accent: "#2979FF",
        surface: {
          DEFAULT: "#111111",
          light: "#1a1a1a",
          lighter: "#222222",
        },
        glow: {
          blue: "#2979FF",
          cyan: "#00E5FF",
          green: "#00E676",
          purple: "#BB86FC",
        },
      },
      fontFamily: {
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 8px currentColor" },
          "50%": { opacity: "0.5", boxShadow: "0 0 16px currentColor" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "border-glow": {
          "0%, 100%": { borderColor: "rgba(41, 121, 255, 0.3)" },
          "50%": { borderColor: "rgba(41, 121, 255, 0.8)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "void-flash": {
          "0%": { opacity: "0.45" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-down": "slide-down 0.3s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "border-glow": "border-glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "void-flash": "void-flash 0.5s ease-out forwards",
      },
      backgroundImage: {
        "grid-dot": "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "grid-line": "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "glow-radial": "radial-gradient(ellipse at center, rgba(41,121,255,0.15) 0%, transparent 70%)",
      },
      backgroundSize: {
        "grid-dot": "24px 24px",
        "grid-line": "48px 48px",
      },
    },
  },
  plugins: [],
};
export default config;