import { Group, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useState } from 'react';
import { getBodyMeshFromGroup } from '../utils/scene';

export default function useProximityLoad(
  bodyRef: React.RefObject<Group | null>,
  distanceThreshold: number,
) {
  const [isLoaded, setIsLoaded] = useState(false);

  useFrame(({ camera }) => {
    if (!bodyRef.current) return;

    const activeReference = getBodyMeshFromGroup(bodyRef.current);
    const bodyPosition = activeReference.getWorldPosition(new Vector3());
    const cameraDistance = camera.position.distanceTo(bodyPosition);

    if (cameraDistance < distanceThreshold) {
      if (!isLoaded) setIsLoaded(true);
    }
  });

  return isLoaded;
}
