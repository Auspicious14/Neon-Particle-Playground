
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Particle, ParticleMode, Config } from '../types';
import { createParticle, updateParticle } from '../utils/particleMath';
import { soundManager } from '../utils/sound';
import ControlPanel from '../components/ControlPanel';

export default function ParticlePlayground() {
  const [mode, setMode] = useState<ParticleMode>(ParticleMode.NEON_SPARKS);
  const [config, setConfig] = useState<Config>({ 
    density: 60, 
    maxParticles: 1000,
    volume: 25,
    isMuted: false
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>();
  const isInteracting = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Canvas Resize Logic
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Frame Update Loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Motion Blur Trail Effect
    ctx.fillStyle = 'rgba(2, 6, 23, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const dt = 0.016; 
    const activeParticles: Particle[] = [];

    particlesRef.current.forEach(p => {
      const updated = updateParticle(p, dt);
      if (updated.life > 0) {
        ctx.save();
        ctx.globalAlpha = updated.alpha;
        ctx.beginPath();
        ctx.arc(updated.x, updated.y, updated.size, 0, Math.PI * 2);
        ctx.fillStyle = updated.color;
        
        // High-end glow effect
        ctx.shadowBlur = updated.size * 2.5;
        ctx.shadowColor = updated.color;
        
        ctx.fill();
        ctx.restore();
        
        activeParticles.push(updated);
      }
    });

    // Particle cap for performance
    if (activeParticles.length > config.maxParticles) {
      activeParticles.splice(0, activeParticles.length - config.maxParticles);
    }

    particlesRef.current = activeParticles;
    requestRef.current = requestAnimationFrame(animate);
  }, [config.maxParticles]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  const spawnAt = (x: number, y: number) => {
    const newParticles = createParticle(x, y, mode, config.density);
    particlesRef.current = [...particlesRef.current, ...newParticles];
    
    if (!config.isMuted) {
      soundManager.playSpawnSound(mode, config.volume, config.density);
    }
  };

  const onInteract = (e: React.MouseEvent | React.TouchEvent) => {
    isInteracting.current = true;
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    lastPos.current = { x, y };
    spawnAt(x, y);
  };

  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isInteracting.current) return;
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const dist = Math.hypot(x - lastPos.current.x, y - lastPos.current.y);
    if (dist > 6) {
      spawnAt(x, y);
      lastPos.current = { x, y };
    }
  };

  return (
    <main className="relative w-full h-screen bg-slate-950 select-none overflow-hidden touch-none">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`, backgroundSize: '60px 60px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0)_0%,rgba(2,6,23,1)_100%)]" />
      </div>

      {/* Futuristic Header */}
      <header className="absolute top-8 left-0 right-0 text-center z-10 pointer-events-none">
        <h1 className="text-white font-orbitron text-xl md:text-3xl font-black uppercase tracking-[0.3em] opacity-80 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          Particle Playground
        </h1>
        <div className="flex justify-center items-center gap-4 mt-3">
          <div className="h-[1px] w-8 md:w-16 bg-gradient-to-r from-transparent to-slate-500" />
        
          <div className="h-[1px] w-8 md:w-16 bg-gradient-to-l from-transparent to-slate-500" />
        </div>
      </header>

      {/* Simulation Engine */}
      <canvas
        ref={canvasRef}
        onMouseDown={onInteract}
        onMouseMove={onMove}
        onMouseUp={() => isInteracting.current = false}
        onMouseLeave={() => isInteracting.current = false}
        onTouchStart={onInteract}
        onTouchMove={onMove}
        onTouchEnd={() => isInteracting.current = false}
        className="cursor-none w-full h-full block"
      />

      {/* Overlay UI */}
      <ControlPanel 
        currentMode={mode}
        setMode={setMode}
        config={config}
        updateConfig={(u) => setConfig(prev => ({ ...prev, ...u }))}
        onClear={() => { particlesRef.current = []; }}
      />

      {/* Telemetry Display */}
      <aside className="fixed top-6 right-6 flex flex-col gap-2 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-sm border-l-2 border-cyan-500/50 flex flex-col gap-0.5 min-w-[120px]">
          <span className="text-[8px] font-orbitron text-slate-500 uppercase tracking-tighter">Active Particles</span>
          <span className="text-xs font-mono text-cyan-400 tabular-nums font-bold">
            {particlesRef.current.length.toLocaleString()}
          </span>
        </div>
        <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-sm border-l-2 border-purple-500/50 flex flex-col gap-0.5">
          <span className="text-[8px] font-orbitron text-slate-500 uppercase tracking-tighter">Sound System</span>
          <span className="text-xs font-mono text-purple-400 font-bold">
            {config.isMuted ? 'STANDBY' : 'ENGAGED'}
          </span>
        </div>
      </aside>
    </main>
  );
}
