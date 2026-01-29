
export enum ParticleMode {
  NEON_SPARKS = 'NEON_SPARKS',
  GALAXY_SWIRL = 'GALAXY_SWIRL',
  FIRE_BURST = 'FIRE_BURST'
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  type: ParticleMode;
  angle?: number;
  radius?: number;
  hue?: number;
}

export interface Config {
  density: number;
  maxParticles: number;
  volume: number;
  isMuted: boolean;
}
