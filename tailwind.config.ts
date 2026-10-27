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
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      letterSpacing: { tight: "var(--heading-tracking)", tighter: "var(--heading-tracking)" },
      fontSize: {
        xs: ["0.9375rem", { lineHeight: "1.65" }],
        sm: ["1rem", { lineHeight: "1.7" }],
      },
    },
  },
  plugins: [],
};
export default config;
