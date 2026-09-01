import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        maroon: "#8B1E1E",
        "deep-maroon": "#681314",
        ivory: "#FAF7F2",
        "warm-white": "#FFFDFC",
        charcoal: "#202020",
        muted: "#77736D",
        gold: "#C49A58",
        hairline: "#E8E1D8",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        accent: ["var(--font-cormorant)", "serif"],
        script: ["var(--font-script)", "cursive"],
      },
      boxShadow: {
        soft: "0 12px 40px rgba(40, 20, 15, 0.08)",
        card: "0 18px 60px rgba(40, 20, 15, 0.1)",
      },
      borderRadius: {
        xl2: "20px",
        xl3: "28px",
      },
      maxWidth: {
        invite: "520px",
      },
      keyframes: {
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
      },
      animation: {
        "bounce-slow": "bounce-slow 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
