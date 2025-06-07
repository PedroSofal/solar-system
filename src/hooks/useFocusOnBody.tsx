import { RefObject, useContext, useEffect } from 'react';
import { useMatch } from 'react-router-dom';
import { Group, Sphere, Vector3 } from 'three';
import { getBodyMeshFromGroup } from '../utils';
import CameraContext from '../contexts/CameraContext';
import gsap from 'gsap';
import TimeContext from '../contexts/TimeContext';

function getCameraOffsetFromBodyPosition(bodyPosition: Vector3) {
  // Direção do corpo em relação ao Sol
  const center = new Vector3(0, 0, 0);
  const toCenter = new Vector3().subVectors(center, bodyPosition).normalize();

  // Vetores ortogonais relativos à direção do Sol
  const worldUp = new Vector3(0, 0, 1);
  const side = new Vector3().crossVectors(toCenter, worldUp).normalize();
  const up = new Vector3().crossVectors(side, toCenter).normalize();

  const sideAmount = 0.8;
  const upAmount = 0.2;

  return new Vector3()
    .copy(toCenter)
    .add(side.multiplyScalar(sideAmount))
    .add(up.multiplyScalar(upAmount))
    .normalize();
}

function getBoundingSphereRadiusFromBody(body: Group) {
  const mesh = getBodyMeshFromGroup(body);

  if (!mesh.geometry.boundingSphere) {
    mesh.geometry.computeBoundingSphere();
  }

  const boundingSphere = mesh.geometry.boundingSphere;
  const avgScale = (mesh.scale.x + mesh.scale.y + mesh.scale.z) / 3;
  const bodyRadius = (boundingSphere as Sphere).radius * avgScale;

  return bodyRadius;
}

export default function useFocusOnBody(
  id: string,
  bodyRef: RefObject<Group | null>,
) {
  const match = useMatch('/corpos/:id');

  const { timeScale } = useContext(TimeContext);
  const {
    targetRef,
    orbitControlsRef,
    focusTrigger,
    isFollowing,
    setIsFollowing,
  } = useContext(CameraContext);

  useEffect(() => {
    // Foco em um corpo automaticamente a partir de uma rota específica
    if (match?.params?.id === id && bodyRef.current) {
      focusOnTarget(bodyRef.current);
    }
  }, []);

  useEffect(() => {
    // Foco em um corpo a partir do clique do usuário
    if (focusTrigger.id === id && bodyRef.current) {
      focusOnTarget(bodyRef.current);
    }
  }, [focusTrigger.trigger]);

  function focusOnTarget(body: Group) {
    if (!orbitControlsRef.current || !body) return;

    // Calcula o raio do bounding sphere em corpos esféricos e irregulares
    const boundingRadius = getBoundingSphereRadiusFromBody(body);

    // Atualiza limite de zoom
    const orbitControls = orbitControlsRef.current;
    orbitControls.minDistance = Math.max(0.0003, boundingRadius * 1.5);

    const camPositionOrigin = orbitControls.object.position;
    // Configura a nova posição da câmera com um desvio e a uma certa distância do corpo
    const bodyPosition = body.getWorldPosition(new Vector3());
    const cameraOffset = getCameraOffsetFromBodyPosition(bodyPosition);
    const camPositionDestiny = new Vector3()
      .copy(bodyPosition)
      .add(cameraOffset.multiplyScalar(boundingRadius * 6));

    const camTargetOrigin = orbitControls.target;
    const camTargetDestiny = bodyPosition.clone();
    console.log(timeScale);
    if (isFollowing) {
      // Interrompe o acompanhamento do corpo para evitar um flash de foco instantâneo
      setIsFollowing(false);
      setTimeout(
        () => {
          setIsFollowing(true);
          targetRef.current = bodyRef.current;
        },
        // Reinicia o acompanhamento imediatamente, se o tempo está acelerado, para evitar foco no vazio
        Math.abs(timeScale) > 1 ? 0 : 2500,
      );
    }

    // Animação da posição da câmera
    gsap.to(camPositionOrigin, {
      x: camPositionDestiny.x,
      y: camPositionDestiny.y,
      z: camPositionDestiny.z,
      duration: 2.5,
      ease: 'power4.inOut',
      onUpdate: () => {
        orbitControls.update();
      },
    });

    // Animação do alvo da câmera
    gsap.to(camTargetOrigin, {
      x: camTargetDestiny.x,
      y: camTargetDestiny.y,
      z: camTargetDestiny.z,
      duration: 2.5,
      ease: 'power4.inOut',
      onUpdate: () => {
        orbitControls.update();
      },
    });
  }
}
