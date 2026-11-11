'use client';

import React, { createContext, useContext } from 'react';
import { siteTextDefaults, type SiteText } from '@/lib/cms/site-settings';

// Shared wording (forms, download pop-up, 404) from Site-wide Settings, available to any client component.
const SiteTextContext = createContext<SiteText>(siteTextDefaults);

export function SiteTextProvider({ value, children }: { value: SiteText; children: React.ReactNode }) {
  return <SiteTextContext.Provider value={value}>{children}</SiteTextContext.Provider>;
}

export const useSiteText = () => useContext(SiteTextContext);
