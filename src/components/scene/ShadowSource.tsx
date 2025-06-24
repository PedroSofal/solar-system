import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { DirectionalLight, Group, Vector3 } from 'three';
import { getBodyMeshFromGroup } from '../../utils/scene';

function getLightIntensity(distance: number) {
  const clamped = Math.max(distance * 0.0005, 0.1); // evita divisão por zero
  const decayed = 4 / clamped ** 1.1;
  return Math.max(decayed, 0.2);
}

export default function ShadowSource({
  bodyRef,
  meanRadius,
  isSystemFocused,
}: {
  bodyRef: React.RefObject<Group | null>;
  meanRadius: number;
  isSystemFocused: boolean;
}) {
  const shadowSourceRef = useRef<DirectionalLight>(null);
  // const backdropRef = useRef<Mesh>(null);

  const [isShadowSourceVisible, setIsShadowSourceVisible] = useState(false);

  const shadowSourceFrustumFace = meanRadius * 0.000008;
  const shadowSourceFrustumHeight = meanRadius >= 24622 ? 1000 : 100; // Ref: Netuno

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

  useFrame(() => {
    if (!bodyRef.current || !shadowSourceRef.current || !isSystemFocused) {
      return;
    }

    const activeReference = getBodyMeshFromGroup(bodyRef.current);
    const bodyPosition = activeReference.getWorldPosition(new Vector3());

    const center = new Vector3(0, 0, 0);
    const toCenter = new Vector3().subVectors(center, bodyPosition).normalize();
    const shadowSourcePosition = new Vector3()
      .copy(bodyPosition)
      .add(toCenter.multiplyScalar(shadowSourceFrustumHeight / 2));

    const distanceToSun = bodyPosition.distanceTo(center);
    const intensity = getLightIntensity(distanceToSun);

    shadowSourceRef.current.position.copy(shadowSourcePosition);
    shadowSourceRef.current.target = bodyRef.current;
    shadowSourceRef.current.intensity = intensity;

    // if (backdropRef.current) {
    //   const toCenter2 = new Vector3()
    //     .subVectors(center, bodyPosition)
    //     .normalize();
    //   backdropRef.current.position
    //     .copy(bodyPosition)
    //     .add(toCenter2.multiplyScalar(-50));
    // }
  });

  return (
    <>
      <directionalLight
        ref={shadowSourceRef}
        visible={isShadowSourceVisible}
        castShadow
        color={'white'}
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
}
