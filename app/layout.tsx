import type { Metadata } from "next";
// Lenis ships its required stylesheet rather than injecting it at runtime, and
// it was never imported — so the smooth scroller ran without the rules it
// depends on (auto height on html/body, overscroll containment for
// [data-lenis-prevent] regions, and blocking iframe pointer events mid-scroll).
import "lenis/dist/lenis.css";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { CursorTrail } from "@/components/ui/CursorTrail";

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
    <html lang="en" data-scroll-behavior="smooth">
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
