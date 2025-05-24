import { TimeProvider } from './contexts/TimeContext';
import { TimeStaticProvider } from './contexts/TimeStaticContext';
import { TextureProvider } from './contexts/TextureContext';
import { BodyDataProvider } from './contexts/BodyDataContext';
import { CameraProvider } from './contexts/CameraContext';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './routes';
import { LayerProvider } from './contexts/LayerContext';

const router = createBrowserRouter(routes);

export default function App() {
  return (
    <TimeProvider>
      <TimeStaticProvider>
        <BodyDataProvider>
          <LayerProvider>
            <TextureProvider>
              <CameraProvider>
                <RouterProvider router={router} />
              </CameraProvider>
            </TextureProvider>
          </LayerProvider>
        </BodyDataProvider>
      </TimeStaticProvider>
    </TimeProvider>
  );
}
