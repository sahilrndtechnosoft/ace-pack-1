'use client';

import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, useGLTF, useProgress, Sparkles, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { containerFinishes, type SceneState, defaultFinish } from './config';
import { getModelPose } from './scene-pose';

type Props = { state:MutableRefObject<SceneState>; loadRange:boolean; renderActive:boolean; onReady:()=>void; onProgress:(n:number)=>void; onFailure:()=>void };
// Phones now run this scene rather than falling back to stills, so the parts
// of it that cost the most on a tile-based mobile GPU are dialled back:
// transmission alone forces an extra full-scene render pass every frame.
function useCompactViewport() {
  const [compact,setCompact]=useState(()=>typeof window!=='undefined'&&window.matchMedia('(max-width: 767px)').matches);
  useEffect(()=>{
    const media=window.matchMedia('(max-width: 767px)');
    const update=()=>setCompact(media.matches);
    media.addEventListener('change',update);return()=>media.removeEventListener('change',update);
  },[]);
  return compact;
}
function Progress({onProgress}:Pick<Props,'onProgress'>) {
  const progress=useProgress(s=>s.progress);
  useEffect(()=>onProgress(progress),[progress,onProgress]);return null;
}
function Container({kind,state,compact,onReady}:{kind:number;state:Props['state'];compact:boolean;onReady?:()=>void}) {
  const id=['takeaway','shallow-bowl','round-tub'][kind];
  const gltf=useGLTF(`/models/acepack/${id}.glb`,'/draco/',true);
  const scene=useMemo(()=>{
    const copy=gltf.scene.clone(true);
    copy.traverse(object=>{
      if(object instanceof THREE.Mesh){
        object.material=object.material.clone();
        const mat=object.material as THREE.MeshPhysicalMaterial;
        mat.envMapIntensity=1.25;
        // The takeaway lid is optically transmissive — it carries its own IOR
        // and volume thickness, and the opaque-plastic overrides below would
        // flatten it into frosted grey. Its clarity is the point of the part.
        if(mat.transmission>0){
          // Real transmission costs an extra render pass per frame. On phones
          // trade it for plain alpha: still reads as a clear lid, one pass.
          if(compact){mat.transmission=0;mat.thickness=0;mat.ior=1.49;mat.transparent=true;mat.opacity=.44;mat.color.set('#dfe4e2');mat.roughness=.16;}
          return;
        }
        // Seed the hero body with the default finish so the very first frame is
        // already the right colour; the per-frame lerp below then owns it.
        if(kind===0){mat.color.set(containerFinishes[defaultFinish].color);mat.roughness=.34;mat.metalness=.1;}
      }
    });return copy;
  },[gltf.scene,kind,compact]);
  const finishes=useMemo(()=>containerFinishes.map(finish=>new THREE.Color(finish.color)),[]);
  const bodies=useMemo(()=>{const result:THREE.MeshStandardMaterial[]=[];if(kind===0)scene.traverse(object=>{if(object instanceof THREE.Mesh){const material=object.material as THREE.MeshPhysicalMaterial;if(!material.transmission&&!material.transparent)result.push(material);}});return result;},[scene,kind]);
  const lid=useMemo(()=>scene.getObjectByName('LidPivot'),[scene]);
  const lidY=useMemo(()=>lid?.position.y??0,[lid]);
  const group=useRef<THREE.Group>(null);
  useEffect(()=>{onReady?.();return()=>{scene.traverse(object=>{if(object instanceof THREE.Mesh)(object.material as THREE.Material).dispose();});};},[onReady,scene]);
  useFrame(({clock,size})=>{
    const g=group.current;if(!g)return;
    const pose=getModelPose(kind,state.current,clock.elapsedTime,size.width/size.height,size.height);
    g.visible=pose.visible;if(!g.visible)return;
    const finish=THREE.MathUtils.clamp(state.current.finish,0,finishes.length-1);
    const from=Math.floor(finish),to=Math.min(from+1,finishes.length-1);
    bodies.forEach(material=>material.color.lerpColors(finishes[from],finishes[to],finish-from));
    g.scale.setScalar(pose.scale);g.position.set(...pose.position);g.rotation.set(...pose.rotation);
    // All three formats now have separate snap-fit lids.
    if(lid)lid.position.y=lidY+pose.lidLift;
  });
  return <group ref={group}><primitive object={scene}/></group>;
}
function Rig({state,onFailure}:Pick<Props,'state'|'onFailure'>) {
  const {gl,camera,setFrameloop,invalidate}=useThree();const light=useRef<THREE.PointLight>(null);const last=useRef(0);
  useEffect(()=>{
    const lost=(event:Event)=>{event.preventDefault();onFailure();};
    const visibility=()=>{setFrameloop(document.hidden?'never':state.current.active?'always':'demand');invalidate();};
    gl.domElement.addEventListener('webglcontextlost',lost);document.addEventListener('visibilitychange',visibility);
    return()=>{gl.domElement.removeEventListener('webglcontextlost',lost);document.removeEventListener('visibilitychange',visibility);};
  },[gl,onFailure,setFrameloop,invalidate,state]);
  useFrame(({clock,size})=>{
    const s=state.current;const pose=getModelPose(0,s,clock.elapsedTime,size.width/size.height,size.height);
    camera.position.set(...pose.camera);camera.lookAt(0,pose.lookAt,0);
    if(light.current)light.current.position.set(2+s.pointerX*2,3+s.pointerY,3);
    if(process.env.NODE_ENV==='development'&&clock.elapsedTime-last.current>.2){
      last.current=clock.elapsedTime;
      gl.domElement.dataset.rotation=pose.rotation[1].toFixed(3);gl.domElement.dataset.lid=pose.lidAngle.toFixed(3);gl.domElement.dataset.range=s.range.toFixed(3);gl.domElement.dataset.finale=s.finale.toFixed(3);gl.domElement.dataset.hero=s.hero.toFixed(3);
    }
  });
  return <pointLight ref={light} intensity={12} distance={15} color="#e8cf9e"/>;
}
export default function PackagingScene(props:Props) {
  const compact=useCompactViewport();
  const [quality,setQuality]=useState(1.5);
  return <><Progress onProgress={props.onProgress}/><Canvas frameloop={props.renderActive?'always':'demand'} dpr={compact?1:quality} camera={{position:[0,2.1,8.1],fov:35,near:.1,far:30}} gl={{antialias:!compact,alpha:true,powerPreference:'high-performance'}}>
    <ambientLight intensity={.65}/><directionalLight position={[-3,6,5]} intensity={2.5} color="#fff5dd"/><directionalLight position={[4,3,-4]} intensity={4} color="#ffffff"/>
    <PerformanceMonitor flipflops={2} onDecline={()=>setQuality(1)} onIncline={()=>setQuality(1.5)} onFallback={()=>setQuality(1)}/>
    <Rig state={props.state} onFailure={props.onFailure}/>
    <Environment resolution={compact?64:128} frames={1}>
      <Lightformer form="rect" intensity={4} position={[0,5,-2]} rotation={[Math.PI/2,0,0]} scale={[8,8,1]}/>
      <Lightformer form="rect" intensity={3} position={[-5,2,2]} rotation={[0,Math.PI/2,0]} scale={[4,7,1]}/>
      <Lightformer form="rect" color="#d4b477" intensity={2} position={[4,1,0]} rotation={[0,-Math.PI/2,0]} scale={[3,6,1]}/>
    </Environment>
    <Suspense fallback={null}><Container kind={0} compact={compact} state={props.state} onReady={props.onReady}/></Suspense>
    {props.loadRange&&<><Suspense fallback={null}><Container kind={1} compact={compact} state={props.state}/></Suspense><Suspense fallback={null}><Container kind={2} compact={compact} state={props.state}/></Suspense></>}
    <Sparkles count={compact?10:22} scale={[10,4,3]} position={[0,0,-2]} size={1.7} speed={.18} opacity={.28} color="#cdb881"/>
  </Canvas></>;
}
