import React from 'react';
import { Home, Compass, Sparkles, HeartHandshake } from 'lucide-react';
import { motion } from 'motion/react';
import { ActiveTab } from '../../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onCenterAction?: () => void;
}

const TABS: { tab: ActiveTab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { tab: 'home', label: 'خانه', icon: Home },
  { tab: 'journeys', label: 'مسیرها', icon: Compass },
  { tab: 'exercises', label: 'تمرین‌ها', icon: Sparkles }
];

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onCenterAction
}) => {
  return (
    <div className="yar-dock">
      <div className="yar-dock-row">
        <nav aria-label="منوی اصلی" className="yar-dock-bar">
          {TABS.map(({ tab, label, icon: Icon }) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                id={`nav-tab-${tab}`}
                onClick={() => onChangeTab(tab)}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex items-center justify-center gap-1.5 h-full rounded-full transition-all active:scale-95 cursor-pointer ${
                  isActive
                    ? 'flex-[1.7_1_0%] text-slate-900 dark:text-white'
                    : 'flex-1 text-slate-400 dark:text-slate-500'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="yarDockPill"
                    className="absolute inset-0 rounded-full bg-slate-100 dark:bg-slate-800 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)] dark:shadow-none"
                    transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5 px-2">
                  <Icon size={20} className={isActive ? 'stroke-[2.3]' : 'stroke-[1.9]'} />
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="text-[11px] font-extrabold whitespace-nowrap overflow-hidden"
                    >
                      {label}
                    </motion.span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Separate floating action button: the couple space */}
        <button
          id="nav-center-action-btn"
          onClick={() => (onCenterAction ? onCenterAction() : onChangeTab('couple'))}
          aria-label="فضای دونفره"
          title="فضای صمیمیت دونفره"
          className={`yar-fab cursor-pointer ${activeTab === 'couple' ? 'ring-4 ring-rose-200/70 dark:ring-rose-900/60' : ''}`}
        >
          <HeartHandshake size={24} className="stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
};
