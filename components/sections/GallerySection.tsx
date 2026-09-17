'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '../ui/Container';
import { ArrowRight, Eye } from 'lucide-react';

const galleryItems = [
  { title: 'Hinge Cups & Sauce Containers', image: '/images/media_1787717762050.jpg' },
  { title: 'RO Series Round Gravy Tubs', image: 'https://images.unsplash.com/photo-1581059474347-833e80d81ba8?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { title: 'RE Bento Meal Delivery Boxes', image: '/50d728a7-e02c-49d9-b530-58a7db8a6ecc.png' },
  { title: 'Portion Control Cups', image: '/b9d572a7-af59-4e63-92e8-2971440edffe.png' },
  { title: 'Custom IML Branded Packaging', image: '/images/media_1787711507848.png' },
  { title: 'Cleanroom Injection Moulding Facility', image: '/images/media_1787712717089.png' }
];

export const GallerySection: React.FC = () => {
  return (
    <section className="py-16 bg-[#FAF8F4] border-b border-[#E6DBC6]/40">
      <Container>
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-extrabold text-[#a8812f] uppercase tracking-wider block mb-2">
              VISUAL GALLERY
            </span>
            <h2 className="text-3xl font-extrabold text-[#1A1D20] tracking-tight">
              Container Product Gallery
            </h2>
          </div>

          <Link
            href="/gallery"
            className="text-xs font-bold text-[#a8812f] hover:underline uppercase tracking-wider flex items-center gap-1.5"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#050505] rounded-3xl overflow-hidden border-2 border-[#cfa144]/60 hover:border-[#cfa144] shadow-sm hover:shadow-xl transition-all duration-300 relative group h-64 flex items-center justify-center p-4"
            >
              <img
                src={item.image}
                alt={item.title}
                className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                <span className="text-xs font-bold text-white leading-tight">{item.title}</span>
              </div>
            </div>
          ))}
        </div>

      </Container>
    </section>
  );
};
