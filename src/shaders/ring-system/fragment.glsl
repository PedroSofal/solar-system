varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vColor;

uniform sampler2D uTexture;
uniform vec3 uLightPosition;
uniform vec3 uBodyPosition;
uniform float uBodyRadius;
uniform bool uAmbientLight;

#include <logdepthbuf_pars_fragment>

// Calcula se o raio do Sol até a partícula colide com o corpo primário
float computeShadow(vec3 particlePos, vec3 lightPos) {
  vec3 rayDir = normalize(particlePos - lightPos); // Direção do raio
  vec3 oc = particlePos - uBodyPosition; // Vetor da partícula até o corpo primário

  float b = dot(oc, rayDir);
  float c = dot(oc, oc) - (uBodyRadius * uBodyRadius);
  float h = b * b - c;

  if (h > 0.0 && b > 0.0) {
    // O raio colidiu com o corpo primário → Partícula na sombra
    return uAmbientLight ? 0.06 : 0.0;
  }
  
  return 0.2; // Sem colisão → Iluminação normal
}

void main() {
  #include <logdepthbuf_fragment>
  // Direção da luz
  vec3 lightDir = normalize(uLightPosition - vWorldPosition);
  
  // Calcula o fator de sombra
  float shadowFactor = computeShadow(vWorldPosition, uLightPosition);

  vec4 color = texture2D(uTexture, gl_PointCoord);
  gl_FragColor = vec4(color.rgb * vColor * shadowFactor, color.a);
  gl_FragColor = linearToOutputTexel(gl_FragColor);
}