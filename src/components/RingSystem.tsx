import { useFrame } from '@react-three/fiber';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import vertexShader from '../shaders/ring-system/vertex.glsl';
import fragmentShader from '../shaders/ring-system/fragment.glsl';
import { Detailed } from '@react-three/drei';
import TimeContext from '../contexts/TimeContext';
import LayerContext from '../contexts/LayerContext';
import TextureContext from '../contexts/TextureContext';
import { getActiveLOD, toModelScale } from '../utils';
import {
  Color,
  MathUtils,
  Group,
  Points,
  ShaderMaterial,
  Vector3,
} from 'three';

function setHslValue(position: number, settings: HslValue) {
  if (typeof settings === 'object' && 'customRanges' in settings) {
    let hslValue = 0;
    for (const { from, value } of settings.customRanges) {
      hslValue += Math.exp(-Math.pow((position - from) / value, 2));
    }
    return MathUtils.clamp(hslValue, settings.min ?? 0, settings.max ?? 1);
  } else {
    return settings;
  }
}

export default function RingSystem({
  bodyRef,
  bodyData,
}: {
  bodyRef: React.RefObject<Group | null>;
  bodyData: BodyType;
}) {
  const { equaRadius, ringSystem } = bodyData;
  const { innerEdge, outerEdge, majorGapZones, hsl } = ringSystem as RingSystem;

  const particlesRef = useRef<Points | null>(null);

  const { timeScale } = useContext(TimeContext);
  const { getLayer } = useContext(LayerContext);
  const { getTexture } = useContext(TextureContext);

  const ambientLight = getLayer('ambient-light') as LayerOption;
  const particleTexture = getTexture('rocks');

  const scaledEquaRadius = toModelScale(equaRadius as number);
  const scaledInnerEdge = toModelScale(innerEdge);
  const scaledOuterEdge = toModelScale(outerEdge);

  function generateParticles(numParticles: number) {
    const positions = [];
    const colors = [];

    for (let i = 0; i < numParticles; i++) {
      const position = Math.random();

      const inGap = majorGapZones.some((gap) => {
        const extension = scaledOuterEdge - scaledInnerEdge;
        const start = toModelScale(gap.distance);
        const end = start + toModelScale(gap.width);
        const normalizedStart = (start - scaledInnerEdge) / extension;
        const normalizedEnd = (end - scaledInnerEdge) / extension;

        return (
          position >= normalizedStart - 0.005 &&
          position <= normalizedEnd + 0.005
        );
      });
      if (inGap) continue; // pula a partícula se ela estiver em um gap

      // Convertendo para a escala real do anel
      const radius = MathUtils.lerp(scaledInnerEdge, scaledOuterEdge, position);

      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 0.001;
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

  const uniforms = useMemo(
    () => ({
      uTexture: { value: particleTexture },
      uLightPosition: { value: new Vector3(0, 0, 0) },
      uBodyPosition: { value: new Vector3() },
      uBodyRadius: { value: scaledEquaRadius },
      uAmbientLight: { value: ambientLight.value },
    }),
    [],
  );

  useEffect(() => {
    if (!bodyRef.current || !particlesRef.current) return;

    const activeParticles = getActiveLOD(particlesRef.current);
    const material = activeParticles.material as ShaderMaterial;

    material.uniforms.uAmbientLight.value = ambientLight.value;
  }, [ambientLight.value]);

  useFrame(() => {
    if (!bodyRef.current || !particlesRef.current) return;

    const bodyPosition = new Vector3();
    bodyRef.current.getWorldPosition(bodyPosition);

    const activeParticles = getActiveLOD(particlesRef.current);
    const material = activeParticles.material as ShaderMaterial;

    material.uniforms.uBodyPosition.value.copy(bodyPosition);
    material.uniforms.uBodyPosition.value.needsUpdate = true;
    activeParticles.rotation.y += 0.00005 * timeScale;
  });

  const detailLevels = useMemo(
    () => [
      { particles: generateParticles(1_000_000), distance: 0 },
      { particles: generateParticles(200_000), distance: 20 },
      { particles: generateParticles(5_000), distance: 100 },
      { particles: generateParticles(100), distance: 500 },
    ],
    [],
  );

  return (
    <group ref={particlesRef}>
      <Detailed distances={detailLevels.map((level) => level.distance)}>
        {detailLevels.map(({ particles }, index) => (
          <points key={index} renderOrder={999}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                array={particles.positions}
                itemSize={3}
                count={particles.positions.length / 3}
                args={[particles.positions, 3]}
              />
              <bufferAttribute
                attach="attributes-color"
                array={particles.colors}
                itemSize={3}
                count={particles.colors.length / 3}
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
