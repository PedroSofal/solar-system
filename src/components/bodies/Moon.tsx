import { Group, Quaternion, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { memo, useContext, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import LayerContext from '../../contexts/LayerContext';
import SceneContext from '../../contexts/SceneContext';
import Node from './Node';
import { getReferencePlaneQuaternionFromPole } from '../../utils/astrophysics';

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
  allPlanets,
}: {
  allPlanets: BodyType[];
}) {
  const { id: routeId } = useParams();

  return allPlanets.map((planet) =>
    planet.moonBodies?.map((moon) => (
      <Moon key={moon.id} bodyData={moon} isFocused={routeId === moon.id} />
    )),
  );
}

const Moon = memo(function ({
  bodyData,
  isFocused,
}: {
  bodyData: BodyType;
  isFocused: boolean;
}) {
  const { parent, referencePlane, meanRadius, id } = bodyData;

  const sceneRef = useContext(SceneContext);
  const { getLayer } = useContext(LayerContext);

  const moonGroupRef = useRef<Group>(null);
  const bodyRef = useRef<Group>(null);
  const planetRef = useRef<Group>(null);

  const areAllMoonsVisible = getLayer('all-moons')?.value;

  const parentId = (parent as Parent).name;

  useEffect(() => {
    planetRef.current = sceneRef.current.getObjectByName(parentId) as Group;
  }, [parentId]);

  useEffect(() => {
    if (!moonGroupRef.current) return;

    if (
      areAllMoonsVisible ||
      (meanRadius && meanRadius >= getSizeThreshold(parentId)) ||
      isFocused
    ) {
      moonGroupRef.current.visible = true;
      moonGroupRef.current.traverse((obj) => (obj.visible = true));
    } else {
      moonGroupRef.current.visible = false;
      moonGroupRef.current.traverse((obj) => (obj.visible = false));
    }
  }, [areAllMoonsVisible, isFocused]);

  useFrame(() => {
    if (!planetRef.current || !moonGroupRef.current) return;
    const planetPosition = planetRef.current.getWorldPosition(new Vector3());
    moonGroupRef.current.position.copy(planetPosition);
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
    <group ref={moonGroupRef} name="ancoragem do satélite">
      <group quaternion={refPlaneQuaternion} name="reference plane">
        <Node bodyData={bodyData} bodyRef={bodyRef} />
      </group>
    </group>
  );
});
