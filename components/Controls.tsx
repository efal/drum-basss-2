
import React, { useRef, useState } from 'react';
import { BassPattern, DrumPattern } from '../types';
import { BASS_PRESETS, DRUM_PRESETS } from '../presets';
import { SaveDialog } from './SaveDialog';

interface ControlsProps {
  isPlaying: boolean;
  tempo: number;
  octave: number;
  onPlayPause: () => void;
  onTempoChange: (newTempo: number) => void;
  onOctaveChange: (newOctave: number) => void;
  onClear: () => void;
  onSave: (fileName: string) => void;
  onLoad: (file: File) => void;
  onLoadDrumPreset: (pattern: DrumPattern) => void;
  onLoadBassPreset: (pattern: BassPattern) => void;
}

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const SaveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
  </svg>
);

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16h6v-6h4l-8-8-8 8h4v6zm-4 2h14v2H5v-2z" />
  </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  tempo,
  octave,
  onPlayPause,
  onTempoChange,
  onOctaveChange,
  onClear,
  onSave,
  onLoad,
  onLoadDrumPreset,
  onLoadBassPreset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onLoad(file);
    }
    event.target.value = '';
  };

  const handleDrumPresetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const presetName = event.target.value;
    const preset = DRUM_PRESETS.find(p => p.name === presetName);
    if (preset) {
      onLoadDrumPreset(preset.pattern);
    }
    event.target.value = '';
  };

  const handleBassPresetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const presetName = event.target.value;
    const preset = BASS_PRESETS.find(p => p.name === presetName);
    if (preset) {
      onLoadBassPreset(preset.pattern);
    }
    event.target.value = '';
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Row: Transport & Presets */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

        {/* Play & Tempo Group */}
        <div className="flex items-center gap-6 w-full lg:w-auto bg-[#0b1121] p-3 rounded-2xl border border-slate-800 shadow-inner">
          <button
            onClick={onPlayPause}
            className={`relative group w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${isPlaying
              ? 'bg-cyan-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.6)]'
              : 'bg-[#1e293b] text-cyan-500 border-2 border-slate-700 hover:border-cyan-500 hover:text-cyan-400'
              }`}
          >
            {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8 ml-1" />}
            {isPlaying && <div className="absolute inset-0 rounded-full animate-ping bg-cyan-500 opacity-20"></div>}
          </button>

          <div className="flex flex-col gap-1 flex-grow min-w-[120px]">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-slate-100 tabular-nums leading-none tracking-tighter">{tempo}</span>
              <span className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-widest">BPM</span>
            </div>
          </div>
        </div>

        {/* Presets & Octave Group */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full lg:w-auto">
          {/* Octave */}
          <div className="flex flex-col bg-[#0b1121] p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-wider pl-1 text-center">Octave</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((val) => (
                <label key={val} className={`cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${octave === val
                  ? 'bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg shadow-purple-500/20 scale-105'
                  : 'text-slate-500 bg-slate-900 hover:text-slate-300 hover:bg-slate-800'
                  }`}>
                  <input
                    type="radio"
                    name="octave"
                    value={val}
                    checked={octave === val}
                    onChange={() => onOctaveChange(val)}
                    className="hidden"
                  />
                  {val}
                </label>
              ))}
            </div>
          </div>

          {/* Preset Selectors */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-cyan-600 uppercase tracking-widest pl-1">DRUMS</span>
              <select
                onChange={handleDrumPresetChange}
                value=""
                className="h-10 w-36 bg-[#0b1121] hover:bg-slate-900 text-slate-300 text-xs font-bold rounded-lg px-3 border border-slate-800 focus:border-cyan-500 focus:outline-none cursor-pointer transition-colors"
              >
                <option value="" disabled>Load Kit...</option>
                {DRUM_PRESETS.map(preset => (
                  <option key={preset.name} value={preset.name}>{preset.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-fuchsia-600 uppercase tracking-widest pl-1">SYNTH</span>
              <select
                onChange={handleBassPresetChange}
                value=""
                className="h-10 w-36 bg-[#0b1121] hover:bg-slate-900 text-slate-300 text-xs font-bold rounded-lg px-3 border border-slate-800 focus:border-fuchsia-500 focus:outline-none cursor-pointer transition-colors"
              >
                <option value="" disabled>Load Patch...</option>
                {BASS_PRESETS.map(preset => (
                  <option key={preset.name} value={preset.name}>{preset.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right: File Actions */}
        <div className="flex items-center gap-2 bg-[#0b1121] p-2 rounded-xl border border-slate-800">
          <button onClick={onClear} className="h-10 w-10 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-rose-950/30 rounded-lg border border-transparent hover:border-rose-900 transition-all" title="Clear Pattern">
            <TrashIcon className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-slate-800 mx-1"></div>
          <button onClick={() => setShowSaveDialog(true)} className="h-10 w-10 flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:bg-cyan-950/30 rounded-lg border border-transparent hover:border-cyan-900 transition-all" title="Save Pattern">
            <SaveIcon className="w-5 h-5" />
          </button>
          <button onClick={handleLoadClick} className="h-10 w-10 flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:bg-cyan-950/30 rounded-lg border border-transparent hover:border-cyan-900 transition-all" title="Load Pattern">
            <UploadIcon className="w-5 h-5" />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
        </div>
      </div>

      {/* Bottom Row: Tempo Slider (Full Width) */}
      <div className="flex items-center gap-4 bg-[#0b1121] p-2 px-4 rounded-xl border border-slate-800">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Tempo Fine Tune</span>
        <input
          type="range"
          min="40"
          max="240"
          step="1"
          value={tempo}
          onChange={(e) => onTempoChange(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400"
        />
      </div>

      {/* Save Dialog */}
      <SaveDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={onSave}
        defaultName={`pattern-${new Date().toISOString().slice(0, 10)}`}
      />
    </div>
  );
};
