# Ace Packaging homepage

The original homepage component, scroll-driven container model, GSAP scene choreography, and original component layouts are restored. `HomeExperience.tsx` drives the original `PackagingScene.tsx` through `experience-motion.ts` and the scene state in `config.ts`.

The refreshed colours, Manrope / Instrument Serif fonts, readable text, spacing, and original logo are retained. The added catalog 3D viewers and generated product models are removed; catalog displays use their previous images.

Run `npm run typecheck` and `npm run build` to check the site.

Responsive framing measures the visible copy and fits the animated assembly into the remaining space. Section handoffs keep the previous placement and ease toward the next slot; the manufacturing transition slides the scene out and back in.

Run `node --import tsx scripts/test-scene-pose.ts` for the choreography, responsive-clearance, and scroll-continuity checks.
