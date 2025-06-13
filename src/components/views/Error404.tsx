import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

export default function Error404() {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown === 0) {
      navigate('/');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-black to-slate-900 px-4 text-center text-white">
      <h1 className="text-3xl font-bold md:text-4xl">
        Rota não encontrada no universo!
      </h1>
      <p className="mt-4 max-w-xl text-lg">
        Parece que você se perdeu no espaço sideral. Vamos traçar um curso de
        volta para o Sistema Solar ☀🌍🪐
      </p>
      <p className="mt-12 text-base">
        Redirecionando em <span className="font-semibold">{countdown}</span>{' '}
        segundos...
      </p>
      <Button
        onClick={() => navigate('/')}
        className="mt-4 rounded bg-blue-600 px-6 py-2 text-base text-white shadow transition duration-200 hover:bg-blue-500"
        label="Redirecionar agora"
      />
    </div>
  );
}
