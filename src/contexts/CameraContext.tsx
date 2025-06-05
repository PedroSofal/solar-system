import React, { createContext, useState, useRef, RefObject } from 'react';
import { Group } from 'three';
import {
  OrbitControls as OrbitControlsType,
  TrackballControls as TrackballControlsType,
} from 'three-stdlib';

interface Trigger {
  trigger: number;
  id: string | null;
}

const initTrigger = {
  trigger: 0,
  id: null,
};

const CameraContext = createContext<{
  orbitControlsRef: RefObject<OrbitControlsType | null>;
  trackballControlsRef: RefObject<TrackballControlsType | null>;
  targetRef: RefObject<Group | null>;
  isFollowing: boolean;
  setIsFollowing: React.Dispatch<React.SetStateAction<boolean>>;
  focusTrigger: Trigger;
  setFocusTrigger: React.Dispatch<React.SetStateAction<Trigger>>;
  resetTrigger: boolean;
  setResetTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  orbitControlsRef: React.createRef(),
  trackballControlsRef: React.createRef(),
  targetRef: React.createRef(),
  isFollowing: false,
  setIsFollowing: () => {},
  focusTrigger: initTrigger,
  setFocusTrigger: () => {},
  resetTrigger: false,
  setResetTrigger: () => {},
});

export function CameraProvider({ children }: { children: React.ReactNode }) {
  const orbitControlsRef = useRef<OrbitControlsType>(null);
  const trackballControlsRef = useRef<TrackballControlsType>(null);
  const targetRef = useRef<Group | null>(null);

  const [isFollowing, setIsFollowing] = useState(true);
  const [focusTrigger, setFocusTrigger] = useState<Trigger>(initTrigger);
  const [resetTrigger, setResetTrigger] = useState(false);

  return (
    <CameraContext.Provider
      value={{
        orbitControlsRef,
        trackballControlsRef,
        targetRef,
        isFollowing,
        setIsFollowing,
        focusTrigger,
        setFocusTrigger,
        resetTrigger,
        setResetTrigger,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
}

export default CameraContext;
