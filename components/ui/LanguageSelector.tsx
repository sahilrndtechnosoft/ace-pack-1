'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Languages, ChevronDown, Check } from 'lucide-react';
import { languages } from '@/lib/data/languages';
import { translatedWebsiteUrl } from '@/lib/website-translation';
import './language-selector.css';

// The published version is available to Google's translator; localhost is not.
const publishedSite = process.env.NEXT_PUBLIC_SITE_URL || 'https://ace-pack-1.vercel.app';

export function LanguageSelector() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('en');
  const [page, setPage] = useState('');
  const pathname = usePathname();
  useEffect(() => {
    // Restore once. Route changes must not replace a choice being made.
    try {
      const translated = new URL(location.href).searchParams.get('_x_tr_tl');
      const saved = translated || localStorage.getItem('ace-packaging-language');
      if (languages.some(item => item.code === saved)) setSelected(saved!);
    } catch { /* Language selection remains usable without storage. */ }
  }, []);
  useEffect(() => { setPage(window.location.href); }, [pathname]);
  const matches = languages.filter(item => `${item.name} ${item.code}`.toLowerCase().includes(query.trim().toLowerCase()));
  const name = languages.find(item => item.code === selected)?.name || 'English';
  const href = translatedWebsiteUrl(page, selected, publishedSite);
  const localPreview = page && !new URL(page).hostname.endsWith('.translate.goog') && !translatedWebsiteUrl(page, 'hi');
  function chooseLanguage(code: string) {
    setSelected(code);
    setQuery('');
    try { localStorage.setItem('ace-packaging-language', code); } catch { /* Optional preference. */ }
  }
  return <div className="language-selector" translate="no">
    <button type="button" popoverTarget="site-languages" aria-label="Choose website language" className="language-trigger" onClick={() => setQuery('')}>
      <Languages size={20} /><span>Languages</span><ChevronDown size={14} />
    </button>
    <div id="site-languages" popover="auto" className="language-panel" data-lenis-prevent>
      <div className="language-heading"><strong>Choose your language</strong><button type="button" popoverTarget="site-languages" popoverTargetAction="hide" aria-label="Close language selector">×</button></div>
      <p className="language-intro">Choose a language, then apply it.</p>
      <label htmlFor="language-search">Search {languages.length} languages</label>
      <input id="language-search" type="search" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => {
        if (e.key === 'Enter' && matches.length === 1) { e.preventDefault(); chooseLanguage(matches[0].code); }
      }} placeholder="Search a language or code" autoComplete="off" />
      <div className="language-options" role="group" aria-label="Available languages" data-lenis-prevent>
        {matches.map(item => <button type="button" key={item.code} aria-pressed={selected === item.code} onClick={() => chooseLanguage(item.code)}>
          <span>{item.name}</span><small>{item.code}</small>{selected === item.code && <Check size={18} aria-hidden="true" />}
        </button>)}
        {!matches.length && <p role="status">No matching languages. Try another spelling.</p>}
      </div>
      <div className="language-footer">
        <p className="language-selected" role="status">Selected: <strong>{name}</strong></p>
        {href ? <a className="language-open" href={href}>{selected === 'en' ? 'View original English' : `Apply ${name}`}<span aria-hidden="true">→</span></a> : <p role="status">Translation link is unavailable. Please reopen the selector.</p>}
        <p className="language-note">{localPreview ? 'Local preview: opens the published site. ' : ''}{selected !== 'en' && 'Opens Google’s free translated view in this tab.'}</p>
      </div>
    </div>
  </div>;
}
