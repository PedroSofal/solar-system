import { useThree } from '@react-three/fiber';
import React, { createContext, useEffect, useRef } from 'react';
import { Scene } from 'three';

const SceneContext = createContext<React.RefObject<Scene>>(
  React.createRef() as React.RefObject<Scene>,
);

export function SceneProvider({ children }: { children: React.ReactNode }) {
  const { scene } = useThree();
  const sceneRef = useRef(scene);

  useEffect(() => {
    sceneRef.current = scene;
  }, [scene]);

  return (
    <SceneContext.Provider value={sceneRef}>{children}</SceneContext.Provider>
  );
}

export default SceneContext;
