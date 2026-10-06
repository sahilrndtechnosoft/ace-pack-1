import * as THREE from 'three';

export type SceneFrame = { left:number; top:number; right:number; bottom:number };

// Keep child animation intact; only correct the assembly when it leaves its
// text-free slot. Retain the previous placement during a section handoff.
export function fitSceneFrame(stage:THREE.Group,camera:THREE.PerspectiveCamera,frame:SceneFrame,delta?:number) {
  stage.visible=true;
  const previousPosition=stage.position.clone(),previousScale=stage.scale.x;
  const box=new THREE.Box3(),childBox=new THREE.Box3(),point=new THREE.Vector3();
  const measure=()=>{
    stage.updateMatrixWorld(true);box.makeEmpty();
    for(const child of stage.children)if(child.visible)box.union(childBox.setFromObject(child));
    if(box.isEmpty())return;
    let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
    for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]) {
      point.set(x,y,z).project(camera);
      const px=(point.x+1)/2,py=(1-point.y)/2;
      left=Math.min(left,px);right=Math.max(right,px);top=Math.min(top,py);bottom=Math.max(bottom,py);
    }
    return {left,top,right,bottom};
  };
  if(frame.right-frame.left<=.02||frame.bottom-frame.top<=.02)return measure();
  stage.position.set(0,0,0);stage.scale.setScalar(1);
  const right=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0);
  const up=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,1);
  const forward=camera.getWorldDirection(new THREE.Vector3());
  for(let pass=0;pass<6;pass++) {
    const bounds=measure();if(!bounds)return;
    const width=bounds.right-bounds.left,height=bounds.bottom-bounds.top;
    const scale=Math.min(1,(frame.right-frame.left)/width,(frame.bottom-frame.top)/height);
    if(scale<.999) { stage.scale.multiplyScalar(scale*.98);continue; }
    const cx=(bounds.left+bounds.right)/2,cy=(bounds.top+bounds.bottom)/2;
    const dx=THREE.MathUtils.clamp(cx,frame.left+width/2,frame.right-width/2)-cx;
    const dy=cy-THREE.MathUtils.clamp(cy,frame.top+height/2,frame.bottom-height/2);
    if(Math.abs(dx)+Math.abs(dy)<.0001)break;
    const depth=box.getCenter(point).sub(camera.position).dot(forward);
    const span=2*depth*Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
    stage.position.addScaledVector(right,dx*span*camera.aspect).addScaledVector(up,dy*span);
  }
  if(delta!==undefined&&stage.userData.framed) {
    const amount=1-Math.exp(-14*Math.min(delta,.05));
    stage.position.lerpVectors(previousPosition,stage.position.clone(),amount);
    stage.scale.setScalar(THREE.MathUtils.lerp(previousScale,stage.scale.x,amount));
  }
  stage.userData.framed=true;
  return measure();
}
