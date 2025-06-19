import { useContext, useEffect } from 'react';
import LayerContext from '../contexts/LayerContext';
import { Group } from 'three';

export default function useBodyVisibility(
  containerRef: React.RefObject<Group | null>,
  bodyType: BodyTypeOptions,
  isFocused: boolean,
  isMajorMoon?: boolean,
) {
  const { getLayer } = useContext(LayerContext);
  const layerAccess = `all-${bodyType}s` as LayerId;
  const areAllSimilarBodiesVisible = getLayer(layerAccess)?.value;

  useEffect(() => {
    let isVisible;

    if (
      bodyType === 'asteroid' ||
      bodyType === 'comet' ||
      bodyType === 'moon'
    ) {
      isVisible = areAllSimilarBodiesVisible || isFocused || isMajorMoon;
    } else {
      isVisible = true;
    }

    if (containerRef.current) {
      containerRef.current.visible = !!isVisible;
      containerRef.current.traverse((obj) => {
        if (obj.name === 'hitbox') obj.visible = !!isVisible;
      });
    }
  }, [
    containerRef.current,
    areAllSimilarBodiesVisible,
    isFocused,
    isMajorMoon,
  ]);

  return null;
}
