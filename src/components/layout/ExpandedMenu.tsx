import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  X,
  Settings,
  Info,
  Droplet,
  Sparkles,
  BookOpen,
  Heart,
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface ExpandedMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenSettings?: () => void;
}

const MENU_ITEMS: {
  tab: ActiveTab;
  labelFa: string;
  descFa: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    tab: 'home',
    labelFa: 'خانه',
    descFa: 'داشبورد روزانه و توصیه‌ها',
    icon: <Heart size={20} />,
    color: 'text-rose-500',
  },
  {
    tab: 'cycle',
    labelFa: 'چرخهٔ قاعدگی',
    descFa: 'ردیابی و اطلاع‌رسانی',
    icon: <Droplet size={20} />,
    color: 'text-red-500',
  },
  {
    tab: 'library',
    labelFa: 'مقالات و کتاب',
    descFa: 'دانش کاربردی رابطه',
    icon: <BookOpen size={20} />,
    color: 'text-indigo-500',
  },
  {
    tab: 'journeys',
    labelFa: 'مسیرهای هدایت‌شده',
    descFa: 'گام‌به‌گام و تمرین',
    icon: <Sparkles size={20} />,
    color: 'text-amber-500',
  },
  {
    tab: 'exercises',
    labelFa: 'تمرین‌ها',
    descFa: 'فعالیت و چالش‌های عملی',
    icon: <Heart className="fill-current" size={20} />,
    color: 'text-pink-500',
  },
  {
    tab: 'couple',
    labelFa: 'فضای دونفره',
    descFa: 'صمیمیت و ارتباط',
    icon: <Heart className="fill-current" size={20} />,
    color: 'text-rose-600',
  },
];

export const ExpandedMenu: React.FC<ExpandedMenuProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onOpenSettings,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-45 flex flex-col">
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="flex-1 bg-black/30 backdrop-blur-sm"
          />

          {/* منو از پایین */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 40 }}
            className="bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            {/* هدر */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">یار</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                aria-label="بستن منو"
              >
                <X size={20} />
              </button>
            </div>

            {/* آیتم‌های منو */}
            <div className="p-4 space-y-2">
              {MENU_ITEMS.map((item, idx) => {
                const isActive = activeTab === item.tab;
                return (
                  <motion.button
                    key={item.tab}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => {
                      onSelectTab(item.tab);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-900/60'
                        : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div className={`text-2xl ${item.color} shrink-0`}>{item.icon}</div>
                    <div className="text-right flex-1 min-w-0">
                      <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {item.labelFa}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {item.descFa}
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* تقسیم‌کننده */}
            <div className="mx-4 h-px bg-slate-200 dark:bg-slate-700" />

            {/* تنطیمات و درباره */}
            <div className="p-4 space-y-2">
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: MENU_ITEMS.length * 0.04 }}
                onClick={() => {
                  onSelectTab('profile');
                  onClose();
                }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
              >
                <Settings size={20} className="text-slate-500 dark:text-slate-400" />
                <div className="text-right flex-1">
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">تنطیمات</div>
                </div>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (MENU_ITEMS.length + 1) * 0.04 }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
              >
                <Info size={20} className="text-slate-500 dark:text-slate-400" />
                <div className="text-right flex-1">
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">درباره</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">نسخه ۱.۱.۰</div>
                </div>
              </motion.button>
            </div>

            <div className="pb-8" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
