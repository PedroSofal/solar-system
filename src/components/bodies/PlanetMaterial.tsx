import { useContext } from 'react';
import commonVert from '../../shaders/earth/common.vert';
import worldpos from '../../shaders/earth/worldPos.vert';
import commonFrag from '../../shaders/earth/common.frag';
import roughnessMap from '../../shaders/earth/roughnessMap.frag';
import emissiveMap from '../../shaders/earth/emissiveMap.frag';
import TextureContext from '../../contexts/TextureContext';

export default function PlanetMaterial({ id }: { id: string }) {
  return id === 'earth' ? <EarthMaterial /> : <OtherPlanetsMaterial id={id} />;
}

function EarthMaterial() {
  const { getTexture } = useContext(TextureContext);

  const dayTexture = getTexture('earth_day');
  const nightTexture = getTexture('earth_night');
  const cloudsTexture = getTexture('earth_clouds');
  const specularMap = getTexture('earth_specular');

  return (
    <meshStandardMaterial
      map={dayTexture}
      emissive="#ffffff"
      emissiveMap={nightTexture}
      emissiveIntensity={0.1}
      roughnessMap={specularMap}
      onBeforeCompile={(shader) => {
        let frag = shader.fragmentShader;
        let vert = shader.vertexShader;

        vert = vert.replace('#include <common>', commonVert);
        vert = vert.replace('#include <worldpos_vertex>', worldpos);
        frag = frag.replace('#include <common>', commonFrag);
        frag = frag.replace('#include <roughnessmap_fragment>', roughnessMap);
        frag = frag.replace('#include <emissivemap_fragment>', emissiveMap);

        shader.uniforms.cloudTexture = { value: cloudsTexture };
        shader.fragmentShader = frag;
        shader.vertexShader = vert;
      }}
    />
  );
}

function OtherPlanetsMaterial({ id }: { id: string }) {
  const { getTexture } = useContext(TextureContext);
  const texture = getTexture(id);

  return <meshLambertMaterial color={'white'} map={texture} />;
}
