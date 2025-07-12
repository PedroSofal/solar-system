import { EllipseCurve, MathUtils, Group, Quaternion, Vector3 } from 'three';
import { Line2, LineSegments2 } from 'three-stdlib';
import { useFrame } from '@react-three/fiber';
import { Detailed, Line } from '@react-three/drei';
import { useContext, useMemo, useRef } from 'react';
import LayerContext from '../../contexts/LayerContext';
import TimeStaticContext from '../../contexts/TimeStaticContext';
import useDistanceCulling from '../../hooks/useDistanceCulling';
import { toModelScale } from '../../utils/scene';

export default function OrbitLine({
  orbitRef,
  bodyRef,
  bodyType,
  semimajorAxis,
  eccentricity,
  inclination,
  longAscNode,
  argPeriapsis,
  nodalPeriod,
  apsidalPeriod,
  color = 'white',
  farStart,
  farEnd,
  nearStart,
  nearEnd,
}: {
  orbitRef: React.RefObject<Line2 | LineSegments2 | null>;
  bodyRef: React.RefObject<Group | null>;
  bodyType: BodyTypeOptions;
  semimajorAxis: number;
  eccentricity: number;
  inclination: number;
  longAscNode: number;
  argPeriapsis: number;
  nodalPeriod: number;
  apsidalPeriod: number;
  color?: string;
  farStart?: number;
  farEnd?: number;
  nearStart?: number;
  nearEnd?: number;
}) {
  const a = toModelScale(semimajorAxis);
  const e = eccentricity;
  const b = a * Math.sqrt(1 - e * e); // semieixo menor
  const i = MathUtils.degToRad(inclination);
  const Ω0 = MathUtils.degToRad(longAscNode);
  const ω0 = MathUtils.degToRad(argPeriapsis);

  const directedNodalPeriod = inclination > 90 ? nodalPeriod : -nodalPeriod;
  const nodalRate = (2 * Math.PI) / directedNodalPeriod;
  const apsidalRate = (2 * Math.PI) / apsidalPeriod;

  const opacityRef = useRef(1);

  const { getDaysSinceEpoch } = useContext(TimeStaticContext);
  const { getLayer } = useContext(LayerContext);

  const orbitLayer = getLayer('orbit', bodyType);

  function getOrbitPoints(segments: number) {
    const curve = new EllipseCurve(
      -a * e,
      0, // offset para o foco
      a,
      b,
      0,
      Math.PI * 2,
      false,
      0,
    );
    return curve.getPoints(segments).map((p) => new Vector3(p.x, p.y, 0));
  }

  useFrame(() => {
    const days = getDaysSinceEpoch();
    const Ω = Ω0 + nodalRate * days;
    const ω = ω0 + apsidalRate * days;

    const q = new Quaternion()
      .setFromAxisAngle(new Vector3(0, 0, 1), Ω)
      .multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), i))
      .multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), ω));

    orbitRef.current?.setRotationFromQuaternion(q);
  });

  useDistanceCulling({
    farStart,
    farEnd,
    nearStart,
    nearEnd,
    reference: bodyRef,
    targets: [orbitRef],
    opacityRef,
  });

  const detailLevels = useMemo(() => {
    if (semimajorAxis < 778_340_821) {
      // aplica LOD às órbitas menores que a de Júpiter
      return [
        { points: getOrbitPoints(2000), distance: 0 },
        { points: getOrbitPoints(1000), distance: 500 },
        { points: getOrbitPoints(500), distance: 5000 },
        { points: getOrbitPoints(20), distance: 50000 },
      ];
    } else if (semimajorAxis > 4_498_396_441) {
      // usa mais pontos nas órbitas maiores que a de Netuno
      return [
        { points: getOrbitPoints(10000), distance: 0 },
        { points: getOrbitPoints(4000), distance: 200000 },
        { points: getOrbitPoints(1000), distance: 500000 },
      ];
    } else {
      return [{ points: getOrbitPoints(1500), distance: 0 }];
    }
  }, [a, e]);

  return (
    <group ref={orbitRef} name="orbit">
      <Detailed distances={detailLevels.map((level) => level.distance)}>
        {detailLevels.map(({ points }, index) => (
          <Line
            key={index}
            visible={orbitLayer?.value}
            points={points}
            color={color}
            transparent
            opacity={opacityRef.current}
            lineWidth={1.3}
            depthWrite={false}
          />
        ))}
      </Detailed>
    </group>
  );
}
