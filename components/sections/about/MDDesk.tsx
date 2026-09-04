import React from 'react';
import { Reveal } from '../../ui/Reveal';
import { Quote } from 'lucide-react';

// Placeholder message pending the real Managing Director's photo, name, and
// quote — swap the fields below before this section goes live. Deliberately
// not inventing a specific person's name/photo here since this represents
// a real executive of the business.
const md = {
  role: 'Managing Director',
  message: `When we started AcePack, the goal was never to be the cheapest container on the shelf — it was to be the one a kitchen manager never has to think twice about. Every mould we design, every batch of virgin polymer we test, and every container that leaves our Daman plant carries that responsibility. Fifteen years and 25+ export markets later, that's still the only metric that matters to me: did the food arrive the way it left the kitchen.`
};

export const MDDesk: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-[#111518] text-white border-b border-white/10 overflow-hidden relative">
      <div aria-hidden="true" className="pointer-events-none absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full [background:radial-gradient(circle,rgba(184,152,88,0.11)_0%,rgba(184,152,88,0)_70%)]" />
      <div className="container-custom relative z-10">
        <Reveal type="fade-up">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs font-extrabold text-[#b89858] uppercase tracking-wider block mb-6">
              From the MD&apos;s Desk
            </span>

            <Quote className="w-10 h-10 text-[#b89858]/50 mx-auto mb-6" />

            <p className="text-lg sm:text-xl text-gray-200 leading-relaxed font-medium mb-8">
              &quot;{md.message}&quot;
            </p>

            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-[#b89858] to-[#e0c081]">
                <div className="w-full h-full rounded-full bg-[#1A1D20] text-[#e8cf9e] flex items-center justify-center font-extrabold text-lg">
                  MD
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-white">{md.role}</p>
                <p className="text-xs text-gray-400">AcePack Packaging</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
