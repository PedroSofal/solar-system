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
    const loader = ktx2Loader.current;
    if (!loader) return;

    loader.load(ON_DEMAND[id], (map) => {
      material.current.map = map;
      material.current.roughness = 1;
      material.current.needsUpdate = true;
    });
  }, [ktx2Loader, id]);

  return <primitive object={material.current} />;
}

function GenericMaterial({ meanRadius }: { meanRadius: number }) {
  const material = useRef(new MeshStandardMaterial());
  const { ktx2Loader } = useContext(TextureContext);

  const scale = meanRadius < 600 ? 0.5 : 0.2;

  useEffect(() => {
    const loader = ktx2Loader.current;
    if (!loader) return;

    loader.load(ON_DEMAND.lunarRock2_albedo, (map) => {
      material.current.map = map;
      material.current.needsUpdate = true;
    });

    loader.load(ON_DEMAND.lunarRock2_normal, (map) => {
      material.current.normalMap = map;
      material.current.normalScale.set(scale, scale);
      material.current.needsUpdate = true;
    });

    loader.load(ON_DEMAND.lunarRock2_height, (map) => {
      material.current.displacementMap = map;
      material.current.displacementScale = meanRadius * 0.0000002;
      material.current.needsUpdate = true;
    });
  }, [ktx2Loader, meanRadius]);

  return <primitive object={material.current} />;
}
