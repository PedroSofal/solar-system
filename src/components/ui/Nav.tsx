import { useEffect, useRef } from 'react';
import {
  ArrowRightCircleIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';
import gsap from 'gsap';

export default function Nav({
  history,
  setHistory,
  isNavbarExpanded,
  isSearching,
  setIsSearching,
  setSelectedBody,
}: {
  history: NavItem[];
  setHistory: React.Dispatch<React.SetStateAction<NavItem[]>>;
  isNavbarExpanded: boolean;
  isSearching: boolean;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedBody: React.Dispatch<
    React.SetStateAction<string | null | undefined>
  >;
}) {
  const navRef = useRef(null);
  const currentMenu = history[history.length - 1];

  useEffect(() => {
    if (navRef.current && isNavbarExpanded && !isSearching) {
      gsap.fromTo(
        navRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' },
      );
    }
  }, [currentMenu, isNavbarExpanded]);

  function navigateTo(item: NavItem) {
    if (item.subItems) {
      gsap.to(navRef.current, {
        x: -100,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () =>
          setHistory([
            ...history,
            { subItems: item.subItems, label: item.label },
          ]),
      });
    } else {
      setSelectedBody(item.id || null);
    }
  }

  function goBack() {
    setIsSearching(false);

    if (history.length > 1) {
      gsap.to(navRef.current, {
        x: 100,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => setHistory(history.slice(0, -1)),
      });
    }
  }

  return (
    <>
      {history.length > 1 ? (
        <div>
          <button
            onClick={goBack}
            className="flex cursor-pointer items-center gap-2"
          >
            <ArrowUturnLeftIcon className="size-4" />
            <span className="font-semibold text-white">
              {currentMenu.label}
            </span>
          </button>
          <hr className="mt-4 border-emerald-400/50" />
        </div>
      ) : (
        <div>
          <div className="font-semibold text-white">{currentMenu.label}</div>
          <hr className="mt-4 border-emerald-400/50" />
        </div>
      )}

      <nav ref={navRef} className="overflow-y-auto">
        {currentMenu.subItems && (
          <ul className="flex flex-col gap-4">
            {currentMenu.subItems.map((item, index) => (
              <li
                key={index}
                onClick={() => navigateTo(item)}
                className="gradient-bg border-bottom flex items-center justify-between overflow-hidden p-4 font-semibold"
              >
                <p className="uppercase">{item.label}</p>
                {item.subItems && <ArrowRightCircleIcon className="size-5" />}
                {item.info && (
                  <span className="text-sm text-cyan-400 capitalize">
                    {item.info}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </nav>
    </>
  );
}
