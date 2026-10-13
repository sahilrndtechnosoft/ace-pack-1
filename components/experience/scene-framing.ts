import * as THREE from 'three';

export type SceneFrame = { left:number; top:number; right:number; bottom:number };

/**
 * Stabilized scene framing: keeps the model assembly in stable studio bounds
 * without running recursive multi-pass projection loops that cause model jitter,
 * frame-lag, and scale pulsations during rotation.
 */
export function fitSceneFrame(stage: THREE.Group, camera: THREE.PerspectiveCamera, frame: SceneFrame, delta = 0.016) {
  stage.visible = true;

  // Gentle, delta-independent exponential damping towards neutral origin
  const damping = 1 - Math.exp(-12 * Math.min(delta, 0.05));
  stage.position.x = THREE.MathUtils.lerp(stage.position.x, 0, damping);
  stage.position.y = THREE.MathUtils.lerp(stage.position.y, 0, damping);
  stage.position.z = THREE.MathUtils.lerp(stage.position.z, 0, damping);
  stage.scale.setScalar(THREE.MathUtils.lerp(stage.scale.x, 1.0, damping));

  stage.userData.framed = true;
  return { left: frame.left, top: frame.top, right: frame.right, bottom: frame.bottom };
}
