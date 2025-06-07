import { Group, LOD, Mesh, Object3D } from 'three';

export function toModelScale(number: number) {
  return number / 200_000;
}

export function formatBodyType(bodyType: BodyTypeOptions) {
  switch (bodyType) {
    case 'Planeta':
      return 'planet';
    case 'Satélite Natural':
      return 'moon';
    case 'Planeta-anão':
      return 'dwarfPlanet';
    default:
      return 'planet';
  }
}

export function mapBodyToNavItem(body: BodyType): NavItem {
  return {
    id: body.id,
    label: body.name,
    type: body.bodyType,
    info: body.parent?.name,
  };
}

export function getActiveLOD<T extends Object3D>(target: T): T {
  if (target.children.length > 0) {
    const isLOD = target.children[0] instanceof LOD;

    if (isLOD) {
      const lod = target.children[0] as LOD;
      const activeLevel = lod.getCurrentLevel();
      return lod.children[activeLevel] as T;
    }
  }

  if (target.parent) {
    const isLOD = target.parent instanceof LOD;

    if (isLOD) {
      const lod = target.parent as LOD;
      const activeLevel = lod.getCurrentLevel();
      return lod.children[activeLevel] as T;
    }
  }

  return target;
}

export function getBodyMeshFromGroup(body: Group): Mesh {
  let mesh: Mesh | null = null;

  body.traverse((child: Object3D) => {
    if (mesh) return;

    if (child instanceof Mesh) {
      if (child.parent instanceof LOD) {
        mesh = getActiveLOD(child);
      } else {
        mesh = child;
      }
    }
  });

  if (!mesh) {
    throw new Error('Nenhum mesh encontrado em ' + body.name);
  }

  return mesh;
}

export function getNodeColor(id: string, isMoon = false) {
  switch (id) {
    case 'mercury':
      return '#b970f5';
    case 'venus':
      return '#e2b156';
    case 'earth':
      return isMoon ? '#5c736a' : '#34d399';
    case 'mars':
      return isMoon ? '#735d5c' : '#a2514b';
    case 'jupiter':
      return isMoon ? '#73615c' : '#c77a63';
    case 'saturn':
      return isMoon ? '#73695c' : '#e4a95c';
    case 'uranus':
      return isMoon ? '#5c7372' : '#62c2bd';
    case 'neptune':
      return isMoon ? '#5c6473' : '#4976ca';
    default:
      return isMoon ? '#454a4e' : '#454a4e';
  }
}

export function getHitboxCullingPoints(
  bodyData: BodyType,
  declustered: boolean,
): CullingPoints {
  const { id, bodyType, meanRadius } = bodyData;
  const radius = toModelScale(meanRadius);

  switch (bodyType) {
    case 'Planeta':
      return {
        farStart: declustered ? 60000 : undefined,
        farEnd: declustered ? 15000 : undefined,
        nearStart: radius * 300,
        nearEnd: radius * 200,
      };
    case 'Satélite Natural':
      return {
        farStart: declustered ? 30 : 1000,
        farEnd: declustered ? 0.5 : 60,
        nearStart: radius * 100,
        nearEnd: radius * 50,
      };
    case 'Planeta-anão':
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
    case 'Planeta':
      return {
        nearStart: radius * 150,
        nearEnd: radius * 100,
      };
    case 'Satélite Natural':
      return {
        farStart: declustered ? 30 : 500,
        farEnd: declustered ? 0.5 : 10,
        nearStart: radius * 100,
        nearEnd: radius * 50,
      };
    case 'Planeta-anão':
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

export function fromJulianDate(date: number) {
  return (date - 2440587.5) * 86400000;
}

export function toJulianDate(date: number) {
  return date / 86400000 + 2440587.5;
}
