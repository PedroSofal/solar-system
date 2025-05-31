import { useFrame } from '@react-three/fiber';
import { Object3D, Vector3 } from 'three';
import { getActiveLOD } from '../utils';

function calculateCulling(
  currentDistance: number,
  farStart: number,
  farEnd: number,
  nearStart: number,
  nearEnd: number,
) {
  if (currentDistance <= farEnd && currentDistance >= nearStart) {
    return 1;
  }

  if (currentDistance < farStart && currentDistance > farEnd) {
    return (currentDistance - farStart) / (farEnd - farStart);
  }

  if (currentDistance > nearEnd && currentDistance < nearStart) {
    return (currentDistance - nearEnd) / (nearStart - nearEnd);
  }

  return 0;
}

export default function useDistanceCulling({
  farStart = 200000,
  farEnd = farStart,
  nearStart = 0,
  nearEnd = nearStart,
  reference,
  targets,
  opacityRef,
  visibilityRef,
}: {
  farStart?: number;
  farEnd?: number;
  nearStart?: number;
  nearEnd?: number;
  reference: React.RefObject<any | null>;
  targets?: React.RefObject<any>[];
  opacityRef?: React.RefObject<number>;
  visibilityRef?: React.RefObject<boolean>;
}) {
  useFrame(({ camera }) => {
    if (!reference.current || (farStart === 200000 && nearStart === 0)) return;

    const activeReference = getActiveLOD(reference.current) as Object3D;
    // console.log(activeReference, reference.current);
    const bodyPosition = activeReference.getWorldPosition(new Vector3());
    const distance = camera.position.distanceTo(bodyPosition);

    const cullingFactor = calculateCulling(
      distance,
      farStart,
      farEnd,
      nearStart,
      nearEnd,
    );
    const isVisible = cullingFactor > 0;

    if (targets && targets.length > 0) {
      for (const target of targets) {
        const activeTarget = getActiveLOD(target.current);

        if (activeTarget?.material) {
          activeTarget.material.opacity = cullingFactor;
          activeTarget.material.fillOpacity = cullingFactor;
        } else {
          if (activeTarget?.opacity !== undefined) {
            activeTarget.opacity = cullingFactor;
          }

          if (activeTarget?.fillOpacity !== undefined) {
            activeTarget.fillOpacity = cullingFactor;
          }
        }

        if (activeTarget?.visible !== undefined) {
          activeTarget.visible = isVisible;
        }
      }
    }

    if (opacityRef) opacityRef.current = cullingFactor;
    if (visibilityRef) visibilityRef.current = isVisible;
  });

  return null;
}
