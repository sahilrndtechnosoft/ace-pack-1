import type { Metadata } from "next";
import { draftMode } from "next/headers";
// Lenis ships its required stylesheet rather than injecting it at runtime
import "lenis/dist/lenis.css";
import "./globals.css";
import "@/components/experience/shared.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { CursorTrail } from "@/components/ui/CursorTrail";
import { ContentProtection } from "@/components/ui/ContentProtection";
import { SiteVisitorTracker } from "@/components/analytics/SiteVisitorTracker";
import { getCmsSettings, getCmsCategories } from "@/lib/db/content";
import { SiteTextProvider } from "@/components/layout/SiteTextProvider";
import { withDefaults } from "@/lib/cms/merge";
import { siteTextDefaults } from "@/lib/cms/site-settings";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.acepack.co.in'),
  title: "Ace Packaging | Premium Plastic Food Containers",
  description: "Manufacturer and global exporter of high-quality plastic food containers, hinge cups, portion cups, RO series, bento boxes, and sweet containers.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, categories, draft] = await Promise.all([
    getCmsSettings(),
    getCmsCategories(),
    draftMode(),
  ]);
  const headerSettings = settings?.header_settings || null;
  const footerSettings = settings?.footer_settings || null;
  const siteText = withDefaults(siteTextDefaults, settings?.site_text);

  return (
    <html lang="en" data-scroll-behavior="smooth" className="font-sans max-w-full w-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Manrope:wght@300;400;500;600;700;800&display=swap"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col justify-between bg-background text-foreground font-sans max-w-full w-full relative">
        {draft.isEnabled && (
          <div role="status" className="sticky top-0 z-[100] bg-amber-400 text-black text-xs font-bold text-center py-2 px-4">
            Preview mode: you are seeing unpublished drafts.{' '}
            <a href="/api/admin/preview?exit=1" className="underline">Exit preview</a>
          </div>
        )}
        <SiteVisitorTracker />
        <ContentProtection />
        <SmoothScroll />
        <CursorTrail />
        <SiteTextProvider value={siteText}>
          <Header initialSettings={headerSettings} initialCategories={categories} />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer initialSettings={footerSettings} initialCategories={categories} />
        </SiteTextProvider>
        <ScrollToTopButton />
      </body>
    </html>
  );
}
