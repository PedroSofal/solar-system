attribute float size;
attribute float opacity;

varying float vOpacity;
varying vec3 vColor;

void main() {
  vOpacity = opacity;
  vColor = color;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  gl_PointSize = size * (1000.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}