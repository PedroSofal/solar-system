import { useFrame } from '@react-three/fiber';
import { useContext } from 'react';
import TimeContext from '../../contexts/TimeContext';

export default function TimeTicker() {
  const { tick } = useContext(TimeContext);

  useFrame((_, delta) => {
    tick(delta);
  });

  return null;
}
