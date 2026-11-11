import { Metadata } from 'next';
import { ContactPageBody } from '@/components/sections/ContactPageBody';
import { cmsMetadata } from '@/lib/db/content';

const staticMetadata: Metadata = {
  title: 'Contact Us | Ace Packaging Plastic Food Packaging Manufacturer',
  description: 'Get in touch with Ace Packaging sales team for product information, custom mould R&D, and free sample requests for plastic food containers.',
  alternates: {
    canonical: 'https://www.acepack.co.in/contactus',
  },
};

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('contact', staticMetadata);
}

export default function ContactPage() {
  return <ContactPageBody breadcrumb={{ name: 'Contact', href: '/contact' }} />;
}
