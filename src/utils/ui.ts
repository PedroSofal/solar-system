export function mapBodyToNavItem(body: BodyType): NavItem {
  return {
    id: body.id,
    label: body.name,
    type: body.bodyType,
    info: body.parent?.name,
  };
}

export function getNodeColor(id: string, bodyType: BodyTypeOptions) {
  if (bodyType === 'dwarf-planet') {
    return '#aaaaaa';
  }

  if (bodyType === 'comet') {
    return '#80c1ff';
  }

  const isMoon = bodyType === 'moon';

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
