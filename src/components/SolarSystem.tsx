import Sun from './Sun';
import Background from './Background';
import { memo, useContext, useMemo } from 'react';
import Planet from './Planet';
import BodyDataContext from '../contexts/BodyDataContext';
import LayerContext from '../contexts/LayerContext';

import Moon from './Moon';
import TimeTicker from './TimeTicker';

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

      {allPlanets?.map((planet) => (
        <Planet key={planet.id} bodyData={planet} />
      ))}

      {allPlanets.map((planet) =>
        planet.moonBodies?.map((moon) => (
          <Moon key={moon.id} bodyData={moon} />
        )),
      )}

      <TimeTicker />

      <ambientLight intensity={0.3} visible={ambientLightLayer?.value} />
    </>
  );
});
