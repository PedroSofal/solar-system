import { useContext, useEffect, useState } from 'react';
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

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let isCurrentVisible = false;

    if (bodyType === 'asteroid' || bodyType === 'comet') {
      isCurrentVisible = areAllSimilarBodiesVisible || isSystemFocused;
    } else if (bodyType === 'moon') {
      isCurrentVisible = Boolean(
        areAllSimilarBodiesVisible ||
          isBodyFocused ||
          (isMajorMoon && isSystemFocused),
      );
    } else {
      isCurrentVisible = true;
    }

    if (isVisible !== isCurrentVisible) {
      setIsVisible(isCurrentVisible);
    }
  }, [
    containerRef.current,
    areAllSimilarBodiesVisible,
    isSystemFocused,
    isBodyFocused,
    isMajorMoon,
  ]);

  return isVisible;
}
