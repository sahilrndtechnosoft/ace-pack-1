'use client';

import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, MotionConfig, useReducedMotion, type MotionProps } from 'framer-motion';
import { ArrowDown, ArrowUpRight, ArrowRight, Plus, Pause, Play, Rotate3D, MoveUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products, containerFinishes, initialSceneState, defaultFinish } from './config';
import { buildScrollMotion, buildTextReveals, refreshOnSettle } from './experience-motion';
import './experience.css';

const PackagingScene = dynamic(() => import('./PackagingScene'), { ssr: false });
gsap.registerPlugin(ScrollTrigger);
class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed:false };
  static getDerivedStateFromError() { return { failed:true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}
function MagneticLink({ href, children, light=false }: { href:string; children:ReactNode; light?:boolean }) {
  const ref=useRef<HTMLAnchorElement>(null);
  const reduced=useReducedMotion();
  return <Link ref={ref} href={href} className={`xp-button ${light?'xp-button-light':''}`} onPointerMove={e=>{
    if(reduced||e.pointerType!=='mouse'||!ref.current)return;
    const r=ref.current.getBoundingClientRect();gsap.to(ref.current,{x:(e.clientX-r.left-r.width/2)*.13,y:(e.clientY-r.top-r.height/2)*.18,duration:.3,overwrite:true});
  }} onPointerLeave={()=>{if(ref.current)gsap.to(ref.current,{x:0,y:0,duration:.5,overwrite:true});}}>{children}<ArrowUpRight size={18}/></Link>;
}
function Reveal({ children, className='' }: { children:ReactNode; className?:string }) {
  const reduced=useReducedMotion();
  return <motion.div className={className} initial={reduced?false:{opacity:0,y:32}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.75,ease:[.22,1,.36,1]}}>{children}</motion.div>;
}
function Count({ value, suffix='' }: { value:number; suffix?:string }) {
  const ref=useRef<HTMLSpanElement>(null);const reduced=useReducedMotion();
  useEffect(()=>{
    const el=ref.current;if(!el||reduced)return;
    const context=gsap.context(()=>{const counter={value:0};gsap.to(counter,{value,duration:1.6,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 90%',once:true},onUpdate:()=>{el.textContent=Math.round(counter.value).toLocaleString('en-US')+suffix;}});});return()=>context.revert();
  },[value,suffix,reduced]);
  return <span ref={ref}>{value.toLocaleString('en-US')}{suffix}</span>;
}
const craftFacts=[
  {title:'100% virgin\nPP 05.',body:'US FDA 21 CFR 177.1520 certified food-grade polymer. Completely BPA-free, heavy-metal free and non-toxic.',tag:'01 / Material integrity'},
  {title:'Zero-leak\nsnap rim.',body:'A hermetically tight rim seal that stops sauce and liquid escaping on a motorcycle delivery run.',tag:'02 / Sealed for the ride'},
  {title:'−20°C to\n+120°C.',body:'From deep-freeze storage through to hot curry and microwave reheating, with no warping or crazing.',tag:'03 / Extreme thermal range'},
];
export default function HomeExperience() {
  const root=useRef<HTMLDivElement>(null),state=useRef(initialSceneState());
  const [mode,setMode]=useState<'pending'|'3d'|'static'>('pending');
  const [ready,setReady]=useState(false),[progress,setProgress]=useState(0),[loadRange,setLoadRange]=useState(false);
  const [paused,setPaused]=useState(false),[renderActive,setRenderActive]=useState(true),[activeProduct,setActiveProduct]=useState(0);
  const [craftPhase,setCraftPhase]=useState(0),[openLid,setOpenLid]=useState(false),[fallbackReason,setFallbackReason]=useState('');
  const [finish,setFinish]=useState(defaultFinish);const [retry,setRetry]=useState(0);const [chapter,setChapter]=useState('main-content');const dragging=useRef<number|null>(null);const reduced=useReducedMotion();
  const onReady=useCallback(()=>{setReady(true);},[]);
  const onFailure=useCallback(()=>{setFallbackReason('renderer-unavailable');setMode('static');setReady(true);},[]);
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    // Phones get the 3D scene too; the old `(max-width:767px)` clause here put
    // every phone on the static stills, which is why mobile had nothing moving.
    //
    // Deliberately no hardware pre-check. deviceMemory/hardwareConcurrency are
    // crude and widely under-reported — Safari omits deviceMemory entirely, it
    // needs a secure context so it is undefined over a LAN IP, and privacy
    // modes pin hardwareConcurrency to 2 — so gating the headline feature on
    // them took 3D away from capable desktops. Capability is instead measured
    // for real: SceneBoundary catches a renderer that throws, the
    // webglcontextlost handler catches one that dies, and the load timeout
    // catches one that never arrives. All three fall back to stills.
    const detect=()=>{
      if(media.matches||paused){setFallbackReason(paused?'paused':'motion-preference');setMode('static');setReady(true);return;}
      setFallbackReason('');setMode('3d');setReady(false);
    };
    detect();media.addEventListener('change',detect);return()=>media.removeEventListener('change',detect);
  },[paused,retry]);
  useEffect(()=>{
    if(mode!=='3d'||ready)return;
    const timeout=window.setTimeout(onFailure,30000);return()=>clearTimeout(timeout);
  },[mode,ready,onFailure]);
  useEffect(()=>{const tween=gsap.to(state.current,{inspect:openLid?1:0,duration:.8,ease:'power2.inOut'});return()=>{tween.kill();};},[openLid,mode]);
  useEffect(()=>{const tween=gsap.to(state.current,{finish,duration:.65,ease:'power2.inOut'});return()=>{tween.kill();};},[finish,mode]);
  useEffect(()=>{
    if(mode!=='3d')return;
    const craft=document.getElementById('craft');if(!craft)return;
    const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setLoadRange(true);observer.disconnect();}},{rootMargin:'1000px'});
    observer.observe(craft);return()=>observer.disconnect();
  },[mode]);
  // Scroll-driven DOM motion and heading text reveals. Both run in either
  // render mode: phones always fall back to static mode below 768px, and
  // gating this behind the 3D path is what used to leave them motionless.
  useEffect(()=>{
    const scope=root.current;
    if(mode==='pending'||!scope||reduced)return;
    const motion=buildScrollMotion(scope,mode==='3d');
    const text=buildTextReveals(scope);
    const settle=refreshOnSettle(scope);
    // Both effects have committed by the time this frame runs, so one refresh
    // here also re-measures the scene triggers created below.
    const refresh=requestAnimationFrame(()=>ScrollTrigger.refresh());
    return()=>{cancelAnimationFrame(refresh);settle();text();motion();};
  },[mode,reduced]);
  // Scene-state scrubbing — genuinely 3D-only, since it drives the values the
  // renderer reads and the layer it draws into.
  useEffect(()=>{
    if(mode!=='3d'||!root.current)return;
    const ctx=gsap.context(()=>{
      const headerOffset=()=>document.querySelector('body>header')?.getBoundingClientRect().height??84;
      ['main-content','craft','collection','manufacturing','closing'].forEach(id=>ScrollTrigger.create({trigger:`#${id}`,start:'top 55%',end:'bottom 55%',onToggle:self=>{if(self.isActive)setChapter(id);}}));
      gsap.fromTo(state.current,{hero:0},{hero:1,immediateRender:false,ease:'none',scrollTrigger:{trigger:'#craft',start:'top bottom',end:()=>`top ${headerOffset()}`,scrub:true}});
      gsap.fromTo(state.current,{craft:0},{craft:1,immediateRender:false,ease:'none',scrollTrigger:{trigger:'#craft',start:()=>`top ${headerOffset()}`,end:'bottom bottom',scrub:true,onUpdate:self=>{setCraftPhase(Math.min(2,Math.floor(self.progress*3)));}}});
      const collectionProgress={value:0};
      gsap.fromTo(collectionProgress,{value:0},{value:1,ease:'none',immediateRender:false,onUpdate:()=>{
        const p=collectionProgress.value;
        state.current.range=p<.23?p/.23:p<.43?1:p<.5?1+(p-.43)/.07:p<.70?2:p<.77?2+(p-.70)/.07:3;
        setActiveProduct(Math.max(0,Math.min(2,Math.round(state.current.range)-1)));
      },scrollTrigger:{trigger:'#collection',start:'top bottom',end:'bottom bottom',scrub:true}});
      gsap.fromTo(state.current,{finale:0},{finale:1,immediateRender:false,ease:'none',scrollTrigger:{trigger:'#closing',start:'top bottom',end:'top top',scrub:true}});
      ScrollTrigger.create({trigger:'#manufacturing',start:'top top',endTrigger:'#closing',end:'top bottom',onToggle:self=>{state.current.active=!self.isActive;setRenderActive(!self.isActive);}});
      gsap.to('.xp-scene-layer',{opacity:0,ease:'none',scrollTrigger:{trigger:'#footer',start:'top bottom',end:'top 40%',scrub:true}});
    },root);
    const pointer=(e:PointerEvent)=>{state.current.pointerX=e.clientX/window.innerWidth*2-1;state.current.pointerY=1-e.clientY/window.innerHeight*2;};
    window.addEventListener('pointermove',pointer,{passive:true});
    return()=>{ctx.revert();window.removeEventListener('pointermove',pointer);state.current=initialSceneState();};
  },[mode]);
  const live=mode==='3d';
  // Static mode (every phone, plus desktop "still" mode) has no scene driving
  // these panels, so they render stacked and previously appeared with no
  // entrance motion at all — the bulk of the mobile page was motionless.
  // Reveal them on scroll instead. Keyed on `revealMotion` so resolving the
  // mode remounts the element and framer-motion actually applies `initial`;
  // the server-rendered markup stays visible, so content survives without JS.
  const revealMotion=mode!=='pending'&&!live&&!reduced;
  const panelMotion=(visible:boolean,offset:number):MotionProps=>revealMotion
    ?{initial:{opacity:0,y:30},whileInView:{opacity:1,y:0},viewport:{once:true,amount:.15}}
    :{animate:{opacity:visible?1:0,y:visible?0:offset}};
  return <MotionConfig reducedMotion="user"><div ref={root} className={`xp-home ${live?'xp-live':'xp-static'}`} data-render-reason={fallbackReason}>
    <a href="#main-content" className="xp-skip">Skip to content</a>
    {live&&<div className="xp-scene-layer" aria-hidden="true"><SceneBoundary key={retry} onError={onFailure}><PackagingScene state={state} renderActive={renderActive} loadRange={loadRange} onReady={onReady} onProgress={setProgress} onFailure={onFailure}/></SceneBoundary></div>}
    {live&&!ready&&<div className="xp-loader" role="status"><span className="xp-loader-logo">acepack<span>.</span></span><span className="xp-eyebrow">Good things are taking shape</span><div role="progressbar" aria-label="Loading 3D packaging" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} className="xp-loader-track"><span style={{width:`${progress}%`}}/></div><span>{Math.round(progress)}%</span><button onClick={onFailure}>Continue with still images <ArrowRight size={14}/></button></div>}
    <div className="xp-scroll-line" aria-hidden="true"/>
    <nav className="xp-chapters" aria-label="Homepage chapters">{[['main-content','Start'],['craft','The craft'],['collection','Collection'],['manufacturing','Our thinking'],['closing','Let’s talk']].map(([id,label],i)=><a key={id} href={`#${id}`} aria-label={`Jump to ${label}`} aria-current={chapter===id?'location':undefined}><span>{label}</span><b>0{i+1}</b></a>)}</nav>
    <section id="main-content" className="xp-hero">
      <div className="xp-hero-topline"><span><i/> Smart, sustainable packaging for brands.</span><span>AcePack / Container solutions</span></div>
      <div className="xp-hero-copy"><p className="xp-eyebrow">US FDA food-grade · ISO 9001:2015</p><h1 aria-label="Beyond the box.">{['Beyond','the box.'].map((line,i)=><span className={`xp-title-mask ${i?'xp-serif':''}`} key={line}><motion.span initial={reduced?false:{y:'110%'}} animate={{y:ready||!live?0:'110%'}} transition={{duration:1.1,delay:.15*i,ease:[.22,1,.36,1]}}>{line}</motion.span></span>)}</h1><p className="xp-hero-description">Injection-moulded food containers in 100% prime virgin PP 05.<br/>Engineered for zero-leak delivery, from our Daman plant.</p><MagneticLink href="#craft">Unpack the difference</MagneticLink><div className="xp-hero-material">{live?<><span className="xp-finish-label">Explore a finish</span><div className="xp-finishes" aria-label="Preview container finish">{containerFinishes.map(({name},i)=><button key={name} aria-label={`${name} finish`} aria-pressed={finish===i} onClick={()=>setFinish(i)}><i data-finish={name}/><span>{name}</span></button>)}</div></>:<><span className="xp-material-swatch"/><span>Good form. Better function.<br/><b>Made for your everyday.</b></span></>}</div></div>
      {!live&&<div className="xp-hero-still"><img src={products[activeProduct].image} alt={products[activeProduct].title} width="1000" height="769" fetchPriority="high"/><div className="xp-static-selector">{products.map((p,i)=><button key={p.id} aria-pressed={activeProduct===i} onClick={()=>setActiveProduct(i)}>{p.number}<span className="sr-only">{p.title}</span></button>)}</div></div>}
      {live&&<div className="xp-model-interaction" data-cursor="drag" onPointerDown={e=>{dragging.current=e.clientX;e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e=>{if(dragging.current!==null){state.current.drag+=(e.clientX-dragging.current)*.008;dragging.current=e.clientX;}}} onPointerUp={()=>{dragging.current=null;}} onPointerCancel={()=>{dragging.current=null;}} aria-hidden="true"/>}
      <div className="xp-orbit" aria-hidden="true"><span/><span/></div>
      <div className="xp-hero-caption"><span className="xp-eyebrow">01 / Meal Boxes</span><span className="xp-caption-rule"/><span>ISO-certified. Moulded in Daman, India.</span></div>
      {live&&<button className="xp-inspect" aria-pressed={openLid} onClick={()=>setOpenLid(!openLid)}><Plus size={16}/>{openLid?'Close the lid':'Open the lid'}</button>}
      <span className="xp-hero-wordmark" aria-hidden="true">MADE TO HOLD MORE.</span>
      <div className="xp-hero-bottom"><a href="#craft" className="xp-scroll-cue"><span className="xp-down"><ArrowDown size={17}/></span>Scroll to discover</a><span>{live?'Drag to rotate. Scroll to transform.':'Thoughtful packaging. From every angle.'}</span><span className="xp-live-label"><i/>{live?'Interactive collection':'The collection'} <span>01—03</span></span></div>
    </section>
    <section id="craft" className="xp-craft"><div className="xp-craft-stage"><div className="xp-story-top"><span className="xp-eyebrow">01 / A closer look</span><span className="xp-eyebrow">Beauty is in the details.</span></div><div className="xp-section-heading"><h2 data-split>Unbox <em>the craft.</em></h2></div><div className="xp-craft-facts">{craftFacts.map((fact,i)=><motion.div key={`${fact.title}-${revealMotion}`} className="xp-fact" aria-hidden={live&&craftPhase!==i} {...panelMotion(!live||craftPhase===i,24)} transition={{duration:.55,ease:[.22,1,.36,1]}}><span className="xp-eyebrow">{fact.tag}</span><h3>{fact.title.split('\n').map(line=><span key={line}>{line}</span>)}</h3><p>{fact.body}</p><span className="xp-detail-rule"/></motion.div>)}</div>{!live&&<img className="xp-craft-image" src="/models/acepack/clamshell.webp" alt="Hinged clamshell with its lid slightly open" width="1000" height="769" loading="lazy"/>}<span className="xp-craft-measure" aria-hidden="true">+<span>Designed to do more.</span>+</span><div className="xp-story-bottom"><span>One simple form.<br/><b>A world of thought.</b></span><div className="xp-story-steps">{['Consider','Open','Discover'].map((word,i)=><span key={word} className={craftPhase===i?'is-active':''}><b>0{i+1}</b>{word}</span>)}</div><span className="xp-turn-label"><Rotate3D size={20}/>360° of consideration</span></div></div></section>
    <section id="collection" className="xp-collection">{live&&products.map((p,i)=><span key={p.id} className="xp-range-anchor" id={`product-${p.id}`} style={{top:`${[0,106,185][i]}vh`}}/>)}<div className="xp-collection-stage"><div className="xp-collection-heading"><div><span className="xp-eyebrow">02 / Made for every menu</span><h2 data-split>Find your <em>form.</em></h2></div><Link href="/categories">View all categories <ArrowUpRight size={18}/></Link></div><div className="xp-product-panels">{products.map((p,i)=><motion.article key={`${p.id}-${revealMotion}`} className="xp-product" aria-hidden={live&&activeProduct!==i} inert={live&&activeProduct!==i} {...panelMotion(!live||activeProduct===i,35)} transition={{duration:.6,ease:[.22,1,.36,1]}}><div className="xp-product-copy"><span className="xp-eyebrow">{p.number} / {p.title}</span><h3>{p.name.split('\n').map((line,j)=><span key={line} className={j?'xp-serif':''}>{line}</span>)}</h3><p>{p.description}</p><dl><div><dt>Material</dt><dd>{p.material}</dd></div><div><dt>Format</dt><dd>{p.capacity}</dd></div><div><dt>Made for</dt><dd>{p.use}</dd></div></dl><MagneticLink href={p.href}>{p.link}</MagneticLink></div>{!live&&<img src={p.image} alt={p.title} width="1000" height="769" loading="lazy"/>}</motion.article>)}</div><span className="xp-product-watermark" aria-hidden="true">0{activeProduct+1}</span><div className="xp-collection-bottom"><div className="xp-product-tabs" aria-label="Jump to product">{products.map((p,i)=><a href={live?`#product-${p.id}`:p.href} key={p.id} aria-current={activeProduct===i?'true':undefined}><span>{p.number}</span>{p.title}<ArrowUpRight size={14}/></a>)}</div><span>Three distinct forms.<br/>One considered collection.</span></div></div></section>
    <section id="manufacturing" className="xp-manufacturing"><div className="xp-pattern" aria-hidden="true"/><div className="xp-manufacturing-top"><span className="xp-eyebrow">03 / Made with intent</span><Plus size={30}/></div><Reveal><h2 data-split>Robotic precision.<br/><em>1.5 million a day.</em></h2></Reveal><div className="xp-manufacturing-copy"><p>Fifteen years of injection moulding across two Daman units — Dori Kadaiya and Dabhel — supplying QSR chains, cloud kitchens and food brands in Australia, the UAE, Europe, Canada and the Middle East. Moulded exclusively from 100% prime virgin PP 05.</p><Link href="/capabilities">Inside our process <ArrowUpRight size={19}/></Link></div><div className="xp-stats"><div><Count value={1500000} suffix="+"/><p>Containers moulded daily</p></div><div><Count value={1000} suffix="+"/><p>Clients served</p></div><div><Count value={12} suffix="+"/><p>Export markets worldwide</p></div></div><p className="xp-recycling-note">ISO 9001:2015 and US FDA 21 CFR 177.1520 certified. PP 05 is widely recyclable — check local collection guidance for each format.</p></section>
    <section className="xp-trust"><div className="xp-trust-heading"><span className="xp-eyebrow">Trusted at scale</span><p>1,000+ brands served across India and 12 export markets.</p></div><div className="xp-marquee" tabIndex={0} aria-label="Packaging for restaurants, cafés, caterers, cloud kitchens, and retail"><div className="xp-marquee-track">{[0,1].map(copy=><div className="xp-marquee-group" aria-hidden={copy===1} key={copy}>{['Restaurants','Dairy','Confectionery','Frozen foods','Bakery','QSR','Pharma','FMCG'].map((name,i)=><span key={name} className={i%2?'xp-serif':''}>{name}<Plus size={23}/></span>)}</div>)}</div></div></section>
    <section id="closing" className="xp-closing"><Reveal><span className="xp-eyebrow">Wholesale catalog &amp; sample kit</span><h2 data-split>Let’s make<br/><em>something good.</em></h2><MagneticLink href="/contact">Request wholesale pricing</MagneticLink></Reveal>{!live&&<div className="xp-lineup">{products.map(p=><img key={p.id} src={p.image} alt={p.title} loading="lazy" width="1000" height="769"/>)}</div>}<span className="xp-closing-note">Daman, India · sales@acepack.co.in · +91 99250 15906</span></section>
    <div id="footer" aria-hidden="true"/>
    <button className="xp-motion-toggle" onClick={()=>{if(fallbackReason==='renderer-unavailable'){setFallbackReason('');setRetry(retry+1);}else setPaused(!paused);}} aria-pressed={paused} aria-label={live?'Use still images':'Enable 3D motion'}>{live?<Pause size={13}/>:<Play size={13}/>}<span>{live?'3D on':fallbackReason==='renderer-unavailable'?'Retry 3D':paused?'Enable 3D':'Still mode'}</span></button>
  </div></MotionConfig>;
}
