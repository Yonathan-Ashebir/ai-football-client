import { useCallback } from 'react';

export function useSound() {
  const playSound = useCallback((frequency: number = 440, duration: number = 0.1) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Create oscillator
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    // Create gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Start and stop
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }, []);

  return playSound;
}