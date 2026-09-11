import React from 'react';
import { Home, Compass, BookOpen, Sparkles, HeartHandshake } from 'lucide-react';
import { motion } from 'motion/react';
import { ActiveTab } from '../../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onCenterAction?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onCenterAction
}) => {
  return (
    <div className="fixed bottom-3 inset-x-0 z-40 px-4 pointer-events-none flex justify-center">
      <nav
        aria-label="منوی اصلی"
        className="pointer-events-auto w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[32px] border border-white/80 dark:border-slate-800/80 shadow-soft-dock px-3 py-2 flex items-center justify-between"
      >
        {/* Tab 1: Home */}
        <button
          id="nav-tab-home"
          onClick={() => onChangeTab('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
            activeTab === 'home' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {activeTab === 'home' && (
            <motion.div
              layoutId="navIndicator"
              className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <Home size={19} className={activeTab === 'home' ? 'stroke-[2.4]' : 'stroke-[1.8]'} />
          <span className="text-[10px] font-bold mt-1">خانه</span>
        </button>

        {/* Tab 2: Library & Articles (Requested) */}
        <button
          id="nav-tab-library"
          onClick={() => onChangeTab('library')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
            activeTab === 'library' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {activeTab === 'library' && (
            <motion.div
              layoutId="navIndicator"
              className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <BookOpen size={19} className={activeTab === 'library' ? 'stroke-[2.4]' : 'stroke-[1.8]'} />
          <span className="text-[10px] font-bold mt-1">کتابخانه</span>
        </button>

        {/* Center Floating Plus Action Button */}
        <div className="flex items-center justify-center px-0.5">
          <button
            id="nav-center-action-btn"
            onClick={() => {
              if (onCenterAction) {
                onCenterAction();
              } else {
                onChangeTab('couple');
              }
            }}
            aria-label="فضای دونفره"
            className={`w-11 h-11 rounded-2xl text-white ${activeTab === 'couple' ? 'bg-rose-700' : 'bg-rose-500'} flex items-center justify-center shadow-[0_6px_18px_-3px_rgba(244,63,94,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer group`}
          >
            <HeartHandshake size={20} className="stroke-[2.4]" />
          </button>
        </div>

        {/* Tab 3: Journeys */}
        <button
          id="nav-tab-journeys"
          onClick={() => onChangeTab('journeys')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
            activeTab === 'journeys' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {activeTab === 'journeys' && (
            <motion.div
              layoutId="navIndicator"
              className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <Compass size={19} className={activeTab === 'journeys' ? 'stroke-[2.4]' : 'stroke-[1.8]'} />
          <span className="text-[10px] font-bold mt-1">مسیرها</span>
        </button>

        {/* Tab 4: Exercises */}
        <button
          id="nav-tab-exercises"
          onClick={() => onChangeTab('exercises')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
            activeTab === 'exercises' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {activeTab === 'exercises' && (
            <motion.div
              layoutId="navIndicator"
              className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <Sparkles size={19} className={activeTab === 'exercises' ? 'stroke-[2.4]' : 'stroke-[1.8]'} />
          <span className="text-[10px] font-bold mt-1">تمرین‌ها</span>
        </button>
      </nav>
    </div>
  );
};

