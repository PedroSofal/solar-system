import React, { createContext, createRef, useRef } from 'react';
import { Texture } from 'three';
import { KTX2Loader } from 'three/examples/jsm/Addons.js';

const TextureContext = createContext<{
  textureMap: React.RefObject<TextureMap | null>;
  getTexture: (textureId: string) => Texture;
  ktx2Loader: React.RefObject<KTX2Loader | null>;
}>({
  textureMap: createRef(),
  getTexture: (() => {}) as unknown as (textureId: string) => Texture,
  ktx2Loader: createRef(),
});

export function TextureProvider({ children }: { children: React.ReactNode }) {
  const textureMap = useRef<TextureMap>(null);
  const ktx2Loader = useRef<KTX2Loader>(null);

  function getTexture(textureId: string) {
    if (textureMap.current) {
      return textureMap.current[textureId];
    }
  }

  return (
    <TextureContext.Provider value={{ textureMap, getTexture, ktx2Loader }}>
      {children}
    </TextureContext.Provider>
  );
}

export default TextureContext;
