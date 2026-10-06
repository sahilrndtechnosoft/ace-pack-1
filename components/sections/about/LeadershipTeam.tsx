import React from 'react';
import { Reveal } from '../../ui/Reveal';
import { SplitHeading } from '../../ui/SplitHeading';
import { Briefcase, Cog, FlaskConical, Truck } from 'lucide-react';

import { leadership } from '@/lib/data/about';
const leaders = leadership.map((person,i)=>({...person,bio:person.remit,icon:[Briefcase,Cog,FlaskConical,Truck][i]}));

export const LeadershipTeam: React.FC = () => {
  return (
    <div className="mb-20">
      <Reveal type="fade-right">
        <span className="text-xs font-extrabold text-[#a8812f] uppercase tracking-wider block mb-2">
          Who Runs Ace Packaging
        </span>
      </Reveal>
      <SplitHeading>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1D20] tracking-tight mb-10">
          Leadership Team
        </h2>
      </SplitHeading>

      <p className="mb-6 text-sm text-gray-600">Sample names and LinkedIn links for design review.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {leaders.map((leader, idx) => {
          const Icon = leader.icon;
          return (
            <Reveal key={idx} type="fade-up" delay={idx * 0.1}>
              <div className="group bg-white h-full p-6 rounded-2xl border border-[#E6DBC6] hover:border-[#cfa144] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-[#cfa144]/15 text-[#a8812f] flex items-center justify-center mb-5 border border-[#cfa144]/20 group-hover:bg-[#cfa144] group-hover:text-[#1A1D20] transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold text-[#a8812f] uppercase tracking-wider block mb-1">
                  {leader.role}
                </span>
                <h4 className="text-sm font-bold text-[#1A1D20] mb-2">{leader.name}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{leader.bio}</p>
                <a href={leader.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center mt-3 text-sm underline">LinkedIn (sample link)</a>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
};
