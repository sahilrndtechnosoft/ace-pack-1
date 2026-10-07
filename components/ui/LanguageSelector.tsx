'use client';

import { useEffect, useRef, useState } from 'react';
import { Languages, ChevronDown } from 'lucide-react';
import { languagePreference, translationNavigationUrl } from '@/lib/website-translation';
import './language-selector.css';

type TranslateWindow = Window & {
  google?: { translate?: { TranslateElement: new (options: {pageLanguage:string;autoDisplay:boolean},host:string) => unknown } };
  acePackagingTranslateReady?: () => void;
};
const storageKey = 'ace-packaging-language';

export function LanguageSelector() {
  const host = useRef<HTMLDivElement>(null);
  const activeLanguage = useRef('en');
  const [ready,setReady] = useState(false);
  const [error,setError] = useState(false);
  const [attempt,setAttempt] = useState(0);
  useEffect(() => {
    const target = host.current;
    if (!target) return;
    let saved: string | null = null;
    try { saved = localStorage.getItem(storageKey); } catch { /* Storage is optional. */ }
    const language = languagePreference(document.cookie,saved);
    activeLanguage.current = language;
    document.cookie = `googtrans=/en/${language};path=/;SameSite=Lax`;
    document.documentElement.dataset.siteLanguage = language;
    document.documentElement.lang = language;
    const browser = window as TranslateWindow;
    let disposed = false;
    let started = (target.querySelector<HTMLSelectElement>('.goog-te-combo')?.options.length ?? 0) > 1;
    const init = () => {
      if (disposed || started || !browser.google?.translate) return;
      started = true;
      target.replaceChildren();
      new browser.google.translate.TranslateElement({pageLanguage:'en',autoDisplay:false},target.id);
    };
    const observe = () => {
      const select = target.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (select && select.options.length > 1) {
        select.setAttribute('aria-label','Website language');
        setReady(true);
        setError(false);
      }
    };
    const observer = new MutationObserver(observe);
    observer.observe(target,{childList:true,subtree:true});
    observe();
    const change = (event: Event) => {
      const select = event.target;
      if (!(select instanceof HTMLSelectElement) || !select.value) return;
      const code = select.value;
      const previous = activeLanguage.current;
      activeLanguage.current = code;
      try { localStorage.setItem(storageKey,code); } catch { /* Cookie still preserves page navigation. */ }
      document.cookie = `googtrans=/en/${code};path=/;SameSite=Lax`;
      document.documentElement.dataset.siteLanguage = code;
      document.documentElement.lang = code;
      // Revert word-splitting before Google's handler changes any text nodes.
      if (code === 'en' && previous !== 'en') window.location.reload();
      else window.dispatchEvent(new Event('ace-language-change'));
    };
    target.addEventListener('change',change,true);
    const navigate = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
      const url = translationNavigationUrl(link.href,location.href,activeLanguage.current);
      if (!url) return;
      event.preventDefault();
      event.stopPropagation();
      window.location.assign(url);
    };
    document.addEventListener('click',navigate,true);
    // On history traversal, restore translation on a clean document as well.
    const history = () => { if (activeLanguage.current !== 'en') window.location.reload(); };
    window.addEventListener('popstate',history);
    browser.acePackagingTranslateReady = () => { document.fonts.ready.then(init); };
    setError(false);
    if (browser.google?.translate) document.fonts.ready.then(init);
    else {
      let script = document.getElementById('ace-translate-script') as HTMLScriptElement | null;
      if (script?.dataset.failed) { script.remove(); script = null; }
      if (!script) {
        script = document.createElement('script');
        script.id = 'ace-translate-script';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=acePackagingTranslateReady';
        script.async = true;
        document.head.appendChild(script);
      }
      script.onerror = () => { if (!disposed) { script!.dataset.failed = 'true'; setError(true); } };
    }
    const timeout = window.setTimeout(() => { if ((target.querySelector<HTMLSelectElement>('.goog-te-combo')?.options.length ?? 0) < 2) setError(true); },20000);
    return () => {
      disposed = true;
      observer.disconnect();
      target.removeEventListener('change',change,true);
      document.removeEventListener('click',navigate,true);
      window.removeEventListener('popstate',history);
      clearTimeout(timeout);
    };
  },[attempt]);
  return <div className="language-selector notranslate" translate="no">
    <button type="button" popoverTarget="site-languages" aria-label="Choose website language" className="language-trigger">
      <Languages size={20} /><span>Languages</span><ChevronDown size={14} />
    </button>
    <div id="site-languages" popover="auto" className="language-panel" data-lenis-prevent>
      <div className="language-heading"><strong>Choose your language</strong><button type="button" popoverTarget="site-languages" popoverTargetAction="hide" aria-label="Close language selector">×</button></div>
      <p className="language-intro">Translate this page. Your choice stays active across pages and refreshes.</p>
      <div id="ace-google-translate" ref={host} />
      {!ready && <p role="status">{error ? 'The translator could not load. Check your connection or allow Google Translate in your browser.' : 'Loading available languages…'}</p>}
      {error && <button type="button" className="language-retry" onClick={()=>setAttempt(value=>value+1)}>Retry translator</button>}
    </div>
  </div>;
}
