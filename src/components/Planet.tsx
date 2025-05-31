import { useFrame } from '@react-three/fiber';
import Node from './Node';
import { getBodyMeshFromGroup } from '../utils';
import { Group, Vector3 } from 'three';
import { lazy, Suspense, useRef, useState } from 'react';

const LazySaturnRings = lazy(() => import('./SaturnRings'));

export default function Planet({ bodyData }: { bodyData: BodyType }) {
  const bodyRef = useRef<Group>(null);
  const { id } = bodyData;
  const [loadedRings, setLoadedRings] = useState(false);

  useFrame(({ camera }) => {
    if (!bodyRef.current) return;

    const activeReference = getBodyMeshFromGroup(bodyRef.current);
    const bodyPosition = activeReference.getWorldPosition(new Vector3());
    const distance = camera.position.distanceTo(bodyPosition);

    if (distance < 2000) {
      if (!loadedRings) setLoadedRings(true);
    }
  });

  return (
    <Node bodyData={bodyData} bodyRef={bodyRef}>
      <Suspense fallback={null}>
        {id === 'saturn' && loadedRings && (
          <LazySaturnRings
            bodyRef={bodyRef}
            saturnEquaRadius={bodyData.equaRadius as number}
          />
        )}
      </Suspense>
    </Node>
  );
}
