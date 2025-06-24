import { colorConfig } from '../constants/ui';

export function mapBodyToNavItem(body: BodyType): NavItem {
  return {
    id: body.id,
    label: body.name,
    type: body.bodyType,
    info: body.parent?.name,
  };
}

export function getNodeColor(
  id: string,
  bodyType: BodyTypeOptions,
): string | undefined {
  if (
    bodyType === 'dwarf-planet' ||
    bodyType === 'comet' ||
    bodyType === 'asteroid'
  ) {
    return colorConfig[bodyType];
  }

  if (bodyType === 'moon') {
    const planet = id as PlanetId;
    return colorConfig.planet[planet]?.moons ?? '#ccc';
  }

  if (bodyType === 'planet') {
    const planet = id as PlanetId;
    return colorConfig.planet[planet]?.primary ?? '#ccc';
  }
}
