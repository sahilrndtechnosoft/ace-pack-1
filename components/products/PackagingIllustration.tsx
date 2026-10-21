import type { SVGProps } from 'react';

const drawings: Record<string, string[]> = {
  'hinge-cups': [
    'M18 27h28l-5 24H23z',
    'M18 27c-7-1-9-8-7-14 3-7 20-10 25-3 3 4 2 10-1 14',
    'M22 33h19M24 46h15'
  ],
  'portion-cups': [
    'M16 23c0-6 32-6 32 0s-32 6-32 0Z',
    'M18 27l5 24c2 3 16 3 18 0l5-24',
    'M16 21v4m32-4v4'
  ],
  'ro-series': [
    'M10 27c0-7 44-7 44 0s-44 7-44 0Z',
    'M13 30l7 16c4 7 20 7 24 0l7-16',
    'M13 23c3-15 35-15 38 0'
  ],
  're-series': [
    'M9 23l27-10 20 11-26 12z',
    'M9 23l4 24 19 9 20-9 4-23',
    'M30 36l2 20M24 18l19 13'
  ],
  'round-containers': [
    'M11 18c0-7 42-7 42 0s-42 7-42 0Z',
    'M11 19l4 30c2 9 32 9 34 0l4-30',
    'M18 49c6 4 22 4 28 0'
  ],
  'natraj-containers': [
    'M10 25c0-6 44-6 44 0s-44 6-44 0Z',
    'M13 28l5 20c3 6 24 6 27 0l5-20',
    'M16 48c7 3 23 3 30 0'
  ],
  'natraj-sweets': [
    'M8 23l30-10 19 12-30 10z',
    'M8 23l3 18 17 11 25-10 4-17',
    'M27 35l1 17M13 26l25-8'
  ],
  'zen-series': [
    'M8 20l32-8 16 10-32 8z',
    'M8 20l4 28 20 8 16-8 4-28',
    'M28 32l2 24M16 24l24-6'
  ],
  'glass-series-80-dia': [
    'M18 16c0-4 28-4 28 0s-28 4-28 0Z',
    'M20 20l4 32c1 5 14 5 16 0l4-32',
    'M22 12c4-4 16-4 20 0'
  ],
  'glass-series-90-dia': [
    'M16 16c0-5 32-5 32 0s-32 5-32 0Z',
    'M18 20l5 32c2 5 18 5 20 0l5-32',
    'M20 11c5-4 20-4 24 0'
  ],
  'flat-containers': [
    'M10 32c0-7 44-7 44 0s-44 7-44 0Z',
    'M13 34l3 12c3 5 26 5 29 0l3-12',
    'M15 28c5-4 24-4 34 0'
  ],
  'deli-series': [
    'M11 18c0-7 42-7 42 0s-42 7-42 0Z',
    'M12 21l4 30c2 8 28 8 32 0l4-30',
    'M18 26h28M22 48c5 3 15 3 20 0'
  ]
};

export function PackagingIllustration({ slug, productId, ...props }: SVGProps<SVGSVGElement> & { slug: string; productId?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {(drawings[slug] ?? drawings['round-containers']).map((d, i) => (
        <path d={d} key={i} />
      ))}
      {productId === 're-3comp' && <path d="M36 24l11-4" />}
    </svg>
  );
}
