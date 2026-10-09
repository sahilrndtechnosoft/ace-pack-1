'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SplitHeading } from '../ui/SplitHeading';
import { ShieldCheck, Flame, Lock, Sparkles, CheckCircle2, Zap, ArrowRight } from 'lucide-react';

export const FeatureShowcase: React.FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: '100% Virgin PP 05 Material',
      description: 'US FDA 21 CFR 177.1520 certified food-grade polymer. Completely BPA-free, non-toxic, and odorless.',
    },
    {
      icon: Flame,
      title: 'Extreme Thermal Range',
      description: 'Resists temperatures from -20°C deep freeze up to +120°C hot curry and microwave reheating.',
    },
    {
      icon: Lock,
      title: 'Zero-Leak Snap Rim Geometry',
      description: 'Hermetically tight rim seal prevents sauce and liquid spillage during motorcycle delivery.',
    },
    {
      icon: Sparkles,
      title: 'Custom IML Brand Labelling',
      description: 'Waterproof full-color graphics molded directly into container walls for permanent branding.',
    },
  ];

  return (
    <section className="relative py-20 bg-white text-[var(--ace-ink)] border-b border-[#E6DBC6] overflow-hidden">
      {/* Background radial gold glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 w-[350px] h-[350px] rounded-full [background:radial-gradient(circle,rgba(185,151,80,0.1)_0%,transparent_70%)]"
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">

          {/* Left Column: Light Theme Engineering Highlights */}
          <Reveal type="fade-right" duration={0.8}>
            <div className="lg:col-span-6 flex flex-col justify-between text-left h-full">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#b99750] uppercase tracking-wider mb-3 px-3 py-1 rounded-full bg-[#b99750]/10 border border-[#b99750]/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Engineering Superiority</span>
                </span>

                <SplitHeading>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--ace-ink)] tracking-tight leading-tight mb-5">
                    The Packaging Choice Built for Delivery Reality
                  </h2>
                </SplitHeading>

                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-8 max-w-xl">
                  We engineer high-performance plastic food containers tailored for quick-service restaurants, cloud kitchens, caterers, and food brands across India and global export markets.
                </p>
              </div>

              {/* 2x2 Feature Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <Reveal key={idx} type="fade-up" delay={idx * 0.1}>
                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-[#FAF8F4] p-5 rounded-2xl border border-[#E6DBC6] hover:border-[#b99750] shadow-xs hover:shadow-lg transition-all duration-300 group text-left flex flex-col justify-between h-full"
                      >
                        <div>
                          <div className="w-10 h-10 rounded-xl bg-[#b99750]/15 text-[#b99750] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <h3 className="text-sm font-bold text-[var(--ace-ink)] mb-1.5 group-hover:text-[#b99750] transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Right Column: Visual Container in Use with Food */}
          <Reveal type="fade-left" duration={0.8}>
            <div className="lg:col-span-6 relative flex flex-col min-h-[440px] h-full">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-[#E6DBC6] bg-[#FAF8F4] flex-1 w-full group">
                <img
                  src="/images/gallery/studio-range.webp"
                  alt="Ace Packaging Precision Food Packaging Line with Food Presentation"
                  width={800}
                  height={500}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Subtle White-To-Dark Gradient Bottom Strip */}
                <div className="absolute inset-0 [background:linear-gradient(to_top,rgba(16,24,26,0.78)_0%,rgba(16,24,26,0.25)_25%,rgba(16,24,26,0)_45%)] p-6 sm:p-8 flex flex-col justify-end text-left">
                  <span className="text-xs font-extrabold text-[#b99750] tracking-wider block mb-1">
                    DUAL DAMAN PLANTS · DORI KADAIYA &amp; DABHEL
                  </span>
                  <p className="text-base sm:text-lg font-extrabold text-white leading-snug">
                    1,500,000+ Daily Production Output in Food-Grade PP 05
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

        </div>
      </Container>
    </section>
  );
};
