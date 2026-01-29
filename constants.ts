
import { ParticleMode } from './types';

export const COLORS = {
  NEON: ['#00f2ff', '#7000ff', '#ff00d9', '#00ff9d', '#fffb00'],
  GALAXY: ['#9333ea', '#3b82f6', '#1d4ed8', '#7e22ce', '#c084fc'],
  FIRE: ['#f97316', '#ef4444', '#f59e0b', '#b91c1c', '#7c2d12'],
};

export const MODE_CONFIGS = {
  [ParticleMode.NEON_SPARKS]: {
    name: 'Neon Sparks',
    description: 'High-speed electric bursts',
    primaryColor: '#00f2ff',
  },
  [ParticleMode.GALAXY_SWIRL]: {
    name: 'Galaxy Swirl',
    description: 'Circular cosmic motion',
    primaryColor: '#9333ea',
  },
  [ParticleMode.FIRE_BURST]: {
    name: 'Fire Burst',
    description: 'Rising flames and smoke',
    primaryColor: '#f97316',
  },
};
