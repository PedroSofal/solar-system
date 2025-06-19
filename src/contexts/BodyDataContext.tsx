import React, { createContext, useCallback, useMemo } from 'react';
import useFetchBodies from '../hooks/useFetchBodies';

const BodyDataContext = createContext<{
  sun: BodyType | undefined;
  planets: BodyType[] | undefined;
  moons: BodyType[] | undefined;
  dwarfPlanets: BodyType[] | undefined;
  asteroids: BodyType[] | undefined;
  comets: BodyType[] | undefined;
  allBodies: BodyType[] | undefined;
  loading: boolean;
  error: string | null;
}>({
  sun: undefined,
  planets: undefined,
  moons: undefined,
  dwarfPlanets: undefined,
  asteroids: undefined,
  comets: undefined,
  allBodies: undefined,
  loading: true,
  error: null,
});

export function BodyDataProvider({ children }: { children: React.ReactNode }) {
  const { data, loading, error } = useFetchBodies();

  const memoizedSun = useMemo(() => data.sun, [data.sun]);
  const memoizedMoons = useMemo(() => data.moons ?? [], [data.moons]);

  const getMoons = useCallback(
    (planet: BodyType) => {
      return memoizedMoons.filter((moon) =>
        planet.moons?.some((m) => m === moon.frenchName),
      );
    },
    [memoizedMoons],
  );

  const memoizedPlanets = useMemo(() => {
    if (!data.planets) return [];

    return data.planets.map((planet) => {
      const moonBodies = getMoons(planet);
      return { ...planet, moonBodies };
    });
  }, [data.planets, getMoons]);

  const memoizedDwarfPlanets = useMemo(() => {
    if (!data.dwarfPlanets) return [];

    return data.dwarfPlanets.map((planet) => {
      const moonBodies = getMoons(planet);
      return { ...planet, moonBodies };
    });
  }, [data.dwarfPlanets, getMoons]);

  const memoizedAsteroids = useMemo(() => {
    if (!data.asteroids) return [];

    return data.asteroids.map((asteroid) => {
      const moonBodies = getMoons(asteroid);
      return { ...asteroid, moonBodies };
    });
  }, [data.asteroids, getMoons]);

  const memoizedComets = useMemo(() => {
    if (!data.comets) return [];

    return data.comets.map((comet) => {
      const moonBodies = getMoons(comet);
      return { ...comet, moonBodies };
    });
  }, [data.comets, getMoons]);

  const memoizedAllBodies = useMemo(() => {
    const allBodies = [
      memoizedSun,
      ...memoizedPlanets,
      ...memoizedMoons,
      ...memoizedDwarfPlanets,
      ...memoizedAsteroids,
      ...memoizedComets,
    ];
    return allBodies.filter(Boolean) as BodyType[];
  }, [
    memoizedSun,
    memoizedDwarfPlanets,
    memoizedMoons,
    memoizedDwarfPlanets,
    memoizedAsteroids,
    memoizedComets,
  ]);

  return (
    <BodyDataContext.Provider
      value={{
        sun: memoizedSun,
        planets: memoizedPlanets,
        moons: memoizedMoons,
        dwarfPlanets: memoizedDwarfPlanets,
        asteroids: memoizedAsteroids,
        comets: memoizedComets,
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
