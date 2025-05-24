varying vec3 vNormal;
varying vec3 eyeVector;

void main() {
  float opacity = 1.0;
  float powFactor = 15.0;
  float multiplier = 1.0;

  float dotP = abs(dot(vNormal, eyeVector));
  float factor = pow(dotP, powFactor) * multiplier;

  vec3 color = vec3(1.0, 0.8, 0.3);

  gl_FragColor = vec4(color, opacity) * factor;
  gl_FragColor = linearToOutputTexel(gl_FragColor);
}
