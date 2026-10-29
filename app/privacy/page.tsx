import React from 'react';
import { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { ShieldCheck, Lock, FileText, CheckCircle2, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Ace Packaging Solutions',
  description: 'Learn about Ace Packaging Solutions’ commitment to protecting client privacy, business inquiries, and food container procurement data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FAF8F4] min-h-screen text-[#1A1D20] pb-24">
      <PageBanner
        title="Privacy Policy"
        subtitle="Our commitment to safeguarding your business inquiries, procurement requirements, and commercial confidentiality."
        badge="LEGAL &amp; COMPLIANCE"
        breadcrumbs={[{ name: 'Privacy Policy', href: '/privacy' }]}
      />

      <section className="py-12 md:py-16">
        <div className="container-custom max-w-4xl">
          <div className="bg-white p-5 sm:p-12 rounded-3xl border border-[#E6DBC6] shadow-sm space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
            
            <div className="border-b border-[#E6DBC6] pb-6">
              <span className="text-[10px] font-bold text-[#b99750] uppercase tracking-wider block mb-1">Last Updated: October 2026</span>
              <h2 className="text-2xl font-extrabold text-[#1A1D20]">Ace Packaging Privacy Standards</h2>
              <p className="mt-2 text-gray-600">
                Ace Packaging Solutions (&ldquo;Ace Packaging&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates manufacturing facilities in Daman, India, supplying precision injection-moulded food containers globally. This policy outlines how we handle commercial inquiries, technical documentation requests, and personal contact details submitted through our digital platform.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#1A1D20] mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#b99750]" /> 1. Information We Collect
              </h3>
              <p className="mb-2">We collect business information when you:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Submit factory quotation and product inquiry forms.</li>
                <li>Request physical sample kits for cloud kitchens, QSRs, or food brands.</li>
                <li>Download technical datasheets, CAD specifications, or product catalogues.</li>
                <li>Subscribe to catalog updates and export announcements.</li>
              </ul>
              <p className="mt-2">
                Collected fields typically include full name, brand/company name, business email address, phone/WhatsApp number, container category of interest, and volume requirements.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#1A1D20] mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#b99750]" /> 2. Commercial Confidentiality &amp; Custom Mould Tooling
              </h3>
              <p>
                We understand that container geometry, IML artwork, brand positioning, and proprietary recipes require strict confidentiality. Ace Packaging adheres to non-disclosure obligations (NDAs) for all custom OEM mould tooling, branded in-mould labelling designs, and private label client engagements.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#1A1D20] mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#b99750]" /> 3. How We Use Collected Information
              </h3>
              <p className="mb-2">The information you provide is used strictly for:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Fulfilling sample kit shipments and providing factory freight estimates.</li>
                <li>Responding to container volume requests, MOQ pricing, and export container loadings.</li>
                <li>Sending requested PDF technical datasheets and regulatory compliance certificates.</li>
                <li>Technical follow-up by our Daman engineering and dispatch teams.</li>
              </ul>
              <p className="mt-2 font-medium text-gray-800">
                We never sell, rent, or trade your contact information or commercial order history to third-party marketing brokers.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#1A1D20] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#b99750]" /> 4. Data Security &amp; Retention
              </h3>
              <p>
                We implement industry-standard encryption, SSL/TLS protocols, and secure server safeguards to protect data transmission across our website. Commercial inquiries are retained for record-keeping and audit compliance.
              </p>
            </div>

            <div className="pt-6 border-t border-[#E6DBC6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-[#1A1D20]">Questions or Data Inquiries?</h4>
                <p className="text-xs text-gray-500">Contact our administrative and compliance desk in Daman.</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold">
                <a href="mailto:acepack2011@gmail.com" className="text-[#8c6f2a] hover:underline flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> acepack2011@gmail.com
                </a>
                <span className="text-gray-300">•</span>
                <Link href="/contact" className="text-[#1A1D20] hover:text-[#8c6f2a] underline">
                  Contact Page
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
