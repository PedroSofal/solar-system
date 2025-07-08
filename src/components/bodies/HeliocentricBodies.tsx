import { Group } from 'three';
import { lazy, memo, Suspense, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Node from './Node';
import ShadowSource from '../scene/ShadowSource';
import useProximityLoad from '../../hooks/useProximityLoad';
import useBodyVisibility from '../../hooks/useBodyVisibility';

const RingSystem = lazy(() => import('./RingSystem'));
const CometTrail = lazy(() => import('./CometTrail'));

export default function HeliocentricBodies({
  bodyGroup,
}: {
  bodyGroup: BodyType[];
}) {
  const { id: routeId } = useParams();

  return bodyGroup.map((body) => (
    <HeliocentricBody
      key={body.id}
      bodyData={body}
      isSystemFocused={Boolean(
        body.id === routeId ||
          body.moonBodies?.find((moon) => moon.id === routeId),
      )}
    />
  ));
}

const HeliocentricBody = memo(function ({
  bodyData,
  isSystemFocused,
}: {
  bodyData: BodyType;
  isSystemFocused: boolean;
}) {
  const { ringSystem, meanRadius, bodyType } = bodyData;

  const heliocentricContainerRef = useRef<Group>(null);
  const bodyRef = useRef<Group>(null);

  const isRingSystemLoaded = useProximityLoad(bodyRef, 2000);
  const isCometTrailLoaded = useProximityLoad(bodyRef, 2000);

  const isActive = useBodyVisibility(
    heliocentricContainerRef,
    bodyType,
    isSystemFocused,
  );

  return (
    <group
      ref={heliocentricContainerRef}
      name="corpo heliocêntrico"
      visible={isActive}
    >
      {isActive && (
        <Node
          bodyData={bodyData}
          bodyRef={bodyRef}
          ringSystem={
            <Suspense fallback={null}>
              {ringSystem && isRingSystemLoaded && (
                <RingSystem
                  bodyRef={bodyRef}
                  bodyData={bodyData}
                  isActive={isActive}
                />
              )}
            </Suspense>
          }
          trail={
            <Suspense fallback={null}>
              {bodyType === 'comet' && isCometTrailLoaded && (
                <CometTrail
                  bodyRef={bodyRef}
                  bodyData={bodyData}
                  isActive={isActive}
                />
              )}
            </Suspense>
          }
        />
      )}

      <ShadowSource
        bodyRef={bodyRef}
        meanRadius={meanRadius}
        isSystemFocused={isSystemFocused}
      />
    </group>
  );
});
