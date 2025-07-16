import {
  HomeIcon as HomeIconOutline,
  GlobeAltIcon as GlobeAltIconOutline,
  ClockIcon as ClockIconOutline,
  Square3Stack3DIcon as Square3Stack3DIconOutline,
  Cog8ToothIcon as CogIconOutline,
} from '@heroicons/react/24/outline';
import {
  GlobeAltIcon as GlobeAltIconSolid,
  ClockIcon as ClockIconSolid,
  Square3Stack3DIcon as Square3Stack3DIconSolid,
  Cog8ToothIcon as CogIconSolid,
} from '@heroicons/react/24/solid';
import LogoNav from './LogoNav';
import CheckboxButton from './CheckboxButton';
import { useState } from 'react';
import Button from './Button';
import { Link } from 'react-router-dom';
import Layers from './Layers';
import Settings from './Settings';
import TimeControls from './TimeControls';
import NavBar from './NavBar';

const TABS = [
  {
    opened: GlobeAltIconSolid,
    closed: GlobeAltIconOutline,
    content: NavBar,
  },
  {
    opened: ClockIconSolid,
    closed: ClockIconOutline,
    content: TimeControls,
  },
  {
    opened: Square3Stack3DIconSolid,
    closed: Square3Stack3DIconOutline,
    content: Layers,
  },
  {
    opened: CogIconSolid,
    closed: CogIconOutline,
    content: Settings,
  },
];

export default function MobileUI({
  isOverlayHidden,
}: {
  isOverlayHidden: boolean;
}) {
  return (
    <div className="sm:hidden">
      <div className="relative top-6">
        <LogoNav isOverlayHidden={isOverlayHidden} />
      </div>

      <div
        className={`fixed right-0 bottom-0 left-0 z-50 duration-700 ${isOverlayHidden ? 'translate-y-20 opacity-0' : ''}`}
      >
        <TabBar />
      </div>
    </div>
  );
}

function TabBar() {
  const [tabIndex, setTabIndex] = useState<number | null>(1);

  function handleTabClick(newIndex: number) {
    if (newIndex === tabIndex) {
      setTabIndex(null);
    } else {
      setTabIndex(newIndex);
    }
  }

  return (
    <>
      <div className="m-6">
        {TABS.map(({ content: Content }, index) => (
          <Content key={index} isExpanded={tabIndex === index} />
        ))}
      </div>

      <div className="grid grid-cols-5 bg-neutral-900">
        <Link to={'/'}>
          <Button
            className="secondary-btn-clr flex! w-full justify-center py-3!"
            icon={<HomeIconOutline className="size-6" />}
          />
        </Link>
        {TABS.map(({ opened: OpenedIcon, closed: ClosedIcon }, index) => (
          <CheckboxButton
            key={index}
            className="flex! w-full justify-center py-3!"
            checked={tabIndex === index}
            icon={
              tabIndex === index ? (
                <OpenedIcon className="size-6" />
              ) : (
                <ClosedIcon className="size-6" />
              )
            }
            onChange={() => handleTabClick(index)}
          />
        ))}
      </div>
    </>
  );
}
