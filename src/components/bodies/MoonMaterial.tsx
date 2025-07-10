import { MeshStandardMaterial } from 'three';
import { ON_DEMAND } from '../../constants/textures';
import { useContext, useEffect, useRef } from 'react';
import TextureContext from '../../contexts/TextureContext';

export default function MoonMaterial({
  id,
  meanRadius,
}: {
  id: string;
  meanRadius: number;
}) {
  const hasSpecialTexture = ON_DEMAND[id];

  return hasSpecialTexture ? (
    <SpecialMaterial id={id} />
  ) : (
    <GenericMaterial meanRadius={meanRadius} />
  );
}

function SpecialMaterial({ id }: { id: string }) {
  const material = useRef(new MeshStandardMaterial());
  const { ktx2Loader } = useContext(TextureContext);

  useEffect(() => {
    if (ktx2Loader.current) {
      ktx2Loader.current.load(ON_DEMAND[id], (map) => {
        material.current.map = map;
        material.current.roughness = 1;
      });
    }
  }, []);

  return <meshStandardMaterial ref={material} />;
}

function GenericMaterial({ meanRadius }: { meanRadius: number }) {
  const material = useRef(new MeshStandardMaterial());
  const { ktx2Loader } = useContext(TextureContext);

  useEffect(() => {
    if (ktx2Loader.current) {
      ktx2Loader.current.load(ON_DEMAND.lunarRock2_albedo, (map) => {
        material.current.map = map;
      });
      ktx2Loader.current.load(ON_DEMAND.lunarRock2_height, (map) => {
        material.current.normalMap = map;
      });
      ktx2Loader.current.load(ON_DEMAND.lunarRock2_normal, (map) => {
        material.current.displacementMap = map;
      });
    }
  }, []);

  return (
    <meshLambertMaterial
      normalScale={meanRadius < 600 ? 0.5 : 0.2}
      displacementScale={meanRadius * 0.0000002}
    />
  );
}
