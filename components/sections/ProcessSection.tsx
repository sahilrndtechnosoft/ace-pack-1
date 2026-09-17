'use client';

import React from 'react';
import { Container } from '../ui/Container';

export const ProcessSection: React.FC = () => {
  const steps = [
    { num: '01', title: 'Polymer Resin Drying & Plastifying', description: 'Virgin PP 05 resins are dehumidified and melted under digital temperature control.' },
    { num: '02', title: 'High-Speed Multi-Cavity Injection', description: 'Injection under 180T–450T hydraulic clamp force with 2.8s cycle speed.' },
    { num: '03', title: 'In-Mould Labelling (IML) Fusion', description: 'Robotic label insertion fuses vibrant full-color artwork directly into container walls.' },
    { num: '04', title: 'Automated Robotic Pick & Place', description: '3-axis robotic arms remove finished containers onto cleanroom conveyors without human touch.' },
    { num: '05', title: 'Quality Testing & Export Packaging', description: '100% leak testing, rim dimension verification, and automatic carton stacking.' }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#E6DBC6]/40">
      <Container>
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-extrabold text-[#a8812f] uppercase tracking-wider block mb-2">
            PRODUCTION WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1D20] tracking-tight">
            5-Step Automated Manufacturing Process
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
            Step-by-step automated injection moulding workflow ensuring 100% hygiene, zero leakage, and structural perfection.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-[#FAF8F4] p-6 sm:p-8 rounded-3xl border border-[#E6DBC6] shadow-sm flex items-start gap-6">
              <span className="text-3xl font-extrabold text-[#a8812f] shrink-0">{step.num}</span>
              <div>
                <h3 className="text-lg font-bold text-[#1A1D20] mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

      </Container>
    </section>
  );
};
