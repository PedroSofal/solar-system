import { useContext } from 'react';
import TextureContext from '../../contexts/TextureContext';

export default function MoonMaterial({
  id,
  meanRadius,
}: {
  id: string;
  meanRadius: number;
}) {
  const isSmall = meanRadius < 600;

  const { getTexture } = useContext(TextureContext);

  // MOONS WITH SPECIFIC TEXTURES -----------------
  const specificTexture = getTexture(id);

  // GENERIC MOONS -----------------
  const albedo = getTexture('lunarRock2_albedo');
  const height = getTexture('lunarRock2_height');
  const normal = getTexture('lunarRock2_normal');

  return specificTexture ? (
    <meshStandardMaterial map={specificTexture} roughness={1} />
  ) : (
    <meshLambertMaterial
      map={albedo}
      normalMap={normal}
      normalScale={isSmall ? 0.5 : 0.2}
      displacementMap={height}
      displacementScale={meanRadius * 0.0000002}
    />
  );
}
