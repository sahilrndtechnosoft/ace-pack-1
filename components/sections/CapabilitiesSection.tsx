'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '../ui/Container';
import { Cpu, Wrench, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const CapabilitiesSection: React.FC = () => {
  const capabilities = [
    {
      title: 'Robotic Injection Moulding Lines',
      image: 'https://plus.unsplash.com/premium_photo-1701213306583-082f9bfd88b4?w=800&auto=format&fit=crop',
      badge: '180T – 450T PRESSES',
      description: '3-axis high-speed robotic pick-and-place automation ensuring zero human touch contamination and 2.8s cycle times.'
    },
    {
      title: 'In-House CAD Toolroom & R&D',
      image: 'https://plus.unsplash.com/premium_photo-1701213306445-9874fe01971a?w=800&auto=format&fit=crop',
      badge: '3D SOLIDWORKS CAD',
      description: 'Proprietary mold development with multi-cavity hot runners and optimized cooling channels for fast turnarounds.'
    },
    {
      title: 'Cleanroom Quality Inspection',
      image: 'https://plus.unsplash.com/premium_photo-1664392020927-9344e87b378d?q=80&w=800&auto=format&fit=crop',
      badge: 'ISO 9001:2015 TESTED',
      description: 'Dust-free manufacturing bays adhering strictly to US FDA direct food contact compliance and zero-leak pressure testing.'
    }
  ];

  return (
    <section className="py-20 bg-[#111518] text-white border-b border-white/10">
      <Container>
        
        {/* Top Header Bar matching Section 7 of reference mockup */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs font-extrabold text-[#a8812f] uppercase tracking-wider block mb-2">
              OUR CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Aiming for Perfection in Food Packaging
            </h2>
          </div>

          <Link
            href="/capabilities"
            className="inline-flex items-center gap-2 bg-[#cfa144] hover:bg-[#1A1D20] hover:text-[#faf8f4] text-[#1A1D20] text-xs font-bold px-6 py-3 rounded-full uppercase tracking-wider shadow transition-all self-start sm:self-auto"
          >
            <span>Explore Capabilities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Column Studio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {capabilities.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#050505] rounded-3xl overflow-hidden border-2 border-[#cfa144]/60 hover:border-[#cfa144] transition-all duration-300 hover:shadow-2xl flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-60 overflow-hidden bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <span className="absolute top-4 left-4 bg-[#cfa144] text-[#1A1D20] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    {item.badge}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#a8812f] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#a8812f]">
                  <CheckCircle2 className="w-4 h-4" /> 100% Quality Inspected
                </div>
              </div>
            </div>
          ))}
        </div>

      </Container>
    </section>
  );
};
