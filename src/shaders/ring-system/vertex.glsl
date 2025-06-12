varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vColor;

#include <common>
#include <logdepthbuf_pars_vertex>

void main() {
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  vNormal = normalize(position);  
  vColor = color;

  gl_PointSize = 1.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  #include <logdepthbuf_vertex>
}