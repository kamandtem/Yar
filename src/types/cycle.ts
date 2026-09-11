/**
 * چرخهٔ قاعدگی ۲۸ روزهٔ استاندارد:
 * - روز ۱–۵: قاعدگی (menstrual)
 * - روز ۶–۱۳: فولیکولار (follicular)
 * - روز ۱۴–۱۶: تخمک‌گذاری (ovulation)
 * - روز ۱۷–۲۸: لوتئال (luteal / PMS)
 *
 * معادله‌ای برای چرخه‌های نامنظم: میانهٔ ۶ چرخهٔ گذشتهٔ کاربر.
 */

export type MenstrualPhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export interface PeriodLog {
  id: string;
  startIso: string; // 'YYYY-MM-DD'
  endIso?: string;
  notes?: string;
}

export interface CycleSymptom {
  id: string;
  dateIso: string;
  cycleDay: number;
  /** نام علامت: 'acne', 'oiliness', etc. */
  symptomKey: string;
  /** برای symptoms با مقیاس (۱–۵)، در غیر این صورت ۱ = حضور */
  severity: number;
}

export interface MenstrualCycleConfig {
  /** آیا کاربر می‌خواهد چرخهٔ خود را ردیابی کند؟ */
  enabled: boolean;
  /** طول چرخهٔ فرض برای پیش‌بینی (استاندارد ۲۸) */
  cycleLengthDays: number;
  /** مدت قاعدگی (استاندارد ۵) */
  periodLengthDays: number;
  /** آخرین شروعِ قاعدگی که ثبت شده */
  lastPeriodStartIso?: string;
  /** فاز هدف برای تنطیمِ روابط (تخمک‌گذاری برای بارداری، لوتئال برای جلوگیری) */
  targetPhase?: MenstrualPhase;
}

export interface CycleState {
  available: boolean;
  cycleDay: number | null;
  phase: MenstrualPhase | null;
  phaseNameFa: string;
  inPeriod: boolean;
  inLuteal: boolean;
  nextPeriodDate?: string; // 'YYYY-MM-DD'
  daysUntilPeriod?: number;
}

export const PHASE_COLORS: Record<MenstrualPhase, { bg: string; text: string; light: string }> = {
  menstrual: {
    bg: 'bg-red-600 dark:bg-red-700',
    text: 'text-red-600 dark:text-red-400',
    light: 'bg-red-50 dark:bg-red-950/40',
  },
  follicular: {
    bg: 'bg-emerald-600 dark:bg-emerald-700',
    text: 'text-emerald-600 dark:text-emerald-400',
    light: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
  ovulation: {
    bg: 'bg-amber-600 dark:bg-amber-700',
    text: 'text-amber-600 dark:text-amber-400',
    light: 'bg-amber-50 dark:bg-amber-950/40',
  },
  luteal: {
    bg: 'bg-violet-600 dark:bg-violet-700',
    text: 'text-violet-600 dark:text-violet-400',
    light: 'bg-violet-50 dark:bg-violet-950/40',
  },
};

export const PHASE_NAMES_FA: Record<MenstrualPhase, string> = {
  menstrual: 'قاعدگی',
  follicular: 'فولیکولار (رشد)',
  ovulation: 'تخمک‌گذاری',
  luteal: 'لوتئال (PMS)',
};

export const PHASE_DESCRIPTIONS_FA: Record<MenstrualPhase, string> = {
  menstrual: 'حساسیت بالا، رطوبت کم. پیلینگ و لیزر را کنار بگذار.',
  follicular: 'بهترین فاز برای لیزر، پیلینگ و فیشیال.',
  ovulation: 'ترشح چربی افزایش می‌یابد. مرطوب‌کننده سبک استفاده کن.',
  luteal: 'جوش هورمونی و نفخ. از محصولات سنگین اجتناب کن.',
};
