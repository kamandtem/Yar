import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Journey, JourneyStage } from '../../types';
import { toPersianDigits } from '../../utils/persianDate';
import {
  ArrowRight,
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
  const [showDescription, setShowDescription] = useState(false);
  const [scienceStage, setScienceStage] = useState<JourneyStage | null>(null);

  if (!isOpen || !journey) return null;

  const totalStages = journey.stages.length;
  const completedCount = completedStages.length;
  const progressPercent = Math.round((completedCount / totalStages) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[oklch(20%_0.03_265_/_0.45)] p-0 sm:items-center sm:p-5">
      <div className="relative w-full max-w-lg max-h-[92vh] bg-[oklch(98%_0.012_80)] dark:bg-[oklch(19%_0.02_265)] rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-y-auto flex flex-col">
        
        {/* App-like header, not a blank full-screen modal */}
        <div className="sticky top-0 z-20 flex items-center gap-3 bg-[oklch(98%_0.012_80_/_0.96)] px-5 py-4 backdrop-blur-md dark:bg-[oklch(19%_0.02_265_/_0.96)]">
          <button onClick={onClose} aria-label="بازگشت به مسیرها" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[oklch(93%_0.025_265)] text-[oklch(43%_0.10_265)] shadow-[0_5px_12px_oklch(35%_0.04_265_/_0.12)] transition-transform active:scale-95 dark:bg-slate-800 dark:text-slate-200">
            <ArrowRight size={19} />
          </button>
          <div className="min-w-0 flex-1 text-right"><small className="block text-[10px] font-black text-[oklch(50%_0.12_265)]">مسیرهای یار</small><b className="block truncate text-sm text-slate-900 dark:text-white">{journey.title}</b></div>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[oklch(94%_0.035_175)] text-[oklch(45%_0.10_175)]"><Compass size={17}/></span>
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
              <button onClick={() => setShowDescription(v => !v)} className="mt-3 flex min-h-11 w-full items-center justify-between rounded-xl bg-white/65 px-3 text-right text-[11px] font-black text-[oklch(43%_0.10_265)] dark:bg-slate-900/60 dark:text-slate-200">
                <span>درباره این مسیر</span>{showDescription ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}</button>
              <AnimatePresence initial={false}>{showDescription && <motion.p initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="px-2 pt-2 text-xs leading-6 text-[#506374] dark:text-[#CBD5E1]">{journey.description}</motion.p>}</AnimatePresence>
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

          {/* Distinct academy section */}
          <section className="overflow-hidden rounded-[1.65rem] bg-[oklch(94%_0.045_175)] p-5 dark:bg-[oklch(24%_0.05_175)]">
            <div className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[oklch(99%_0.008_175)] text-[oklch(45%_0.11_175)]"><Sparkles size={19}/></span><div><p className="text-[10px] font-black text-[oklch(43%_0.11_175)]">آکادمی یار</p><h2 className="mt-1 text-base font-black text-slate-900 dark:text-white">یادگیری را به یک قدم واقعی وصل کن</h2></div></div>
            <p className="mt-3 text-xs leading-6 text-slate-700 dark:text-slate-200">هر ایستگاه سه بخش دارد: مفهوم علمی برای فهمیدن، تمرین برای تجربه کردن و پرسش برای آوردن موضوع به رابطه.</p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-[oklch(43%_0.11_175)]"><BookOpen size={14}/> اول مفهوم را بخوان، بعد ایستگاه را کامل کن</div>
          </section>

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
                      <button onClick={() => setScienceStage(stage)} className="group w-full rounded-[1.35rem] bg-[oklch(94%_0.04_265)] p-4 text-right shadow-[0_8px_18px_oklch(45%_0.05_265_/_0.08)] transition-transform active:scale-[.99] dark:bg-slate-900">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-[oklch(45%_0.13_265)] dark:text-sky-300">
                            <BookOpen size={14} />
                            <span>مفهوم علمی این ایستگاه</span>
                          </div>
                          {stage.durationMinutes && (
                            <span className="text-[10px] text-[#7A858C] flex items-center gap-1">
                              <Clock size={11} />
                              <span>{toPersianDigits(stage.durationMinutes)} دقیقه</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed line-clamp-2">{stage.concept}</p>
                        <span className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[oklch(45%_0.13_265)] text-[11px] font-black text-white shadow-[0_5px_12px_oklch(45%_0.12_265_/_0.18)] transition-transform group-hover:translate-y-[-1px]">خواندن توضیح کامل <ArrowLeft size={14}/></span>
                      </button>

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
        <AnimatePresence>{scienceStage && <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[80] flex items-end justify-center bg-[oklch(20%_0.03_265_/_0.5)] p-0 sm:items-center sm:p-5" onClick={() => setScienceStage(null)}>
          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:24}} onClick={e => e.stopPropagation()} className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-[oklch(99%_0.008_265)] p-5 shadow-2xl dark:bg-slate-900 sm:rounded-[2rem]" dir="rtl">
            <div className="flex items-start gap-3"><button onClick={() => setScienceStage(null)} aria-label="بستن توضیح" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[oklch(93%_0.025_265)] text-slate-500 dark:bg-slate-800"><ArrowRight size={18}/></button><div className="min-w-0 flex-1"><p className="text-[10px] font-black text-[oklch(48%_0.13_265)]">مفهوم علمی ایستگاه {toPersianDigits(scienceStage.stageNumber)}</p><h2 className="mt-1 text-lg font-black leading-7 text-slate-900 dark:text-white">{scienceStage.title}</h2></div><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[oklch(94%_0.04_265)] text-[oklch(45%_0.13_265)]"><BookOpen size={18}/></span></div>
            <div className="mt-5 rounded-[1.35rem] bg-[oklch(96%_0.025_265)] p-4 text-sm leading-7 text-slate-700 dark:bg-slate-800 dark:text-slate-200"><b className="text-[oklch(42%_0.13_265)]">این ایستگاه درباره چیست؟</b><p className="mt-2">{scienceStage.description}</p></div>
            <div className="mt-4 space-y-4"><div><p className="text-xs font-black text-[oklch(47%_0.13_265)]">🔎 توضیح ساده و کاربردی</p><p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200">{scienceStage.concept} این مفهوم به این معنی نیست که واکنش تو قطعی یا تغییرناپذیر است؛ هدفش این است که بین محرک، احساس و رفتارت یک مکث آگاهانه بسازی.</p></div><div className="rounded-[1.35rem] bg-[oklch(95%_0.035_175)] p-4 dark:bg-emerald-950/30"><p className="text-xs font-black text-[oklch(42%_0.11_175)]">🧭 در زندگی واقعی چطور ببینمش؟</p><p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200">به یک موقعیت اخیر فکر کن. چه چیزی اتفاق افتاد، بدنت چه علامتی داد، چه داستانی در ذهنت شکل گرفت و بعد چه کاری کردی؟ همین چهار قدم، مفهوم را از اطلاعات به شناخت شخصی تبدیل می‌کند.</p></div><div><p className="text-xs font-black text-[oklch(47%_0.13_265)]">✍️ پرسش ایستگاه</p><p className="mt-2 text-sm font-bold leading-7 text-slate-700 dark:text-slate-200">«{scienceStage.reflection}»</p></div>{scienceStage.clinicalNote && <p className="rounded-xl bg-[oklch(96%_0.035_20)] p-3 text-xs leading-6 text-[oklch(38%_0.10_20)]">نکته مهم: {scienceStage.clinicalNote}</p>}</div>
            <button onClick={() => setScienceStage(null)} className="mt-6 min-h-12 w-full rounded-2xl bg-[oklch(45%_0.13_265)] text-sm font-black text-white shadow-[0_8px_18px_oklch(45%_0.12_265_/_0.2)]">فهمیدم، برگرد به ایستگاه</button>
          </motion.div>
        </motion.div>}</AnimatePresence>
      </div>
    </div>
  );
};
