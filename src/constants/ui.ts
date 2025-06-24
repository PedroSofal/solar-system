export const hitboxConfig = {
  RADIUS: 3,
  FONT_SIZE: {
    star: 4.5,
    planet: 4.5,
    'dwarf-planet': 4.5,
    moon: 4.5,
    comet: 3.5,
    asteroid: 3.5,
  },
  FONT_WEIGHT: {
    star: 800,
    planet: 800,
    'dwarf-planet': 800,
    moon: 600,
    comet: 600,
    asteroid: 400,
  },
  LETTER_SPACING: {
    star: 0.2,
    planet: 0.2,
    'dwarf-planet': 0.2,
    moon: 0,
    comet: 0.2,
    asteroid: 0.2,
  },
};

export const colorConfig: {
  planet: Record<PlanetId, { primary: string; moons?: string }>;
  comet: string;
  asteroid: string;
  'dwarf-planet': string;
} = {
  planet: {
    mercury: { primary: '#b970f5' },
    venus: { primary: '#e2b156' },
    earth: { primary: '#34d399', moons: '#5c736a' },
    mars: { primary: '#a2514b', moons: '#735d5c' },
    jupiter: { primary: '#c77a63', moons: '#73615c' },
    saturn: { primary: '#e4a95c', moons: '#73695c' },
    uranus: { primary: '#62c2bd', moons: '#5c7372' },
    neptune: { primary: '#4976ca', moons: '#5c6473' },
  },
  comet: '#80c1ff',
  asteroid: '#454a4e',
  'dwarf-planet': '#aaaaaa',
};
