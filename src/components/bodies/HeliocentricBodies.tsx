import { Group } from 'three';
import { lazy, memo, Suspense, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Node from './Node';
import ShadowSource from '../scene/ShadowSource';
import useProximityLoad from '../../hooks/useProximityLoad';
import useBodyVisibility from '../../hooks/useBodyVisibility';

const RingSystem = lazy(() => import('./RingSystem'));

export default function HeliocentricBodies({
  bodyGroup,
}: {
  bodyGroup: BodyType[];
}) {
  const { id: routeId } = useParams();

  const semimajorAxes = bodyGroup.map((p) => p.semimajorAxis ?? 0);
  const min_a = Math.min(...semimajorAxes);
  const max_a = Math.max(...semimajorAxes);

  return bodyGroup.map((body) => (
    <HeliocentricBody
      key={body.id}
      bodyData={body}
      isSystemFocused={Boolean(
        body.id === routeId ||
          body.moonBodies?.find((moon) => moon.id === routeId),
      )}
      min_a={min_a}
      max_a={max_a}
    />
  ));
}

const HeliocentricBody = memo(function ({
  bodyData,
  isSystemFocused,
  min_a,
  max_a,
}: {
  bodyData: BodyType;
  isSystemFocused: boolean;
  min_a: number;
  max_a: number;
}) {
  const { ringSystem, meanRadius, semimajorAxis, bodyType } = bodyData;

  const heliocentricContainerRef = useRef<Group>(null);
  const bodyRef = useRef<Group>(null);

  const isRingSystemLoaded = useProximityLoad(bodyRef, 2000);
  useBodyVisibility(heliocentricContainerRef, bodyType, isSystemFocused);

  return (
    <group ref={heliocentricContainerRef} name="corpo heliocêntrico">
      <Node bodyData={bodyData} bodyRef={bodyRef}>
        <Suspense fallback={null}>
          {ringSystem && isRingSystemLoaded && (
            <RingSystem bodyRef={bodyRef} bodyData={bodyData} />
          )}
        </Suspense>
      </Node>

      <ShadowSource
        bodyRef={bodyRef}
        meanRadius={meanRadius}
        semimajorAxis={semimajorAxis}
        min_a={min_a}
        max_a={max_a}
        isSystemFocused={isSystemFocused}
      />
    </group>
  );
});
