import React, { useState } from 'react';
import { Journey } from '../../types';
import { toPersianDigits } from '../../utils/persianDate';
import { Compass, Clock, CheckCircle2, ArrowLeft, Layers, Sparkles } from 'lucide-react';

interface JourneysTabProps {
  journeys: Journey[];
  completedStages: Record<string, number[]>;
  onSelectJourney: (journey: Journey) => void;
}

export const JourneysTab: React.FC<JourneysTabProps> = ({
  journeys,
  completedStages,
  onSelectJourney
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'همه مسیرها' },
    { id: 'conflict', label: 'کاهش دعوا' },
    { id: 'trauma', label: 'تروما و گذشته' },
    { id: 'intimacy', label: 'صمیمیت' },
    { id: 'family', label: 'مرزبندی خانواده' },
    { id: 'communication', label: 'ارتباط' }
  ];

  const filtered = selectedCategory === 'all'
    ? journeys
    : journeys.filter((j) => j.category === selectedCategory);

  return (
    <div className="pt-1 px-4 max-w-md mx-auto space-y-5">
      {/* Title & Philosophy */}
      <div>
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 block mb-0.5">
          مسیرهای ساختارمند گام‌به‌گام
        </span>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          مسیرهای آموزشی و تعاملی
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">
          آموزش‌های پیوسته همراه با پرسش مشترک و تمرین عملی برای نهادینه‌سازی مهارت‌ها.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-2xl whitespace-nowrap font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-soft-card scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 border border-slate-100 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Journeys List */}
      <div className="space-y-4">
        {filtered.map((journey) => {
          const completedList = completedStages[journey.id] || [];
          const totalStages = journey.stages.length;
          const completedCount = completedList.length;
          const percent = Math.round((completedCount / totalStages) * 100);

          return (
            <div
              key={journey.id}
              onClick={() => onSelectJourney(journey)}
              role="button"
              className="p-5 rounded-[28px] bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 shadow-soft-card hover:shadow-soft-elevated transition-all space-y-3.5 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70">
                  {journey.category}
                </span>
                <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{journey.estimatedWeeks}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers size={12} />
                    <span>{toPersianDigits(totalStages)} ایستگاه</span>
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                  {journey.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {journey.description}
                </p>
              </div>

              {/* Progress bar */}
              <div className="pt-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                  <span>پیشرفت مسیر:</span>
                  <span>
                    {toPersianDigits(completedCount)} از {toPersianDigits(totalStages)} ({toPersianDigits(percent)}٪)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-linear-to-r from-indigo-600 to-sky-400 h-full rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>مشاهده ایستگاه‌ها</span>
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
