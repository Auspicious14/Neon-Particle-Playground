
'use client';

import React from 'react';
import { ParticleMode, Config } from '../types';
import { MODE_CONFIGS } from '../constants';

interface ControlPanelProps {
  currentMode: ParticleMode;
  setMode: (mode: ParticleMode) => void;
  config: Config;
  updateConfig: (updates: Partial<Config>) => void;
  onClear: () => void;
}

export default function ControlPanel({
  currentMode,
  setMode,
  config,
  updateConfig,
  onClear
}: ControlPanelProps) {
  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[94%] max-w-3xl z-50">
      <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-2xl p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
        {/* Dynamic Theme Bar */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px] rounded-full transition-all duration-700" 
          style={{ 
            backgroundColor: MODE_CONFIGS[currentMode].primaryColor, 
            boxShadow: `0 0 20px ${MODE_CONFIGS[currentMode].primaryColor}` 
          }}
        />

        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* Mode Switcher */}
          <div className="flex flex-1 gap-2 w-full overflow-x-auto scrollbar-hide py-1">
            {Object.entries(MODE_CONFIGS).map(([key, cfg]) => {
              const active = currentMode === key;
              return (
                <button
                  key={key}
                  onClick={() => setMode(key as ParticleMode)}
                  className={`group relative flex-1 min-w-[140px] px-6 py-3 rounded-xl transition-all duration-300 border ${
                    active 
                      ? 'bg-white/5 border-white/20 text-white' 
                      : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <span className="font-orbitron text-[10px] uppercase tracking-[0.2em] font-bold">
                    {cfg.name}
                  </span>
                  <div 
                    className={`absolute bottom-0 left-0 h-1 w-full rounded-full transition-all duration-500 scale-x-0 group-hover:scale-x-100 ${active ? 'scale-x-100' : ''}`} 
                    style={{ backgroundColor: cfg.primaryColor }}
                  />
                </button>
              );
            })}
          </div>

          <div className="h-px w-full lg:h-12 lg:w-px bg-white/5" />

          {/* Config Controls */}
          <div className="grid grid-cols-2 gap-6 w-full lg:w-auto lg:min-w-[240px]">
            <div className="flex flex-col gap-2">
              <label className="flex justify-between items-center text-[9px] font-orbitron text-slate-400 uppercase tracking-widest">
                <span>Density</span>
                <span className="text-white/60">{config.density}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={config.density}
                onChange={(e) => updateConfig({ density: parseInt(e.target.value) })}
                className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex justify-between items-center text-[9px] font-orbitron text-slate-400 uppercase tracking-widest">
                <span>Audio</span>
                <button 
                  onClick={() => updateConfig({ isMuted: !config.isMuted })}
                  className={`transition-colors font-bold ${config.isMuted ? 'text-red-500' : 'text-cyan-400'}`}
                >
                  {config.isMuted ? 'MUTED' : `${config.volume}%`}
                </button>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={config.volume}
                disabled={config.isMuted}
                onChange={(e) => updateConfig({ volume: parseInt(e.target.value) })}
                className={`w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer transition-opacity ${config.isMuted ? 'opacity-20 pointer-events-none' : ''}`}
              />
            </div>
          </div>
          
          <button
            onClick={onClear}
            className="group flex items-center justify-center p-3 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 transition-all"
            title="Clear Simulation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
