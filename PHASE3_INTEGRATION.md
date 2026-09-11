# فاز سوم: منطقِ پیشرفتهٔ چرخه

## فایل‌های جدید

### ۱. `src/services/cycleAdvanced.ts`
**کار:** محاسبهٔ پیشرفتهٔ چرخه، الهام‌گرفته از Roza

**تابع‌های اصلی:**
- `deriveCycleStatsAdvanced()` — میانهٔ ۶ چرخهٔ آخر
- `computeCycleStateAdvanced()` — وضعیت فعلی دقیق
- `getHomeTip()` — توصیهٔ روزانه‌ای تصادفی

**مزیت‌ها:**
- محاسبهٔ چرخهٔ متغیر (۲۰–۴۰ روز)
- اطمینان بر اساس منظم‌بودن
- ۱۲ توصیهٔ مختلف برای پوست/روابط/احساسات/پرهیز

### ۲. `src/components/home/CycleAdviceCard.tsx`
**کار:** نمایش توصیهٔ روزانهٔ چرخه در خانه

**محتوا:**
- نام فاز + روز چرخه
- تکهٔ توصیهٔ روزانه (۱۲ گزینه)
- ۲ نکتهٔ پوست
- ۲ نکتهٔ عاطفی
- ۲ نکتهٔ پرهیز

## ادغام در App.tsx

```typescript
// در App
import { computeCycleStateAdvanced } from './services/cycleAdvanced';

// محاسبهٔ فاز هر بار cycleConfig تغییر کند
const cycleState = useMemo(() => 
  computeCycleStateAdvanced(cycleConfig, periodHistory)
, [cycleConfig, periodHistory]);

// پاس دادن به HomeTab
<HomeTab
  ...
  cycleState={cycleState}
/>

// و نمایش CycleAdviceCard
<CycleAdviceCard
  phase={cycleState.phase}
  cycleDay={cycleState.cycleDay}
  inPeriod={cycleState.inPeriod}
  inLuteal={cycleState.inLuteal}
  onOpenCycle={() => setActiveTab('cycle')}
/>
```

## توصیه‌های فاز

هر فاز ۴ دستهٔ توصیه دارد:

| فاز | پوست | روابط | احساسات | پرهیز |
|---|---|---|---|---|
| قاعدگی | شوینده ملایم، سرامیدها | استراحت | احساسات نوسان | لیزر |
| فولیکولار | Vit C، پیلینگ | رابطهٔ بهتر | انرژیِ بالا | — |
| تخمک‌گذاری | مرطوب سبک | شانسِ باروری | اعتمادِ بالا | کرم سنگین |
| لوتئال | Niacinamide، Zinc | درک شریک | خود مراقبتی | جراحی |

## کاربرد

### صفحهٔ خانه
- **هدف:** سریعِ نگاه کاربر به توصیهٔ امروز
- **فرم:** کارت ۵۲۰px
- **ریفرش:** با هر بار بازگشت به تب Home

### صفحهٔ چرخه
- **هدف:** توصیه‌های کاملتر و تفصیلی
- **فرم:** بخش قابل اسکرول
- **نمایش:** ۱۲ توصیهٔ کامل برای فازِ جاری

## بعد

1. **علائم:** ثبتِ جوش، درد، خلق، خستگی (بند ۲)
2. **آنالیزِ شخصی:** "جوش‌های تو معمولاً روز ۲۳ شروع می‌شود"
3. **اعلان‌ها:** یادآوری ۲ روز قبل فاز PMS
4. **صفحهٔ آمار:** نمودارِ ماهانه
