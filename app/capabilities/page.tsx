import React from 'react';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { getPageContent, cmsMetadata } from '@/lib/db/content';
import { Cpu, Wrench, ShieldCheck, Flame, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

const staticMetadata: Metadata = {
  title: 'Manufacturing Capabilities | Ace Packaging Injection Moulding & Toolroom',
  description: 'Discover Ace Packaging\'s advanced high-speed robotic injection moulding machines (180T-450T), in-house CAD mold toolroom, and IML labelling technology.',
};

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('capabilities', staticMetadata);
}

const CARD_ICONS = [Cpu, Wrench];

export default async function CapabilitiesPage() {
  const { content, hidden } = await getPageContent('capabilities');
  const show = (key: string) => !hidden.includes(key);
  const { banner, specs, infrastructure } = content;

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      {show('banner') && (
        <PageBanner title={banner.title} subtitle={banner.subtitle} badge={banner.badge} bgImage={banner.bgImage} breadcrumbs={[{ name: 'Capabilities', href: '/capabilities' }]} />
      )}

      <section className="py-16 md:py-20">
        <div className="container-custom">

          {/* Key Specs Bar */}
          {show('specs') && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {specs.specs.map((s, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border-2 border-[#cfa144]/60 shadow-sm text-center">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">{s.title}</span>
                <span className="text-lg font-extrabold text-[#a8812f]">{s.value}</span>
              </div>
            ))}
          </div>}

          {/* Infrastructure Sections Grid */}
          {show('infrastructure') && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
              {infrastructure.cards.map((card, idx) => {
                const Icon = CARD_ICONS[idx % CARD_ICONS.length];
                return (
                  <div key={`${card.title}-${idx}`} className="bg-white p-5 sm:p-10 rounded-3xl border border-[#E6DBC6] shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-[#cfa144]/15 text-[#a8812f] flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#1A1D20] mb-4">{card.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">{card.description}</p>
                    <ul className="space-y-2.5 text-xs text-gray-700">
                      {card.points.map((point) => (
                        <li key={point} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#a8812f]" /> {point}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
