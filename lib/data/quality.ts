export interface Certification {
  id: string;
  badge: string;
  title: string;
  body: string;
  scope: string;
  icon: string;
  standards?: string[];
}

export const certifications: Certification[] = [
  {
    id: 'iso-9001',
    badge: 'SGS UKAS ACCREDITATION',
    title: 'ISO 9001:2015 Quality Management System',
    body: 'Assessed and certified by SGS United Kingdom Ltd (UKAS 0005) under Certificate IN25/00000652 for the manufacturing and supply of precision food packaging articles, with strict in-house toolroom calibration and quality control.',
    scope: 'Plant-wide ISO 9001:2015 quality management system',
    icon: 'Award',
    standards: [
      'Certificate IN25/00000652',
      'SGS United Kingdom Ltd Audit',
      'UKAS & IAF Accreditations',
      'Valid through August 2028',
    ],
  },
];

export interface QualityCheck {
  step: string;
  title: string;
  what: string;
  standard: string;
  badge?: string;
}

export const qualityChecks: QualityCheck[] = [
  {
    step: '01',
    title: 'Wall Thickness & Gauge Uniformity',
    what: 'Precision continuous laser and micrometer monitoring ensures container walls and bases maintain exact ±0.02 mm thickness distribution without thin spots or weak corners.',
    standard: '±0.02 mm tolerance',
    badge: 'Dimensional Accuracy',
  },
  {
    step: '02',
    title: '100% Leak-Proof Rim Seal Verification',
    what: 'Every sealing rim is geometrically calibrated for hermetic snap-tight lid locking, ensuring zero liquid or curry leakage during high-vibration bike delivery transit.',
    standard: 'Zero-leak snap fit',
    badge: 'Transport Security',
  },
  {
    step: '03',
    title: 'Drop & Compression Impact Testing',
    what: 'Rigorous multi-angle drop trials with hot gravies and stack compression load tests confirm containers withstand handling and vertical delivery bag stacking pressure.',
    standard: 'High-impact PP resin',
    badge: 'Structural Integrity',
  },
  {
    step: '04',
    title: 'Thermal Endurance Rating',
    what: 'Certified thermal resilience across the full food service spectrum: deep-freeze storage down to −20°C and piping-hot microwave reheating up to +120°C without warping or leaching.',
    standard: '−20°C to +120°C safe',
    badge: 'Thermal Resilience',
  },
  {
    step: '05',
    title: 'Automated Optical Vision Defect Inspection',
    what: 'High-speed inline camera systems inspect containers on the fly, instantly ejecting items with micro-pinholes, flash, short shots, or surface imperfections.',
    standard: '100% optical audit',
    badge: 'Automated QC',
  },
  {
    step: '06',
    title: 'Hygienic Cleanroom Handling & Batch Traceability',
    what: 'Dust-free robotic pick-and-place lines eliminate manual contact. Finished packs receive serialized batch barcodes logging resin lot, machine press, and timestamp.',
    standard: 'Full batch serialization',
    badge: 'Cleanroom Hygiene',
  },
];

export const complianceStatements = [
  'Manufactured in an ISO 9001:2015 certified facility in Daman, India (SGS Certificate IN25/00000652)',
  'Cleanroom hygiene protocols and automated optical defect inspection implemented across all production floors',
  '100% prime virgin polypropylene (PP 05) and virgin PET — zero regrind, zero filler, 100% BPA-free',
  'Microwave-safe and freezer-safe across the comprehensive −20°C to +120°C operating temperature range',
  'Continuous laser gauge monitoring and ±0.02 mm precision rim snap tolerance for zero transit leakage',
  'Automated robotic cleanroom handling eliminating human contact prior to protective polybag sealing',
];
