import React from 'react';
import { AppIcon } from '../common/AppIcon';
import { Flame, Moon, Sun, ShieldAlert, Sparkles } from 'lucide-react';
import { toPersianDigits } from '../../utils/persianDate';

interface NavbarProps {
  streakCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSOS: () => void;
  onOpenMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  streakCount,
  darkMode,
  onToggleDarkMode,
  onOpenSOS,
  onOpenMenu
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#F5F7FC]/85 dark:bg-[#0B0F19]/85 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/60 transition-colors duration-200">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand with clickable menu launcher */}
        <button
          onClick={onOpenMenu}
          className="flex items-center gap-2.5 text-right p-1 -mr-1 rounded-2xl hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all active:scale-98 cursor-pointer group"
          title="باز کردن منوی یار"
          aria-label="باز کردن منوی کنار صفحه"
        >
          <div className="relative group-hover:scale-105 transition-transform">
            <AppIcon size={38} rounded={true} />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-[#0B0F19]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                یار
              </span>
              <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-1.5 py-0.5 rounded-md">
                منو
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400 mt-0.5">
              لمس برای منو و امکانات
            </span>
          </div>
        </button>

        {/* Actions Right (in RTL, visual left) */}
        <div className="flex items-center gap-2">
          {/* Quick Conflict SOS Button */}
          <button
            id="navbar-sos-btn"
            onClick={onOpenSOS}
            aria-label="الان دعوامون شده"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40 hover:bg-rose-100/70 dark:hover:bg-rose-900/60 transition-all text-xs font-bold shadow-soft-card active:scale-95 cursor-pointer"
            title="جریان فوری آرام‌سازی هنگام تنش"
          >
            <ShieldAlert size={14} className="text-rose-500 animate-pulse" />
            <span>SOS</span>
          </button>

          {/* Streak Badge */}
          <div
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 text-amber-500 shadow-soft-card text-xs font-bold"
            title={`${toPersianDigits(streakCount)} روز استمرار در مراقبت از رابطه`}
          >
            <Flame size={14} className="fill-amber-400 text-amber-500" />
            <span className="text-slate-800 dark:text-slate-200">{toPersianDigits(streakCount)}</span>
          </div>

          {/* Dark Mode Toggle */}
          <button
            id="navbar-theme-btn"
            onClick={onToggleDarkMode}
            aria-label="تغییر حالت شب و روز"
            className="w-9 h-9 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center shadow-soft-card transition-all active:scale-95 cursor-pointer"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
};

