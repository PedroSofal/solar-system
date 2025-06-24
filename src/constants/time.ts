export const timeConfig = {
  STEPS: 11,
  TIME_MACHINE_MAP: {
    0: { scale: 1, label: 'Velocidade normal' },
    1: { scale: 10, label: '10 segundos/s' },
    2: { scale: 60, label: '1 minuto/s' },
    3: { scale: 30 * 60, label: '30 minutos/s' },
    4: { scale: 60 * 60, label: '1 hora/s' },
    5: { scale: 12 * 60 * 60, label: '12 horas/s' },
    6: { scale: 24 * 60 * 60, label: '1 dia/s' },
    7: { scale: 7 * 24 * 60 * 60, label: '1 semana/s' },
    8: { scale: 30 * 24 * 60 * 60, label: '1 mês/s' },
    9: { scale: 180 * 24 * 60 * 60, label: '6 meses/s' },
    10: { scale: 365 * 24 * 60 * 60, label: '1 ano/s' },
    11: { scale: 2 * 365 * 24 * 60 * 60, label: '2 anos/s' },
  } as Record<number, { scale: number; label: string }>,
};
