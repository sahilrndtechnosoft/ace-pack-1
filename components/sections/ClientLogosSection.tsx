import React from 'react';
import type { homeClients } from '@/lib/cms/pages/home';
import './client-logos.css';

/**
 * "Our Clients" logo strip. Logos come from Admin → Pages → Home → Our Clients; entries without an image
 * are ignored, and the section stays hidden until at least one logo is uploaded.
 */
export function ClientLogosSection({ content }: { content: typeof homeClients }) {
  const logos = content.logos.filter((logo) => logo.image?.trim());
  if (logos.length === 0) return null;
  // Short lists sit still and centred; longer ones loop as a slow marquee (list rendered twice for a seamless loop).
  const isMarquee = logos.length >= 6;

  return (
    <section id="clients" className="relative bg-[var(--ace-paper)] py-16 sm:py-20 border-b border-[var(--ace-line)] overflow-hidden">
      <div className="container-custom text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-gold)]">{content.eyebrow}</span>
        <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--ace-ink)]">{content.heading}</h2>
        {content.intro && <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">{content.intro}</p>}
      </div>

      <div className={isMarquee ? 'client-marquee' : 'container-custom'}>
        <ul className={isMarquee ? 'client-marquee-track' : 'flex flex-wrap items-center justify-center gap-4 sm:gap-6'}>
          {(isMarquee ? [...logos, ...logos] : logos).map((logo, i) => (
            <li
              key={`${logo.image}-${i}`}
              aria-hidden={isMarquee && i >= logos.length ? true : undefined}
              className="flex h-20 w-40 sm:h-24 sm:w-48 shrink-0 items-center justify-center rounded-2xl border border-[var(--ace-line)] bg-white px-5"
            >
              <img
                src={logo.image}
                alt={logo.name || 'Client logo'}
                loading="lazy"
                decoding="async"
                className="max-h-12 sm:max-h-14 w-auto max-w-full object-contain grayscale opacity-75 transition duration-300 hover:grayscale-0 hover:opacity-100"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
