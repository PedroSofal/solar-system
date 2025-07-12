import { Group, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, TrackballControls } from '@react-three/drei';
import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

import CameraContext from '../../contexts/CameraContext';
import SceneContext from '../../contexts/SceneContext';
import { getBodyMeshFromGroup } from '../../utils/scene';
import { cameraConfig } from '../../constants/camera';

export default function CameraControls({ isLoaded }: { isLoaded: boolean }) {
  const { orbitControlsRef, trackballControlsRef, targetRef, isFollowing } =
    useContext(CameraContext);
  const scene = useContext(SceneContext);

  const { pathname } = useLocation();

  // animação inicial e reset de câmera
  useEffect(() => {
    if (pathname === '/' && isLoaded) initialZoom();
  }, [pathname, isLoaded]);

  // Acompanhamento automático do movimento orbital
  useFrame(() => {
    if (isFollowing && targetRef.current && orbitControlsRef.current) {
      // console.log(targetRef.current);
      targetRef.current.updateMatrixWorld(true);

      const orbitControls = orbitControlsRef.current;
      const body = getBodyMeshFromGroup(targetRef.current);
      if (!body) return;

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

    const sceneSun = scene.current.getObjectByName('sun');
    if (sceneSun) targetRef.current = sceneSun as Group;

    orbitControls.object.position.copy(cameraConfig.INITIAL_POS);

    gsap.to(orbitControls.object.position, {
      x: cameraConfig.INTRO_POS.x,
      y: cameraConfig.INTRO_POS.y,
      z: cameraConfig.INTRO_POS.z,
      ease: 'power4.out',
      duration: 2.5,
      onUpdate: () => {
        orbitControls.target.copy(new Vector3(0, 0, 0));
        orbitControls.update();
      },
    });
  }

  return (
    <>
      <OrbitControls
        ref={orbitControlsRef}
        maxDistance={cameraConfig.MAX_DISTANCE}
        minDistance={cameraConfig.MIN_DISTANCE}
        enableZoom={false}
      />

      <TrackballControls
        ref={trackballControlsRef}
        noPan
        noRotate
        zoomSpeed={cameraConfig.ZOOM_SPEED}
        dynamicDampingFactor={cameraConfig.DAMPING_FACTOR}
      />
    </>
  );
}
