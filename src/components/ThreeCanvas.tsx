import { Canvas, useThree } from '@react-three/fiber';
import CameraControls from './CameraControls';
import { PerspectiveCamera } from 'three';
import { useEffect } from 'react';
import SolarSystem from './SolarSystem';
import { useProgress } from '@react-three/drei';
import { SceneProvider } from '../contexts/SceneContext';
// import { Perf } from 'r3f-perf';

export default function ThreeCanvas({
  setIsLoaded,
}: {
  setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Canvas
      className="min-h-screen w-full cursor-grab bg-black active:cursor-grabbing"
      dpr={[1, 2]}
      gl={{ logarithmicDepthBuffer: true }}
      camera={{
        position: [-3000, 4000, 2000],
        up: [0, 0, 1],
        fov: 30,
        near: 0.00001,
        far: 200000,
      }}
    >
      <SceneProvider>
        <LoadingProgress setIsLoaded={setIsLoaded} />
        <CameraControls />
        <ResponsiveFOV />
        <SolarSystem />
        {/* <Perf className="left-[50%] w-fit -translate-x-[50%]" /> */}
      </SceneProvider>
    </Canvas>
  );
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
