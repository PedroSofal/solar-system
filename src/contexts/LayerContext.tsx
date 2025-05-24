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
        id: 'label-dwarfPlanet',
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
        id: 'hitbox-dwarfPlanet',
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
        id: 'orbit-dwarfPlanet',
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
];

const LayerContext = createContext<{
  layers: LayerOption[];
  setLayers: (obj: LayerOption[]) => void;
  getLayer: (parentId: LayerId, childId?: string) => LayerOption | undefined;
}>({
  layers: layerOptions,
  setLayers: () => {},
  getLayer: () => undefined,
});

export function LayerProvider({ children }: { children: React.ReactNode }) {
  const [layers, setLayers] = useState<LayerOption[]>(layerOptions);

  function getLayer(parentId: LayerId, childId?: string) {
    const parentLayer = layers.find((layer) => layer.id === parentId);
    if (!childId) return parentLayer;

    const subItem = parentLayer?.subItems?.find((item) => {
      return item.id === `${parentId}-${childId}`;
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
