import TimeControls from './TimeControls';
import NavBar from './NavBar';
import React, { useContext, useEffect, useState } from 'react';
import Layers from './Layers';
import { HomeIcon } from '@heroicons/react/24/outline';
import { Link, useMatch } from 'react-router-dom';
import CameraContext from '../../contexts/CameraContext';
import {
  GlobeAltIcon as GlobeAltIconOutline,
  Square3Stack3DIcon as Square3Stack3DIconOutline,
  TvIcon,
} from '@heroicons/react/24/outline';
import {
  GlobeAltIcon as GlobeAltIconSolid,
  Square3Stack3DIcon as Square3Stack3DIconSolid,
} from '@heroicons/react/24/solid';
import BodyInfo from './BodyInfo';
import Button from './Button';
import CheckboxButton from './CheckboxButton';

export default function Overlay() {
  const [selectedBody, setSelectedBody] = useState<string | null | undefined>();
  const [isOverlayHidden, setIsOverlayHidden] = useState(false);
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);
  const [isTimeControlsExpanded, setIsTimeControlsExpanded] =
    useState<boolean>(true);

  const match = useMatch('/corpos/:id');

  useEffect(() => {
    if (match && match.params.id) {
      setIsNavbarExpanded(true);
      setSelectedBody(match.params.id);
    } else {
      setSelectedBody(undefined);
    }
  }, [match]);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 3) {
        setIsOverlayHidden((prev) => !prev);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsOverlayHidden((prev) => !prev);
      }
    };

    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div
      className={`${isOverlayHidden ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100'} duration-300`}
    >
      {/* sombra esquerda */}
      <div
        className={`pointer-events-none absolute inset-0 z-10 w-[40rem] bg-linear-to-r from-black via-black/80 to-transparent duration-700 ${selectedBody && isNavbarExpanded ? '' : 'opacity-0'}`}
      />

      {/* sombra baixo */}
      <div
        className={`pointer-events-none absolute bottom-0 h-60 w-full bg-linear-to-t from-black via-black/70 to-transparent duration-300 ${isTimeControlsExpanded ? '' : 'opacity-0'}`}
      />

      <div className="pointer-events-none relative top-6 left-6 h-[calc(100vh-3rem)] w-[calc(100vw-3rem)]">
        <div className="pointer-events-auto">
          <TopLeftActions
            selectedBody={selectedBody}
            setSelectedBody={setSelectedBody}
            isNavbarExpanded={isNavbarExpanded}
            setIsNavbarExpanded={setIsNavbarExpanded}
            isOverlayHidden={isOverlayHidden}
          />
          <TopRightAction
            isOverlayHidden={isOverlayHidden}
            setIsOverlayHidden={setIsOverlayHidden}
          />
          <TimeControls
            isExpanded={isTimeControlsExpanded}
            setIsExpanded={setIsTimeControlsExpanded}
            isOverlayHidden={isOverlayHidden}
          />
        </div>
      </div>
    </div>
  );
}

function TopLeftActions({
  selectedBody,
  setSelectedBody,
  isNavbarExpanded,
  setIsNavbarExpanded,
  isOverlayHidden,
}: {
  selectedBody: string | null | undefined;
  setSelectedBody: React.Dispatch<
    React.SetStateAction<string | null | undefined>
  >;
  isNavbarExpanded: boolean;
  setIsNavbarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isOverlayHidden: boolean;
}) {
  const { setResetTrigger } = useContext(CameraContext);

  return (
    <div
      className={`${isOverlayHidden ? '-translate-x-[100%]' : ''} absolute z-10 duration-700`}
    >
      <nav className="flex items-start gap-2">
        <Link to={'/'}>
          <Button
            icon={<HomeIcon className="size-6" />}
            onClick={() => setResetTrigger(true)}
            className="secondary-btn-clr"
            title="Resetar visualização"
          />
        </Link>
        <CheckboxButton
          icon={
            isNavbarExpanded ? (
              <GlobeAltIconSolid className="size-6" />
            ) : (
              <GlobeAltIconOutline className="size-6" />
            )
          }
          checked={isNavbarExpanded}
          onChange={() => setIsNavbarExpanded(!isNavbarExpanded)}
          title={isNavbarExpanded ? 'Ocultar navegador' : 'Mostrar navegador'}
        />
      </nav>
      <aside className={`min-w-96 ${!isNavbarExpanded ? 'hidden' : ''}`}>
        <NavBar
          isExpanded={isNavbarExpanded}
          selectedBody={selectedBody}
          setSelectedBody={setSelectedBody}
        />
        {selectedBody && (
          <BodyInfo
            selectedBody={selectedBody}
            setSelectedBody={setSelectedBody}
          />
        )}
      </aside>
    </div>
  );
}

function TopRightAction({
  isOverlayHidden,
  setIsOverlayHidden,
}: {
  isOverlayHidden: boolean;
  setIsOverlayHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isLayersExpanded, setIsLayersExpanded] = useState(false);

  return (
    <div
      className={`${isOverlayHidden ? 'translate-x-[100%]' : ''} absolute right-0 z-10 duration-700`}
    >
      <div className="flex items-start justify-end gap-2">
        <Button
          icon={<TvIcon className="size-6" />}
          onClick={() => setIsOverlayHidden(true)}
          className="secondary-btn-clr"
          title="Ocultar interface (Shift + F)"
        />
        <CheckboxButton
          icon={
            isLayersExpanded ? (
              <Square3Stack3DIconSolid className="size-6" />
            ) : (
              <Square3Stack3DIconOutline className="size-6" />
            )
          }
          checked={isLayersExpanded}
          onChange={() => setIsLayersExpanded(!isLayersExpanded)}
          title={isLayersExpanded ? 'Ocultar camadas' : 'Mostrar camadas'}
        />
      </div>
      <Layers isExpanded={isLayersExpanded} />
    </div>
  );
}
