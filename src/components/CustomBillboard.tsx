import { Group, Quaternion } from 'three';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export default function CustomBillboard({
  children,
  priority,
  follow = true,
  lockX = false,
  lockY = false,
  lockZ = false,
  ...props
}: {
  children: React.ReactNode;
  priority?: number;
  follow?: boolean;
  lockX?: boolean;
  lockY?: boolean;
  lockZ?: boolean;
} & React.JSX.IntrinsicElements['group']) {
  const inner = useRef<Group>(null);
  const localRef = useRef<Group>(null);
  const q = useRef(new Quaternion());

  useFrame(({ camera }) => {
    if (!follow || !localRef.current || !inner.current) return;

    const prevRotation = inner.current.rotation.clone();

    localRef.current.updateMatrix();
    localRef.current.updateWorldMatrix(false, false);
    localRef.current.getWorldQuaternion(q.current);

    camera
      .getWorldQuaternion(inner.current.quaternion)
      .premultiply(q.current.invert());

    if (lockX) inner.current.rotation.x = prevRotation.x;
    if (lockY) inner.current.rotation.y = prevRotation.y;
    if (lockZ) inner.current.rotation.z = prevRotation.z;
  }, priority || 0);

  return (
    <group ref={localRef} {...props}>
      <group ref={inner}>{children}</group>
    </group>
  );
}
