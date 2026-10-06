import type { SVGProps } from 'react';

const drawings: Record<string,string[]> = {
 'hinge-cups':['M18 27h28l-5 24H23z','M18 27c-7-1-9-8-7-14 3-7 20-10 25-3 3 4 2 10-1 14','M22 33h19M24 46h15'],
 'portion-cups':['M16 23c0-6 32-6 32 0s-32 6-32 0Z','M18 27l5 24c2 3 16 3 18 0l5-24','M16 21v4m32-4v4'],
 'ro-series':['M10 27c0-7 44-7 44 0s-44 7-44 0Z','M13 30l7 16c4 7 20 7 24 0l7-16','M13 23c3-15 35-15 38 0'],
 're-series':['M9 23l27-10 20 11-26 12z','M9 23l4 24 19 9 20-9 4-23','M30 36l2 20M24 18l19 13'],
 'round-containers':['M11 18c0-7 42-7 42 0s-42 7-42 0Z','M11 19l4 30c2 9 32 9 34 0l4-30','M18 49c6 4 22 4 28 0'],
 'natraj-sweets':['M8 23l30-10 19 12-30 10z','M8 23l3 18 17 11 25-10 4-17','M27 35l1 17M13 26l25-8'],
 'elite-containers':['M11 17l27-8 16 12-27 9z','M11 17l2 30 16 11 23-9 2-28','M27 30l2 28M17 21l22-7'],
 'tamper-evident':['M12 19c0-7 40-7 40 0s-40 7-40 0Z','M13 23l3 27c2 7 30 7 32 0l3-27','M13 26c9 5 29 5 38 0M44 28v10h7v-9'],
 'meal-boxes':['M8 23l29-11 20 12-29 13z','M8 23l5 24 17 9 22-10 5-22','M23 18l19 13M18 28l28-11M28 37l2 19'],
 'ice-cream-tubs':['M12 18c0-8 40-8 40 0s-40 8-40 0Z','M12 19l3 27c1 11 33 11 34 0l3-27','M15 17c6-4 28-4 34 0M20 40c7 4 17 4 24 0'],
 'custom-iml':['M12 17c0-7 40-7 40 0s-40 7-40 0Z','M12 18l4 32c3 7 29 7 32 0l4-32','M17 28c9 4 21 4 30 0l-2 16c-8 4-18 4-26 0z','M24 34h15M24 39h11'],
};
export function PackagingIllustration({slug,productId,...props}:SVGProps<SVGSVGElement>&{slug:string;productId?:string}) {
 return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
  {(drawings[slug]??drawings['meal-boxes']).map((d,i)=><path d={d} key={i}/>)}
  {productId==='re-3comp'&&<path d="M36 24l11-4"/>}
 </svg>;
}
