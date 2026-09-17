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
        brand: { ivory: "#faf8f4", charcoal: "#1a1d20", gold: "#cfa144", "gold-deep": "#a8812f" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      // The template pages set most body copy in text-xs / text-sm. Lifting the
      // two smallest steps a notch fixes readability everywhere at once.
      fontSize: {
        xs: ["0.8125rem", { lineHeight: "1.6" }],
        sm: ["0.9rem", { lineHeight: "1.65" }],
      },
    },
  },
  plugins: [],
};
export default config;
