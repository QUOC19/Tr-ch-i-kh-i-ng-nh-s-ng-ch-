import React from 'react';
import { RotateCcw, Heart, Sparkles, Award } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ScreenEndProps {
  onPlayAgain: () => void;
}

export const ScreenEnd: React.FC<ScreenEndProps> = ({ onPlayAgain }) => {
  const handleRestart = () => {
    sounds.playClick();
    onPlayAgain();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-6 sm:p-10 text-center select-none">
      {/* Top mascot badge */}
      <div className="pt-2">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-sky-400 to-emerald-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-sky-200 border-4 border-white animate-pulse">
          <Heart className="w-11 h-11 fill-rose-500 stroke-white" />
        </div>
      </div>

      {/* Main text */}
      <div className="my-auto max-w-xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black border border-emerald-300 shadow-2xs">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Sẵn sàng cho bài học mới</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-800 leading-tight">
          Tuyệt vời lắm!
        </h1>

        <p className="text-lg sm:text-2xl font-extrabold text-slate-600 leading-relaxed">
          Em đã hoàn thành hoạt động khởi động.
        </p>

        <p className="text-sm sm:text-base font-bold text-slate-400 max-w-md mx-auto">
          Chúc em có một tiết học Công nghệ thật hào hứng, sáng tạo và tiếp thu thêm nhiều phát minh mới!
        </p>
      </div>

      {/* Play Again button */}
      <div className="pt-4 pb-2">
        <button
          onClick={handleRestart}
          className="group px-10 sm:px-14 py-4 sm:py-5 rounded-3xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-xl sm:text-2xl shadow-xl shadow-indigo-200 active:scale-95 cursor-pointer inline-flex items-center gap-3 border-3 border-white ring-4 ring-indigo-200 transition-all"
        >
          <RotateCcw className="w-6 h-6 group-hover:-rotate-90 transition-transform" />
          <span>CHƠI LẠI</span>
        </button>
      </div>
    </div>
  );
};
