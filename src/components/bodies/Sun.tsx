import { Group, Mesh, AdditiveBlending, BackSide } from 'three';
import { useContext, useMemo, useRef } from 'react';
import { useMatch } from 'react-router-dom';

import vertexShader from '../../shaders/sun/vertex.glsl';
import fragmentShader from '../../shaders/sun/fragment.glsl';
import Body from './Body';
import useStickySize from '../../hooks/useStickySize';
import { getBodyTiltQuaternionFromPole } from '../../utils/astrophysics';
import { toModelScale } from '../../utils/scene';
import TextureContext from '../../contexts/TextureContext';

export default function Sun({ bodyData }: { bodyData: BodyType }) {
  const planetSystemMatch = useMatch('/corpos/:id');

  const sunRef = useRef<Group>(null);
  const sunshineRef = useRef<Mesh>(null);

  const { getTexture } = useContext(TextureContext);
  const texture = getTexture('sun');

  const { id, meanRadius, obliquity } = bodyData;

  const scaledMeanRadius = toModelScale(meanRadius);

  const tiltQuaternion = useMemo(() => {
    const ra = obliquity.ra as number;
    const dec = obliquity.dec as number;
    return getBodyTiltQuaternionFromPole(ra, dec);
  }, []);

  useStickySize(sunshineRef, sunRef, 3, 1);

  return (
    <group name="sun-group">
      <group quaternion={tiltQuaternion} name="obliquity">
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
            <mesh ref={sunshineRef} name="sunshine">
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
