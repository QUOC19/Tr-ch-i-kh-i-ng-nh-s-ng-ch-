import React from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { GameScreen } from '../types';

interface NavbarProps {
  currentScreen: GameScreen;
  onReset: () => void;
  elapsedSeconds: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onReset,
  elapsedSeconds,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getStageNumber = () => {
    switch (currentScreen) {
      case 'intro':
        return 0;
      case 'stage1':
        return 1;
      case 'stage2':
        return 2;
      case 'stage3':
        return 3;
      case 'result':
      case 'summary':
      case 'end':
        return 4;
    }
  };

  const currentStage = getStageNumber();

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b-2 border-amber-200/80 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-xs select-none z-30">
      {/* Brand & Badge */}
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-md shadow-amber-200 text-amber-950 font-black text-xl border-2 border-white">
          <Sparkles className="w-6 h-6 text-amber-900 fill-amber-300 animate-pulse" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-800 leading-none">
            NHÀ SÁNG CHẾ NHÍ
          </h1>
          <p className="text-[11px] font-bold text-amber-600 tracking-wide uppercase mt-0.5">
            Trò chơi khởi động 5-7 phút
          </p>
        </div>
      </div>

      {/* Progress Steps for primary school kids */}
      <div className="hidden md:flex items-center gap-2">
        {[
          { num: 1, label: 'Chặng 1: Ghép cặp' },
          { num: 2, label: 'Chặng 2: Dòng thời gian' },
          { num: 3, label: 'Chặng 3: Ai là ai?' },
        ].map((s) => {
          const isDone = currentStage > s.num;
          const isCurrent = currentStage === s.num;
          return (
            <div
              key={s.num}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition-all ${
                isCurrent
                  ? 'bg-amber-500 text-white shadow-sm shadow-amber-300 scale-105'
                  : isDone
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  isCurrent
                    ? 'bg-white text-amber-600'
                    : isDone
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isDone ? '✓' : s.num}
              </span>
              <span>{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Right Controls: Timer & Restart (No sound button per request) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {currentScreen !== 'intro' && currentScreen !== 'end' && (
          <div className="px-3 py-1 bg-amber-50 rounded-xl border border-amber-200 text-xs font-extrabold text-amber-800 flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>⏱ {formatTime(elapsedSeconds)}</span>
          </div>
        )}

        {currentScreen !== 'intro' && (
          <button
            onClick={onReset}
            title="Chơi lại từ đầu"
            aria-label="Chơi lại từ đầu"
            className="p-2 rounded-xl bg-slate-100 border-2 border-slate-300 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-all cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
