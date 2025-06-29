import { toModelScale } from '../utils/scene';

const JUPITER_ORBIT = 778_340_821;
const MARS_ORBIT = 227_939_200;

export const cometTrailConfig = {
  MAX_PARTICLES: 500,
  PARTICLE_LIFE: 500,
  MIN_EMISSION_DISTANCE: toModelScale(JUPITER_ORBIT),
  MAX_EMISSION_DISTANCE: toModelScale(MARS_ORBIT),
  MAX_ALPHA: 0.3,
  MIN_SPEED: 0.005,
  DISPERSION_AMOUNT: 0.08,
  GROW_FACTOR: 0.2,
  GROW_FACTOR_DISPERSED: 0.5,
  COMA_SCALE: 3000,
  PARTICLE_SCALE: 10000,
};

export const ringSystemConfig = {
  SPIN_SPEED: 0.000008,
  HEIGHT_MULTIPLIER: 0.01,
  PARTICLE_BASE_SIZE: 0.00068,
};
