import { useFrame } from '@react-three/fiber';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import vertexShader from '../shaders/saturn-rings/vertex.glsl';
import fragmentShader from '../shaders/saturn-rings/fragment.glsl';
import TimeContext from '../contexts/TimeContext';
import { Detailed } from '@react-three/drei';
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
import LayerContext from '../contexts/LayerContext';

export default function SaturnRings({
  bodyRef,
  saturnEquaRadius,
}: {
  bodyRef: React.RefObject<Group | null>;
  saturnEquaRadius: number;
}) {
  const particlesRef = useRef<Points | null>(null);

  const { getTexture } = useContext(TextureContext);
  const { timeScale } = useContext(TimeContext);
  const { getLayer } = useContext(LayerContext);

  const ambientLight = getLayer('ambient-light') as LayerOption;
  const particleTexture = getTexture('saturnRing');

  const innerRing = toModelScale(74500);
  const outerRing = toModelScale(140220);

  const gapZones = [
    { min: 0.08, max: 0.09 }, // Colombo Gap
    { min: 0.18, max: 0.2 }, // Maxwell Gap
    { min: 0.63, max: 0.66 }, // Huygens Gap
    { min: 0.69, max: 0.697 }, // Cassini Division
    { min: 0.9, max: 0.91 }, // Encke Gap
    { min: 0.94, max: 0.945 }, // Keeler Gap
    { min: 0.95, max: 0.99 }, // Roche Gap
  ];

  function generateParticles(numParticles: number) {
    const positions = [];
    const colors = [];

    for (let i = 0; i < numParticles; i++) {
      const normalizedDistance = Math.random();

      const inGap = gapZones.some(
        (gap) => normalizedDistance >= gap.min && normalizedDistance <= gap.max,
      );
      if (inGap) continue; // pula a partícula se ela estiver em um gap

      // Convertendo para a escala real do anel
      const radius = MathUtils.lerp(innerRing, outerRing, normalizedDistance);
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 0.001;
      const z = Math.sin(angle) * radius;

      positions.push(x, y, z);

      let brightness =
        Math.exp(-Math.pow((normalizedDistance - 0.3) / 0.12, 2)) +
        Math.exp(-Math.pow((normalizedDistance - 0.7) / 0.07, 2)) +
        Math.exp(-Math.pow((normalizedDistance - 1) / 0.12, 2));

      brightness = MathUtils.clamp(brightness, 0.1, 0.5);

      let saturation =
        Math.exp(-Math.pow((normalizedDistance - 0.3) / 0.25, 2)) +
        Math.exp(-Math.pow((normalizedDistance - 1) / 0.25, 2));

      saturation = MathUtils.clamp(saturation, 0.2, 0.4);

      const color = new Color().setHSL(0.09, saturation, brightness);
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
      uSaturnPosition: { value: new Vector3() },
      uSaturnRadius: { value: toModelScale(saturnEquaRadius) },
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

    material.uniforms.uSaturnPosition.value.copy(bodyPosition);
    material.uniforms.uSaturnPosition.value.needsUpdate = true;
    activeParticles.rotation.y += 0.00005 * timeScale;
  });

  const detailLevels = useMemo(
    () => [
      { particles: generateParticles(1_000_000), distance: 0 },
      { particles: generateParticles(200_000), distance: 10 },
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
