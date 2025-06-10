import { Vector3, Group } from 'three';
import { useContext, useMemo, useRef, useState } from 'react';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { Line2, LineSegments2 } from 'three/examples/jsm/Addons.js';
import { Text, TextProps, Line } from '@react-three/drei';
import gsap from 'gsap';
import useStickySize from '../../hooks/useStickySize';
import useDistanceCulling from '../../hooks/useDistanceCulling';
import LayerContext from '../../contexts/LayerContext';
import { getActiveLOD, formatBodyType } from '../../utils';
import CameraContext from '../../contexts/CameraContext';
import CustomBillboard from '../CustomBillboard';

const FIXED_RADIUS = 3;

export default function Hitbox({
  bodyRef,
  circleRef,
  orbitRef,
  bodyRadius,
  bodyType,
  labelTitle,
  labelColor = 'white',
  circleColor = 'white',
  farStart,
  farEnd,
  nearStart,
  nearEnd,
}: {
  bodyRef: React.RefObject<Group | null>;
  circleRef: React.RefObject<Line2 | LineSegments2 | null>;
  orbitRef?: React.RefObject<Line2 | LineSegments2 | null>;
  bodyRadius: number;
  bodyType: BodyTypeOptions;
  labelTitle?: string;
  labelColor?: string;
  circleColor?: string;
  farStart?: number;
  farEnd?: number;
  nearStart?: number;
  nearEnd?: number;
}) {
  const hitboxRef = useRef<Group>(null);
  const lineRef = useRef<Line2>(null);
  const labelRef = useRef<TextProps>(null);
  const opacityRef = useRef(1);
  const visibilityRef = useRef(true);

  const { getLayer } = useContext(LayerContext);
  const { handleFocus } = useContext(CameraContext);

  const labelLayer = getLayer('label', formatBodyType(bodyType));
  const circleLayer = getLayer('hitbox', formatBodyType(bodyType));

  const [pointerDownElement, setPointerDownElement] = useState<string>();

  const isMoon = bodyType === 'Satélite Natural';

  useDistanceCulling({
    farStart,
    farEnd,
    nearStart,
    nearEnd,
    reference: bodyRef,
    targets: [lineRef, labelRef],
    visibilityRef,
    opacityRef,
  });

  useFrame(() => {
    if (lineRef.current) {
      lineRef.current.material.opacity = opacityRef.current;
    }
  }, -2);

  useStickySize(hitboxRef, bodyRef, FIXED_RADIUS, bodyRadius);

  const circlePoints = useMemo(() => {
    const points = [];
    const segments = 32;

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * 2 * Math.PI;
      const x = FIXED_RADIUS * Math.cos(angle);
      const y = FIXED_RADIUS * Math.sin(angle);
      points.push(new Vector3(x, y, 0));
    }

    return points;
  }, [FIXED_RADIUS]);

  function handlePointerDown(e: ThreeEvent<PointerEvent>) {
    setPointerDownElement(e.object.uuid);
  }

  function handlePointerUp(e: ThreeEvent<PointerEvent>) {
    if (
      !bodyRef.current ||
      !visibilityRef.current ||
      !hitboxRef.current?.visible ||
      pointerDownElement !== e.object.uuid
    ) {
      return;
    }

    handleFocus(bodyRef.current.name);
    setPointerDownElement(undefined);
  }

  function handlePointerEnter() {
    if (
      !circleRef.current ||
      !visibilityRef.current ||
      !hitboxRef.current?.visible
    )
      return;

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.classList.remove('cursor-grab');
      canvas.classList.remove('active:cursor-grabbing');
      canvas.classList.add('cursor-pointer');
    }

    gsap.to(circleRef.current.scale, {
      x: 1.3,
      y: 1.3,
      ease: 'power1.out',
      duration: 0.2,
    });

    if (orbitRef?.current) {
      const orbitLine = getActiveLOD(orbitRef.current) as Line2;
      if (orbitLine) orbitLine.material.linewidth = 2.5;
    }
    const lineMaterial = lineRef?.current?.material;
    if (lineMaterial) lineMaterial.linewidth = 2.5;
  }

  function handlePointerLeave() {
    if (
      !circleRef.current ||
      !visibilityRef.current ||
      !hitboxRef.current?.visible
    )
      return;

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.classList.remove('cursor-pointer');
      canvas.classList.add('cursor-grab');
      canvas.classList.add('active:cursor-grabbing');
    }

    gsap.to(circleRef.current.scale, {
      x: 1,
      y: 1,
      ease: 'power1.out',
      duration: 0.2,
    });

    if (orbitRef?.current) {
      const orbitLine = getActiveLOD(orbitRef.current) as Line2;
      if (orbitLine) orbitLine.material.linewidth = 1.3;
    }
    const lineMaterial = lineRef?.current?.material;
    if (lineMaterial) lineMaterial.linewidth = 1.3;
  }

  return (
    <group
      ref={hitboxRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <group ref={circleRef}>
        <Line
          ref={lineRef}
          visible={circleLayer?.value}
          points={circlePoints}
          color={circleColor}
          lineWidth={1.3}
          transparent
          opacity={opacityRef.current}
          depthWrite={false}
        />

        <mesh>
          <circleGeometry args={[FIXED_RADIUS, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>

      {labelTitle && (
        <CustomBillboard priority={-2} visible={labelLayer?.value}>
          <Text
            ref={labelRef}
            position={[0, FIXED_RADIUS + 1, 0]}
            fontWeight={isMoon ? 600 : 800}
            fontSize={4.5}
            letterSpacing={isMoon ? 0 : 0.2}
            color={labelColor}
            anchorX="left"
            anchorY="bottom"
            textAlign="left"
          >
            {isMoon ? labelTitle : labelTitle.toUpperCase()}
          </Text>
        </CustomBillboard>
      )}
    </group>
  );
}
