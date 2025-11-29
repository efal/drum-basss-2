
import React, { useState, useEffect } from 'react';
import { Controls } from './components/Controls';
import { PianoRoll } from './components/PianoRoll';
import { SequencerGrid } from './components/SequencerGrid';
import { useSequencer } from './hooks/useDrumMachine';

const OfflineIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.99 9.19c-1.73-1.73-3.93-2.97-6.34-3.46L12 1 7.35 5.73C4.94 6.22 2.74 7.46 1.01 9.19c-.2.2-.2.51 0 .71l1.41 1.41c.2.2.51.2.71 0 1.78-1.78 4.16-2.83 6.68-2.83 1.28 0 2.5.27 3.63.76l5.3 5.3c.2.2.51.2.71 0l1.41-1.41c.2-.2.2-.51 0-.71l-1.41-1.41c.38-.16.77-.29 1.16-.4.39-.11.78-.19 1.17-.24v-1.17zM12 13.5l4.5 4.5c.2.2.51.2.71 0l1.41-1.41c.2-.2.2-.51 0-.71L12 9.27 5.38 15.89c-.2.2-.2.51 0 .71l1.41 1.41c.2.2.51.2.71 0L12 13.5z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const {
    isReady,
    initialize,
    isLoading,
    loadingMessage,
    isPlaying,
    tempo,
    currentStep,
    drumGrid,
    selectedSounds,
    trackVolumes,
    trackPans,
    soloedTracks,
    pianoRollGrid,
    octave,
    synthVolume,
    synthPan,
    synthType,
    noteDuration,
    filterType,
    filterCutoff,
    filterResonance,
    delayTime,
    delayFeedback,
    delayMix,
    reverbMix,
    handlePlayPause,
    handleTempoChange,
    clearPattern,
    savePattern,
    loadPattern,
    loadDrumPreset,
    loadBassPreset,
    toggleDrumPad,
    handleSoundChange,
    handleTrackVolumeChange,
    handleTrackPanChange,
    handleSoloTrack,
    handlePreviewSample,
    handleStopPreview,
    togglePianoRollPad,
    handleOctaveChange,
    handleSynthVolumeChange,
    handleSynthPanChange,
    handleSynthTypeChange,
    handleNoteDurationChange,
    handleFilterTypeChange,
    handleFilterCutoffChange,
    handleFilterResonanceChange,
    handleDelayTimeChange,
    handleDelayFeedbackChange,
    handleDelayMixChange,
    handleReverbMixChange,
  } = useSequencer();

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#0b1121] text-white flex flex-col items-center justify-center p-4 font-sans">
        <div className="text-center relative z-10">
             {!isOnline && (
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-rose-900/50 border border-rose-500/50 text-rose-200 px-4 py-2 rounded-full text-sm flex items-center gap-2 whitespace-nowrap backdrop-blur-md">
                    <OfflineIcon className="w-4 h-4" />
                    <span>Offline Mode</span>
                </div>
            )}
            <div className="mb-8 relative">
                <div className="absolute inset-0 bg-cyan-500 blur-[80px] opacity-20 rounded-full"></div>
                <h1 className="relative text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-200 to-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    NEXUS<span className="text-cyan-500">BEAT</span>
                </h1>
            </div>

            {isLoading ? (
                 <>
                    <div className="relative w-20 h-20 mx-auto mb-8">
                        <div className="absolute inset-0 border-2 border-slate-800/50 rounded-full"></div>
                        <div className="absolute inset-0 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(6,182,212,0.4)]"></div>
                    </div>
                    <p className="text-cyan-400 font-mono tracking-widest text-sm uppercase animate-pulse">{loadingMessage}</p>
                </>
            ) : (
                <button 
                    onClick={initialize}
                    className="group relative px-12 py-6 bg-cyan-500/10 overflow-hidden rounded-full transition-all duration-300 hover:scale-105 active:scale-95 border border-cyan-500/50 hover:border-cyan-400 hover:shadow-[0_0_40px_-5px_rgba(6,182,212,0.6)]"
                >
                    <span className="relative text-xl font-bold text-cyan-300 tracking-[0.2em] group-hover:text-white transition-colors">INITIALIZE</span>
                </button>
            )}
            {loadingMessage.startsWith('Error') && !isLoading && (
              <p className="mt-6 text-rose-400 font-mono bg-rose-950/40 px-4 py-2 rounded border border-rose-900/50">{loadingMessage}</p>
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1121] text-slate-300 flex flex-col items-center font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* Top Navigation Bar */}
      <nav className="w-full h-16 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_cyan]"></div>
            <h1 className="text-xl font-bold tracking-widest text-slate-100">NEXUS<span className="text-cyan-500">BEAT</span></h1>
          </div>
          <div className="flex items-center gap-4">
             {!isOnline && (
                <div className="hidden md:flex items-center gap-2 text-rose-400 text-[10px] font-bold uppercase tracking-wider border border-rose-900/50 bg-rose-950/20 px-3 py-1 rounded-full">
                    <OfflineIcon className="w-3 h-3" />
                    <span>Offline</span>
                </div>
            )}
          </div>
      </nav>

      <div className="w-full max-w-[1400px] flex flex-col p-2 md:p-6 gap-6">
        
        {/* Main Controls Dashboard */}
        <section className="bg-[#111827] rounded-2xl border border-slate-800 shadow-2xl p-1 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 opacity-50"></div>
             <div className="p-4 md:p-6 bg-gradient-to-b from-[#162036] to-[#0f172a] rounded-xl">
                <Controls
                    isPlaying={isPlaying}
                    tempo={tempo}
                    octave={octave}
                    onPlayPause={handlePlayPause}
                    onTempoChange={handleTempoChange}
                    onOctaveChange={handleOctaveChange}
                    onClear={clearPattern}
                    onSave={savePattern}
                    onLoad={loadPattern}
                    onLoadDrumPreset={loadDrumPreset}
                    onLoadBassPreset={loadBassPreset}
                />
            </div>
        </section>

        {/* Sequencer Section */}
        <main className="grid gap-6">
            <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                <div className="px-6 py-3 bg-[#151e32] border-b border-slate-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rhythm Matrix</span>
                </div>
                <div className="p-4 md:p-6 bg-[#0b1121]">
                    <SequencerGrid
                        grid={drumGrid}
                        currentStep={currentStep}
                        isPlaying={isPlaying}
                        onPadClick={toggleDrumPad}
                        selectedSounds={selectedSounds}
                        onSoundChange={handleSoundChange}
                        trackVolumes={trackVolumes}
                        onVolumeChange={handleTrackVolumeChange}
                        trackPans={trackPans}
                        onPanChange={handleTrackPanChange}
                        soloedTracks={soloedTracks}
                        onSoloTrack={handleSoloTrack}
                        onPreviewSample={handlePreviewSample}
                        onStopPreview={handleStopPreview}
                    />
                </div>
            </div>

            {/* Synth Section */}
            <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                 <div className="px-6 py-3 bg-[#151e32] border-b border-slate-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-fuchsia-500 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bass Engine</span>
                </div>
                <div className="p-4 md:p-6 bg-[#0b1121]">
                    <PianoRoll
                        grid={pianoRollGrid}
                        currentStep={currentStep}
                        isPlaying={isPlaying}
                        onPadClick={togglePianoRollPad}
                        synthVolume={synthVolume}
                        onVolumeChange={handleSynthVolumeChange}
                        synthPan={synthPan}
                        onPanChange={handleSynthPanChange}
                        synthType={synthType}
                        onSynthTypeChange={handleSynthTypeChange}
                        noteDuration={noteDuration}
                        onNoteDurationChange={handleNoteDurationChange}
                        filterType={filterType}
                        onFilterTypeChange={handleFilterTypeChange}
                        filterCutoff={filterCutoff}
                        onFilterCutoffChange={handleFilterCutoffChange}
                        filterResonance={filterResonance}
                        onFilterResonanceChange={handleFilterResonanceChange}
                        delayTime={delayTime}
                        onDelayTimeChange={handleDelayTimeChange}
                        delayFeedback={delayFeedback}
                        onDelayFeedbackChange={handleDelayFeedbackChange}
                        delayMix={delayMix}
                        onDelayMixChange={handleDelayMixChange}
                        reverbMix={reverbMix}
                        onReverbMixChange={handleReverbMixChange}
                    />
                </div>
            </div>
        </main>

        <footer className="text-center py-8 text-[10px] text-slate-600 font-mono tracking-widest uppercase">
          <p>Nexus Audio Workstation // v2.0.4 // Ready</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
