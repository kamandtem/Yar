import React, { useState } from 'react';
import { UserPreferences, Article, Exercise, MediaItem } from '../../types';
import { toPersianDigits } from '../../utils/persianDate';
import {
  User,
  Search,
  Bookmark,
  Headphones,
  Film,
  Book,
  ShieldCheck,
  PhoneCall,
  Settings,
  Info,
  ChevronLeft,
  ArrowLeft,
  Clock,
  Sparkles,
  RotateCcw
} from 'lucide-react';

interface ProfileTabProps {
  preferences: UserPreferences;
  articles: Article[];
  exercises: Exercise[];
  mediaItems: MediaItem[];
  favorites: string[];
  completedArticles: string[];
  completedExercises: string[];
  onOpenArticle: (article: Article) => void;
  onOpenExercise: (exercise: Exercise) => void;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  onResetOnboarding: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  preferences,
  articles,
  exercises,
  mediaItems,
  favorites,
  completedArticles,
  completedExercises,
  onOpenArticle,
  onOpenExercise,
  onUpdatePreferences,
  onResetOnboarding
}) => {
  const [activeSection, setActiveSection] = useState<'main' | 'search' | 'bookmarks' | 'media' | 'safety' | 'settings'>('main');
  const [searchQuery, setSearchQuery] = useState('');

  // Search filtering
  const filteredArticles = searchQuery.trim()
    ? articles.filter(
        (a) =>
          a.title.includes(searchQuery) ||
          a.subtitle.includes(searchQuery) ||
          a.category.includes(searchQuery) ||
          a.summary.includes(searchQuery)
      )
    : [];

  const filteredExercises = searchQuery.trim()
    ? exercises.filter(
        (e) =>
          e.title.includes(searchQuery) ||
          e.description.includes(searchQuery) ||
          e.category.includes(searchQuery)
      )
    : [];

  const bookmarkedArticles = articles.filter((a) => favorites.includes(a.id));

  return (
    <div className="pb-28 pt-4 px-4 max-w-md mx-auto space-y-5">
      {/* Header Profile Title */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 block mb-0.5">
            تنظیمات، یادگیری و حریم امن
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            پروفایل و منابع
          </h1>
        </div>
        {activeSection !== 'main' && (
          <button
            onClick={() => setActiveSection('main')}
            className="py-1.5 px-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>بازگشت</span>
            <ArrowLeft size={13} />
          </button>
        )}
      </div>

      {/* SECTION: MAIN MENU */}
      {activeSection === 'main' && (
        <div className="space-y-4">
          {/* Quick Stats Banner (Sleek Squircle Card) */}
          <div className="p-5 rounded-[28px] bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 shadow-soft-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                  {preferences.userName ? preferences.userName.slice(0, 1) : 'ی'}
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white">
                    {preferences.userName || 'همراه گرامی یار'}
                  </h2>
                  <span className="text-[11px] text-slate-400 font-medium">
                    مرحله: {preferences.relationshipStage === 'newlywed' ? 'تازه ازدواج کرده‌ایم' : 'همراهی آگاهانه'}
                  </span>
                </div>
              </div>

              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/70 px-2.5 py-1 rounded-full">
                نسخه فعال
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-700/60 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl">
                <span className="text-lg font-black text-indigo-600">
                  {toPersianDigits(completedArticles.length)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                  مقاله‌های تکمیل‌شده
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl">
                <span className="text-lg font-black text-emerald-600">
                  {toPersianDigits(completedExercises.length)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                  تمرین‌های انجام‌شده
                </span>
              </div>
            </div>
          </div>

          {/* Quick Search Card Trigger */}
          <div
            onClick={() => setActiveSection('search')}
            role="button"
            className="p-3.5 rounded-[22px] bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 flex items-center gap-3 text-xs text-slate-400 shadow-soft-card cursor-pointer hover:border-indigo-500 transition-all"
          >
            <Search size={16} className="text-indigo-600" />
            <span>جستجو در مقاله‌ها، تمرین‌ها و واژگان روان‌شناسی...</span>
          </div>

          {/* Menu Items */}
          <div className="space-y-2.5">
            {/* Bookmarks */}
            <button
              onClick={() => setActiveSection('bookmarks')}
              className="w-full p-4 rounded-[22px] bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-soft-card cursor-pointer"
            >
              <div className="flex items-center gap-3 text-xs font-bold text-slate-800 dark:text-slate-100">
                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
                  <Bookmark size={17} />
                </div>
                <span>نشان‌شده‌ها و ذخیره‌ها ({toPersianDigits(favorites.length)})</span>
              </div>
              <ChevronLeft size={16} className="text-slate-400" />
            </button>

            {/* Media: بشنو و ببین */}
            <button
              onClick={() => setActiveSection('media')}
              className="w-full p-4 rounded-[22px] bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-soft-card cursor-pointer"
            >
              <div className="flex items-center gap-3 text-xs font-bold text-slate-800 dark:text-slate-100">
                <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600">
                  <Headphones size={17} />
                </div>
                <span>بشنو و ببین (کتاب، پادکست، فیلم و تدتاک)</span>
              </div>
              <ChevronLeft size={16} className="text-slate-400" />
            </button>

            {/* Clinical Safety Guide */}
            <button
              onClick={() => setActiveSection('safety')}
              className="w-full p-4 rounded-[22px] bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-soft-card cursor-pointer"
            >
              <div className="flex items-center gap-3 text-xs font-bold text-slate-800 dark:text-slate-100">
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600">
                  <ShieldCheck size={17} />
                </div>
                <span>مرز بالینی، امنیت و خطوط اورژانس</span>
              </div>
              <ChevronLeft size={16} className="text-slate-400" />
            </button>

            {/* Preferences / Settings */}
            <button
              onClick={() => setActiveSection('settings')}
              className="w-full p-4 rounded-[22px] bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-soft-card cursor-pointer"
            >
              <div className="flex items-center gap-3 text-xs font-bold text-slate-800 dark:text-slate-100">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
                  <Settings size={17} />
                </div>
                <span>شخصی‌سازی اولویت‌ها و تنظیمات</span>
              </div>
              <ChevronLeft size={16} className="text-slate-400" />
            </button>
          </div>

          {/* About Yar Disclaimer */}
          <div className="p-4 rounded-[22px] bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-400 leading-relaxed space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
              <Info size={14} className="text-indigo-500" />
              <span>درباره رسالت «یار»:</span>
            </div>
            <p className="text-[11px]">
              «یار» یک ابزار آموزشی و خودیاری مبتنی بر نظریه‌های علمی (مانند رویکرد گاتمن، درمان متمرکز بر هیجان EFT و نظریه دلبستگی) است. این برنامه جایگزین مشاوره روان‌شناسی، زوج‌درمانی بالینی یا مداخله پزشکی نیست.
            </p>
          </div>
        </div>
      )}

      {/* SECTION: SEARCH */}
      {activeSection === 'search' && (
        <div className="space-y-4">
          <div className="relative">
            <Search size={16} className="absolute right-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در موضوعات (تعارض، دلبستگی، خانواده، اعتماد...)"
              className="w-full pr-10 pl-4 py-3 text-xs rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          {searchQuery.trim() === '' ? (
            <div className="text-center py-10 text-xs text-slate-400">
              واژه مورد نظرتان را تایپ کنید تا مقاله‌ها و تمرین‌های مرتبط نمایش داده شوند.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Filtered Articles */}
              {filteredArticles.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400">مقاله‌ها ({toPersianDigits(filteredArticles.length)})</h3>
                  {filteredArticles.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => onOpenArticle(art)}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 cursor-pointer hover:border-indigo-500 shadow-soft-card"
                    >
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{art.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{art.summary}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Filtered Exercises */}
              {filteredExercises.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400">تمرین‌ها ({toPersianDigits(filteredExercises.length)})</h3>
                  {filteredExercises.map((ex) => (
                    <div
                      key={ex.id}
                      onClick={() => onOpenExercise(ex)}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 cursor-pointer hover:border-emerald-500 shadow-soft-card"
                    >
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{ex.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{ex.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {filteredArticles.length === 0 && filteredExercises.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400">
                  نتیجه‌ای برای «{searchQuery}» یافت نشد.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SECTION: BOOKMARKS */}
      {activeSection === 'bookmarks' && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            محتواهای نشان‌شده شما
          </h2>
          {bookmarkedArticles.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 text-xs text-slate-400 shadow-soft-card">
              هنوز مقاله‌ای را نشان نکرده‌اید. هنگام مطالعه مقاله‌ها می‌توانید با آیکون بوکمارک آن‌ها را ذخیره کنید.
            </div>
          ) : (
            bookmarkedArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => onOpenArticle(art)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 cursor-pointer hover:border-indigo-500 flex items-center justify-between shadow-soft-card"
              >
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">{art.title}</h3>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{art.category} • ⏱ {toPersianDigits(art.readingTime)} دقیقه</span>
                </div>
                <ChevronLeft size={16} className="text-slate-400" />
              </div>
            ))
          )}
        </div>
      )}

      {/* SECTION: MEDIA (بشنو و ببین) */}
      {activeSection === 'media' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-700 dark:text-indigo-300">
            🎧 <strong className="font-bold">بشنو و ببین:</strong> منابع دست‌چین شده شامل کتاب‌های معتبر، پادکست‌ها، مستندها و تدتاک‌های علمی همراه با تحلیل رویکرد ارتباطی آن‌ها.
          </div>

          <div className="space-y-3">
            {mediaItems.map((item) => {
              const Icon =
                item.type === 'podcast'
                  ? Headphones
                  : item.type === 'book'
                  ? Book
                  : Film;

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-[26px] bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 shadow-soft-card space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700 text-indigo-600">
                        <Icon size={16} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">
                        {item.type === 'podcast' ? 'پادکست' : item.type === 'book' ? 'کتاب' : 'ویدیو / تدتاک'}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded-full">
                      {item.topic}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      اثر: {item.creator}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION: CLINICAL SAFETY */}
      {activeSection === 'safety' && (
        <div className="space-y-4">
          <div className="p-5 rounded-[28px] bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 space-y-3 shadow-soft-card">
            <div className="flex items-center gap-2 font-black text-sm text-rose-600">
              <PhoneCall size={18} />
              <span>شماره‌های فوری و مشاوره‌ای رایگان ایران</span>
            </div>
            <p className="text-xs leading-relaxed">
              اگر احساس خطر جانی می‌کنید یا تنش به خشونت فیزیکی کشیده شده است، فوراً با مراجع ذی‌صلاح تماس بگیرید:
            </p>
            <div className="space-y-2">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between text-xs font-bold">
                <span>اورژانس اجتماعی (خشونت خانگی، بحران‌های فردی):</span>
                <span className="text-base text-rose-600 font-mono">۱۲۳</span>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between text-xs font-bold">
                <span>صدای مشاور بهزیستی (مشاوره تلفنی رایگان خانواده):</span>
                <span className="text-base text-rose-600 font-mono">۱۴۸۰</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-[28px] bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 space-y-2 text-xs leading-relaxed shadow-soft-card">
            <h3 className="font-extrabold text-slate-900 dark:text-white">
              تفاوت تعارض طبیعی و رابطه نیازمند درمان تخصصی:
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              بحث و اختلاف‌نظر در هر رابطه‌ای وجود دارد؛ اما مواردی مانند: تحقیر پیوسته، تهدید به آسیب، کنترل‌گری افراطی (Gaslighting) یا احساس وحشت دائم، نیازمند مداخله متخصص روان‌درمانگر است و تمرین‌های خودیاری برای آن کافی نیست.
            </p>
          </div>
        </div>
      )}

      {/* SECTION: SETTINGS */}
      {activeSection === 'settings' && (
        <div className="space-y-4">
          <div className="p-5 rounded-[28px] bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 shadow-soft-card space-y-4">
            <h3 className="text-xs font-black text-slate-900 dark:text-white">
              ویرایش اطلاعات رابطه
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  نام شما:
                </label>
                <input
                  type="text"
                  value={preferences.userName || ''}
                  onChange={(e) => onUpdatePreferences({ userName: e.target.value })}
                  placeholder="نام شما"
                  className="w-full p-3 text-xs rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  نام همراه:
                </label>
                <input
                  type="text"
                  value={preferences.partnerName || ''}
                  onChange={(e) => onUpdatePreferences({ partnerName: e.target.value })}
                  placeholder="نام همراه"
                  className="w-full p-3 text-xs rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  تاریخ سالگرد یا آغاز آشنایی:
                </label>
                <input
                  type="text"
                  value={preferences.anniversaryDate || ''}
                  onChange={(e) => onUpdatePreferences({ anniversaryDate: e.target.value })}
                  placeholder="مثلاً: ۱۵ اردیبهشت ۱۴۰۲"
                  className="w-full p-3 text-xs rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Reset Onboarding / Start Over */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700 flex items-center justify-between shadow-soft-card">
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                تغییر پرسشنامه شروع (Onboarding)
              </span>
              <span className="text-[10px] text-slate-400">
                پاسخ به سوالات مرحله رابطه و بازچینی اولویت‌ها
              </span>
            </div>
            <button
              onClick={onResetOnboarding}
              className="py-1.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 hover:bg-slate-100 cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>اجرا</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
