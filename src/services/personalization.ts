import { CycleDailyCheckin, MenstrualPhase } from '../types';

export interface MoodInsight {
  count: number;
  averageMood: number;
  averageEnergy: number;
  averageIrritability: number;
  averagePain: number;
  strongestNeed: CycleDailyCheckin['need'] | null;
  trend: 'up' | 'down' | 'stable' | 'learning';
  trendFa: string;
  insightFa: string;
  actionFa: string;
}

const NEED_FA: Record<CycleDailyCheckin['need'], string> = {
  connection: 'نزدیکی', space: 'کمی فضا', support: 'حمایت', rest: 'استراحت', talk: 'گفت‌وگو',
};

export function learnMoodPattern(checkins: CycleDailyCheckin[], phase?: MenstrualPhase | null): MoodInsight {
  const recent = [...checkins].sort((a,b) => b.dateIso.localeCompare(a.dateIso)).slice(0, 14);
  if (!recent.length) return { count: 0, averageMood: 0, averageEnergy: 0, averageIrritability: 0, averagePain: 0, strongestNeed: null, trend: 'learning', trendFa: 'در حال یادگیری', insightFa: 'با ۳ ثبت، اولین الگوی شخصی ساخته می‌شود.', actionFa: 'حال امروزت را ثبت کن.' };
  const avg = (items: CycleDailyCheckin[], key: keyof Pick<CycleDailyCheckin, 'mood'|'energy'|'irritability'|'pain'>) => items.reduce((sum, item) => sum + item[key], 0) / items.length;
  const needs = recent.reduce<Record<string, number>>((map, item) => ({ ...map, [item.need]: (map[item.need] || 0) + 1 }), {});
  const strongestNeed = Object.entries(needs).sort((a,b) => b[1]-a[1])[0]?.[0] as CycleDailyCheckin['need'] | undefined;
  const mood = avg(recent, 'mood'); const energy = avg(recent, 'energy'); const irritability = avg(recent, 'irritability'); const pain = avg(recent, 'pain');
  let trend: MoodInsight['trend'] = 'learning'; let trendFa = 'در حال یادگیری';
  if (recent.length >= 6) {
    const current = avg(recent.slice(0,3), 'mood');
    const previous = avg(recent.slice(3,6), 'mood');
    trend = current - previous >= .65 ? 'up' : previous - current >= .65 ? 'down' : 'stable';
    trendFa = trend === 'up' ? 'رو به بهتر شدن' : trend === 'down' ? 'نیازمند توجه' : 'نسبتاً پایدار';
  }
  let insightFa = recent.length < 3 ? `${recent.length} ثبت داری؛ با ${3-recent.length} ثبت دیگر، الگو قابل اتکاتر می‌شود.` : mood <= 2.5 ? 'افت خلق در ثبت‌ها تکرار شده؛ زمان گفت‌وگوی سخت را با ظرفیتت هماهنگ کن.' : irritability >= 3.5 ? 'تحریک‌پذیری بیشتر از بقیه شاخص‌هاست؛ مکث قبل از پاسخ برای تو مهم‌تر است.' : energy <= 2.5 ? 'انرژی پایین الگوی پررنگ‌تری است؛ پیشنهادهای کوتاه و کم‌فشار مناسب‌ترند.' : 'خلق و انرژی فعلاً متعادل‌اند؛ این بازه برای گفت‌وگوی سازنده مناسب‌تر است.';
  if (phase === 'luteal' && irritability >= 3.5) insightFa += ' این الگو در فاز لوتئال پررنگ‌تر دیده می‌شود.';
  const actionFa = strongestNeed ? `نیاز پرتکرار تو «${NEED_FA[strongestNeed]}» است؛ پیشنهادهای خانه با همین اولویت چیده می‌شوند.` : 'ثبت‌ها برای شخصی‌سازی پیشنهادهای خانه استفاده می‌شوند.';
  return { count: recent.length, averageMood: Number(mood.toFixed(1)), averageEnergy: Number(energy.toFixed(1)), averageIrritability: Number(irritability.toFixed(1)), averagePain: Number(pain.toFixed(1)), strongestNeed: strongestNeed || null, trend, trendFa, insightFa, actionFa };
}

export function buildPersonalNotifications(args: { phase?: MenstrualPhase | null; inPms?: boolean; temperature?: number | null; moodInsight: MoodInsight }) {
  const items: { id:string; title:string; body:string; tone:'warm'|'attention'|'calm'; target:'home'|'couple'|'cycle' }[] = [];
  const quote = 'اول بشنو، بعد حل کن.';
  if (args.inPms) items.push({ id:'pms-care', title:'مکث قبل از واکنش', body:'بازه PMS فعال است؛ گفت‌وگوی سنگین را به زمان باثبات‌تری منتقل کن.', tone:'calm', target:'cycle' });
  if ((args.temperature ?? 3) <= 2) items.push({ id:'temperature-low', title:'رابطه به مراقبت نیاز دارد', body:'امروز هدف حل همه‌چیز نیست؛ فقط یک درخواست روشن و محترمانه.', tone:'attention', target:'couple' });
  if (args.moodInsight.averageEnergy > 0 && args.moodInsight.averageEnergy <= 2.5) items.push({ id:'low-energy', title:'نسخه کم‌فشار امروز', body:'پیشنهادهای کوتاه و بدون گفت‌وگوی سنگین برایت اولویت دارند.', tone:'calm', target:'home' });
  if (!items.length) items.push({ id:'daily-step', title:'قدم امروز یار', body: args.moodInsight.count ? args.moodInsight.insightFa : 'حال امروزت را ثبت کن.', tone:'warm', target:'home' });
  return [{ id:'quote-of-day', title:'جمله امروز', body:quote, tone:'warm', target:'home' }, ...items];
}
