
export interface Certification {
  id: string;
  title: string;
  body: string;
  scope: string;
}

export const certifications: Certification[] = [
  { id: 'iso-9001', title: 'ISO 9001:2015', body: 'Certified Quality Management System covering precision injection moulding, tooling calibration, and quality control.', scope: 'Plant-wide quality certification' },
  // { id: 'bpa-free', title: '100% Virgin PP 05', body: 'Non-toxic, heavy-metal-free virgin polymer. No regrind or recycled filler enters the line.', scope: 'Material purity' },
  // { id: 'cleanroom', title: 'Cleanroom Manufacturing', body: 'Dust-free hygienic moulding hall with robotic pick-and-place, so finished containers are never handled.', scope: 'Hygiene standard' },
  // { id: 'traceability', title: 'Batch Traceability', body: 'Full batch serialization and process parameter recording across Daman Unit 1 and Unit 2.', scope: 'Quality assurance' },
];

export interface QualityCheck {
  step: string;
  title: string;
  what: string;
  standard: string;
}

export const qualityChecks: QualityCheck[] = [
  { step: '01', title: 'Certified virgin resin only', what: 'Only prime virgin PP 05 resin is used. No regrind or recycled content enters the line.', standard: 'ISO 9001:2015 Batch Standard' },
  { step: '02', title: 'Wall thickness measurement', what: 'Moulded walls are gauged against the tool geometry to catch short shots and sink before they leave the press.', standard: '±0.02 mm tolerance' },
  { step: '03', title: 'Rim dimension verification', what: 'Sealing rims are dimensionally verified so lids seat and snap consistently across every cavity of the mould.', standard: 'Per-cavity rim geometry' },
  { step: '04', title: '100% leak testing', what: 'Every container is leak tested — not sampled — to confirm the rim seal holds liquid through delivery.', standard: 'Zero-leak rim seal' },
  { step: '05', title: 'Thermal cycle rating', what: 'Container lines are rated across the full service range, from deep-freeze storage to microwave reheating.', standard: '−20°C to +120°C' },
  { step: '06', title: 'Automated export packaging', what: 'Finished containers are automatically carton-stacked for domestic and export dispatch, without manual handling.', standard: 'Automatic carton stacking' },
];

export const complianceStatements = [
  'Manufactured in an ISO 9001:2015 certified facility in Daman, India',
  '100% prime virgin polypropylene (PP 05) — no regrind, no recycled content',
  '100% BPA-free and heavy-metal free food-grade polymer',
  'Microwave and freezer safe across the −20°C to +120°C rated range',
  'Automated optical defect inspection and ±0.02 mm precision rim tolerance',
];
