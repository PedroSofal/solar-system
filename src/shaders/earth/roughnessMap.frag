float roughnessFactor = roughness;

vec4 texelRoughness = texture2D(roughnessMap, vRoughnessMapUv);
// inverter o mapa para selecionar só os continentes
texelRoughness = vec4(1.0) - texelRoughness;

// usando o canal G, compatível textura do tipo OcclusionRoughnessMetallic
roughnessFactor *= clamp(texelRoughness.g, 0.5, 1.0);