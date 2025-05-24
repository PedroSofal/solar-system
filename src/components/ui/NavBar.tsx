import { useContext, useEffect, useMemo, useState } from 'react';
import BodyDataContext from '../../contexts/BodyDataContext';
import SearchBar from './SearchBar';
import Nav from './Nav';
import { mapBodyToNavItem } from '../../utils';

export default function NavBar({
  isExpanded,
  selectedBody,
  setSelectedBody,
}: {
  isExpanded: boolean;
  selectedBody: string | null | undefined;
  setSelectedBody: React.Dispatch<
    React.SetStateAction<string | null | undefined>
  >;
}) {
  const { sun, planets, moons, dwarfPlanets, loading } =
    useContext(BodyDataContext);

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

  return (
    <>
      <div
        className={`main-container mt-6 flex max-h-[70vh] flex-col gap-4 ${selectedBody ? 'hidden!' : ''}`}
      >
        <div>
          <p className="mb-1 font-semibold">
            {selectedBody === undefined
              ? 'Sistema de propulsores pronto!'
              : 'Ops! Falha no sistema de localização'}
          </p>
          <h1 className="title mb-8">
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
    </>
  );
}
