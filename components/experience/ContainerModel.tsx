'use client';

import { forwardRef, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { containerFinishes } from './config';

export const CONTAINER_MODEL_URL = '/models/acepack/takeaway.glb';
const LID_LIFT = 0.055; // model units, same lift the scroll scene uses when the lid opens

/**
 * The takeaway container GLB, centred and scaled to ~2 units, for the inline and full-screen
 * viewers. `finish` indexes containerFinishes; `lid` 0..1 lifts the lid off the base.
 */
export const ContainerModel = forwardRef<THREE.Group, { finish: number; lid: number }>(function ContainerModel({ finish, lid }, ref) {
  const gltf = useGLTF(CONTAINER_MODEL_URL, '/draco/', true);

  const { scene, bodies, lidNode, lidBaseY, scale, offset } = useMemo(() => {
    const copy = gltf.scene.clone(true);
    const bodyMaterials: THREE.MeshPhysicalMaterial[] = [];
    copy.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.material = (object.material as THREE.Material).clone();
      const mat = object.material as THREE.MeshPhysicalMaterial;
      mat.envMapIntensity = 1.25;
      if (mat.transmission > 0) {
        // Clear lid: keep it glassy rather than flattening it like the opaque body.
        mat.envMapIntensity = 0.18;
        mat.roughness = 0.045;
        return;
      }
      object.castShadow = true;
      object.receiveShadow = true;
      mat.roughness = 0.34;
      mat.metalness = 0.1;
      if (!mat.transparent) bodyMaterials.push(mat);
    });
    const box = new THREE.Box3().setFromObject(copy);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const pivot = copy.getObjectByName('LidPivot') ?? null;
    return {
      scene: copy,
      bodies: bodyMaterials,
      lidNode: pivot,
      lidBaseY: pivot?.position.y ?? 0,
      scale: 2 / Math.max(size.x, size.y, size.z),
      offset: center.multiplyScalar(-1),
    };
  }, [gltf.scene]);

  useEffect(() => {
    const color = containerFinishes[Math.min(Math.max(finish, 0), containerFinishes.length - 1)].color;
    bodies.forEach((m) => m.color.set(color));
  }, [bodies, finish]);

  useEffect(() => {
    if (lidNode) lidNode.position.y = lidBaseY + LID_LIFT * Math.min(Math.max(lid, 0), 1);
  }, [lidNode, lidBaseY, lid]);

  useEffect(
    () => () => {
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) (object.material as THREE.Material).dispose();
      });
    },
    [scene]
  );

  return (
    <group ref={ref} scale={scale}>
      <primitive object={scene} position={offset} />
    </group>
  );
});

useGLTF.preload(CONTAINER_MODEL_URL, '/draco/', true);
