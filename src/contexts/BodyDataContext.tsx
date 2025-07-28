import React, { createContext } from 'react';
import useFetchBodies from '../hooks/useFetchBodies';

interface BodyDataContextType extends ProcessedBodyData {
  loading: boolean;
  error: string | null;
}

const BodyDataContext = createContext<BodyDataContextType>({
  sun: undefined,
  planets: undefined,
  moons: undefined,
  dwarfPlanets: undefined,
  asteroids: undefined,
  comets: undefined,
  allBodies: undefined,
  heliocentricBodies: undefined,
  loading: true,
  error: null,
});

export function BodyDataProvider({ children }: { children: React.ReactNode }) {
  const { data, loading, error } = useFetchBodies();

  return (
    <BodyDataContext.Provider
      value={{
        ...data,
        loading,
        error,
      }}
    >
      {children}
    </BodyDataContext.Provider>
  );
}

export default BodyDataContext;
