import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface OnboardingStep {
  id: number;
  titleFa: string;
  descriptionFa: string;
  imageSrc: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    titleFa: 'یار، همراه رابطه‌ات',
    descriptionFa: 'برنامه‌ای برای زوج‌هایی که می‌خواهند رابطه‌شان را عمیق‌تر و آگاهانه‌تر کنند.\n\nدرک شریک، ارتباط بهتر، تنفسِ نزدیک‌تر.',
    imageSrc: '/onboarding/live-collaboration-pana.svg',
  },
  {
    id: 2,
    titleFa: 'گفتگو که حقیقی است',
    descriptionFa: 'مقالاتِ علمی و تمرین‌هایی برای شناخت بیشتر یکدیگر.\n\nپرسش‌هایی که دل را تغییر می‌دهند.\nهر روز کمی بیشتر نزدیک شدن.',
    imageSrc: '/onboarding/chat-amico.svg',
  },
  {
    id: 3,
    titleFa: 'مراقبتِ روابط',
    descriptionFa: 'ردیابی چرخهٔ قاعدگی، شناخت خلقیات، توصیه‌های روز‌به‌روز.\n\nرابطهٔ سالمِ تری با درکِ بیشتر از خود و شریک.',
    imageSrc: '/onboarding/couple-stress-amico.svg',
  },
];

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = ONBOARDING_STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col">
      {/* هدر */}
      <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={() => currentStep === 0 ? onComplete() : handlePrev()}
          className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
          aria-label="صفحهٔ قبل"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex gap-1.5">
          {ONBOARDING_STEPS.map((_, idx) => (
            <motion.div
              key={idx}
              className={`h-1 rounded-full transition-all ${
                idx === currentStep
                  ? 'bg-indigo-600 dark:bg-indigo-400'
                  : idx < currentStep
                  ? 'bg-emerald-500'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
              animate={{
                width: idx === currentStep ? 32 : 8,
              }}
            />
          ))}
        </div>

        <div className="w-10" /> {/* spacer برای تقارن */}
      </div>

      {/* محتوا */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col items-center justify-center p-6 max-w-md mx-auto"
          >
            {/* تصویر اصلی معرفی */}
            <div className="w-full max-w-[22rem] h-[17rem] sm:h-[19rem] flex items-center justify-center mb-6">
              <img
                src={step.imageSrc}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-contain select-none"
                draggable={false}
              />
            </div>

            {/* متن */}
            <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center mb-3 leading-tight">
              {step.titleFa}
            </h2>
            <p className="text-center text-slate-600 dark:text-slate-300 text-base leading-relaxed whitespace-pre-wrap">
              {step.descriptionFa}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* دکمه‌های پایین */}
      <div className="flex gap-3 p-6 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => onComplete()}
          className="flex-1 py-3 rounded-xl text-slate-700 dark:text-slate-300 text-sm font-bold border border-slate-300 dark:border-slate-600 transition-all active:scale-95 cursor-pointer"
        >
          بعد‌اً
        </button>

        <button
          onClick={handleNext}
          className="flex-1 py-3 rounded-xl bg-indigo-600 dark:bg-indigo-700 text-white text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer hover:bg-indigo-700 dark:hover:bg-indigo-600"
        >
          {currentStep === ONBOARDING_STEPS.length - 1 ? 'شروع کنم' : 'بعدی'}
          {currentStep < ONBOARDING_STEPS.length - 1 && <ChevronRight size={16} />}
        </button>
      </div>
    </div>
  );
};
