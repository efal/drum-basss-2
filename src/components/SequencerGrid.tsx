
import React from 'react';
import { NUM_STEPS, SOUND_LIBRARY } from '../constants';
import { DrumGrid, DrumSound } from '../types';

interface SequencerGridProps {
  grid: DrumGrid;
  currentStep: number | null;
  isPlaying: boolean;
  onPadClick: (row: number, col: number) => void;
  selectedSounds: DrumSound[];
  onSoundChange: (trackIndex: number, newSound: DrumSound) => void;
  trackVolumes: number[];
  onVolumeChange: (trackIndex: number, newVolume: number) => void;
  trackPans: number[];
  onPanChange: (trackIndex: number, newPan: number) => void;
  soloedTracks: boolean[];
  onSoloTrack: (trackIndex: number) => void;
  onPreviewSample: (sound: DrumSound, volume: number) => void;
  onStopPreview: () => void;
}

const Pad: React.FC<{
  isActive: boolean;
  isCurrentStep: boolean;
  isPlaying: boolean;
  colorClass: string;
  glowClass: string;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = ({ isActive, isCurrentStep, isPlaying, colorClass, glowClass, onClick, onMouseEnter, onMouseLeave }) => {
  
  let dynamicClasses;

  if (isActive) {
    if (isCurrentStep && isPlaying) {
      dynamicClasses = `bg-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10`;
    } else {
      dynamicClasses = `${colorClass} ${glowClass}`;
    }
  } else {
    // Inactive state
    if (isCurrentStep && isPlaying) {
         dynamicClasses = 'bg-slate-700 ring-1 ring-slate-500 scale-105';
    } else {
        dynamicClasses = 'bg-[#151e32] ring-1 ring-[#2a364f] hover:ring-slate-500 hover:bg-[#1e293b]';
    }
  }

  return (
    <div className="flex items-center justify-center aspect-square p-[2px]">
        <button
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`w-full h-full rounded-full transition-all duration-100 ease-out ${dynamicClasses}`}
            aria-pressed={isActive}
        />
    </div>
  );
};


// Color definitions for each track row
const ROW_THEMES = [
    { color: 'bg-rose-500', glow: 'shadow-[0_0_10px_rgba(244,63,94,0.6)]', accent: 'text-rose-500', border: 'focus:ring-rose-500' },
    { color: 'bg-cyan-500', glow: 'shadow-[0_0_10px_rgba(6,182,212,0.6)]', accent: 'text-cyan-500', border: 'focus:ring-cyan-500' },
    { color: 'bg-amber-400', glow: 'shadow-[0_0_10px_rgba(251,191,36,0.6)]', accent: 'text-amber-400', border: 'focus:ring-amber-400' },
    { color: 'bg-violet-500', glow: 'shadow-[0_0_10px_rgba(139,92,246,0.6)]', accent: 'text-violet-500', border: 'focus:ring-violet-500' },
];

export const SequencerGrid: React.FC<SequencerGridProps> = ({
  grid,
  currentStep,
  isPlaying,
  onPadClick,
  selectedSounds,
  onSoundChange,
  trackVolumes,
  onVolumeChange,
  trackPans,
  onPanChange,
  soloedTracks,
  onSoloTrack,
  onPreviewSample,
  onStopPreview,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Step Numbers (Timeline) */}
      <div className="grid gap-1 sm:gap-2 pl-[240px]" style={{ gridTemplateColumns: `repeat(${NUM_STEPS}, minmax(0, 1fr))` }}>
        {Array.from({ length: NUM_STEPS }).map((_, stepIndex) => (
            <div
            key={stepIndex}
            className={`text-center text-[10px] font-mono py-1 rounded-sm transition-colors duration-100 ${
                currentStep === stepIndex && isPlaying 
                ? 'text-white bg-slate-700' 
                : stepIndex % 4 === 0 ? 'text-slate-500 font-bold' : 'text-slate-700'
            }`}
            >
            {stepIndex + 1}
            </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {selectedSounds.map((soundId, soundIndex) => {
            const theme = ROW_THEMES[soundIndex % ROW_THEMES.length];
            
            return (
                <div key={soundIndex} className="grid items-center gap-1 sm:gap-2" style={{ gridTemplateColumns: `minmax(240px, 1fr) repeat(${NUM_STEPS}, minmax(0, 1fr))` }}>
                
                {/* Controls Column */}
                <div className="bg-[#151e32] rounded-lg p-2 border border-slate-800 flex items-center justify-between gap-3 mr-2 shadow-inner">
                    <div className="flex flex-col w-full overflow-hidden">
                        <div className="flex items-center justify-between mb-1">
                             {/* Sound Selector */}
                            <select
                                value={soundId}
                                onChange={(e) => onSoundChange(soundIndex, e.target.value)}
                                className={`bg-transparent text-xs font-bold uppercase ${theme.accent} focus:outline-none cursor-pointer w-24 truncate`}
                            >
                                {Object.entries(SOUND_LIBRARY).map(([category, sounds]) => (
                                    <optgroup label={category} key={category} className="bg-slate-800 text-slate-300">
                                    {sounds.map((sound) => (
                                        <option key={sound.id} value={sound.id}>
                                        {sound.name}
                                        </option>
                                    ))}
                                    </optgroup>
                                ))}
                            </select>
                             {/* Solo Button */}
                             <button
                                onClick={() => onSoloTrack(soundIndex)}
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                    soloedTracks[soundIndex]
                                    ? 'bg-yellow-500 text-black border-yellow-500'
                                    : 'bg-transparent text-slate-600 border-slate-700 hover:text-slate-400'
                                }`}
                                >
                                S
                            </button>
                        </div>

                        {/* Sliders */}
                        <div className="flex gap-2">
                             <div className="flex-1 flex flex-col gap-0.5">
                                 <label className="text-[8px] text-slate-600 font-mono">VOL</label>
                                 <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={trackVolumes[soundIndex]}
                                    onChange={(e) => onVolumeChange(soundIndex, parseFloat(e.target.value))}
                                    className={`w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:${theme.color}`}
                                />
                             </div>
                             <div className="flex-1 flex flex-col gap-0.5">
                                 <label className="text-[8px] text-slate-600 font-mono">PAN</label>
                                 <input
                                    type="range"
                                    min="-1"
                                    max="1"
                                    step="0.1"
                                    value={trackPans[soundIndex]}
                                    onChange={(e) => onPanChange(soundIndex, parseFloat(e.target.value))}
                                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-400"
                                />
                             </div>
                        </div>
                    </div>
                </div>

                {/* Grid Pads */}
                {Array.from({ length: NUM_STEPS }).map((_, stepIndex) => (
                    <Pad
                    key={stepIndex}
                    isActive={grid[soundIndex][stepIndex]}
                    isCurrentStep={currentStep === stepIndex}
                    isPlaying={isPlaying}
                    colorClass={theme.color}
                    glowClass={theme.glow}
                    onClick={() => onPadClick(soundIndex, stepIndex)}
                    onMouseEnter={() => onPreviewSample(soundId, trackVolumes[soundIndex])}
                    onMouseLeave={onStopPreview}
                    />
                ))}
                </div>
            );
        })}
      </div>
    </div>
  );
};
