import { useEffect, useState } from 'react';

export default function useFetchBodies() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProcessedBodyData>({});

  useEffect(() => {
    setLoading(true);

    fetch('/data/bodies.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erro ao carregar bodies.json: ${res.statusText}`);
        }
        return res.json();
      })
      .then((bodies: BodyType[]) => {
        const moons = bodies.filter((body) => body.bodyType === 'moon');

        // Map para acesso rápido (O(1))
        const moonsMap = new Map<string, BodyType>(
          moons.map((moon) => [moon.frenchName, moon]),
        );

        // Função auxiliar para obter os objetos de lua
        function getMoonBodies(body: BodyType): BodyType[] {
          if (!body.moons) return [];
          return body.moons
            .map((moonName) => moonsMap.get(moonName))
            .filter(Boolean) as BodyType[];
        }

        // 2. Processa cada categoria, já associando as luas
        function processBody(body: BodyType) {
          return {
            ...body,
            moonBodies: getMoonBodies(body),
          };
        }

        const sun = bodies.find((body) => body.bodyType === 'star');
        const planets = bodies
          .filter((body) => body.bodyType === 'planet')
          .map(processBody);
        const dwarfPlanets = bodies
          .filter((body) => body.bodyType === 'dwarf-planet')
          .map(processBody);
        const asteroids = bodies
          .filter((body) => body.bodyType === 'asteroid')
          .map(processBody);
        const comets = bodies
          .filter((body) => body.bodyType === 'comet')
          .map(processBody);

        const heliocentricBodies = [
          ...planets,
          ...dwarfPlanets,
          ...asteroids,
          ...comets,
        ];

        const allBodies = [sun, ...heliocentricBodies, ...moons].filter(
          Boolean,
        ) as BodyType[];

        setData({
          sun,
          planets,
          moons,
          dwarfPlanets,
          asteroids,
          comets,
          allBodies,
          heliocentricBodies,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
