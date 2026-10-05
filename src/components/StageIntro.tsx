import React from 'react';
import { Play, Sparkles, Award, Lightbulb, Compass } from 'lucide-react';
import { INVENTORS_DATA } from '../data/gameData';
import { ImageWithFallback } from './IllustrationIcon';

interface StageIntroProps {
  onStart: () => void;
}

export const StageIntro: React.FC<StageIntroProps> = ({ onStart }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-4 sm:p-8 text-center select-none">
      {/* Top Banner Tag */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 border-2 border-amber-300 font-extrabold text-sm shadow-xs animate-bounce">
        <Sparkles className="w-4 h-4 text-amber-600 fill-amber-400" />
        <span>Trò chơi học tập tương tác – Dành cho học sinh tiểu học</span>
        <Sparkles className="w-4 h-4 text-amber-600 fill-amber-400" />
      </div>

      {/* Main Title & Subtitle */}
      <div className="my-auto max-w-3xl space-y-4">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight drop-shadow-xs leading-tight">
          <span className="block text-sky-600">KHỞI ĐỘNG</span>
          <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
            NHÀ SÁNG CHẾ NHÍ
          </span>
        </h1>

        <p className="text-base sm:text-xl font-bold text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Em hãy vượt qua 3 thử thách để ôn lại những nhà sáng chế tiêu biểu nhé!
        </p>

        {/* 4 Inventors Preview Avatars */}
        <div className="pt-2 flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
          {INVENTORS_DATA.map((inv) => (
            <div
              key={inv.id}
              className="flex flex-col items-center group transition-transform hover:scale-105"
            >
              <div
                className={`w-14 h-14 sm:w-18 sm:h-18 rounded-2xl p-1 bg-white border-3 shadow-md transition-shadow group-hover:shadow-lg ${inv.borderColor}`}
              >
                <ImageWithFallback
                  src={inv.image}
                  alt={inv.name}
                  className="w-full h-full rounded-xl overflow-hidden"
                />
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-slate-700 mt-1.5">
                {inv.name}
              </span>
            </div>
          ))}
        </div>

        {/* 3 Challenge Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto pt-3">
          <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-2.5 flex items-center gap-2.5 text-left">
            <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black text-sm shrink-0">
              1
            </div>
            <div>
              <div className="text-xs font-black text-sky-900">Ghép đúng thật nhanh</div>
              <div className="text-[11px] text-sky-700">Ghép nhà sáng chế & sáng chế</div>
            </div>
          </div>

          <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-2.5 flex items-center gap-2.5 text-left">
            <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center font-black text-sm shrink-0">
              2
            </div>
            <div>
              <div className="text-xs font-black text-pink-900">Dòng thời gian bí mật</div>
              <div className="text-[11px] text-pink-700">Kéo mốc năm 1784 - 1886</div>
            </div>
          </div>

          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-2.5 flex items-center gap-2.5 text-left">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm shrink-0">
              3
            </div>
            <div>
              <div className="text-xs font-black text-emerald-900">Ai là ai?</div>
              <div className="text-[11px] text-emerald-700">3 câu trắc nghiệm thú vị</div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="pt-4 pb-2">
        <button
          onClick={onStart}
          className="group relative inline-flex items-center gap-3 px-10 sm:px-14 py-4 sm:py-5 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xl sm:text-2xl shadow-lg shadow-orange-300/50 hover:shadow-orange-400/60 transform transition-all active:scale-95 cursor-pointer border-3 border-white ring-4 ring-amber-300/40"
        >
          <Play className="w-7 h-7 fill-white stroke-white group-hover:translate-x-1 transition-transform" />
          <span>BẮT ĐẦU</span>
        </button>
      </div>
    </div>
  );
};
