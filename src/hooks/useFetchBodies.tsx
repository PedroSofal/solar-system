import { useEffect, useState } from 'react';
import bodies from '../data/bodies.json';

export default function useFetchBodies() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    sun?: BodyType;
    planets?: BodyType[];
    moons?: BodyType[];
    dwarfPlanets?: BodyType[];
    asteroids?: BodyType[];
    comets?: BodyType[];
  }>({});

  useEffect(() => {
    setLoading(true);
    try {
      // prettier-ignore
      setData({
        sun: bodies.find((body) => body.bodyType === 'Estrela') as BodyType,
        planets: bodies.filter((body) => body.bodyType === 'Planeta') as BodyType[],
        moons: bodies.filter((body) => body.bodyType === 'Satélite Natural') as BodyType[],
        dwarfPlanets: bodies.filter((body) => body.bodyType === 'Planeta-anão') as BodyType[],
        asteroids: bodies.filter((body) => body.bodyType === 'Asteróide') as BodyType[],
        comets: bodies.filter((body) => body.bodyType === 'Cometa') as BodyType[],
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error };
}
