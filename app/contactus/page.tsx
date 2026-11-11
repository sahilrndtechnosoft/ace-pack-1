import { Metadata } from 'next';
import { ContactPageBody } from '@/components/sections/ContactPageBody';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
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

export default function ContactUsPage() {
  return <ContactPageBody breadcrumb={{ name: 'Contact Us', href: '/contactus' }} />;
}
