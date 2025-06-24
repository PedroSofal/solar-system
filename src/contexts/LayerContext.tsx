import React, { createContext, useState } from 'react';
import { DEFAULT_LAYER_CONFIG } from '../constants/layers';

const LayerContext = createContext<{
  layers: LayerOption[];
  setLayers: (obj: LayerOption[]) => void;
  getLayer: (
    parentId: LayerId,
    childId?: BodyTypeOptions,
  ) => LayerOption | undefined;
}>({
  layers: DEFAULT_LAYER_CONFIG,
  setLayers: () => {},
  getLayer: () => undefined,
});

export function LayerProvider({ children }: { children: React.ReactNode }) {
  const [layers, setLayers] = useState<LayerOption[]>(DEFAULT_LAYER_CONFIG);

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
