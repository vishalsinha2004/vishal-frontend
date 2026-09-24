import { useState, useCallback } from 'react';
import { soundManager } from '../audio/soundManager';

export function useSound() {
  const [isMuted, setIsMuted] = useState(soundManager.muted);
  const [volume, setVolume] = useState(soundManager.volume);

  const playSound = useCallback((soundName) => {
    soundManager.play(soundName);
  }, []);

  const toggleMute = useCallback(() => {
    const newMute = !isMuted;
    setIsMuted(newMute);
    soundManager.setMute(newMute);
    if (!newMute) soundManager.play('click');
  }, [isMuted]);

  const changeVolume = useCallback((newVol) => {
    setVolume(newVol);
    soundManager.setVolume(newVol);
    if (isMuted && newVol > 0) {
      setIsMuted(false);
      soundManager.setMute(false);
    }
  }, [isMuted]);

  return { playSound, isMuted, toggleMute, volume, changeVolume };
}