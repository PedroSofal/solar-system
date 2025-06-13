import Home from './components/views/Home';
import Error404 from './components/views/Error404';

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
