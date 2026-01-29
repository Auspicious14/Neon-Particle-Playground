
import { Particle, ParticleMode } from '../types';
import { COLORS } from '../constants';

let nextId = 0;

export const createParticle = (
  x: number, 
  y: number, 
  mode: ParticleMode, 
  density: number
): Particle[] => {
  const particles: Particle[] = [];
  const count = Math.max(1, Math.floor(density / 10));

  for (let i = 0; i < count; i++) {
    let vx = (Math.random() - 0.5) * 8;
    let vy = (Math.random() - 0.5) * 8;
    let life = 0.5 + Math.random() * 0.5;
    let size = 1 + Math.random() * 3;
    let colorSet = COLORS.NEON;
    let angle = Math.random() * Math.PI * 2;
    let radius = 1 + Math.random() * 5;

    if (mode === ParticleMode.GALAXY_SWIRL) {
      colorSet = COLORS.GALAXY;
      size = 1 + Math.random() * 2;
      life = 0.8 + Math.random() * 0.7;
    } else if (mode === ParticleMode.FIRE_BURST) {
      colorSet = COLORS.FIRE;
      vx = (Math.random() - 0.5) * 2;
      vy = -2 - Math.random() * 4;
      size = 2 + Math.random() * 6;
      life = 0.4 + Math.random() * 0.4;
    }

    const color = colorSet[Math.floor(Math.random() * colorSet.length)];

    particles.push({
      id: nextId++,
      x,
      y,
      vx,
      vy,
      size,
      color,
      alpha: 1,
      life,
      maxLife: life,
      type: mode,
      angle,
      radius
    });
  }

  return particles;
};

export const updateParticle = (p: Particle, dt: number): Particle => {
  const updated = { ...p };
  
  if (p.type === ParticleMode.NEON_SPARKS) {
    updated.x += p.vx;
    updated.y += p.vy;
    updated.vx *= 0.98;
    updated.vy *= 0.98;
  } else if (p.type === ParticleMode.GALAXY_SWIRL) {
    updated.angle = (p.angle || 0) + 0.05;
    updated.radius = (p.radius || 0) + 1.2;
    updated.x += Math.cos(updated.angle) * updated.radius * 0.1 + p.vx * 0.2;
    updated.y += Math.sin(updated.angle) * updated.radius * 0.1 + p.vy * 0.2;
  } else if (p.type === ParticleMode.FIRE_BURST) {
    updated.x += p.vx + (Math.random() - 0.5) * 0.5;
    updated.y += p.vy;
    updated.vy *= 0.99;
    updated.size *= 0.995;
  }

  updated.life -= dt;
  updated.alpha = Math.max(0, updated.life / updated.maxLife);
  
  return updated;
};
