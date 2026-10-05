import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, Check, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/gameData';
import { sounds } from '../utils/audio';

interface StageQuizProps {
  onComplete: () => void;
  onWrongAttempt: () => void;
}

export const StageQuiz: React.FC<StageQuizProps> = ({ onComplete, onWrongAttempt }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedKey, setSelectedKey] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState(false);
  const [shakingKey, setShakingKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'wrong' | null;
    message: string;
  }>({
    type: null,
    message: '',
  });

  const question = QUIZ_QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    if (isCurrentCorrect) return; // already solved, wait for user to click "TIẾP THEO"

    setSelectedKey(key);

    if (key === question.correctKey) {
      // CORRECT
      sounds.playCorrect();
      setIsCurrentCorrect(true);
      setFeedback({
        type: 'correct',
        message: 'Chính xác! ' + question.explanation,
      });

      // If it's the final question of stage 3, play confetti
      if (currentQuestionIndex === totalQuestions - 1) {
        sounds.playVictory();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } else {
      // WRONG
      sounds.playWrong();
      onWrongAttempt();
      setShakingKey(key);
      setFeedback({
        type: 'wrong',
        message: 'Chưa đúng. Em thử lại nhé!',
      });

      setTimeout(() => {
        setShakingKey(null);
        setSelectedKey(null);
      }, 700);
    }
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedKey(null);
      setIsCurrentCorrect(false);
      setFeedback({ type: null, message: '' });
      setShakingKey(null);
    } else {
      onComplete();
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-6 select-none relative">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500 text-white font-black text-xs">
              CHẶNG 3
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              AI LÀ AI?
            </h2>
          </div>
          <p className="text-sm font-bold text-slate-500 mt-0.5">
            Hãy chọn đáp án đúng. (Câu {currentQuestionIndex + 1} / {totalQuestions})
          </p>
        </div>

        {/* Question step indicator */}
        <div className="flex items-center gap-1.5">
          {QUIZ_QUESTIONS.map((q, idx) => (
            <div
              key={q.id}
              className={`px-3 py-1 rounded-full text-xs font-black transition-all ${
                idx === currentQuestionIndex
                  ? 'bg-emerald-500 text-white shadow-xs scale-105'
                  : idx < currentQuestionIndex
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              Câu {idx + 1} / {totalQuestions}
            </div>
          ))}
        </div>
      </div>

      {/* Center Question Area */}
      <div className="my-auto py-2 max-w-2xl mx-auto w-full space-y-4">
        {/* Question Title Card */}
        <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 p-4 sm:p-5 rounded-3xl border-2 border-indigo-200 shadow-sm text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Câu hỏi số {currentQuestionIndex + 1}</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-black text-slate-800 leading-snug">
            {question.question}
          </h3>
        </div>

        {/* 4 Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
          {question.options.map((option) => {
            const isSelected = selectedKey === option.key;
            const isCorrectOption = isCurrentCorrect && option.key === question.correctKey;
            const isShaking = shakingKey === option.key;

            return (
              <button
                key={option.key}
                onClick={() => handleSelectOption(option.key)}
                disabled={isCurrentCorrect}
                className={`p-3.5 sm:p-4 rounded-2xl border-3 flex items-center gap-3 transition-all text-left cursor-pointer active:scale-95 ${
                  isCorrectOption
                    ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg ring-4 ring-emerald-300 scale-[1.02]'
                    : isSelected && !isCurrentCorrect
                    ? 'bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-300'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-400 hover:bg-emerald-50/60 shadow-xs hover:shadow-md'
                } ${isShaking ? 'animate-wiggle border-rose-400 bg-rose-50 text-rose-800' : ''}`}
              >
                {/* Option Letter Badge */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border-2 ${
                    isCorrectOption
                      ? 'bg-white text-emerald-700 border-white'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {isCorrectOption ? <Check className="w-5 h-5 stroke-[3]" /> : option.key}
                </div>

                <span
                  className={`text-sm sm:text-base font-extrabold flex-1 leading-snug ${
                    isCorrectOption ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback message banner */}
        <div className="min-h-12 flex items-center justify-center">
          {feedback.type === 'correct' && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-2xl font-bold text-xs sm:text-sm text-center flex items-center gap-2 animate-bounce shadow-xs">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{feedback.message}</span>
            </div>
          )}
          {feedback.type === 'wrong' && (
            <div className="p-2.5 px-4 bg-rose-100 border border-rose-300 text-rose-800 rounded-2xl font-extrabold text-xs sm:text-sm text-center flex items-center gap-2 animate-shake shadow-xs">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{feedback.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer & Next button */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs font-bold text-slate-400">
          {isCurrentCorrect
            ? 'Tuyệt vời! Bấm TIẾP THEO để qua câu tiếp.'
            : 'Hãy chọn 1 trong 4 phương án A, B, C, D'}
        </div>

        {isCurrentCorrect && (
          <button
            onClick={handleNext}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base shadow-lg shadow-emerald-200 active:scale-95 cursor-pointer flex items-center gap-2 border-2 border-white animate-bounce ring-4 ring-emerald-300"
          >
            <span>{currentQuestionIndex < totalQuestions - 1 ? 'TIẾP THEO' : 'XEM KẾT QUẢ'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
