import { CycleDailyCheckin, MenstrualPhase } from '../types';

export interface MoodInsight {
  count: number;
  averageMood: number;
  averageEnergy: number;
  averageIrritability: number;
  strongestNeed: CycleDailyCheckin['need'] | null;
  insightFa: string;
}

export function learnMoodPattern(checkins: CycleDailyCheckin[], phase?: MenstrualPhase | null): MoodInsight {
  if (!checkins.length) return { count: 0, averageMood: 0, averageEnergy: 0, averageIrritability: 0, strongestNeed: null, insightFa: 'با چند ثبت روزانه، الگوی شخصی خلق و انرژی‌ات ساخته می‌شود.' };
  const avg = (key: keyof Pick<CycleDailyCheckin, 'mood'|'energy'|'irritability'>) => checkins.reduce((sum, item) => sum + item[key], 0) / checkins.length;
  const needs = checkins.reduce<Record<string, number>>((map, item) => ({ ...map, [item.need]: (map[item.need] || 0) + 1 }), {});
  const strongestNeed = Object.entries(needs).sort((a,b) => b[1]-a[1])[0]?.[0] as CycleDailyCheckin['need'] | undefined;
  const mood = avg('mood'); const energy = avg('energy'); const irritability = avg('irritability');
  let insightFa = mood <= 2.5 ? 'ثبت‌های تو نشان می‌دهد افت خلق در بعضی روزها پررنگ است؛ پیش از گفت‌وگوهای سنگین، اول نیازت را مشخص کن.' : mood >= 4 ? 'خلق ثبت‌شده‌ات بیشتر مثبت است؛ از این روزها برای گفت‌وگوهای سازنده و ساختن خاطره استفاده کن.' : 'الگوی خلق تو میانه و متغیر است؛ ثبت مداوم، پیشنهادهای یار را دقیق‌تر می‌کند.';
  if (irritability >= 3.5) insightFa += phase === 'luteal' ? ' این الگو در فاز لوتئال ممکن است حساس‌تر شود.' : ' مکث کوتاه و تنفس قبل از پاسخ می‌تواند کمک‌کننده باشد.';
  return { count: checkins.length, averageMood: Number(mood.toFixed(1)), averageEnergy: Number(energy.toFixed(1)), averageIrritability: Number(irritability.toFixed(1)), strongestNeed: strongestNeed || null, insightFa };
}

export function buildPersonalNotifications(args: { phase?: MenstrualPhase | null; inPms?: boolean; temperature?: number | null; moodInsight: MoodInsight }) {
  const items: { id: string; title: string; body: string; tone: 'calm'|'warm'|'attention' }[] = [];
  if (args.inPms) items.push({ id:'pms-care', title:'بازه حساس چرخه', body:'امروز برای مکث، درخواست روشن و پرهیز از بحث سنگین آماده‌تر باش.', tone:'attention' });
  if (args.temperature !== null && args.temperature !== undefined && args.temperature <= 2) items.push({ id:'temperature-low', title:'دمای رابطه پایین ثبت شده', body:'یک مقاله کوتاه و یک اقدام کوچک برای نزدیک‌شدن آماده کرده‌ایم.', tone:'attention' });
  if (args.temperature !== null && args.temperature !== undefined && args.temperature >= 4) items.push({ id:'temperature-high', title:'دمای رابطه خوب است', body:'با یک تشکر مشخص، این روند را به عادت تبدیل کن.', tone:'warm' });
  if (!items.length) items.push({ id:'daily-step', title:'قدم امروز یار', body: args.moodInsight.count ? args.moodInsight.insightFa : 'حال امروزت را ثبت کن تا پیشنهادهای یار شخصی‌تر شوند.', tone:'calm' });
  return items;
}
