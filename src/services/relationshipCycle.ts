import { MenstrualCycleConfig, MenstrualPhase, PeriodLog, CycleDailyCheckin } from '../types';
import { addDays, getDaysDifference, getTodayIsoDate } from './jalali';

export type PredictionConfidence = 'none' | 'low' | 'medium' | 'high';

export interface RelationshipCycleState {
  available: boolean;
  cycleDay: number | null;
  cycleLength: number;
  periodLength: number;
  phase: MenstrualPhase | null;
  phaseNameFa: string;
  nextPeriodIso: string | null;
  daysUntilNextPeriod: number | null;
  confidence: PredictionConfidence;
  spreadDays: number | null;
  completedCycles: number;
  inPmsWindow: boolean;
  irregular: boolean;
}

const PHASE_NAMES: Record<MenstrualPhase, string> = {
  menstrual: 'قاعدگی', follicular: 'فولیکولار', ovulation: 'تخمک‌گذاری تقریبی', luteal: 'لوتئال',
};

function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : Math.round((sorted[middle - 1] + sorted[middle]) / 2);
}

export function deriveCycleStats(logs: PeriodLog[], fallbackLength = 28) {
  const sorted = [...logs].sort((a, b) => a.startIso.localeCompare(b.startIso));
  const lengths: number[] = [];
  for (let index = 1; index < sorted.length; index += 1) {
    const length = getDaysDifference(sorted[index - 1].startIso, sorted[index].startIso);
    if (length >= 18 && length <= 60) lengths.push(length);
  }
  const recent = lengths.slice(-6);
  const estimatedLength = median(recent) ?? fallbackLength;
  const shortest = recent.length ? Math.min(...recent) : null;
  const longest = recent.length ? Math.max(...recent) : null;
  const spreadDays = shortest !== null && longest !== null ? longest - shortest : null;
  const confidence: PredictionConfidence = recent.length >= 4 && (spreadDays ?? 99) <= 4
    ? 'high' : recent.length >= 3 && (spreadDays ?? 99) <= 8
      ? 'medium' : recent.length >= 1 ? 'low' : 'none';
  return { estimatedLength, spreadDays, confidence, completedCycles: recent.length, irregular: (spreadDays ?? 0) > 8 };
}

export function getPhaseForDay(day: number, cycleLength: number, periodLength: number): MenstrualPhase {
  if (day <= periodLength) return 'menstrual';
  const ovulationDay = Math.max(periodLength + 2, cycleLength - 14);
  if (day >= ovulationDay - 1 && day <= ovulationDay + 1) return 'ovulation';
  if (day < ovulationDay - 1) return 'follicular';
  return 'luteal';
}

export function computeRelationshipCycle(
  config: MenstrualCycleConfig,
  logs: PeriodLog[],
  todayIso = getTodayIsoDate(),
): RelationshipCycleState {
  const fallbackLogs = logs.length ? logs : config.lastPeriodStartIso
    ? [{ id: 'legacy-period', startIso: config.lastPeriodStartIso }]
    : [];
  const stats = deriveCycleStats(fallbackLogs, config.cycleLengthDays || 28);
  const latest = [...fallbackLogs].sort((a, b) => b.startIso.localeCompare(a.startIso))[0];
  const cycleLength = Math.min(60, Math.max(18, stats.estimatedLength));
  const periodLength = Math.min(10, Math.max(2, config.periodLengthDays || 5));
  if (!config.enabled || !latest) {
    return { available: false, cycleDay: null, cycleLength, periodLength, phase: null, phaseNameFa: 'نامعلوم', nextPeriodIso: null, daysUntilNextPeriod: null, inPmsWindow: false, ...stats };
  }
  const elapsed = Math.max(0, getDaysDifference(latest.startIso, todayIso));
  const cycleDay = (elapsed % cycleLength) + 1;
  const phase = getPhaseForDay(cycleDay, cycleLength, periodLength);
  const daysUntilNextPeriod = cycleLength - cycleDay + 1;
  const pmsDays = config.pmsStartDaysBefore ?? 7;
  return {
    available: true, cycleDay, cycleLength, periodLength, phase,
    phaseNameFa: PHASE_NAMES[phase],
    nextPeriodIso: addDays(todayIso, daysUntilNextPeriod),
    daysUntilNextPeriod,
    inPmsWindow: daysUntilNextPeriod <= pmsDays && phase === 'luteal',
    ...stats,
  };
}

export const RELATIONSHIP_GUIDANCE: Record<MenstrualPhase, {
  headline: string; body: string; partnerTip: string; selfTip: string; color: string;
}> = {
  menstrual: {
    headline: 'آرام‌تر، نه دورتر',
    body: 'درد، خستگی یا نیاز به خلوت ممکن است بیشتر شود. این تجربه برای هر فرد متفاوت است.',
    partnerTip: 'به‌جای حدس‌زدن بپرس: امروز همراهی می‌خواهی، استراحت یا کمی فضا؟',
    selfTip: 'نیازت را واضح و بدون عذرخواهی بگو. شدت علائم را ثبت کن تا الگوی شخصی‌ات پیدا شود.',
    color: 'oklch(62% 0.16 20)',
  },
  follicular: {
    headline: 'فضای خوب برای شروع و گفت‌وگو',
    body: 'بعد از قاعدگی ممکن است انرژی و تمرکز تدریجاً بهتر شود، اما ثبت خودت از هر قاعده عمومی مهم‌تر است.',
    partnerTip: 'اگر انرژی دارید، یک قرار کوتاه یا گفت‌وگوی برنامه‌ریزی‌شده را همین روزها امتحان کنید.',
    selfTip: 'کارهای نیازمند تمرکز را جلو بینداز، ولی چرخه را نسخه قطعی خلق‌وخو فرض نکن.',
    color: 'oklch(59% 0.10 175)',
  },
  ovulation: {
    headline: 'ارتباط گرم‌تر، با توجه به تفاوت فردی',
    body: 'در برخی افراد انرژی، اجتماعی‌بودن یا میل جنسی بیشتر می‌شود؛ در بعضی‌ها هیچ تغییر مشخصی دیده نمی‌شود.',
    partnerTip: 'نزدیکی را پیشنهاد بده، نه مطالبه. رضایت و حال واقعی امروز همیشه مقدم است.',
    selfTip: 'حال خوب امروز را ثبت کن تا ببینی آیا واقعاً با این فاز برای تو تکرار می‌شود یا نه.',
    color: 'oklch(68% 0.13 78)',
  },
  luteal: {
    headline: 'مکث قبل از واکنش',
    body: 'در روزهای پیش از قاعدگی، تحریک‌پذیری، افت خلق یا حساسیت ممکن است بیشتر شود. احساس واقعی است، اما پیش‌بینی قطعیت ندارد.',
    partnerTip: 'بحث حساس را با چک‌این شروع کنید: الان ظرفیت حل مسئله داریم یا بهتر است زمان مشخص دیگری انتخاب کنیم؟',
    selfTip: 'خواب، درد، خلق و نیاز به فضا را ثبت کن. اگر علائم شدید یا مختل‌کننده‌اند با پزشک گفت‌وگو کن.',
    color: 'oklch(58% 0.13 300)',
  },
};

export function getPersonalPattern(checkins: CycleDailyCheckin[]): string | null {
  if (checkins.length < 4) return null;
  const lowMood = checkins.filter((item) => item.mood <= 2).length;
  const irritable = checkins.filter((item) => item.irritability >= 4).length;
  if (lowMood >= 2 || irritable >= 2) return 'چند ثبت اخیر نشان می‌دهد روزهای حساس‌تری داشته‌ای. برای تصمیم‌های رابطه‌ای مهم، اول ظرفیت و نیازت را چک کن.';
  return 'ثبت‌های اخیر الگوی هشداردهنده ثابتی نشان نمی‌دهند. ادامه ثبت، توصیه‌ها را شخصی‌تر می‌کند.';
}
