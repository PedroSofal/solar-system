import { OrbitControls, TrackballControls } from '@react-three/drei';
import { useContext, useEffect, useRef } from 'react';
import CameraContext from '../contexts/CameraContext';
import { useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls as OrbitControlsType,
  TrackballControls as TrackballControlsType,
} from 'three-stdlib';
import { Mesh, Object3D, Sphere, Vector3 } from 'three';
import gsap from 'gsap';
import { useMatch } from 'react-router-dom';
import { getActiveLOD } from '../utils';

export default function CameraControls({ isLoaded }: { isLoaded: boolean }) {
  const orbitControlsRef = useRef<OrbitControlsType>(null);
  const trackballControlsRef = useRef<TrackballControlsType>(null);
  const targetRef = useRef<Object3D | null>(null);

  const { isFollowing, focusTrigger, resetTrigger, setResetTrigger } =
    useContext(CameraContext);

  const { scene } = useThree();
  const match = useMatch('/corpos/:id');

  useEffect(() => {
    if (isLoaded && !match) initialZoom();
  }, [isLoaded]);

  useEffect(() => {
    // Se o app é iniciado com /corpos/:id, navegamos até o corpo
    if (match && match.params.id) {
      const sceneBody = scene.getObjectByName(match.params.id);
      if (sceneBody) {
        targetRef.current = sceneBody;
        focusOnTarget(sceneBody as Mesh);
      }
    }
  }, []);

  useEffect(() => {
    // Executa somente a partir do clique do usuário para navegar até um corpo celeste
    if (focusTrigger.id) {
      const sceneBody = scene.getObjectByName(focusTrigger.id);
      if (sceneBody) {
        targetRef.current = sceneBody;
        focusOnTarget(sceneBody as Mesh);
      }
    }
  }, [focusTrigger.trigger]);

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
      const bodyPosition = getActiveLOD(targetRef.current).getWorldPosition(
        new Vector3(),
      );

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
  });

  function initialZoom() {
    if (!orbitControlsRef.current) return;

    const orbitControls = orbitControlsRef.current;
    const targetStart = orbitControls.target.clone();
    const newCameraPosition = new Vector3(-3000, 4000, 2000);

    gsap.to(orbitControls.object.position, {
      x: newCameraPosition.x,
      y: newCameraPosition.y,
      z: newCameraPosition.z,
      ease: 'power4.out',
      duration: 2.5,
      onUpdate: () => {
        orbitControls.target.copy(targetStart);
        orbitControls.update();
      },
    });
  }

  function focusOnTarget(body: Mesh) {
    if (!orbitControlsRef.current || !body) return;

    const activeBody = getActiveLOD(body) as Mesh;
    const orbitControls = orbitControlsRef.current;
    const bodyPosition = activeBody.getWorldPosition(new Vector3());
    const cameraPosition = orbitControls.object.position.clone();
    const tolerance = 0.05;

    if (
      Math.abs(bodyPosition.x - cameraPosition.x) > tolerance ||
      Math.abs(bodyPosition.y - cameraPosition.y) > tolerance ||
      Math.abs(bodyPosition.z - cameraPosition.z) > tolerance
    ) {
      activeBody.geometry.computeBoundingSphere();
      const boundingSphere = activeBody.geometry.boundingSphere as Sphere;
      const avgScale =
        (activeBody.scale.x + activeBody.scale.y + activeBody.scale.z) / 3;
      const bodyRadius = boundingSphere.radius * avgScale;

      const distance = bodyRadius * 4;
      const newCameraPosition = new Vector3()
        .copy(bodyPosition)
        .add(new Vector3(0, distance, distance));

      const targetStart = orbitControls.target.clone();
      const targetEnd = bodyPosition.clone();

      const newMinDistance = Math.max(0.0003, bodyRadius * 1.5);
      orbitControls.minDistance = newMinDistance;

      const animationConfig = (vec: Vector3) => ({
        x: vec.x,
        y: vec.y,
        z: vec.z,
        ease: 'power4.out',
        duration: 1.2,
        onUpdate: () => {
          orbitControls.target.copy(targetStart);
          orbitControls.update();
        },
      });

      gsap.to(orbitControls.object.position, {
        ...animationConfig(newCameraPosition),
      });

      gsap.to(targetStart, {
        ...animationConfig(targetEnd),
      });
    }
  }

  function resetCamera() {
    if (!orbitControlsRef.current) return;
    const orbitControls = orbitControlsRef.current;

    const sceneSun = scene.getObjectByName('sun');
    if (sceneSun) targetRef.current = sceneSun;

    gsap.to(orbitControls.object.position, {
      x: -3000,
      y: 4000,
      z: 2000,
      ease: 'power4.out',
      duration: 1.2,
      onUpdate: () => {
        orbitControls.target.copy(new Vector3(0, 0, 0));
        orbitControls.update();
      },
    });
  }

  useFrame(() => {
    const orbitControls = orbitControlsRef.current;
    const trackballControls = trackballControlsRef.current;

    if (orbitControls && trackballControls) {
      const { x, y, z } = orbitControls.target;
      trackballControls.target.set(x, y, z);
      trackballControls.update();
    }
  });

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
