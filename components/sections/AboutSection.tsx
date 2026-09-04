'use client';

import React from 'react';
import Link from 'next/link';
import CountUp from 'react-countup';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SplitHeading } from '../ui/SplitHeading';
import { ShieldCheck, Award, ArrowRight, Play, Factory, Package } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section className="relative py-20 bg-[#FAF8F4] text-[#1A1D20] border-b border-[#E6DBC6]/40 overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -top-20 -left-24 w-[220px] sm:w-[380px] h-[220px] sm:h-[380px] rounded-full [background:radial-gradient(circle,rgba(184,152,88,0.16)_0%,rgba(184,152,88,0)_70%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-16 w-[240px] sm:w-[420px] h-[240px] sm:h-[420px] rounded-full [background:radial-gradient(circle,rgba(184,152,88,0.16)_0%,rgba(184,152,88,0)_70%)]" />
      <Container className="relative z-10">

        {/* Equal Height Grid with items-stretch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Image Stack */}
          <Reveal type="fade-right" duration={0.8}>
            <div className="lg:col-span-6 relative flex flex-col justify-start">

              {/* Main Featured Facility & Container Image (Increased height) */}
              <div
                id="about-model-target-1"
                className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-gradient-to-br from-[#FFFDF9] via-[#F5F0E6] to-[#E9E1D1] h-[440px] sm:h-[540px] lg:h-[580px] w-full"
              >
                {/* TEMP: hidden while testing the 3D container landing here.
                    The wrapping div must stay — ModelBanner measures it by id. */}
                {/* <img
                  src="https://ik.imagekit.io/mikbqwyy0/AcePackaging/ChatGPT%20Image%20Aug%2026,%202026,%2012_02_15%20PM.png?tr=w-800,q-78,f-webp"
                  alt="AcePack Precision Moulding Facility"
                  width={800}
                  height={450}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                /> */}
              </div>

              {/* Overlapping Small Product Image Card (Increased width & height) */}
              <Reveal type="zoom-in" delay={0.2}>
                <div
                  id="about-model-target-2"
                  className="absolute -bottom-8 -right-2 sm:right-4 w-44 sm:w-64 h-40 sm:h-52 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-[#FFFDF9] via-[#F5F0E6] to-[#E9E1D1] group"
                >
                  {/* TEMP: hidden while testing the 3D container landing here. */}
                  {/* <img
                    src="https://ik.imagekit.io/mikbqwyy0/AcePackaging/Flat%20Containers.png?tr=w-350,q-78,f-webp"
                    alt="AcePack Precision Container Series"
                    width={350}
                    height={307}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  /> */}
                  <div className="absolute inset-0 [background:linear-gradient(to_top,rgba(26,29,32,0.82)_0%,rgba(26,29,32,0.45)_26%,rgba(26,29,32,0)_46%)] p-4 flex flex-col justify-end">
                    <span className="text-[10px] font-extrabold text-[#b89858] uppercase tracking-wider block mb-0.5">
                      ISO 9001:2015 TESTED
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-white leading-tight">
                      One-Piece Hinge Cups
                    </p>
                  </div>
                </div>
              </Reveal>

            </div>
          </Reveal>

          {/* Right Column: Left-Aligned Content Column */}
          <Reveal type="fade-left" duration={0.8}>
            <div className="lg:col-span-6 flex flex-col justify-between text-left">

            <div>
              <span className="text-xs font-extrabold text-[#b89858] uppercase tracking-wider block mb-3">
                ABOUT ACEPACK PACKAGING
              </span>

              <SplitHeading>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1D20] tracking-tight leading-tight mb-6">
                  Where Polymer Excellence Meets Food Safety
                </h2>
              </SplitHeading>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-8">
                Pioneering high-precision injection-moulded plastic containers for QSR chains, cloud kitchens, and food brands across India and global markets. Manufactured exclusively from 100% prime virgin PP 05.
              </p>
            </div>

            {/* 4 Animated Counter Facilities Cards Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">

              <Reveal type="fade-up" delay={0.1}>
                <div className="bg-white p-5 rounded-2xl border border-[#E6DBC6] shadow-xs hover:border-[#b89858] transition-colors">
                  <div className="flex items-center gap-2 text-[#b89858] mb-1">
                    <Award className="w-5 h-5" />
                    <span className="text-2xl font-extrabold text-[#b89858]">
                      <CountUp end={15} duration={2.5} enableScrollSpy scrollSpyOnce />+
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#1A1D20] block">Years Legacy</span>
                  <p className="text-[10px] text-gray-500 mt-0.5">Daman Plant Unit 1 & 2</p>
                </div>
              </Reveal>

              <Reveal type="fade-up" delay={0.2}>
                <div className="bg-white p-5 rounded-2xl border border-[#E6DBC6] shadow-xs hover:border-[#b89858] transition-colors">
                  <div className="flex items-center gap-2 text-[#b89858] mb-1">
                    <Factory className="w-5 h-5" />
                    <span className="text-2xl font-extrabold text-[#b89858]">
                      <CountUp end={15000} duration={2.5} separator="," enableScrollSpy scrollSpyOnce />+
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#1A1D20] block">Daily Output Pcs</span>
                  <p className="text-[10px] text-gray-500 mt-0.5">Robotic Injection Presses</p>
                </div>
              </Reveal>

              <Reveal type="fade-up" delay={0.3}>
                <div className="bg-white p-5 rounded-2xl border border-[#E6DBC6] shadow-xs hover:border-[#b89858] transition-colors">
                  <div className="flex items-center gap-2 text-[#b89858] mb-1">
                    <Package className="w-5 h-5" />
                    <span className="text-2xl font-extrabold text-[#b89858]">
                      <CountUp end={11} duration={2.5} enableScrollSpy scrollSpyOnce />
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#1A1D20] block">Product Categories</span>
                  <p className="text-[10px] text-gray-500 mt-0.5">Hinge, Portion, RO, Bento</p>
                </div>
              </Reveal>

              <Reveal type="fade-up" delay={0.4}>
                <div className="bg-white p-5 rounded-2xl border border-[#E6DBC6] shadow-xs hover:border-[#b89858] transition-colors">
                  <div className="flex items-center gap-2 text-[#b89858] mb-1">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-2xl font-extrabold text-[#b89858]">
                      <CountUp end={100} duration={2.5} suffix="%" enableScrollSpy scrollSpyOnce />
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#1A1D20] block">Virgin PP 05 Food Grade</span>
                  <p className="text-[10px] text-gray-500 mt-0.5">US FDA 21 CFR Certified</p>
                </div>
              </Reveal>

            </div>

            {/* Bottom Quote & Action Button */}
            <div>
              <p className="text-xs font-semibold text-gray-700 italic mb-6 border-l-2 border-[#b89858] pl-4">
                &quot;Engineered to protect food taste, eliminate zero-leak spillage, and elevate customer unboxing.&quot;
              </p>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-[#b89858] hover:bg-[#9e8042] text-white text-xs font-bold px-7 py-3.5 rounded-full uppercase tracking-wider shadow-md hover:shadow-lg hover:shadow-[#b89858]/30 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            </div>
          </Reveal>

        </div>

      </Container>
    </section>
  );
};
