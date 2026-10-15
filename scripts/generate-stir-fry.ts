/** Rebuild the individual ingredient meshes: npx tsx scripts/generate-stir-fry.ts */
import { Document, NodeIO } from '@gltf-transform/core';
import { KHRDracoMeshCompression, KHRMaterialsClearcoat } from '@gltf-transform/extensions';
import { draco } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import sharp from 'sharp';
import assert from 'node:assert/strict';

async function main() {
  let seed = 731;
  const random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
  const geometries: THREE.BufferGeometry[] = [];
  function ingredient(geometry: THREE.BufferGeometry, tile: number, shade: number) {
    const g = geometry.index ? geometry.toNonIndexed() : geometry;
    if (g !== geometry) geometry.dispose();
    const uv = g.getAttribute('uv');
    // Stay inside each atlas tile so mip filtering cannot bleed adjacent foods.
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (tile % 2) * .5 + .025 + uv.getX(i) * .45, Math.floor(tile / 2) * .5 + .025 + uv.getY(i) * .45);
    const colors = new Float32Array(g.getAttribute('position').count * 3);
    const tint = tile === 2 ? [1, .38, .24] : tile === 3 ? [.65, .9, .3] : [1, 1, 1];
    for (let i = 0; i < colors.length; i++) colors[i] = shade * tint[i % 3];
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometries.push(g);
  }
  // Each strand has its own curling path, length, thickness and sauce tone.
  for (let i = 0; i < 260; i++) {
    const cx = (random() - .5) * .098, cz = (random() - .5) * .052;
    const rx = .010 + random() * .015, rz = .006 + random() * .012;
    const phase = random() * Math.PI * 2, arc = 2.5 + random() * 4.3;
    const level = .027 + (i / 260) * .021;
    const points = Array.from({length: 13}, (_, j) => {
      const t = j / 12, a = phase + t * arc;
      return new THREE.Vector3(cx + Math.cos(a) * rx + Math.sin(t * 9 + phase) * .002,
        level + Math.sin(t * 10 + phase) * .0015,
        cz + Math.sin(a) * rz);
    });
    const path = new THREE.CatmullRomCurve3(points);
    const g = new THREE.TubeGeometry(path, 24, .00085 + random() * .00035, 6, false);
    ingredient(g, 0, .65 + random() * .3);
  }
  // Fleshy pepper strips are flattened curved ribbons, not cylindrical noodles.
  for (let i = 0; i < 34; i++) {
    const points = Array.from({length: 7}, (_, j) => {
      const t = j / 6;
      return new THREE.Vector3((t - .5) * (.017 + (i % 4) * .003), Math.sin(t * Math.PI) * .002, Math.sin(t * 3.8) * .004);
    });
    const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 14, .0025 + random() * .001, 8, false);
    g.scale(1, .4, 1);
    g.rotateY(random() * Math.PI * 2);
    g.rotateZ((random() - .5) * .3);
    g.translate((random() - .5) * .12, .047 + random() * .004, (random() - .5) * .068);
    ingredient(g, i % 2 ? 2 : 3, .72 + random() * .25);
  }
  // Recognizable mushroom cross sections: curved caps, recessed gills and stems.
  const mushroom = new THREE.Shape();
  mushroom.moveTo(-1, 0);
  mushroom.bezierCurveTo(-1.03, .85, -.48, 1.13, 0, 1.1);
  mushroom.bezierCurveTo(.6, 1.13, 1.05, .6, 1, 0);
  mushroom.quadraticCurveTo(.7, -.12, .27, .05);
  mushroom.lineTo(.25, -.65);
  mushroom.quadraticCurveTo(0, -.82, -.27, -.62);
  mushroom.lineTo(-.23, .05);
  mushroom.quadraticCurveTo(-.7, -.13, -1, 0);
  for (let i = 0; i < 15; i++) {
    const g = new THREE.ExtrudeGeometry(mushroom, {depth:.22, bevelEnabled:true, bevelThickness:.06, bevelSize:.06, bevelSegments:2, steps:1, curveSegments:10});
    const pos = g.getAttribute('position'), uv = g.getAttribute('uv');
    for (let j = 0; j < pos.count; j++) uv.setXY(j, (pos.getX(j) + 1.1) / 2.2, (pos.getY(j) + .85) / 2.1);
    const size = .005 + random() * .002;
    g.scale(size, size, size);
    g.rotateX(-Math.PI / 2 + (random() - .5) * .4);
    g.rotateY(random() * Math.PI * 2);
    g.translate((random() - .5) * .12, .050 + random() * .002, (random() - .5) * .068);
    ingredient(g, 1, .68 + random() * .25);
  }
  const geometry = mergeGeometries(geometries)!;
  geometries.forEach(g => g.dispose());
  geometry.computeBoundingBox();
  const bounds = geometry.boundingBox!;
  assert(bounds.min.x >= -.079 && bounds.max.x <= .079, 'Food must fit the cavity width');
  assert(bounds.min.z >= -.05 && bounds.max.z <= .05, 'Food must fit the cavity depth');
  assert(bounds.min.y >= .006 && bounds.max.y < .058, 'Food must clear the floor and lid');
  assert(geometry.getAttribute('position').count / 3 < 100000);
  const doc = new Document(), buffer = doc.createBuffer();
  const coat = doc.createExtension(KHRMaterialsClearcoat);
  const texture = doc.createTexture('Ingredient surfaces').setImage(await sharp('public/models/food/ingredient-surfaces.webp').jpeg({quality:90}).toBuffer()).setMimeType('image/jpeg');
  const material = doc.createMaterial('Sauced stir-fry').setBaseColorTexture(texture).setBaseColorFactor([.48, .40, .31, 1]).setRoughnessFactor(.62).setMetallicFactor(0)
    .setExtension('KHR_materials_clearcoat', coat.createClearcoat().setClearcoatFactor(.08).setClearcoatRoughnessFactor(.45));
  const primitive = doc.createPrimitive().setMaterial(material);
  for (const [name, attribute, type] of [
    ['POSITION', 'position', 'VEC3'], ['NORMAL', 'normal', 'VEC3'], ['TEXCOORD_0', 'uv', 'VEC2'], ['COLOR_0', 'color', 'VEC3'],
  ] as const) primitive.setAttribute(name, doc.createAccessor().setBuffer(buffer).setType(type).setArray(new Float32Array(geometry.getAttribute(attribute).array)));
  doc.createScene().addChild(doc.createNode('Individual noodles, peppers and mushrooms').setMesh(doc.createMesh('Stir-fry').addPrimitive(primitive)));
  const io = new NodeIO().registerExtensions([KHRDracoMeshCompression, KHRMaterialsClearcoat]).registerDependencies({'draco3d.encoder':await draco3d.createEncoderModule()});
  await doc.transform(draco({method:'edgebreaker'}));
  await io.write('public/models/food/stir-fry.glb', doc);
  geometry.dispose();
}
void main();
