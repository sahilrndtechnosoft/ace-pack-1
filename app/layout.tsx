import type { Metadata } from "next";
// Lenis ships its required stylesheet rather than injecting it at runtime
import "lenis/dist/lenis.css";
import "./globals.css";
import "@/components/experience/shared.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { CursorTrail } from "@/components/ui/CursorTrail";

// Site typography font variables with resilient offline fallbacks
const sans = { variable: "--font-manrope" };
const serif = { variable: "--font-instrument" };
const dmSans = { variable: "--font-dm-sans" };
const sourceSerif = { variable: "--font-source-serif" };
const spaceGrotesk = { variable: "--font-space-grotesk" };
const jakarta = { variable: "--font-jakarta" };
const outfit = { variable: "--font-outfit" };
const lora = { variable: "--font-lora" };
const dmSerif = { variable: "--font-dm-serif" };
const cormorant = { variable: "--font-cormorant" };

export const metadata: Metadata = {
  title: "Ace Packaging | Premium Plastic Food Containers",
  description: "Manufacturer and global exporter of high-quality plastic food containers, hinge cups, portion cups, RO series, bento boxes, and sweet containers.",
};

import { ContentProtection } from "@/components/ui/ContentProtection";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${sans.variable} ${serif.variable} ${dmSans.variable} ${sourceSerif.variable} ${spaceGrotesk.variable} ${jakarta.variable} ${outfit.variable} ${lora.variable} ${dmSerif.variable} ${cormorant.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col justify-between bg-background text-foreground">
        <ContentProtection />
        <SmoothScroll />
        <CursorTrail />
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <ScrollToTopButton />
      </body>
    </html>
  );
}
