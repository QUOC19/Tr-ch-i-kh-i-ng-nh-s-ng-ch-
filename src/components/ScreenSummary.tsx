import React from 'react';
import { BookmarkCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { SUMMARY_POINTS, INVENTORS_DATA } from '../data/gameData';
import { ImageWithFallback } from './IllustrationIcon';
import { sounds } from '../utils/audio';

interface ScreenSummaryProps {
  onComplete: () => void;
}

export const ScreenSummary: React.FC<ScreenSummaryProps> = ({ onComplete }) => {
  const handleComplete = () => {
    sounds.playCorrect();
    onComplete();
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-7 select-none">
      {/* Header */}
      <div className="text-center pb-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-black mb-1">
          <BookmarkCheck className="w-4 h-4 text-amber-600" />
          <span>KIẾN THỨC CẦN NHỚ</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight">
          GHI NHỚ TRỌNG TÂM
        </h2>
        <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5">
          4 mốc lịch sử sáng chế tiêu biểu em cần ghi nhớ
        </p>
      </div>

      {/* 4 Large Memorable Cards */}
      <div className="my-auto grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto w-full">
        {SUMMARY_POINTS.map((item, index) => {
          const inventor = INVENTORS_DATA.find((i) => i.name === item.inventor);
          return (
            <div
              key={index}
              className={`p-3.5 sm:p-4 rounded-3xl border-3 bg-white shadow-sm hover:shadow-md transition-all flex items-center gap-3.5 sm:gap-4 ${item.badgeColor}`}
            >
              {/* Photo */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-xs bg-slate-50">
                {inventor && (
                  <ImageWithFallback
                    src={inventor.image}
                    alt={inventor.name}
                    className="w-full h-full"
                  />
                )}
              </div>

              {/* Text content: Large, easily memorized */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${item.dotColor} shrink-0`} />
                  <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
                    {item.inventor}
                  </h3>
                </div>

                <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm sm:text-base font-extrabold capitalize text-slate-700">
                    {item.invention}
                  </span>
                  <span className="text-slate-400 font-bold text-xs">–</span>
                  <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm font-black text-slate-900 shadow-2xs">
                    Năm {item.year}
                  </span>
                </div>
              </div>

              <CheckCircle2 className={`w-6 h-6 shrink-0 ${item.iconColor}`} />
            </div>
          );
        })}
      </div>

      {/* Button */}
      <div className="pt-3 text-center">
        <button
          onClick={handleComplete}
          className="px-10 sm:px-14 py-4 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-lg sm:text-xl shadow-lg shadow-emerald-200 active:scale-95 cursor-pointer inline-flex items-center gap-2.5 border-3 border-white ring-4 ring-emerald-300"
        >
          <span>HOÀN THÀNH</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
