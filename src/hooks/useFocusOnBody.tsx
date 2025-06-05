import { RefObject, useContext, useEffect } from 'react';
import { useMatch } from 'react-router-dom';
import { Group, Sphere, Vector3 } from 'three';
import { getBodyMeshFromGroup } from '../utils';
import CameraContext from '../contexts/CameraContext';
import gsap from 'gsap';

export default function useFocusOnBody(
  id: string,
  bodyRef: RefObject<Group | null>,
) {
  const match = useMatch('/corpos/:id');
  const { targetRef, orbitControlsRef, focusTrigger } =
    useContext(CameraContext);

  useEffect(() => {
    // Foco em um corpo automaticamente a partir de uma rota específica
    if (match?.params?.id === id && bodyRef.current) {
      targetRef.current = bodyRef.current;
      focusOnTarget(bodyRef.current);
    }
  }, []);

  useEffect(() => {
    // Foco em um corpo a partir do clique do usuário
    if (focusTrigger.id === id && bodyRef.current) {
      targetRef.current = bodyRef.current;
      focusOnTarget(bodyRef.current);
    }
  }, [focusTrigger.trigger]);

  function focusOnTarget(body: Group) {
    if (!orbitControlsRef.current || !body) return;

    const orbitControls = orbitControlsRef.current;
    const bodyPosition = body.getWorldPosition(new Vector3());
    const cameraPosition = orbitControls.object.position.clone();
    const tolerance = 0.05;

    if (
      Math.abs(bodyPosition.x - cameraPosition.x) > tolerance ||
      Math.abs(bodyPosition.y - cameraPosition.y) > tolerance ||
      Math.abs(bodyPosition.z - cameraPosition.z) > tolerance
    ) {
      const mesh = getBodyMeshFromGroup(body);

      if (!mesh.geometry.boundingSphere) {
        mesh.geometry.computeBoundingSphere();
      }

      const boundingSphere = mesh.geometry.boundingSphere;
      const avgScale = (mesh.scale.x + mesh.scale.y + mesh.scale.z) / 3;
      const bodyRadius = (boundingSphere as Sphere).radius * avgScale;

      // Direção do corpo em relação ao Sol
      const center = new Vector3(0, 0, 0);
      const toCenter = new Vector3()
        .subVectors(center, bodyPosition)
        .normalize();

      // Vetores ortogonais relativos à direção do Sol
      const worldUp = new Vector3(0, 0, 1);
      const side = new Vector3().crossVectors(toCenter, worldUp).normalize();
      const up = new Vector3().crossVectors(side, toCenter).normalize();

      const sideAmount = 0.8;
      const upAmount = 0.2;

      // Desvia a câmera um pouco
      const offsetDir = new Vector3()
        .copy(toCenter)
        .add(side.multiplyScalar(sideAmount))
        .add(up.multiplyScalar(upAmount))
        .normalize();

      const distance = bodyRadius * 6;
      const newCameraPosition = new Vector3()
        .copy(bodyPosition)
        .add(offsetDir.multiplyScalar(distance));

      const targetStart = orbitControls.target.clone();
      const targetEnd = bodyPosition.clone();

      const newMinDistance = Math.max(0.0003, bodyRadius * 1.5);
      orbitControls.minDistance = newMinDistance;

      // Animação da posição da câmera
      gsap.to(orbitControls.object.position, {
        x: newCameraPosition.x,
        y: newCameraPosition.y,
        z: newCameraPosition.z,
        duration: 1.8,
        ease: 'power4.out',
        onUpdate: () => {
          orbitControls.update();
        },
      });

      // Animação do alvo da câmera
      gsap.to(targetStart, {
        x: targetEnd.x,
        y: targetEnd.y,
        z: targetEnd.z,
        duration: 1.8,
        ease: 'power4.out',
        onUpdate: () => {
          orbitControls.target.copy(targetStart);
          orbitControls.update();
        },
      });
    }
  }
}
