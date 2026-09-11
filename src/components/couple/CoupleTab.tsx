import { PageIntroAccordion } from '../common/PageIntroAccordion';
import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { UserPreferences, CheckinResult, RelationshipMemory, WeeklyDate } from '../../types';
import { toPersianDigits, getTodayPersianDateString } from '../../utils/persianDate';
import { JalaliDatePicker } from '../common/JalaliDatePicker';
import { formatJalaliDate } from '../../services/jalali';
import { StorageService } from '../../services/storage';
import {
  Heart,
  Calendar,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Send,
  Sliders,
  Inbox,
  Activity,
  Smile,
  Coffee,
  Armchair,
  MessageCircleHeart,
  Camera,
  CalendarDays,
  BarChart3,
  Sparkles,
  HeartHandshake,
  HandHeart,
  UserRound,
  Zap
} from 'lucide-react';

interface CoupleTabProps {
  preferences: UserPreferences;
  weeklyDates: WeeklyDate[];
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
}

export const CoupleTab: React.FC<CoupleTabProps> = ({
  preferences,
  weeklyDates,
  onUpdatePreferences
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'checkin' | 'telemetry' | 'memories' | 'dates'>('checkin');

  // Check-in state
  const [intimacyRating, setIntimacyRating] = useState<number>(0);
  const [energyLevel, setEnergyLevel] = useState<'high' | 'medium' | 'low' | ''>('');
  const [currentNeed, setCurrentNeed] = useState('');
  const [gratitudeNote, setGratitudeNote] = useState('');
  const [checkinSaved, setCheckinSaved] = useState(false);
  const [checkinHistory, setCheckinHistory] = useState<CheckinResult[]>(() =>
    StorageService.getCheckinHistory()
  );

  // Memories state
  const [memories, setMemories] = useState<RelationshipMemory[]>(() =>
    StorageService.getMemories()
  );
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [newMemTitle, setNewMemTitle] = useState('');
  const [newMemDate, setNewMemDate] = useState('');
  const [newMemNotes, setNewMemNotes] = useState('');
  const [newMemFeeling, setNewMemFeeling] = useState('');

  // Weekly Dates completed state
  const [completedDates, setCompletedDates] = useState<string[]>(() =>
    StorageService.getWeeklyDatesCompleted()
  );

  const handleSaveCheckin = () => {
    if (!intimacyRating || !energyLevel || !currentNeed) return;
    const newCheckin: CheckinResult = {
      id: `checkin-${Date.now()}`,
      date: getTodayPersianDateString(),
      intimacyScore: intimacyRating,
      energyLevel: energyLevel as 'high' | 'medium' | 'low',
      currentNeed,
      gratitudeNote: gratitudeNote.trim() || undefined
    };
    StorageService.saveCheckin(newCheckin);
    setCheckinHistory([newCheckin, ...checkinHistory.filter(item => item.date !== newCheckin.date)]);
    setCheckinSaved(true);
    setTimeout(() => setCheckinSaved(false), 3000);
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemTitle.trim()) return;

    const created = StorageService.addMemory({
      title: newMemTitle.trim(),
      date: newMemDate ? formatJalaliDate(newMemDate) : getTodayPersianDateString(),
      notes: newMemNotes.trim(),
      feeling: newMemFeeling.trim() || undefined,
      type: 'milestone'
    });

    setMemories([created, ...memories]);
    setNewMemTitle('');
    setNewMemDate('');
    setNewMemNotes('');
    setNewMemFeeling('');
    setShowAddMemory(false);
  };

  const handleDeleteMemory = (id: string) => {
    StorageService.deleteMemory(id);
    setMemories(memories.filter((m) => m.id !== id));
  };

  const handleToggleDate = (id: string) => {
    StorageService.markWeeklyDateCompleted(id);
    setCompletedDates(StorageService.getWeeklyDatesCompleted());
  };

  const telemetry = useMemo(
    () => checkinHistory.slice(0, 7).reverse().map((item, index) => ({
      label: item.date,
      value: (item.intimacyScore || 0) * 20,
      active: index === Math.min(checkinHistory.length, 7) - 1
    })),
    [checkinHistory]
  );
  const averageScore = telemetry.length
    ? Math.round(telemetry.reduce((sum, item) => sum + item.value, 0) / telemetry.length)
    : 0;

  return (
    <div className="pt-1 px-4 max-w-md mx-auto space-y-5">
      <PageIntroAccordion kind="couple" />

      {/* Sub-Tabs Selector (like the pills in Screen 3) */}
      <div className="grid grid-cols-4 gap-1.5 rounded-[1.35rem] bg-[oklch(94%_0.018_300)] p-1.5 text-[10px] font-black dark:bg-slate-800/80">
        <button
          onClick={() => setActiveSubTab('checkin')}
          className={`py-2 rounded-xl transition-all active:scale-[.97] ${
            activeSubTab === 'checkin'
              ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-soft-card'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="flex items-center justify-center gap-1.5"><Activity size={14}/>چک‌این امروز</span>
        </button>
        <button
          onClick={() => setActiveSubTab('telemetry')}
          className={`py-2 rounded-xl transition-all active:scale-[.97] ${
            activeSubTab === 'telemetry'
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-soft-card'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="flex items-center justify-center gap-1.5"><BarChart3 size={14}/>روند ما</span>
        </button>
        <button
          onClick={() => setActiveSubTab('memories')}
          className={`py-2 rounded-xl transition-all active:scale-[.97] ${
            activeSubTab === 'memories'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-soft-card'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="flex items-center justify-center gap-1.5"><Camera size={14}/>خاطرات ما</span>
        </button>
        <button
          onClick={() => setActiveSubTab('dates')}
          className={`py-2 rounded-xl transition-all active:scale-[.97] ${
            activeSubTab === 'dates'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-soft-card'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="flex items-center justify-center gap-1.5"><CalendarDays size={14}/>قرارهای ما</span>
        </button>
      </div>

      {/* SUB-TAB 1: CHECK-IN */}
      {activeSubTab === 'checkin' && (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-[2rem] border border-[oklch(88%_0.045_300)] bg-[oklch(97%_0.025_300)] p-5 shadow-[0_16px_40px_oklch(45%_0.08_300_/_0.08)] dark:border-violet-900/40 dark:bg-violet-950/20 space-y-5">
            <div className="pointer-events-none absolute -left-12 -top-14 h-36 w-36 rounded-full bg-[oklch(82%_0.12_300_/_0.35)]" />
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-[0_8px_18px_oklch(45%_0.16_300_/_0.2)]"><Activity size={17}/></span>
                <span><b className="block">حال امروز ما</b><small className="mt-0.5 block text-[10px] font-medium text-slate-500">یک دقیقه برای فهمیدن حال هم</small></span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {getTodayPersianDateString()}
              </span>
            </div>

            {/* 1. Intimacy score */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                ۱. امروز چقدر حس نزدیکی و اتصال بینمان حس می‌کنی؟
              </label>
              <div className="flex items-center justify-between gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((score) => {
                  const isSelected = intimacyRating === score;
                  const labels = ['فاصله‌دار', 'کمی سرد', 'معمولی', 'نزدیک', 'بسیار صمیمی'];
                  return (
                    <button
                      key={score}
                      onClick={() => setIntimacyRating(score)}
                      className={`flex-1 py-2.5 px-1 rounded-2xl flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-violet-500 bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-400 font-bold shadow-soft-card scale-105'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {[HeartHandshake, MessageCircleHeart, Smile, HandHeart, Heart][score - 1] && React.createElement([HeartHandshake, MessageCircleHeart, Smile, HandHeart, Heart][score - 1], { size: 17, className: isSelected ? 'text-violet-600' : 'text-slate-300' })}
                      <span className="text-[10px] font-semibold">{toPersianDigits(score)}</span>
                      <span className="text-[9px]">{labels[score - 1]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Energy Level */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                ۲. سطح انرژی روانی و بدنی خودت امروز چطور است؟
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'high', label: 'پرانرژی و سرحال', icon: <Zap size={16}/> },
                  { id: 'medium', label: 'متوسط و آرام', icon: <Coffee size={16}/> },
                  { id: 'low', label: 'خسته یا بی‌حوصله', icon: <Armchair size={16}/> }
                ].map((item) => {
                  const isSelected = energyLevel === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setEnergyLevel(item.id as 'high' | 'medium' | 'low')}
                      className={`p-2.5 rounded-2xl text-center border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 shadow-soft-card'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span className="text-[11px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Current Need */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                ۳. در این لحظه بیشتر به چه چیزی از رابطه نیاز داری؟
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'آغوش و نوازش',
                  'شنیده شدن و دردودل',
                  'سکوت و فضای شخصی',
                  'همراهی در کارها',
                  'تفریح و خنده مشترک',
                  'قدردانی کلامی'
                ].map((need) => (
                  <button
                    key={need}
                    onClick={() => setCurrentNeed(need)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                      currentNeed === need
                        ? 'bg-violet-600 text-white border-violet-600 shadow-soft-card'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {need}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Gratitude Note */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                ۴. یک خط محبت برای امروز
              </label>
              <textarea
                value={gratitudeNote}
                onChange={(e) => setGratitudeNote(e.target.value)}
                placeholder="مثلاً: بابت چای صبح، صبوری حین صحبت یا خنده‌ای که به من هدیه دادی ممنونم..."
                rows={2}
                className="w-full p-3 text-xs rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-violet-500 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              {checkinSaved ? (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={16} />
                  <span>حال امروزت در اتاق ما ثبت شد</span>
                </div>
              ) : (
                <button
                  id="submit-checkin-btn"
                  onClick={handleSaveCheckin}
                  disabled={!intimacyRating || !energyLevel || !currentNeed}
                  className="w-full py-3 px-5 rounded-2xl bg-[oklch(52%_0.16_300)] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs hover:bg-[oklch(45%_0.16_300)] transition-all shadow-soft-elevated flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send size={14} />
                  <span>ثبت در اتاق ما</span>
                </button>
              )}
            </div>
          </div>

          {/* Past Check-ins */}
          {checkinHistory.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                ثبت‌های اخیر ما
              </h3>
              <div className="space-y-2">
                {checkinHistory.slice(0, 3).map((item, idx) => (
                  <div
                    key={item.id || `${item.date}-${idx}`}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs shadow-soft-card"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.date}
                        </span>
                        <span className="text-[10px] text-violet-600 font-semibold bg-violet-50 dark:bg-violet-950/70 px-2 py-0.5 rounded-full">
                          صمیمیت: {toPersianDigits(item.intimacyScore || 0)} از ۵
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        نیاز: {item.currentNeed}
                        {item.gratitudeNote && ` • قدردانی: «${item.gratitudeNote}»`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: TELEMETRY & SLIDERS (directly matching Screen 3 of the reference image!) */}
      {activeSubTab === 'telemetry' && (
        <div className="space-y-4">
          {/* Weekly Telemetry Bar Chart matching Screen 3 */}
          <div className="p-5 rounded-[28px] bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 shadow-soft-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400">نمودار پایداری هفتگی</span>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  شاخص هماهنگی عاطفی
                </h3>
              </div>
              <span className="text-xs font-extrabold text-violet-600 bg-violet-50 dark:bg-violet-950/70 px-2.5 py-1 rounded-full">
                {toPersianDigits(averageScore)}٪ میانگین
              </span>
            </div>

            {telemetry.length > 0 ? (
            <div className="flex items-end justify-center gap-3 h-36 pt-4 pb-2 px-2 border-b border-slate-100 dark:border-slate-700/60">
              {telemetry.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {toPersianDigits(item.value)}٪
                  </span>
                  <div className="w-full max-w-[28px] bg-slate-100 dark:bg-slate-700/60 h-full rounded-2xl p-0.5 flex flex-col justify-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${item.value}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.08 }}
                      className={`w-full rounded-xl transition-all active:scale-[.97] ${
                        item.active
                          ? 'bg-linear-to-t from-violet-600 via-purple-500 to-sky-400 shadow-[0_4px_12px_rgba(99,102,241,0.4)]'
                          : 'bg-linear-to-t from-slate-300 to-slate-200 dark:from-slate-600 dark:to-slate-500 group-hover:from-violet-400 group-hover:to-sky-300'
                      }`}
                    />
                  </div>
                  <span className={`text-[9px] font-bold truncate max-w-12 ${item.active ? 'text-violet-600 font-black' : 'text-slate-400'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            ) : (
              <div className="py-8 text-center text-slate-400">
                <Inbox size={28} className="mx-auto mb-2" />
                <p className="text-xs font-bold">هنوز داده‌ای برای نمودار ثبت نشده</p>
                <p className="text-[11px] mt-1">اولین چک‌این را ثبت کن تا روند واقعی رابطه اینجا شکل بگیرد.</p>
              </div>
            )}
          </div>

          {/* Interactive Sliders (matching Lamp 54% and AC 34% in Screen 3) */}
          <div className="p-5 rounded-[28px] bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 shadow-soft-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 dark:text-white">
                آخرین وضعیت ثبت‌شده
              </span>
              <Sliders size={15} className="text-violet-500" />
            </div>

            {checkinHistory[0] ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span>صمیمیت</span><strong>{toPersianDigits(checkinHistory[0].intimacyScore || 0)} از ۵</strong></div>
                <div className="flex justify-between"><span>نیاز فعلی</span><strong>{checkinHistory[0].currentNeed}</strong></div>
                <div className="flex justify-between"><span>تاریخ ثبت</span><strong>{checkinHistory[0].date}</strong></div>
              </div>
            ) : <p className="text-xs text-slate-400">بعد از ثبت چک‌این، خلاصه واقعی اینجا نمایش داده می‌شود.</p>}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MEMORIES TIMELINE */}
      {activeSubTab === 'memories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">
              روزشمار و لحظات ماندگار رابطه
            </span>
            <button
              onClick={() => setShowAddMemory(!showAddMemory)}
              className="py-1.5 px-3 rounded-2xl bg-violet-600 text-white text-xs font-bold hover:bg-[oklch(45%_0.16_300)] transition-all flex items-center gap-1 shadow-soft-card cursor-pointer"
            >
              <Plus size={14} />
              <span>ثبت خاطره</span>
            </button>
          </div>

          {/* Add Memory Form */}
          {showAddMemory && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleAddMemory}
              className="p-5 rounded-[28px] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft-card space-y-3"
            >
              <h3 className="text-xs font-black text-slate-900 dark:text-white">
                ثبت یک لحظه شیرین یا نقطه عطف
              </h3>

              <div className="space-y-2">
                <input
                  type="text"
                  required
                  value={newMemTitle}
                  onChange={(e) => setNewMemTitle(e.target.value)}
                  placeholder="عنوان خاطره (مثلاً: اولین سفر شمال دو نفره)"
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-violet-500"
                />
                <div className="grid grid-cols-1 gap-3">
                  <JalaliDatePicker value={newMemDate} onChange={setNewMemDate} labelFa="تاریخ خاطره" allowFuture={false} />
                  <input
                    type="text"
                    value={newMemFeeling}
                    onChange={(e) => setNewMemFeeling(e.target.value)}
                    placeholder="حس غالب (مثلاً: شوق و آرامش)"
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-violet-500"
                  />
                </div>
                <textarea
                  value={newMemNotes}
                  onChange={(e) => setNewMemNotes(e.target.value)}
                  placeholder="یادداشت یا جزئیات کوتاهی که دوست داری یادت بماند..."
                  rows={2}
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-violet-500 resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddMemory(false)}
                  className="py-1.5 px-3 rounded-xl border border-slate-200 text-slate-500 text-xs font-semibold cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-[oklch(45%_0.16_300)] cursor-pointer"
                >
                  ذخیره خاطره
                </button>
              </div>
            </motion.form>
          )}

          {/* Timeline List */}
          <div className="space-y-3">
            {memories.length === 0 && (
              <div className="py-10 text-center rounded-[24px] bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 text-slate-400">
                <Calendar size={28} className="mx-auto mb-2" />
                <p className="text-xs font-bold">هنوز خاطره‌ای ثبت نکرده‌اید</p>
                <p className="text-[11px] mt-1">اولین لحظه واقعی خودتان را اضافه کنید.</p>
              </div>
            )}
            {memories.map((mem) => (
              <div
                key={mem.id}
                className="p-4 rounded-[24px] bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 shadow-soft-card space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                      {mem.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar size={11} />
                      <span>{mem.date}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {mem.feeling && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full">{mem.feeling}</span>}
                    <button
                      onClick={() => handleDeleteMemory(mem.id)}
                      className="text-slate-300 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                      title="حذف خاطره"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {mem.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {mem.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: WEEKLY DATE IDEAS */}
      {activeSubTab === 'dates' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            <Sparkles size={15} className="inline ml-1 text-amber-500" /> <strong className="font-bold">پیشنهاد پژوهش‌های بالینی گاتمن:</strong> زوج‌هایی که دو هفته یک‌بار یک قرار اختصاصی بدون تلفن همراه دارند، ۸۰٪ کمتر دچار فرسودگی عاطفی می‌شوند.
          </div>

          <div className="space-y-3">
            {weeklyDates.map((dateItem) => {
              const isDone = completedDates.includes(dateItem.id);

              return (
                <div
                  key={dateItem.id}
                  className={`p-5 rounded-[28px] border transition-all space-y-3 shadow-soft-card ${
                    isDone
                      ? 'border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-900'
                      : 'border-slate-100 bg-white dark:bg-slate-800/90 dark:border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/70 px-2.5 py-0.5 rounded-full">
                      پیشنهاد دونفره
                    </span>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{dateItem.duration}</span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      {dateItem.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {dateItem.description}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                    <MessageCircleHeart size={15} className="inline ml-1 text-violet-500" /> <strong className="font-bold text-slate-900 dark:text-white">پرسش ویژه حین قرار:</strong> «{dateItem.reflectionPrompt}»
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    <button
                      onClick={() => handleToggleDate(dateItem.id)}
                      className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isDone
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                          : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900'
                      }`}
                    >
                      <CheckCircle2 size={14} />
                      <span>{isDone ? 'این قرار انجام شد ✓' : 'علامت‌گذاری به عنوان انجام شده'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
