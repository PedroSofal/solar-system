import { useFrame } from '@react-three/fiber';
import { Object3D, Vector3 } from 'three';

export default function useStickySize(
  targetRef: React.RefObject<Object3D | null>,
  anchorRef: React.RefObject<Object3D | null>,
  minSize: number,
  maxSize: number,
) {
  useFrame(({ camera }) => {
    if (targetRef.current && anchorRef.current) {
      const anchorPosition = anchorRef.current.getWorldPosition(new Vector3());
      const distance = camera.position.distanceTo(anchorPosition);

      const scaleFactor = distance / camera.position.z;
      const aspect = window.innerWidth / window.innerHeight;
      const worldSize = Math.max(
        (minSize / window.innerHeight) *
          (camera.position.z / aspect) *
          scaleFactor,
        maxSize,
      );

      targetRef.current.scale.set(worldSize, worldSize, worldSize);
      targetRef.current.lookAt(camera.position);
      targetRef.current.position.copy(anchorRef.current?.position);
    }
  }, 0);
}
