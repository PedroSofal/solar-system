import { useContext } from 'react';
import TextureContext from '../../contexts/TextureContext';

export default function MoonMaterial({
  id,
  meanRadius,
}: {
  id: string;
  meanRadius: number;
}) {
  const isEarthsMoon = id === 'moon';
  const isSmall = meanRadius < 600;

  const { getTexture } = useContext(TextureContext);

  // EARTH'S MOON -----------------
  const moonTexture = getTexture('moon');

  // OTHER MOONS -----------------
  const albedo = getTexture('lunarRock2_albedo');
  const height = getTexture('lunarRock2_height');
  const normal = getTexture('lunarRock2_normal');

  if (isEarthsMoon) {
    return <meshStandardMaterial map={moonTexture} roughness={1} />;
  } else {
    return (
      <meshLambertMaterial
        map={albedo}
        normalMap={normal}
        normalScale={isSmall ? 0.5 : 0.2}
        displacementMap={height}
        displacementScale={meanRadius * 0.0000002}
      />
    );
  }
}
