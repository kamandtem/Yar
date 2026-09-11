# ویژگی جدید: ردیابی قاعدگی (Cycle Tracking)

## نقطهٔ شروع

هنگام **اولین بار** استفاده از اپ، مرحلهٔ onboarding کاربر را می‌پرسد:
- "آیا می‌خواهی قاعدگی‌ات را ردیابی کنم؟"
- اگر بله: تاریخِ آخرین قاعدگی را می‌خواهد
- اگر خیر: صرفاً گذر می‌کند

## صفحهٔ چرخه

**مسیر:** BottomNav → تب چهارم = `CycleTab`

### محتوا:
1. **چرخ رنگی** (دایرهٔ ۴ بخش)
   - قرمز: قاعدگی (روز ۱–۵)
   - سبز: فولیکولار / رشد (روز ۶–۱۳)
   - عسلی: تخمک‌گذاری (روز ۱۴–۱۶)
   - بنفش: لوتئال / PMS (روز ۱۷–۲۸)
   - مرکز: روز جاری چرخه

2. **کارتِ اطلاعات فاز**
   - عنوان فاز فعلی
   - توصیهٔ رویه‌ای (مثلاً "بهترین زمان لیزر است" / "از محصولات سنگین اجتناب کن")
   - نشانگر اگر در قاعدگی یا PMS باشد

3. **پیش‌بینی**
   - تاریخِ شروعِ قاعدگی بعدی
   - تعداد روزهای باقی‌مانده

4. **دکمه ثبت/تصحیح**
   - فرم ساده: انتخابِ تاریخ YYYY-MM-DD
   - ثبت = به‌روزرسانیِ `lastPeriodStartIso`

5. **دکمه حذف**
   - غیر‌فعال کردن ردیابی اگر کاربر نخواهد

## معماری

### فایل‌های جدید:
- `src/types/cycle.ts` — تایپ‌ها و رنگ‌ها
- `src/services/cycleService.ts` — منطق محاسبهٔ فاز
- `src/components/cycle/CycleTab.tsx` — صفحهٔ اصلی
- `src/components/onboarding/CycleOnboardingStep.tsx` — مرحلهٔ پذیرش

### تغییرات موجود:
- `src/App.tsx` — اضافه کردن state و CycleTab
- `src/types/index.ts` — اضافه کردن exports
- `src/components/onboarding/OnboardingModal.tsx` — اضافه کردن step

## State Management

### `MenstrualCycleConfig`
```typescript
{
  enabled: boolean;
  cycleLengthDays: number; // پیش‌فرض ۲۸
  periodLengthDays: number; // پیش‌فرض ۵
  lastPeriodStartIso?: string; // آخرین شروعِ قاعدگی
}
```

### `CycleState` (محاسبه‌شده)
```typescript
{
  available: boolean;
  cycleDay: number | null; // ۱–۲۸
  phase: MenstrualPhase | null;
  phaseNameFa: string;
  inPeriod: boolean;
  inLuteal: boolean; // PMS
  nextPeriodDate?: string;
  daysUntilPeriod?: number;
}
```

## محاسبات

### `computeCycleState(config, todayIso)`
۱. اگر `enabled = false`، برگردان `available: false`
۲. محاسبهٔ روز چرخهٔ فعلی: `getDaysDifference(lastPeriodStart, today)`
۳. موضعِ در چرخهٔ نرمال شده: `(cycleDay - 1) % cycleLengthDays + 1`
۴. تعیینِ فاز از روز
۵. پیش‌بینی: `nextPeriodDate = today + (cycleLengthDays - cycleDay)`

### `getDaysDifference(fromIso, toIso)`
- تفاضلِ روزها بین دو ISO تاریخ
- شامل روز شروع: مثلاً ۲ سپتامبر تا ۲ سپتامبر = ۱ روز

## رنگ‌ها

| فاز | BG | Text | Light |
|---|---|---|---|
| قاعدگی | `bg-red-600` | `text-red-600` | `bg-red-50` |
| فولیکولار | `bg-emerald-600` | `text-emerald-600` | `bg-emerald-50` |
| تخمک‌گذاری | `bg-amber-600` | `text-amber-600` | `bg-amber-50` |
| لوتئال | `bg-violet-600` | `text-violet-600` | `bg-violet-50` |

## مرحلهٔ بعد (آماده برای نسخه بعد)

- **علائم:** ثبتِ جوش، درد، خلق پایین، خستگی، غیره
- **تنطیمات رابطه:** انتخابِ فاز هدف برای پیش‌بینیهای رابطه
- **کارتِ خانه:** نمایشِ فازِ فعلی
- **داشبورد ماهانه:** نمودار ۲۸ روز با رنگِ فازها

## نکات مهم

1. **ردیابی اختیاری:** هیچ کاربری مجبور نیست قاعدگی را ردیابی کند
2. **بدون کمپلیکس:** محاسبات سادهٔ استاندارد، بدون هوش‌مصنوعی یا ML
3. **محافظتِ حریم:** تاریخِ قاعدگی فقط در Storage محلی ذخیره می‌شود
4. **تم:** رنگ‌ها مطابقِ Dark Mode Tailwind
