import { useLoader } from '@react-three/fiber';
import React, { createContext, useMemo } from 'react';
import { Texture, TextureLoader } from 'three';

//prettier-ignore
const texturePaths: Record<string, string> = {
  // Dwarf Planets
  ceres: '/textures/dwarf-planets/2k_ceres.jpg',
  eris: '/textures/dwarf-planets/2k_eris.jpg',
  haumea: '/textures/dwarf-planets/2k_haumea.jpg',
  makemake: '/textures/dwarf-planets/2k_makemake.jpg',
  pluto: '/textures/dwarf-planets/2k_pluto.jpg',

  // Moons
  moon: '/textures/moons/2k_moon.jpg',
  lunarRock2_albedo: '/textures/moons/lunar-rock2-bl/lunar-rock2_albedo.jpg',
  lunarRock2_height: '/textures/moons/lunar-rock2-bl/lunar-rock2_height.jpg',
  lunarRock2_normal: '/textures/moons/lunar-rock2-bl/lunar-rock2_normal.jpg',
  jaggedRockyGround1_albedo: '/textures/moons/jagged-rocky-ground1-bl/jagged-rocky-ground1_albedo.jpg',
  jaggedRockyGround1_height: '/textures/moons/jagged-rocky-ground1-bl/jagged-rocky-ground1_height.jpg',
  jaggedRockyGround1_normal: '/textures/moons/jagged-rocky-ground1-bl/jagged-rocky-ground1_normal.jpg',

  // Planets
  earth_clouds: '/textures/planets/earth/8k_earth_clouds.jpg',
  earth_day: '/textures/planets/earth/8k_earth_daymap.jpg',
  earth_night: '/textures/planets/earth/8k_earth_nightmap.jpg',
  earth_specular: '/textures/planets/earth/8k_earth_specular_map.jpg',
  jupiter: '/textures/planets/2k_jupiter.jpg',
  mars: '/textures/planets/2k_mars.jpg',
  mercury: '/textures/planets/2k_mercury.jpg',
  neptune: '/textures/planets/2k_neptune.jpg',
  saturn: '/textures/planets/2k_saturn.jpg',
  uranus: '/textures/planets/2k_uranus.jpg',
  venus: '/textures/planets/2k_venus.jpg',

  // Particles
  saturnRing: '/textures/particles/saturn-ring.png',

  // Background
  px: '/textures/cubemap/px.jpg',
  nx: '/textures/cubemap/nx.jpg',
  py: '/textures/cubemap/py.jpg',
  ny: '/textures/cubemap/ny.jpg',
  pz: '/textures/cubemap/pz.jpg',
  nz: '/textures/cubemap/nz.jpg',
};

const TextureContext = createContext<{
  getTexture: (textureId: string) => Texture;
  getTexturePath: (textureId: string) => string;
}>({
  getTexture: (() => {}) as unknown as (textureId: string) => Texture,
  getTexturePath: () => '',
});

export function TextureProvider({ children }: { children: React.ReactNode }) {
  const textures = useLoader(TextureLoader, Object.values(texturePaths));

  const textureMap = useMemo(() => {
    return Object.keys(texturePaths).reduce(
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
    return texturePaths[textureId];
  }

  return (
    <TextureContext.Provider value={{ getTexture, getTexturePath }}>
      {children}
    </TextureContext.Provider>
  );
}

export default TextureContext;
