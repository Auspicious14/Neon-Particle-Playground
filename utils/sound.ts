
import { ParticleMode } from '../types';

class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  private init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
  }

  playSpawnSound(mode: ParticleMode, volume: number, density: number) {
    this.init();
    if (!this.ctx || !this.masterGain || volume <= 0) return;

    // Resume context if suspended (browser security)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Subtle pitch variation based on mode
    let freq = 440;
    let type: OscillatorType = 'sine';
    let decay = 0.1;

    switch (mode) {
      case ParticleMode.NEON_SPARKS:
        freq = 800 + Math.random() * 400;
        type = 'triangle';
        decay = 0.05;
        break;
      case ParticleMode.GALAXY_SWIRL:
        freq = 200 + Math.random() * 100;
        type = 'sine';
        decay = 0.2;
        break;
      case ParticleMode.FIRE_BURST:
        freq = 100 + Math.random() * 50;
        type = 'sawtooth';
        decay = 0.15;
        break;
    }

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + decay);

    // Adjust volume based on user setting and density
    // Higher density = slightly lower per-particle volume to avoid clipping
    const densityFactor = Math.max(0.1, 1 - (density / 200));
    const finalVolume = (volume / 100) * 0.1 * densityFactor;

    gain.gain.setValueAtTime(finalVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + decay);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + decay);
  }
}

export const soundManager = new SoundManager();
