import { DirectionalLight, Group, Mesh, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { lazy, memo, Suspense, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Node from './Node';
import { getBodyMeshFromGroup } from '../../utils/scene';

const RingSystem = lazy(() => import('./RingSystem'));

export default function PlanetSystem({
  allPlanets,
}: {
  allPlanets: BodyType[];
}) {
  const { id: routeId } = useParams();

  const semimajorAxes = allPlanets.map((p) => p.semimajorAxis ?? 0);
  const min_a = Math.min(...semimajorAxes);
  const max_a = Math.max(...semimajorAxes);

  return allPlanets.map((planet) => {
    const a = planet.semimajorAxis ?? 0;
    const normalized = (a - min_a) / (max_a - min_a);
    const minIntensity = 1;
    const maxIntensity = 8;
    const shadowSourceIntensity =
      minIntensity +
      Math.pow(1 - normalized, 20) * (maxIntensity - minIntensity);

    return (
      <Planet
        key={planet.id}
        bodyData={planet}
        isSystemFocused={Boolean(
          planet.id === routeId ||
            planet.moonBodies?.find((moon) => moon.id === routeId),
        )}
        shadowSourceIntensity={shadowSourceIntensity}
      />
    );
  });
}

const Planet = memo(function ({
  bodyData,
  isSystemFocused,
  shadowSourceIntensity,
}: {
  bodyData: BodyType;
  isSystemFocused: boolean;
  shadowSourceIntensity: number;
}) {
  const { ringSystem, meanRadius } = bodyData;

  const bodyRef = useRef<Group>(null);
  const shadowSourceRef = useRef<DirectionalLight>(null);
  const backdropRef = useRef<Mesh>(null);

  const [loadedRings, setLoadedRings] = useState(false);
  const [isShadowSourceVisible, setIsShadowSourceVisible] = useState(false);

  const shadowSourceFrustumFace = meanRadius * 0.000008;
  const shadowSourceFrustumHeight = meanRadius >= 24622 ? 1000 : 100; // Ref: Netuno

  useFrame(({ camera }) => {
    if (!bodyRef.current || !shadowSourceRef.current) return;

    const activeReference = getBodyMeshFromGroup(bodyRef.current);
    const bodyPosition = activeReference.getWorldPosition(new Vector3());
    const distance = camera.position.distanceTo(bodyPosition);

    const center = new Vector3(0, 0, 0);
    const toCenter = new Vector3().subVectors(center, bodyPosition).normalize();
    const shadowSourcePosition = new Vector3()
      .copy(bodyPosition)
      .add(toCenter.multiplyScalar(shadowSourceFrustumHeight / 2));

    shadowSourceRef.current.position.copy(shadowSourcePosition);
    shadowSourceRef.current.target = bodyRef.current;

    if (backdropRef.current) {
      const toCenter2 = new Vector3()
        .subVectors(center, bodyPosition)
        .normalize();
      backdropRef.current.position
        .copy(bodyPosition)
        .add(toCenter2.multiplyScalar(-50));
    }

    if (distance < 2000) {
      if (!loadedRings) setLoadedRings(true);
    }
  });

  // Atrasa a troca de visibilidade para dar tempo do gsap animar a câmera
  useEffect(() => {
    setTimeout(() => {
      if (isSystemFocused) {
        setIsShadowSourceVisible(true);
      } else {
        setIsShadowSourceVisible(false);
      }
    }, 1000);
  }, [isSystemFocused]);

  return (
    <>
      <Node bodyData={bodyData} bodyRef={bodyRef}>
        <Suspense fallback={null}>
          {ringSystem && loadedRings && (
            <RingSystem bodyRef={bodyRef} bodyData={bodyData} />
          )}
        </Suspense>
      </Node>
      <directionalLight
        ref={shadowSourceRef}
        visible={isShadowSourceVisible}
        castShadow
        color={'white'}
        intensity={shadowSourceIntensity}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={shadowSourceFrustumHeight}
        shadow-camera-left={-shadowSourceFrustumFace}
        shadow-camera-right={shadowSourceFrustumFace}
        shadow-camera-top={shadowSourceFrustumFace}
        shadow-camera-bottom={-shadowSourceFrustumFace}
        shadow-bias={-0.001}
      />

      {/* Debug das sombras
      <mesh ref={backdropRef} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial side={2} color={'green'} />
      </mesh>
      <cameraHelper args={[shadowSourceRef.current.shadow.camera]} /> */}
    </>
  );
});
