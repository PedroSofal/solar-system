import { PerspectiveCamera } from 'three';
import { Canvas, useThree } from '@react-three/fiber';
// import { Perf } from 'r3f-perf';
import { useProgress } from '@react-three/drei';
import { Suspense, useEffect } from 'react';
import { SceneProvider } from '../../contexts/SceneContext';
import CameraControls from './CameraControls';
import SolarSystem from './SolarSystem';

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
        position: [0, 50000, 18000],
        up: [0, 0, 1],
        fov: 30,
        near: 0.00001,
        far: 200000,
      }}
    >
      <Suspense fallback={<LoadingProgress setIsLoaded={setIsLoaded} />}>
        <SceneProvider>
          <SolarSystem />
          <CameraControls isLoaded={isLoaded} />
          <ResponsiveFOV />
          {/* <Perf className="left-[50%] w-fit -translate-x-[50%]" /> */}
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
    const baseFov = 30;
    const minFov = 30;
    const maxFov = 90;

    const adjustedFov = baseFov + (1400 - size.width) * 0.06;

    const perspectiveCamera = camera as PerspectiveCamera;
    perspectiveCamera.fov = Math.max(minFov, Math.min(maxFov, adjustedFov));
    perspectiveCamera.updateProjectionMatrix();
  }, [size.width]);

  return null;
}
