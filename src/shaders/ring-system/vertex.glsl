varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vColor;

uniform float uParticleSize;

#include <common>
#include <logdepthbuf_pars_vertex>

void main() {
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  vNormal = normalize(position);  
  vColor = color;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uParticleSize * (1000.0 / -mvPosition.z);
  // gl_PointSize = 1.0;
  gl_Position = projectionMatrix * mvPosition;

  #include <logdepthbuf_vertex>
}