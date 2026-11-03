import React from 'react';
import { Metadata } from 'next';
import { Curved3DGallery } from '@/components/events/Curved3DGallery';
import { exhibitionEvents } from '@/lib/data/events';
import { getCmsEvents } from '@/lib/db/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Exhibitions & Industry Events | Ace Packaging',
  description:
    'Experience Ace Packaging at leading international packaging conclaves, food service trade shows, and live robotic moulding demonstrations worldwide.',
};

export default async function ExhibitionsEventsPage() {
  const cmsEvents = await getCmsEvents();
  const events = cmsEvents && cmsEvents.length > 0 ? cmsEvents : exhibitionEvents;

  return (
    <div className="bg-[#181C14] text-white min-h-[calc(100vh-68px)] flex flex-col justify-center overflow-hidden">
      <Curved3DGallery events={events} />
    </div>
  );
}
