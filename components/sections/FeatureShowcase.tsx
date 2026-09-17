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
      description: 'US FDA 21 CFR 177.1520 certified food-grade polymer. Completely BPA-free and non-toxic.'
    },
    {
      icon: Flame,
      title: 'Extreme Thermal Range',
      description: 'Resists temperatures from -20°C deep freeze up to +120°C hot soup and microwave reheating.'
    },
    {
      icon: Lock,
      title: 'Zero-Leak Snap Rim Geometry',
      description: 'Hermetically tight rim seal prevents sauce and liquid spillage during motorcycle delivery.'
    },
    {
      icon: Sparkles,
      title: 'Custom IML Brand Labelling',
      description: 'Waterproof full-color graphics molded directly into container walls for high-impact branding.'
    }
  ];

  return (
    <section className="relative py-20 bg-[#111518] text-white border-b border-white/10 overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute top-0 right-0 w-[240px] sm:w-[460px] h-[240px] sm:h-[460px] rounded-full [background:radial-gradient(circle,rgba(184,152,88,0.14)_0%,rgba(184,152,88,0)_70%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 w-[200px] sm:w-[360px] h-[200px] sm:h-[360px] rounded-full [background:radial-gradient(circle,rgba(184,152,88,0.12)_0%,rgba(184,152,88,0)_70%)]" />
      <Container className="relative z-10">

        {/* Main Grid: Left Column 6 / Right Column 6 (10% Left Decrease, 10% Right Increase) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Dark Studio Theme (lg:col-span-6) */}
          <Reveal type="fade-right" duration={0.8}>
            <div className="lg:col-span-6 flex flex-col justify-between text-left">

              <div>
                <span className="text-xs font-extrabold text-[#a8812f] uppercase tracking-wider block mb-3">
                  WHY CHOOSE ACEPACK PACKAGING
                </span>

                <SplitHeading>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
                    The Perfect Packaging Choice for Your Delivery Needs
                  </h2>
                </SplitHeading>

                <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-8 max-w-xl">
                  We engineer high-performance plastic food containers tailored for quick-service restaurants, cloud kitchens, caterers, and food brands across India and global markets.
                </p>
              </div>

              {/* 2x2 Feature Cards Grid with Dark Studio Styling & Motion Hover */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <Reveal key={idx} type="fade-up" delay={idx * 0.1}>
                      <motion.div
                        whileHover={{ y: -6, scale: 1.03 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-[#050505] p-5 rounded-2xl border-2 border-[#cfa144]/40 hover:border-[#cfa144] shadow-md hover:shadow-2xl hover:shadow-[#cfa144]/25 transition-all duration-300 group text-left flex flex-col justify-between"
                      >
                        <div>
                          <div className="w-10 h-10 rounded-xl bg-[#cfa144]/20 text-[#a8812f] flex items-center justify-center mb-3 group-hover:bg-[#cfa144] group-hover:text-[#1A1D20] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <h3 className="text-md font-bold text-white mb-1.5 group-hover:text-[#a8812f] transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-400 leading-relaxed">
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

          {/* Right Column: Media Studio Stack Frame (lg:col-span-6 - Increased width 10%) */}
          <Reveal type="fade-left" duration={0.8}>
            <div className="lg:col-span-6 relative flex flex-col min-h-[480px]">

              {/* Main Featured Container Photo with Gold Border Glow */}
              <div
                id="feature-model-target"
                className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#cfa144]/60 hover:border-[#cfa144] bg-gradient-to-br from-[#FFFDF9] via-[#F5F0E6] to-[#E9E1D1] flex-1 w-full group"
              >
                {/* TEMP: hidden while testing the 3D container landing here.
                    The wrapping div must stay — ModelBanner measures it by id. */}
                {/* <img
                  src="https://ik.imagekit.io/mikbqwyy0/AcePackaging/ChatGPT%20Image%20Aug%2026,%202026,%2012_02_11%20PM.png?tr=w-800,q-78,f-webp"
                  alt="AcePack Precision Food Packaging Line"
                  width={800}
                  height={450}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-right group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                /> */}

                {/* Dark Gradient Overlay with Title */}
                <div className="absolute inset-0 [background:linear-gradient(to_top,rgba(26,29,32,0.78)_0%,rgba(26,29,32,0.38)_18%,rgba(26,29,32,0)_34%)] p-8 flex flex-col justify-end text-left">
                  <span className="text-xs font-extrabold text-[#a8812f] uppercase tracking-wider block mb-1">
                    ROBOTIC INJECTION MOULDING
                  </span>
                  <p className="text-lg font-extrabold text-white leading-snug">
                    1,500,000+ Daily Production Output
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
