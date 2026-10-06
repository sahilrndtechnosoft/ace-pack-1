import type { Metadata } from "next";
import { Manrope, Instrument_Serif, DM_Sans, Source_Serif_4, Space_Grotesk, Plus_Jakarta_Sans, Outfit, Lora, DM_Serif_Display, Cormorant_Garamond } from "next/font/google";
// Lenis ships its required stylesheet rather than injecting it at runtime, and
// it was never imported — so the smooth scroller ran without the rules it
// depends on (auto height on html/body, overscroll containment for
// [data-lenis-prevent] regions, and blocking iframe pointer events mid-scroll).
import "lenis/dist/lenis.css";
import "./globals.css";
import "@/components/experience/shared.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { CursorTrail } from "@/components/ui/CursorTrail";
import { StylePreview } from "@/components/ui/StylePreview";


// Site type. Manrope for everything set in sans — its larger x-height and open
// counters carry body copy that Arial flattened — and Instrument Serif for the
// italic display accents. Both self-hosted by next/font and exposed as CSS
// variables so the experience stylesheets and Tailwind share one source.
const sans = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-manrope", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap", preload: false });
const sourceSerif = Source_Serif_4({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-source-serif", display: "swap", preload: false });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap", preload: false });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap", preload: false });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap", preload: false });
const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-lora", display: "swap", preload: false });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-dm-serif", display: "swap", preload: false });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-cormorant", display: "swap", preload: false });

export const metadata: Metadata = {
  title: "Ace Packaging | Premium Plastic Food Containers",
  description: "Manufacturer and global exporter of high-quality plastic food containers, hinge cups, portion cups, RO series, bento boxes, and sweet containers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${sans.variable} ${serif.variable} ${dmSans.variable} ${sourceSerif.variable} ${spaceGrotesk.variable} ${jakarta.variable} ${outfit.variable} ${lora.variable} ${dmSerif.variable} ${cormorant.variable}`}>
      <body className="antialiased min-h-screen flex flex-col justify-between bg-background text-foreground">
        <SmoothScroll />
        <CursorTrail />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollToTopButton />
        <StylePreview />
      </body>
    </html>
  );
}
