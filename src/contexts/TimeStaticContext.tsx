import React, { createContext, useCallback, useContext, useMemo } from 'react';
import TimeContext from './TimeContext';

const J2000 = 2451545.0;

const TimeStaticContext = createContext<{
  getDaysSinceEpoch: () => number;
}>({
  getDaysSinceEpoch: () => 0,
});

export function TimeStaticProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { timerRef } = useContext(TimeContext);

  const getDaysSinceEpoch = useCallback(() => {
    return timerRef.current - J2000;
  }, []);

  const contextValue = useMemo(
    () => ({ getDaysSinceEpoch }),
    [getDaysSinceEpoch],
  );

  return (
    <TimeStaticContext.Provider value={contextValue}>
      {children}
    </TimeStaticContext.Provider>
  );
}

export default TimeStaticContext;
