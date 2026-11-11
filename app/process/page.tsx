import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { PageBanner } from '@/components/ui/PageBanner';
import {
  Layers,
  Box,
  Cpu,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileDown,
  Building2,
  Clock,
  Gauge,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manufacturing Process | Sheet Extrusion & Thermoforming | Ace Packaging',
  description:
    "Ace Packaging's 5-step automated manufacturing process: Sheet Extrusion, Thermoforming, Automated Production, Quality Checks, and Packaging & Dispatch.",
};

export default function ProcessPage() {
  const processSteps = [
    {
      num: '01',
      title: 'Sheet Extrusion',
      subtitle: 'Precision Gauge Polymer Sheet Production',
      icon: Layers,
      tag: 'Raw Material Conversion',
      description:
        '100% prime virgin food-grade polymer resin (PP 05 / PET) is dehumidified, melted, and continuously extruded through a high-precision flat die. Multi-roll calendar stacks cool and calibrate the sheet with laser-monitored gauge uniformity across the entire web width.',
      keySpecs: [
        'Prime virgin PP 05 and PET resin only',
        'Continuous laser-controlled thickness monitoring',
        'Optical clarity and surface stress elimination',
        'Zero recycled filler or contaminated regrind',
      ],
      highlight: '±0.02 mm gauge precision across every square meter',
    },
    {
      num: '02',
      title: 'Thermoforming',
      subtitle: 'Plug-Assist Cavity Forming & Hermetic Rim Shaping',
      icon: Box,
      tag: 'Product Geometry Moulding',
      description:
        'The extruded plastic sheet is indexed into computer-controlled radiant heating zones and vacuum-formed with precision plug-assist tooling. Container walls, partition ribs, and hermetic rim snap grooves are formed with micro-tolerance repeatability.',
      keySpecs: [
        'Multi-zone ceramic radiant heating control',
        'High-cavity aluminium tooling with cooling channels',
        'Precision snap-fit perimeter rim geometry',
        'Sharp partition definition preventing liquid migration',
      ],
      highlight: 'Uniform wall distribution ensuring maximum structural rigidity',
    },
    {
      num: '03',
      title: 'Automated Production',
      subtitle: 'High-Speed Inline Trimming & Robotic Handling',
      icon: Cpu,
      tag: 'Zero-Touch Cleanroom Automation',
      description:
        'Formed containers are trimmed directly in-mould with CNC accuracy. High-speed 3-axis robotic arms extract finished containers onto cleanroom conveyors without manual human touch, while web skeleton trim is granulated inline for closed-loop sustainability.',
      keySpecs: [
        'Sub-3.0 second high-speed cycle times',
        'Cleanroom conveyor transfer with positive air pressure',
        'Automated robotic pick, place, and orientation',
        '100% closed-loop skeleton web recycling',
      ],
      highlight: 'Dust-free, zero-touch automated cleanroom handling',
    },
    {
      num: '04',
      title: 'Quality Checks',
      subtitle: '100% Inline Optical Vision & Rim Leak Testing',
      icon: ShieldCheck,
      tag: 'Rigorous Quality Verification',
      description:
        'Every production batch undergoes multi-point inline inspection. High-speed vision cameras detect micro-pinholes, perimeter wall thickness is gauged, and containers undergo 100% rim seal drop and leak testing under hot liquid transport simulation.',
      keySpecs: [
        'High-speed optical vision camera inspection',
        '100% zero-leak rim snap pressure verification',
        'Thermal cycling tested from −20°C to +120°C',
        'Drop impact resistance with piping-hot gravies',
      ],
      highlight: '100% rim leak tested before packing approval',
    },
    {
      num: '05',
      title: 'Packaging and Dispatch',
      subtitle: 'Hygienic Polybag Sleeving & Global Export Logistics',
      icon: Truck,
      tag: 'Protective Cartoning & Logistics',
      description:
        'Containers are automatically counted, nested, and sealed into protective dust-proof polybag sleeves directly at the conveyor exit. Sleeves are packed into heavy-duty 5-ply corrugated cartons, palletized, stretch-wrapped, and barcoded for domestic and global export dispatch.',
      keySpecs: [
        'Automated stack counting and polybag hermetic sleeving',
        'Heavy-duty 5-ply outer export-grade corrugated cartons',
        'Serialized batch barcodes tracking resin lot and machine press',
        'Full containerload (FCL) dispatch to UK, UAE, EU, and Australia',
      ],
      highlight: 'Palletized dispatch from Daman Unit 1 & 2 to 20+ countries',
    },
  ];

  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      {/* Hero Page Banner */}
      <PageBanner
        title="Our Manufacturing Process"
        subtitle="A fully integrated 5-step automated workflow—from Sheet Extrusion and Thermoforming through Automated Production, Quality Checks, and Packaging & Dispatch."
        badge="PRODUCTION WORKFLOW"
        bgImage="/b9d572a7-af59-4e63-92e8-2971440edffe.png"
        breadcrumbs={[{ name: 'Manufacturing Process', href: '/process' }]}
      />

      {/* Process Introduction & Plant Capabilities */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-[10px] font-bold text-[#a8812f] uppercase tracking-wider block mb-2">
              Integrated Production Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1D20] tracking-tight">
              5-Step Precision Manufacturing Process
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
              Ace Packaging operates advanced polymer processing infrastructure across two manufacturing units in Daman, India. Every container is crafted through an automated sequence ensuring certified food-grade purity, structural perfection, and zero transit leakage.
            </p>
          </div>

          {/* Stepper Timeline Cards */}
          <div className="max-w-4xl mx-auto space-y-8">
            {processSteps.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.num}
                  className="bg-white rounded-3xl border border-[#E6DBC6] hover:border-[#b99750] p-6 sm:p-9 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Subtle Accent Glow */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-radial from-[#b99750]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Left: Step Number & Icon */}
                    <div className="flex md:flex-col items-center md:items-start gap-4 shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-[#FAF8F4] border border-[#E6DBC6] group-hover:border-[#b99750] flex items-center justify-center text-[#a8812f] transition-colors shadow-2xs">
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <span className="text-3xl sm:text-4xl font-black text-[#a8812f] font-mono leading-none">
                        {step.num}
                      </span>
                    </div>

                    {/* Middle: Content & Specs */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#a8812f] bg-[#FAF8F4] border border-[#E6DBC6] px-2.5 py-1 rounded-full">
                          {step.tag}
                        </span>
                        <span className="text-xs font-semibold text-gray-400">
                          Step {idx + 1} of 5
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-extrabold text-[#1A1D20] mb-1">
                        {step.title}
                      </h3>
                      <h4 className="text-xs sm:text-sm font-bold text-[#b99750] mb-3">
                        {step.subtitle}
                      </h4>

                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-5">
                        {step.description}
                      </p>

                      {/* Key Technical Specs Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 border-t border-gray-100">
                        {step.keySpecs.map((spec, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2 text-xs font-medium text-gray-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#a8812f] shrink-0 mt-0.5" />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>

                      {/* Bottom Key Highlight Bar */}
                      <div className="mt-5 p-3 rounded-xl bg-[#FAF8F4] border border-[#E6DBC6] flex items-center justify-between text-xs font-bold text-[#1A1D20]">
                        <span className="text-gray-500 font-semibold">Key Benchmark:</span>
                        <span className="text-[#a8812f]">{step.highlight}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Manufacturing Standards & Facility Summary */}
      <section className="py-12 md:py-16 bg-white border-y border-[#E6DBC6]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-[#FAF8F4] p-6 sm:p-8 rounded-3xl border border-[#E6DBC6] text-left">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#E6DBC6] flex items-center justify-center text-[#a8812f] mb-4">
                <Gauge className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1D20] mb-2">1,500,000+ Units Daily</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Massive industrial moulding capacity across high-speed robotic injection and thermoforming presses, fulfilling containerload export and bulk franchise orders with zero delay.
              </p>
            </div>

            <div className="bg-[#FAF8F4] p-6 sm:p-8 rounded-3xl border border-[#E6DBC6] text-left">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#E6DBC6] flex items-center justify-center text-[#a8812f] mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1D20] mb-2">Daman Manufacturing Campus</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Unit 1 and Unit 2 in Dabhel, Daman feature dust-controlled cleanroom halls, CNC mould tooling workshops, and automated optical micrometer quality laboratories.
              </p>
            </div>

            <div className="bg-[#FAF8F4] p-6 sm:p-8 rounded-3xl border border-[#E6DBC6] text-left">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#E6DBC6] flex items-center justify-center text-[#a8812f] mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1D20] mb-2">ISO 9001:2015 Certified</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Audited and certified by SGS United Kingdom Ltd (Certificate IN25/00000652), ensuring 100% prime virgin polymers, zero chemical migration, and food contact safety.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action: Plant Tour & Quality Audit */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="bg-[#161A12] text-white rounded-3xl p-8 sm:p-14 border border-white/10 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-8 text-left">
            <div className="max-w-2xl">
              <span className="text-[10px] font-bold text-[#d6b05d] uppercase tracking-wider block mb-2">
                Factory Verification
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Inspect Our Manufacturing Lines in Person
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-2.5 leading-relaxed">
                We welcome corporate procurement heads, brand managers, and export buyers for scheduled on-site audits at our Daman manufacturing campus. Request free physical sample kits or review our official ISO 9001:2015 audit file.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3.5 shrink-0">
              <Link
                href="/quality"
                className="inline-flex items-center justify-center gap-2 bg-[#d6b05d] hover:bg-[#c49e48] text-[#161A12] font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>View Quality &amp; Certifications</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-[#d6b05d] text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>Schedule Plant Audit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
