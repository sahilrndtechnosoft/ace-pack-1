'use client';

import { useEffect, useState } from 'react';
import { Palette, RotateCcw, X } from 'lucide-react';
import './style-preview.css';

const palettes = [
  { name: 'Petrol / terracotta', paper: '#fafbf7', ink: '#123b40', accent: '#b74725', secondary: '#17665e' },
  { name: 'Cobalt / copper', paper: '#f5f7fc', ink: '#172d4e', accent: '#a24614', secondary: '#1f5aa6' },
  { name: 'Navy / coral', paper: '#fff8f2', ink: '#1d3045', accent: '#af3e37', secondary: '#3a7184' },
  { name: 'Plum / sage', paper: '#fbf9f5', ink: '#353047', accent: '#7c3e67', secondary: '#536646' },
  { name: 'Graphite / amber', paper: '#f8fafc', ink: '#242b35', accent: '#9c4f06', secondary: '#52616b' },
  { name: 'Forest / ochre', paper: '#f8faf6', ink: '#16382c', accent: '#965309', secondary: '#34704a' },
  { name: 'Indigo / mint', paper: '#f6f7ff', ink: '#272b59', accent: '#524397', secondary: '#267067' },
  { name: 'Burgundy / sand', paper: '#fffaf7', ink: '#482631', accent: '#9b3647', secondary: '#7d6750' },
  { name: 'Ocean / clay', paper: '#f4fafc', ink: '#173e52', accent: '#a74429', secondary: '#246f86' },
  { name: 'Charcoal / violet', paper: '#faf9ff', ink: '#2e293d', accent: '#6c4293', secondary: '#5e6679' },
];
const sansFonts = [
  ['Manrope', 'var(--font-manrope)'], ['DM Sans', 'var(--font-dm-sans)'],
  ['Space Grotesk', 'var(--font-space-grotesk)'], ['Plus Jakarta Sans', 'var(--font-jakarta)'],
  ['Outfit', 'var(--font-outfit)'],
  ['System sans', 'system-ui, sans-serif'],
];
const serifFonts = [
  ['Instrument Serif', 'var(--font-instrument)'], ['Source Serif 4', 'var(--font-source-serif)'],
  ['Lora', 'var(--font-lora)'], ['DM Serif Display', 'var(--font-dm-serif)'],
  ['Cormorant Garamond', 'var(--font-cormorant)'],
  ['Classic serif', 'Georgia, serif'], ['Match body font', 'var(--font-sans)'],
];
const mix = (a:string, percent:number, b:string) => `color-mix(in srgb, ${a} ${percent}%, ${b})`;
const storageKey = 'ace-packaging-style-preview-v1';

export function StylePreview() {
  const [sans, setSans] = useState(sansFonts[0][1]);
  const [serif, setSerif] = useState(serifFonts[0][1]);
  const [colors, setColors] = useState(palettes[0]);
  const [tracking, setTracking] = useState(-.02);
  const [leading, setLeading] = useState(1.1);
  const [restored, setRestored] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const preset = palettes.findIndex(p => ['paper','ink','accent','secondary'].every(key => p[key as keyof typeof p] === colors[key as keyof typeof colors]));

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (saved && typeof saved === 'object') {
        if (sansFonts.some(([,value]) => value === saved.sans)) setSans(saved.sans);
        if (serifFonts.some(([,value]) => value === saved.serif)) setSerif(saved.serif);
        const c = saved.colors;
        if (c && ['paper','ink','accent','secondary'].every(key => typeof c[key] === 'string' && /^#[\da-f]{6}$/i.test(c[key]))) {
          setColors({ name:'Saved colours', paper:c.paper, ink:c.ink, accent:c.accent, secondary:c.secondary });
        }
        if (typeof saved.tracking === 'number' && saved.tracking >= -.025 && saved.tracking <= .04) setTracking(saved.tracking);
        if (typeof saved.leading === 'number' && saved.leading >= 1.02 && saved.leading <= 1.25) setLeading(saved.leading);
      }
    } catch { /* Ignore unreadable or outdated preferences. */ }
    finally { setRestored(true); }
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ sans, serif, colors, tracking, leading }));
      setStorageError(false);
    } catch { setStorageError(true); }
  }, [restored, sans, serif, colors, tracking, leading]);

  useEffect(() => {
    if (!restored) return;
    const root = document.documentElement;
    root.dataset.stylePreview = 'true';
    root.style.setProperty('--font-sans', sans);
    root.style.setProperty('--font-serif', serif);
    root.style.setProperty('--heading-tracking', tracking + 'em');
    root.style.setProperty('--heading-leading', String(leading));
    let current = true;
    const styles = getComputedStyle(root);
    Promise.allSettled([
      document.fonts.load('400 16px ' + styles.getPropertyValue('--font-sans')),
      document.fonts.load('italic 400 16px ' + styles.getPropertyValue('--font-serif')),
    ]).then(() => { if (current) window.dispatchEvent(new Event('resize')); });
    return () => { current = false; };
  }, [restored, sans, serif, tracking, leading]);

  useEffect(() => {
    if (!restored) return;
    const { paper, ink, accent, secondary } = colors;
    const variables: Record<string,string> = {
      '--ace-paper': paper, '--ace-ink': ink, '--ace-orange': accent, '--ace-teal': secondary,
      '--ace-muted': mix(ink, 72, paper), '--ace-aqua': mix(secondary, 16, paper),
      '--ace-aqua-soft': mix(secondary, 6, paper), '--ace-aqua-line': mix(secondary, 24, paper),
      '--ace-line': mix(ink, 16, paper), '--ace-image-surface': mix(secondary, 7, paper),
      '--ace-light-text': mix(paper, 84, ink), '--ace-dark-line': mix(paper, 24, ink),
      '--ace-dark-surface': mix(paper, 8, ink), '--ace-orange-bright': mix(accent, 65, paper),
      '--ace-pale-blue': mix(secondary, 8, paper), '--ace-pale-peach': mix(accent, 7, paper),
      '--ace-header-surface': mix(paper, 96, 'transparent'), '--ace-shadow': mix(ink, 5, 'transparent'),
      '--ace-photo-shade': mix(ink, 85, 'transparent'),
    };
    for (const [key, value] of Object.entries(variables)) {
      if (preset === 0) document.documentElement.style.removeProperty(key);
      else document.documentElement.style.setProperty(key, value);
    }
  }, [restored, colors, preset]);

  function reset() {
    setSans(sansFonts[0][1]); setSerif(serifFonts[0][1]); setColors(palettes[0]);
    setTracking(-.02); setLeading(1.1);
  }

  return <>
    <button type="button" className="style-preview-trigger" popoverTarget="site-style-preview" aria-label="Open font and colour preview" title="Fonts & colours">
      <Palette size={20}/><span>Fonts & colours</span>
    </button>
    <section id="site-style-preview" popover="auto" className="style-preview" aria-labelledby="style-preview-title" data-lenis-prevent>
      <div className="style-preview-header"><div><p>Try it on the site</p><h2 id="style-preview-title">Fonts & colours</h2></div><button type="button" popoverTarget="site-style-preview" popoverTargetAction="hide" aria-label="Close style preview"><X size={20}/></button></div>
      <p className="style-preview-note" role="status">{storageError ? 'Preview works, but this browser could not save your choices.' : 'Your choices are saved automatically in this browser, including after refresh.'}</p>
      <label>Body & heading font<select aria-label="Body & heading font" value={sans} onChange={e => setSans(e.target.value)}>{sansFonts.map(([name,value]) => <option value={value} key={name}>{name}</option>)}</select></label>
      <label>Accent font<select aria-label="Accent font" value={serif} onChange={e => setSerif(e.target.value)}>{serifFonts.map(([name,value]) => <option value={value} key={name}>{name}</option>)}</select></label>
      <label>Colour palette<select aria-label="Colour palette" value={preset < 0 ? 'custom' : preset} onChange={e => { const selected = palettes[Number(e.target.value)]; if (selected) setColors(selected); }}>{palettes.map((p,i) => <option value={i} key={p.name}>{p.name}</option>)}<option value="custom" disabled>Custom colours</option></select></label>
      <div className="style-preview-colors">{([['paper','Background'],['ink','Text'],['accent','Accent'],['secondary','Secondary']] as const).map(([key,label]) => <label key={key}><input type="color" aria-label={label + ' colour'} value={colors[key]} onInput={e => { const value = e.currentTarget.value; setColors(p => ({ ...p, [key]: value })); }}/><span>{label}</span><small>{colors[key]}</small></label>)}</div>
      <label>Heading letter spacing <output>{tracking.toFixed(3)} em</output><input aria-label="Heading letter spacing" type="range" min="-0.025" max="0.04" step="0.005" value={tracking} onChange={e => setTracking(Number(e.target.value))}/></label>
      <label>Heading line spacing <output>{leading.toFixed(2)}</output><input aria-label="Heading line spacing" type="range" min="1.02" max="1.25" step="0.01" value={leading} onChange={e => setLeading(Number(e.target.value))}/></label>
      <button type="button" className="style-preview-reset" onClick={reset}><RotateCcw size={16}/>Reset to default</button>
    </section>
  </>;
}
