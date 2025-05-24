varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 eyeVector;

uniform float opacity;
uniform float powFactor;
uniform float multiplier;
uniform vec3 color;

void main() {
  vec3 lightPosWorld = vec3(0.0, 0.0, 1.0);

  vec3 lightPosCam = (viewMatrix * vec4(lightPosWorld, 1.0)).xyz;
  vec3 lightDir = normalize(lightPosCam - vViewPosition);
  float lightFactor = dot(vNormal, lightDir);

  float dotP = abs(dot(vNormal, eyeVector));
  float factor = pow(dotP, powFactor) * multiplier;

  vec3 glowColor = mix(vec3(0.0, 0.0, 0.0), color, lightFactor);
  glowColor *= max(factor, 0.0);

  gl_FragColor = vec4(glowColor, opacity);
  gl_FragColor = linearToOutputTexel(gl_FragColor);
}