import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, Check, AlertCircle, Sparkles, RefreshCw, HelpCircle, MoveHorizontal } from 'lucide-react';
import { TIMELINE_SLOTS, INVENTIONS_DATA } from '../data/gameData';
import { ImageWithFallback } from './IllustrationIcon';
import { sounds } from '../utils/audio';

interface StageTimelineProps {
  onComplete: () => void;
  onWrongAttempt: () => void;
}

export const StageTimeline: React.FC<StageTimelineProps> = ({ onComplete, onWrongAttempt }) => {
  // Placed slots: map year -> inventionId | null
  const [placedSlots, setPlacedSlots] = useState<Record<number, string | null>>({
    1784: null,
    1876: null,
    1879: null,
    1886: null,
  });

  // Selected card in pool (for click-to-place support in addition to HTML5 drag-and-drop)
  const [selectedPoolCardId, setSelectedPoolCardId] = useState<string | null>(null);

  // Status after pressing "KIỂM TRA"
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'wrong' | 'incomplete' | null;
    message: string;
  }>({
    type: null,
    message: '',
  });

  // Wrong years for wobble animation
  const [wrongYears, setWrongYears] = useState<number[]>([]);

  // Inventions available in pool
  const placedInventionIds = Object.values(placedSlots).filter(Boolean) as string[];
  const poolInventions = INVENTIONS_DATA.filter((inv) => !placedInventionIds.includes(inv.id));

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    sounds.playClick();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnSlot = (year: number, e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;
    placeCard(year, id);
  };

  const placeCard = (year: number, inventionId: string) => {
    sounds.playClick();
    setFeedback({ type: null, message: '' });
    setWrongYears([]);

    setPlacedSlots((prev) => {
      const next = { ...prev };
      // If invention is already on another year, remove it from there
      for (const y in next) {
        if (next[Number(y)] === inventionId) {
          next[Number(y)] = null;
        }
      }
      next[year] = inventionId;
      return next;
    });

    setSelectedPoolCardId(null);
  };

  const handleSlotClick = (year: number) => {
    if (isSuccess) return;

    // If student clicks an empty slot and has a selected card from pool, place it
    if (selectedPoolCardId) {
      placeCard(year, selectedPoolCardId);
      return;
    }

    // If slot has a card, clicking it removes it back to pool
    if (placedSlots[year]) {
      sounds.playClick();
      setPlacedSlots((prev) => ({
        ...prev,
        [year]: null,
      }));
      setFeedback({ type: null, message: '' });
      setWrongYears([]);
    }
  };

  const handlePoolCardClick = (id: string) => {
    if (isSuccess) return;
    sounds.playClick();
    setSelectedPoolCardId((prev) => (prev === id ? null : id));
  };

  const checkTimeline = () => {
    // Check if all 4 are placed
    const unplaced = Object.values(placedSlots).some((val) => val === null);
    if (unplaced) {
      sounds.playWrong();
      setFeedback({
        type: 'incomplete',
        message: 'Em hãy đặt đủ 4 sáng chế vào 4 mốc năm trước khi kiểm tra nhé!',
      });
      return;
    }

    // Verify answers
    const wrong: number[] = [];
    TIMELINE_SLOTS.forEach((slot) => {
      if (placedSlots[slot.year] !== slot.correctInventionId) {
        wrong.push(slot.year);
      }
    });

    if (wrong.length === 0) {
      // 100% Correct!
      sounds.playCorrect();
      sounds.playVictory();
      setIsSuccess(true);
      setFeedback({
        type: 'correct',
        message: 'Xuất sắc! Em đã mở được dòng thời gian.',
      });
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
      });
    } else {
      // Wrong answers
      sounds.playWrong();
      onWrongAttempt();
      setWrongYears(wrong);
      setFeedback({
        type: 'wrong',
        message: 'Em hãy xem lại nhé! Có mốc năm chưa đúng.',
      });
    }
  };

  const resetStage = () => {
    setPlacedSlots({
      1784: null,
      1876: null,
      1879: null,
      1886: null,
    });
    setSelectedPoolCardId(null);
    setIsSuccess(false);
    setWrongYears([]);
    setFeedback({ type: null, message: '' });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-5 select-none relative">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-pink-500 text-white font-black text-xs">
              CHẶNG 2
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              DÒNG THỜI GIAN BÍ MẬT
            </h2>
          </div>
          <p className="text-sm font-bold text-slate-500 mt-0.5">
            Hãy kéo (hoặc bấm chọn) tên sáng chế vào đúng năm cấp bằng sáng chế.
          </p>
        </div>

        {/* Feedback message */}
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
          {feedback.type === 'incomplete' && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-300 text-amber-800 rounded-full font-black text-sm shadow-xs">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>{feedback.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Timeline Canvas matching textbook Image C style */}
      <div className="my-auto py-2 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        {/* Timeline container */}
        <div className="relative w-full py-4 px-2 sm:px-6">
          {/* Main Horizontal Timeline Bar with Arrow */}
          <div className="relative w-full h-4 bg-sky-100 rounded-full my-16 flex items-center border border-sky-200">
            {/* Arrowhead at the right */}
            <div className="absolute -right-3 -top-2 w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-sky-400" />

            {/* The 4 Milestones */}
            <div className="w-full flex items-center justify-between px-4 sm:px-8 relative">
              {TIMELINE_SLOTS.map((slot, index) => {
                const isEven = index % 2 === 0; // alternating: top or bottom slot matching Image C
                const placedId = placedSlots[slot.year];
                const placedItem = placedId
                  ? INVENTIONS_DATA.find((i) => i.id === placedId)
                  : null;
                const isWrong = wrongYears.includes(slot.year);

                return (
                  <div
                    key={slot.year}
                    className="relative flex flex-col items-center group"
                  >
                    {/* Tick point on the timeline bar */}
                    <div
                      className={`w-5 h-5 rounded-full border-3 border-white shadow-xs z-10 transition-transform ${
                        placedItem ? 'scale-125' : ''
                      }`}
                      style={{ backgroundColor: slot.accentColor }}
                    />

                    {/* Milestone Year Label */}
                    <div
                      className={`absolute font-black text-base sm:text-lg transition-transform ${
                        isEven ? 'top-6' : '-top-8'
                      }`}
                      style={{ color: slot.accentColor }}
                    >
                      {slot.year}
                    </div>

                    {/* Connecting dashed line to slot */}
                    <div
                      className={`absolute w-0.5 border-l-2 border-dashed z-0 ${
                        isEven
                          ? '-top-14 h-14'
                          : 'top-10 h-14'
                      }`}
                      style={{ borderColor: slot.accentColor }}
                    />

                    {/* Target Drop Slot Badge */}
                    <div
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnSlot(slot.year, e)}
                      onClick={() => handleSlotClick(slot.year)}
                      className={`absolute z-20 cursor-pointer transition-all ${
                        isEven ? '-top-28' : 'top-22'
                      } ${isWrong ? 'animate-wiggle ring-4 ring-rose-400' : ''}`}
                    >
                      {placedItem ? (
                        /* Filled Slot Badge */
                        <div
                          className={`w-38 sm:w-44 py-2 px-2.5 rounded-2xl border-2 flex items-center gap-2 shadow-md transition-all ${
                            isSuccess
                              ? 'bg-emerald-500 border-white text-white ring-4 ring-emerald-200'
                              : 'bg-white hover:scale-105'
                          }`}
                          style={{ borderColor: isSuccess ? '#10b981' : slot.accentColor }}
                        >
                          <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 border bg-slate-50">
                            <ImageWithFallback
                              src={placedItem.image}
                              alt={placedItem.name}
                              className="w-full h-full"
                            />
                          </div>
                          <div className="min-w-0 flex-1 text-left">
                            <span
                              className={`text-xs font-black truncate block ${
                                isSuccess ? 'text-white' : 'text-slate-800'
                              }`}
                            >
                              {placedItem.name}
                            </span>
                            <span
                              className={`text-[10px] font-bold block ${
                                isSuccess ? 'text-emerald-100' : 'text-slate-400'
                              }`}
                            >
                              {!isSuccess && 'Bấm để gỡ ra'}
                            </span>
                          </div>
                          {isSuccess && <Check className="w-4 h-4 text-white stroke-[3] shrink-0" />}
                        </div>
                      ) : (
                        /* Empty Slot Placeholder matching "???" in Image C */
                        <div
                          className={`w-36 sm:w-40 py-2.5 px-3 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 transition-all ${
                            selectedPoolCardId
                              ? 'bg-amber-50 border-amber-400 animate-pulse ring-2 ring-amber-300'
                              : 'bg-slate-50/90 hover:bg-sky-50 hover:border-sky-400'
                          }`}
                          style={{ borderColor: slot.accentColor }}
                        >
                          <span
                            className="px-2.5 py-0.5 rounded-full text-xs font-black tracking-widest text-white shadow-xs"
                            style={{ backgroundColor: slot.accentColor }}
                          >
                            ? ? ?
                          </span>
                          <span className="text-[11px] font-extrabold text-slate-500">
                            Thả vào đây
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Available draggable / clickable items pool */}
        {!isSuccess && (
          <div className="w-full pt-4 mt-2">
            <div className="text-xs font-black uppercase tracking-wider text-slate-400 text-center mb-2 flex items-center justify-center gap-2">
              <MoveHorizontal className="w-4 h-4 text-slate-400" />
              <span>4 Thẻ Sáng Chế để đặt vào dòng thời gian:</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
              {INVENTIONS_DATA.map((item) => {
                const isPlaced = placedInventionIds.includes(item.id);
                const isSelected = selectedPoolCardId === item.id;

                if (isPlaced) return null; // already on timeline

                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onClick={() => handlePoolCardClick(item.id)}
                    className={`p-2 sm:p-2.5 rounded-2xl border-3 flex items-center gap-2.5 cursor-grab active:cursor-grabbing transition-all select-none ${
                      isSelected
                        ? 'bg-amber-100 border-amber-500 shadow-md ring-4 ring-amber-300 scale-105'
                        : 'bg-white border-slate-300 hover:border-sky-400 hover:bg-sky-50 shadow-xs hover:shadow-md'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-50">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full"
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-black text-slate-800">
                      {item.name}
                    </span>
                  </div>
                );
              })}

              {poolInventions.length === 0 && !isSuccess && (
                <div className="text-xs font-black text-slate-500 py-2">
                  Đã xếp đủ 4 sáng chế! Hãy bấm nút <span className="text-sky-600 font-extrabold">KIỂM TRA</span> bên dưới.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs font-bold text-slate-400">
          Gợi ý: Động cơ hơi nước (1784), Điện thoại (1876), Bóng đèn sợi đốt (1879), Ô tô (1886)
        </div>

        <div className="flex items-center gap-3">
          {!isSuccess ? (
            <>
              <button
                onClick={resetStage}
                className="px-4 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Đặt lại</span>
              </button>

              <button
                onClick={checkTimeline}
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-sm sm:text-base shadow-md shadow-sky-200 active:scale-95 cursor-pointer flex items-center gap-2 border-2 border-white"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>KIỂM TRA</span>
              </button>
            </>
          ) : (
            <button
              onClick={onComplete}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-base shadow-lg shadow-orange-300 active:scale-95 cursor-pointer flex items-center gap-2 border-2 border-white animate-bounce ring-4 ring-amber-300"
            >
              <span>TIẾP TỤC</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
