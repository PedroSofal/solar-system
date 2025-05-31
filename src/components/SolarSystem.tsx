import { memo, useContext, useMemo } from 'react';
import TimeTicker from './TimeTicker';
import BodyDataContext from '../contexts/BodyDataContext';
import LayerContext from '../contexts/LayerContext';
import Sun from './Sun';
import Planet from './Planet';
import Moon from './Moon';
import Background from './Background';
import { useGLTF } from '@react-three/drei';

export default memo(function SolarSystem() {
  const { sun, planets, dwarfPlanets } = useContext(BodyDataContext);
  const { getLayer } = useContext(LayerContext);
  const ambientLightLayer = getLayer('ambient-light');

  const allPlanets = useMemo(() => {
    return [...(planets || []), ...(dwarfPlanets || [])];
  }, [planets, dwarfPlanets]);

  useGLTF.preload('/models/generic-moon/scene.gltf');

  return (
    <>
      <Background />

      <Sun bodyData={sun as BodyType} />

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
