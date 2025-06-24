export const DEFAULT_LAYER_CONFIG: LayerOption[] = [
  {
    label: 'Rótulos',
    id: 'label',
    subItems: [
      {
        label: 'Planetas',
        id: 'label-planet',
        value: true,
      },
      {
        label: 'Satélites naturais',
        id: 'label-moon',
        value: true,
      },
      {
        label: 'Planetas-anões',
        id: 'label-dwarf-planet',
        value: true,
      },
      {
        label: 'Corpos menores',
        id: 'label-minor-body',
        value: true,
      },
    ],
  },
  {
    label: 'Hitboxes',
    id: 'hitbox',
    subItems: [
      {
        label: 'Planetas',
        id: 'hitbox-planet',
        value: true,
      },
      {
        label: 'Satélites naturais',
        id: 'hitbox-moon',
        value: true,
      },
      {
        label: 'Planetas-anões',
        id: 'hitbox-dwarf-planet',
        value: true,
      },
      {
        label: 'Corpos menores',
        id: 'hitbox-minor-body',
        value: true,
      },
    ],
  },
  {
    label: 'Órbitas',
    id: 'orbit',
    subItems: [
      {
        label: 'Planetas',
        id: 'orbit-planet',
        value: true,
      },
      {
        label: 'Satélites naturais',
        id: 'orbit-moon',
        value: true,
      },
      {
        label: 'Planetas-anões',
        id: 'orbit-dwarf-planet',
        value: false,
      },
      {
        label: 'Corpos menores',
        id: 'orbit-minor-body',
        value: false,
      },
    ],
  },
  {
    label: 'Todas as luas',
    id: 'all-moons',
    value: false,
  },
  {
    label: 'Todos os asteróides',
    id: 'all-asteroids',
    value: false,
  },
  {
    label: 'Todos os cometas',
    id: 'all-comets',
    value: false,
  },
  {
    label: 'Luz ambiente',
    id: 'ambient-light',
    value: false,
  },
];
