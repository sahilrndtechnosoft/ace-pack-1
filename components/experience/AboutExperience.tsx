'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import { aboutHero, aboutStats, aboutOverview, milestones, mdDesk, values, plant, leadership } from '@/lib/data/about';
import { certifications } from '@/lib/data/quality';
import { buildTextReveals, refreshOnSettle } from './experience-motion';
import { buildAboutMotion } from './about-motion';
import './about.css';

gsap.registerPlugin(ScrollTrigger);

// Counts up from zero the first time it scrolls into view. Numbers group with
// commas to match the home page (1,500,000+), not the Indian lakh format.
function Count({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const counter = { value: 0 };
      gsap.to(counter, {
        value, duration: 1.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => { el.textContent = Math.round(counter.value).toLocaleString('en-US') + suffix; },
      });
    });
    return () => ctx.revert();
  }, [value, suffix]);
  return <b ref={ref}>{value.toLocaleString('en-US')}{suffix}</b>;
}

export default function AboutExperience() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = root.current;
    if (!scope) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const motion = buildAboutMotion(scope);
    const text = buildTextReveals(scope);
    const settle = refreshOnSettle(scope);
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { cancelAnimationFrame(refresh); settle(); text(); motion(); };
  }, []);

  return (
    <div ref={root} className="xa">
      <div className="xp-scroll-line" aria-hidden="true" />

      {/* 00 — Hero */}
      <section className="xa-hero" id="about-hero">
        <div className="xa-wrap">
          <div className="xa-hero-grid">
            <div>
              <span className="xp-eyebrow">{aboutHero.eyebrow}</span>
              <h1 aria-label={aboutHero.title.join(' ')}>
                {aboutHero.title.map((line, i) => (
                  <span className="xa-title-mask" key={line}><span>{i ? <em>{line}</em> : line}</span></span>
                ))}
              </h1>
              <p className="xa-hero-lead">{aboutHero.lead}</p>
            </div>
            <div className="xa-hero-media">
              <img src={aboutHero.image} alt={aboutHero.imageAlt} width="1200" height="900" fetchPriority="high" />
              <div className="xa-hero-chip"><b>{aboutHero.chip.value}</b><span>{aboutHero.chip.label}</span></div>
            </div>
          </div>
          <div className="xa-hero-bottom">
            <a href="#about-stats" className="xa-scroll-cue"><span><ArrowDown size={15} /></span>Scroll to discover</a>
            <span><i />ISO 9001:2015 · US FDA 21 CFR 177.1520</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="xa-stats" id="about-stats">
        <div className="xa-wrap">
          <div className="xa-stats-grid">
            {aboutStats.map(stat => (
              <div className="xa-stat" key={stat.label}>
                <Count value={stat.value} suffix={stat.suffix} />
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 01 — Overview */}
      <section className="xa-overview" id="overview">
        <div className="xa-wrap">
          <div className="xa-overview-grid">
            <div>
              <span className="xp-eyebrow">{aboutOverview.eyebrow}</span>
              <h2 data-split>{aboutOverview.title[0]} <em>{aboutOverview.title[1]}</em></h2>
              {aboutOverview.paragraphs.map(text => <p key={text.slice(0, 24)}>{text}</p>)}
              <ul className="xa-checks">
                {aboutOverview.points.map(point => <li key={point}><i />{point}</li>)}
              </ul>
            </div>
            <div className="xa-overview-media">
              <img src={aboutOverview.image} alt={aboutOverview.imageAlt} width="1200" height="900" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* 02 — Journey: a horizontal track that travels with the scroll */}
      <section className="xa-journey" id="journey">
        <div className="xa-journey-stage">
          <div className="xa-wrap xa-journey-head">
            <div>
              <span className="xp-eyebrow">02 / Our journey</span>
              <h2 className="xa-journey-title">Fifteen years, <em>five turning points.</em></h2>
            </div>
            <nav className="xa-year-nav" aria-label="Jump to a year">
              {milestones.map((m, i) => (
                <button type="button" className="xa-year-btn" data-index={i} key={m.year} aria-pressed={i === 0}>{m.year}</button>
              ))}
            </nav>
          </div>

          <div className="xa-track-viewport">
            <div className="xa-track-line" aria-hidden="true"><span /></div>
            <ol className="xa-track">
              {milestones.map((m, i) => (
                <li className={`xa-node${i === 0 ? ' is-active' : ''}`} data-index={i} key={m.year}>
                  <div className="xa-node-top"><span className="xa-node-year" aria-hidden="true">{m.year}</span></div>
                  <div className="xa-node-mid"><span className="xa-node-dot" /></div>
                  <div className="xa-node-card">
                    <span className="xp-eyebrow">{String(i + 1).padStart(2, '0')} / {m.year}</span>
                    <h3>{m.title}</h3>
                    <p>{m.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="xa-wrap xa-journey-foot">
            <span className="xp-eyebrow xa-journey-hint">Swipe or scroll to travel · tap a year to jump</span>
            <span className="xa-journey-count"><b>01</b> / {String(milestones.length).padStart(2, '0')}</span>
          </div>
        </div>
      </section>

      {/* MD's desk */}
      <section className="xa-desk" id="md-desk">
        <div className="xa-wrap">
          <div className="xa-desk-inner">
            <span className="xp-eyebrow">{mdDesk.eyebrow}</span>
            <blockquote>{mdDesk.quote}”</blockquote>
            <div className="xa-desk-sign">
              {mdDesk.portrait ? <img className="xa-desk-portrait" src={mdDesk.portrait} alt={mdDesk.name || 'Managing Director'} /> : <i />}
              <span>{mdDesk.name && <b>{mdDesk.name}</b>}{mdDesk.role}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="xa-values" id="values">
        <div className="xa-wrap">
          <span className="xp-eyebrow">What we stand for</span>
          <h2 data-split>Safest container. <em>Highest clarity.</em> Zero leaks.</h2>
          <div className="xa-values-grid">
            {values.map(v => (
              <div className="xa-value" key={v.num}>
                <span className="xp-eyebrow">{v.num}</span>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — Plant */}
      <section className="xa-plant" id="infrastructure">
        <div className="xa-pattern" aria-hidden="true" />
        <div className="xa-wrap xa-plant-inner">
          <span className="xp-eyebrow">{plant.eyebrow}</span>
          <h2 data-split>{plant.title[0]}<br /><em>{plant.title[1]}</em></h2>
          <div className="xa-plant-copy">
            <p>{plant.body}</p>
            <Link href="/capabilities">Inside our capabilities <ArrowUpRight size={18} /></Link>
          </div>
          <div className="xa-plant-grid">
            {plant.stats.map(stat => (
              <div className="xa-plant-stat" key={stat.label}><b>{stat.value}</b><p>{stat.label}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="xa-leadership" id="leadership">
        <div className="xa-wrap">
          <span className="xp-eyebrow">04 / Leadership</span>
          <h2 data-split>Four remits. <em>One plant floor.</em></h2>
          <div className="xa-lead-grid">
            {leadership.map((person, i) => (
              <div className="xa-lead" key={person.role}>
                <span className="xa-lead-num">{String(i + 1).padStart(2, '0')}</span>
                {person.portrait && <img className="xa-lead-portrait" src={person.portrait} alt={person.name || person.role} loading="lazy" />}
                <h3>{person.role}</h3>
                {person.name && <span className="xa-lead-name">{person.name}</span>}
                <p>{person.remit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="xa-certs" id="certifications">
        <div className="xa-wrap">
          <div className="xa-certs-head">
            <div>
              <span className="xp-eyebrow">05 / Certifications</span>
              <h2 data-split>Certified at the material, the facility and the process.</h2>
            </div>
            <Link href="/quality">Quality &amp; testing <ArrowUpRight size={16} /></Link>
          </div>
          <div className="xa-certs-grid">
            {certifications.map(cert => (
              <div className="xa-cert" key={cert.id}>
                <span className="xp-eyebrow">{cert.scope}</span>
                <h3>{cert.title}</h3>
                <p>{cert.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="xa-closing" id="closing">
        <div className="xa-wrap">
          <span className="xp-eyebrow">Wholesale catalog &amp; sample kit</span>
          <h2 data-split>Let’s make <em>something good.</em></h2>
          <Link href="/contact" className="xp-button">Request wholesale pricing <ArrowRight size={18} /></Link>
          <span className="xa-closing-note">Daman, India · sales@acepack.co.in · +91 99250 15906</span>
        </div>
      </section>
    </div>
  );
}
