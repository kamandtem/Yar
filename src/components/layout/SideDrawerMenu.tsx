import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  X,
  Home,
  Compass,
  Dumbbell,
  HeartHandshake,
  BookOpen,
  User,
  ShieldAlert,
  Moon,
  Sun,
  Flame,
  PhoneCall,
  ChevronLeft
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { toPersianDigits } from '../../utils/persianDate';

interface SideDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSOS: () => void;
  streakCount: number;
}

export const SideDrawerMenu: React.FC<SideDrawerMenuProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  darkMode,
  onToggleDarkMode,
  onOpenSOS,
  streakCount
}) => {
  // Close on ESC + lock background scroll while the drawer is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  const navLinks: { tab: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { tab: 'home', label: 'خانه و داشبورد امروز', icon: <Home size={18} /> },
    { tab: 'library', label: 'کتابخانه و مقالات', icon: <BookOpen size={18} />, badge: '۵۰+ مقاله' },
    { tab: 'journeys', label: 'مسیرهای گام‌به‌گام', icon: <Compass size={18} /> },
    { tab: 'exercises', label: 'تمرین‌ها و چالش‌ها', icon: <Dumbbell size={18} /> },
    { tab: 'couple', label: 'فضای صمیمیت دونفره', icon: <HeartHandshake size={18} /> },
    { tab: 'profile', label: 'حساب و تنظیمات من', icon: <User size={18} /> }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer: anchored to the right edge, drag it to the right to dismiss */}
          <motion.aside
            className="absolute top-0 bottom-0 right-0 w-[84%] max-w-[350px] bg-white dark:bg-slate-900 border-l border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto rounded-l-[28px] px-5 pb-5 touch-pan-y"
            style={{
              paddingTop: 'calc(var(--yar-safe-top) + 18px)'
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 36 }}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.85 }}
            dragMomentum={false}
            onDragEnd={(_event, info) => {
              // Pushing the drawer back toward the right edge hides it
              if (info.offset.x > 80 || info.velocity.x > 420) onClose();
            }}
          >
            {/* Grab handle on the inner (left) edge as a swipe affordance */}
            <span className="absolute top-1/2 -translate-y-1/2 left-1.5 w-1 h-14 rounded-full bg-slate-200 dark:bg-slate-700" />

            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-rose-500/20 font-extrabold text-sm">
                    یار
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                      اپلیکیشن همراه «یار»
                    </h3>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                      همدم علمی و بالینی زوج‌ها
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  aria-label="بستن منو"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800/60 py-1.5 px-3 rounded-xl flex items-center justify-between">
                <span>👉 منو را به سمت راست بکشید تا بسته شود</span>
                <span className="text-amber-500 font-bold flex items-center gap-1">
                  <Flame size={12} className="fill-amber-400" />
                  {toPersianDigits(streakCount)} روز
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 px-3 tracking-wider">
                  بخش‌های برنامه
                </span>
                {navLinks.map((link) => {
                  const isActive = activeTab === link.tab;
                  return (
                    <button
                      key={link.tab}
                      onClick={() => {
                        onSelectTab(link.tab);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-rose-500' : 'text-slate-400'}>{link.icon}</span>
                        <span>{link.label}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {link.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300">
                            {link.badge}
                          </span>
                        )}
                        <ChevronLeft size={14} className="text-slate-300 dark:text-slate-600" />
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenSOS();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-900/40 text-rose-600 dark:text-rose-300 text-xs font-bold hover:bg-rose-100/80 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={16} className="text-rose-500 animate-pulse" />
                    <span>کلید اضطراری تنش (SOS)</span>
                  </div>
                  <span className="text-[10px] bg-rose-200/70 dark:bg-rose-900/70 px-2 py-0.5 rounded-lg text-rose-700 dark:text-rose-200">
                    آرام‌سازی فوری
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <button
                onClick={onToggleDarkMode}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-500" />}
                  <span>{darkMode ? 'حالت روز (رنگ‌های شاد و پرامید)' : 'حالت شب (تم ملایم استراحت)'}</span>
                </div>
                <span className="text-[10px] text-slate-400">تغییر</span>
              </button>

              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-200 space-y-1">
                <div className="flex items-center gap-1 font-bold">
                  <PhoneCall size={12} />
                  <span>خطوط مشاوره تخصصی ۱۴۸۰ (رایگان)</span>
                </div>
                <p className="text-[10px] leading-relaxed text-amber-700 dark:text-amber-300/80">
                  سامانه صدای مشاور بهزیستی سراسر کشور در صورت بروز بحران شدید عاطفی یا خانوادگی.
                </p>
              </div>

              <p className="text-center text-[10px] text-slate-400 pt-1">
                یار • نگارش ۲.۵ ویژه همراهی زوجین
              </p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
