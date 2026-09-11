import React from 'react';
import { AppIcon } from '../common/AppIcon';
import { Flame, Moon, Sun, ShieldAlert, Menu } from 'lucide-react';
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
    <header className="yar-header">
      <div className="yar-header-card">
        {/* Start side (right in RTL): menu launcher + brand */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            id="navbar-menu-btn"
            onClick={onOpenMenu}
            aria-label="باز کردن منوی کنار صفحه"
            title="منوی یار"
            className="w-10 h-10 shrink-0 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all active:scale-95 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
          >
            <Menu size={19} className="stroke-[2.2]" />
          </button>

          <button
            onClick={onOpenMenu}
            className="flex items-center gap-2 min-w-0 text-right rounded-2xl transition-all active:scale-95 cursor-pointer group"
            aria-label="باز کردن منوی یار"
          >
            <div className="relative shrink-0">
              <AppIcon size={34} rounded />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900" />
            </div>
            <span className="text-base font-extrabold text-slate-900 dark:text-white leading-none truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              یار
            </span>
          </button>
        </div>

        {/* End side (left in RTL): quick actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="navbar-sos-btn"
            onClick={onOpenSOS}
            aria-label="الان دعوامون شده"
            title="جریان فوری آرام‌سازی هنگام تنش"
            className="h-10 px-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/70 dark:border-rose-900/40 flex items-center gap-1.5 text-[11px] font-extrabold transition-all active:scale-95 cursor-pointer"
          >
            <ShieldAlert size={15} className="text-rose-500 animate-pulse" />
            <span>SOS</span>
          </button>

          <div
            className="h-10 px-2.5 rounded-2xl bg-amber-50 dark:bg-slate-800/80 border border-amber-100/80 dark:border-slate-700/60 flex items-center gap-1 text-[11px] font-extrabold"
            title={`${toPersianDigits(streakCount)} روز استمرار در مراقبت از رابطه`}
          >
            <Flame size={15} className="fill-amber-400 text-amber-500" />
            <span className="text-slate-800 dark:text-slate-200">{toPersianDigits(streakCount)}</span>
          </div>

          <button
            id="navbar-theme-btn"
            onClick={onToggleDarkMode}
            aria-label="تغییر حالت شب و روز"
            className="w-10 h-10 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
};
