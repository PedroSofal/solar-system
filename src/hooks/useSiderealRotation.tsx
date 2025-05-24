import { useFrame } from '@react-three/fiber';
import { useContext } from 'react';
import { Group, MathUtils, Quaternion, Vector3 } from 'three';
import TimeStaticContext from '../contexts/TimeStaticContext';

const Y_AXIS = new Vector3(0, 1, 0);

export default function useSiderealRotation(
  rotationRef: React.RefObject<Group | null>,
  siderealRotation: number,
) {
  const { getDaysSinceEpoch } = useContext(TimeStaticContext);

  const initialQuaternion = new Quaternion().setFromAxisAngle(
    new Vector3(0, 1, 0),
    MathUtils.degToRad(-75),
  );

  useFrame(() => {
    if (!rotationRef.current) return;

    const t = getDaysSinceEpoch();
    const angle = ((t * 2 * Math.PI) / (siderealRotation / 24)) % (2 * Math.PI);

    const q = new Quaternion().setFromAxisAngle(Y_AXIS, angle);
    rotationRef.current.quaternion.copy(initialQuaternion).multiply(q);
  }, -1);
}
