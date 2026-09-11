import React, { useState } from 'react';
import { Droplet } from 'lucide-react';

interface CycleOnboardingStepProps {
  onNext: (wantsTracking: boolean, lastPeriodDate?: string) => void;
  onSkip: () => void;
}

export const CycleOnboardingStep: React.FC<CycleOnboardingStepProps> = ({ onNext, onSkip }) => {
  const [wantsTracking, setWantsTracking] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center">
          <Droplet className="text-rose-600 dark:text-rose-400" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            ردیابی قاعدگی
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            تنظیمِ رابطه‌ات بر اساس چرخهٔ‌ات
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        خلق و اخلاق و سلامتِ پوستِ تو تحتِ تأثیرِ چرخهٔ قاعدگیِ ات است.
        اگر بخواهی در جریان بمانی و تنطیمات روابطت رو بهتر کنی، ابتدای آخرین قاعدگی‌ات رو ثبت کن.
      </p>

      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 cursor-pointer" onClick={() => setWantsTracking(!wantsTracking)}>
        <input
          type="checkbox"
          checked={wantsTracking}
          onChange={() => setWantsTracking(!wantsTracking)}
          className="w-5 h-5 cursor-pointer"
        />
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer flex-1">
          بله، از حالا ردیابی‌ام کن
        </label>
      </div>

      {wantsTracking && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">
            تاریخِ شروعِ آخرین قاعدگی (YYYY-MM-DD):
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-rose-300 dark:border-rose-700 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
          />
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <button
          onClick={() => onNext(wantsTracking, wantsTracking ? selectedDate : undefined)}
          className="flex-1 py-3 rounded-xl bg-indigo-600 dark:bg-indigo-700 text-white font-bold text-sm transition-all active:scale-95 cursor-pointer"
        >
          ادامه
        </button>
        <button
          onClick={onSkip}
          className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold text-sm transition-all active:scale-95 cursor-pointer"
        >
          نه، بعداً
        </button>
      </div>
    </div>
  );
};
