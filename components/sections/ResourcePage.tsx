import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { resourcePages } from '@/lib/data/resources';
import './resource-pages.css';
export function ResourcePage({kind}:{kind:keyof typeof resourcePages}) {
 const page=resourcePages[kind];
 return <div className="resource-page"><section className="resource-hero"><div className="container-custom"><p className="xp-eyebrow">{page.eyebrow}</p><h1>{page.title}</h1><p>{page.intro}</p><Link className="xp-button" href="/contact">{page.action}<ArrowUpRight size={18}/></Link></div></section><section className="container-custom resource-content"><p className="xp-eyebrow">A considered process</p><div className="resource-grid">{page.steps.map(([title,body],i)=><article key={title}><span>0{i+1}</span><h2>{title}</h2><p>{body}</p></article>)}</div><p className="resource-note">Final availability and specifications are confirmed with our team for your selected product.</p></section></div>;
}
