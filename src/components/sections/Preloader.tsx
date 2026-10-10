import React, { useEffect, useState } from 'react';
import { sound } from '../../lib/audio';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phaseText, setPhaseText] = useState('Churning fresh cream...');
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 4;
        return next > 100 ? 100 : next;
      });
    }, 90);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress < 25) {
      setPhaseText('Churning heavy organic cream...');
    } else if (progress < 50) {
      setPhaseText('Simmering saffron threads & cardamom...');
    } else if (progress < 75) {
      setPhaseText('Folding in roasted green pistachios...');
    } else if (progress < 95) {
      setPhaseText('Deep-freezing conical moulds to -18°C...');
    } else {
      setPhaseText('Unmoulding on wooden stick · Served Cold & Fresh!');
    }

    if (progress === 100) {
      sound.playChime();
      const timeout = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onComplete, 700);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  const handleSkip = () => {
    setIsExiting(true);
    sound.playPop();
    setTimeout(onComplete, 400);
  };

  return (
    <div
      aria-label="Loading site presentation"
      className={`fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#FFFDF8] dark:bg-[#140D09] transition-all duration-700 ease-in-out ${
        isExiting ? '-translate-y-full opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center max-w-sm px-6 text-center">
        {/* Animated Kulfi Cone Illustration */}
        <div className="relative h-44 w-32 mb-8 flex flex-col items-center justify-end">
          {/* Wooden stick at bottom */}
          <div className="w-4 h-14 bg-[#D4A373] rounded-b-md shadow-xs relative -mt-2 z-0" />

          {/* Kulfi conical body with filling mask */}
          <div className="absolute top-0 w-28 h-36 overflow-hidden rounded-t-[40px] rounded-b-md border-2 border-[#1E1410]/15 dark:border-[#FFFDF8]/20 bg-[#FFF6E5]/40 dark:bg-[#271A13]/50">
            {/* The liquid filling up */}
            <div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#F4A300] via-[#FFB347] to-[#84C57E] transition-all duration-150 ease-out flex items-start justify-center overflow-hidden"
              style={{ height: `${progress}%` }}
            >
              {/* Dripping wavy top */}
              <div className="w-full h-3 bg-white/40 rounded-full blur-[1px] transform -translate-y-1" />

              {/* Pistachio crumbs floating inside */}
              <div className="absolute top-4 left-3 w-1.5 h-1.5 rounded-full bg-[#2E7D32]/80" />
              <div className="absolute top-8 right-4 w-2 h-1 rounded-sm bg-[#2E7D32]/80" />
              <div className="absolute top-14 left-6 w-1 h-2 rounded-xs bg-[#B71C1C]/70" />
            </div>

            {/* Frost gleam sheen overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-black/10 pointer-events-none" />
          </div>

          {/* Dripping drop at bottom tip */}
          <div className="absolute -bottom-4 w-2.5 h-3.5 bg-[#F4A300] rounded-full animate-drip" />
        </div>

        {/* Progress & Title */}
        <div className="flex items-center gap-3 mb-2">
          <span className="font-display text-2xl font-bold tracking-tight text-[#1E1410] dark:text-[#FFFDF8]">
            Kulfi Studio
          </span>
          <span className="font-mono text-sm font-semibold tabular-nums text-[#F4A300] px-2 py-0.5 rounded-md bg-[#F4A300]/10">
            {progress}%
          </span>
        </div>

        {/* Progress line */}
        <div className="w-64 h-1.5 bg-[#1E1410]/10 dark:bg-[#FFFDF8]/15 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-[#F4A300] via-[#84C57E] to-[#F7A8B8] transition-all duration-150 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-[#6B5548] dark:text-[#D4C3B7] h-6 flex items-center justify-center transition-all">
          {phaseText}
        </p>

        <button
          onClick={handleSkip}
          type="button"
          data-cursor="Skip"
          className="mt-6 text-xs font-mono uppercase tracking-wider text-[#9C8577] hover:text-[#F4A300] transition-colors py-1 px-3 rounded-full hover:bg-[#F4A300]/10"
        >
          Skip intro →
        </button>
      </div>
    </div>
  );
};
