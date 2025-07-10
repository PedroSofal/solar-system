import { useLoader, useThree } from '@react-three/fiber';
import { KTX2Loader } from 'three/examples/jsm/Addons.js';
import { useKTX2 } from '@react-three/drei';
import { useContext, useEffect } from 'react';
import TextureContext from '../../contexts/TextureContext';
import { UP_FRONT } from '../../constants/textures';
import basisTranscoderURL from '../../libs/basis/basis_transcoder.js?url';
import { TextureLoader } from 'three';

export default function Preload() {
  const { textureMap, ktx2Loader } = useContext(TextureContext);
  const { gl } = useThree();

  const ktx2Entries: [string, string][] = [];
  const tradEntries: [string, string][] = [];

  for (const [key, path] of Object.entries(UP_FRONT)) {
    if (path.endsWith('.ktx2')) {
      ktx2Entries.push([key, path]);
    } else {
      tradEntries.push([key, path]);
    }
  }

  const ktx2Textures = useKTX2(ktx2Entries.map(([, path]) => path));
  const tradTextures = useLoader(
    TextureLoader,
    tradEntries.map(([, path]) => path),
  );

  useEffect(() => {
    const textureMapResult: TextureMap = {};

    ktx2Entries.forEach(([key], index) => {
      textureMapResult[key] = ktx2Textures[index];
    });

    tradEntries.forEach(([key], index) => {
      textureMapResult[key] = tradTextures[index];
    });

    textureMap.current = textureMapResult;
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
