import Body from './Body';
import { useMemo, useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { Group, Mesh, TextureLoader } from 'three';
import vertexShader from '../shaders/sun/vertex.glsl';
import fragmentShader from '../shaders/sun/fragment.glsl';
import useStickySize from '../hooks/useStickySize';
import { AdditiveBlending } from 'three';
import { BackSide } from 'three';
import { toModelScale } from '../utils';
import { getBodyTiltQuaternionFromPole } from '../getQuaternionFromPole';
import { useMatch } from 'react-router-dom';

export default function Sun({ bodyData }: { bodyData: BodyType }) {
  const planetSystemMatch = useMatch('/corpos/:id');

  const sunRef = useRef<Group>(null);
  const sunshineRef = useRef<Mesh>(null);

  const { id, meanRadius, obliquity } = bodyData;

  const scaledMeanRadius = toModelScale(meanRadius);

  const tiltQuaternion = useMemo(() => {
    const ra = obliquity.ra as number;
    const dec = obliquity.dec as number;
    return getBodyTiltQuaternionFromPole(ra, dec);
  }, []);

  const texture = useLoader(TextureLoader, '/textures/sun/2k_sun.jpg');

  useStickySize(sunshineRef, sunRef, 3, 1);

  return (
    <group>
      <group quaternion={tiltQuaternion}>
        <Body
          bodyRef={sunRef}
          id={id}
          meanRadius={meanRadius}
          scaledEquaRadius={scaledMeanRadius}
          scaledPolarRadius={scaledMeanRadius}
          material={
            <meshStandardMaterial
              color={'yellow'}
              map={texture}
              emissiveIntensity={5}
              emissive="yellow"
              emissiveMap={texture}
            />
          }
          shine={
            <mesh ref={sunshineRef}>
              <sphereGeometry args={[scaledMeanRadius + 8, 64, 64]} />
              <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                blending={AdditiveBlending}
                side={BackSide}
                transparent
                depthWrite={false}
                depthTest={true}
              />
            </mesh>
          }
        />
      </group>
      <pointLight
        intensity={15000}
        color={'white'}
        name="sunLight"
        decay={1.1}
        visible={!planetSystemMatch}
      />
    </group>
  );
}
