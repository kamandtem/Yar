import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Exercise } from '../../types';
import { toPersianDigits } from '../../utils/persianDate';
import { StorageService } from '../../services/storage';
import {
  X,
  Clock,
  Users,
  User,
  ShieldAlert,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Save,
  Check
} from 'lucide-react';

interface ExerciseModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  isCompleted: boolean;
  onToggleCompleted: (id: string) => void;
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({
  exercise,
  isOpen,
  onClose,
  isCompleted,
  onToggleCompleted
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userNote, setUserNote] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (exercise && isOpen) {
      setCurrentStepIndex(0);
      const existing = StorageService.getExerciseNote(exercise.id);
      setUserNote(existing);
      setTimerSeconds(exercise.duration * 60);
      setIsTimerRunning(false);
    }
  }, [exercise, isOpen]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev && prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  if (!isOpen || !exercise) return null;

  const steps = exercise.steps;
  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleSaveNote = () => {
    StorageService.saveExerciseNote(exercise.id, userNote);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleFinish = () => {
    if (userNote.trim()) {
      StorageService.saveExerciseNote(exercise.id, userNote);
    }
    if (!isCompleted) {
      onToggleCompleted(exercise.id);
    }
    onClose();
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${toPersianDigits(mins)}:${remaining < 10 ? '۰' : ''}${toPersianDigits(remaining)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-lg h-full sm:h-auto sm:max-h-[92vh] bg-[#FBF8F3] dark:bg-[#1A1E22] sm:rounded-3xl shadow-2xl border border-[#EBE1D7] dark:border-neutral-800 overflow-y-auto flex flex-col">
        
        {/* Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#FBF8F3]/90 dark:bg-[#1A1E22]/90 backdrop-blur-md border-b border-[#EBDED3] dark:border-neutral-800">
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#7A858C] dark:text-[#9CA3AF] hover:bg-[#EFE7DC] dark:hover:bg-neutral-800 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-2">
            {timerSeconds !== null && (
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-neutral-800 border border-[#D5CBC1] dark:border-neutral-700 text-xs font-mono font-bold text-[#1E2224] dark:text-[#E5E7EB]"
                title="تایمر تمرین"
              >
                <Clock size={13} className={isTimerRunning ? 'text-[#C2413C] animate-spin' : 'text-[#7A858C]'} />
                <span>{formatTimer(timerSeconds)}</span>
                <span className="text-[10px] text-[#7A858C]">{isTimerRunning ? 'توقف' : 'شروع'}</span>
              </button>
            )}

            <button
              onClick={() => onToggleCompleted(exercise.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isCompleted
                  ? 'bg-[#EBF3ED] dark:bg-[#1E3024] text-[#4E6B58] dark:text-[#86EFAC]'
                  : 'bg-white dark:bg-neutral-800 text-[#5C646A] border border-[#D5CBC1] dark:border-neutral-700'
              }`}
            >
              <CheckCircle2 size={15} />
              <span>{isCompleted ? 'تکمیل شد' : 'ثبت اتمام'}</span>
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-5 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Badges and metadata */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#FFF1EB] dark:bg-[#3D251D] text-[#C2413C] dark:text-[#FCA5A5] text-xs font-bold">
                {exercise.category}
              </span>
              <div className="flex items-center gap-3 text-xs text-[#7A858C] dark:text-[#9CA3AF]">
                <span className="flex items-center gap-1">
                  <Clock size={13} />
                  <span>{toPersianDigits(exercise.duration)} دقیقه</span>
                </span>
                <span className="flex items-center gap-1">
                  {exercise.mode === 'couple' ? (
                    <>
                      <Users size={13} />
                      <span>دونفره</span>
                    </>
                  ) : (
                    <>
                      <User size={13} />
                      <span>فردی / دونفره</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1E2224] dark:text-[#F3F4F6]">
                {exercise.title}
              </h1>
              <p className="text-xs text-[#6F7981] dark:text-[#9CA3AF] mt-1 leading-relaxed">
                {exercise.description}
              </p>
            </div>

            {/* Safety Alert (Item 56) */}
            {exercise.safetyLevel !== 'standard' && (
              <div className="p-3.5 rounded-2xl bg-[#FFF5F3] dark:bg-[#321C1A] border border-[#F9D0CA] dark:border-[#5C2320] text-xs text-[#78281F] dark:text-[#FCA5A5] leading-relaxed flex items-start gap-2.5">
                <ShieldAlert size={17} className="shrink-0 text-[#C2413C] mt-0.5" />
                <div>
                  <strong className="block font-bold">هشدار آرامش و ایمنی:</strong>
                  این تمرین نیازمند آرامش اولیه است. اگر در این لحظه در اوج دعوا هستید یا ترس وجود دارد، ابتدا وقفه بگیرید و از تمرین‌های آرام‌سازی انفرادی استفاده کنید.
                </div>
              </div>
            )}

            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-1.5 py-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    currentStepIndex === i
                      ? 'w-7 bg-[#C2413C]'
                      : i < currentStepIndex
                      ? 'w-2 bg-[#4E6B58]'
                      : 'w-2 bg-[#E2D8CC] dark:bg-neutral-800'
                  }`}
                />
              ))}
            </div>

            {/* Step Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="p-5 rounded-2xl bg-white dark:bg-neutral-800/90 border border-[#E8DDCF] dark:border-neutral-700 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#7A858C] dark:text-[#9CA3AF]">
                    مرحله {toPersianDigits(currentStep.stepNumber)} از {toPersianDigits(steps.length)}
                  </span>
                  <span className="text-xs font-bold text-[#C2413C] dark:text-[#F87171]">
                    {currentStep.title}
                  </span>
                </div>

                <p className="text-sm font-semibold text-[#1E2224] dark:text-[#F3F4F6] leading-relaxed">
                  {currentStep.instruction}
                </p>

                {currentStep.promptInput && (
                  <div className="p-3.5 rounded-xl bg-[#FFF8F3] dark:bg-neutral-900 border border-[#FCE2D4] dark:border-neutral-800 text-xs font-extrabold text-[#943126] dark:text-[#FCA5A5] leading-relaxed">
                    🗣️ {currentStep.promptInput}
                  </div>
                )}

                {currentStep.tip && (
                  <div className="p-3 rounded-xl bg-[#F0F6F2] dark:bg-neutral-900/60 border border-[#D1E3D7] dark:border-neutral-800 text-[11px] text-[#3B5443] dark:text-[#A3B899]">
                    💡 نکته: {currentStep.tip}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* User / Couple Reflection Notebook */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#555E65] dark:text-[#CBD5E1]">
                  یادداشت و ثبت پاسخ شما به تمرین:
                </label>
                {savedSuccess && (
                  <span className="text-[11px] font-bold text-[#4E6B58] flex items-center gap-1">
                    <Check size={12} /> ذخیره شد
                  </span>
                )}
              </div>
              <textarea
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                placeholder="اینجا می‌توانید جملات تکمیل‌شده یا حس خود را پس از تمرین بنویسید (روی دستگاه شما باقی می‌ماند)..."
                rows={3}
                className="w-full p-3 text-xs rounded-2xl bg-white dark:bg-neutral-900 border border-[#D5CBC1] dark:border-neutral-700 focus:outline-none focus:border-[#C2413C] text-[#1E2224] dark:text-[#F3F4F6] resize-none leading-relaxed"
              />
              <button
                onClick={handleSaveNote}
                className="py-1.5 px-3 rounded-xl bg-[#EFE7DC] dark:bg-neutral-800 text-[#525B62] dark:text-[#CBD5E1] text-[11px] font-bold hover:bg-[#E5DCD1] transition-all flex items-center gap-1"
              >
                <Save size={12} />
                <span>ذخیره یادداشت</span>
              </button>
            </div>
          </div>

          {/* Bottom Step Controls */}
          <div className="pt-4 border-t border-[#EBDED3] dark:border-neutral-800 flex items-center justify-between gap-3">
            <button
              disabled={currentStepIndex === 0}
              onClick={() => setCurrentStepIndex((prev) => prev - 1)}
              className={`p-3 rounded-xl border border-[#D5CBC1] dark:border-neutral-700 flex items-center gap-1.5 text-xs font-bold transition-all ${
                currentStepIndex === 0
                  ? 'opacity-30 cursor-not-allowed text-[#7A858C]'
                  : 'text-[#4A5258] dark:text-[#CBD5E1] hover:bg-[#EFE7DC]'
              }`}
            >
              <ArrowRight size={14} />
              <span>مرحله قبل</span>
            </button>

            {!isLastStep ? (
              <button
                onClick={() => setCurrentStepIndex((prev) => prev + 1)}
                className="flex-1 py-3 px-5 rounded-xl bg-[#C2413C] text-white font-bold text-xs hover:bg-[#B13732] transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>مرحله بعد</span>
                <ArrowLeft size={14} />
              </button>
            ) : (
              <button
                id="exercise-complete-btn"
                onClick={handleFinish}
                className="flex-1 py-3 px-5 rounded-xl bg-[#4E6B58] text-white font-bold text-xs hover:bg-[#3E5546] transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                <Sparkles size={15} />
                <span>اتمام تمرین و ذخیره در کارنامه</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
