import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  private audioContext: AudioContext;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  beep(duration = 200, frequency = 440, volume = 100): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const oscillatorNode = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        oscillatorNode.connect(gainNode);

        // Set the oscillator frequency in hertz
        oscillatorNode.frequency.value = frequency;

        // Set the type of oscillator
        oscillatorNode.type = 'square';
        gainNode.connect(this.audioContext.destination);

        // Set the gain to the volume
        gainNode.gain.value = volume * 0.01;

        // Start audio with the desired duration
        oscillatorNode.start(this.audioContext.currentTime);
        oscillatorNode.stop(this.audioContext.currentTime + duration * 0.001);

        // Resolve the promise when the sound is finished
        oscillatorNode.onended = () => {
          resolve();
        };
      } catch (error) {
        reject(error);
      }
    });
  }
}
