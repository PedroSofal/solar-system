import React, { createContext, useState } from 'react';

interface Trigger {
  trigger: number;
  id: string | null;
}

const initTrigger = {
  trigger: 0,
  id: null,
};

const CameraContext = createContext<{
  isFollowing: boolean;
  setIsFollowing: React.Dispatch<React.SetStateAction<boolean>>;
  focusTrigger: Trigger;
  setFocusTrigger: React.Dispatch<React.SetStateAction<Trigger>>;
  resetTrigger: boolean;
  setResetTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isFollowing: false,
  setIsFollowing: () => {},
  focusTrigger: initTrigger,
  setFocusTrigger: () => {},
  resetTrigger: false,
  setResetTrigger: () => {},
});

export function CameraProvider({ children }: { children: React.ReactNode }) {
  const [isFollowing, setIsFollowing] = useState(true);
  const [focusTrigger, setFocusTrigger] = useState<Trigger>(initTrigger);
  const [resetTrigger, setResetTrigger] = useState(false);

  return (
    <CameraContext.Provider
      value={{
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
