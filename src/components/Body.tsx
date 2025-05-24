import { useMemo } from 'react';
import { Mesh } from 'three';
import { Detailed } from '@react-three/drei';
import { toModelScale } from '../utils';

export default function Body({
  bodyRef,
  id,
  scaledEquaRadius,
  scaledPolarRadius,
  dimension,
  material,
  atmosphere,
  shine,
}: {
  bodyRef: React.RefObject<Mesh | null>;
  id: string;
  scaledEquaRadius: number;
  scaledPolarRadius: number;
  dimension?: string;
  material: React.ReactNode;
  atmosphere?: React.ReactNode;
  shine?: React.ReactNode;
}) {
  const geometryInfo = useMemo(() => {
    let initialRadius: number;
    let deformation: [x: number, y: number, z: number];

    if (dimension) {
      const xyz = dimension.split('x').map(Number);
      initialRadius = 1;
      deformation = [
        toModelScale(xyz[0]) / 2,
        toModelScale(xyz[2]) / 2,
        toModelScale(xyz[1]) / 2,
      ];
    } else {
      const flattening = scaledPolarRadius / scaledEquaRadius;
      initialRadius = scaledEquaRadius;
      deformation = [1, flattening, 1];
    }

    return { initialRadius, deformation };
  }, []);

  const detailLevels = [
    { segments: 64, distance: 0 },
    { segments: 32, distance: 100 },
    { segments: 16, distance: 500 },
  ];

  return (
    <group ref={bodyRef} name={id}>
      <Detailed distances={detailLevels.map((level) => level.distance)}>
        {detailLevels.map(({ segments }, index) => (
          <mesh key={index} scale={geometryInfo.deformation}>
            <sphereGeometry
              args={[geometryInfo.initialRadius, segments, segments]}
            />
            {material}
            {atmosphere}
            {shine}
          </mesh>
        ))}
      </Detailed>
    </group>
  );
}
