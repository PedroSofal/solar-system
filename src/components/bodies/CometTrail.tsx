import {
  Vector3,
  Color,
  Group,
  AdditiveBlending,
  Points,
  Mesh,
  ShaderMaterial,
} from 'three';
import { useRef, useMemo, useContext } from 'react';

import headVertexShader from '../../shaders/comet-trail/head/vertex.glsl';
import headFragmentShader from '../../shaders/comet-trail/head/fragment.glsl';
import tailVertexShader from '../../shaders/comet-trail/tail/vertex.glsl';
import tailFragmentShader from '../../shaders/comet-trail/tail/fragment.glsl';
import TextureContext from '../../contexts/TextureContext';
import { toModelScale } from '../../utils/scene';
import { useFrame } from '@react-three/fiber';
import { cometTrailConfig } from '../../constants/scene';

const CENTER = new Vector3(0, 0, 0);
const {
  MAX_PARTICLES,
  PARTICLE_LIFE,
  MAX_EMISSION_DISTANCE,
  MIN_EMISSION_DISTANCE,
  MIN_SPEED,
  MAX_ALPHA,
  DISPERSION_AMOUNT,
  GROW_FACTOR,
  GROW_FACTOR_DISPERSED,
  COMA_SCALE,
  PARTICLE_SCALE,
} = cometTrailConfig;

function getTrailColor(id: string) {
  let hexColor = '#ccc';
  switch (id) {
    case 'halley':
      hexColor = '#577483';
      break;
    case 'halebopp':
      hexColor = '#7e6e56';
      break;
    case 'neowise':
      hexColor = '#9b725e';
      break;
    case 'hyakutake':
      hexColor = '#4e6881';
      break;
  }
  return new Color(hexColor);
}

function getCometTrailIntensity(cometBodyWorldPosition: Vector3) {
  const distanceToSun = cometBodyWorldPosition.distanceTo(CENTER);
  // Aumenta a intensidade quanto mais próximo do Sol
  let intensity = 0;
  if (distanceToSun < MIN_EMISSION_DISTANCE) {
    // A taxa vai de 0 a 1 à medida que a distância diminui de MIN_EMISSION_DISTANCE para MIN_EMISSION_DISTANCE
    intensity =
      1 -
      (distanceToSun - MAX_EMISSION_DISTANCE) /
        (MIN_EMISSION_DISTANCE - MAX_EMISSION_DISTANCE);
    // Garante que a intensidade esteja no intervalo [0, 1]
    intensity = Math.max(0, Math.min(1, intensity));
  }
  return intensity;
}

function createParticlesPool(
  maxParticles: number,
  particleLife: number,
  size: number,
  color: Color,
) {
  const pArray: Particle[] = [];
  for (let i = 0; i < maxParticles; i++) {
    pArray.push({
      position: new Vector3(),
      velocity: new Vector3(),
      size: size,
      age: 0,
      _maxAge: particleLife,
      color: color.clone(),
      isActive: false,
    });
  }
  return pArray;
}

export default function CometTrail({
  bodyRef,
  bodyData,
  isActive,
}: {
  bodyRef: React.RefObject<Group | null>;
  bodyData: BodyType;
  isActive: boolean;
}) {
  const { id, meanRadius } = bodyData;

  const scaledMeanRadius = toModelScale(meanRadius);
  const trailColor = getTrailColor(id);

  return (
    <group name="comet-trail">
      <Head
        isActive={isActive}
        bodyRef={bodyRef}
        color={trailColor}
        scaledMeanRadius={scaledMeanRadius}
      />
      <Tail
        isActive={isActive}
        bodyRef={bodyRef}
        color={trailColor}
        scaledMeanRadius={scaledMeanRadius}
      />
      <Tail
        isActive={isActive}
        bodyRef={bodyRef}
        color={trailColor}
        scaledMeanRadius={scaledMeanRadius}
        disperse
      />
    </group>
  );
}

function Head({
  isActive,
  bodyRef,
  color,
  scaledMeanRadius,
}: {
  isActive: boolean;
  bodyRef: React.RefObject<Group | null>;
  color: Color;
  scaledMeanRadius: number;
}) {
  const headRef = useRef<Mesh | null>(null);

  useFrame(() => {
    if (!bodyRef.current || !headRef.current || !isActive) return;
    const bodyPosition = new Vector3();
    bodyRef.current.getWorldPosition(bodyPosition);
    const opacity = getCometTrailIntensity(bodyPosition);

    const material = headRef.current.material as ShaderMaterial;
    material.uniforms.uOpacity.value = opacity;
    headRef.current.visible = opacity > 0;
  });

  const uniforms = useMemo(
    () => ({
      uColor: { value: color },
      uOpacity: { value: 0 },
    }),
    [color],
  );

  return (
    <mesh ref={headRef} renderOrder={999} name="coma">
      <sphereGeometry args={[scaledMeanRadius * COMA_SCALE, 64, 64]} />
      <shaderMaterial
        vertexShader={headVertexShader}
        fragmentShader={headFragmentShader}
        uniforms={uniforms}
        blending={AdditiveBlending}
        side={2}
        transparent
        depthWrite={false}
        depthTest={true}
      />
    </mesh>
  );
}

function Tail({
  isActive,
  bodyRef,
  color,
  scaledMeanRadius,
  disperse,
}: {
  isActive: boolean;
  bodyRef: React.RefObject<Group | null>;
  color: Color;
  scaledMeanRadius: number;
  disperse?: boolean;
}) {
  const tailRef = useRef<Points | null>(null);
  const nextParticleIndex = useRef(0);

  const { getTexture } = useContext(TextureContext);
  const particleTexture = getTexture('cometTrail');

  const baseSize = scaledMeanRadius * PARTICLE_SCALE;

  const positions = useMemo(() => new Float32Array(MAX_PARTICLES * 3), []);
  const colors = useMemo(() => new Float32Array(MAX_PARTICLES * 3), []);
  const opacity = useMemo(() => new Float32Array(MAX_PARTICLES), []);
  const size = useMemo(() => new Float32Array(MAX_PARTICLES), []);

  const particlesPool = useMemo(
    () => createParticlesPool(MAX_PARTICLES, PARTICLE_LIFE, baseSize, color),
    [],
  );

  const bodyPosition = new Vector3();
  const tailDirection = new Vector3();
  const randomDirection = new Vector3();
  const dispersedVelocity = new Vector3();

  useFrame(() => {
    if (!bodyRef.current || !tailRef.current || !isActive) return;

    bodyRef.current.getWorldPosition(bodyPosition);
    const emissionRate = getCometTrailIntensity(bodyPosition);
    const inRange = emissionRate > 0;
    tailRef.current.visible = inRange;

    if (!inRange) tailRef.current.count = 0;

    // Adiciona novas partículas com base na probabilidade calculada
    if (Math.random() < emissionRate) {
      const p = particlesPool[nextParticleIndex.current];

      if (!p.isActive) {
        // A direção da cauda é um vetor Sol -> Cometa
        tailDirection.subVectors(bodyPosition, CENTER).normalize();

        randomDirection
          .set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
          )
          .normalize();

        // Adiciona desvios aleatórios à direção da cauda
        dispersedVelocity
          .copy(tailDirection)
          .add(randomDirection.multiplyScalar(disperse ? DISPERSION_AMOUNT : 0))
          .normalize()
          .multiplyScalar(Math.max(Math.random() * 0.1, MIN_SPEED));

        p.position.copy(CENTER);
        p.velocity.copy(dispersedVelocity);
        p.age = 0;
        p.isActive = true;

        nextParticleIndex.current =
          (nextParticleIndex.current + 1) % particlesPool.length;
      }
    }

    // Atualiza partículas
    let activeCount = 0;
    for (let i = 0; i < particlesPool.length; i++) {
      const p = particlesPool[i];

      if (p.isActive) {
        p.position.add(p.velocity);
        p.age++;

        // Reduz a opacidade ao longo da vida da partícula
        const ratio = p.age / p._maxAge;
        const alpha = disperse
          ? Math.min(MAX_ALPHA, (1.0 - ratio) * (1.0 - ratio) * (1.0 - ratio))
          : Math.min(MAX_ALPHA, (1.0 - ratio) * (0.8 - ratio) * (0.8 - ratio));
        p.color.clone().multiplyScalar(alpha);

        // Aumenta o tamanho da partícula com a distância percorrida
        const distanceTraveled = p.position.distanceTo(CENTER);
        const scaledSize =
          p.size +
          distanceTraveled * (disperse ? GROW_FACTOR_DISPERSED : GROW_FACTOR);

        // Desativa a partícula se ela atingiu o fim da vida
        if (p.age >= p._maxAge) {
          p.isActive = false;
        }

        positions[i * 3] = p.isActive ? p.position.x : 0;
        positions[i * 3 + 1] = p.isActive ? p.position.y : 0;
        positions[i * 3 + 2] = p.isActive ? p.position.z : 0;
        colors[i * 3] = p.isActive ? p.color.r : 0;
        colors[i * 3 + 1] = p.isActive ? p.color.g : 0;
        colors[i * 3 + 2] = p.isActive ? p.color.b : 0;
        size[i] = p.isActive ? scaledSize : 0;
        opacity[i] = p.isActive ? alpha : 1;

        activeCount++;
      }
    }

    const sizeAttr = tailRef.current.geometry.getAttribute('size');
    const opacityAttr = tailRef.current.geometry.getAttribute('opacity');

    tailRef.current.geometry.attributes.position.needsUpdate = true;
    tailRef.current.geometry.attributes.color.needsUpdate = true;
    if (sizeAttr) sizeAttr.needsUpdate = true;
    if (opacityAttr) opacityAttr.needsUpdate = true;

    tailRef.current.count = activeCount;
  });

  return (
    <points ref={tailRef} renderOrder={999} name="tail">
      <bufferGeometry attach="geometry">
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-opacity" args={[opacity, 1]} />
        <bufferAttribute attach="attributes-size" args={[size, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={tailVertexShader}
        fragmentShader={tailFragmentShader}
        uniforms={{ uTexture: { value: particleTexture } }}
        depthWrite={false}
        depthTest={true}
        vertexColors={true}
        transparent={true}
        blending={AdditiveBlending}
      />
    </points>
  );
}
