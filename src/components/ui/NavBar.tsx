import { useContext, useEffect, useMemo, useState } from 'react';
import BodyDataContext from '../../contexts/BodyDataContext';
import SearchBar from './SearchBar';
import Nav from './Nav';
import { mapBodyToNavItem } from '../../utils/ui';
import BodyInfo from './BodyInfo';
import { useMatch } from 'react-router-dom';
import { createPortal } from 'react-dom';

export default function NavBar({ isExpanded }: { isExpanded: boolean }) {
  const { sun, planets, moons, dwarfPlanets, asteroids, comets, loading } =
    useContext(BodyDataContext);

  const [selectedBody, setSelectedBody] = useState<string | null | undefined>();

  const match = useMatch('/corpos/:id');

  const navTree = useMemo(() => {
    return [
      {
        label: 'Sol',
        id: sun?.id,
      },
      {
        label: 'Planetas',
        subItems: planets
          ?.sort((a, b) => a.semimajorAxis - b.semimajorAxis)
          .map(mapBodyToNavItem),
      },
      {
        label: 'Satélites naturais',
        subItems: moons?.map(mapBodyToNavItem),
      },
      {
        label: 'Planetas-anões',
        subItems: dwarfPlanets
          ?.sort((a, b) => {
            return a.mass && b.mass ? a.mass.massValue - b.mass.massValue : 0;
          })
          .map(mapBodyToNavItem),
      },
      {
        label: 'Asteróides',
        subItems: asteroids
          ?.sort((a, b) => a.semimajorAxis - b.semimajorAxis)
          .map(mapBodyToNavItem),
      },
      {
        label: 'Cometas',
        subItems: comets
          ?.sort((a, b) => a.semimajorAxis - b.semimajorAxis)
          .map(mapBodyToNavItem),
      },
    ];
  }, [loading]);

  const [isSearching, setIsSearching] = useState(false);
  const [history, setHistory] = useState<NavItem[]>([
    { subItems: navTree, label: 'Corpos celestes' },
  ]);

  useEffect(() => {
    if (!loading) {
      setHistory([{ subItems: navTree, label: 'Corpos celestes' }]);
    }
  }, [loading]);

  useEffect(() => {
    if (match && match.params.id) {
      // setIsNavbarExpanded(true);
      setSelectedBody(match.params.id);
    } else {
      setSelectedBody(undefined);
    }
  }, [match]);

  return (
    <aside
      className={`max-w-[34rem] min-w-[20rem] ${!isExpanded ? 'hidden' : ''}`}
    >
      <div
        className={`main-container mt-6 flex max-h-[80dvh] flex-col gap-4 sm:max-h-[70vh] ${selectedBody ? 'hidden!' : ''}`}
      >
        <div>
          <p className="mb-1 font-semibold">
            {selectedBody === undefined
              ? 'Sistema de propulsores pronto!'
              : 'Ops! Falha no sistema de localização'}
          </p>
          <h1 className="title mb-2">
            {selectedBody === undefined
              ? 'Selecione um destino para navegar'
              : 'O corpo celeste que você está procurando não foi encontrado'}
          </h1>
        </div>

        <SearchBar
          setHistory={setHistory}
          isSearching={isSearching}
          setIsSearching={setIsSearching}
        />

        <Nav
          history={history}
          setHistory={setHistory}
          isNavbarExpanded={isExpanded}
          isSearching={isSearching}
          setIsSearching={setIsSearching}
          setSelectedBody={setSelectedBody}
        />
      </div>
      {selectedBody && (
        <>
          <BodyInfo
            selectedBody={selectedBody}
            setSelectedBody={setSelectedBody}
          />
          {createPortal(
            <div
              className={`pointer-events-none absolute inset-0 bg-slate-950/80 duration-300 sm:hidden ${isExpanded ? '' : 'opacity-0'}`}
            />,
            document.body,
          )}
        </>
      )}
    </aside>
  );
}
