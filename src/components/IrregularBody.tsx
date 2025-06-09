import { useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { FrontSide, Mesh } from 'three';

export default function IrregularBody({
  geometryInfo,
}: {
  geometryInfo: {
    initialRadius: number;
    deformation: [x: number, y: number, z: number];
  };
}) {
  const {
    scene: irregularBody,
    nodes,
    materials,
  } = useGLTF('/models/generic-moon/scene.gltf');

  const gltfRef = useRef(null);

  const { deformation, initialRadius } = geometryInfo;
  const scaledDeformation: [x: number, y: number, z: number] = [
    deformation[0] * initialRadius * 0.009,
    deformation[1] * initialRadius * 0.013,
    deformation[2] * initialRadius * 0.011,
  ];

  useEffect(() => {
    irregularBody.traverse((child) => {
      if (child instanceof Mesh) {
        // Remove bleeding
        child.material.side = FrontSide;
      }
    });
  }, [irregularBody]);

  return (
    <mesh
      ref={gltfRef}
      geometry={(nodes.Daphne_LP001_1_0 as Mesh).geometry}
      material={materials.material}
      scale={scaledDeformation}
      castShadow
      receiveShadow
    />
  );
}
