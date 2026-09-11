import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPreferences, Article, Exercise, Journey, DailyQuestion, WeeklyDate } from '../../types';
import { toPersianDigits, getTodayPersianDateString } from '../../utils/persianDate';
import { IntimacyDial } from '../common/IntimacyDial';
import {
  Sparkles,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Heart,
  ShieldAlert,
  Flame,
  Calendar,
  Share2,
  MessageCircle,
  HelpCircle,
  ChevronLeft,
  Play,
  Volume2,
  Sliders,
  Sun,
  Compass,
  Zap,
  Layers
} from 'lucide-react';

interface HomeTabProps {
  preferences: UserPreferences;
  articles: Article[];
  exercises: Exercise[];
  journeys: Journey[];
  dailyQuestions: DailyQuestion[];
  weeklyDates: WeeklyDate[];
  completedArticles: string[];
  completedExercises: string[];
  completedStages: Record<string, number[]>;
  onOpenArticle: (article: Article) => void;
  onOpenExercise: (exercise: Exercise) => void;
  onOpenJourney: (journey: Journey) => void;
  onOpenSOS: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  preferences,
  articles,
  exercises,
  journeys,
  dailyQuestions,
  weeklyDates,
  completedArticles,
  completedExercises,
  completedStages,
  onOpenArticle,
  onOpenExercise,
  onOpenJourney,
  onOpenSOS,
  onNavigateToTab
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);
  const [questionNote, setQuestionNote] = useState('');
  const [intimacyScore, setIntimacyScore] = useState(4);
  const [activeQuickTab, setActiveQuickTab] = useState<'temp' | 'question' | 'sos' | 'media'>('temp');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const todayDateStr = getTodayPersianDateString();
  const currentQuestion = dailyQuestions[questionIndex % dailyQuestions.length];

  // Tailor today's article and exercise based on user's priority topics
  const priorityCategory = preferences.priorityTopics?.[0] || 'communication';
  const todaysArticle =
    articles.find((a) =>
      priorityCategory === 'conflict'
        ? a.id === 'art-1' || a.id === 'art-4'
        : priorityCategory === 'trauma'
        ? a.id === 'art-7' || a.id === 'art-6'
        : a.id === 'art-2'
    ) || articles[0];

  const todaysExercise =
    exercises.find((e) =>
      priorityCategory === 'conflict'
        ? e.id === 'ex-2'
        : priorityCategory === 'trauma'
        ? e.id === 'ex-7' || e.id === 'ex-5'
        : e.id === 'ex-1'
    ) || exercises[0];

  // Primary active journey
  const activeJourney =
    journeys.find((j) =>
      preferences.priorityTopics?.includes(j.category)
    ) || journeys[0];

  const completedCount = completedStages[activeJourney.id]?.length || 0;
  const nextStageIndex = Math.min(completedCount, activeJourney.stages.length - 1);
  const nextStage = activeJourney.stages[nextStageIndex];
  const currentWeeklyDate = weeklyDates[0];

  return (
    <div className="pb-28 pt-4 px-4 max-w-md mx-auto space-y-6">
      {/* 1. Modern Top Greeting (matching left screen in reference image: "Good Morning John") */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 block mb-0.5">
            روز بخیر، {todayDateStr}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {preferences.userName || 'همراه گرامی'}
          </h1>
        </div>

        {preferences.partnerName && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 shadow-soft-card">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              با {preferences.partnerName}
            </span>
          </div>
        )}
      </div>

      {/* 2. Hero Weather/Climate Card (matching the top gradient weather card in Screen 1) */}
      <div className="relative overflow-hidden rounded-[30px] p-6 bg-linear-to-br from-[#818CF8] via-[#A78BFA] to-[#60A5FA] text-white shadow-soft-elevated">
        {/* Glowing Sun / Heart Orb */}
        <div className="absolute top-4 left-6 w-20 h-20 rounded-full bg-linear-to-tr from-amber-400 to-amber-200 blur-xs shadow-[0_0_40px_rgba(251,191,36,0.8)] opacity-90" />
        {/* Frosted Cloud Element */}
        <div className="absolute -bottom-6 -left-6 w-36 h-24 rounded-full bg-white/30 backdrop-blur-md" />
        <div className="absolute -bottom-4 left-16 w-28 h-20 rounded-full bg-white/20 backdrop-blur-sm" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md">
              اقلیم عاطفی امروز
            </span>
            <span className="text-xs font-medium opacity-90">
              {todayDateStr}
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {completedArticles.length || completedExercises.length ? 'رابطه با قدم‌های کوچک جلو می‌رود' : 'امروز نقطه شروع شماست'}
            </h2>
            <p className="text-xs sm:text-sm font-medium opacity-90 mt-1 max-w-[240px] leading-relaxed">
              {completedArticles.length || completedExercises.length ? `تا حالا ${toPersianDigits(completedArticles.length + completedExercises.length)} فعالیت ثبت کرده‌اید. پیشنهاد امروز را ادامه دهید.` : 'یک چک‌این کوتاه ثبت کنید تا پیشنهادها بر اساس حال واقعی شما شکل بگیرند.'}
            </p>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <div className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-full bg-white/25 backdrop-blur-md">
              <Sun size={13} className="text-amber-300" />
              <span>{completedArticles.length + completedExercises.length ? `${toPersianDigits(completedArticles.length + completedExercises.length)} فعالیت انجام‌شده` : 'بدون داده قبلی'}</span>
            </div>
            <button
              onClick={() => onNavigateToTab('couple')}
              className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-white text-indigo-700 shadow-sm hover:bg-indigo-50 transition-all cursor-pointer"
            >
              ثبت حس امروز →
            </button>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Squircle Selector (matching Lights, TV, Temp, Window in Screen 2) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 dark:text-slate-400 px-1">
          <span>دسترسی سریع</span>
          <span>حالت‌ها</span>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {/* Quick Item 1: Temp / Dial */}
          <button
            onClick={() => setActiveQuickTab('temp')}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeQuickTab === 'temp'
                ? 'bg-indigo-600 text-white shadow-soft-elevated scale-[1.02]'
                : 'bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 shadow-soft-card hover:bg-slate-50'
            }`}
          >
            <Sparkles size={20} className={activeQuickTab === 'temp' ? 'text-white' : 'text-indigo-500'} />
            <span className="text-[11px] font-bold">دماسنج</span>
          </button>

          {/* Quick Item 2: Question */}
          <button
            onClick={() => setActiveQuickTab('question')}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeQuickTab === 'question'
                ? 'bg-indigo-600 text-white shadow-soft-elevated scale-[1.02]'
                : 'bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 shadow-soft-card hover:bg-slate-50'
            }`}
          >
            <MessageCircle size={20} className={activeQuickTab === 'question' ? 'text-white' : 'text-purple-500'} />
            <span className="text-[11px] font-bold">سؤال روز</span>
          </button>

          {/* Quick Item 3: Conflict SOS */}
          <button
            onClick={onOpenSOS}
            className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 shadow-soft-card flex flex-col items-center justify-center gap-1.5 hover:bg-rose-100/70 transition-all cursor-pointer"
          >
            <ShieldAlert size={20} className="text-rose-500 animate-pulse" />
            <span className="text-[11px] font-bold">اورژانس SOS</span>
          </button>

          {/* Quick Item 4: Journey */}
          <button
            onClick={() => onNavigateToTab('journeys')}
            className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 shadow-soft-card flex flex-col items-center justify-center gap-1.5 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Compass size={20} className="text-sky-500" />
            <span className="text-[11px] font-bold">مسیرها</span>
          </button>
        </div>
      </div>

      {/* 4. Active Interactive Widget (Dial or Question) */}
      <AnimatePresence mode="wait">
        {activeQuickTab === 'temp' && (
          <motion.div
            key="temp-widget"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 rounded-[28px] bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 shadow-soft-card space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400">سنجش زنده پیوند</span>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  دمای عاطفی و اتصال دونفره
                </h3>
              </div>
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2.5 py-1 rounded-full">
                اتاق ارتباط
              </span>
            </div>

            {/* Central Radial Dial Component matching Screen 2 */}
            <IntimacyDial
              value={intimacyScore}
              onChange={(val) => setIntimacyScore(val)}
            />

            {/* Sleek Toggle / Connection Card matching Screen 2 bottom AC switch */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                  <Heart size={16} className="fill-indigo-500 text-indigo-500" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    کانال گفت‌وگوی امن
                  </span>
                  <span className="text-[10px] text-slate-400">متصل و فعال</span>
                </div>
              </div>

              {/* Modern Pill Switch */}
              <div className="w-12 h-6 rounded-full bg-indigo-600 p-1 flex items-center justify-end cursor-pointer">
                <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </div>
            </div>
          </motion.div>
        )}

        {activeQuickTab === 'question' && (
          <motion.div
            key="question-widget"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 rounded-[28px] bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 shadow-soft-card space-y-3.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400">
                <HelpCircle size={15} />
                <span>سؤال تعاملی امروز</span>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full font-bold">
                {currentQuestion.category}
              </span>
            </div>

            <p className="text-sm sm:text-base font-black text-slate-800 dark:text-white leading-relaxed">
              «{currentQuestion.question}»
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
              {currentQuestion.context}
            </p>

            {isQuestionAnswered ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 space-y-2"
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>پاسخ شما برای ثبت در دفترچه ذخیره شد!</span>
                </div>
                {questionNote && (
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 italic">
                    «{questionNote}»
                  </p>
                )}
                <button
                  onClick={() => {
                    setQuestionIndex((prev) => prev + 1);
                    setIsQuestionAnswered(false);
                    setQuestionNote('');
                  }}
                  className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline block pt-1"
                >
                  دیدن سؤال بعدی →
                </button>
              </motion.div>
            ) : (
              <div className="space-y-2.5 pt-1">
                <textarea
                  value={questionNote}
                  onChange={(e) => setQuestionNote(e.target.value)}
                  placeholder="پاسخ کوتاه یا تأمل مشترکتان را اینجا بنویسید..."
                  rows={2}
                  className="w-full p-3 text-xs rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500 resize-none"
                />
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => setIsQuestionAnswered(true)}
                    className="flex-1 py-2.5 px-4 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-soft-card transition-all text-center cursor-pointer"
                  >
                    ثبت در گفت‌وگوی دونفره
                  </button>
                  <button
                    onClick={() => {
                      setQuestionIndex((prev) => prev + 1);
                      setQuestionNote('');
                    }}
                    className="py-2.5 px-3 rounded-2xl bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    سؤال دیگر
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. ROOMS Style Cards (inspired by Screen 1: Living Room, Bedroom with chips) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 dark:text-slate-400 px-1">
          <span className="uppercase tracking-wider">بخش‌های فعال رابطه</span>
          <button
            onClick={() => onNavigateToTab('journeys')}
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            مشاهده همه
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Active Journey Next Step */}
          <div
            onClick={() => onOpenJourney(activeJourney)}
            role="button"
            className="p-4 rounded-[24px] bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 shadow-soft-card hover:shadow-soft-elevated transition-all cursor-pointer space-y-2.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded-full">
                مسیر فعال
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {toPersianDigits(nextStage.stageNumber)}/{toPersianDigits(activeJourney.stages.length)}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {activeJourney.title}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                گام: {nextStage.title}
              </p>
            </div>

            {/* Micro progress line */}
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full"
                style={{
                  width: `${Math.round((completedCount / activeJourney.stages.length) * 100)}%`
                }}
              />
            </div>
          </div>

          {/* Card 2: Today's Exercise */}
          <div
            onClick={() => onOpenExercise(todaysExercise)}
            role="button"
            className="p-4 rounded-[24px] bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 shadow-soft-card hover:shadow-soft-elevated transition-all cursor-pointer space-y-2.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/70 px-2 py-0.5 rounded-full">
                تمرین روز
              </span>
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5">
                <Clock size={10} />
                <span>{toPersianDigits(todaysExercise.duration)}د</span>
              </span>
            </div>

            <div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-1 group-hover:text-purple-600 transition-colors">
                {todaysExercise.title}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {todaysExercise.category}
              </p>
            </div>

            {/* Pill Action Button */}
            <div className="flex items-center justify-between text-[11px] font-bold text-purple-600 dark:text-purple-400 pt-0.5">
              <span>اجرای تمرین</span>
              <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 6. Now Playing / Active Practice Mini Controller (matching "Demons - Alec Benjamin" in Screen 1) */}
      <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 shadow-soft-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center shadow-sm">
            <Volume2 size={20} className={isPlayingAudio ? 'animate-bounce' : ''} />
          </div>
          <div>
            <span className="text-xs font-black text-slate-800 dark:text-slate-100 block">
              تنظیم ریتم تنفس پاراسمپاتیک
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              تمرین صوتی هدایت‌شده ۴-۴-۴ برای آرامش عضلانی
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
          className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:bg-indigo-100 transition-all cursor-pointer active:scale-95"
          title={isPlayingAudio ? 'توقف پخش' : 'پخش صدا'}
        >
          <Play size={18} className={`stroke-[2.4] ${isPlayingAudio ? 'fill-indigo-600' : ''}`} />
        </button>
      </div>

      {/* 7. Today's Scientific Reading Card */}
      <div
        onClick={() => onOpenArticle(todaysArticle)}
        role="button"
        className="p-4 sm:p-5 rounded-[28px] bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 shadow-soft-card hover:shadow-soft-elevated transition-all cursor-pointer group space-y-3"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/70 px-2.5 py-0.5 rounded-full">
            تحلیل علمی امروز
          </span>
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Clock size={11} />
            <span>{toPersianDigits(todaysArticle.readingTime)} دقیقه</span>
          </span>
        </div>

        <div className="flex gap-3.5 items-center">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-slate-100 shadow-xs">
            <img
              src={todaysArticle.heroImage}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-1">
              {todaysArticle.title}
            </h3>
            <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
              {todaysArticle.summary}
            </p>
          </div>
        </div>

        <div className="pt-1 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
          <span>مطالعه خلاصه بالینی</span>
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        </div>
      </div>

      {/* 8. Alain de Botton & 50 Articles Showcase Card */}
      <div
        onClick={() => onNavigateToTab('library')}
        className="relative overflow-hidden p-5 rounded-[28px] bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white shadow-soft-elevated cursor-pointer group hover:scale-[1.01] transition-all"
      >
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-bold">
              <Sparkles size={12} className="text-amber-300" />
              <span>کتابخانه و ۵۰ مقاله جدید</span>
            </div>
            <h3 className="text-base font-black tracking-tight">
              آثار آلن دوباتن و درس‌های ماندگار رابطه
            </h3>
            <p className="text-xs text-white/90 leading-relaxed max-w-[260px]">
              کتاب «آیا برای عشق آماده‌ای؟»، سیر عشق و گنجینه ۵۰ مقاله تحلیلی برای عمق بخشیدن به پیوند زناشویی.
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 group-hover:-translate-x-1 transition-transform">
            <ArrowLeft size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};
