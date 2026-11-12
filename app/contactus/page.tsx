import { withLiveSeo } from '@/lib/data/live-routing';
import { Metadata } from 'next';
import { cmsMetadata } from '@/lib/db/content';
import { ContactPageBody } from '@/components/sections/ContactPageBody';

export const dynamic = 'force-dynamic';

const staticMetadata: Metadata = {
  title: 'Contact Ace Packaging | Food Packaging Solutions',
  description:
    'Get in touch with Ace Packaging for all your inquiries. We offer reliable, innovative, and customized food packaging solutions to meet your business needs.',
  alternates: {
    canonical: 'https://www.acepack.co.in/contactus',
  },
  openGraph: {
    title: 'Contact Ace Packaging | Food Packaging Solutions',
    description:
      'Get in touch with Ace Packaging for all your inquiries. We offer reliable, innovative, and customized food packaging solutions to meet your business needs.',
    url: 'https://www.acepack.co.in/contactus',
  },
};

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('contactus', withLiveSeo('/contactus', staticMetadata));
}

export default function ContactUsPage() {
  return <ContactPageBody breadcrumb={{ name: 'Contact Us', href: '/contactus' }} />;
}
