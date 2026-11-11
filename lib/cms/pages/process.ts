// Manufacturing Process page (/process).
import { bannerSection, DEFAULT_BANNER_IMAGE } from './shared';

export const processPage = {
  title: 'Manufacturing Process',
  path: '/process',
  sections: {
    banner: bannerSection({
      badge: 'PRODUCTION WORKFLOW',
      title: 'Our Manufacturing Process',
      subtitle:
        'A fully integrated 5-step automated workflow—from Sheet Extrusion and Thermoforming through Automated Production, Quality Checks, and Packaging & Dispatch.',
      bgImage: DEFAULT_BANNER_IMAGE,
    }),
    steps: {
      label: 'Process Steps',
      description: 'Intro and the step-by-step production cards.',
      content: {
        eyebrow: 'Integrated Production Ecosystem',
        heading: '5-Step Precision Manufacturing Process',
        intro:
          'Ace Packaging operates advanced polymer processing infrastructure across two manufacturing units in Daman, India. Every container is crafted through an automated sequence ensuring certified food-grade purity, structural perfection, and zero transit leakage.',
        benchmarkLabel: 'Key Benchmark:',
        steps: [
  {
    number: '01',
    title: 'Sheet Extrusion',
    subtitle: 'Precision Gauge Polymer Sheet Production',
    tag: 'Raw Material Conversion',
    description:
      '100% prime virgin food-grade polymer resin (PP 05 / PET) is dehumidified, melted, and continuously extruded through a high-precision flat die. Multi-roll calendar stacks cool and calibrate the sheet with laser-monitored gauge uniformity across the entire web width.',
    keySpecs: [
      'Prime virgin PP 05 and PET resin only',
      'Continuous laser-controlled thickness monitoring',
      'Optical clarity and surface stress elimination',
      'Zero recycled filler or contaminated regrind',
    ],
    highlight: '±0.02 mm gauge precision across every square meter',
  },
  {
    number: '02',
    title: 'Thermoforming',
    subtitle: 'Plug-Assist Cavity Forming & Hermetic Rim Shaping',
    tag: 'Product Geometry Moulding',
    description:
      'The extruded plastic sheet is indexed into computer-controlled radiant heating zones and vacuum-formed with precision plug-assist tooling. Container walls, partition ribs, and hermetic rim snap grooves are formed with micro-tolerance repeatability.',
    keySpecs: [
      'Multi-zone ceramic radiant heating control',
      'High-cavity aluminium tooling with cooling channels',
      'Precision snap-fit perimeter rim geometry',
      'Sharp partition definition preventing liquid migration',
    ],
    highlight: 'Uniform wall distribution ensuring maximum structural rigidity',
  },
  {
    number: '03',
    title: 'Automated Production',
    subtitle: 'High-Speed Inline Trimming & Robotic Handling',
    tag: 'Zero-Touch Cleanroom Automation',
    description:
      'Formed containers are trimmed directly in-mould with CNC accuracy. High-speed 3-axis robotic arms extract finished containers onto cleanroom conveyors without manual human touch, while web skeleton trim is granulated inline for closed-loop sustainability.',
    keySpecs: [
      'Sub-3.0 second high-speed cycle times',
      'Cleanroom conveyor transfer with positive air pressure',
      'Automated robotic pick, place, and orientation',
      '100% closed-loop skeleton web recycling',
    ],
    highlight: 'Dust-free, zero-touch automated cleanroom handling',
  },
  {
    number: '04',
    title: 'Quality Checks',
    subtitle: '100% Inline Optical Vision & Rim Leak Testing',
    tag: 'Rigorous Quality Verification',
    description:
      'Every production batch undergoes multi-point inline inspection. High-speed vision cameras detect micro-pinholes, perimeter wall thickness is gauged, and containers undergo 100% rim seal drop and leak testing under hot liquid transport simulation.',
    keySpecs: [
      'High-speed optical vision camera inspection',
      '100% zero-leak rim snap pressure verification',
      'Thermal cycling tested from −20°C to +120°C',
      'Drop impact resistance with piping-hot gravies',
    ],
    highlight: '100% rim leak tested before packing approval',
  },
  {
    number: '05',
    title: 'Packaging and Dispatch',
    subtitle: 'Hygienic Polybag Sleeving & Global Export Logistics',
    tag: 'Protective Cartoning & Logistics',
    description:
      'Containers are automatically counted, nested, and sealed into protective dust-proof polybag sleeves directly at the conveyor exit. Sleeves are packed into heavy-duty 5-ply corrugated cartons, palletized, stretch-wrapped, and barcoded for domestic and global export dispatch.',
    keySpecs: [
      'Automated stack counting and polybag hermetic sleeving',
      'Heavy-duty 5-ply outer export-grade corrugated cartons',
      'Serialized batch barcodes tracking resin lot and machine press',
      'Full containerload (FCL) dispatch to UK, UAE, EU, and Australia',
    ],
    highlight: 'Palletized dispatch from Daman Unit 1 & 2 to 20+ countries',
  },
],
      },
    },
    facility: {
      label: 'Facility Highlights',
      description: 'Three cards: capacity, campus and certification.',
      content: {
        cards: [
          { title: '1,500,000+ Units Daily', description: 'Massive industrial moulding capacity across high-speed robotic injection and thermoforming presses, fulfilling containerload export and bulk franchise orders with zero delay.' },
          { title: 'Daman Manufacturing Campus', description: 'Unit 1 and Unit 2 in Dabhel, Daman feature dust-controlled cleanroom halls, CNC mould tooling workshops, and automated optical micrometer quality laboratories.' },
          { title: 'ISO 9001:2015 Certified', description: 'Audited and certified by SGS United Kingdom Ltd (Certificate IN25/00000652), ensuring 100% prime virgin polymers, zero chemical migration, and food contact safety.' },
        ],
      },
    },
    cta: {
      label: 'Plant Visit Call to Action',
      content: {
        eyebrow: 'Factory Verification',
        heading: 'Inspect Our Manufacturing Lines in Person',
        description:
          'We welcome corporate procurement heads, brand managers, and export buyers for scheduled on-site audits at our Daman manufacturing campus. Request free physical sample kits or review our official ISO 9001:2015 audit file.',
        primaryButton: { text: 'View Quality & Certifications', link: '/quality' },
        secondaryButton: { text: 'Schedule Plant Audit', link: '/contact' },
      },
    },
  },
};
