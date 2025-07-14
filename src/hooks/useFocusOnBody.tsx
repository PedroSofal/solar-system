import { RefObject, useContext, useEffect } from 'react';
import { useMatch } from 'react-router-dom';
import { Group, Mesh, Sphere, Vector3 } from 'three';
import { getBodyMeshFromGroup } from '../utils/scene';
import CameraContext from '../contexts/CameraContext';
import gsap from 'gsap';
import TimeContext from '../contexts/TimeContext';
import { cameraConfig } from '../constants/camera';

const {
  MIN_DISTANCE,
  FOCUS_LEFT_OFFSET,
  FOCUS_UP_OFFSET,
  FOCUS_DISTANCE,
  FOLLOW_DELAY,
} = cameraConfig;

function getCameraOffsetFromBodyPosition(bodyPosition: Vector3) {
  // Direção do corpo em relação ao Sol
  const center = new Vector3(0, 0, 0);
  const toCenter = new Vector3().subVectors(center, bodyPosition).normalize();

  // Vetores ortogonais relativos à direção do Sol
  const worldUp = new Vector3(0, 0, 1);
  const side = new Vector3().crossVectors(toCenter, worldUp).normalize();
  const up = new Vector3().crossVectors(side, toCenter).normalize();

  return new Vector3()
    .copy(toCenter)
    .add(side.multiplyScalar(FOCUS_LEFT_OFFSET))
    .add(up.multiplyScalar(FOCUS_UP_OFFSET))
    .normalize();
}

function getBoundingSphereRadiusFromMesh(mesh: Mesh) {
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
  const { targetRef, orbitControlsRef, focusTrigger, setIsFollowing } =
    useContext(CameraContext);

  useEffect(() => {
    // Foco em um corpo automaticamente ao iniciar o app a partir de uma rota específica
    if (match?.params?.id === id) {
      // RAF usado para garantir que as luas já tenham sido ancoradas ao seus planetas
      const firstFocus = requestAnimationFrame(() => {
        if (bodyRef.current) focusOnTarget(bodyRef.current);
      });
      return () => cancelAnimationFrame(firstFocus);
    }
  }, []);

  useEffect(() => {
    // Foco em um corpo a partir de um clique do usuário
    if (focusTrigger.id === id && bodyRef.current) {
      focusOnTarget(bodyRef.current);
    }
  }, [focusTrigger.trigger]);

  function focusOnTarget(body: Group) {
    if (!orbitControlsRef.current || !body) return;

    const mesh = getBodyMeshFromGroup(body);
    if (!mesh) return;

    // Calcula o raio do bounding sphere em corpos esféricos e irregulares
    const boundingRadius = getBoundingSphereRadiusFromMesh(mesh);

    // Atualiza limite de zoom
    const orbitControls = orbitControlsRef.current;
    orbitControls.minDistance = Math.max(MIN_DISTANCE, boundingRadius * 1.5);

    const bodyPosition = body.getWorldPosition(new Vector3());
    const camPositionOrigin = orbitControls.object.position;
    const camTargetOrigin = orbitControls.target;
    const camPositionDestiny = bodyPosition.clone(); // posição base
    const camTargetDestiny = bodyPosition.clone();

    // Configura a nova posição da câmera com um desvio e a uma certa distância do corpo
    if (body.name === 'sun') {
      camPositionDestiny.add(new Vector3(15, 15, 5));
    } else {
      const offset = getCameraOffsetFromBodyPosition(bodyPosition);
      const distance = boundingRadius * FOCUS_DISTANCE;
      camPositionDestiny.add(offset.multiplyScalar(distance));
    }

    // Interrompe o acompanhamento do corpo para evitar um flash de foco instantâneo
    setIsFollowing(false);
    setTimeout(
      () => {
        setIsFollowing(true);
        targetRef.current = bodyRef.current;
      },
      // Reinicia o acompanhamento imediatamente, se o tempo está acelerado, para evitar foco no vazio
      Math.abs(timeScale) > 1 ? 0 : FOLLOW_DELAY,
    );

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
      duration: 2,
      ease: 'power4.inOut',
      onUpdate: () => {
        orbitControls.update();
      },
    });
  }
}
