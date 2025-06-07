import Home from './components/Home';
import Error404 from './components/Error404';

export default [
  {
    path: '/',
    element: <Home />,
    errorElement: <Error404 />,
    children: [
      {
        path: '/corpos/:id',
        element: <></>,
      },
    ],
  },
];
