import React, { useState, useEffect } from 'react';

interface SaveDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
    defaultName?: string;
}

export const SaveDialog: React.FC<SaveDialogProps> = ({
    isOpen,
    onClose,
    onSave,
    defaultName = `pattern-${new Date().toISOString().slice(0, 10)}`
}) => {
    const [fileName, setFileName] = useState(defaultName);

    useEffect(() => {
        if (isOpen) {
            setFileName(defaultName);
        }
    }, [isOpen, defaultName]);

    const handleSave = () => {
        if (fileName.trim()) {
            onSave(fileName.trim());
            onClose();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative bg-[#111827] border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-[scale-in_0.2s_ease-out]">
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 rounded-t-2xl" />

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-2">
                        Pattern speichern
                    </h2>
                    <p className="text-sm text-slate-400">
                        Gib deinem Pattern einen Namen
                    </p>
                </div>

                {/* Input */}
                <div className="mb-6">
                    <label htmlFor="pattern-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Dateiname
                    </label>
                    <input
                        id="pattern-name"
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full bg-[#0b1121] border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                        placeholder="mein-pattern"
                        autoFocus
                    />
                    <p className="mt-2 text-xs text-slate-600">
                        Die Datei wird als <span className="text-cyan-500 font-mono">{fileName}.json</span> gespeichert
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold transition-colors"
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!fileName.trim()}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-400 hover:to-fuchsia-400 text-white rounded-lg font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Speichern
                    </button>
                </div>

                {/* Mobile hint */}
                <div className="mt-4 p-3 bg-slate-900/50 border border-slate-800 rounded-lg">
                    <p className="text-xs text-slate-500 text-center">
                        <span className="inline-block mr-1">📱</span>
                        Auf Mobilgeräten öffnet sich der native Share-Dialog
                    </p>
                </div>
            </div>

            <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
        </div>
    );
};
