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
    <html lang="en" data-scroll-behavior="smooth" className="font-sans">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Manrope:wght@300;400;500;600;700;800&display=swap"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col justify-between bg-background text-foreground font-sans">
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
