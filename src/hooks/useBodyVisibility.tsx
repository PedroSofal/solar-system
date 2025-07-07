import { useContext, useEffect } from 'react';
import LayerContext from '../contexts/LayerContext';
import { Group } from 'three';

export default function useBodyVisibility(
  containerRef: React.RefObject<Group | null>,
  bodyType: BodyTypeOptions,
  isSystemFocused: boolean,
  isBodyFocused?: boolean,
  isMajorMoon?: boolean,
) {
  const { getLayer } = useContext(LayerContext);
  const layerAccess = `all-${bodyType}s` as LayerId;
  const areAllSimilarBodiesVisible = getLayer(layerAccess)?.value;

  useEffect(() => {
    let isVisible;

    if (bodyType === 'asteroid' || bodyType === 'comet') {
      isVisible = areAllSimilarBodiesVisible || isSystemFocused;
    } else if (bodyType === 'moon') {
      isVisible =
        areAllSimilarBodiesVisible ||
        isBodyFocused ||
        (isMajorMoon && isSystemFocused);
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
    isSystemFocused,
    isBodyFocused,
    isMajorMoon,
  ]);

  return null;
}
