
export interface Certification {
  id: string;
  title: string;
  body: string;
  scope: string;
}

export const certifications: Certification[] = [
  { id: 'iso-9001', title: 'ISO 9001:2015', body: 'Quality Management System certified facility.', scope: 'Plant-wide quality management' },
  { id: 'fda-21-cfr', title: 'US FDA 21 CFR 177.1520', body: 'Direct food-contact safe polypropylene, certified for the resin used in every container.', scope: 'Material compliance' },
  { id: 'bpa-free', title: 'BPA-Free Virgin PP 05', body: 'Non-toxic, heavy-metal-free virgin polymer. No regrind or recycled content enters the line.', scope: 'Material purity' },
  { id: 'cleanroom', title: 'Cleanroom Manufacturing', body: 'Dust-free hygienic moulding hall with robotic pick-and-place, so finished containers are never handled.', scope: 'Hygiene' },
];

export interface QualityCheck {
  step: string;
  title: string;
  what: string;
  standard: string;
}

export const qualityChecks: QualityCheck[] = [
  { step: '01', title: 'Certified virgin resin only', what: 'Only prime virgin PP 05 resin certified to US FDA 21 CFR 177.1520 is used. No regrind or recycled content enters the line.', standard: 'US FDA 21 CFR 177.1520' },
  { step: '02', title: 'Wall thickness measurement', what: 'Moulded walls are gauged against the tool geometry to catch short shots and sink before they leave the press.', standard: '±0.02 mm tolerance' },
  { step: '03', title: 'Rim dimension verification', what: 'Sealing rims are dimensionally verified so lids seat and snap consistently across every cavity of the mould.', standard: 'Per-cavity rim geometry' },
  { step: '04', title: '100% leak testing', what: 'Every container is leak tested — not sampled — to confirm the rim seal holds liquid through delivery.', standard: 'Zero-leak rim seal' },
  { step: '05', title: 'Thermal cycle rating', what: 'Container lines are rated across the full service range, from deep-freeze storage to microwave reheating.', standard: '−20°C to +120°C' },
  { step: '06', title: 'Automated export packaging', what: 'Finished containers are automatically carton-stacked for domestic and export dispatch, without manual handling.', standard: 'Automatic carton stacking' },
];

export const complianceStatements = [
  '100% prime virgin polypropylene (PP 05) — no regrind, no recycled content',
  'Certified food-contact safe under US FDA 21 CFR 177.1520',
  '100% BPA-free and heavy-metal free',
  'Microwave and freezer safe across the −20°C to +120°C rated range',
  'Manufactured in an ISO 9001:2015 certified facility in Daman, India',
];
