import { useMemo } from 'react';

export default function useFallbackData(bodyData: BodyType) {
  const fallbackData = useMemo(() => {
    const {
      longAscNode,
      argPeriapsis,
      sideralOrbit,
      equaRadius,
      polarRadius,
      dimension,
      sideralRotation,
      meanRadius,
      mainAnomaly,
      nodalPeriod,
      apsidalPeriod,
      needsPrecessionCorrection,
    } = bodyData;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    return {
      ...bodyData,
      longAscNode: longAscNode || randomInRange(0, 360),
      argPeriapsis: argPeriapsis || randomInRange(0, 360),
      mainAnomaly: mainAnomaly || randomInRange(0, 360),
      sideralOrbit: sideralOrbit || randomInRange(200, 500),
      equaRadius:
        equaRadius ||
        (dimension && dimension.split('x').map(Number)[0] / 2) ||
        meanRadius ||
        randomInRange(300, 500),
      polarRadius:
        polarRadius ||
        (dimension && dimension.split('x').map(Number)[1] / 2) ||
        meanRadius ||
        randomInRange(300, 500),
      sideralRotation: sideralRotation || randomInRange(1, 30),
      nodalPeriod: nodalPeriod || 1_000_000,
      apsidalPeriod: apsidalPeriod || 1_000_000,
      needsPrecessionCorrection: needsPrecessionCorrection || false,
    };
  }, [bodyData]);

  return fallbackData;
}
