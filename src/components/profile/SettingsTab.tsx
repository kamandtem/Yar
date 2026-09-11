import React, { useState } from 'react';
import { Moon, Sun, Trash2, HelpCircle, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { UserPreferences } from '../../types';

interface SettingsTabProps {
  preferences: UserPreferences;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  onResetAll: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  preferences,
  darkMode,
  onToggleDarkMode,
  onUpdatePreferences,
  onResetAll,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="pt-1 px-4 max-w-md mx-auto space-y-4">
      {/* تم و نمایش */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-4"
      >
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Sun size={16} className="text-amber-500" />
          نمایش و تم
        </h3>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/60">
          <div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {darkMode ? '🌙 حالت شب' : '☀️ حالت روز'}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {darkMode ? 'تم تیره برای دید راحت‌تر' : 'تم روشن و طبیعی'}
            </div>
          </div>
          <button
            onClick={onToggleDarkMode}
            className={`relative w-14 h-8 rounded-full transition-all ${
              darkMode ? 'bg-indigo-600' : 'bg-amber-400'
            }`}
          >
            <motion.div
              layout
              className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
              animate={{ right: darkMode ? '4px' : 'auto', left: darkMode ? 'auto' : '4px' }}
            >
              {darkMode ? <Moon size={14} className="text-indigo-600" /> : <Sun size={14} className="text-amber-500" />}
            </motion.div>
          </button>
        </div>
      </motion.div>

      {/* درباره و راهنما */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-3"
      >
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle size={16} className="text-indigo-500" />
          درباره و راهنما
        </h3>

        <button className="w-full p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 text-left hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors cursor-pointer text-sm font-bold text-slate-700 dark:text-slate-300">
          ℹ️ درباره یار (نسخه ۱.۱.۰)
        </button>

        <button className="w-full p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 text-left hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors cursor-pointer text-sm font-bold text-slate-700 dark:text-slate-300">
          📖 راهنمای استفاده
        </button>

        <button className="w-full p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 text-left hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors cursor-pointer text-sm font-bold text-slate-700 dark:text-slate-300">
          💬 ارسال نظر یا مشکل
        </button>
      </motion.div>

      {/* خطرناک */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 space-y-3"
      >
        <h3 className="text-sm font-extrabold text-red-600 dark:text-red-400 flex items-center gap-2">
          <Trash2 size={16} />
          خطرناک
        </h3>

        {!showResetConfirm && (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full p-3 rounded-xl bg-red-100/60 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200/60 dark:hover:bg-red-800/50 transition-colors cursor-pointer text-sm font-bold"
          >
            🗑️ حذف تمام داده‌ها
          </button>
        )}

        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 rounded-xl bg-red-200/40 dark:bg-red-900/60 border border-red-300 dark:border-red-700 space-y-2"
          >
            <p className="text-xs text-red-700 dark:text-red-300 font-bold">
              ⚠️ این عمل قابل‌برگشت نیست. تمام داده‌های شما (مقالات خوانده‌شده، تاریخ قاعدگی، ترجیحات) حذف می‌شوند.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onResetAll();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                بله، حذف کن
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                انصراف
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="pb-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>یار • همراه رابطه‌ای آگاهانه‌تر</p>
        <p>نسخه ۱.۱.۰</p>
      </div>
    </div>
  );
};
