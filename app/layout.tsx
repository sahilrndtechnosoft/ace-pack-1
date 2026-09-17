import type { Metadata } from "next";
import { Manrope, Instrument_Serif } from "next/font/google";
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

// Site type. Manrope for everything set in sans — its larger x-height and open
// counters carry body copy that Arial flattened — and Instrument Serif for the
// italic display accents. Both self-hosted by next/font and exposed as CSS
// variables so the experience stylesheets and Tailwind share one source.
const sans = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-sans", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  title: "AcePack Container Solutions | Premium Plastic Food Containers",
  description: "Manufacturer and global exporter of high-quality plastic food containers, hinge cups, portion cups, RO series, bento boxes, and sweet containers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${sans.variable} ${serif.variable}`}>
      <body className="antialiased min-h-screen flex flex-col justify-between bg-[#FAF8F4] text-[#1A1D20]">
        <SmoothScroll />
        <CursorTrail />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollToTopButton />
      </body>
    </html>
  );
}
