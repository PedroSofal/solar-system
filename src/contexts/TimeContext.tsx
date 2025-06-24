import React, { createContext, useCallback, useRef, useState } from 'react';
import { toJulianDate } from '../utils/time';
import { timeConfig } from '../constants/time';

const TimeContext = createContext<{
  timerRef: React.RefObject<number>;
  timeScale: number;
  label: string;
  isPaused: boolean;
  setCustomJulianDate: (jd: number) => void;
  play: (newModifier?: number) => void;
  pause: () => void;
  reset: () => void;
  modifier: number;
  tick: (deltaSeconds: number) => void;
  checkValidJulianDateSpan: (jd: number) => boolean;
  isValidTime: boolean;
}>({
  timerRef: React.createRef() as React.RefObject<number>,
  timeScale: 1,
  label: 'Ao vivo',
  isPaused: false,
  setCustomJulianDate: () => {},
  play: () => {},
  pause: () => {},
  reset: () => {},
  modifier: 0,
  tick: () => {},
  checkValidJulianDateSpan: () => true,
  isValidTime: true,
});

export function TimeProvider({ children }: { children: React.ReactNode }) {
  const timerRef = useRef(toJulianDate(Date.now()));

  const [modifier, setModifier] = useState(0);
  const [timeScale, setTimeScale] = useState(1);
  const [label, setLabel] = useState('Ao vivo');
  const [isPaused, setIsPaused] = useState(false);
  const [isValidTime, setIsValidTime] = useState(true);

  const min = toJulianDate(new Date('January 01, 1900 00:00:00').getTime());
  const max = toJulianDate(new Date('December 31, 2112 23:59:59').getTime());

  const tick = useCallback(
    (deltaSeconds: number) => {
      if (!isPaused) {
        const deltaJD = (deltaSeconds * timeScale) / 86400;
        const newTime = timerRef.current + deltaJD;
        const isValid = checkValidJulianDateSpan(newTime);

        if (isValid) {
          timerRef.current += deltaJD;
          setIsValidTime(true);
        } else {
          pause();
          setIsValidTime(false);
        }
      }
    },
    [timeScale, isPaused],
  );

  function play(newModifier = modifier) {
    const absoluteModifier = Math.abs(newModifier);
    const sign = newModifier === 0 ? 1 : Math.sign(newModifier);
    const { scale, label } = timeConfig.TIME_MACHINE_MAP[absoluteModifier];

    setModifier(newModifier);
    setTimeScale(scale * sign);
    setLabel(label);
    setIsPaused(false);
  }

  function pause() {
    setTimeScale(0);
    setLabel('Parado');
    setIsPaused(true);
  }

  function reset() {
    const now = toJulianDate(Date.now());
    timerRef.current = now;

    setModifier(0);
    setTimeScale(1);
    setLabel('Ao vivo');
    setIsPaused(false);

    requestAnimationFrame(() => {
      timerRef.current = now;
    });
  }

  function setCustomJulianDate(jd: number) {
    timerRef.current = jd;
    play();
  }

  function checkValidJulianDateSpan(jd: number) {
    return jd >= min && jd <= max;
  }

  return (
    <TimeContext.Provider
      value={{
        timerRef,
        timeScale,
        label,
        isPaused,
        setCustomJulianDate,
        play,
        pause,
        reset,
        modifier,
        tick,
        checkValidJulianDateSpan,
        isValidTime,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
}

export default TimeContext;
