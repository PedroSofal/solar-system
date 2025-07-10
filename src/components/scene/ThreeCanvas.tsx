import { PerspectiveCamera } from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { Perf } from 'r3f-perf';
import { useProgress } from '@react-three/drei';
import { Suspense, useEffect } from 'react';
import { SceneProvider } from '../../contexts/SceneContext';
import CameraControls from './CameraControls';
import SolarSystem from './SolarSystem';
import { cameraConfig } from '../../constants/camera';
import Preload from './Preload';

export default function ThreeCanvas({
  isLoaded,
  setIsLoaded,
}: {
  isLoaded: boolean;
  setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Canvas
      className="min-h-screen w-full cursor-grab bg-black active:cursor-grabbing"
      dpr={[1, 2]}
      gl={{ logarithmicDepthBuffer: true }}
      shadows
      camera={{
        position: cameraConfig.INITIAL_POS,
        up: [0, 0, 1],
        fov: cameraConfig.MIN_FOV,
        near: cameraConfig.NEAR,
        far: cameraConfig.FAR,
      }}
    >
      <Preload />
      <Suspense fallback={<LoadingProgress setIsLoaded={setIsLoaded} />}>
        <SceneProvider>
          <SolarSystem />
          <CameraControls isLoaded={isLoaded} />
          <ResponsiveFOV />
          <Perf className="left-[50%] w-fit -translate-x-[50%]" />
        </SceneProvider>
      </Suspense>
    </Canvas>
  );
}

function LoadingProgress({
  setIsLoaded,
}: {
  setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { progress } = useProgress();

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setIsLoaded(true), 500);
    }
  }, [progress]);

  return null;
}

function ResponsiveFOV() {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  useEffect(() => {
    const baseFov = cameraConfig.MIN_FOV;
    const minFov = cameraConfig.MIN_FOV;
    const maxFov = cameraConfig.MAX_FOV;

    const adjustedFov = baseFov + (1400 - size.width) * 0.06;

    const perspectiveCamera = camera as PerspectiveCamera;
    perspectiveCamera.fov = Math.max(minFov, Math.min(maxFov, adjustedFov));
    perspectiveCamera.updateProjectionMatrix();
  }, [size.width]);

  return null;
}
