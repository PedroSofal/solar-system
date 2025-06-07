import { memo, useContext, useMemo } from 'react';
import TimeTicker from './TimeTicker';
import BodyDataContext from '../contexts/BodyDataContext';
import LayerContext from '../contexts/LayerContext';
import Sun from './Sun';
import Planet from './Planet';
import Background from './Background';
import { useGLTF } from '@react-three/drei';
import MoonsContainer from './Moon';

export default memo(function SolarSystem() {
  const { sun, planets, dwarfPlanets, loading } = useContext(BodyDataContext);
  const { getLayer } = useContext(LayerContext);
  const ambientLightLayer = getLayer('ambient-light');

  const allPlanets = useMemo(() => {
    return [...(planets || []), ...(dwarfPlanets || [])];
  }, [planets, dwarfPlanets]);

  useGLTF.preload('/models/generic-moon/scene.gltf');

  if (loading) return null;

  return (
    <>
      <Background />

      {<Sun bodyData={sun as BodyType} />}

      {allPlanets?.map((planet) => (
        <Planet key={planet.id} bodyData={planet} />
      ))}

      <MoonsContainer allPlanets={allPlanets} />

      <TimeTicker />

      <ambientLight intensity={0.3} visible={ambientLightLayer?.value} />
    </>
  );
});
