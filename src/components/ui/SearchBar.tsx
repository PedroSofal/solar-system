import { useContext } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import BodyDataContext from '../../contexts/BodyDataContext';
import { mapBodyToNavItem } from '../../utils';

function rankResult(searchTerm: string, bodies: BodyType[]): BodyType[] {
  const nameMatches_strong = [];
  const nameMatches_weak = [];
  const moonMatches = [];
  const languageMatches = [];
  const descriptionMatches = [];

  const term = searchTerm.toLowerCase();

  for (const body of bodies) {
    if (body.parent?.type === 'asteroid') continue;

    if (body.name.toLowerCase().startsWith(term)) {
      nameMatches_strong.push(body);
    } else if (body.name.toLowerCase().includes(term)) {
      nameMatches_weak.push(body);
    } else if (
      body.parent?.name.toLowerCase().includes(term) ||
      body.moons?.some((moon) => moon.toLowerCase().includes(term))
    ) {
      moonMatches.push(body);
    } else if (body.description.toLowerCase().includes(term)) {
      descriptionMatches.push(body);
    } else if (
      body.englishName.toLowerCase().includes(term) ||
      body.frenchName.toLowerCase().includes(term)
    ) {
      languageMatches.push(body);
    }
  }

  return [
    ...nameMatches_strong,
    ...nameMatches_weak,
    ...moonMatches,
    ...descriptionMatches,
    ...languageMatches,
  ];
}

export default function SearchBar({
  setHistory,
  isSearching,
  setIsSearching,
}: {
  setHistory: React.Dispatch<React.SetStateAction<NavItem[]>>;
  isSearching: boolean;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { allBodies } = useContext(BodyDataContext);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    if (!allBodies) return;

    const searchTerm = e.target.value;
    const rankedResults = rankResult(searchTerm, allBodies).map(
      mapBodyToNavItem,
    );

    const result: NavItem[] =
      searchTerm === ''
        ? allBodies.map(mapBodyToNavItem)
        : rankedResults.length > 0
          ? rankedResults
          : [
              {
                label: `Nenhum resultado encontrado para "${searchTerm}"`,
                static: true,
              },
            ];

    setHistory((prev) => {
      if (isSearching) {
        return prev.map((item, index) => {
          return index === prev.length - 1
            ? { ...item, subItems: result }
            : item;
        });
      } else {
        return [...prev, { subItems: result, label: 'Resultado da pesquisa' }];
      }
    });

    setIsSearching(true);
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="size-4 stroke-2" />
        </div>
        <input
          type="search"
          id="body-search"
          className="gradient-bg mb-6 block w-full border border-emerald-400 px-4 py-3 pl-10 text-sm placeholder-emerald-400/50 focus:outline-emerald-400"
          placeholder="Procure por corpos celestes"
          onChange={handleSearch}
        />
      </div>
    </form>
  );
}
