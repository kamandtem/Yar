import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BookOpen, ChevronLeft, Heart, Home, Info, MoonStar, Settings, Sparkles, Users, X } from 'lucide-react';
import { ActiveTab } from '../../types';
import { AppIcon } from '../common/AppIcon';

interface Props { isOpen: boolean; onClose: () => void; activeTab: ActiveTab; onSelectTab: (tab: ActiveTab) => void; onOpenSettings?: () => void; }
const GROUPS: { title: string; items: { tab: ActiveTab; label: string; caption: string; icon: React.ReactNode }[] }[] = [
  { title: 'روزمره', items: [
    { tab:'home', label:'خانه', caption:'پیشنهاد امروز و حال رابطه', icon:<Home size={19}/> },
    { tab:'couple', label:'فضای دونفره', caption:'چک‌این، خاطره و قرار', icon:<Users size={19}/> },
    { tab:'cycle', label:'سیکل قاعدگی', caption:'خلق، انرژی و نیازهای رابطه‌ای', icon:<MoonStar size={19}/> },
  ]},
  { title: 'رشد رابطه', items: [
    { tab:'journeys', label:'مسیرهای هدایت‌شده', caption:'قدم‌های کوتاه و پیوسته', icon:<Sparkles size={19}/> },
    { tab:'exercises', label:'تمرین‌ها', caption:'گفت‌وگو و تجربه عملی', icon:<Heart size={19}/> },
    { tab:'library', label:'کتابخانه', caption:'مقاله و دانش کاربردی', icon:<BookOpen size={19}/> },
  ]},
];

export const ExpandedMenu: React.FC<Props> = ({ isOpen, onClose, activeTab, onSelectTab }) => {
  useEffect(() => { document.body.style.overflow = isOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [isOpen]);
  const go = (tab: ActiveTab) => { onSelectTab(tab); onClose(); };
  return <AnimatePresence>{isOpen && <div className="fixed inset-0 z-[55]" dir="rtl">
    <motion.button aria-label="بستن منو" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} className="absolute inset-0 w-full h-full bg-slate-950/40" />
    <motion.aside initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{duration:.34,ease:[.16,1,.3,1]}} className="absolute inset-y-0 right-0 w-[88%] max-w-[22rem] bg-[oklch(98%_0.008_330)] dark:bg-slate-950 shadow-2xl flex flex-col">
      <header className="px-5 pt-[calc(env(safe-area-inset-top)+1.25rem)] pb-5 border-b border-[oklch(91%_0.015_330)] dark:border-slate-800">
        <div className="flex items-center gap-3"><AppIcon size={50} rounded/><div className="flex-1"><h2 className="text-xl font-black text-slate-900 dark:text-white">یار</h2><p className="text-xs text-slate-500 dark:text-slate-400 mt-1">همراه رابطه‌ای آگاهانه‌تر</p></div><button onClick={onClose} className="w-11 h-11 rounded-2xl bg-[oklch(94%_0.015_330)] dark:bg-slate-800 text-slate-500 flex items-center justify-center"><X size={19}/></button></div>
      </header>
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {GROUPS.map((group,groupIndex)=><section key={group.title} className={groupIndex?'mt-7':''}><h3 className="px-2 mb-2 text-[11px] font-black tracking-wide text-slate-400">{group.title}</h3><div className="space-y-1">{group.items.map((item,index)=>{const active=activeTab===item.tab;return <motion.button key={item.tab} initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} transition={{delay:(groupIndex*3+index)*.035}} onClick={()=>go(item.tab)} className={`w-full min-h-[4rem] px-3 rounded-2xl flex items-center gap-3 text-right transition-colors ${active?'bg-[oklch(91%_0.045_330)] dark:bg-pink-950/35 text-[oklch(45%_0.13_330)] dark:text-pink-300':'text-slate-600 dark:text-slate-300 hover:bg-[oklch(95%_0.015_330)] dark:hover:bg-slate-900'}`}><span className={`w-10 h-10 rounded-2xl flex items-center justify-center ${active?'bg-[oklch(50%_0.13_330)] text-white':'bg-[oklch(94%_0.012_330)] dark:bg-slate-900 text-slate-500'}`}>{item.icon}</span><span className="flex-1 min-w-0"><b className="block text-sm font-black text-slate-900 dark:text-white">{item.label}</b><small className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{item.caption}</small></span><ChevronLeft size={16} className="opacity-45"/></motion.button>})}</div></section>)}
      </div>
      <footer className="p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] border-t border-[oklch(91%_0.015_330)] dark:border-slate-800 space-y-1"><button onClick={()=>go('profile')} className="w-full min-h-12 px-3 rounded-2xl flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"><Settings size={18}/> تنظیمات <ChevronLeft size={15} className="mr-auto"/></button><div className="px-3 flex items-center gap-2 text-[10px] text-slate-400"><Info size={13}/> نسخه ۱.۲، داده‌های چرخه روی دستگاه می‌مانند</div></footer>
    </motion.aside>
  </div>}</AnimatePresence>;
};
