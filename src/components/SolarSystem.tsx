import { lazy, memo, Suspense, useContext, useMemo } from 'react';
import TimeTicker from './TimeTicker';
import BodyDataContext from '../contexts/BodyDataContext';
import LayerContext from '../contexts/LayerContext';
import Sun from './Sun';
import Planet from './Planet';
import Background from './Background';

// Lazy imports
const Moon = lazy(() => import('./Moon'));

export default memo(function SolarSystem() {
  const { sun, planets, dwarfPlanets, loading } = useContext(BodyDataContext);
  const { getLayer } = useContext(LayerContext);
  const ambientLightLayer = getLayer('ambient-light');

  const allPlanets = useMemo(() => {
    return [...(planets || []), ...(dwarfPlanets || [])];
  }, [planets, dwarfPlanets]);

  return (
    <>
      <Background />

      {!loading && sun && <Sun bodyData={sun} />}

      {allPlanets?.map((planet) => <Planet bodyData={planet} />)}

      {allPlanets.map((planet) =>
        planet.moonBodies?.map((moon) => (
          <Suspense key={moon.id} fallback={null}>
            <Moon bodyData={moon} />
          </Suspense>
        )),
      )}

      <TimeTicker />

      <ambientLight intensity={0.3} visible={ambientLightLayer?.value} />
    </>
  );
});
