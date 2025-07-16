import TimeControls from './TimeControls';
import NavBar from './NavBar';
import { useState } from 'react';
import Layers from './Layers';
import Settings from './Settings';
import { Link } from 'react-router-dom';
import {
  GlobeAltIcon as GlobeAltIconOutline,
  Square3Stack3DIcon as Square3Stack3DIconOutline,
  Cog8ToothIcon as CogIconOutline,
  TvIcon,
  HomeIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import {
  GlobeAltIcon as GlobeAltIconSolid,
  Square3Stack3DIcon as Square3Stack3DIconSolid,
  Cog8ToothIcon as CogIconSolid,
} from '@heroicons/react/24/solid';
import Button from './Button';
import CheckboxButton from './CheckboxButton';
import LogoNav from './LogoNav';

export default function DesktopUI({
  isOverlayHidden,
  setIsOverlayHidden,
}: {
  isOverlayHidden: boolean;
  setIsOverlayHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isTopLeftExpanded, setIsTopLeftExpanded] = useState(false);
  const [isBottomExpanded, setIsBottomExpanded] = useState<boolean>(true);

  return (
    <div
      className={`hidden sm:block ${isOverlayHidden ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100'} duration-300`}
    >
      {/* sombra esquerda */}
      <div
        className={`pointer-events-none absolute inset-0 z-10 w-[40rem] bg-linear-to-r from-black via-black/80 to-transparent duration-700 ${isTopLeftExpanded ? '' : 'opacity-0'}`}
      />

      {/* sombra baixo */}
      <div
        className={`pointer-events-none absolute bottom-0 h-60 w-full bg-linear-to-t from-black via-black/70 to-transparent duration-300 ${isBottomExpanded ? '' : 'opacity-0'}`}
      />

      <div className="pointer-events-none relative top-6 left-6 h-[calc(100vh-3rem)] w-[calc(100vw-3rem)]">
        <div className="pointer-events-auto">
          <LogoNav isOverlayHidden={isOverlayHidden} />
          <TopLeftActions
            isOverlayHidden={isOverlayHidden}
            isTopLeftExpanded={isTopLeftExpanded}
            setIsTopLeftExpanded={setIsTopLeftExpanded}
          />
          <TopRightActions
            isOverlayHidden={isOverlayHidden}
            setIsOverlayHidden={setIsOverlayHidden}
          />
          <BottomActions
            isOverlayHidden={isOverlayHidden}
            isBottomExpanded={isBottomExpanded}
            setIsBottomExpanded={setIsBottomExpanded}
          />
        </div>
      </div>
    </div>
  );
}

function TopLeftActions({
  isOverlayHidden,
  isTopLeftExpanded,
  setIsTopLeftExpanded,
}: {
  isOverlayHidden: boolean;
  isTopLeftExpanded: boolean;
  setIsTopLeftExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div
      className={`${isOverlayHidden ? '-translate-x-[100%]' : ''} absolute z-10 duration-700`}
    >
      <nav className="flex items-start gap-2">
        <Link to={'/'}>
          <Button
            icon={<HomeIcon className="size-6" />}
            className="secondary-btn-clr"
            title="Resetar visualização"
          />
        </Link>
        <CheckboxButton
          icon={
            isTopLeftExpanded ? (
              <GlobeAltIconSolid className="size-6" />
            ) : (
              <GlobeAltIconOutline className="size-6" />
            )
          }
          checked={isTopLeftExpanded}
          onChange={() => setIsTopLeftExpanded(!isTopLeftExpanded)}
          title={isTopLeftExpanded ? 'Ocultar navegador' : 'Mostrar navegador'}
        />
      </nav>

      <NavBar isExpanded={isTopLeftExpanded} />
    </div>
  );
}

function TopRightActions({
  isOverlayHidden,
  setIsOverlayHidden,
}: {
  isOverlayHidden: boolean;
  setIsOverlayHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isLayersExpanded, setIsLayersExpanded] = useState(false);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

  return (
    <div
      className={`${isOverlayHidden ? 'translate-x-[100%]' : ''} absolute right-0 z-10 duration-700`}
    >
      <div className="hidden sm:block">
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
            onChange={() => {
              setIsLayersExpanded(!isLayersExpanded);
              setIsSettingsExpanded(false);
            }}
            title={isLayersExpanded ? 'Ocultar camadas' : 'Mostrar camadas'}
          />
          <CheckboxButton
            icon={
              isSettingsExpanded ? (
                <CogIconSolid className="size-6" />
              ) : (
                <CogIconOutline className="size-6" />
              )
            }
            checked={isSettingsExpanded}
            onChange={() => {
              setIsSettingsExpanded(!isSettingsExpanded);
              setIsLayersExpanded(false);
            }}
            title={
              isSettingsExpanded
                ? 'Ocultar configurações'
                : 'Mostrar configurações'
            }
          />
        </div>
        <Layers isExpanded={isLayersExpanded} />
        <Settings isExpanded={isSettingsExpanded} />
      </div>
    </div>
  );
}

function BottomActions({
  isOverlayHidden,
  isBottomExpanded,
  setIsBottomExpanded,
}: {
  isOverlayHidden: boolean;
  isBottomExpanded: boolean;
  setIsBottomExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div
      className={`${isOverlayHidden ? 'translate-y-[100%]' : ''} pointer-events-none absolute bottom-0 w-full duration-700`}
    >
      <div
        className={`duration-300 ${isBottomExpanded ? '' : 'invisible translate-y-24 opacity-0'}`}
      >
        <TimeControls isExpanded={true} />
      </div>
      <button
        className="pointer-events-auto mx-auto mt-4 -mb-2 block cursor-pointer p-2 duration-300 hover:-translate-y-2"
        onClick={() => setIsBottomExpanded(!isBottomExpanded)}
      >
        {isBottomExpanded ? (
          <ChevronDownIcon className="size-6 text-white" />
        ) : (
          <ChevronUpIcon className="size-6 text-white" />
        )}
      </button>
    </div>
  );
}
