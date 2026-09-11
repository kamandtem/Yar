import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface OnboardingStep {
  id: number;
  titleFa: string;
  descriptionFa: string;
  imageSvg: string; // SVG inline یا path
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    titleFa: '💕 یار، همراه رابطه‌ات',
    descriptionFa: 'برنامه‌ای برای زوج‌هایی که می‌خواهند رابطه‌شان را عمیق‌تر و آگاهانه‌تر کنند.\n\nدرک شریک، ارتباط بهتر، تنفسِ نزدیک‌تر.',
    imageSvg: 'collaboration', // Live collaboration-pana
  },
  {
    id: 2,
    titleFa: '💬 گفتگو که حقیقی است',
    descriptionFa: 'مقالاتِ علمی و تمرین‌هایی برای شناخت بیشتر یکدیگر.\n\nپرسش‌هایی که دل را تغییر می‌دهند.\nهر روز کمی بیشتر نزدیک شدن.',
    imageSvg: 'chat', // Chat-amico
  },
  {
    id: 3,
    titleFa: '❤️ مراقبتِ روابط',
    descriptionFa: 'ردیابی چرخهٔ قاعدگی، شناخت خلقیات، توصیه‌های روز‌به‌روز.\n\nرابطهٔ سالمِ تری با درکِ بیشتر از خود و شریک.',
    imageSvg: 'stress', // Couple stress-rafiki
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
            {/* تصویر */}
            <div className="w-64 h-64 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center mb-8 shadow-lg">
              {/* SVG */}
              <svg viewBox="0 0 400 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {step.imageSvg === 'collaboration' && (
                  <>
                    <defs><linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style={{stopColor:'#e8f4f8',stopOpacity:1}} /><stop offset="100%" style={{stopColor:'#d0e8f0',stopOpacity:1}} /></linearGradient></defs>
                    <rect width="400" height="400" fill="url(#sky)"/>
                    <rect x="80" y="200" width="240" height="20" rx="10" fill="#c4a582" opacity="0.7"/>
                    <rect x="100" y="180" width="60" height="30" rx="5" fill="#8b7355"/>
                    <rect x="240" y="180" width="60" height="30" rx="5" fill="#8b7355"/>
                    <circle cx="130" cy="100" r="25" fill="#6b9ac1"/>
                    <path d="M 110 130 Q 110 145 130 150 Q 150 145 150 130 Z" fill="#6b9ac1"/>
                    <circle cx="270" cy="100" r="25" fill="#f4a9a1"/>
                    <path d="M 250 130 Q 250 145 270 150 Q 290 145 290 130 Z" fill="#f4a9a1"/>
                    <path d="M 150 140 Q 200 135 250 140" stroke="#6b9ac1" strokeWidth="8" fill="none" strokeLinecap="round"/>
                    <circle cx="200" cy="138" r="6" fill="#f4a9a1"/>
                  </>
                )}
                {step.imageSvg === 'chat' && (
                  <>
                    <defs><linearGradient id="chatBg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style={{stopColor:'#f5f0e8',stopOpacity:1}} /><stop offset="100%" style={{stopColor:'#e8ddd0',stopOpacity:1}} /></linearGradient></defs>
                    <rect width="400" height="400" fill="url(#chatBg)"/>
                    <rect x="40" y="80" width="150" height="50" rx="15" fill="#6b9ac1"/>
                    <text x="60" y="115" fontSize="16" fill="white" fontWeight="bold">سلام 👋</text>
                    <rect x="210" y="160" width="150" height="50" rx="15" fill="#f4a9a1"/>
                    <text x="230" y="195" fontSize="16" fill="white" fontWeight="bold">دوست دارم!</text>
                    <rect x="40" y="240" width="150" height="60" rx="15" fill="#6b9ac1"/>
                    <text x="60" y="265" fontSize="14" fill="white" fontWeight="bold">راستی صحبت</text>
                    <text x="60" y="285" fontSize="14" fill="white" fontWeight="bold">کنیم؟</text>
                  </>
                )}
                {step.imageSvg === 'stress' && (
                  <>
                    <defs><linearGradient id="heartBg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style={{stopColor:'#ffe8e0',stopOpacity:1}} /><stop offset="100%" style={{stopColor:'#ffd9cf',stopOpacity:1}} /></linearGradient></defs>
                    <rect width="400" height="400" fill="url(#heartBg)"/>
                    <path d="M 200 320 C 140 260 100 220 100 160 C 100 120 130 90 160 90 C 180 90 200 100 200 100 C 200 100 220 90 240 90 C 270 90 300 120 300 160 C 300 220 260 260 200 320 Z" fill="#e74c3c" opacity="0.8"/>
                    <circle cx="120" cy="80" r="35" fill="#6b9ac1" opacity="0.8"/>
                    <circle cx="280" cy="80" r="35" fill="#f4a9a1" opacity="0.8"/>
                    <text x="120" y="100" fontSize="40" textAnchor="middle" fill="white">👨</text>
                    <text x="280" y="100" fontSize="40" textAnchor="middle" fill="white">👩</text>
                  </>
                )}
              </svg>
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
