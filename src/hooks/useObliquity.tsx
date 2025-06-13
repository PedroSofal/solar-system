import { useMemo } from 'react';
import { MathUtils, Quaternion, Vector3 } from 'three';
import { getBodyTiltQuaternionFromPole } from '../utils/astrophysics';

export default function useObliquity(
  obliquity: Obliquity,
  inclination: number,
  longAscNode: number,
) {
  const obliquityQuaternion = useMemo(() => {
    const { axialTilt, ra, dec } = obliquity;

    if (ra === null || dec === null) {
      // Fallback: Usar axialTilt em relação ao plano orbital

      const i = MathUtils.degToRad(inclination);
      const Ω = MathUtils.degToRad(longAscNode);
      const ε = MathUtils.degToRad(axialTilt);

      // Vetor Normal que aponta para o "polo" da órbita
      const orbitVector = new Vector3(
        Math.sin(i) * Math.sin(Ω),
        -Math.sin(i) * Math.cos(Ω),
        Math.cos(i),
      ).normalize();

      const nodeVector = new Vector3(Math.cos(Ω), Math.sin(Ω), 0).normalize();
      const qObliquity = new Quaternion().setFromAxisAngle(nodeVector, ε);
      const qObliquityToOrbit = orbitVector.clone().applyQuaternion(qObliquity);

      return new Quaternion().setFromUnitVectors(
        new Vector3(0, 1, 0),
        qObliquityToOrbit,
      );
    } else {
      // Caso principal: RA e DEC estão disponíveis
      return getBodyTiltQuaternionFromPole(ra, dec);
    }
  }, [obliquity, inclination, longAscNode]);

  return obliquityQuaternion;
}
