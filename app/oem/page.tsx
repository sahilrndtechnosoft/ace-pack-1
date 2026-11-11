import type { Metadata } from 'next';
import { ResourcePage } from '@/components/sections/ResourcePage';
import { cmsMetadata } from '@/lib/db/content';

const staticMetadata: Metadata = {
  title: 'OEM Mould Tooling & Custom Food Packaging | Ace Packaging',
  description: 'Custom mould tooling, In-Mould Labelling (IML), proprietary container geometry, and private label OEM manufacturing by Ace Packaging in Daman.',
};

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('oem', staticMetadata);
}

export default function OEMPage() {
  return <ResourcePage kind="oem" />;
}
