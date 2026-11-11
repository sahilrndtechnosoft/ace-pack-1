import React from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Mail } from 'lucide-react';
import type { LegalDocumentContent } from '@/lib/cms/pages/legal';

const paragraphs = (text: string) => text.split(/\n{2,}/).filter((p) => p.trim());

/** Renders a CMS-managed policy/terms document: intro, numbered clauses, contact box. */
export function LegalDocument({ doc, icons }: { doc: LegalDocumentContent; icons: LucideIcon[] }) {
  return (
    <section className="py-12 md:py-16">
      <div className="container-custom max-w-4xl">
        <div className="bg-white p-5 sm:p-12 rounded-3xl border border-[#E6DBC6] shadow-sm space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <div className="border-b border-[#E6DBC6] pb-6">
            <span className="text-[10px] font-bold text-[#b99750] uppercase tracking-wider block mb-1">{doc.updatedLabel}</span>
            <h2 className="text-2xl font-extrabold text-[#1A1D20]">{doc.heading}</h2>
            {paragraphs(doc.intro).map((p, i) => <p key={i} className="mt-2 text-gray-600">{p}</p>)}
          </div>

          {doc.clauses.map((clause, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div key={`${clause.title}-${idx}`}>
                <h3 className="text-base font-bold text-[#1A1D20] mb-3 flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#b99750]" /> {clause.title}
                </h3>
                {paragraphs(clause.text).map((p, i) => <p key={i} className={clause.bullets.length ? 'mb-2' : 'mb-2 last:mb-0'}>{p}</p>)}
                {clause.bullets.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    {clause.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
                {paragraphs(clause.closing).map((p, i) => <p key={i} className="mt-2 font-medium text-gray-800">{p}</p>)}
              </div>
            );
          })}

          <div className="pt-6 border-t border-[#E6DBC6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-[#1A1D20]">{doc.contactHeading}</h4>
              <p className="text-xs text-gray-500">{doc.contactText}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold">
              {doc.contactEmail && (
                <a href={`mailto:${doc.contactEmail}`} className="text-[#8c6f2a] hover:underline flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {doc.contactEmail}
                </a>
              )}
              {doc.contactEmail && doc.contactLink.text && <span className="text-gray-300">•</span>}
              {doc.contactLink.text && (
                <Link href={doc.contactLink.link} className="text-[#1A1D20] hover:text-[#8c6f2a] underline">{doc.contactLink.text}</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
