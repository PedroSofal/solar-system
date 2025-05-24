import TimeControls from './TimeControls';
import NavBar from './NavBar';
import { useContext, useEffect, useState } from 'react';
import Layers from './Layers';
import { HomeIcon } from '@heroicons/react/24/outline';
import { Link, useMatch } from 'react-router-dom';
import CameraContext from '../../contexts/CameraContext';
import {
  GlobeAltIcon as GlobeAltIconOutline,
  Square3Stack3DIcon as Square3Stack3DIconOutline,
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

  return (
    <>
      {/* sombra esquerda */}
      <div
        className={`opacity pointer-events-none absolute inset-0 z-10 w-[40rem] bg-linear-to-r from-black via-black/80 to-transparent duration-300 ${selectedBody && isNavbarExpanded ? '' : 'invisible opacity-0'}`}
      />

      {/* sombra baixo */}
      <div
        className={`pointer-events-none absolute bottom-0 h-60 w-full bg-linear-to-t from-black via-black/70 to-transparent duration-300 ${isTimeControlsExpanded ? '' : 'invisible opacity-0'}`}
      />

      <div className="pointer-events-none relative top-6 left-6 h-[calc(100vh-3rem)] w-[calc(100vw-3rem)]">
        <div className="pointer-events-auto">
          <TopLeftActions
            selectedBody={selectedBody}
            setSelectedBody={setSelectedBody}
            isNavbarExpanded={isNavbarExpanded}
            setIsNavbarExpanded={setIsNavbarExpanded}
          />
          <TopRightAction />
          <TimeControls
            isExpanded={isTimeControlsExpanded}
            setIsExpanded={setIsTimeControlsExpanded}
          />
        </div>
      </div>
    </>
  );
}

function TopLeftActions({
  selectedBody,
  setSelectedBody,
  isNavbarExpanded,
  setIsNavbarExpanded,
}: {
  selectedBody: string | null | undefined;
  setSelectedBody: React.Dispatch<
    React.SetStateAction<string | null | undefined>
  >;
  isNavbarExpanded: boolean;
  setIsNavbarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { setResetTrigger } = useContext(CameraContext);

  return (
    <>
      <nav className="absolute z-10 flex items-start gap-2">
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
      <aside
        className={`absolute top-10 left-0 z-10 w-full max-w-[28rem] ${!isNavbarExpanded ? 'hidden' : ''}`}
      >
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
    </>
  );
}

function TopRightAction() {
  const [isLayersExpanded, setIsLayersExpanded] = useState(false);

  return (
    <>
      <div className="absolute right-0 z-10">
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
    </>
  );
}
