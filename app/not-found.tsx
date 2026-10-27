import Link from 'next/link';
import { ArrowRight, Home, Package } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-[var(--ace-paper)] flex items-center justify-center px-6 py-20 text-center text-[var(--ace-ink)]">
      <div className="max-w-md w-full bg-white p-8 sm:p-12 rounded-3xl border border-[var(--ace-line)] shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-[var(--ace-aqua-soft)] text-[var(--ace-teal)] flex items-center justify-center mx-auto mb-6">
          <Package className="w-8 h-8 text-[var(--ace-teal)]" />
        </div>
        
        <span className="text-xs font-extrabold text-[var(--ace-teal)] uppercase tracking-widest block mb-2">404 — Page Not Found</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--ace-ink)] mb-4">
          Looking for Container Packaging?
        </h1>
        <p className="text-sm text-[var(--ace-muted)] mb-8 leading-relaxed font-medium">
          The page you requested could not be found. Explore Ace Packaging’s full container catalog or return to the homepage.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full bg-[var(--ace-ink)] hover:bg-[var(--ace-teal)] text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-6 rounded-full transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/categories"
            className="w-full bg-[var(--ace-aqua-soft)] hover:bg-[var(--ace-aqua)] text-[var(--ace-teal)] font-extrabold text-xs uppercase tracking-wider py-3.5 px-6 rounded-full transition-colors border border-[var(--ace-aqua-line)] flex items-center justify-center gap-2"
          >
            <span>View All Product Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
