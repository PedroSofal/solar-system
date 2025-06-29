import { Color, Group } from 'three';
import { Line2, LineSegments2 } from 'three/examples/jsm/Addons.js';
import { useRef } from 'react';

import Body from './Body';
import Atmosphere from './Atmosphere';
import PlanetMaterial from './PlanetMaterial';
import MoonMaterial from './MoonMaterial';
import Hitbox from '../scene/Hitbox';
import OrbitLine from '../scene/OrbitLine';

import useFallbackData from '../../hooks/useFallbackData';
import useDistanceCulling from '../../hooks/useDistanceCulling';
import useSiderealRotation from '../../hooks/useSiderealRotation';
import useOrbitalElements from '../../hooks/useOrbitalElements';
import useObliquity from '../../hooks/useObliquity';

import { toModelScale } from '../../utils/scene';
import { getNodeColor } from '../../utils/ui';
import {
  getHitboxCullingPoints,
  getOrbitCullingPoints,
} from '../../utils/performance';

export default function Node({
  bodyData,
  bodyRef,
  ringSystem,
  trail,
}: {
  bodyData: BodyType;
  bodyRef: React.RefObject<Group | null>;
  ringSystem?: React.ReactNode;
  trail?: React.ReactNode;
}) {
  const {
    bodyType,
    id,
    name,
    semimajorAxis,
    eccentricity,
    inclination,
    parent,
    meanRadius,
    obliquity,
    referencePlane,
  } = bodyData;

  const {
    longAscNode,
    argPeriapsis,
    sideralRotation,
    equaRadius,
    polarRadius,
    dimension,
    mainAnomaly,
    sideralOrbit,
    nodalPeriod,
    apsidalPeriod,
  } = useFallbackData(bodyData);

  const nodeRef = useRef<Group>(null);
  const positionRef = useRef<Group>(null);
  const rotationRef = useRef<Group>(null);
  const circleRef = useRef<Line2 | LineSegments2>(null);
  const orbitRef = useRef<Line2 | LineSegments2>(null);

  const scaledPolarRadius = toModelScale(polarRadius);
  const scaledEquaRadius = toModelScale(equaRadius);
  const scaledMeanRadius = toModelScale(meanRadius);
  const scaledSemimajorAxis = toModelScale(semimajorAxis);

  const isMoon = bodyType === 'moon';
  const isMinorBody = bodyType === 'comet' || bodyType === 'asteroid';
  const color = getNodeColor(parent?.name || id, bodyType);
  const needsPrecessionCorrection = id === 'moon';
  const declustered =
    id === 'mercury' ||
    id === 'venus' ||
    id === 'mars' ||
    (referencePlane.ref === 'laplace' && semimajorAxis < 377396); // Helene (Saturno)

  const hitboxCulling = getHitboxCullingPoints(bodyData, declustered);
  const orbitCulling = getOrbitCullingPoints(bodyData, declustered);

  const obliquityQuaternion = useObliquity(obliquity, inclination, longAscNode);

  useOrbitalElements(
    positionRef,
    scaledSemimajorAxis,
    eccentricity,
    inclination,
    longAscNode,
    argPeriapsis,
    mainAnomaly,
    sideralOrbit,
    nodalPeriod * 365,
    apsidalPeriod * 365,
    needsPrecessionCorrection,
  );

  useSiderealRotation(rotationRef, sideralRotation);

  useDistanceCulling({
    farStart: isMoon ? scaledMeanRadius + 1000 : undefined,
    reference: bodyRef,
    targets: [nodeRef],
  });

  return (
    <group ref={nodeRef} name="node">
      <group ref={positionRef} name="orbit position">
        <group quaternion={obliquityQuaternion} name="obliquity">
          <group ref={rotationRef} name="rotation">
            <Body
              bodyRef={bodyRef}
              id={id}
              meanRadius={meanRadius}
              scaledEquaRadius={scaledEquaRadius}
              scaledPolarRadius={scaledPolarRadius}
              dimension={dimension}
              material={
                isMoon || isMinorBody ? (
                  <MoonMaterial id={id} meanRadius={meanRadius} />
                ) : (
                  <PlanetMaterial id={id} />
                )
              }
              atmosphere={
                id === 'earth' ? (
                  <Atmosphere
                    bodyRadius={scaledMeanRadius}
                    length={0.001}
                    opacity={0.8}
                    powFactor={6.0}
                    multiplier={5000.0}
                    color={new Color('#71a3ff')}
                  />
                ) : null
              }
            />

            <Hitbox
              bodyRef={bodyRef}
              circleRef={circleRef}
              orbitRef={orbitRef}
              bodyRadius={scaledMeanRadius}
              bodyType={bodyType}
              labelTitle={name}
              labelColor={color}
              circleColor={color}
              {...hitboxCulling}
            />
          </group>
          {ringSystem && <group>{ringSystem}</group>}
        </group>
        {trail && <group>{trail}</group>}
      </group>
      <OrbitLine
        orbitRef={orbitRef}
        bodyRef={bodyRef}
        bodyType={bodyType}
        semimajorAxis={semimajorAxis}
        eccentricity={eccentricity}
        inclination={inclination}
        longAscNode={longAscNode}
        argPeriapsis={argPeriapsis}
        nodalPeriod={nodalPeriod * 365}
        apsidalPeriod={apsidalPeriod * 365}
        color={color}
        {...orbitCulling}
      />
    </group>
  );
}
