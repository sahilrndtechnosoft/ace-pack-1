import React from 'react';
import { Reveal } from '../../ui/Reveal';
import { SplitHeading } from '../../ui/SplitHeading';
import { Briefcase, Cog, FlaskConical, Truck } from 'lucide-react';

// Placeholder org structure pending real leadership names, photos, and
// bios — swap `name` and `bio` below before this section goes live.
// Deliberately kept to role + remit only for now rather than inventing
// specific people's names/photos for a real company's actual leadership.
const leaders = [
  {
    role: 'Managing Director',
    name: 'Leadership Name',
    bio: 'Sets overall strategy and oversees plant operations across both Daman manufacturing units.',
    icon: Briefcase
  },
  {
    role: 'Head of Operations',
    name: 'Leadership Name',
    bio: 'Runs day-to-day production scheduling, robotic press uptime, and dispatch reliability.',
    icon: Cog
  },
  {
    role: 'Head of Quality & R&D',
    name: 'Leadership Name',
    bio: 'Owns mould CAD development, material testing, and ISO/FDA compliance across every batch.',
    icon: FlaskConical
  },
  {
    role: 'Head of Supply Chain',
    name: 'Leadership Name',
    bio: 'Manages raw material sourcing, export logistics, and on-time dispatch across 25+ countries.',
    icon: Truck
  }
];

export const LeadershipTeam: React.FC = () => {
  return (
    <div className="mb-20">
      <Reveal type="fade-right">
        <span className="text-xs font-extrabold text-[#a8812f] uppercase tracking-wider block mb-2">
          Who Runs AcePack
        </span>
      </Reveal>
      <SplitHeading>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1D20] tracking-tight mb-10">
          Leadership Team
        </h2>
      </SplitHeading>

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
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
};
