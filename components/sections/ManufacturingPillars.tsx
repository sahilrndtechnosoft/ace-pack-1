'use client';

import React from 'react';
import { Container } from '../ui/Container';
import { Cpu, Award, RefreshCw, CheckCircle2 } from 'lucide-react';

export const ManufacturingPillars: React.FC = () => {
  const pillars = [
    {
      title: 'High-Speed Precision Moulding',
      description: '180T–450T robotic presses delivering 2.8-second cycle speeds and tight wall tolerances.',
      icon: Cpu
    },
    {
      title: 'Cleanroom Hygiene Standards',
      description: 'Dust-free manufacturing bays adhering to strict ISO & US FDA food contact protocols.',
      icon: Award
    },
    {
      title: 'In-House CAD Toolroom R&D',
      description: 'Proprietary mold development and rapid prototyping for custom container dimensions.',
      icon: RefreshCw
    }
  ];

  return (
    <section className="py-16 bg-white border-b border-[#E6DBC6]/40">
      <Container>
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold text-[#a8812f] uppercase tracking-wider block mb-2">
            MANUFACTURING EXCELLENCE
          </span>
          <h2 className="text-3xl font-extrabold text-[#1A1D20] tracking-tight">
            Our 3 Core Pillars of Quality
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAF8F4] p-8 rounded-3xl border border-[#E6DBC6] hover:border-[#cfa144] transition-all hover:shadow-lg text-center flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#cfa144]/15 text-[#a8812f] flex items-center justify-center mb-6 border border-[#cfa144]/30">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[#1A1D20] mb-3">{p.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>

      </Container>
    </section>
  );
};
