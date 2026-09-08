import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import draco from 'draco3dgltf';
import validator from 'gltf-validator';
// ALL_EXTENSIONS, not just Draco: takeaway.glb requires
// KHR_materials_transmission for its clear lid and will not read without it.
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'draco3d.decoder':await draco.createDecoderModule()});
for(const name of ['takeaway','deli','carton']){
 const bytes=await readFile(`public/models/acepack/${name}.glb`);
 const report=await validator.validateBytes(new Uint8Array(bytes));
 assert.equal(report.issues.numErrors,0,JSON.stringify(report.issues));
 assert.ok(bytes.length<2_000_000);
 const doc=await io.readBinary(bytes);
 assert.ok(doc.getRoot().listExtensionsRequired().some(e=>e.extensionName==='KHR_draco_mesh_compression'));
 const nodes=doc.getRoot().listNodes();assert.ok(nodes.some(n=>n.getName()==='LidPivot'));
 assert.ok(nodes.some(n=>n.getName()==='Body'));
 const positions=doc.getRoot().listAccessors().filter(a=>a.getType()==='VEC3');assert.ok(positions.every(a=>Array.from(a.getArray()).every(Number.isFinite)));
 console.log(`${name}: valid, Draco decoded, independent lid, ${(bytes.length/1024).toFixed(1)} KiB; ${report.issues.numWarnings} validator warnings`);
}
