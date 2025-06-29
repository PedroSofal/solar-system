uniform sampler2D uTexture;

varying float vOpacity;
varying vec3 vColor;

void main() {
  vec4 textureColor = texture2D(uTexture, gl_PointCoord);

  gl_FragColor = textureColor * vec4(vColor, vOpacity);
}