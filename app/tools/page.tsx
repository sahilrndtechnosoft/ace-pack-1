import type { Metadata } from 'next';
import { ToolsCalculator } from '@/components/sections/ToolsCalculator';
import '@/components/sections/resource-pages.css';
export const metadata: Metadata = {title:'Packaging Tools | Ace Packaging',description:'Convert container capacities and estimate cartons for your packaging requirements.'};
export default function ToolsPage() {
  return <div className="resource-page"><section className="resource-hero"><div className="container-custom"><span className="xp-eyebrow">Resources / Tools</span><h1>A little planning.<br />A clearer brief.</h1><p>Simple tools to help you compare container capacities and prepare your packaging requirements.</p></div></section><div className="container-custom resource-content"><ToolsCalculator /><p className="resource-note">Planning estimates only. Actual packing configurations, product capacities and shipment details are confirmed with our team.</p></div></div>;
}
