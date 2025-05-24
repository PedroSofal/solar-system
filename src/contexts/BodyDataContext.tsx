import React, { createContext, useCallback, useMemo } from 'react';
import useFetchBodies from '../hooks/useFetchBodies';

const BodyDataContext = createContext<{
  sun: BodyType | undefined;
  planets: BodyType[] | undefined;
  moons: BodyType[] | undefined;
  dwarfPlanets: BodyType[] | undefined;
  allBodies: BodyType[] | undefined;
  loading: boolean;
  error: string | null;
}>({
  sun: undefined,
  planets: undefined,
  moons: undefined,
  dwarfPlanets: undefined,
  allBodies: undefined,
  loading: true,
  error: null,
});

export function BodyDataProvider({ children }: { children: React.ReactNode }) {
  const { data, loading, error } = useFetchBodies();

  const memoizedSun = useMemo(() => data.sun, [data.sun]);
  const memoizedMoons = useMemo(() => data.moons ?? [], [data.moons]);

  const getMoonsFromPlanet = useCallback(
    (planet: BodyType) => {
      return memoizedMoons.filter((moon) =>
        planet.moons?.some((m) => m.moon === moon.frenchName),
      );
    },
    [memoizedMoons],
  );

  const memoizedPlanets = useMemo(() => {
    if (!data.planets) return [];

    return data.planets.map((planet) => {
      const moonBodies = getMoonsFromPlanet(planet);
      return { ...planet, moonBodies };
    });
  }, [data.planets, getMoonsFromPlanet]);

  const memoizedDwarfPlanets = useMemo(() => {
    if (!data.dwarfPlanets) return [];

    return data.dwarfPlanets.map((planet) => {
      const moonBodies = getMoonsFromPlanet(planet);
      return { ...planet, moonBodies };
    });
  }, [data.dwarfPlanets, getMoonsFromPlanet]);

  const memoizedAllBodies = useMemo(() => {
    const allBodies = [
      memoizedSun,
      ...memoizedPlanets,
      ...memoizedMoons,
      ...memoizedDwarfPlanets,
    ];
    return allBodies.filter(Boolean) as BodyType[];
  }, [memoizedSun, memoizedDwarfPlanets, memoizedMoons, memoizedDwarfPlanets]);

  return (
    <BodyDataContext.Provider
      value={{
        sun: memoizedSun,
        planets: memoizedPlanets,
        moons: memoizedMoons,
        dwarfPlanets: memoizedDwarfPlanets,
        allBodies: memoizedAllBodies,
        loading,
        error,
      }}
    >
      {children}
    </BodyDataContext.Provider>
  );
}

export default BodyDataContext;
