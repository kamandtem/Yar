import { MenstrualCycleConfig, CycleState, MenstrualPhase } from '../types/cycle';

/**
 * محاسبهٔ فازِ فعلی بر اساس روز چرخه.
 * فرض: چرخهٔ ۲۸ روزه
 *  - روز ۱–۵: قاعدگی
 *  - روز ۶–۱۳: فولیکولار
 *  - روز ۱۴–۱۶: تخمک‌گذاری
 *  - روز ۱۷–۲۸: لوتئال
 */
function getPhaseFromCycleDay(day: number, cycleLengthDays: number = 28): MenstrualPhase {
  const periodLength = 5;
  const ovulationDay = Math.round(cycleLengthDays * 0.5); // روز ۱۴ در چرخهٔ ۲۸
  const ovulationWindow = 3;

  if (day <= periodLength) return 'menstrual';
  if (day >= ovulationDay - 1 && day <= ovulationDay + 1) return 'ovulation';
  if (day < ovulationDay) return 'follicular';
  return 'luteal';
}

function getPhaseNameFa(phase: MenstrualPhase | null): string {
  const names: Record<MenstrualPhase, string> = {
    menstrual: 'قاعدگی',
    follicular: 'فولیکولار',
    ovulation: 'تخمک‌گذاری',
    luteal: 'لوتئال',
  };
  return phase ? names[phase] : 'نامعلوم';
}

/**
 * محاسبهٔ تعداد روزهای گذشته از تاریخ مشخص تا امروز
 */
export function getDaysDifference(fromIso: string, toIso: string): number {
  const from = new Date(fromIso);
  const to = new Date(toIso);
  const diffMs = to.getTime() - from.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1; // شامل روز شروع
}

/**
 * محاسبهٔ حالت چرخه کاربر در تاریخِ مشخص
 */
export function computeCycleState(
  config: MenstrualCycleConfig,
  todayIso: string
): CycleState {
  if (!config.enabled || !config.lastPeriodStartIso) {
    return {
      available: false,
      cycleDay: null,
      phase: null,
      phaseNameFa: 'نامعلوم',
      inPeriod: false,
      inLuteal: false,
    };
  }

  const cycleLengthDays = config.cycleLengthDays || 28;
  const periodLengthDays = config.periodLengthDays || 5;
  const cycleDay = getDaysDifference(config.lastPeriodStartIso, todayIso);
  const positionInCycle = ((cycleDay - 1) % cycleLengthDays) + 1;

  const phase = getPhaseFromCycleDay(positionInCycle, cycleLengthDays);
  const phaseNameFa = getPhaseNameFa(phase);
  const inPeriod = positionInCycle <= periodLengthDays;
  const inLuteal = phase === 'luteal';

  // پیش‌بینی شروع قاعدگی بعدی
  const daysUntilNextPeriod = cycleLengthDays - positionInCycle + 1;
  const nextPeriodDate = addDays(todayIso, daysUntilNextPeriod);

  return {
    available: true,
    cycleDay: positionInCycle,
    phase,
    phaseNameFa,
    inPeriod,
    inLuteal,
    nextPeriodDate,
    daysUntilPeriod: daysUntilNextPeriod,
  };
}

/**
 * اضافه کردن روزها به یک تاریخِ ISO
 */
export function addDays(dateIso: string, days: number): string {
  const date = new Date(dateIso);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

/**
 * امروز به صورت ISO (YYYY-MM-DD)
 */
export function getTodayIso(): string {
  return new Date().toISOString().split('T')[0];
}
