import { useThree, useFrame } from '@react-three/fiber';
import { CubeTextureLoader, Scene, PerspectiveCamera } from 'three';
import { useContext, useEffect, useRef } from 'react';
import TextureContext from '../contexts/TextureContext';

export default function Background() {
  const { gl, camera, size } = useThree();

  const bgScene = useRef(new Scene());
  const bgCamera = useRef(
    new PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    ),
  );

  const { getTexturePath } = useContext(TextureContext);

  useEffect(() => {
    const loader = new CubeTextureLoader();
    const cubeTexture = loader.load([
      getTexturePath('px'),
      getTexturePath('nx'),
      getTexturePath('py'),
      getTexturePath('ny'),
      getTexturePath('pz'),
      getTexturePath('nz'),
    ]);

    bgScene.current.background = cubeTexture;
  }, []);

  useEffect(() => {
    bgCamera.current.aspect = size.width / size.height;
    bgCamera.current.updateProjectionMatrix();
  }, [size]);

  useFrame(() => {
    // Sincroniza a rotação da bgCamera com a câmera principal
    bgCamera.current.quaternion.copy(camera.quaternion);

    // Renderiza o fundo primeiro
    gl.autoClear = false;
    gl.clear();
    gl.render(bgScene.current, bgCamera.current);
    gl.clearDepth();
  });

  return null;
}
