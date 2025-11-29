
import React from 'react';
import { NUM_STEPS, NUM_NOTES } from '../constants';
import { PianoRollGrid } from '../types';

interface PianoRollProps {
  grid: PianoRollGrid;
  currentStep: number | null;
  isPlaying: boolean;
  onPadClick: (row: number, col: number) => void;
  synthVolume: number;
  onVolumeChange: (newVolume: number) => void;
  synthPan: number;
  onPanChange: (newPan: number) => void;
  synthType: OscillatorType;
  onSynthTypeChange: (newType: OscillatorType) => void;
  noteDuration: number;
  onNoteDurationChange: (newDuration: number) => void;
  filterType: BiquadFilterType;
  onFilterTypeChange: (newType: BiquadFilterType) => void;
  filterCutoff: number;
  onFilterCutoffChange: (newCutoff: number) => void;
  filterResonance: number;
  onFilterResonanceChange: (newResonance: number) => void;
  delayTime: number;
  onDelayTimeChange: (newTime: number) => void;
  delayFeedback: number;
  onDelayFeedbackChange: (newFeedback: number) => void;
  delayMix: number;
  onDelayMixChange: (newMix: number) => void;
  reverbMix: number;
  onReverbMixChange: (newMix: number) => void;
}

const NOTE_NAMES = ['B', 'A#', 'A', 'G#', 'G', 'F#', 'F', 'E', 'D#', 'D', 'C#', 'C'];
const IS_BLACK_KEY = [false, true, false, true, false, true, false, false, true, false, true, false];

const SYNTH_TYPES: { value: OscillatorType, label: string }[] = [
    { value: 'sawtooth', label: 'SAW' },
    { value: 'sine', label: 'SINE' },
    { value: 'square', label: 'SQR' },
    { value: 'triangle', label: 'TRI' },
];

const FILTER_TYPES: { value: BiquadFilterType, label: string }[] = [
    { value: 'lowpass', label: 'LPF' },
    { value: 'highpass', label: 'HPF' },
    { value: 'bandpass', label: 'BPF' },
];

const DURATION_OPTIONS = [
  { label: '1/8', value: 2, title: 'Half Beat (2 steps)' },
  { label: '1/4', value: 4, title: 'One Beat (4 steps)' },
  { label: '1/2', value: 8, title: 'Two Beats (8 steps)' },
];

const Pad: React.FC<{
  noteStatus: 'none' | 'start' | 'continuation';
  isCurrentStep: boolean;
  isPlaying: boolean;
  onClick: () => void;
}> = ({ noteStatus, isCurrentStep, isPlaying, onClick }) => {
  const baseClasses = 'w-full h-2 sm:h-3 rounded-sm transition-all duration-100 ease-in-out';
  
  let dynamicClasses;
  const isActive = noteStatus !== 'none';

  if (isActive) {
    if (isCurrentStep && isPlaying) {
      dynamicClasses = 'bg-white shadow-[0_0_10px_white]';
    } else if (noteStatus === 'start') {
      dynamicClasses = 'bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.5)]';
    } else { // continuation
      dynamicClasses = 'bg-fuchsia-500/50';
    }
  } else {
    // Inactive
     if (isCurrentStep && isPlaying) {
        dynamicClasses = 'bg-slate-700/50';
    } else {
        dynamicClasses = 'bg-slate-800/30 hover:bg-slate-700/50';
    }
  }

  return (
    <div className="flex items-center justify-center h-full">
        <button
            onClick={onClick}
            className={`${baseClasses} ${dynamicClasses}`}
            aria-pressed={isActive}
        />
    </div>
  );
};

interface EffectControlProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step: number;
    accentColor?: string;
}

const EffectControl: React.FC<EffectControlProps> = ({ label, value, onChange, min, max, step, accentColor = 'bg-fuchsia-500' }) => (
    <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between items-end">
            <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{label}</label>
             <span className="text-[9px] text-slate-400 font-mono">{Math.round(value * 100) / 100}</span>
        </div>
        <div className="relative h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
             <div 
                className={`absolute top-0 left-0 h-full ${accentColor}`} 
                style={{ width: `${((value - min) / (max - min)) * 100}%` }}
             ></div>
             <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
        </div>
    </div>
);


export const PianoRoll: React.FC<PianoRollProps> = ({
  grid, currentStep, isPlaying, onPadClick,
  synthVolume, onVolumeChange, synthPan, onPanChange, synthType, onSynthTypeChange,
  noteDuration, onNoteDurationChange,
  filterType, onFilterTypeChange, filterCutoff, onFilterCutoffChange,
  filterResonance, onFilterResonanceChange,
  delayTime, onDelayTimeChange, delayFeedback, onDelayFeedbackChange, delayMix, onDelayMixChange,
  reverbMix, onReverbMixChange,
}) => {
  return (
    <div className="flex flex-col gap-4">
      
      {/* Controls Panel (Bottom Style) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-[#151e32] p-4 rounded-xl border border-slate-800 shadow-xl">
            
            {/* OSC */}
            <div className="flex flex-col gap-3 p-2 border-r border-slate-800/50">
                <span className="text-[10px] text-fuchsia-400 font-bold uppercase">Oscillator</span>
                <div className="flex flex-col gap-2">
                    <select value={synthType} onChange={(e) => onSynthTypeChange(e.target.value as OscillatorType)}
                        className="w-full text-[10px] font-bold bg-slate-900 text-slate-300 rounded-md p-1.5 border border-slate-700 focus:outline-none focus:border-fuchsia-500 uppercase"
                    >
                        {SYNTH_TYPES.map(type => (<option key={type.value} value={type.value}>{type.label}</option>))}
                    </select>
                     <div className="flex gap-1 bg-slate-900 p-1 rounded-md border border-slate-800">
                        {DURATION_OPTIONS.map(({ label, value, title }) => (
                            <button key={value} onClick={() => onNoteDurationChange(value)} title={title}
                                className={`flex-1 py-1 text-[9px] font-bold rounded-sm transition-colors ${ noteDuration === value ? 'bg-fuchsia-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300' }`}
                            >{label}</button>
                        ))}
                    </div>
                </div>
            </div>

             {/* MAIN */}
            <div className="flex flex-col gap-3 p-2 border-r border-slate-800/50">
                <span className="text-[10px] text-fuchsia-400 font-bold uppercase">Main</span>
                <EffectControl label="Level" value={synthVolume} onChange={onVolumeChange} min={0} max={1} step={0.01} />
                <EffectControl label="Pan" value={synthPan} onChange={onPanChange} min={-1} max={1} step={0.1} accentColor="bg-violet-500" />
            </div>

            {/* FILTER */}
            <div className="flex flex-col gap-3 p-2 border-r border-slate-800/50">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase">Filter</span>
                    <select value={filterType} onChange={(e) => onFilterTypeChange(e.target.value as BiquadFilterType)}
                        className="text-[9px] font-bold bg-slate-900 text-slate-400 rounded p-0.5 border border-slate-700 uppercase focus:outline-none"
                    >
                        {FILTER_TYPES.map(type => (<option key={type.value} value={type.value}>{type.label}</option>))}
                    </select>
                 </div>
                <EffectControl label="Freq" value={filterCutoff} onChange={onFilterCutoffChange} min={20} max={20000} step={1} accentColor="bg-cyan-500" />
                <EffectControl label="Res" value={filterResonance} onChange={onFilterResonanceChange} min={0} max={20} step={0.1} accentColor="bg-cyan-500" />
            </div>

            {/* DELAY */}
            <div className="flex flex-col gap-3 p-2 border-r border-slate-800/50">
                 <span className="text-[10px] text-blue-400 font-bold uppercase">Delay</span>
                <EffectControl label="Mix" value={delayMix} onChange={onDelayMixChange} min={0} max={1} step={0.01} accentColor="bg-blue-500" />
                <div className="grid grid-cols-2 gap-2">
                     <EffectControl label="Time" value={delayTime} onChange={onDelayTimeChange} min={0} max={1} step={0.01} accentColor="bg-blue-500" />
                     <EffectControl label="Fdbk" value={delayFeedback} onChange={onDelayFeedbackChange} min={0} max={0.95} step={0.01} accentColor="bg-blue-500" />
                </div>
            </div>

             {/* REVERB */}
            <div className="flex flex-col gap-3 p-2">
                 <span className="text-[10px] text-indigo-400 font-bold uppercase">Space</span>
                <EffectControl label="Reverb" value={reverbMix} onChange={onReverbMixChange} min={0} max={1} step={0.01} accentColor="bg-indigo-500" />
            </div>
      </div>

      {/* Grid */}
      <div className="grid gap-1 items-center bg-[#0b1121] p-4 rounded-xl border border-slate-800"
        style={{ gridTemplateColumns: `40px repeat(${NUM_STEPS}, minmax(0, 1fr))` }}
      >
        {/* Note Labels & Grid */}
        {Array.from({ length: NUM_NOTES }).map((_, noteIndex) => (
          <React.Fragment key={noteIndex}>
            <div className={`flex items-center justify-end pr-2 text-[10px] font-mono h-4 sm:h-5
              ${IS_BLACK_KEY[noteIndex] ? 'text-slate-600' : 'text-slate-400 font-bold'}`}
            >
              {NOTE_NAMES[noteIndex]}
            </div>

            {Array.from({ length: NUM_STEPS }).map((_, stepIndex) => {
                 // Determine note rendering logic locally
                 let status: 'none' | 'start' | 'continuation' = 'none';
                 const duration = grid[noteIndex][stepIndex];
                 if (duration > 0) {
                     status = 'start';
                 } else {
                     // check for continuation
                      // Simple lookback is inefficient, but okay for 16 steps.
                      // Optimization: passed logic from parent is better, but keeping it contained here for styling update.
                      for (let k = 1; k < 16; k++) {
                          if (stepIndex - k >= 0) {
                              const prevDur = grid[noteIndex][stepIndex - k];
                              if (prevDur > k) {
                                  status = 'continuation';
                                  break;
                              }
                          }
                      }
                 }

                return (
                  <Pad
                    key={stepIndex}
                    noteStatus={status}
                    isCurrentStep={currentStep === stepIndex}
                    isPlaying={isPlaying}
                    onClick={() => onPadClick(noteIndex, stepIndex)}
                  />
                )
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
