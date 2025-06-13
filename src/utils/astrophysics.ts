import { MathUtils, Quaternion, Vector3 } from 'three';

const OBLIQUITY_J2000 = MathUtils.degToRad(23.4392811);
const cosObl = Math.cos(OBLIQUITY_J2000);
const sinObl = Math.sin(OBLIQUITY_J2000);

function getQuaternionFromPole(
  poleRA: number | undefined | null,
  poleDEC: number | undefined | null,
  up: Vector3,
): Quaternion {
  /**
   * Calcula um Quaternion que orienta o eixo Y local de um corpo (0,1,0)
   * para a direção definida pelo seu polo rotacional (RA/DEC) no sistema Eclíptico J2000.
   * @param poleRA Ascensão Reta do polo (graus)
   * @param poleDEC Declinação do polo (graus)
   * @returns Quaternion de orientação ou Quaternion identidade se os dados forem inválidos.
   */

  const q = new Quaternion();
  if (
    poleRA === undefined ||
    poleRA === null ||
    poleDEC === undefined ||
    poleDEC === null
  )
    return q;

  const ra = MathUtils.degToRad(poleRA);
  const dec = MathUtils.degToRad(poleDEC);

  // 1. Vetor Equatorial
  const poleEquatorial = new Vector3(
    Math.cos(dec) * Math.cos(ra),
    Math.cos(dec) * Math.sin(ra),
    Math.sin(dec),
  );

  // 2. Vetor Eclíptico
  const poleEcliptic = new Vector3(
    poleEquatorial.x,
    poleEquatorial.y * cosObl + poleEquatorial.z * sinObl,
    -poleEquatorial.y * sinObl + poleEquatorial.z * cosObl,
  ).normalize(); // Normaliza aqui

  q.setFromUnitVectors(up, poleEcliptic);

  return q;
}

export function getBodyTiltQuaternionFromPole(ra: number, dec: number) {
  const up = new Vector3(0, 1, 0);
  return getQuaternionFromPole(ra, dec, up);
}

export function getReferencePlaneQuaternionFromPole(ra: number, dec: number) {
  const up = new Vector3(0, 0, 1);
  return getQuaternionFromPole(ra, dec, up);
}
