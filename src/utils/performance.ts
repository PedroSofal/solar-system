import { toModelScale } from './scene';

export function getHitboxCullingPoints(
  bodyData: BodyType,
  declustered: boolean,
): CullingPoints {
  const { id, bodyType, meanRadius } = bodyData;
  const radius = toModelScale(meanRadius);

  switch (bodyType) {
    case 'planet':
      return {
        farStart: declustered ? 60000 : undefined,
        farEnd: declustered ? 15000 : undefined,
        nearStart: radius * 300,
        nearEnd: radius * 200,
      };
    case 'moon':
      return {
        farStart: declustered ? 30 : 1000,
        farEnd: declustered ? 0.5 : 60,
        nearStart: Math.max(radius * 150, 0.01),
        nearEnd: Math.max(radius * 100, 0.005),
      };
    case 'dwarf-planet':
      return {
        farStart: id === 'ceres' ? 30000 : 150000,
        farEnd: id === 'ceres' ? 10000 : 50000,
        nearStart: radius * 200,
        nearEnd: radius * 150,
      };
    default:
      return {};
  }
}

export function getOrbitCullingPoints(
  bodyData: BodyType,
  declustered: boolean,
): CullingPoints {
  const { id, bodyType, meanRadius } = bodyData;
  const radius = toModelScale(meanRadius);

  switch (bodyType) {
    case 'planet':
      return {
        nearStart: radius * 150,
        nearEnd: radius * 100,
      };
    case 'moon':
      return {
        farStart: declustered ? 30 : 500,
        farEnd: declustered ? 0.5 : 10,
        nearStart: Math.max(radius * 100, 0.1),
        nearEnd: Math.max(radius * 50, 0.05),
      };
    case 'dwarf-planet':
      return {
        farStart: id === 'ceres' ? 30000 : 150000,
        farEnd: id === 'ceres' ? 10000 : 50000,
        nearStart: radius * 5000,
        nearEnd: radius * 3000,
      };
    default:
      return {};
  }
}
