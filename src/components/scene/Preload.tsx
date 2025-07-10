import { useThree } from '@react-three/fiber';
import { KTX2Loader } from 'three/examples/jsm/Addons.js';
import { useKTX2, useTexture } from '@react-three/drei';
import { useContext, useEffect } from 'react';
import TextureContext from '../../contexts/TextureContext';
import { UP_FRONT } from '../../constants/textures';
import basisTranscoderURL from '../../libs/basis/basis_transcoder.js?url';

export default function Preload() {
  const { textureMap, ktx2Loader } = useContext(TextureContext);
  const { gl } = useThree();

  const tradPaths = [];
  const ktx2Paths = [];

  for (const path of Object.values(UP_FRONT)) {
    if (path.endsWith('.ktx2')) {
      ktx2Paths.push(path);
    } else {
      tradPaths.push(path);
    }
  }

  const ktx2Textures = useKTX2(ktx2Paths);
  const tradTextures = useTexture(tradPaths);
  const allTextures = ktx2Textures.concat(tradTextures);

  useEffect(() => {
    textureMap.current = Object.keys(UP_FRONT).reduce((acc, value, index) => {
      acc[value] = allTextures[index];
      return acc;
    }, {} as TextureMap);
  }, []);

  useEffect(() => {
    const loader = new KTX2Loader();
    const basisPath = basisTranscoderURL.substring(
      0,
      basisTranscoderURL.lastIndexOf('/') + 1,
    );
    loader.setTranscoderPath(basisPath);
    loader.detectSupport(gl);
    ktx2Loader.current = loader;
  }, []);

  return null;
}
