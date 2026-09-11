import { MenstrualCycleConfig, CycleState, MenstrualPhase } from '../types/cycle';
import { getTodayIso, getDaysDifference, addDays } from './cycleService';

/**
 * سرویس پیشرفتهٔ چرخه، الهام‌گرفته از Roza.
 * 
 * تفاوت اصلی:
 * - محاسبهٔ میانهٔ آخرین ۶ چرخه (نه فقط عدد ثابت ۲۸)
 * - اطمینان بر اساس منظم‌بودن چرخه
 * - توصیه‌های خاص برای هر فاز و علائم
 * - توصیهٔ رابطه برای فازهای مختلف
 */

export interface CycleHistoryEntry {
  startIso: string;
  endIso?: string;
}

export interface CycleStatsAdvanced {
  completedCycles: number; // آخرین ۶ چرخهٔ کامل
  averageLength: number | null;
  shortestLength: number | null;
  longestLength: number | null;
  spreadDays: number | null;
  averagePeriodLength: number | null;
  confidence: 'none' | 'low' | 'medium' | 'high';
  isIrregular: boolean; // پراکندگی بیش از ۸ روز
}

export interface CyclePhaseRecommendation {
  phaseFa: string;
  skinCare: string[];
  relationshipTips: string[];
  emotionalTips: string[];
  avoidance: string[];
}

/**
 * محاسبهٔ میانهٔ مقادیر
 */
function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

/**
 * محاسبهٔ آمارِ چرخه از تاریخچهٔ پریودها
 */
export function deriveCycleStatsAdvanced(history: CycleHistoryEntry[]): CycleStatsAdvanced {
  if (history.length < 2) {
    return {
      completedCycles: 0,
      averageLength: null,
      shortestLength: null,
      longestLength: null,
      spreadDays: null,
      averagePeriodLength: null,
      confidence: 'none',
      isIrregular: false,
    };
  }

  // مرتب‌سازی از جدید به قدیم
  const sorted = [...history].sort((a, b) => (a.startIso > b.startIso ? -1 : 1));

  // محاسبهٔ طول چرخه‌ها (فاصلهٔ میان شروع دو پریود پے‌درپی)
  const lengths: number[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const gap = getDaysDifference(sorted[i].startIso, sorted[i + 1].startIso);
    // بازه معقول فیزیولوژیک: ۲۰ تا ۴۰ روز
    if (gap >= 20 && gap <= 40) {
      lengths.push(gap);
    }
  }

  // آخرین ۶ چرخهٔ معتبر
  const recent = lengths.slice(0, 6);

  // محاسبهٔ طول قاعدگی (اگر ثبت‌شده باشد)
  const periodLengths: number[] = [];
  sorted.forEach((entry) => {
    if (entry.endIso) {
      const pLen = getDaysDifference(entry.startIso, entry.endIso) + 1;
      if (pLen >= 2 && pLen <= 10) {
        periodLengths.push(pLen);
      }
    }
  });

  const averageLength = recent.length > 0 ? median(recent) : null;
  const shortest = recent.length > 0 ? Math.min(...recent) : null;
  const longest = recent.length > 0 ? Math.max(...recent) : null;
  const spread = shortest !== null && longest !== null ? longest - shortest : null;

  let confidence: 'none' | 'low' | 'medium' | 'high' = 'none';
  if (recent.length >= 4 && (spread ?? 99) <= 4) {
    confidence = 'high';
  } else if (recent.length >= 3 && (spread ?? 99) <= 8) {
    confidence = 'medium';
  } else if (recent.length >= 1) {
    confidence = 'low';
  }

  return {
    completedCycles: recent.length,
    averageLength,
    shortestLength: shortest,
    longestLength: longest,
    spreadDays: spread,
    averagePeriodLength: periodLengths.length > 0 ? median(periodLengths) : null,
    confidence,
    isIrregular: (spread ?? 0) > 8,
  };
}

/**
 * محاسبهٔ وضعیت فعلی چرخه
 */
export function computeCycleStateAdvanced(
  config: MenstrualCycleConfig,
  history: CycleHistoryEntry[],
  todayIso: string = getTodayIso()
): CycleState {
  const stats = deriveCycleStatsAdvanced(history);

  if (history.length === 0 || !config.enabled) {
    return {
      available: false,
      cycleDay: null,
      phase: null,
      phaseNameFa: 'نامعلوم',
      inPeriod: false,
      inLuteal: false,
    };
  }

  // آخرین پریودی که شروع شده
  const sorted = [...history].sort((a, b) => (a.startIso > b.startIso ? -1 : 1));
  const lastPeriod = sorted[0];

  // طول چرخهٔ واقعی (میانهٔ ۶ تا، یا ۲۸ اگر تاریخچه کم باشد)
  const cycleLength = stats.averageLength || 28;
  const periodLength = stats.averagePeriodLength || 5;
  
  // روز جاری در چرخه
  const daysElapsed = getDaysDifference(lastPeriod.startIso, todayIso);
  const cycleDay = daysElapsed + 1;
  const positionInCycle = ((cycleDay - 1) % cycleLength) + 1;

  // محاسبهٔ فاز
  // فاز لوتئال ۱۴ روز قبل پریود است، فاز فولیکولار بعدش
  const ovulationDay = Math.max(periodLength + 3, cycleLength - 14);
  let phase: MenstrualPhase;
  
  if (positionInCycle <= periodLength) {
    phase = 'menstrual';
  } else if (positionInCycle < ovulationDay - 1) {
    phase = 'follicular';
  } else if (positionInCycle <= ovulationDay + 1) {
    phase = 'ovulation';
  } else {
    phase = 'luteal';
  }

  // دایرهٔ بعدی
  const daysUntilNextPeriod = cycleLength - positionInCycle + 1;
  const nextPeriodDate = addDays(todayIso, daysUntilNextPeriod);
  const inPeriod = positionInCycle <= periodLength;
  const inLuteal = phase === 'luteal';

  return {
    available: true,
    cycleDay: positionInCycle,
    phase,
    phaseNameFa: getPhaseNameFa(phase),
    inPeriod,
    inLuteal,
    nextPeriodDate,
    daysUntilPeriod: daysUntilNextPeriod,
  };
}

function getPhaseNameFa(phase: MenstrualPhase | null): string {
  const names: Record<MenstrualPhase, string> = {
    menstrual: 'قاعدگی',
    follicular: 'فولیکولار (رشد)',
    ovulation: 'تخمک‌گذاری',
    luteal: 'لوتئال (PMS)',
  };
  return phase ? names[phase] : 'نامعلوم';
}

/**
 * توصیه‌های خاص برای هر فاز
 */
export const PHASE_RECOMMENDATIONS: Record<MenstrualPhase, CyclePhaseRecommendation> = {
  menstrual: {
    phaseFa: 'قاعدگی (۱–۵)',
    skinCare: [
      'شوینده بسیار ملایم و بدون الکل',
      'مرطوب‌کننده غنی (با سرامیدها)',
      'محصولات آرام‌کنندهٔ التهابات (Centella, Panthenol)',
      'از پیلینگ و حرارت اجتناب کن',
    ],
    relationshipTips: [
      'ممکن است احساس خستگی بیشتری کنی',
      'روابط نرم و آگاهانه تر',
      'خود‌مراقبتی برای خود بیشتر',
    ],
    emotionalTips: [
      'احساسات نوسان‌پذیر طبیعی است',
      'ورزش سبک مثل یوگا مفید است',
      'به خود مهربانی نشان بده',
    ],
    avoidance: [
      'لیزر و حذف مو',
      'پیلینگ شیمیایی',
      'عمل‌های زیبایی غیرضروری',
      'ورزش سنگین',
    ],
  },
  follicular: {
    phaseFa: 'فولیکولار (۶–۱۳)',
    skinCare: [
      'بهترین فاز برای لیزر و پیلینگ',
      'محصولات تقویتیٔ (Vitamin C, Niacinamide)',
      'عمل‌های زیبایی درمانی',
      'مراقبتِ پوستِ عمیق',
    ],
    relationshipTips: [
      'انرژی و تمایل بیشتر برای نزدیکی',
      'بهترین فازِ برای رابطهٔ حمیمی',
      'احساس اعتمادِ بیشتر',
    ],
    emotionalTips: [
      'انرژی و انگیزهٔ بالا',
      'تمرکز و خلاقیتِ در اوج',
      'خلق بهتر و مثبت‌تر',
    ],
    avoidance: [],
  },
  ovulation: {
    phaseFa: 'تخمک‌گذاری (۱۴–۱۶)',
    skinCare: [
      'شروعِ افزایشِ چربی پوست',
      'محصولات سبک و بدونِ کمدون',
      'ترطیب شفاف',
      'پاک‌سازی دقیق',
    ],
    relationshipTips: [
      'بیشترین تمایل جنسی در این دوره',
      'بهترین فازِ برای رابطهٔ زناشویی اگر می‌خواهی بارداری',
      'احساس جاذبهٔ بیشتر',
    ],
    emotionalTips: [
      'احساس اعتماد به نفسِ بالا',
      'تواصلِ بهتر با دیگران',
      'خلق و خویِ خوب',
    ],
    avoidance: [
      'کرم‌های سنگین و کمدون‌زا',
    ],
  },
  luteal: {
    phaseFa: 'لوتئال / PMS (۱۷–۲۸)',
    skinCare: [
      'مراقبتِ فوری جوش هورمونی',
      'Niacinamide, Zinc, Salicylic acid',
      'مرطوب‌کننده سبک',
      'ماسک‌های پاک‌کننده منافذ',
    ],
    relationshipTips: [
      'ممکن است تمایل جنسی کاهش یابد',
      'ارتباط عاطفی بیشتر از جسمانی',
      'نیاز به صبوری و درکِ شریک',
    ],
    emotionalTips: [
      'احساسات بیشتر در سطحی عمیق‌تر',
      'بدخلقی و پریشانی ممکن است',
      'خود مراقبتی مضاعف لازم است',
      'استراحتِ کافی ضروری است',
    ],
    avoidance: [
      'لیزر و حذف مو',
      'کرم‌های سنگین',
      'عمل‌های جراحی و تزریقی',
      'سفرهای طولانی و ورزشِ شدید',
    ],
  },
};

/**
 * توصیهٔ خانه برای امروز
 */
export function getHomeTip(phase: MenstrualPhase | null): string {
  if (!phase) return 'تاریخ قاعدگی را ثبت کن تا توصیه‌های شخصی‌شدهٔ روزانه دریافت کنی.';
  
  const tips: Record<MenstrualPhase, string[]> = {
    menstrual: [
      '🩸 امروز در بدنت در حالِ تغییر است. آرام بگیر و خود را بپذیر.',
      '💧 بیشتر آب بخور و خود مراقبتی کن.',
      '🛏️ استراحتِ کافی بسیار مهم است.',
    ],
    follicular: [
      '✨ انرژی‌ات بالا است! کارهای جدید شروع کن.',
      '💪 بهترین زمان برای ورزش و لیزر است.',
      '🌟 خلقت عالی است، از این لحظهٔ خوب استفاده کن.',
    ],
    ovulation: [
      '🌸 شانسِ باروری در اوج است.',
      '😊 احساس جاذبه و اعتمادِ بیشتر.',
      '💕 ارتباطات و روابط شنفق.',
    ],
    luteal: [
      '⚠️ علائم PMS شاید شروع شده باشد.',
      '🧘 خود مراقبتی و استراحت ضروری است.',
      '❤️ شریکت را بفهمانده این فازِ حساسِ تریه.',
    ],
  };

  const tipArray = tips[phase];
  return tipArray[Math.floor(Math.random() * tipArray.length)];
}
