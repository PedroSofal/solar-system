import { OrbitControls, TrackballControls } from '@react-three/drei';
import { useContext, useEffect } from 'react';
import CameraContext from '../contexts/CameraContext';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import gsap from 'gsap';
import { useLocation } from 'react-router-dom';
import { getBodyMeshFromGroup } from '../utils';

export default function CameraControls({ isLoaded }: { isLoaded: boolean }) {
  const {
    orbitControlsRef,
    trackballControlsRef,
    targetRef,
    isFollowing,
    resetTrigger,
    setResetTrigger,
  } = useContext(CameraContext);

  const { scene } = useThree();
  const { pathname } = useLocation();

  useEffect(() => {
    // Se o app é iniciado pela rota principal, executa um zoom inicial
    if (pathname === '/' && isLoaded) initialZoom();
  }, [pathname, isLoaded]);

  useEffect(() => {
    // Executa somente a partir do clique do usuário para resetar a câmera
    if (resetTrigger) {
      resetCamera();
      setResetTrigger(false);
    }
  }, [resetTrigger]);

  useFrame(() => {
    if (isFollowing && targetRef.current && orbitControlsRef.current) {
      targetRef.current.updateMatrixWorld(true);

      const orbitControls = orbitControlsRef.current;
      const body = getBodyMeshFromGroup(targetRef.current);
      const bodyPosition = body.getWorldPosition(new Vector3());

      const direction = new Vector3()
        .subVectors(orbitControls.object.position, orbitControls.target)
        .normalize();

      const distance = orbitControls.object.position.distanceTo(
        orbitControls.target,
      );

      const newCameraPosition = new Vector3()
        .copy(bodyPosition)
        .add(direction.multiplyScalar(distance));

      orbitControls.object.position.copy(newCameraPosition);
      orbitControls.target.copy(bodyPosition);
      orbitControls.update();
    }
  }, -1);

  useFrame(() => {
    const orbitControls = orbitControlsRef.current;
    const trackballControls = trackballControlsRef.current;

    if (orbitControls && trackballControls) {
      const { x, y, z } = orbitControls.target;
      trackballControls.target.set(x, y, z);
      trackballControls.update();
    }
  });

  function initialZoom() {
    if (!orbitControlsRef.current) return;

    const orbitControls = orbitControlsRef.current;

    gsap.to(orbitControls.object.position, {
      x: -3000,
      y: 4000,
      z: 2000,
      ease: 'power4.out',
      duration: 2.5,
      onUpdate: () => {
        orbitControls.target.copy(new Vector3(0, 0, 0));
        orbitControls.update();
      },
    });
  }

  function resetCamera() {
    if (!orbitControlsRef.current) return;
    const orbitControls = orbitControlsRef.current;

    const sceneSun = scene.getObjectByName('sun');
    if (sceneSun) targetRef.current = sceneSun as Group;

    orbitControls.object.position.set(0, 50000, 18000);
    initialZoom();
  }

  return (
    <>
      <OrbitControls
        ref={orbitControlsRef}
        maxDistance={120000}
        minDistance={0.00005}
        enableZoom={false}
      />

      <TrackballControls
        ref={trackballControlsRef}
        noPan
        noRotate
        zoomSpeed={0.5}
        dynamicDampingFactor={0.05}
      />
    </>
  );
}
