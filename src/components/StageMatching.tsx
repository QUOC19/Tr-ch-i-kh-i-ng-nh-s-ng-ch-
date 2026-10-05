import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Check, Sparkles, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { INVENTORS_DATA, INVENTIONS_DATA } from '../data/gameData';
import { ImageWithFallback } from './IllustrationIcon';
import { sounds } from '../utils/audio';

interface StageMatchingProps {
  onComplete: () => void;
  onWrongAttempt: () => void;
}

// Visual color themes for matched pairs
const PAIR_THEMES: Record<string, { bg: string; border: string; text: string; lightBg: string }> = {
  watt: {
    bg: 'bg-amber-500',
    border: 'border-amber-500',
    text: 'text-amber-800',
    lightBg: 'bg-amber-50',
  },
  benz: {
    bg: 'bg-purple-600',
    border: 'border-purple-600',
    text: 'text-purple-800',
    lightBg: 'bg-purple-50',
  },
  bell: {
    bg: 'bg-pink-500',
    border: 'border-pink-500',
    text: 'text-pink-800',
    lightBg: 'bg-pink-50',
  },
  edison: {
    bg: 'bg-emerald-600',
    border: 'border-emerald-600',
    text: 'text-emerald-800',
    lightBg: 'bg-emerald-50',
  },
};

export const StageMatching: React.FC<StageMatchingProps> = ({ onComplete, onWrongAttempt }) => {
  const [selectedInventorId, setSelectedInventorId] = useState<string | null>(null);
  const [selectedInventionId, setSelectedInventionId] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // holds inventor IDs that are matched
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'wrong' | null;
    message: string;
  }>({
    type: null,
    message: '',
  });
  const [shakingCard, setShakingCard] = useState<string | null>(null);
  const [showNextModal, setShowNextModal] = useState(false);

  // Inventions order can be gently shuffled or preset in textbook order
  // Image A shows: 1) Bóng đèn sợi đốt, 2) Động cơ hơi nước, 3) Điện thoại, 4) Ô tô
  const inventionsOrdered = [
    INVENTIONS_DATA.find((i) => i.id === 'lightbulb')!,
    INVENTIONS_DATA.find((i) => i.id === 'steam_engine')!,
    INVENTIONS_DATA.find((i) => i.id === 'telephone')!,
    INVENTIONS_DATA.find((i) => i.id === 'automobile')!,
  ];

  const handleSelectInventor = (id: string) => {
    if (matchedPairs.includes(id)) return;
    sounds.playClick();
    setSelectedInventorId(id);

    // If an invention was already picked, check the match immediately
    if (selectedInventionId) {
      checkPair(id, selectedInventionId);
    }
  };

  const handleSelectInvention = (id: string) => {
    // Find inventor for this invention
    const inv = INVENTIONS_DATA.find((item) => item.id === id);
    if (!inv || matchedPairs.includes(inv.inventorId)) return;

    sounds.playClick();
    setSelectedInventionId(id);

    // If an inventor was already picked, check the match immediately
    if (selectedInventorId) {
      checkPair(selectedInventorId, id);
    }
  };

  const checkPair = (inventorId: string, inventionId: string) => {
    const inventor = INVENTORS_DATA.find((i) => i.id === inventorId);
    const invention = INVENTIONS_DATA.find((i) => i.id === inventionId);

    if (inventor && invention && inventor.inventionId === invention.id) {
      // CORRECT!
      sounds.playCorrect();
      const updated = [...matchedPairs, inventorId];
      setMatchedPairs(updated);
      setSelectedInventorId(null);
      setSelectedInventionId(null);
      setFeedback({
        type: 'correct',
        message: 'Chính xác! Giỏi lắm!',
      });

      // If all 4 are matched
      if (updated.length === 4) {
        sounds.playVictory();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        setTimeout(() => {
          setShowNextModal(true);
        }, 600);
      }
    } else {
      // WRONG!
      sounds.playWrong();
      onWrongAttempt();
      setShakingCard(inventorId);
      setFeedback({
        type: 'wrong',
        message: 'Chưa đúng rồi. Em thử lại nhé!',
      });

      setTimeout(() => {
        setShakingCard(null);
        setSelectedInventorId(null);
        setSelectedInventionId(null);
      }, 700);
    }
  };

  const resetStage = () => {
    setSelectedInventorId(null);
    setSelectedInventionId(null);
    setMatchedPairs([]);
    setFeedback({ type: null, message: '' });
    setShowNextModal(false);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-5 select-none relative">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-sky-500 text-white font-black text-xs">
              CHẶNG 1
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              GHÉP ĐÚNG THẬT NHANH
            </h2>
          </div>
          <p className="text-sm font-bold text-slate-500 mt-0.5">
            Hãy ghép mỗi nhà sáng chế với sáng chế phù hợp (bấm chọn 1 nhà sáng chế rồi bấm sáng chế tương ứng).
          </p>
        </div>

        {/* Feedback pill */}
        <div className="min-h-9 flex items-center">
          {feedback.type === 'correct' && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full font-black text-sm animate-bounce shadow-xs">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{feedback.message}</span>
            </div>
          )}
          {feedback.type === 'wrong' && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 border border-rose-300 text-rose-800 rounded-full font-black text-sm animate-shake shadow-xs">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{feedback.message}</span>
            </div>
          )}
          {!feedback.type && (
            <div className="text-xs font-bold text-slate-400">
              Đã ghép: <span className="text-sky-600 font-black">{matchedPairs.length}/4</span> cặp
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Left = 4 Inventors, Right = 4 Inventions */}
      <div className="my-auto py-2 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column: 4 Thẻ Nhà Sáng Chế */}
        <div className="space-y-2.5">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
            <span>Danh sách Nhà Sáng Chế:</span>
            <span className="text-slate-400 font-bold">1 - 4</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {INVENTORS_DATA.map((inv, index) => {
              const isMatched = matchedPairs.includes(inv.id);
              const isSelected = selectedInventorId === inv.id;
              const isShaking = shakingCard === inv.id;
              const theme = PAIR_THEMES[inv.id];

              return (
                <button
                  key={inv.id}
                  onClick={() => handleSelectInventor(inv.id)}
                  disabled={isMatched}
                  className={`relative p-2.5 rounded-2xl border-3 flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                    isMatched
                      ? `${theme.lightBg} ${theme.border} ring-2 ring-emerald-400/50 cursor-default opacity-95`
                      : isSelected
                      ? 'bg-amber-50 border-amber-500 shadow-md ring-4 ring-amber-300/60 scale-[1.02]'
                      : 'bg-white border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 shadow-xs hover:shadow-md'
                  } ${isShaking ? 'animate-wiggle border-rose-400 bg-rose-50' : ''}`}
                >
                  {/* Photo or vector illustration */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 border-2 border-slate-100 bg-slate-50">
                    <ImageWithFallback
                      src={inv.image}
                      alt={inv.name}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Name and index */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-slate-800 truncate">
                        {inv.name}
                      </h4>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 truncate mt-0.5">
                      ({inv.years})
                    </p>
                  </div>

                  {/* Matched checkmark badge */}
                  {isMatched && (
                    <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow-xs animate-scale-up">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: 4 Thẻ Sáng Chế */}
        <div className="space-y-2.5">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
            <span>Danh sách Sáng Chế:</span>
            <span className="text-slate-400 font-bold">a - d</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {inventionsOrdered.map((item, index) => {
              const letter = String.fromCharCode(97 + index); // a, b, c, d
              const isMatched = matchedPairs.includes(item.inventorId);
              const isSelected = selectedInventionId === item.id;
              const theme = PAIR_THEMES[item.inventorId];

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectInvention(item.id)}
                  disabled={isMatched}
                  className={`relative p-2.5 rounded-2xl border-3 flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                    isMatched
                      ? `${theme.lightBg} ${theme.border} ring-2 ring-emerald-400/50 cursor-default opacity-95`
                      : isSelected
                      ? 'bg-amber-50 border-amber-500 shadow-md ring-4 ring-amber-300/60 scale-[1.02]'
                      : 'bg-white border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 shadow-xs hover:shadow-md'
                  }`}
                >
                  {/* Invention Image */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 border-2 border-slate-100 bg-slate-50">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Name and letter */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center shrink-0">
                        {letter}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-slate-800 truncate">
                        {item.name}
                      </h4>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 truncate mt-0.5">
                      Năm cấp: {item.patentYear}
                    </p>
                  </div>

                  {/* Matched checkmark */}
                  {isMatched && (
                    <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow-xs animate-scale-up">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Progress bar and helper */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold">
        <span>Gợi ý: Bấm 1 thẻ bên trái rồi bấm 1 thẻ bên phải để ghép đôi.</span>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-6 h-2 rounded-full transition-all ${
                idx < matchedPairs.length ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Transition Modal / Dialog when Completed */}
      {showNextModal && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-40 p-4 rounded-2xl animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center border-4 border-amber-300 shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-3 border-emerald-300 animate-bounce">
              <Sparkles className="w-8 h-8 fill-emerald-400" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-800">
                Xuất sắc!
              </h3>
              <p className="text-base font-bold text-slate-600 mt-1">
                Em đã hoàn thành Chặng 1!
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Cả 4 cặp nhà sáng chế và phát minh đã được ghép đôi chính xác.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={resetStage}
                className="px-4 py-3 rounded-2xl border-2 border-slate-300 text-slate-700 font-black text-sm hover:bg-slate-100 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Chơi lại chặng này</span>
              </button>

              <button
                onClick={onComplete}
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-base shadow-lg shadow-orange-300 hover:shadow-orange-400 transition-all active:scale-95 flex items-center gap-2 cursor-pointer border-2 border-white ring-2 ring-amber-300"
              >
                <span>TIẾP TỤC</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
