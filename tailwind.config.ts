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
        sans: ["var(--font-sans)", "'Manrope'", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        serif: ["var(--font-serif)", "'Instrument Serif'", "Georgia", "serif"],
      },
      letterSpacing: { tight: "var(--heading-tracking)", tighter: "var(--heading-tracking)" },
      fontSize: {
        // Fluid: ~13/14px on phones, reaching the 15/16px desktop size by ~1024px.
        xs: ["clamp(0.8125rem, 0.75rem + 0.3vw, 0.9375rem)", { lineHeight: "1.65" }],
        sm: ["clamp(0.875rem, 0.8rem + 0.3vw, 1rem)", { lineHeight: "1.7" }],
      },
    },
  },
  plugins: [],
};
export default config;
