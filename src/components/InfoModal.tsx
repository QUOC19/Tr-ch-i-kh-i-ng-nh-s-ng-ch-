import React from 'react';
import { X, BookOpen, Sparkles } from 'lucide-react';
import { INVENTORS_DATA } from '../data/gameData';
import { ImageWithFallback } from './IllustrationIcon';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in select-none">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border-4 border-amber-300 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-100 to-yellow-50 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">
                Góc Tìm Hiểu: Các Nhà Sáng Chế Tiêu Biểu
              </h3>
              <p className="text-xs font-bold text-amber-700">
                Thông tin từ sách bài học lịch sử phát minh
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center font-black cursor-pointer border border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {INVENTORS_DATA.map((inv, idx) => (
            <div
              key={inv.id}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 flex flex-col sm:flex-row gap-3.5 items-start bg-slate-50 ${inv.borderColor}`}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 border-white shadow-xs bg-white">
                <ImageWithFallback
                  src={inv.image}
                  alt={inv.name}
                  className="w-full h-full"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black px-2 py-0.5 rounded-md bg-white border text-slate-700">
                    #{idx + 1}
                  </span>
                  <h4 className="text-base font-black text-slate-900">
                    {inv.name} ({inv.originalName})
                  </h4>
                  <span className="text-xs font-bold text-slate-500">
                    {inv.years}
                  </span>
                </div>

                <div className="mt-1 text-xs sm:text-sm font-bold text-slate-600 space-y-1">
                  <p>
                    <span className="text-slate-400">Quốc gia & nghề nghiệp:</span>{' '}
                    <span className="text-slate-800">{inv.profession} người {inv.country}</span>
                  </p>
                  <p>
                    <span className="text-slate-400">Sáng chế:</span>{' '}
                    <span className="text-amber-700 font-black">{inv.inventionName}</span> (cấp bằng năm {inv.patentYear})
                  </p>
                  <p className="text-slate-700 text-xs italic bg-white p-2 rounded-xl border border-slate-200 mt-1">
                    "{inv.funFact}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm cursor-pointer"
          >
            Đã hiểu, quay lại trò chơi
          </button>
        </div>
      </div>
    </div>
  );
};
