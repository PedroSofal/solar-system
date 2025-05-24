// Emissive
vec4 emissiveColor = texture2D(emissiveMap, vEmissiveMapUv);
totalEmissiveRadiance *= emissiveColor.rgb;

// Nuvens
float cloudsMapValue = texture2D(cloudTexture, vMapUv).r;
float cloudOpacity = 0.5;

diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0), cloudsMapValue * cloudOpacity);

// Fresnel
vec3 viewDir = normalize(vViewPosition);
vec3 fresnelColor = vec3(0.3, 0.6, 1.0);

float fresnelIntensity = 1.0 - max(dot(vNormal, viewDir), 0.0);
fresnelIntensity = pow(fresnelIntensity, 4.0);

diffuseColor.rgb += fresnelColor * fresnelIntensity;