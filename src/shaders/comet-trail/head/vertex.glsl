varying vec3 vNormal;
varying vec3 eyeVector;

void main() {
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);

  vNormal = normalize(normalMatrix * normal);
  eyeVector = normalize(mvPos.xyz);

  gl_Position = projectionMatrix * mvPos;
}