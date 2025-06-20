import { useGLTF } from '@react-three/drei';
import { memo, useContext, useMemo } from 'react';
import BodyDataContext from '../../contexts/BodyDataContext';
import LayerContext from '../../contexts/LayerContext';
import Background from './Background';
import Sun from '../bodies/Sun';
import MoonsContainer from '../bodies/Moon';
import PlanetSystem from '../bodies/Planet';
import TimeTicker from './TimeTicker';

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
      <PlanetSystem allPlanets={allPlanets} />
      <MoonsContainer allPlanets={allPlanets} />

      <TimeTicker />

      <ambientLight intensity={0.3} visible={ambientLightLayer?.value} />
    </>
  );
});
