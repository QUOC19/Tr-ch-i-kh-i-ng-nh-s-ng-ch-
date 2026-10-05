import React, { useState, useEffect } from 'react';
import { GameScreen } from './types';
import { Navbar } from './components/Navbar';
import { StageIntro } from './components/StageIntro';
import { StageMatching } from './components/StageMatching';
import { StageTimeline } from './components/StageTimeline';
import { StageQuiz } from './components/StageQuiz';
import { ScreenResult } from './components/ScreenResult';
import { ScreenSummary } from './components/ScreenSummary';
import { ScreenEnd } from './components/ScreenEnd';
import { InfoModal } from './components/InfoModal';
import { sounds } from './utils/audio';
import { BookOpen } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('intro');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const handleStartGame = () => {
    setElapsedSeconds(0);
    setRetryCount(0);
    setIsTimerRunning(true);
    setCurrentScreen('stage1');
  };

  const handleCompleteStage1 = () => {
    setCurrentScreen('stage2');
  };

  const handleCompleteStage2 = () => {
    setCurrentScreen('stage3');
  };

  const handleCompleteStage3 = () => {
    setIsTimerRunning(false);
    setCurrentScreen('result');
  };

  const handleGoToSummary = () => {
    setCurrentScreen('summary');
  };

  const handleCompleteSummary = () => {
    setCurrentScreen('end');
  };

  const handleRestart = () => {
    setIsTimerRunning(false);
    setElapsedSeconds(0);
    setRetryCount(0);
    setCurrentScreen('intro');
  };

  const handleWrongAttempt = () => {
    setRetryCount((prev) => prev + 1);
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-amber-50 via-sky-50 to-indigo-50 flex flex-col items-center justify-center p-1 sm:p-3 md:p-4 overflow-hidden relative font-['Nunito',sans-serif]">
      {/* Background playful floating shapes */}
      <div className="absolute top-4 left-6 w-24 h-24 rounded-full bg-amber-200/40 blur-xl pointer-events-none" />
      <div className="absolute bottom-6 right-8 w-32 h-32 rounded-full bg-sky-200/40 blur-2xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-20 h-20 rounded-full bg-pink-200/40 blur-xl pointer-events-none" />

      {/* Main 16:9 Game Container */}
      <main className="w-full max-w-6xl aspect-[16/9] max-h-[96vh] bg-white rounded-3xl sm:rounded-4xl shadow-2xl border-4 border-amber-200/90 flex flex-col overflow-hidden relative z-10 transition-all">
        {/* Top Navbar */}
        <Navbar
          currentScreen={currentScreen}
          onReset={handleRestart}
          elapsedSeconds={elapsedSeconds}
        />

        {/* Dynamic Screen Content */}
        <div className="flex-1 w-full h-[calc(100%-58px)] overflow-hidden relative bg-gradient-to-b from-white to-slate-50/60">
          {currentScreen === 'intro' && <StageIntro onStart={handleStartGame} />}

          {currentScreen === 'stage1' && (
            <StageMatching
              onComplete={handleCompleteStage1}
              onWrongAttempt={handleWrongAttempt}
            />
          )}

          {currentScreen === 'stage2' && (
            <StageTimeline
              onComplete={handleCompleteStage2}
              onWrongAttempt={handleWrongAttempt}
            />
          )}

          {currentScreen === 'stage3' && (
            <StageQuiz
              onComplete={handleCompleteStage3}
              onWrongAttempt={handleWrongAttempt}
            />
          )}

          {currentScreen === 'result' && (
            <ScreenResult
              elapsedSeconds={elapsedSeconds}
              retryCount={retryCount}
              onGoToSummary={handleGoToSummary}
              onPlayAgain={handleRestart}
            />
          )}

          {currentScreen === 'summary' && (
            <ScreenSummary onComplete={handleCompleteSummary} />
          )}

          {currentScreen === 'end' && (
            <ScreenEnd onPlayAgain={handleRestart} />
          )}
        </div>

        {/* Small educational reference button in bottom right corner */}
        {currentScreen !== 'intro' && currentScreen !== 'end' && (
          <button
            onClick={() => setIsInfoModalOpen(true)}
            className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-[11px] font-black flex items-center gap-1 shadow-xs cursor-pointer z-30 transition-all"
            title="Xem lại trang sách"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Trang sách</span>
          </button>
        )}
      </main>

      {/* Info Reference Modal */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
}
