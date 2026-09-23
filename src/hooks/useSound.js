import { soundManager } from '../audio/soundManager';

export function useSound() {
  const playSound = (soundName) => {
    soundManager.play(soundName);
  };

  return { playSound };
}