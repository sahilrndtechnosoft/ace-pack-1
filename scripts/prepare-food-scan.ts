/** Adapt the CC BY pasta scan: npx tsx scripts/prepare-food-scan.ts /path/to/source.glb */
import { Document, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { draco, weld, simplify, cloneDocument } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
import draco3d from 'draco3dgltf';
import sharp from 'sharp';
import * as THREE from 'three';
import assert from 'node:assert/strict';

async function main() {
  assert(process.argv[2], 'Provide the original Pasta Bowl - Polycam GLB');
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const source = await io.read(process.argv[2]);
  const sourceTexture = source.getRoot().listMaterials()[0].getBaseColorTexture()!;
  const image = await sharp(sourceTexture.getImage()!).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const {width,height,channels} = image.info;
  function food(u:number,v:number) {
    const x=Math.max(0,Math.min(width-1,Math.round(u*(width-1))));
    const y=Math.max(0,Math.min(height-1,Math.round(v*(height-1))));
    const i=(y*width+x)*channels;
    const r=image.data[i],g=image.data[i+1],b=image.data[i+2];
    return (r>g*1.06 && g>b*1.12) || (g>r*.94 && g>b*1.2 && r<170);
  }
  const positions:number[]=[],uvs:number[]=[],normals:number[]=[];
  for(const node of source.getRoot().listNodes()) {
    const matrix=new THREE.Matrix4().fromArray(node.getWorldMatrix());
    const normalMatrix=new THREE.Matrix3().getNormalMatrix(matrix);
    for(const primitive of node.getMesh()?.listPrimitives()??[]) {
      const p=primitive.getAttribute('POSITION')!, uv=primitive.getAttribute('TEXCOORD_0')!, index=primitive.getIndices();
      const count=index?.getCount()??p.getCount();
      for(let i=0;i<count;i+=3){
        const ids=[0,1,2].map(k=>index?index.getScalar(i+k):i+k);
        const vertices=ids.map(id=>new THREE.Vector3().fromArray(p.getElement(id,[])).applyMatrix4(matrix));
        const coords=ids.map(id=>uv.getElement(id,[]));
        const center=vertices.reduce((a,b)=>a.add(b),new THREE.Vector3()).multiplyScalar(1/3);
        // The scan includes a patterned bowl and table: keep only food-coloured faces above the table.
        if(center.y<.32 || Math.hypot(center.x-.08,center.z+.05)>.43)continue;
        const samples=coords.filter(([u,v])=>food(u,v)).length;
        const mid=coords.reduce((a,b)=>[a[0]+b[0]/3,a[1]+b[1]/3],[0,0]);
        if(samples<2 || !food(mid[0],mid[1]))continue;
        vertices.forEach((v,k)=>{
          positions.push(v.x,v.y,v.z);uvs.push(...coords[k]);
          const normal=new THREE.Vector3().fromArray(primitive.getAttribute('NORMAL')!.getElement(ids[k],[])).applyMatrix3(normalMatrix).normalize();
          normals.push(normal.x,normal.y,normal.z);
        });
      }
    }
  }
  assert(positions.length>9000,'Food extraction must retain a substantial mesh');
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.computeBoundingBox();
  const box=geometry.boundingBox!, size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
  const p=geometry.getAttribute('position');
  for(let i=0;i<p.count;i++)p.setXYZ(i,(p.getX(i)-center.x)/size.x*.156,
    .030+(p.getY(i)-box.min.y)/size.y*.025,(p.getZ(i)-center.z)/size.z*.094);
  // Preserve the scan's smooth normals so shared vertices can be simplified.
  const normal=new THREE.Vector3();
  for(let i=0;i<normals.length;i+=3){
    normal.set(normals[i]*size.x/.156,normals[i+1]*size.y/.025,normals[i+2]*size.z/.094).normalize();
    normal.toArray(normals,i);
  }
  geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));
  geometry.computeBoundingBox();
  const fitted=geometry.boundingBox!;
  assert(fitted.min.x>=-.079&&fitted.max.x<=.079&&fitted.min.z>=-.05&&fitted.max.z<=.05);
  assert(fitted.min.y>.006&&fitted.max.y<.058,'Filling must clear the floor and closed lid');
  const doc=new Document(),buffer=doc.createBuffer();
  Object.assign(doc.getRoot().getAsset(), source.getRoot().getAsset(), {generator:'Ace Packaging scan preparation'});
  const tex=doc.createTexture('Photographed pasta, tomato and herbs').setImage(await sharp(sourceTexture.getImage()!).resize({width:2048,withoutEnlargement:true}).jpeg({quality:90}).toBuffer()).setMimeType('image/jpeg');
  const mat=doc.createMaterial('Cooked pasta').setBaseColorTexture(tex).setBaseColorFactor([.76,.76,.76,1]).setRoughnessFactor(.8).setMetallicFactor(0).setDoubleSided(true);
  const prim=doc.createPrimitive().setMaterial(mat);
  for(const [name,attribute,type] of [['POSITION',geometry.getAttribute('position'),'VEC3'],['NORMAL',geometry.getAttribute('normal'),'VEC3'],['TEXCOORD_0',new THREE.Float32BufferAttribute(uvs,2),'VEC2']] as const)
    prim.setAttribute(name,doc.createAccessor().setBuffer(buffer).setType(type).setArray(new Float32Array(attribute.array)));
  doc.createScene().addChild(doc.createNode('Scanned cooked pasta filling').setMesh(doc.createMesh('Pasta with tomato and herbs').addPrimitive(prim)));
  await MeshoptSimplifier.ready;
  await doc.transform(weld(),simplify({simplifier:MeshoptSimplifier,ratio:.65,error:.001}));
  const mobile=cloneDocument(doc);
  await mobile.transform(simplify({simplifier:MeshoptSimplifier,ratio:.35,error:.01}));
  for(const texture of mobile.getRoot().listTextures())texture.setImage(await sharp(texture.getImage()!).resize({width:1024,withoutEnlargement:true}).jpeg({quality:86}).toBuffer());
  const triangleCount=(asset:Document)=>asset.getRoot().listMeshes().reduce((sum,mesh)=>sum+mesh.listPrimitives().reduce((n,primitive)=>n+(primitive.getIndices()?.getCount()??primitive.getAttribute('POSITION')!.getCount())/3,0),0);
  assert(triangleCount(mobile)<20000,'Mobile food must stay below 20,000 triangles');
  io.registerExtensions([KHRDracoMeshCompression]).registerDependencies({'draco3d.encoder':await draco3d.createEncoderModule()});
  await doc.transform(draco());
  await io.write('public/models/food/pasta-scan.glb',doc);
  await mobile.transform(draco());
  await io.write('public/models/food/pasta-scan-mobile.glb',mobile);
  console.log(`Food triangles: desktop ${triangleCount(doc)}, mobile ${triangleCount(mobile)}`);
  geometry.dispose();
}
void main();
