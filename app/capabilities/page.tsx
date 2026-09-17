import React from 'react';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { Cpu, Wrench, ShieldCheck, Flame, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manufacturing Capabilities | AcePack Injection Moulding & Toolroom',
  description: 'Discover AcePack\'s advanced high-speed robotic injection moulding machines (180T-450T), in-house CAD mold toolroom, and IML labelling technology.',
};

export default function CapabilitiesPage() {
  const specs = [
    { title: 'Machine Tonnage Range', value: '180T – 450T High-Speed Presses' },
    { title: 'Cycle Speeds', value: '2.8s Ultra-Fast Cycle Times' },
    { title: 'Wall Thickness Tolerance', value: '±0.02mm High-Precision Geometry' },
    { title: 'Daily Plant Output', value: '1,500,000+ Units / Day' },
  ];

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      <PageBanner
        title="Manufacturing Capabilities"
        subtitle="High-speed robotic injection moulding, custom CAD mould engineering, cleanroom hygiene standards, and In-Mould Labelling (IML) technology."
        badge="ENGINEERING EXCELLENCE"
        bgImage="/b9d572a7-af59-4e63-92e8-2971440edffe.png"
        breadcrumbs={[{ name: 'Capabilities', href: '/capabilities' }]}
      />

      <section className="py-16 md:py-20">
        <div className="container-custom">

          {/* Key Specs Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {specs.map((s, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border-2 border-[#cfa144]/60 shadow-sm text-center">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">{s.title}</span>
                <span className="text-lg font-extrabold text-[#a8812f]">{s.value}</span>
              </div>
            ))}
          </div>

          {/* Infrastructure Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">

            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E6DBC6] shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#cfa144]/15 text-[#a8812f] flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1D20] mb-4">Robotic Injection Moulding Line</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                Our plant houses state-of-the-art European & Taiwanese injection moulding machines equipped with 3-axis high-speed robotic pick-and-place automation, ensuring zero human touch contamination.
              </p>
              <ul className="space-y-2.5 text-xs text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#a8812f]" /> Automatic hot-runner multi-cavity moulds</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#a8812f]" /> Real-time closed-loop temperature control</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#a8812f]" /> High clarity resin plasticizing screws</li>
              </ul>
            </div>

            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E6DBC6] shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#cfa144]/15 text-[#a8812f] flex items-center justify-center mb-6">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1D20] mb-4">In-House CAD Toolroom & R&D</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                Our team of toolmakers and CAD designers engineer custom moulds with optimized cooling channels, allowing us to turn around prototype designs into mass production within short lead times.
              </p>
              <ul className="space-y-2.5 text-xs text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#a8812f]" /> 3D SolidWorks & Moldflow analysis</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#a8812f]" /> CNC high-speed machining centers</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#a8812f]" /> Custom branding embossing capabilities</li>
              </ul>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
