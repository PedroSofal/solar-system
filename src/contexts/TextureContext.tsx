import { useLoader } from '@react-three/fiber';
import React, { createContext, useMemo } from 'react';
import { Texture, TextureLoader } from 'three';
import { TEXTURE_PATHS } from '../constants/textures';

const TextureContext = createContext<{
  getTexture: (textureId: string) => Texture;
  getTexturePath: (textureId: string) => string;
}>({
  getTexture: (() => {}) as unknown as (textureId: string) => Texture,
  getTexturePath: () => '',
});

export function TextureProvider({ children }: { children: React.ReactNode }) {
  const textures = useLoader(TextureLoader, Object.values(TEXTURE_PATHS));

  const textureMap = useMemo(() => {
    return Object.keys(TEXTURE_PATHS).reduce(
      (acc, planet, index) => {
        acc[planet] = textures[index];
        return acc;
      },
      {} as Record<string, Texture>,
    );
  }, [textures]);

  function getTexture(textureId: string) {
    return textureMap[textureId];
  }

  function getTexturePath(textureId: string) {
    return TEXTURE_PATHS[textureId];
  }

  return (
    <TextureContext.Provider value={{ getTexture, getTexturePath }}>
      {children}
    </TextureContext.Provider>
  );
}

export default TextureContext;
