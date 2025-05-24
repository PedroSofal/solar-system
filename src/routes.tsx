import Home from './components/Home';

export default [
  {
    path: '/',
    element: <Home />,
    // errorElement: <Error404 />,
    children: [
      {
        path: '/corpos/:id',
        element: <></>,
      },
    ],
  },
];
