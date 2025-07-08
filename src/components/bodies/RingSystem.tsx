import {
  Color,
  MathUtils,
  Group,
  Points,
  ShaderMaterial,
  Vector3,
} from 'three';

import { useFrame } from '@react-three/fiber';
import { Detailed } from '@react-three/drei';
import React, { useContext, useEffect, useMemo, useRef } from 'react';

import vertexShader from '../../shaders/ring-system/vertex.glsl';
import fragmentShader from '../../shaders/ring-system/fragment.glsl';
import TimeContext from '../../contexts/TimeContext';
import LayerContext from '../../contexts/LayerContext';
import TextureContext from '../../contexts/TextureContext';
import useFallbackData from '../../hooks/useFallbackData';
import { getActiveLOD, toModelScale } from '../../utils/scene';
import { ringSystemConfig } from '../../constants/scene';

const { SPIN_SPEED, HEIGHT_MULTIPLIER, PARTICLE_BASE_SIZE } = ringSystemConfig;

function setHslValue(position: number, settings: HslValue) {
  if (typeof settings === 'object' && 'customRanges' in settings) {
    let hslValue = 0;
    for (const { from, expansion } of settings.customRanges) {
      hslValue += Math.exp(-Math.pow((position - from) / expansion, 2));
    }
    return MathUtils.clamp(hslValue, settings.min ?? 0, settings.max ?? 1);
  } else {
    return settings;
  }
}

function getValidRanges(gaps: GapZone[], inner: number, outer: number) {
  const extension = outer - inner;

  const normalizedGaps = gaps
    .map((gap) => {
      const start = toModelScale(gap.distance);
      const end = start + toModelScale(gap.width);
      const normalizedStart = (start - inner) / extension;
      const normalizedEnd = (end - inner) / extension;
      return [normalizedStart, normalizedEnd];
    })
    .sort((a, b) => a[0] - b[0]);

  const ranges: [number, number][] = [];
  let lastEnd = 0;

  for (const [start, end] of normalizedGaps) {
    if (start > lastEnd) {
      ranges.push([lastEnd, start]);
    }
    lastEnd = Math.max(lastEnd, end);
  }

  if (lastEnd < 1) {
    ranges.push([lastEnd, 1]);
  }

  return ranges;
}

function getRandomPositionInRanges(ranges: [number, number][]) {
  const lengths = ranges.map(([start, end]) => end - start);
  const totalLength = lengths.reduce((sum, len) => sum + len, 0);
  const r = Math.random() * totalLength;

  let acc = 0;
  for (let i = 0; i < ranges.length; i++) {
    if (r < acc + lengths[i]) {
      const [start, end] = ranges[i];
      const localR = r - acc;
      return start + (localR / lengths[i]) * (end - start);
    }
    acc += lengths[i];
  }

  // fallback (nunca deve acontecer)
  return Math.random();
}

export default function RingSystem({
  bodyRef,
  bodyData,
  isActive,
}: {
  bodyRef: React.RefObject<Group | null>;
  bodyData: BodyType;
  isActive: boolean;
}) {
  const { equaRadius } = useFallbackData(bodyData);
  const { ringSystem } = bodyData;
  const { density, innerEdge, outerEdge, majorGapZones, hsl } =
    ringSystem as RingSystem;

  const particlesRef = useRef<Points | null>(null);

  const { timeScale } = useContext(TimeContext);
  const { getLayer } = useContext(LayerContext);
  const { getTexture } = useContext(TextureContext);

  const ambientLight = getLayer('ambient-light') as LayerOption;
  const particleTexture = getTexture('ringParticle');

  const scaledEquaRadius = toModelScale(equaRadius as number);
  const scaledInnerEdge = toModelScale(innerEdge);
  const scaledOuterEdge = toModelScale(outerEdge);

  function generateParticles(numParticles: number) {
    const positions = [];
    const colors = [];

    const validRanges = getValidRanges(
      majorGapZones,
      scaledInnerEdge,
      scaledOuterEdge,
    );

    for (let i = 0; i < numParticles; i++) {
      const position = getRandomPositionInRanges(validRanges);

      const radius = MathUtils.lerp(scaledInnerEdge, scaledOuterEdge, position);
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * (scaledEquaRadius * HEIGHT_MULTIPLIER);
      const z = Math.sin(angle) * radius;

      positions.push(x, y, z);

      const h = setHslValue(position, hsl.h);
      const s = setHslValue(position, hsl.s);
      const l = setHslValue(position, hsl.l);

      const color = new Color().setHSL(h, s, l);
      colors.push(color.r, color.g, color.b);
    }

    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
    };
  }

  useEffect(() => {
    if (!bodyRef.current || !particlesRef.current) return;

    const activeParticles = getActiveLOD(particlesRef.current);
    const material = activeParticles.material as ShaderMaterial;

    material.uniforms.uAmbientLight.value = ambientLight.value;
  }, [ambientLight.value]);

  useFrame(() => {
    if (!bodyRef.current || !particlesRef.current || !isActive) return;

    const bodyPosition = new Vector3();
    bodyRef.current.getWorldPosition(bodyPosition);

    const activeParticles = getActiveLOD(particlesRef.current);
    const material = activeParticles.material as ShaderMaterial;

    material.uniforms.uBodyPosition.value.copy(bodyPosition);
    material.uniforms.uBodyPosition.value.needsUpdate = true;
    activeParticles.rotation.y += SPIN_SPEED * timeScale;
  });

  const uniforms = useMemo(
    () => ({
      uTexture: { value: particleTexture },
      uLightPosition: { value: new Vector3(0, 0, 0) },
      uBodyPosition: { value: new Vector3() },
      uBodyRadius: { value: scaledEquaRadius },
      uParticleSize: { value: scaledEquaRadius * PARTICLE_BASE_SIZE },
      uAmbientLight: { value: ambientLight.value },
    }),
    [],
  );

  const baseParticles =
    density === 'high'
      ? 1_000_000
      : density === 'medium'
        ? 500_000
        : density === 'low'
          ? 50_000
          : 5_000;

  const detailLevels = useMemo(
    () => [
      { particles: generateParticles(baseParticles), distance: 0 },
      { particles: generateParticles(baseParticles / 5), distance: 20 },
      { particles: generateParticles(baseParticles / 200), distance: 100 },
      { particles: generateParticles(0), distance: 500 },
    ],
    [],
  );
  // if (true) return null;
  return (
    <group ref={particlesRef}>
      <Detailed distances={detailLevels.map((level) => level.distance)}>
        {detailLevels.map(({ particles }, index) => (
          <points key={index} renderOrder={999}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[particles.positions, 3]}
              />
              <bufferAttribute
                attach="attributes-color"
                args={[particles.colors, 3]}
              />
            </bufferGeometry>
            <shaderMaterial
              attach="material"
              defines={{ USE_LOGDEPTHBUF: '' }}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={uniforms}
              transparent
              depthWrite={false}
              depthTest={true}
              vertexColors={true}
            />
          </points>
        ))}
      </Detailed>
    </group>
  );
}
