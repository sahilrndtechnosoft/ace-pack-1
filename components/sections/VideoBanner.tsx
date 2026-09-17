'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '../ui/Container';
import { ShieldCheck, Play, ArrowRight, Award } from 'lucide-react';

export const VideoBanner: React.FC = () => {
  return (
    <section className="relative py-20 bg-[#111518] text-white overflow-hidden border-b border-[#E6DBC6]/30">
      
      {/* Container Background Image with High Opacity (opacity-65) */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://plus.unsplash.com/premium_photo-1664392020927-9344e87b378d?q=80&w=1200&auto=format&fit=crop"
          alt="Factory Container Production"
          className="w-full h-full object-cover opacity-65 filter brightness-90 contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/80" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          
          <span className="inline-flex items-center gap-2 bg-[#cfa144] text-[#1A1D20] text-[11px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6 shadow">
            <Award className="w-4 h-4" /> STATE-OF-THE-ART MANUFACTURING
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Take a Virtual Tour of Our Injection Moulding Plant
          </h2>

          <p className="text-xs sm:text-base text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            Witness our cleanroom production lines, 180T–450T high-speed presses, robotic automation, and rigorous 100% quality inspection systems.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/capabilities"
              className="bg-[#cfa144] hover:bg-[#1A1D20] hover:text-[#faf8f4] text-[#1A1D20] text-xs sm:text-sm font-bold px-8 py-3.5 rounded-full shadow-lg transition-all uppercase tracking-wider flex items-center gap-2"
            >
              <span>Explore Plant Infrastructure</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </Container>
    </section>
  );
};
