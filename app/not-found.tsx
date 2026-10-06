import Link from 'next/link';
import { ArrowRight, Home, Package } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-[#F8FAFC] flex items-center justify-center px-6 py-20 text-center text-slate-900">
      <div className="max-w-md w-full bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-6">
          <Package className="w-8 h-8 text-teal-600" />
        </div>
        
        <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest block mb-2">404 — Page Not Found</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-4">
          Looking for Container Packaging?
        </h1>
        <p className="text-sm text-slate-600 mb-8 leading-relaxed font-medium">
          The page you requested could not be found. Explore Ace Packaging’s full container catalog or return to the homepage.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-6 rounded-full transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/categories"
            className="w-full bg-teal-50 hover:bg-teal-100 text-teal-800 font-extrabold text-xs uppercase tracking-wider py-3.5 px-6 rounded-full transition-colors border border-teal-200 flex items-center justify-center gap-2"
          >
            <span>View All Product Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
