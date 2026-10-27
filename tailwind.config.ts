import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: { ivory: "var(--ace-paper)", charcoal: "var(--ace-ink)", gold: "var(--ace-orange)", "gold-deep": "var(--ace-orange)" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Instrument Serif", "Playfair Display", "Georgia", "serif"],
        display: ["var(--font-display)", "Instrument Serif", "Playfair Display", "Georgia", "serif"],
      },
      letterSpacing: { tight: "var(--heading-tracking)", tighter: "var(--heading-tracking)" },
      // Lifted font size scale for an elegant, readable, and prestigious presence
      fontSize: {
        xs: ["0.95rem", { lineHeight: "1.65" }],
        sm: ["1.0625rem", { lineHeight: "1.7" }],
        base: ["1.125rem", { lineHeight: "1.75" }],
      },
    },
  },
  plugins: [],
};
export default config;
