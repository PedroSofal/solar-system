import { useFrame } from '@react-three/fiber';
import Node from './Node';
import { getActiveLOD } from '../utils';
import { Mesh, Vector3 } from 'three';
import { lazy, Suspense, useRef, useState } from 'react';

// const LazyMoon = lazy(() => import('./Moon'));
const LazySaturnRings = lazy(() => import('./SaturnRings'));

export default function Planet({ bodyData }: { bodyData: BodyType }) {
  const bodyRef = useRef<Mesh>(null);

  const { id, moonBodies } = bodyData;

  // const [loadedMoons, setLoadedMoons] = useState<BodyType[]>([]);
  const [loadedRings, setLoadedRings] = useState(false);

  useFrame(({ camera }) => {
    if (!bodyRef.current) return;

    const activeReference = getActiveLOD(bodyRef.current);
    const bodyPosition = activeReference.getWorldPosition(new Vector3());
    const distance = camera.position.distanceTo(bodyPosition);

    if (distance < 2000) {
      if (!loadedRings) setLoadedRings(true);

      // moonBodies?.forEach((moon) => {
      //   setLoadedMoons((prev) => {
      //     if (prev.some((loadedMoon) => loadedMoon.id === moon.id)) return prev;
      //     return [...prev, moon];
      //   });
      // });
    }
  });

  return (
    <Node bodyData={bodyData} bodyRef={bodyRef}>
      <>
        {/* <Suspense fallback={null}>
          {loadedMoons?.map((moon) => (
            <LazyMoon key={moon.id} bodyData={moon} />
          ))}
        </Suspense> */}
        <Suspense fallback={null}>
          {id === 'saturn' && loadedRings && (
            <LazySaturnRings
              bodyRef={bodyRef}
              saturnEquaRadius={bodyData.equaRadius as number}
            />
          )}
        </Suspense>
      </>
    </Node>
  );
}
