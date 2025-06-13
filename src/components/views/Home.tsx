import LoadingScreen from './LoadingScreen';
import ThreeCanvas from '../scene/ThreeCanvas';
import Overlay from '../ui/Overlay';
import { useState } from 'react';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0">
        <ThreeCanvas isLoaded={isLoaded} setIsLoaded={setIsLoaded} />
      </div>
      {isLoaded ? <Overlay /> : <LoadingScreen />}
    </main>
  );
}
