import assert from 'node:assert/strict';
import { initialSceneState } from '../components/experience/config';
import { getModelPose } from '../components/experience/scene-pose';
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
console.log('Scene choreography passed: full rotation, snap-fit lid lift, all product checkpoints, final lineup, finite transforms, hidden stage.');
