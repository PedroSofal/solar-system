import { AdditiveBlending, BackSide, Color } from 'three';
import vertexShader from '../../shaders/atmosphere/vertex.glsl';
import fragmentShader from '../../shaders/atmosphere/fragment.glsl';

export default function Atmosphere({
  bodyRadius,
  length,
  opacity,
  powFactor,
  multiplier,
  color,
}: {
  bodyRadius: number;
  length: number;
  opacity: number;
  powFactor: number;
  multiplier: number;
  color: Color;
}) {
  return (
    <mesh renderOrder={-1}>
      <sphereGeometry args={[bodyRadius + length, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        blending={AdditiveBlending}
        side={BackSide}
        depthTest={true}
        depthWrite={false}
        uniforms={{
          opacity: { value: opacity },
          powFactor: { value: powFactor },
          multiplier: { value: multiplier },
          color: { value: color },
        }}
      />
    </mesh>
  );
}
