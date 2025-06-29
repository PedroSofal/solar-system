varying vec3 vNormal;
varying vec3 eyeVector;

uniform vec3 uColor;
uniform float uOpacity;

void main() {
  float opacity = min(0.4, uOpacity);
  float powFactor = 4.0;
  float multiplier = 0.8;

  vec3 N = normalize(vNormal);
  vec3 V = normalize(eyeVector);

  float dotP = abs(dot(N, V));
  float factor = pow(dotP, powFactor) * multiplier;

  gl_FragColor = vec4(uColor * factor, opacity * factor);
}
