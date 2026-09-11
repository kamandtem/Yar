/**
 * Utilities for Persian numbers, Jalali dates and formatting
 */

export function toPersianDigits(num: number | string): string {
  if (num === null || num === undefined) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (x) => persianDigits[parseInt(x, 10)]);
}

export const PERSIAN_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند'
];

export const PERSIAN_WEEKDAYS = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه'
];

/**
 * Returns a human-friendly Persian date representation
 */
export function getTodayPersianDateString(): string {
  // Simple deterministic calculation based on Persian calendar approximations
  const today = new Date();
  const day = today.getDate();
  const monthIdx = (today.getMonth() + 9) % 12; // approximate offset
  const persianMonth = PERSIAN_MONTHS[monthIdx];
  const year = 1403;
  return `${toPersianDigits(day)} ${persianMonth} ${toPersianDigits(year)}`;
}
