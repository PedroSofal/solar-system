import { useGLTF } from '@react-three/drei';
import { memo, useContext } from 'react';
import BodyDataContext from '../../contexts/BodyDataContext';
import LayerContext from '../../contexts/LayerContext';
import Background from './Background';
import Sun from '../bodies/Sun';
import MoonsContainer from '../bodies/Moon';
import TimeTicker from './TimeTicker';
import HeliocentricBodies from '../bodies/HeliocentricBodies';

export default memo(function SolarSystem() {
  const { sun, heliocentricBodies, loading } = useContext(BodyDataContext);
  const { getLayer } = useContext(LayerContext);
  const ambientLightLayer = getLayer('ambient-light');

  useGLTF.preload('/models/generic-moon/scene.gltf');

  if (loading || !heliocentricBodies) return null;

  return (
    <>
      <Background />

      {sun && <Sun bodyData={sun} />}
      <HeliocentricBodies bodyGroup={heliocentricBodies} />
      <MoonsContainer heliocentricBodies={heliocentricBodies} />

      <TimeTicker />

      <ambientLight intensity={0.3} visible={ambientLightLayer?.value} />
    </>
  );
});
