import type { Metadata } from 'next';
import { ToolsCalculator } from '@/components/sections/ToolsCalculator';
import '@/components/sections/resource-pages.css';
const staticMetadata: Metadata = {title:'Packaging Tools | Ace Packaging',description:'Convert container capacities and estimate cartons for your packaging requirements.'};
import { cmsMetadata, getPageContent } from '@/lib/db/content';

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('tools', staticMetadata);
}
export default async function ToolsPage() {
  const { content, hidden } = await getPageContent('tools');
  const { hero, note } = content;
  return (
    <div className="resource-page">
      {!hidden.includes('hero') && (
        <section className="resource-hero">
          <div className="container-custom">
            <span className="xp-eyebrow">{hero.eyebrow}</span>
            <h1>{hero.heading}<br />{hero.headingSecondLine}</h1>
            <p>{hero.description}</p>
          </div>
        </section>
      )}
      <div className="container-custom resource-content">
        <ToolsCalculator />
        {!hidden.includes('note') && <p className="resource-note">{note.text}</p>}
      </div>
    </div>
  );
}
