import { Link } from 'react-router-dom';
import Logo from '../../assets/logo/logo.svg?react';

export default function LogoNav({
  isOverlayHidden,
}: {
  isOverlayHidden: boolean;
}) {
  return (
    <div
      className={`${isOverlayHidden ? '-translate-y-10 opacity-0' : ''} absolute right-0 left-0 z-10 duration-700`}
    >
      <nav className="flex justify-center">
        <Link to={'/'}>
          <Logo className="animate-logoIn w-36 opacity-0 sm:w-40" />
        </Link>
      </nav>
    </div>
  );
}
