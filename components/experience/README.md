# AcePack homepage experience

Only `/` uses this experience. The existing Header, Footer, CursorTrail, and other page layouts are preserved. `components/ui/SmoothScroll.tsx` defers to `ExperienceScroll` only on `/`, avoiding two Lenis instances.

## Main files

- `HomeExperience.tsx`: semantic homepage content, loading/error states, device preferences, GSAP timelines, mobile static selector.
- `PackagingScene.tsx`: one R3F canvas, lazy range models, local studio environment, separate animated lids, camera and pointer lighting.
- `ExperienceScroll.tsx`: requested `@studio-freight/lenis`, GSAP ticker, scrollerProxy, accessible anchor scrolling, cleanup.
- `config.ts`: product links, display copy, preview paths, shared mutable scene state.
- `experience.css`: styles scoped to this homepage, using the existing ivory/charcoal/gold Tailwind tokens.

## Assets

Run `npm run models:generate` to rebuild original assets and still previews. Run `npm run models:validate` to check glTF validity, Draco decoding, size, and lid nodes. Three.js geometries are exported through glTF Transform, compressed with Draco, and validated with the Khronos validator. No downloaded model licenses are required for the authored packaging geometry. Draco decoder files in `public/draco` come from the installed Three.js package; keep its MIT license alongside the files.

| File | Triangles | Compressed GLB |
| --- | ---: | ---: |
| `public/models/acepack/clamshell.glb` | 7,616 | 30,180 bytes |
| `public/models/acepack/deli.glb` | 9,984 | 23,320 bytes |
| `public/models/acepack/carton.glb` | 3,906 | 43,900 bytes |

Paper uses fewer triangles because its flat folded faces need less geometry. `manifest.json` is regenerated with exact current measurements. Every model uses meters, +Y up, with its root at the base center. The clamshell is about 220 × 160 × 72 mm, deli about 146 × 146 × 98 mm, and carton about 190 × 132 × 63 mm. These are illustrative concept dimensions, not tooling drawings.

Each asset contains `Body` and `LidPivot`. Clamshell/carton lids rotate around local X (0 closed, negative angles open; nominal maximum -1.9 radians). Deli `LidPivot` translates upward from its initial Y. GLBs ship closed; the hero applies a slight open pose. The carton contains `BrandingSurface` and a replaceable embedded logo texture. Its kraft material includes a small procedural fiber texture. A deterministic software z-buffer renderer produces matching transparent WebP previews from the same meshes.

## Choreography

`craft` runs 0→1 from the craft section entering the viewport to its bottom reaching the viewport bottom. It adds exactly one full Y rotation; the lid opens between craft progress 0.28 and 0.72. ScrollTrigger uses `scrub: true`. Idle movement is separate and fades out as the craft story starts.

`range` runs 0→1 on collection entry, then 1→2 and 2→3 as the deli and carton articles enter. Each model moves, scales, and rotates between these positions. Camera dolly uses the same state. `finale` runs 0→1 as the closing section enters and arranges all three products in a row. The fixed canvas fades at the existing footer.

The hero model mounts immediately once device capability is known. Deli/carton loading begins within 1,200 px of the collection. Each model has its own Suspense boundary. Loading progress comes from drei's actual loading manager; readiness comes from the resolved hero GLB. Network/decoder/render failures and an 18-second loading timeout switch to still images. The loader includes a manual still-image escape.

## Performance and accessibility

- Dynamic Three/R3F chunk is requested only for desktop 3D mode.
- DPR capped at 2, local Draco decoding, no remote HDRI or font dependency.
- Cached local Environment generated once at 128 px.
- Demand rendering while the 2D manufacturing/trust strip is active; rendering suspended when the document is hidden.
- Static previews for reduced motion, coarse pointers, viewports under 768 px, data saver, memory ≤4 GB when reported, ≤2 logical processors, unavailable WebGL2, and explicit still mode.
- Keyboard navigation, existing shared navbar, accessible image selector, focusable marquee with pause on hover/focus, semantic product descriptions, reduced-motion reveals.

Use `npm run typecheck` and `npm run build` for compilation. `ACEPACK_BUILD_DIR=.next-production npm run build` isolates production output from a running dev preview. Lighthouse targets (85 desktop / 70 mobile) are goals, not measured results. Browser/device QA and Lighthouse runs remain to be performed before launch.

## Content to confirm before launch

The existing client list explicitly identifies its names as placeholders. The new strip therefore shows served sectors, not invented endorsements. Replace with approved logo assets and names when supplied. Counters reflect the 11 categories in the existing catalog, the 3 illustrated forms, and PP resin code 5; no production capacity or blanket recyclability percentages are invented. The kraft carton is labeled as a concept and links to an enquiry. Actual product sizes, food/temperature suitability, certification, and production claims should come from approved product specifications.
