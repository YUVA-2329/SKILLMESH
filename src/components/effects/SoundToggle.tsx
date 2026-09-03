import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundEffects } from './SoundFeedback';

export const SoundToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [muted, setMuted] = useState(false);

  const toggle = () => {
    const isNowMuted = soundEffects.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      soundEffects.playChime();
    }
  };

  return (
    <button
      onClick={toggle}
      title={muted ? 'Enable micro-haptic sound effects' : 'Mute sound effects'}
      className={`p-2 rounded-xl glass-frost hover:bg-white text-[#44474e] hover:text-[#0058bc] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${className}`}
    >
      {muted ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-rose-500" />
          <span className="hidden sm:inline">Muted</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span className="hidden sm:inline text-emerald-700">Audio FX</span>
        </>
      )}
    </button>
  );
};
