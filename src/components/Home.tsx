import ThreeCanvas from './ThreeCanvas';
import Overlay from './ui/Overlay';
import { useState } from 'react';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0">
        <ThreeCanvas setIsLoaded={setIsLoaded} />
      </div>
      {isLoaded ? (
        <Overlay />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <img
            className="absolute block h-full w-full object-cover"
            src="/img/cover.png"
            alt="Saturno e seus anéis"
          />
          <p className="z-10 animate-pulse text-xl text-white">Carregando...</p>
        </div>
      )}
    </main>
  );
}
