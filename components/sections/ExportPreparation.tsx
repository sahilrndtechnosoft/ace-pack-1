import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import './resource-pages.css';

export function ExportPreparation() {
  return <section className="export-preparation" aria-labelledby="export-heading">
    <div className="container-custom">
      <span className="xp-eyebrow">Prepared for the journey</span>
      <div className="export-heading"><h2 id="export-heading">Every container.<br /><em>Every detail. Every destination.</em></h2><p>Every container we ship for export is carefully planned and prepared for delivery. From the agreed product specification to the way cartons are identified and handled, the journey begins before dispatch.</p></div>
      <div className="export-steps">
        {[['Plan the shipment','Align product specifications, quantities and destination requirements.'],['Protect the product','Review stacking and carton configuration for the selected container.'],['Prepare the details','Coordinate shipment identification and the required export documentation.'],['Coordinate delivery','Agree dispatch and shipping arrangements with your team.']].map(([title,body],i) => <article key={title}><span>0{i+1}</span><h3>{title}</h3><p>{body}</p></article>)}
      </div>
      <Link href="/contact" className="xp-button">Plan your export shipment <ArrowUpRight size={18} /></Link>
    </div>
  </section>;
}
