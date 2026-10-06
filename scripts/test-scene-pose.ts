import assert from 'node:assert/strict';
import { initialSceneState } from '../components/experience/config';
import { getModelPose } from '../components/experience/scene-pose';
import * as THREE from 'three';
import { fitSceneFrame } from '../components/experience/scene-framing';
const initial=initialSceneState();
for (const aspect of [.5, 1.6, 2.1]) {
 for (let kind=0;kind<3;kind++) assert.equal(getModelPose(kind,initial,0,aspect).visible,kind===0,'The hero must show only the main container at every viewport ratio');
}
const before=getModelPose(0,{...initial,hero:1},0);
const opened=getModelPose(0,{...initial,hero:1,craft:1},0);
assert.ok(Math.abs(opened.rotation[1]-before.rotation[1]-Math.PI*2)<1e-8,'Craft scroll must rotate exactly 360 degrees');
assert.ok(opened.lidLift > .05,'The snap-fit lid must lift far enough to expose the interior');
assert.equal(getModelPose(0,initial,0).lidLift,0,'The lid sits seated until something opens it');
assert.ok(getModelPose(0,{...initial,inspect:1},0).lidLift>getModelPose(0,initial,0).lidLift,'Inspect button opens the lid');
for(let product=0;product<3;product++) {
 const s={...initial,hero:1,craft:1,range:product+1};
 for(let kind=0;kind<3;kind++) assert.equal(getModelPose(kind,s,0).visible,kind===product,'Only the selected product occupies the stage at a settled checkpoint');
}
for(let kind=0;kind<3;kind++) {
 const final=getModelPose(kind,{...initial,hero:1,craft:1,range:3,finale:1},0);
 assert.ok(final.visible);assert.equal(final.position[0],(kind-1)*2.25);
}
for(let step=0;step<=100;step++)for(let kind=0;kind<3;kind++) {
 const p=step/100;const pose=getModelPose(kind,{...initial,hero:p,craft:p,range:p*3,finale:p},123.4);
 assert.ok([...pose.position,...pose.rotation,...pose.camera,pose.scale,pose.lidAngle,pose.lidLift].every(Number.isFinite));
}
assert.equal(getModelPose(0,{...initial,active:false},0).visible,false);
// Measured mobile copy clearance, plus laptop, tablet and desktop slots.
for(const [width,height,left,top,right,bottom] of [
 [360,732,16,434,344,708], [375,587,16,380,359,563],
 [768,920,16,500,752,896], [1024,650,540,180,1008,626],
 [1366,664,680,120,1350,640], [1920,976,850,140,1904,952],
])for(const craft of [0,.5,1]) {
 const stage=new THREE.Group(),model=new THREE.Group();stage.add(model);
 const pose=getModelPose(0,{...initial,hero:1,craft},0,width/height,height);
 model.position.set(...pose.position);model.rotation.set(...pose.rotation);model.scale.setScalar(pose.scale);
 const body=new THREE.Mesh(new THREE.BoxGeometry(.19,.067+pose.lidLift,.13));body.position.y=(.067+pose.lidLift)/2;model.add(body);
 const camera=new THREE.PerspectiveCamera(35,width/height,.1,30);camera.position.set(...pose.camera);camera.lookAt(0,pose.lookAt,0);camera.updateMatrixWorld();
 const frame={left:left/width,top:top/height,right:right/width,bottom:bottom/height};
 const bounds=fitSceneFrame(stage,camera,frame)!;
 assert.ok(bounds.left>=frame.left-.001&&bounds.right<=frame.right+.001&&bounds.top>=frame.top-.001&&bounds.bottom<=frame.bottom+.001,`The container and lifted lid must clear text at ${width}×${height}, craft=${craft}`);
 body.geometry.dispose();
}
console.log('Scene choreography passed: full rotation, snap-fit lid lift, all product checkpoints, final lineup, finite transforms, hidden stage.');
console.log('Responsive framing passed: closed and lifted lids clear mobile, tablet, laptop and desktop text slots.');
for(const aspect of [.5,1.6]) {
 const stage=new THREE.Group();
 for(let kind=0;kind<3;kind++) {
  const pose=getModelPose(kind,{...initial,hero:1,craft:1,range:3,finale:1},0,aspect);
  const model=new THREE.Mesh(new THREE.BoxGeometry(.19,.1,.16));
  model.position.set(...pose.position);model.rotation.set(...pose.rotation);model.scale.setScalar(pose.scale);stage.add(model);
 }
 const pose=getModelPose(0,{...initial,hero:1,craft:1,range:3,finale:1},0,aspect);
 const camera=new THREE.PerspectiveCamera(35,aspect,.1,30);camera.position.set(...pose.camera);camera.lookAt(0,pose.lookAt,0);camera.updateMatrixWorld();
 const frame={left:.05,top:.65,right:.95,bottom:.9},bounds=fitSceneFrame(stage,camera,frame)!;
 assert.ok(bounds.left>=frame.left-.001&&bounds.right<=frame.right+.001&&bounds.top>=frame.top-.001&&bounds.bottom<=frame.bottom+.001,'The complete final lineup must clear the closing text');
 for(const model of stage.children)(model as THREE.Mesh).geometry.dispose();
}
const movingStage=new THREE.Group();
const movingModel=new THREE.Mesh(new THREE.BoxGeometry(1,1,1));movingStage.add(movingModel);
const movingCamera=new THREE.PerspectiveCamera(35,.5,.1,30);movingCamera.position.set(0,1,8);movingCamera.lookAt(0,0,0);movingCamera.updateMatrixWorld();
fitSceneFrame(movingStage,movingCamera,{left:.1,top:.6,right:.9,bottom:.95});
const retained=movingStage.position.clone();
fitSceneFrame(movingStage,movingCamera,{left:.1,top:.9,right:.9,bottom:.5},1/60);
assert.ok(movingStage.visible,'An unavailable handoff slot must not abruptly hide the model');
assert.ok(movingStage.position.equals(retained),'Keep the previous placement through the handoff');
const destination=movingStage.clone(true),nextFrame={left:.1,top:.05,right:.9,bottom:.35};
fitSceneFrame(destination,movingCamera,nextFrame);
fitSceneFrame(movingStage,movingCamera,nextFrame,1/60);
assert.ok(movingStage.position.distanceTo(retained)>0&&movingStage.position.distanceTo(retained)<destination.position.distanceTo(retained),'Framing must move toward the next slot without snapping');
movingModel.geometry.dispose();
console.log('Scroll continuity passed: unavailable slots preserve the model and new slots interpolate.');
