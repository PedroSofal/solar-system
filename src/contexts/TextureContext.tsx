import React, {
  createContext,
  createRef,
  useCallback,
  useRef,
  useState,
} from 'react';
import { Texture } from 'three';
import { KTX2Loader } from 'three/examples/jsm/Addons.js';

const TextureContext = createContext<{
  setTextureMap: React.Dispatch<React.SetStateAction<TextureMap>>;
  getTexture: (textureId: string) => Texture;
  ktx2Loader: React.RefObject<KTX2Loader | null>;
}>({
  setTextureMap: () => {},
  getTexture: (() => {}) as unknown as (textureId: string) => Texture,
  ktx2Loader: createRef(),
});

export function TextureProvider({ children }: { children: React.ReactNode }) {
  const [textureMap, setTextureMap] = useState<TextureMap>({});
  const ktx2Loader = useRef<KTX2Loader>(null);

  const getTexture = useCallback(
    (key: string) => {
      return textureMap[key];
    },
    [textureMap],
  );

  return (
    <TextureContext.Provider value={{ setTextureMap, getTexture, ktx2Loader }}>
      {children}
    </TextureContext.Provider>
  );
}

export default TextureContext;
