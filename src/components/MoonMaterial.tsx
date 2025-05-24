import { useContext } from 'react';
import TextureContext from '../contexts/TextureContext';

export default function MoonMaterial({
  id,
  meanRadius,
  dimension,
}: {
  id: string;
  meanRadius: number;
  dimension: string;
}) {
  const isMoon = id === 'moon';
  const isSmall = meanRadius < 1000;
  const isExtraSmall = meanRadius < 300;
  const isIrregular = !!dimension;

  const { getTexture } = useContext(TextureContext);

  // MOON -----------------
  const moonTexture = getTexture('moon');

  // OTHER -----------------
  const genericTextureRad = isIrregular ? 'jaggedRockyGround1' : 'lunarRock2';
  const albedo = getTexture(`${genericTextureRad}_albedo`);
  const height = getTexture(`${genericTextureRad}_height`);
  const normal = getTexture(`${genericTextureRad}_normal`);

  if (isMoon) {
    return <meshStandardMaterial map={moonTexture} roughness={1} />;
  } else {
    return (
      <meshLambertMaterial
        map={albedo}
        normalMap={normal}
        normalScale={isExtraSmall ? 0.8 : isSmall ? 0.5 : 0.2}
        displacementMap={height}
        displacementScale={isIrregular ? 0.1 : meanRadius * 0.0000002}
      />
    );
  }
}
