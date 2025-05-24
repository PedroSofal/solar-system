import { useContext } from 'react';
import { Group, MathUtils } from 'three';
import TimeStaticContext from '../contexts/TimeStaticContext';
import { useFrame } from '@react-three/fiber';

function solveKepler(M: number, e: number): number {
  const tolerance = 1e-6;
  let E = M;
  let delta;
  do {
    delta = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= delta;
  } while (Math.abs(delta) > tolerance);
  return E;
}

function trueAnomaly(E: number, e: number): number {
  return (
    2 *
    Math.atan2(
      Math.sqrt(1 + e) * Math.sin(E / 2),
      Math.sqrt(1 - e) * Math.cos(E / 2),
    )
  );
}

export default function useOrbitalElements(
  positionRef: React.RefObject<Group | null>,
  scaledSemimajorAxis: number,
  eccentricity: number,
  inclination: number,
  longAscNode: number,
  argPeriapsis: number,
  meanAnomaly: number,
  orbitalPeriod: number,
  nodalPeriod: number,
  apsidalPeriod: number,
  needsPrecessionCorrection: boolean,
) {
  const { getDaysSinceEpoch } = useContext(TimeStaticContext);

  const a = scaledSemimajorAxis;
  const e = eccentricity;
  const i = MathUtils.degToRad(inclination);
  const Ω0 = MathUtils.degToRad(longAscNode);
  const ω0 = MathUtils.degToRad(argPeriapsis);
  const M0 = MathUtils.degToRad(meanAnomaly);

  // Velocidades em rad/dia
  const directedNodalPeriod = inclination > 90 ? nodalPeriod : -nodalPeriod;
  const nodalRate = (2 * Math.PI) / directedNodalPeriod;
  const apsidalRate = (2 * Math.PI) / apsidalPeriod;
  const meanMotion = (2 * Math.PI) / orbitalPeriod;

  const correctedMeanMotion = needsPrecessionCorrection
    ? meanMotion - apsidalRate - nodalRate
    : meanMotion;

  function updatePosition() {
    const daysSinceEpoch = getDaysSinceEpoch();

    // 1. Atualiza Animalia Média, Longitude do Nó Ascendente e Argumento do Periápside com o tempo
    const Ω = (Ω0 + nodalRate * daysSinceEpoch) % (Math.PI * 2);
    const ω = (ω0 + apsidalRate * daysSinceEpoch) % (Math.PI * 2);
    const M = (M0 + correctedMeanMotion * daysSinceEpoch) % (Math.PI * 2);

    // 2. Calcula Anomalia Excêntrica (E) a partir da Anomalia Média (M)
    const E = solveKepler(M, e);

    // 3. Calcula Anomalia Verdadeira (v)
    const v = trueAnomaly(E, e);

    // 4. Calcula distância radial (r)
    const r = a * (1 - e * Math.cos(E));

    // 5. Posição no plano orbital
    const x_orb = r * Math.cos(v);
    const y_orb = r * Math.sin(v);

    // 6. Rotaciona para coordenadas eclípticas J2000
    const cos_i = Math.cos(i);
    const sin_i = Math.sin(i);
    const cos_Ω = Math.cos(Ω);
    const sin_Ω = Math.sin(Ω);
    const cos_ω = Math.cos(ω);
    const sin_ω = Math.sin(ω);

    const x =
      x_orb * (cos_ω * cos_Ω - sin_ω * sin_Ω * cos_i) -
      y_orb * (sin_ω * cos_Ω + cos_ω * sin_Ω * cos_i);

    const y =
      x_orb * (cos_ω * sin_Ω + sin_ω * cos_Ω * cos_i) +
      y_orb * (-sin_ω * sin_Ω + cos_ω * cos_Ω * cos_i);

    const z = x_orb * (sin_ω * sin_i) + y_orb * (cos_ω * sin_i);

    positionRef.current!.position.set(x, y, z);
  }

  useFrame(updatePosition, -1);
}
