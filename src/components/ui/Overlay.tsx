import { useEffect, useRef, useState } from 'react';
import MobileUI from './MobileUI';
import DesktopUI from './DesktopUI';

export default function Overlay() {
  const [isOverlayHidden, setIsOverlayHidden] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const lastTap = useRef(0);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) return;

      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap.current;

      if (tapLength < 300 && tapLength > 0) {
        setIsOverlayHidden((prev) => !prev);
        lastTap.current = 0;
      } else {
        lastTap.current = currentTime;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsOverlayHidden((prev) => !prev);
      }
    };

    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouch);
  }, []);

  return (
    <>
      <DesktopUI
        isOverlayHidden={isOverlayHidden}
        setIsOverlayHidden={setIsOverlayHidden}
      />
      <MobileUI isOverlayHidden={isOverlayHidden} />

      {isOverlayHidden && (
        <div className="animate-fadeTip fixed top-6 left-1/2 z-50 -translate-x-1/2 rounded-md bg-black/80 px-4 py-2 text-center text-sm text-white shadow-lg backdrop-blur-sm">
          {isTouchDevice ? (
            <>
              Toque <span className="text-emerald-400">duas vezes</span> para
              restaurar a interface
            </>
          ) : (
            <>
              Pressione{' '}
              <kbd className="mx-1 font-mono text-base">
                <span className="text-emerald-400">Shift</span> +{' '}
                <span className="text-emerald-400">F</span>
              </kbd>{' '}
              para restaurar a interface
            </>
          )}
        </div>
      )}
    </>
  );
}
