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
    id: 'brcgs',
    badge: 'GLOBAL FOOD SAFETY STANDARD',
    title: 'BRCGS Packaging Materials Certified',
    body: 'Ace Packaging adheres to the globally recognized BRCGS Packaging Materials Standard, ensuring stringent hygiene management, contamination prevention, and full traceability for direct food contact packaging.',
    scope: 'Direct food contact packaging manufacturing',
    icon: 'ShieldCheck',
    standards: ['GFSI Benchmark Recognized', 'Hygiene Management Audited', 'Traceability Verified'],
  },
  {
    id: 'haccp',
    badge: 'CRITICAL CONTROL PROTOCOLS',
    title: 'HACCP Certified Manufacturing',
    body: 'Systematic Hazard Analysis and Critical Control Points (HACCP) protocols are actively maintained across raw material intake, extrusion, thermoforming, and cleanroom packing to prevent physical, biological, and chemical hazards.',
    scope: 'Food safety hazard prevention across production lines',
    icon: 'CheckCircle2',
    standards: ['Critical Control Point Monitoring', 'Dust-Free Cleanroom Protocol', 'Zero Cross-Contamination'],
  },
  {
    id: 'food-grade',
    badge: '100% VIRGIN POLYMERS',
    title: '100% Food-Grade Virgin Raw Materials',
    body: 'Manufactured exclusively from prime virgin polypropylene (PP 05) and virgin PET resin from certified petrochemical producers. 100% BPA-free, heavy-metal free, non-toxic, and migration tested for hot foods and microwave reheating.',
    scope: 'Raw material chemical purity and food contact safety',
    icon: 'Award',
    standards: ['100% Prime Virgin PP 05 & PET', 'BPA & Heavy Metal Free', 'Migration Compliance Tested'],
  },
  {
    id: 'iso-9001',
    badge: 'SGS UKAS ACCREDITATION',
    title: 'ISO 9001:2015 Quality Management System',
    body: 'Assessed and certified by SGS United Kingdom Ltd (UKAS 0005) under Certificate IN25/00000652 for the manufacturing and supply of precision food packaging articles, with strict in-house toolroom calibration and quality control.',
    scope: 'Plant-wide ISO 9001:2015 quality management system',
    icon: 'ClipboardCheck',
    standards: ['Certificate IN25/00000652', 'SGS United Kingdom Ltd Audit', 'UKAS & IAF Accreditations'],
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
  'Certified BRCGS and HACCP food-contact hygiene protocols implemented across all production floors',
  '100% prime virgin polypropylene (PP 05) and virgin PET — zero regrind, zero filler, 100% BPA-free',
  'Microwave-safe and freezer-safe across the comprehensive −20°C to +120°C operating temperature range',
  'Continuous laser gauge monitoring and ±0.02 mm precision rim snap tolerance for zero transit leakage',
  'Automated robotic cleanroom handling eliminating human contact prior to protective polybag sealing',
];
