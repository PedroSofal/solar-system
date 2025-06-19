import React, { createContext, useState } from 'react';

const layerOptions: LayerOption[] = [
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
    label: 'Luz ambiente',
    id: 'ambient-light',
    value: false,
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
];

const LayerContext = createContext<{
  layers: LayerOption[];
  setLayers: (obj: LayerOption[]) => void;
  getLayer: (
    parentId: LayerId,
    childId?: BodyTypeOptions,
  ) => LayerOption | undefined;
}>({
  layers: layerOptions,
  setLayers: () => {},
  getLayer: () => undefined,
});

export function LayerProvider({ children }: { children: React.ReactNode }) {
  const [layers, setLayers] = useState<LayerOption[]>(layerOptions);

  function getLayer(parentId: LayerId, childId?: BodyTypeOptions) {
    const parentLayer = layers.find((layer) => layer.id === parentId);

    if (!childId) return parentLayer;

    let resolvedChildId: ChildId;
    if (childId === 'asteroid' || childId === 'comet') {
      resolvedChildId = 'minor-body';
    } else {
      resolvedChildId = childId;
    }

    const subItem = parentLayer?.subItems?.find((item) => {
      return item.id === `${parentId}-${resolvedChildId}`;
    });

    return subItem;
  }

  return (
    <LayerContext.Provider
      value={{
        layers,
        setLayers,
        getLayer,
      }}
    >
      {children}
    </LayerContext.Provider>
  );
}

export default LayerContext;
