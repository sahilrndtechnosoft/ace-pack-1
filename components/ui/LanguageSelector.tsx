'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Languages, ChevronDown, ArrowUpRight } from 'lucide-react';
import { languages } from '@/lib/data/languages';
import { translatedWebsiteUrl } from '@/lib/website-translation';
import './language-selector.css';

export function LanguageSelector() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('en');
  const [page, setPage] = useState('');
  const pathname = usePathname();
  useEffect(() => {
    setPage(window.location.href);
    try {
      const saved = localStorage.getItem('ace-packaging-language');
      if (languages.some(item => item.code === saved)) setSelected(saved!);
    } catch { /* Language selection remains usable without storage. */ }
  }, [pathname]);
  const matches = languages.filter(item => `${item.name} ${item.code}`.toLowerCase().includes(query.trim().toLowerCase()));
  const name = languages.find(item => item.code === selected)?.name || 'English';
  const href = translatedWebsiteUrl(page, selected);
  return <div className="language-selector" translate="no">
    <button type="button" popoverTarget="site-languages" aria-label="Choose website language" className="language-trigger">
      <Languages size={20} /><span>Languages</span><ChevronDown size={14} />
    </button>
    <div id="site-languages" popover="auto" className="language-panel" data-lenis-prevent>
      <div className="language-heading"><strong>Choose your language</strong><button type="button" popoverTarget="site-languages" popoverTargetAction="hide" aria-label="Close language selector">×</button></div>
      <p>Read the published website in Google Translate’s free translated view.</p>
      <label htmlFor="language-search">Search {languages.length} languages</label>
      <input id="language-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search a language or code" autoComplete="off" />
      <label htmlFor="language-choice">Language</label>
      <select id="language-choice" size={7} value={matches.some(item => item.code === selected) ? selected : ''} onChange={e => {
        setSelected(e.target.value);
        try { localStorage.setItem('ace-packaging-language', e.target.value); } catch { /* Optional preference. */ }
      }}>
        {matches.map(item => <option key={item.code} value={item.code}>{item.name} · {item.code}</option>)}
      </select>
      {!matches.length && <p role="status">No matching languages. Try another spelling.</p>}
      {selected === 'en' ? <p className="language-note">You’re viewing the original English website.</p> : href ?
        <a className="language-open" href={href} target="_blank" rel="noopener noreferrer">View in {name} <ArrowUpRight size={18} /><span className="sr-only"> (opens Google Translate in a new tab)</span></a> :
        <p className="language-note" role="status">Google Translate cannot access this local preview. On localhost, use your browser’s Translate page option. This link becomes available on the public website.</p>}
      <p className="language-note">Machine translations may vary. Original English specifications remain the reference.</p>
    </div>
  </div>;
}
