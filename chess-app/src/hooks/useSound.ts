import { useEffect } from 'react';
import { soundManager } from '@/lib/sounds';

export function useSound() {
  useEffect(() => {
    soundManager.init();
  }, []);

  return {
    playMove: soundManager.playMove.bind(soundManager),
  };
}