import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  Calendar,
  MapPin,
  Building,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Building2,
  Package,
  Layers,
  Sparkles,
  PhoneCall,
  Mail,
} from 'lucide-react';
import { exhibitionEvents, ExhibitionEvent } from '@/lib/data/events';
import { getCmsEventBySlug, getCmsEvents } from '@/lib/db/content';
import { EventBookingForm } from '@/components/events/EventBookingForm';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return exhibitionEvents.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = (await getCmsEventBySlug(slug)) || exhibitionEvents.find((e) => e.slug === slug);
  if (!event) return { title: 'Exhibition Not Found | Ace Packaging' };

  return {
    title: `${event.title} | Ace Packaging Events`,
    description: event.description,
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = (await getCmsEventBySlug(slug)) || exhibitionEvents.find((e) => e.slug === slug);

  if (!event) {
    notFound();
  }

  const allEvents = await getCmsEvents();
  const pool = allEvents && allEvents.length > 0 ? allEvents : exhibitionEvents;
  const otherEvents = pool
    .filter((e) => e.id !== event.id)
    .slice(0, 3);

  const whatsappLink = `https://wa.me/919925015906?text=${encodeURIComponent(
    `Hello Ace Packaging, I would like to schedule a booth meeting at ${event.title} (${event.location}).`
  )}`;

  return (
    <div className="bg-[#FAF8F4] text-[#1A1D20] min-h-screen pb-20">
      {/* Top Header / Breadcrumb Bar */}
      <div className="bg-[#0E1110] text-white border-b border-white/10 pt-28 pb-8 sm:pt-32 sm:pb-10">
        <div className="container-custom">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d6b05d] hover:text-white transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Exhibitions &amp; Events</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-white bg-white/10 backdrop-blur-md border border-white/15">
              {event.category.toUpperCase()}
            </span>
            {event.badge && (
              <span className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#d6b05d] bg-[#cda24d]/20 border border-[#cda24d]/35">
                {event.badge}
              </span>
            )}
            <span className="text-xs text-gray-400 font-mono">
              {event.year} Conclave
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight max-w-4xl">
            {event.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#d6b05d]" />
              <span className="font-semibold text-white">{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#d6b05d]" />
              <span>{event.venue}, {event.city}</span>
            </div>
            {event.booth && (
              <div className="flex items-center gap-2 bg-[#d6b05d]/15 text-[#d6b05d] border border-[#d6b05d]/30 px-3 py-1 rounded-lg font-bold text-xs">
                <Building className="w-3.5 h-3.5" />
                <span>{event.booth}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container-custom py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Left Column: Poster Imagery & Full Story */}
          <div className="lg:col-span-7 space-y-10">
            {/* Poster Art / Photography Frame */}
            <div className="relative rounded-3xl overflow-hidden border border-[#E6DBC6] shadow-xl bg-black aspect-[4/3] sm:aspect-[16/10] max-h-[500px]">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              {/* Overlapping Bottom Badge */}
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
                <span className="inline-block px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-[#3f473c]/90 backdrop-blur-md text-[#ece5d8] border border-white/20 text-xs sm:text-sm font-black tracking-[0.16em] uppercase shadow-2xl">
                  {event.label}
                </span>
              </div>
            </div>

            {/* Exhibition Overview & Detailed Story */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DBC6] shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#b99750]">
                <Sparkles className="w-4 h-4" />
                <span>Exhibition Profile &amp; Mission</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#1A1D20]">
                Showcase Context &amp; Industry Scope
              </h2>

              <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                {event.description}
              </p>

              {event.fullStory?.map((para, pIdx) => (
                <p key={pIdx} className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Demonstrations & Highlights */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DBC6] shadow-xs">
              <h3 className="text-lg font-black text-[#1A1D20] mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#b99750]" />
                <span>What Ace Packaging Is Demonstrating</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {event.highlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E6DBC6] flex items-start gap-2.5 text-xs text-gray-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#b99750] shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Product Lines */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DBC6] shadow-xs">
              <h3 className="text-lg font-black text-[#1A1D20] mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#b99750]" />
                <span>Featured Container Lines on Display</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {event.focusProducts.map((prod, idx) => (
                  <Link
                    key={idx}
                    href={`/categories/${prod.slug}`}
                    className="group p-4 rounded-2xl bg-[#FAF8F4] hover:bg-white border border-[#E6DBC6] hover:border-[#b99750] transition-all flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#b99750] block mb-1">
                        Series {idx + 1}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-[#1A1D20] group-hover:text-[#b99750] transition-colors">
                        {prod.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {prod.desc}
                      </p>
                    </div>
                    <div className="mt-3 text-[11px] font-bold text-[#b99750] flex items-center gap-1">
                      <span>Explore line</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Consultation & VIP Pass Booking */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-6">
              {/* Event Location Quick Box */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E6DBC6] shadow-sm space-y-3 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="font-extrabold uppercase text-gray-500 text-[10px] tracking-wider">
                    Location &amp; Stand
                  </span>
                  <span className="font-mono text-gray-400 text-[11px]">{event.city}, {event.country}</span>
                </div>
                <div>
                  <div className="text-sm font-black text-[#1A1D20]">{event.venue}</div>
                  <div className="text-gray-500 mt-0.5">{event.location}</div>
                </div>
                {event.booth && (
                  <div className="p-2.5 rounded-xl bg-[#FAF8F4] border border-[#E6DBC6] flex items-center justify-between font-bold text-[#b99750]">
                    <span>Official Stand Allocation:</span>
                    <span>{event.booth}</span>
                  </div>
                )}
              </div>

              {/* Interactive Booking Form Component */}
              <EventBookingForm event={event} />

              {/* Direct WhatsApp Callout */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <p className="text-xs text-emerald-800 font-medium">
                  Need immediate stall passes or same-day appointment scheduling?
                </p>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebc59] text-white text-xs font-bold py-2.5 px-5 rounded-full uppercase tracking-wider transition-colors shadow-sm"
                >
                  <span>WhatsApp Event Desk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Other Exhibitions Strip */}
        <div className="mt-20 pt-10 border-t border-[#E6DBC6]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#b99750] block">
                Exhibition Calendar
              </span>
              <h3 className="text-xl font-black text-[#1A1D20]">
                Explore Other Upcoming Conclaves
              </h3>
            </div>
            <Link
              href="/events"
              className="text-xs font-bold text-[#b99750] hover:underline flex items-center gap-1"
            >
              <span>View All 8 Expos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherEvents.map((oe) => (
              <Link
                key={oe.id}
                href={`/events/${oe.slug}`}
                className="group bg-white rounded-3xl border border-[#E6DBC6] hover:border-[#b99750] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="relative h-44 w-full overflow-hidden bg-black">
                  <img
                    src={oe.image}
                    alt={oe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-xs font-bold text-white">
                    {oe.city}, {oe.country}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#b99750]">{oe.date}</span>
                    <h4 className="text-sm font-bold text-[#1A1D20] group-hover:text-[#b99750] transition-colors mt-1 line-clamp-1">
                      {oe.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{oe.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#b99750]">
                    <span>View Event Showcase</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
