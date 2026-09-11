import React, { useState } from 'react';
import { Exercise, PerspectiveCase } from '../../types';
import { toPersianDigits } from '../../utils/persianDate';
import {
  Sparkles,
  Clock,
  Users,
  User,
  CheckCircle2,
  Eye,
  ShieldAlert,
  ArrowLeft,
  ChevronLeft
} from 'lucide-react';

interface ExercisesTabProps {
  exercises: Exercise[];
  perspectives: PerspectiveCase[];
  completedExercises: string[];
  onSelectExercise: (exercise: Exercise) => void;
  onSelectPerspective: (perspective: PerspectiveCase) => void;
}

export const ExercisesTab: React.FC<ExercisesTabProps> = ({
  exercises,
  perspectives,
  completedExercises,
  onSelectExercise,
  onSelectPerspective
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'couple' | 'individual'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'همه دسته‌ها' },
    { id: 'تعارض و آرام‌سازی', label: 'تعارض و آرام‌سازی' },
    { id: 'ارتباط عاطفی', label: 'ارتباط عاطفی' },
    { id: 'صمیمیت', label: 'صمیمیت' },
    { id: 'الگوهای گذشته', label: 'الگوهای گذشته' },
    { id: 'برنامه‌ریزی و ارزش‌ها', label: 'برنامه‌ریزی مشترک' }
  ];

  const filtered = exercises.filter((ex) => {
    const matchMode = filterMode === 'all' || ex.mode === filterMode || ex.mode === 'both';
    const matchCat = selectedCategory === 'all' || ex.category.includes(selectedCategory);
    return matchMode && matchCat;
  });

  const featuredPerspective = perspectives[0];

  return (
    <div className="pt-1 px-4 max-w-md mx-auto space-y-5">
      {/* Title */}
      <div>
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 block mb-0.5">
          تمرین‌های علمی و تعاملی
        </span>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          تمرین‌های فردی و دونفره
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">
          تمرین‌های عملی بر پایه رویکردهای هیجان‌مدار (EFT) و گاتمن برای ساخت عادات ارتباطی سالم.
        </p>
      </div>

      {/* Featured: Two Perspectives Section */}
      {featuredPerspective && (
        <div
          onClick={() => onSelectPerspective(featuredPerspective)}
          role="button"
          className="p-5 rounded-[28px] bg-linear-to-br from-indigo-50/80 via-purple-50/60 to-sky-50/80 dark:from-slate-800 dark:via-indigo-950/40 dark:to-slate-800 border border-indigo-100 dark:border-indigo-900/60 shadow-soft-card cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full bg-white dark:bg-slate-900 shadow-xs">
              <Eye size={13} />
              <span>بخش ویژه: سناریوی دو دیدگاه</span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold">
              درک متقابل
            </span>
          </div>

          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
              {featuredPerspective.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
              بررسی ماجرا از منظر هر دو همسر و پیشگیری از تله قضاوت و نیت‌خوانی.
            </p>
          </div>

          <div className="pt-1 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <span>ورود به سناریو و تحلیل بالینی</span>
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>
      )}

      {/* Filter Tabs: Mode */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold">
        <button
          onClick={() => setFilterMode('all')}
          className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
            filterMode === 'all'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-soft-card'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          همه
        </button>
        <button
          onClick={() => setFilterMode('couple')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
            filterMode === 'couple'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-soft-card'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users size={13} />
          <span>دونفره</span>
        </button>
        <button
          onClick={() => setFilterMode('individual')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
            filterMode === 'individual'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-soft-card'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User size={13} />
          <span>فردی</span>
        </button>
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
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-soft-card'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 border border-slate-100 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Exercises List */}
      <div className="space-y-3">
        {filtered.map((exercise) => {
          const isDone = completedExercises.includes(exercise.id);

          return (
            <div
              key={exercise.id}
              onClick={() => onSelectExercise(exercise)}
              role="button"
              className={`p-5 rounded-[28px] border transition-all cursor-pointer group shadow-soft-card ${
                isDone
                  ? 'border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-900'
                  : 'border-slate-100 bg-white dark:bg-slate-800/90 dark:border-slate-700/60 hover:shadow-soft-elevated'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700">
                    {exercise.category}
                  </span>
                  {exercise.safetyLevel !== 'standard' && (
                    <span className="text-[10px] text-rose-500 flex items-center gap-0.5 font-bold">
                      <ShieldAlert size={12} />
                      <span>احتیاط</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{toPersianDigits(exercise.duration)} دقیقه</span>
                  </span>
                  <span className="flex items-center gap-1">
                    {exercise.mode === 'couple' ? <Users size={12} /> : <User size={12} />}
                    <span>{exercise.mode === 'couple' ? 'دونفره' : 'فردی'}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                    {exercise.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {exercise.description}
                  </p>
                </div>

                <div className="shrink-0 mt-1">
                  {isDone ? (
                    <div className="w-7 h-7 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 size={16} />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:border-indigo-600 group-hover:text-indigo-600">
                      <ChevronLeft size={16} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
