import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, ChevronLeft, HeartHandshake, MoonStar, Sparkles, UserRound, UsersRound, MessageCircle, Flame, Heart, ShieldCheck, Search, Leaf, Home, Compass } from 'lucide-react';
import { MenstrualCycleConfig, PriorityTopic, RelationshipStage, UserPreferences } from '../../types';
import { JalaliDatePicker } from '../common/JalaliDatePicker';
import { getTodayIsoDate } from '../../services/jalali';

interface Props { isOpen: boolean; onComplete: (prefs: Partial<UserPreferences>) => void; onCycleSetup?: (config: MenstrualCycleConfig) => void; }
const STAGES: { id: RelationshipStage; label: string; caption: string }[] = [
  { id:'engaged', label:'آشنایی یا نامزدی', caption:'در حال شناخت و ساختن پایه‌ها' },
  { id:'newlywed', label:'تازه ازدواج کرده‌ایم', caption:'شروع زندگی زیر یک سقف' },
  { id:'under_1_year', label:'کمتر از یک سال', caption:'هماهنگ‌شدن با عادت‌ها' },
  { id:'1_to_3_years', label:'یک تا سه سال', caption:'رشد میان اولین چالش‌ها' },
  { id:'over_3_years', label:'بیشتر از سه سال', caption:'تعمیق و تازه‌کردن رابطه' },
  { id:'solo', label:'فعلاً فردی', caption:'رشد مهارت‌های عاطفی خودم' },
];
const TOPICS: { id: PriorityTopic; label: string; icon: React.ReactNode }[] = [
  {id:'communication',label:'گفت‌وگوی بهتر',icon:<MessageCircle size={22}/>},{id:'conflict',label:'مدیریت تنش',icon:<Flame size={22}/>},{id:'intimacy',label:'صمیمیت',icon:<Heart size={22}/>},
  {id:'trust',label:'اعتماد و امنیت',icon:<ShieldCheck size={22}/>},{id:'self_awareness',label:'خودشناسی',icon:<Search size={22}/>},{id:'sexuality',label:'رابطه جنسی سالم',icon:<Leaf size={22}/>},
  {id:'family',label:'مرز با خانواده',icon:<Home size={22}/>},{id:'finances',label:'پول و آینده',icon:<Compass size={22}/>},{id:'parenting',label:'فرزندپروری',icon:<Sparkles size={22}/>},
];
const GENDERS: { id: NonNullable<UserPreferences['gender']>; label: string; icon: React.ReactNode }[] = [
  {id:'female',label:'خانم هستم',icon:<UserRound size={18}/>},{id:'male',label:'آقا هستم',icon:<UserRound size={18}/>},{id:'other',label:'گزینه دیگر',icon:<UsersRound size={18}/>},{id:'prefer_not',label:'ترجیح می‌دهم نگویم',icon:<HeartHandshake size={18}/>},
];

export const OnboardingModal: React.FC<Props> = ({ isOpen, onComplete, onCycleSetup }) => {
  const [step,setStep]=useState(1); const [stage,setStage]=useState<RelationshipStage|null>(null); const [topics,setTopics]=useState<PriorityTopic[]>([]);
  const [userName,setUserName]=useState(''); const [partnerName,setPartnerName]=useState(''); const [anniversaryDate,setAnniversaryDate]=useState('');
  const [gender,setGender]=useState<UserPreferences['gender']>(); const [trackCycle,setTrackCycle]=useState(false); const [lastPeriod,setLastPeriod]=useState(getTodayIsoDate());
  useEffect(()=>{if(!isOpen)return;setStep(1);setStage(null);setTopics([]);setUserName('');setPartnerName('');setAnniversaryDate('');setGender(undefined);setTrackCycle(false);setLastPeriod(getTodayIsoDate());},[isOpen]);
  if(!isOpen)return null;
  const canNext=step===1?!!stage:step===2?topics.length>0:true;
  const next=()=>{if(canNext)setStep(value=>Math.min(4,value+1));};
  const finish=()=>{
    if(!stage||!topics.length)return;
    if(gender==='female'&&trackCycle&&lastPeriod) onCycleSetup?.({enabled:true,cycleLengthDays:28,periodLengthDays:5,pmsStartDaysBefore:7,lastPeriodStartIso:lastPeriod});
    onComplete({hasCompletedOnboarding:true,relationshipStage:stage,priorityTopics:topics,userName:userName.trim()||undefined,partnerName:stage==='solo'?undefined:partnerName.trim()||undefined,anniversaryDate:stage==='solo'?undefined:anniversaryDate||undefined,gender});
  };
  return <div className="fixed inset-0 z-[60] bg-[oklch(98%_0.008_330)] dark:bg-slate-950 overflow-y-auto" dir="rtl">
    <div className="min-h-full max-w-md mx-auto flex flex-col px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+1rem)]">
      <header className="flex items-center gap-4 min-h-14"><button onClick={()=>step>1&&setStep(step-1)} disabled={step===1} className="w-11 h-11 rounded-2xl bg-[oklch(94%_0.015_330)] dark:bg-slate-900 text-slate-500 flex items-center justify-center disabled:opacity-0"><ArrowRight size={19}/></button><div className="flex-1 flex gap-1.5">{[1,2,3,4].map(item=><span key={item} className={`h-1.5 flex-1 rounded-full ${item<=step?'bg-[oklch(54%_0.14_330)]':'bg-[oklch(91%_0.015_330)] dark:bg-slate-800'}`}/>)}</div><span className="text-xs font-black text-slate-400">{step}/۴</span></header>
      <main className="flex-1 pt-7 pb-6">
        <AnimatePresence mode="wait">
          {step===1&&<Page key="stage" eyebrow="از همین‌جا شروع کنیم" title="رابطه‌ات الان کجای مسیر است؟" subtitle="این انتخاب فقط ترتیب پیشنهادها را بهتر می‌کند.">
            <div className="space-y-2.5">{STAGES.map(item=><Choice key={item.id} active={stage===item.id} onClick={()=>setStage(item.id)} title={item.label} caption={item.caption}/>)}</div>
          </Page>}
          {step===2&&<Page key="topics" eyebrow="اولویت تو" title="دوست داری چه چیزی بهتر شود؟" subtitle="یک یا چند موضوع را انتخاب کن. بعداً قابل تغییر است.">
            <div className="grid grid-cols-2 gap-3">{TOPICS.map(item=>{const active=topics.includes(item.id);return <button key={item.id} onClick={()=>setTopics(active?topics.filter(x=>x!==item.id):[...topics,item.id])} className={`relative min-h-[6.5rem] rounded-[1.5rem] p-4 text-right border transition-transform active:scale-[.97] ${active?'bg-[oklch(91%_0.045_330)] border-[oklch(72%_0.10_330)]':'bg-white dark:bg-slate-900 border-[oklch(91%_0.015_330)] dark:border-slate-800'}`}><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[oklch(94%_0.04_330)] text-[oklch(50%_0.14_330)]">{item.icon}</span><b className="block mt-3 text-sm text-slate-900 dark:text-white">{item.label}</b>{active&&<span className="absolute top-3 left-3 w-6 h-6 rounded-full bg-[oklch(52%_0.14_330)] text-white flex items-center justify-center"><Check size={14}/></span>}</button>})}</div>
          </Page>}
          {step===3&&<Page key="profile" eyebrow="شخصی‌سازی" title="یار تو را چطور بشناسد؟" subtitle="همه موارد این صفحه اختیاری‌اند.">
            <div className="space-y-5"><div className="grid grid-cols-2 gap-3"><Field label="نام تو" value={userName} onChange={setUserName} placeholder="مثلاً سارا"/>{stage!=='solo'&&<Field label="نام همراه" value={partnerName} onChange={setPartnerName} placeholder="مثلاً علی"/>}</div>
              {stage!=='solo'&&<JalaliDatePicker value={anniversaryDate} onChange={setAnniversaryDate} labelFa="تاریخ آشنایی یا سالگرد" allowFuture={false}/>}<div><label className="text-sm font-black text-slate-700 dark:text-slate-200 block mb-2">برای پیشنهادهای مرتبط‌تر</label><div className="grid grid-cols-2 gap-2">{GENDERS.map(item=><button key={item.id} onClick={()=>setGender(item.id)} className={`min-h-12 px-3 rounded-2xl flex items-center gap-2 text-xs font-bold border ${gender===item.id?'bg-[oklch(91%_0.045_330)] border-[oklch(70%_0.10_330)] text-[oklch(43%_0.13_330)]':'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'}`}>{item.icon}{item.label}</button>)}</div></div>
              {gender==='female'&&<div className="rounded-[1.75rem] bg-[oklch(94%_0.035_330)] dark:bg-pink-950/20 p-4 border border-[oklch(87%_0.045_330)] dark:border-pink-900/30"><button onClick={()=>setTrackCycle(!trackCycle)} className="w-full flex items-center gap-3 text-right"><span className="w-11 h-11 rounded-2xl bg-[oklch(55%_0.14_330)] text-white flex items-center justify-center"><MoonStar size={20}/></span><span className="flex-1"><b className="block text-sm text-slate-900 dark:text-white">سیکل قاعدگی را هم دنبال کن</b><small className="text-[11px] leading-5 text-slate-500">برای شناخت الگوی خلق، انرژی و نیاز به نزدیکی یا فضا</small></span><span className={`w-11 h-6 rounded-full p-1 ${trackCycle?'bg-[oklch(55%_0.14_330)]':'bg-slate-300 dark:bg-slate-700'}`}><span className={`block w-4 h-4 rounded-full bg-white transition-transform ${trackCycle?'-translate-x-5':''}`}/></span></button>{trackCycle&&<div className="mt-4 pt-4 border-t border-[oklch(84%_0.04_330)]"><JalaliDatePicker value={lastPeriod} onChange={setLastPeriod} labelFa="شروع آخرین قاعدگی" allowFuture={false}/></div>}</div>}
            </div>
          </Page>}
          {step===4&&<motion.div key="ready" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="pt-10 text-center"><div className="relative w-28 h-28 mx-auto mb-8"><div className="absolute inset-0 rounded-[2.2rem] bg-[oklch(90%_0.06_330)] rotate-6"/><div className="absolute inset-2 rounded-[1.9rem] bg-[oklch(52%_0.14_330)] text-white flex items-center justify-center"><Sparkles size={44}/></div></div><p className="text-xs font-black text-[oklch(52%_0.14_330)] mb-2">آماده‌ای</p><h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">مسیر یار برای تو ساخته شد</h1><p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">پیشنهادها از انتخاب‌هایت شروع می‌شوند و با ثبت‌های واقعی تو بهتر خواهند شد.</p><div className="mt-9 rounded-[1.75rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 text-right space-y-3"><Summary icon="✓" text={`${topics.length} اولویت برای رابطه`}/><Summary icon="۵" text="دقیقه برای هر قدم روزانه"/>{gender==='female'&&trackCycle&&<Summary icon="◌" text="سیکل قاعدگی و خلق فعال شد"/>}</div></motion.div>}
        </AnimatePresence>
      </main>
      <footer className="sticky bottom-0 pt-3 bg-[oklch(98%_0.008_330)] dark:bg-slate-950">{step<4?<button onClick={next} disabled={!canNext} className="w-full min-h-14 rounded-[1.25rem] bg-[oklch(35%_0.04_330)] disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-black flex items-center justify-center gap-2 active:scale-[.98] transition-transform">ادامه <ChevronLeft size={18}/></button>:<button onClick={finish} className="w-full min-h-14 rounded-[1.25rem] bg-[oklch(52%_0.14_330)] text-white font-black flex items-center justify-center gap-2 active:scale-[.98] transition-transform"><Sparkles size={18}/> ورود به یار</button>}</footer>
    </div>
  </div>;
};

const Page=({eyebrow,title,subtitle,children}:{eyebrow:string;title:string;subtitle:string;children:React.ReactNode})=><motion.section initial={{opacity:0,x:-18}} animate={{opacity:1,x:0}} exit={{opacity:0,x:18}} transition={{duration:.28,ease:[.16,1,.3,1]}}><p className="text-xs font-black text-[oklch(52%_0.14_330)] mb-2">{eyebrow}</p><h1 className="text-3xl font-black leading-tight text-slate-900 dark:text-white text-balance">{title}</h1><p className="text-sm leading-6 text-slate-500 dark:text-slate-400 mt-3 mb-7">{subtitle}</p>{children}</motion.section>;
const Choice=({active,onClick,title,caption}:{active:boolean;onClick:()=>void;title:string;caption:string})=><button onClick={onClick} className={`w-full min-h-[4.6rem] px-4 rounded-[1.4rem] flex items-center gap-3 text-right border active:scale-[.98] transition-transform ${active?'bg-[oklch(91%_0.045_330)] border-[oklch(70%_0.10_330)]':'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}><span className={`w-7 h-7 rounded-full border flex items-center justify-center ${active?'bg-[oklch(52%_0.14_330)] border-transparent text-white':'border-slate-300 dark:border-slate-700'}`}>{active&&<Check size={15}/>}</span><span><b className="block text-sm text-slate-900 dark:text-white">{title}</b><small className="text-[11px] text-slate-500">{caption}</small></span></button>;
const Field=({label,value,onChange,placeholder}:{label:string;value:string;onChange:(value:string)=>void;placeholder:string})=><label><span className="text-sm font-black text-slate-700 dark:text-slate-200 block mb-2">{label}</span><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="w-full min-h-12 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus-visible:ring-2 focus-visible:ring-pink-400"/></label>;
const Summary=({icon,text}:{icon:string;text:string})=><div className="flex items-center gap-3"><span className="w-8 h-8 rounded-xl bg-[oklch(93%_0.04_175)] text-[oklch(48%_0.10_175)] flex items-center justify-center text-xs font-black">{icon}</span><span className="text-sm font-bold text-slate-700 dark:text-slate-200">{text}</span></div>;
