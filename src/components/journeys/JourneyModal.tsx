import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Journey, JourneyStage } from '../../types';
import { toPersianDigits } from '../../utils/persianDate';
import {
  X,
  Compass,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  BookOpen,
  HelpCircle,
  ArrowLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface JourneyModalProps {
  journey: Journey | null;
  isOpen: boolean;
  onClose: () => void;
  completedStages: number[];
  onToggleStageCompleted: (journeyId: string, stageNumber: number) => void;
  onOpenArticleById?: (articleId: string) => void;
  onOpenExerciseById?: (exerciseId: string) => void;
}

export const JourneyModal: React.FC<JourneyModalProps> = ({
  journey,
  isOpen,
  onClose,
  completedStages,
  onToggleStageCompleted,
  onOpenArticleById,
  onOpenExerciseById
}) => {
  const [expandedStage, setExpandedStage] = useState<number>(1);

  if (!isOpen || !journey) return null;

  const totalStages = journey.stages.length;
  const completedCount = completedStages.length;
  const progressPercent = Math.round((completedCount / totalStages) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-lg h-full sm:h-auto sm:max-h-[92vh] bg-[#FBF8F3] dark:bg-[#1A1E22] sm:rounded-3xl shadow-2xl border border-[#EBE1D7] dark:border-neutral-800 overflow-y-auto flex flex-col">
        
        {/* Floating Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#FBF8F3]/90 dark:bg-[#1A1E22]/90 backdrop-blur-md border-b border-[#EBDED3] dark:border-neutral-800">
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#7A858C] dark:text-[#9CA3AF] hover:bg-[#EFE7DC] dark:hover:bg-neutral-800 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="text-center">
            <span className="text-xs font-bold text-[#3D5A80] dark:text-[#93C5FD]">
              مسیر آموزشی یار
            </span>
          </div>
          <div className="w-8" />
        </div>

        {/* Content */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* Header Card */}
          <div className="p-5 rounded-3xl bg-linear-to-br from-[#EEF4F8] to-[#E5EDF4] dark:from-[#1E293B] dark:to-[#17202E] border border-[#D5E1EC] dark:border-neutral-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#3D5A80] dark:text-[#93C5FD] px-3 py-1 rounded-full bg-white/70 dark:bg-black/30">
                {journey.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#526578] dark:text-[#CBD5E1]">
                <Clock size={13} />
                <span>{journey.estimatedWeeks}</span>
              </div>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1E2224] dark:text-[#F3F4F6]">
                {journey.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#506374] dark:text-[#CBD5E1] mt-1.5 leading-relaxed">
                {journey.description}
              </p>
            </div>

            {/* Progress status */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#3D5A80] dark:text-[#93C5FD] mb-1.5">
                <span>پیشرفت شما در این مسیر</span>
                <span>
                  {toPersianDigits(completedCount)} از {toPersianDigits(totalStages)} ایستگاه ({toPersianDigits(progressPercent)}٪)
                </span>
              </div>
              <div className="w-full bg-white/70 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#3D5A80] dark:bg-[#60A5FA] h-full rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stages List (ایستگاه‌ها) */}
          <div className="space-y-3">
            <h2 className="text-xs font-black text-[#7A858C] dark:text-[#9CA3AF] uppercase tracking-wider">
              ایستگاه‌های این مسیر (هر ایستگاه: ۱ مفهوم، ۱ تمرین، ۱ پرسش)
            </h2>

            {journey.stages.map((stage: JourneyStage) => {
              const isCompleted = completedStages.includes(stage.stageNumber);
              const isExpanded = expandedStage === stage.stageNumber;

              return (
                <div
                  key={stage.stageNumber}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isCompleted
                      ? 'border-[#D1E3D7] bg-[#FAFDFB] dark:bg-[#1A251E] dark:border-neutral-800'
                      : 'border-[#E8DDCF] bg-white dark:bg-neutral-800/80 dark:border-neutral-700'
                  }`}
                >
                  {/* Stage Accordion Header */}
                  <div
                    onClick={() => setExpandedStage(isExpanded ? 0 : stage.stageNumber)}
                    className="p-4 flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleStageCompleted(journey.id, stage.stageNumber);
                        }}
                        className="p-1 text-[#4E6B58] dark:text-[#86EFAC] hover:scale-110 transition-transform"
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={22} className="fill-[#4E6B58] text-white dark:fill-[#86EFAC] dark:text-neutral-900" />
                        ) : (
                          <Circle size={22} className="text-[#C7BDAD] dark:text-neutral-600" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#7A858C] dark:text-[#9CA3AF]">
                            ایستگاه {toPersianDigits(stage.stageNumber)}
                          </span>
                          {isCompleted && (
                            <span className="text-[10px] font-bold text-[#4E6B58] dark:text-[#86EFAC]">
                              (تکمیل شده)
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-[#1E2224] dark:text-[#F3F4F6] mt-0.5">
                          {stage.title}
                        </h3>
                      </div>
                    </div>

                    <div className="text-[#7A858C]">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {/* Stage Details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="px-4 pb-4 pt-1 space-y-3 border-t border-[#F0E6DA] dark:border-neutral-700/60"
                    >
                      <p className="text-xs text-[#555E65] dark:text-[#CBD5E1] leading-relaxed">
                        {stage.description}
                      </p>

                      {/* 1. Scientific Concept */}
                      <div className="p-3.5 rounded-xl bg-[#FAF5EE] dark:bg-neutral-900 border border-[#EBDED3] dark:border-neutral-800 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-[#C2413C] dark:text-[#F87171]">
                            <BookOpen size={14} />
                            <span>مفهوم علمی این ایستگاه:</span>
                          </div>
                          {stage.durationMinutes && (
                            <span className="text-[10px] text-[#7A858C] flex items-center gap-1">
                              <Clock size={11} />
                              <span>{toPersianDigits(stage.durationMinutes)} دقیقه</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#1E2224] dark:text-[#F3F4F6] font-medium leading-relaxed">
                          {stage.concept}
                        </p>
                      </div>

                      {/* 2. Reflection and Couple Prompt */}
                      <div className="p-3.5 rounded-xl bg-[#F0F6F2] dark:bg-neutral-900 border border-[#D1E3D7] dark:border-neutral-800 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#4E6B58] dark:text-[#86EFAC]">
                          <HelpCircle size={14} />
                          <span>تأمل فردی و پرسش مشترک این جلسه:</span>
                        </div>
                        <p className="text-xs text-[#2D4233] dark:text-[#CBD5E1] font-semibold leading-relaxed">
                          «{stage.reflection}»
                        </p>
                      </div>

                      {/* Optional Clinical Safety Note */}
                      {stage.clinicalNote && (
                        <div className="p-3 rounded-xl bg-[#FFF5F3] dark:bg-[#321C1A] border border-[#FADBD8] dark:border-[#5C2320] text-[11px] text-[#78281F] dark:text-[#FCA5A5] leading-relaxed">
                          💡 <span className="font-bold">نکته بالینی:</span> {stage.clinicalNote}
                        </div>
                      )}

                      {/* Complete Stage Action */}
                      <button
                        onClick={() => onToggleStageCompleted(journey.id, stage.stageNumber)}
                        className={`w-full py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isCompleted
                            ? 'bg-[#EBF3ED] text-[#4E6B58] dark:bg-[#1E3024] dark:text-[#86EFAC]'
                            : 'bg-[#C2413C] text-white hover:bg-[#B13732]'
                        }`}
                      >
                        <CheckCircle2 size={14} />
                        <span>{isCompleted ? 'تکمیل شده (کلیک برای لغو)' : 'تکمیل این ایستگاه'}</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
