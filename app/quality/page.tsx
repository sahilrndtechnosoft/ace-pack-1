import React from 'react';
import { Metadata } from 'next';
import { QualityClient } from '@/components/sections/QualityClient';

export const metadata: Metadata = {
  title: 'Quality Assurance & Certifications | Ace Packaging',
  description: 'ISO 9001:2015 facility, 100% prime virgin PP 05, 100% leak testing and ±0.02 mm wall tolerance. Official SGS Certificate IN25/00000652.',
};

export default function QualityPage() {
  return <QualityClient />;
}
