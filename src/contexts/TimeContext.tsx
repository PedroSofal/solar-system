import React, { createContext, useCallback, useRef, useState } from 'react';
import { toJulianDate } from '../utils';

const timeMachineMap = {
  0: { scale: 1, label: 'Velocidade normal' },
  1: { scale: 10, label: '10 segundos/s' },
  2: { scale: 60, label: '1 minuto/s' },
  3: { scale: 30 * 60, label: '30 minutos/s' },
  4: { scale: 60 * 60, label: '1 hora/s' },
  5: { scale: 12 * 60 * 60, label: '12 horas/s' },
  6: { scale: 24 * 60 * 60, label: '1 dia/s' },
  7: { scale: 7 * 24 * 60 * 60, label: '1 semana/s' },
  8: { scale: 30 * 24 * 60 * 60, label: '1 mês/s' },
  9: { scale: 180 * 24 * 60 * 60, label: '6 meses/s' },
  10: { scale: 365 * 24 * 60 * 60, label: '1 ano/s' },
  11: { scale: 2 * 365 * 24 * 60 * 60, label: '2 anos/s' },
} as Record<number, { scale: number; label: string }>;

const TimeContext = createContext<{
  timerRef: React.RefObject<number>;
  timeScale: number;
  label: string;
  isPaused: boolean;
  setCustomJulianDate: (jd: number) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  modifier: number;
  updateTimeScale: (newModifier: number) => void;
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
  updateTimeScale: () => {},
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

  function updateTimeScale(newModifier: number) {
    const absoluteModifier = Math.abs(newModifier);
    const sign = newModifier === 0 ? 1 : Math.sign(newModifier);
    const { scale, label } = timeMachineMap[absoluteModifier];

    setModifier(newModifier);
    setTimeScale(scale * sign);
    setLabel(label);
  }

  function play() {
    const absoluteModifier = Math.abs(modifier);
    const { label } = timeMachineMap[absoluteModifier];

    setLabel(label);
    setIsPaused(false);
  }

  function pause() {
    setIsPaused(true);
    setLabel('Parado');
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
    updateTimeScale(modifier);
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
        updateTimeScale,
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
