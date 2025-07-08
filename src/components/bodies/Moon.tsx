import { Group, Quaternion, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { memo, useContext, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SceneContext from '../../contexts/SceneContext';
import Node from './Node';
import { getReferencePlaneQuaternionFromPole } from '../../utils/astrophysics';
import useBodyVisibility from '../../hooks/useBodyVisibility';

function getSizeThreshold(parentId: string) {
  switch (parentId) {
    case 'jupiter':
      return 1560.8; // Europa
    case 'saturn':
      return 198.8; // Mimas
    case 'uranus':
      return 235.7; // Miranda
    case 'neptune':
      return 1353.4; // Tritão
    default:
      return 0;
  }
}

export default function MoonsContainer({
  heliocentricBodies,
}: {
  heliocentricBodies: BodyType[];
}) {
  const { id: routeId } = useParams();

  return heliocentricBodies.map((body) =>
    body.moonBodies?.map((moon) => (
      <Moon
        key={moon.id}
        bodyData={moon}
        isBodyFocused={routeId === moon.id}
        isSystemFocused={Boolean(
          body.id === routeId ||
            body.moonBodies?.find((moon) => moon.id === routeId),
        )}
      />
    )),
  );
}

const Moon = memo(function ({
  bodyData,
  isBodyFocused,
  isSystemFocused,
}: {
  bodyData: BodyType;
  isBodyFocused: boolean;
  isSystemFocused: boolean;
}) {
  const { parent, referencePlane, meanRadius, id } = bodyData;

  const sceneRef = useContext(SceneContext);

  const moonGroupRef = useRef<Group>(null);
  const bodyRef = useRef<Group>(null);
  const parentRef = useRef<Group>(null);

  const parentId = (parent as Parent).name;
  const isMajorMoon = meanRadius >= getSizeThreshold(parentId);

  const isActive = useBodyVisibility(
    moonGroupRef,
    'moon',
    isSystemFocused,
    isBodyFocused,
    isMajorMoon,
  );

  useEffect(() => {
    parentRef.current = sceneRef.current.getObjectByName(parentId) as Group;
  }, [parentId]);

  useFrame(() => {
    if (!parentRef.current || !moonGroupRef.current || !isActive) return;
    const parentPosition = parentRef.current.getWorldPosition(new Vector3());
    moonGroupRef.current.position.copy(parentPosition);
  }, -1);

  const refPlaneQuaternion = useMemo(() => {
    const q = new Quaternion();
    const { ref, ra, dec } = referencePlane;

    if (ref === 'ecliptic') {
      return q;
    }

    if (ref === 'laplace') {
      return q.copy(getReferencePlaneQuaternionFromPole(ra, dec));
    }
  }, [referencePlane, id, parentId]);

  return (
    isActive && (
      <group ref={moonGroupRef} name="ancoragem do satélite">
        <group quaternion={refPlaneQuaternion} name="reference plane">
          <Node bodyData={bodyData} bodyRef={bodyRef} />
        </group>
      </group>
    )
  );
});
