import type { Metadata } from 'next';
import { ResourcePage } from '@/components/sections/ResourcePage';
import { cmsMetadata } from '@/lib/db/content';

const staticMetadata: Metadata = {
  title: 'Custom Packaging & IML Branding | Ace Packaging',
  description: 'Custom container branding, 5-sided In-Mould Labelling (IML), proprietary container geometry, and private label OEM manufacturing by Ace Packaging in Daman.',
};

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('customization', staticMetadata);
}

export default function CustomizationPage() {
  return <ResourcePage kind="customization" />;
}
