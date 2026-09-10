/** Original, meter-scale packaging assets. Re-run with npm run models:generate. */
import * as THREE from 'three';
import { Document, NodeIO } from '@gltf-transform/core';
import { KHRDracoMeshCompression, KHRMaterialsTransmission, KHRMaterialsIOR, KHRMaterialsVolume } from '@gltf-transform/extensions';
import { draco } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import sharp from 'sharp';
import { mkdir, writeFile, copyFile, readFile } from 'node:fs/promises';

const destination = 'public/models/acepack';
const charcoal = new THREE.MeshStandardMaterial({ color: '#292e2c', roughness: .44, metalness: .03 });
const rim = new THREE.MeshStandardMaterial({ color: '#3b413c', roughness: .32, metalness: .04 });
const ivory = new THREE.MeshStandardMaterial({ color: '#e2ddcd', roughness: .58 });
const kraft = new THREE.MeshStandardMaterial({ color: '#c6a476', roughness: .94, name: 'Kraft paper' });
const label = new THREE.MeshStandardMaterial({ color: '#eee8d9', roughness: .86, name: 'Brand label' });
const gold = new THREE.MeshStandardMaterial({ color: '#b89858', roughness: .55, metalness: .15 });
const blackPP = new THREE.MeshStandardMaterial({ name: 'Black polypropylene', color: '#101113', roughness: .34, metalness: 0 });
const clearPP = new THREE.MeshPhysicalMaterial({ name: 'Clear snap lid', color: '#ffffff', roughness: .09, metalness: 0, transmission: .97, thickness: .0009, ior: 1.49 });

// Closed cross-sections include the underside, outer wall, sealing bead and
// inner cavity. Dimensions are design approximations from the reference photos.
function roundContainer(shallow: boolean) {
  const root = new THREE.Group(); root.name = shallow ? 'ShallowBowl' : 'RoundTub';
  const radius = shallow ? .073 : .075;
  const height = shallow ? .043 : .067;
  const base = radius * (shallow ? .78 : .81);
  const profile: [number, number][] = [
    [0,.0015],[base-.004,.0015],[base-.003,0],[base-.001,0],
    [base+.0005,.001],[base+.0015,.003],[base+.002,.006],
    [radius-.004,height-.009],[radius-.003,height-.004],
    [radius-.001,height-.003],[radius+.0015,height-.002],
    [radius+.0025,height-.0005],[radius+.0025,height+.001],
    [radius+.001,height+.002],[radius-.001,height+.002],
    [radius-.0025,height+.001],[radius-.0035,height-.001],
    [radius-.0045,height-.005],[base+.0005,.007],
    [base-.001,.0045],[base-.004,.0035],[0,.0035],
  ];
  const body = new THREE.Mesh(new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(...p)),192),blackPP);
  body.name='Body'; root.add(body);
  const lid = new THREE.Group(); lid.name='LidPivot'; lid.position.y=height+.001;
  const capHeight=shallow?.017:.004;
  const topRadius=radius*(shallow?.73:.91);
  // Raised centre, recessed stacking ring and a rolled locking skirt. The
  // inner return closes the thin plastic sheet instead of making a solid disc.
  const capProfile:[number,number][]=[
    [0,capHeight-.0009],[topRadius-.004,capHeight-.0009],
    [topRadius-.002,capHeight-.0012],[topRadius,capHeight-.0025],
    [radius-.006,.002],[radius-.003,.001],
    [radius+.001,.001],[radius+.0025,0],[radius+.003,-.002],
    [radius+.004,-.0025],[radius+.005,-.0015],[radius+.005,.0005],
    [radius+.004,.002],[radius+.002,.0025],[radius-.002,.0025],
    [radius-.004,.0035],[topRadius+.001,capHeight-.0005],
    [topRadius,capHeight+.001],[topRadius-.0015,capHeight+.0018],
    [topRadius-.003,capHeight+.0018],[topRadius-.004,capHeight+.0003],
    [topRadius-.006,capHeight],[0,capHeight],
  ];
  const cap=new THREE.Mesh(new THREE.LatheGeometry(capProfile.map(p=>new THREE.Vector2(...p)),192),clearPP);
  cap.name='Lid';lid.add(cap);root.add(lid);return root;
}

// Clockwise perimeter, seen from above; consistent ring indices preserve smooth normals.
function perimeter(w: number, d: number, radius: number, steps = 24) {
  const points: [number, number][] = [];
  for (let c = 0; c < 4; c++) {
    const angle = c * Math.PI / 2;
    const cx = (c === 0 || c === 3 ? 1 : -1) * (w / 2 - radius);
    const cz = (c < 2 ? 1 : -1) * (d / 2 - radius);
    for (let j = 0; j < steps; j++) {
      const a = angle + j / steps * Math.PI / 2;
      points.push([cx + Math.cos(a) * radius, cz + Math.sin(a) * radius]);
    }
  }
  return points;
}
function shell(w: number, d: number, rows: [number, number][], round: number, material: THREE.Material, name: string) {
  const pos: number[] = [], uv: number[] = [], indices: number[] = [];
  for (const [y, inset] of rows) {
    for (const [x, z] of perimeter(w - inset * 2, d - inset * 2, Math.min(round, (d - inset * 2) / 3))) {
      pos.push(x, y, z); uv.push(x / w + .5, z / d + .5);
    }
  }
  const n = pos.length / 3 / rows.length;
  for (let r = 0; r < rows.length - 1; r++) for (let i = 0; i < n; i++) {
    const a = r * n + i, b = r * n + (i + 1) % n, c = a + n, e = b + n;
    indices.push(a, c, b, b, c, e);
  }
  // Close the inner and outer base; interior remains a hollow, usable cavity.
  for (const [r, reverse] of [[0, true], [rows.length - 1, false]] as const) {
    const center = pos.length / 3; pos.push(0, rows[r][0], 0); uv.push(.5, .5);
    for (let i = 0; i < n; i++) {
      const a = r * n + i, b = r * n + (i + 1) % n;
      indices.push(...(reverse ? [center, a, b] : [center, b, a]));
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(indices); g.computeVertexNormals();
  const mesh = new THREE.Mesh(g, material); mesh.name = name; return mesh;
}
function box(w: number, h: number, d: number, material: THREE.Material, name: string, x=0,y=0,z=0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d,4,2,4), material); m.name=name; m.position.set(x,y,z); return m;
}
function clamshell() {
  const root = new THREE.Group(); root.name = 'Clamshell';
  const rows: [number,number][] = [[0,.015],[.002,.016],[.004,.014],[.008,.013],[.016,.011],[.024,.009],[.032,.006],[.040,.004],[.047,.002],[.05,0],[.051,-.002],[.053,-.002],[.055,0],[.055,.003],[.052,.004],[.048,.005],[.04,.007],[.032,.009],[.024,.012],[.016,.014],[.008,.017],[.006,.018]];
  root.add(shell(.22,.16,rows,.023,charcoal,'Body'));
  const lid = new THREE.Group(); lid.name='LidPivot'; lid.position.set(0,.055,-.08);
  const top = shell(.224,.164,[[0,0],[.002,-.001],[.004,0],[.006,.003],[.011,.008],[.015,.013],[.016,.015],[.017,.018],[.017,.02],[.016,.021],[.014,.023]],.025,rim,'Lid');
  top.position.z=.08; lid.add(top);
  for(let i=0;i<8;i++) lid.add(box(.13,.001,.0015,charcoal,'Lid emboss',0,.017,.044+i*.009));
  root.add(box(.055,.004,.009,rim,'Hinge',0,.053,-.078));
  root.add(box(.037,.004,.009,rim,'Snap tab',0,.052,.081));
  root.add(lid); return root;
}
function deli() {
  const root = new THREE.Group(); root.name='Deli';
  const profile = [[.052,0],[.053,.002],[.053,.006],[.055,.008],[.056,.016],[.057,.026],[.059,.036],[.061,.046],[.063,.058],[.065,.070],[.067,.082],[.068,.084],[.071,.085],[.072,.087],[.071,.089],[.068,.09],[.066,.088],[.065,.081],[.063,.07],[.061,.06],[.059,.05],[.057,.04],[.055,.03],[.053,.02],[.052,.01],[.05,.004],[0,.004]];
  const body = new THREE.Mesh(new THREE.LatheGeometry(profile.map(([x,y])=>new THREE.Vector2(x,y)),128),ivory); body.name='Body';root.add(body);
  const lid=new THREE.Group();lid.name='LidPivot';lid.position.y=.089;
  const mesh=new THREE.Mesh(new THREE.LatheGeometry([[0,.007],[.055,.007],[.059,.007],[.062,.008],[.065,.009],[.067,.008],[.068,.005],[.071,.005],[.073,.003],[.073,0],[.072,-.001],[.07,0],[.068,.003],[0,.003]].map(([x,y])=>new THREE.Vector2(x,y)),128),charcoal);mesh.name='Lid';lid.add(mesh);root.add(lid);return root;
}
function carton() {
  const root=new THREE.Group();root.name='Carton';
  root.add(shell(.19,.13,[[0,.012],[.002,.012],[.006,.011],[.014,.009],[.024,.007],[.034,.005],[.044,.003],[.054,.001],[.06,0],[.061,.002],[.057,.003],[.047,.005],[.037,.007],[.027,.009],[.017,.011],[.007,.013],[.003,.014]],.006,kraft,'Body'));
  const lid=new THREE.Group();lid.name='LidPivot';lid.position.set(0,.061,-.065);
  lid.add(box(.191,.002,.132,kraft,'Lid',0,0,.065));
  lid.add(box(.002,.014,.13,kraft,'Left tuck flap',-.094,-.006,.065));
  lid.add(box(.002,.014,.13,kraft,'Right tuck flap',.094,-.006,.065));
  lid.add(box(.185,.014,.002,kraft,'Front tuck flap',0,-.006,.13));
  const brand = new THREE.Mesh(new THREE.PlaneGeometry(.095,.061),label);brand.rotation.x=-Math.PI/2;brand.position.set(0,.0012,.065);brand.name='BrandingSurface';lid.add(brand);
  root.add(lid);root.add(box(.002,.049,.002,gold,'Fold seam',.09,.029,.061));return root;
}
// One-piece hinged sauce container — the Hinge Cups line. Small tapered round
// cup with a continuous rim flange and a lid that swings on the rear hinge, so
// it reads at a glance as a different object from the meal box and the round tub.
function hingeCup() {
  const root=new THREE.Group();root.name='HingeCup';
  const bodyProfile:[number,number][]=[[.022,0],[.023,.002],[.0245,.006],[.026,.013],[.028,.021],[.030,.028],[.031,.031],[.0325,.032],[.034,.034],[.033,.035],[.031,.035],[.0298,.033],[.0288,.028],[.0268,.020],[.0248,.012],[.0228,.005],[.021,.003],[0,.003]];
  const body=new THREE.Mesh(new THREE.LatheGeometry(bodyProfile.map(([x,y])=>new THREE.Vector2(x,y)),96),ivory);
  body.name='Body';root.add(body);
  const lid=new THREE.Group();lid.name='LidPivot';lid.position.set(0,.035,-.034);
  const capProfile:[number,number][]=[[0,.005],[.014,.005],[.022,.0048],[.027,.0042],[.0305,.003],[.0328,.0012],[.034,0],[.0335,-.0016],[.0312,-.0024],[.0285,-.0018],[0,-.0018]];
  const cap=new THREE.Mesh(new THREE.LatheGeometry(capProfile.map(([x,y])=>new THREE.Vector2(x,y)),96),charcoal);
  cap.name='Lid';cap.position.z=.034;lid.add(cap);
  root.add(box(.020,.0026,.006,charcoal,'Hinge',0,.0336,-.0346));
  root.add(box(.014,.0022,.005,rim,'Snap tab',0,.0332,.0352));
  root.add(lid);return root;
}
async function exportAsset(root: THREE.Group, slug: string) {
  const doc=new Document();const buffer=doc.createBuffer();const scene=doc.createScene(root.name);
  const transmission=doc.createExtension(KHRMaterialsTransmission);
  const ior=doc.createExtension(KHRMaterialsIOR);
  const volume=doc.createExtension(KHRMaterialsVolume);
  const materials=new Map<THREE.Material, ReturnType<Document['createMaterial']>>();
  async function add(object: THREE.Object3D, parent: ReturnType<Document['createNode']> | ReturnType<Document['createScene']>) {
    const node=doc.createNode(object.name).setTranslation(object.position.toArray()).setRotation(object.quaternion.toArray()).setScale(object.scale.toArray());parent.addChild(node);
    if(object instanceof THREE.Mesh) {
      const geometry=object.geometry as THREE.BufferGeometry; const mat=object.material as THREE.MeshStandardMaterial;
      if(!materials.has(mat)) {
        const m=doc.createMaterial(mat.name||mat.color.getHexString()).setBaseColorFactor([mat.color.r,mat.color.g,mat.color.b,1]).setRoughnessFactor(mat.roughness).setMetallicFactor(mat.metalness);
        if(mat instanceof THREE.MeshPhysicalMaterial && mat.transmission>0) {
          m.setExtension('KHR_materials_transmission',transmission.createTransmission().setTransmissionFactor(mat.transmission));
          m.setExtension('KHR_materials_ior',ior.createIOR().setIOR(mat.ior));
          m.setExtension('KHR_materials_volume',volume.createVolume().setThicknessFactor(mat.thickness));
        }
        if(mat===kraft) {
          const pixels=Buffer.alloc(128*128*3); let seed=7;
          for(let i=0;i<pixels.length;i+=3) { seed=(seed*16807)%2147483647;const c=222+(seed%29);pixels[i]=c;pixels[i+1]=c;pixels[i+2]=c; }
          const png=await sharp(pixels,{raw:{width:128,height:128,channels:3}}).png().toBuffer();
          m.setBaseColorTexture(doc.createTexture('Paper fibers').setImage(png).setMimeType('image/png'));
        }
        if(mat===label) {
          const svg='<svg width="512" height="320" xmlns="http://www.w3.org/2000/svg"><rect width="512" height="320" fill="#eee8d9"/><text x="256" y="155" text-anchor="middle" font-family="sans-serif" font-size="84" font-weight="bold" fill="#292e2c">acepack.</text><text x="256" y="215" text-anchor="middle" font-family="sans-serif" font-size="19" letter-spacing="5" fill="#715d37">MADE TO HOLD MORE</text></svg>';
          m.setBaseColorFactor([1,1,1,1]).setBaseColorTexture(doc.createTexture('Replaceable brand artwork').setImage(await sharp(Buffer.from(svg)).png().toBuffer()).setMimeType('image/png'));
        }
        materials.set(mat,m);
      }
      const primitive=doc.createPrimitive().setMaterial(materials.get(mat)!);
      for(const [key,semantic,type] of [['position','POSITION','VEC3'],['normal','NORMAL','VEC3'],['uv','TEXCOORD_0','VEC2']] as const) {
        const attr=geometry.getAttribute(key);if(attr)primitive.setAttribute(semantic,doc.createAccessor().setType(type).setArray(new Float32Array(attr.array)).setBuffer(buffer));
      }
      if(geometry.index)primitive.setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(geometry.index.array)).setBuffer(buffer));
      node.setMesh(doc.createMesh(object.name).addPrimitive(primitive));
    }
    for(const child of object.children)await add(child,node);
  }
  await add(root,scene);
  const io=new NodeIO().registerExtensions([KHRDracoMeshCompression,KHRMaterialsTransmission,KHRMaterialsIOR,KHRMaterialsVolume]).registerDependencies({'draco3d.encoder':await draco3d.createEncoderModule()});
  await doc.transform(draco({method:'edgebreaker',encodeSpeed:5,decodeSpeed:5}));
  const data=await io.writeBinary(doc); await writeFile(`${destination}/${slug}.glb`,data);
  let triangles=0;root.traverse(o=>{if(o instanceof THREE.Mesh)triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;});
  return {file:`${slug}.glb`,bytes:data.length,triangles,units:'meters',origin:'base center',lidNode:'LidPivot',lidMotion:['deli','shallow-bowl','round-tub'].includes(slug)?'translate +Y, 0–0.07m':'rotate X, 0 to -1.9 radians'};
}
// Offline z-buffer render of the exact authored mesh. Mobile never needs Three.js.
async function preview(root: THREE.Group, slug: string) {
  const W=1300,H=1000;
  root.rotation.y=-.45;
  if(slug==='clamshell'||slug==='hinge-cup')root.getObjectByName('LidPivot')!.rotation.x=-.32;
  const camera=new THREE.PerspectiveCamera(32,W/H,.01,10);
  // The hinge cup is roughly a third the size of the other containers; without
  // pulling the camera in with it, it renders as a speck in the middle of frame.
  const zoom=slug==='hinge-cup'?.35:1, aim=slug==='hinge-cup'?.017:.04;
  camera.position.set(.28*zoom,.25*zoom,.4*zoom);camera.lookAt(0,aim,0);camera.updateMatrixWorld();root.updateMatrixWorld(true);
  const depth=new Float32Array(W*H).fill(Infinity);const pixels=Buffer.alloc(W*H*4);
  const light=new THREE.Vector3(-.4,1,.7).normalize();
  const normalMatrix=new THREE.Matrix3();
  const brandSvg='<svg width="512" height="320" xmlns="http://www.w3.org/2000/svg"><rect width="512" height="320" fill="#eee8d9"/><text x="256" y="155" text-anchor="middle" font-family="sans-serif" font-size="84" font-weight="bold" fill="#292e2c">acepack.</text><text x="256" y="215" text-anchor="middle" font-family="sans-serif" font-size="19" letter-spacing="5" fill="#715d37">MADE TO HOLD MORE</text></svg>';
  const brand=await sharp(Buffer.from(brandSvg)).ensureAlpha().raw().toBuffer();
  root.traverse(object=>{
    if(!(object instanceof THREE.Mesh))return;
    const g=object.geometry as THREE.BufferGeometry,mat=object.material as THREE.MeshStandardMaterial;
    const p=g.getAttribute('position'),n=g.getAttribute('normal'),uv=g.getAttribute('uv'),index=g.index;
    normalMatrix.getNormalMatrix(object.matrixWorld);
    for(let i=0;i<(index?.count??p.count);i+=3) {
      const ids=[0,1,2].map(j=>index?index.getX(i+j):i+j);
      const world=ids.map(j=>new THREE.Vector3().fromBufferAttribute(p,j).applyMatrix4(object.matrixWorld));
      const face=world[1].clone().sub(world[0]).cross(world[2].clone().sub(world[0])).normalize();
      if(face.dot(camera.position.clone().sub(world[0]))<=0)continue;
      const ns=ids.map(j=>new THREE.Vector3().fromBufferAttribute(n,j).applyMatrix3(normalMatrix).normalize());
      const v=world.map(x=>x.project(camera));
      const sx=v.map(x=>(x.x+1)*W/2),sy=v.map(x=>(1-x.y)*H/2);
      const denominator=(sy[1]-sy[2])*(sx[0]-sx[2])+(sx[2]-sx[1])*(sy[0]-sy[2]);
      if(Math.abs(denominator)<.000001)continue;
      const minX=Math.max(0,Math.floor(Math.min(...sx))),maxX=Math.min(W-1,Math.ceil(Math.max(...sx)));
      const minY=Math.max(0,Math.floor(Math.min(...sy))),maxY=Math.min(H-1,Math.ceil(Math.max(...sy)));
      for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++) {
        const a=((sy[1]-sy[2])*(x+.5-sx[2])+(sx[2]-sx[1])*(y+.5-sy[2]))/denominator;
        const b=((sy[2]-sy[0])*(x+.5-sx[2])+(sx[0]-sx[2])*(y+.5-sy[2]))/denominator;
        const c=1-a-b;if(a<0||b<0||c<0)continue;
        const z=v[0].z*a+v[1].z*b+v[2].z*c,offset=y*W+x;
        if(z>=depth[offset])continue;depth[offset]=z;
        const normal=ns[0].clone().multiplyScalar(a).addScaledVector(ns[1],b).addScaledVector(ns[2],c).normalize();
        const brightness=.62+Math.max(0,normal.dot(light))*.5;
        const color=mat.color.clone().multiplyScalar(brightness).convertLinearToSRGB();
        let rgb=[color.r*255,color.g*255,color.b*255];
        if(mat===label) {
          const u=uv.getX(ids[0])*a+uv.getX(ids[1])*b+uv.getX(ids[2])*c;
          const vv=uv.getY(ids[0])*a+uv.getY(ids[1])*b+uv.getY(ids[2])*c;
          const ti=(Math.max(0,Math.min(319,Math.floor((1-vv)*320)))*512+Math.max(0,Math.min(511,Math.floor(u*512))))*4;
          rgb=[brand[ti],brand[ti+1],brand[ti+2]];
        }
        pixels[offset*4]=Math.min(255,rgb[0]);pixels[offset*4+1]=Math.min(255,rgb[1]);pixels[offset*4+2]=Math.min(255,rgb[2]);pixels[offset*4+3]=255;
      }
    }
  });
  const object=await sharp(pixels,{raw:{width:W,height:H,channels:4}}).png().toBuffer();
  const shadow=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><radialGradient id="s"><stop stop-color="#292e2c" stop-opacity=".18"/><stop offset="1" stop-color="#292e2c" stop-opacity="0"/></radialGradient></defs><ellipse cx="660" cy="770" rx="360" ry="85" fill="url(#s)"/></svg>`);
  const combined=await sharp(shadow).composite([{input:object}]).png().toBuffer();
  await sharp(combined).resize(1000).webp({quality:92,alphaQuality:100}).toFile(`${destination}/${slug}.webp`);
}
async function main(){
  await mkdir(destination,{recursive:true});await mkdir('public/draco',{recursive:true});
  for(const file of ['draco_wasm_wrapper.js','draco_decoder.wasm','draco_decoder.js'])await copyFile(`node_modules/three/examples/jsm/libs/draco/gltf/${file}`,`public/draco/${file}`);
  // Pass slugs to rebuild only those, e.g. `npm run models:generate -- hinge-cup`.
  // Without an argument every asset is regenerated.
  const only=process.argv.slice(2);
  const builders=[['clamshell',clamshell],['deli',deli],['carton',carton],['hinge-cup',hingeCup],['shallow-bowl',()=>roundContainer(true)],['round-tub',()=>roundContainer(false)]] as const;
  const selected=only.length?builders.filter(([slug])=>only.includes(slug)):builders;
  if(!selected.length){console.error(`No such model. Known: ${builders.map(([s])=>s).join(', ')}`);process.exit(1);}
  let manifest:Awaited<ReturnType<typeof exportAsset>>[]=[];
  try{manifest=JSON.parse(await readFile(`${destination}/manifest.json`,'utf8'));}catch{}
  for(const [slug,build] of selected){
    const root=build();
    const entry=await exportAsset(root,slug);await preview(root,slug);
    const at=manifest.findIndex(m=>m.file===entry.file);
    at>=0?manifest[at]=entry:manifest.push(entry);
  }
  await writeFile(`${destination}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');console.log(manifest);
}
main().catch(e=>{console.error(e);process.exit(1);});
