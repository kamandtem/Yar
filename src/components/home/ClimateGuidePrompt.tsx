import React from 'react';
import { CloudSun, HeartHandshake, Sparkles, X } from 'lucide-react';

interface Props { isOpen: boolean; onClose: () => void; }
export const ClimateGuidePrompt: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-[125] flex items-end justify-center bg-[oklch(18%_0.03_290_/_0.48)] p-0 backdrop-blur-md sm:items-center sm:p-5" dir="rtl">
    <section role="dialog" aria-modal="true" aria-labelledby="climate-guide-title" className="w-full max-w-md overflow-hidden rounded-t-[2rem] border border-[oklch(86%_0.05_300)] bg-[oklch(98%_0.012_300)] p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] shadow-[0_28px_80px_-24px_oklch(35%_0.12_300_/_0.55)] dark:border-slate-700 dark:bg-[oklch(20%_0.03_290)] sm:rounded-[2rem]">
      <div className="flex items-start justify-between"><div className="flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-[oklch(89%_0.08_205)] text-[oklch(44%_0.13_205)]"><CloudSun size={31}/></div><button onClick={onClose} aria-label="بستن" className="flex h-11 w-11 items-center justify-center rounded-2xl text-slate-400 active:scale-95"><X size={20}/></button></div>
      <p className="mt-6 text-xs font-black text-[oklch(48%_0.15_300)]">یک نکته برای استفاده بهتر</p>
      <h2 id="climate-guide-title" className="mt-2 text-2xl font-black leading-9 text-slate-900 dark:text-white">پیشنهادهای یار با حال رابطه‌تان تغییر می‌کنند</h2>
      <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-300">هر وقت دمای رابطه را ثبت یا تغییر بدهید، اقلیم عاطفی امروز و پیشنهادهای خانه هم متناسب با همان حال به‌روزرسانی می‌شوند.</p>
      <div className="mt-5 space-y-2.5"><div className="flex items-center gap-3 rounded-2xl bg-[oklch(95%_0.04_205)] px-4 py-3 dark:bg-slate-800"><CloudSun size={20} className="text-[oklch(48%_0.13_205)]"/><span className="text-xs font-bold text-slate-700 dark:text-slate-200">دمای پایین: هوای ابری و مقاله‌های ترمیمی</span></div><div className="flex items-center gap-3 rounded-2xl bg-[oklch(95%_0.04_80)] px-4 py-3 dark:bg-slate-800"><Sparkles size={20} className="text-[oklch(55%_0.14_70)]"/><span className="text-xs font-bold text-slate-700 dark:text-slate-200">دمای متوسط یا بالا: هوای آفتابی و پیشنهادهای رشد</span></div></div>
      <button onClick={onClose} className="mt-6 flex min-h-13 w-full items-center justify-center gap-2 rounded-[1.2rem] bg-[oklch(53%_0.18_300)] text-sm font-black text-white shadow-lg shadow-[oklch(53%_0.18_300_/_0.2)] active:scale-[.98]"><HeartHandshake size={18}/> متوجه شدم</button>
    </section>
  </div>;
};
