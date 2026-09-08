/**
 * Converts the reference takeaway container into a web asset matching the
 * conventions the rest of public/models/acepack follows: a `Body` node, a
 * `LidPivot` node the scene animates directly, and Draco-compressed geometry.
 *
 * Source stays out of the repo; pass its path as the first argument.
 *   node scripts/prepare-takeaway.mjs <source.glb>
 */
import { readFile, writeFile } from 'node:fs/promises';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { draco, simplify, weld, prune, dedup } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
import draco3d from 'draco3dgltf';

const source = process.argv[2] ?? '/home/rnd/Downloads/takeaway_container_package/takeaway_container.glb';
const destination = 'public/models/acepack/takeaway.glb';

// The reference asset names its nodes after the real parts. The scene looks up
// `LidPivot` by name and drives it directly (see PackagingScene.tsx), and
// scripts/validate-packaging.mjs asserts both names exist on every model.
const RENAME = { Container_Body: 'Body', Clear_Snap_Fit_Lid: 'LidPivot' };

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'draco3d.decoder': await draco3d.createDecoderModule(),
    'draco3d.encoder': await draco3d.createEncoderModule(),
  });

const doc = await io.read(source);
const root = doc.getRoot();

const before = root.listMeshes().flatMap(m => m.listPrimitives()).reduce((n, p) => n + p.getIndices().getCount() / 3, 0);

for (const node of root.listNodes()) {
  const renamed = RENAME[node.getName()];
  if (renamed) node.setName(renamed);
}
// Mesh names travel with the node into three.js userData; keep them aligned so
// the material pass in PackagingScene can address parts by a single name.
for (const mesh of root.listMeshes()) {
  const renamed = RENAME[mesh.getName()];
  if (renamed) mesh.setName(renamed);
}

await MeshoptSimplifier.ready;
await doc.transform(
  dedup(),
  // The reference mesh duplicates vertices along UV seams; simplify needs a
  // welded topology to collapse edges across them at all.
  weld({ tolerance: 0 }),
  // 78k triangles for two smooth-walled parts is far more than this asset
  // needs at the size it renders. A 0.1% error bound keeps the flange, bead
  // and lid profile — the silhouette detail that reads on screen — intact.
  simplify({ simplifier: MeshoptSimplifier, ratio: 0.38, error: 0.001, lockBorder: true }),
  prune(),
  draco({ method: 'edgebreaker', encodeSpeed: 5, decodeSpeed: 5 }),
);

const after = root.listMeshes().flatMap(m => m.listPrimitives()).reduce((n, p) => n + p.getIndices().getCount() / 3, 0);
const bytes = await io.writeBinary(doc);
await writeFile(destination, bytes);

const sourceBytes = (await readFile(source)).length;
console.log(`nodes:      ${root.listNodes().map(n => n.getName()).join(', ')}`);
console.log(`triangles:  ${before.toLocaleString()} -> ${after.toLocaleString()}`);
console.log(`size:       ${(sourceBytes / 1024 / 1024).toFixed(2)} MB -> ${(bytes.length / 1024).toFixed(1)} KiB`);
console.log(`extensions: ${root.listExtensionsUsed().map(e => e.extensionName).join(', ')}`);
console.log(`written:    ${destination}`);
