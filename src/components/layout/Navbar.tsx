import React, { useEffect, useRef, useState } from 'react';
import { AppIcon } from '../common/AppIcon';
import { QuoteOfTheDay } from '../common/QuoteOfTheDay';
import { Bell, Menu, ShieldAlert } from 'lucide-react';

type NotificationTarget = 'home'|'couple'|'cycle';
interface NavbarNotification { id:string; title:string; body:string; tone:'calm'|'warm'|'attention'; target:NotificationTarget; }
interface NavbarProps { streakCount:number; onOpenSOS:()=>void; onOpenMenu:()=>void; notifications:NavbarNotification[]; onNotificationNavigate:(target:NotificationTarget)=>void; }
export const Navbar: React.FC<NavbarProps> = ({ onOpenSOS, onOpenMenu, notifications, onNotificationNavigate }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showNotifications) return;
    const closeOnOutside = (event: PointerEvent) => { if (panelRef.current && !panelRef.current.contains(event.target as Node)) setShowNotifications(false); };
    document.addEventListener('pointerdown', closeOnOutside);
    return () => document.removeEventListener('pointerdown', closeOnOutside);
  }, [showNotifications]);
  const go = (target: NotificationTarget) => { setShowNotifications(false); onNotificationNavigate(target); };
  return <header className="yar-header" dir="rtl">
    <div ref={panelRef} className="yar-header-card relative">
      <div className="flex items-center gap-2 min-w-0"><button onClick={onOpenMenu} aria-label="باز کردن منو" className="w-11 h-11 shrink-0 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 flex items-center justify-center active:scale-95"><Menu size={21}/></button><button onClick={onOpenMenu} className="flex items-center gap-2 min-w-0 text-right rounded-2xl active:scale-95"><div className="relative shrink-0"><AppIcon size={35} rounded/><span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900"/></div><span className="text-base font-black text-slate-900 dark:text-white">یار</span></button></div>
      <div className="flex items-center gap-1.5 shrink-0"><button onClick={onOpenSOS} aria-label="آرام‌سازی فوری" title="آرام‌سازی فوری" className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/45 text-rose-600 dark:text-rose-300 border border-rose-200/70 dark:border-rose-900/40 flex items-center justify-center active:scale-95"><ShieldAlert size={19}/></button><button onClick={()=>setShowNotifications(v=>!v)} aria-label="اعلان‌ها" className="relative w-11 h-11 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 flex items-center justify-center active:scale-95"><Bell size={19}/><span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border border-white dark:border-slate-900"/></button></div>
      {showNotifications&&<div className="absolute top-[4.6rem] left-3 z-30 w-[min(19rem,calc(100vw-2rem))] rounded-[1.5rem] bg-[oklch(98%_0.008_330)] p-4 shadow-2xl dark:bg-slate-900"><div className="mb-3"><b className="text-sm text-slate-900 dark:text-white">اعلان‌های یار</b><p className="mt-1 text-[10px] text-slate-400">برای رفتن به بخش مرتبط، روی هر اعلان بزن</p></div><div className="space-y-2">{notifications.map((item,index)=><React.Fragment key={item.id}>{index===1&&<div className="my-3 border-t border-dashed border-slate-300 dark:border-slate-700"/>}<button onClick={()=>go(item.target)} className={`flex w-full gap-3 rounded-2xl p-3 text-right transition-transform active:scale-[.98] ${item.tone==='attention'?'bg-rose-50 dark:bg-rose-950/25':item.tone==='warm'?'bg-emerald-50 dark:bg-emerald-950/25':'bg-[oklch(94%_0.035_330)] dark:bg-pink-950/20'}`}><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[oklch(53%_0.14_330)] text-white"><Bell size={16}/></span><span className="min-w-0"><b className="block text-xs text-slate-900 dark:text-white">{item.title}</b><span className="mt-1 block truncate text-[11px] text-slate-600 dark:text-slate-300">{item.body}</span></span></button></React.Fragment>)}</div></div>}
    </div>
    {showNotifications&&<div className="yar-notification-quote"><QuoteOfTheDay compact/></div>}
  </header>;
};
