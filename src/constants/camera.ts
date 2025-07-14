import { Vector3 } from 'three';

export const cameraConfig = {
  NEAR: 0.00001,
  FAR: 4000000,
  MIN_FOV: 30,
  MAX_FOV: 90,
  MIN_DISTANCE: 0.0003,
  MAX_DISTANCE: 120000,
  ZOOM_SPEED: 0.5,
  DAMPING_FACTOR: 0.05,
  INITIAL_POS: new Vector3(0, 50000, 18000),
  INTRO_POS: new Vector3(-3000, 4000, 2000),
  FOCUS_LEFT_OFFSET: 0.8,
  FOCUS_UP_OFFSET: 0.2,
  FOCUS_DISTANCE: 6,
  FOLLOW_DELAY: 2500,
};
