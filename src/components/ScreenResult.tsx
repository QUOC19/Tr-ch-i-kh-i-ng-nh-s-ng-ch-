import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, Clock, RotateCcw, BookmarkCheck, ArrowRight, Award } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ScreenResultProps {
  elapsedSeconds: number;
  retryCount: number;
  onGoToSummary: () => void;
  onPlayAgain: () => void;
}

export const ScreenResult: React.FC<ScreenResultProps> = ({
  elapsedSeconds,
  retryCount,
  onGoToSummary,
  onPlayAgain,
}) => {
  useEffect(() => {
    sounds.playVictory();
    // Celebratory confetti shower
    const end = Date.now() + 1500;
    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const formatMinutesSeconds = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    if (mins === 0) return `${secs} giây`;
    return `${mins} phút ${secs} giây`;
  };

  // Star calculation (elementary school friendly: 3 stars for all!)
  const starsCount = retryCount <= 1 ? 3 : retryCount <= 4 ? 2 : 1;

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-4 sm:p-8 text-center select-none">
      {/* Trophy & Badge */}
      <div className="pt-2">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-200 border-4 border-white animate-bounce">
          <Trophy className="w-12 h-12 sm:w-14 sm:h-14 fill-amber-500 stroke-amber-900" />
        </div>
      </div>

      {/* Main Text */}
      <div className="my-auto max-w-xl space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-800 tracking-tight">
          HOÀN THÀNH!
        </h1>
        <p className="text-base sm:text-xl font-extrabold text-slate-600">
          Em đã vượt qua 3 thử thách về các nhà sáng chế tiêu biểu.
        </p>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2 pt-1 pb-2">
          {[1, 2, 3].map((star) => (
            <Star
              key={star}
              className={`w-9 h-9 sm:w-11 sm:h-11 transition-all ${
                star <= starsCount
                  ? 'fill-amber-400 text-amber-500 drop-shadow-md scale-110'
                  : 'fill-slate-200 text-slate-300'
              }`}
            />
          ))}
        </div>

        {/* Stats card */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto pt-2">
          <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-3 flex flex-col items-center justify-center shadow-xs">
            <div className="flex items-center gap-1.5 text-sky-700 text-xs font-black uppercase">
              <Clock className="w-4 h-4" />
              <span>Thời gian</span>
            </div>
            <div className="text-lg sm:text-2xl font-black text-sky-950 mt-1">
              {formatMinutesSeconds(elapsedSeconds)}
            </div>
          </div>

          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 flex flex-col items-center justify-center shadow-xs">
            <div className="flex items-center gap-1.5 text-amber-700 text-xs font-black uppercase">
              <Award className="w-4 h-4" />
              <span>Số lần thử lại</span>
            </div>
            <div className="text-lg sm:text-2xl font-black text-amber-950 mt-1">
              {retryCount} lần
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-4 pb-2 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
        <button
          onClick={onPlayAgain}
          className="px-5 py-3.5 rounded-2xl border-2 border-slate-300 bg-white text-slate-700 font-black text-sm sm:text-base hover:bg-slate-100 transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Chơi lại</span>
        </button>

        <button
          onClick={onGoToSummary}
          className="px-9 sm:px-12 py-4 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-lg sm:text-xl shadow-lg shadow-orange-300 active:scale-95 cursor-pointer flex items-center gap-2.5 border-3 border-white ring-4 ring-amber-300"
        >
          <BookmarkCheck className="w-6 h-6" />
          <span>GHI NHỚ</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
