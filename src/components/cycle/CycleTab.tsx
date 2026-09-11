import { PageIntroAccordion } from '../common/PageIntroAccordion';
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Brain, CalendarDays, Check, ChevronDown, HeartHandshake, Info, Plus, ShieldCheck, Sparkles, Trash2, Settings2, X, SlidersHorizontal } from 'lucide-react';
import { CycleDailyCheckin, MenstrualCycleConfig, MenstrualPhase, PeriodLog } from '../../types';
import { StorageService } from '../../services/storage';
import { computeRelationshipCycle, getPhaseForDay, RELATIONSHIP_GUIDANCE } from '../../services/relationshipCycle';
import { addDays, formatJalaliDate, getTodayIsoDate, toPersianDigits } from '../../services/jalali';
import { JalaliDatePicker } from '../common/JalaliDatePicker';
import { CycleWheel } from './CycleWheel';
import { learnMoodPattern } from '../../services/personalization';

interface Props { cycleConfig: MenstrualCycleConfig; onUpdateCycleConfig: (config: MenstrualCycleConfig) => void; }
const NEEDS: { value: CycleDailyCheckin['need']; label: string }[] = [
  { value: 'connection', label: 'نزدیکی' }, { value: 'space', label: 'کمی فضا' }, { value: 'support', label: 'حمایت' }, { value: 'rest', label: 'استراحت' }, { value: 'talk', label: 'گفت‌وگو' },
];
const PHASE_LABEL: Record<MenstrualPhase, string> = { menstrual: 'قاعدگی', follicular: 'فولیکولار', ovulation: 'تخمک‌گذاری تقریبی', luteal: 'PMS' };
const PHASE_STYLE: Record<MenstrualPhase, { active: string; idle: string }> = {
  menstrual: { active: 'bg-[oklch(62%_0.16_20)] text-white border-transparent', idle: 'bg-[oklch(96%_0.025_20)] text-[oklch(48%_0.13_20)] border-[oklch(88%_0.06_20)]' },
  follicular: { active: 'bg-[oklch(59%_0.10_175)] text-white border-transparent', idle: 'bg-[oklch(96%_0.025_175)] text-[oklch(43%_0.09_175)] border-[oklch(87%_0.045_175)]' },
  ovulation: { active: 'bg-[oklch(68%_0.13_78)] text-[oklch(30%_0.06_78)] border-transparent', idle: 'bg-[oklch(97%_0.03_78)] text-[oklch(47%_0.10_78)] border-[oklch(89%_0.06_78)]' },
  luteal: { active: 'bg-[oklch(58%_0.13_300)] text-white border-transparent', idle: 'bg-[oklch(96%_0.025_265)] text-[oklch(47%_0.08_265)] border-[oklch(88%_0.025_265)]' },
};
const CONFIDENCE = { none: 'تقریبی', low: 'اطمینان کم', medium: 'اطمینان متوسط', high: 'اطمینان بالا' } as const;

export const CycleTab: React.FC<Props> = ({ cycleConfig, onUpdateCycleConfig }) => {
  const today = useMemo(() => getTodayIsoDate(), []);
  const [logs, setLogs] = useState<PeriodLog[]>(() => StorageService.getPeriodLogs());
  const [checkins, setCheckins] = useState<CycleDailyCheckin[]>(() => StorageService.getCycleCheckins());
  const [selectedDate, setSelectedDate] = useState(today);
  const [showLog, setShowLog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editLength, setEditLength] = useState(cycleConfig.cycleLengthDays || 28);
  const [editPeriod, setEditPeriod] = useState(cycleConfig.periodLengthDays || 5);
  const [editPms, setEditPms] = useState(cycleConfig.pmsStartDaysBefore ?? 7);
  const [editDate, setEditDate] = useState(() => logs[0]?.startIso || today);
  const [selectedDay, setSelectedDay] = useState(1);
  const [showCheckin, setShowCheckin] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mood, setMood] = useState(3); const [energy, setEnergy] = useState(3); const [irritability, setIrritability] = useState(2); const [pain, setPain] = useState(1);
  const [need, setNeed] = useState<CycleDailyCheckin['need']>('connection');
  const [note, setNote] = useState('');
  const state = useMemo(() => computeRelationshipCycle(cycleConfig, logs, today), [cycleConfig, logs, today]);
  const moodPattern = useMemo(() => learnMoodPattern(checkins, state.phase), [checkins, state.phase]);
  React.useEffect(() => { if (state.cycleDay) setSelectedDay(state.cycleDay); }, [state.cycleDay]);

  const selectedPhase = state.available ? getPhaseForDay(selectedDay, state.cycleLength, state.periodLength) : null;
  const guidance = selectedPhase ? RELATIONSHIP_GUIDANCE[selectedPhase] : null;
  const selectedIso = state.cycleDay ? addDays(today, selectedDay - state.cycleDay) : today;

  const openEdit = () => { setEditLength(cycleConfig.cycleLengthDays || 28); setEditPeriod(cycleConfig.periodLengthDays || 5); setEditPms(cycleConfig.pmsStartDaysBefore ?? 7); setEditDate(logs[0]?.startIso || today); setShowEdit(true); };
  const saveEdit = () => {
    const next = StorageService.saveCycleConfig({ ...cycleConfig, enabled: true, lastPeriodStartIso: editDate, cycleLengthDays: editLength, periodLengthDays: editPeriod, pmsStartDaysBefore: editPms });
    onUpdateCycleConfig(next);
    if (editDate) { const nextLogs = StorageService.logPeriodStart(editDate); setLogs(nextLogs); }
    setShowEdit(false);
  };

  const logPeriod = () => {
    const next = StorageService.logPeriodStart(selectedDate); setLogs(next);
    const config = StorageService.saveCycleConfig({ ...cycleConfig, enabled: true, lastPeriodStartIso: selectedDate });
    onUpdateCycleConfig(config); setShowLog(false);
  };
  const saveCheckin = () => {
    const entry: CycleDailyCheckin = { id: `cycle-checkin-${Date.now()}`, dateIso: today, mood, energy, irritability, pain, need, note: note.trim() || undefined };
    setCheckins(StorageService.saveCycleCheckin(entry)); setSaved(true); setTimeout(() => setSaved(false), 2200);
  };

  if (!state.available) return (
    <div className="max-w-md mx-auto px-5 pt-5 pb-28" dir="rtl">
      <div className="relative overflow-hidden rounded-[2rem] bg-[oklch(95%_0.035_330)] dark:bg-slate-900 px-6 pt-8 pb-7 border border-[oklch(88%_0.04_330)] dark:border-slate-800">
        <div className="absolute -left-10 -top-12 w-40 h-40 rounded-full bg-[oklch(83%_0.09_330)] opacity-50" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 text-xs font-black text-[oklch(50%_0.12_330)] mb-5"><HeartHandshake size={16}/> رابطه آگاهانه‌تر</span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight mb-3">سیکل قاعدگی</h1>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300 mb-6">چرخه قرار نیست رفتارت را تعریف کند. کمک می‌کند الگوی خلق، انرژی و نیازهای رابطه‌ای خودت را بشناسی.</p>
          <JalaliDatePicker value={selectedDate} onChange={setSelectedDate} labelFa="شروع آخرین قاعدگی" allowFuture={false} />
          <button onClick={logPeriod} className="mt-4 w-full min-h-12 rounded-2xl bg-[oklch(50%_0.15_330)] hover:bg-[oklch(45%_0.15_330)] text-white font-black text-sm flex items-center justify-center gap-2 active:scale-[.98] transition-transform"><Sparkles size={17}/> شروع ردیابی</button>
          <p className="mt-4 text-[11px] leading-5 text-slate-500 dark:text-slate-400 flex gap-2"><ShieldCheck size={15} className="shrink-0 mt-0.5"/>اطلاعات روی همین دستگاه ذخیره می‌شود. پیش‌بینی، جای تشخیص پزشکی نیست.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto px-4 pt-2 pb-32 space-y-5" dir="rtl">
      <PageIntroAccordion kind="cycle" />
      <header className="pt-2 px-1 flex items-end justify-between gap-4">
        <div><p className="text-xs font-black text-[oklch(52%_0.13_330)] mb-1">بدن، خلق، رابطه</p><h1 className="text-2xl font-black text-slate-900 dark:text-white">سیکل قاعدگی</h1></div>
        <button onClick={() => setShowLog(true)} className="min-h-11 px-4 rounded-2xl bg-[oklch(92%_0.04_330)] dark:bg-slate-800 text-[oklch(48%_0.13_330)] dark:text-pink-300 text-xs font-black flex items-center gap-2"><Plus size={16}/> ثبت شروع</button>
      </header>

      <section className="rounded-[2rem] bg-[oklch(97%_0.012_330)] dark:bg-slate-900 border border-[oklch(91%_0.02_330)] dark:border-slate-800 px-3 pt-2 pb-5 overflow-hidden">
        <CycleWheel currentDay={state.cycleDay!} selectedDay={selectedDay} cycleLength={state.cycleLength} periodLength={state.periodLength} daysUntilNextPeriod={state.daysUntilNextPeriod} onSelectDay={setSelectedDay} onEditPeriod={openEdit} />
        <div className="px-3 -mt-3 flex items-center justify-between gap-3">
          <div><p className="text-xs text-slate-500 dark:text-slate-400">{formatJalaliDate(selectedIso)}</p><p className="font-black text-slate-900 dark:text-white mt-1">{selectedPhase ? PHASE_LABEL[selectedPhase] : ''}</p></div>
          <div className="text-left"><p className="text-[11px] text-slate-400">پریود بعدی</p><p className="text-xs font-black text-slate-700 dark:text-slate-200">{state.daysUntilNextPeriod ? `${toPersianDigits(state.daysUntilNextPeriod)} روز دیگر` : 'نامشخص'}</p></div>
        </div>
      </section>

      {state.inPmsWindow && <div className="rounded-2xl bg-[oklch(95%_0.035_300)] dark:bg-violet-950/25 border border-[oklch(87%_0.05_300)] dark:border-violet-900/40 p-4 text-xs leading-6 text-slate-700 dark:text-slate-200"><b className="text-violet-700 dark:text-violet-300">بازه PMS فعال است.</b> امروز ظرفیت حل بحث‌های سنگین ممکن است پایین‌تر باشد؛ مکث، خواب و درخواست روشن از شریک کمک‌کننده‌تر از نیت‌خوانی است.</div>}

      <div className="grid grid-cols-4 gap-1.5 px-0.5">
        {(['menstrual','follicular','ovulation','luteal'] as MenstrualPhase[]).map((phase) => (
          <button key={phase} onClick={() => { const d = Array.from({length: state.cycleLength}, (_,i)=>i+1).find(day => getPhaseForDay(day,state.cycleLength,state.periodLength)===phase); if(d) setSelectedDay(d); }} className={`min-w-0 min-h-8 rounded-full border px-1 text-[9px] font-black leading-tight ${selectedPhase === phase ? PHASE_STYLE[phase].active : PHASE_STYLE[phase].idle}`}>{phase === 'ovulation' ? 'تخمک‌گذاری' : PHASE_LABEL[phase]}</button>
        ))}
      </div>

      {guidance && <motion.section key={selectedPhase} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="rounded-[1.75rem] p-5 text-white" style={{backgroundColor: guidance.color}}>
        <div className="flex items-center gap-2 mb-3"><HeartHandshake size={19}/><h2 className="text-lg font-black">{guidance.headline}</h2></div>
        <p className="text-sm leading-6 text-white/90 mb-5">{guidance.body}</p>
        <div className="space-y-3 border-t border-white/20 pt-4"><p className="text-xs leading-6"><b>برای شریک:</b> {guidance.partnerTip}</p><p className="text-xs leading-6"><b>برای خودت:</b> {guidance.selfTip}</p></div>
      </motion.section>}

      <section className="rounded-[1.75rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <button onClick={() => setShowCheckin(!showCheckin)} className="w-full min-h-16 px-5 flex items-center gap-3 text-right"><span className="w-10 h-10 rounded-2xl bg-[oklch(93%_0.04_175)] text-[oklch(48%_0.1_175)] flex items-center justify-center"><Activity size={19}/></span><span className="flex-1"><b className="block text-sm text-slate-900 dark:text-white">حال امروزت را ثبت کن</b><small className="text-xs text-slate-500">الگوی شخصی از ثبت‌ها ساخته می‌شود</small></span><ChevronDown size={18} className={`text-slate-400 transition-transform ${showCheckin?'rotate-180':''}`}/></button>
        <AnimatePresence>{showCheckin && <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="px-5 pb-5 space-y-5 border-t border-slate-100 dark:border-slate-800 pt-5">
          <Scale label="خلق" value={mood} onChange={setMood}/><Scale label="انرژی" value={energy} onChange={setEnergy}/><Scale label="تحریک‌پذیری" value={irritability} onChange={setIrritability}/><Scale label="درد یا ناراحتی" value={pain} onChange={setPain}/>
          <div><p className="text-xs font-black text-slate-700 dark:text-slate-200 mb-2">امروز بیشتر چه نیازی داری؟</p><div className="flex flex-wrap gap-2">{NEEDS.map(item=><button key={item.value} onClick={()=>setNeed(item.value)} className={`min-h-10 px-3 rounded-xl text-xs font-bold ${need===item.value?'bg-[oklch(50%_0.13_330)] text-white':'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{item.label}</button>)}</div></div>
          <textarea value={note} onChange={e=>setNote(e.target.value)} rows={2} placeholder="یادداشت کوتاه، اختیاری" className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm focus-visible:ring-2 focus-visible:ring-pink-400"/>
          <button onClick={saveCheckin} className="w-full min-h-12 rounded-2xl bg-[oklch(35%_0.04_330)] text-white font-black text-sm flex items-center justify-center gap-2">{saved?<><Check size={18}/> ثبت شد</>:<>ثبت حال امروز</>}</button>
        </motion.div>}</AnimatePresence>
      </section>

      <section className="rounded-[1.75rem] bg-[oklch(96%_0.025_265)] p-5 dark:bg-slate-900">
        <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[oklch(90%_0.06_265)] text-[oklch(46%_0.14_265)]"><Brain size={19}/></span><div><h2 className="text-sm font-black text-slate-900 dark:text-white">شناخت الگوی روحی من</h2><p className="text-[10px] text-slate-500">بر پایه {toPersianDigits(moodPattern.count)} ثبت اخیر</p></div><span className="mr-auto rounded-full bg-white px-2.5 py-1 text-[9px] font-black text-[oklch(46%_0.12_265)] dark:bg-slate-800">{moodPattern.trendFa}</span></div>
        {moodPattern.count < 3 ? <div className="mt-4"><p className="text-xs leading-6 text-slate-600 dark:text-slate-300">{moodPattern.insightFa}</p><div className="mt-3 grid grid-cols-3 gap-2">{[1,2,3].map(i=><span key={i} className={`h-2 rounded-full ${i<=moodPattern.count?'bg-[oklch(58%_0.15_265)]':'bg-[oklch(89%_0.025_265)] dark:bg-slate-800'}`}/>)}</div></div> : <>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center"><div><b className="block text-lg font-black text-[oklch(44%_0.13_265)]">{toPersianDigits(moodPattern.averageMood)}</b><small className="text-[9px] text-slate-500">میانگین خلق</small></div><div><b className="block text-lg font-black text-[oklch(44%_0.13_265)]">{toPersianDigits(moodPattern.averageEnergy)}</b><small className="text-[9px] text-slate-500">میانگین انرژی</small></div><div><b className="block text-lg font-black text-[oklch(44%_0.13_265)]">{toPersianDigits(moodPattern.averageIrritability)}</b><small className="text-[9px] text-slate-500">تحریک‌پذیری</small></div></div>
          <p className="mt-4 text-xs leading-6 text-slate-700 dark:text-slate-200">{moodPattern.insightFa}</p><p className="mt-2 rounded-xl bg-white p-3 text-[10px] leading-5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{moodPattern.actionFa}</p>
        </>}
      </section>

      <section className="px-1"><div className="flex items-center justify-between mb-3"><h2 className="text-sm font-black text-slate-900 dark:text-white">دقت پیش‌بینی</h2><span className="text-[11px] font-bold text-slate-500">{CONFIDENCE[state.confidence]}</span></div><div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden"><div className="h-full rounded-full bg-[oklch(59%_0.10_175)]" style={{width:`${state.confidence==='high'?100:state.confidence==='medium'?70:state.confidence==='low'?40:18}%`}}/></div><p className="mt-2 text-[11px] leading-5 text-slate-500">با ثبت حداقل ۳ تا ۶ شروع قاعدگی، پیش‌بینی بر اساس میانه چرخه‌های خودت تنظیم می‌شود.{state.irregular?' پراکندگی ثبت‌ها بالاست، بنابراین بازه پیش‌بینی مهم‌تر از یک روز دقیق است.':''}</p></section>

      <section className="rounded-[1.6rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"><button onClick={()=>setShowSettings(v=>!v)} className="w-full min-h-16 px-4 flex items-center justify-between text-right"><span className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[oklch(94%_0.04_330)] text-[oklch(50%_0.13_330)]"><Settings2 size={18}/></span><span><b className="block text-sm font-black text-slate-900 dark:text-white">ویرایش چرخه و پریود</b><small className="text-[11px] text-slate-500">طول چرخه، روزهای خون‌ریزی، PMS و تاریخ شروع</small></span></span><ChevronDown size={17} className={`text-slate-400 ${showSettings?'rotate-180':''}`}/></button>{showSettings&&<div className="border-t border-slate-100 dark:border-slate-800 p-4"><div className="grid grid-cols-3 gap-2 text-center"><div className="rounded-2xl bg-[oklch(97%_0.015_330)] p-3"><b className="block text-lg font-black text-[oklch(48%_0.13_330)]">{toPersianDigits(cycleConfig.cycleLengthDays)}</b><small className="text-[10px] text-slate-500">روز چرخه</small></div><div className="rounded-2xl bg-[oklch(97%_0.015_330)] p-3"><b className="block text-lg font-black text-[oklch(48%_0.13_330)]">{toPersianDigits(cycleConfig.periodLengthDays)}</b><small className="text-[10px] text-slate-500">روز خون‌ریزی</small></div><div className="rounded-2xl bg-[oklch(97%_0.015_330)] p-3"><b className="block text-lg font-black text-[oklch(48%_0.13_330)]">{toPersianDigits(cycleConfig.pmsStartDaysBefore??7)}</b><small className="text-[10px] text-slate-500">روز قبل PMS</small></div></div><button onClick={openEdit} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[oklch(50%_0.15_330)] text-sm font-black text-white"><SlidersHorizontal size={17}/> ویرایش کامل چرخه</button></div>}</section>

      <AnimatePresence>{showEdit&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4" onClick={()=>setShowEdit(false)}><motion.div initial={{y:28}} animate={{y:0}} exit={{y:28}} onClick={e=>e.stopPropagation()} className="w-full max-w-md rounded-t-[2rem] bg-[oklch(99%_0.006_330)] p-5 dark:bg-slate-900 sm:rounded-[2rem]"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-black text-[oklch(52%_0.13_330)]">تنظیمات شخصی بدن</p><h3 className="mt-1 text-xl font-black">ویرایش چرخه</h3></div><button onClick={()=>setShowEdit(false)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800"><X size={18}/></button></div><div className="space-y-5"><Range label="طول چرخه" value={editLength} min={18} max={60} onChange={setEditLength}/><Range label="مدت خون‌ریزی" value={editPeriod} min={2} max={10} onChange={setEditPeriod}/><Range label="چند روز قبل علائم PMS شروع شود؟" value={editPms} min={0} max={12} onChange={setEditPms}/><div><p className="mb-2 text-xs font-black">روز اول آخرین پریود</p><JalaliDatePicker value={editDate} onChange={setEditDate} allowFuture={false} inline compact/></div><p className="rounded-2xl bg-[oklch(95%_0.025_80)] p-3 text-[11px] leading-5 text-slate-600">پیش‌بینی‌ها با ثبت‌های واقعی تو بهتر می‌شوند. چرخه نامنظم، تشخیص پزشکی نیست و فقط بازه تخمینی را گسترده‌تر می‌کند.</p></div><button onClick={saveEdit} className="mt-5 min-h-13 w-full rounded-2xl bg-[oklch(50%_0.15_330)] text-sm font-black text-white">ذخیره تغییرات</button></motion.div></motion.div>}</AnimatePresence>
      <AnimatePresence>{showLog && <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[60] bg-slate-950/45 p-4 flex items-end sm:items-center justify-center" onClick={()=>setShowLog(false)}><motion.div initial={{y:30}} animate={{y:0}} exit={{y:30}} onClick={e=>e.stopPropagation()} className="w-full max-w-sm rounded-[2rem] bg-[oklch(98%_0.008_330)] dark:bg-slate-900 p-5"><h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">شروع قاعدگی</h3><p className="text-xs text-slate-500 mb-5">تاریخ واقعی شروع خون‌ریزی را انتخاب کن.</p><JalaliDatePicker value={selectedDate} onChange={setSelectedDate} allowFuture={false} inline/><button onClick={logPeriod} className="mt-4 w-full min-h-12 rounded-2xl bg-[oklch(50%_0.15_330)] text-white font-black">ثبت در تاریخچه</button>{logs.length>0&&<div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">{logs.slice(0,4).map(log=><div key={log.id} className="flex items-center justify-between text-xs"><span>{formatJalaliDate(log.startIso)}</span><button onClick={()=>setLogs(StorageService.deletePeriodLog(log.id))} className="w-9 h-9 rounded-xl text-slate-400 hover:text-rose-500"><Trash2 size={15}/></button></div>)}</div>}</motion.div></motion.div>}</AnimatePresence>
    </div>
  );
};

const Scale = ({label,value,onChange}:{label:string;value:number;onChange:(value:number)=>void}) => <div><div className="flex justify-between mb-2"><span className="text-xs font-black text-slate-700 dark:text-slate-200">{label}</span><span className="text-xs text-slate-400">{toPersianDigits(value)} از ۵</span></div><div className="grid grid-cols-5 gap-2">{[1,2,3,4,5].map(item=><button key={item} onClick={()=>onChange(item)} className={`aspect-square rounded-xl text-xs font-black ${item<=value?'bg-[oklch(65%_0.11_330)] text-white':'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>{toPersianDigits(item)}</button>)}</div></div>;

const Range=({label,value,min,max,onChange}:{label:string;value:number;min:number;max:number;onChange:(value:number)=>void})=><label className="block"><span className="flex items-center justify-between text-sm font-black"><span>{label}</span><b className="text-[oklch(52%_0.13_330)]">{toPersianDigits(value)} روز</b></span><input type="range" min={min} max={max} value={value} onChange={e=>onChange(Number(e.target.value))} className="mt-2 w-full accent-pink-500"/></label>;
