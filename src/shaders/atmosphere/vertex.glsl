varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;
varying vec3 eyeVector;

void main() {
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);

  vNormal = normalize(normalMatrix * normal);
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  vViewPosition = (viewMatrix * vec4(vWorldPosition, 1.0)).xyz;
  eyeVector = normalize(mvPos.xyz);

  gl_Position = projectionMatrix * mvPos;
}