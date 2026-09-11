# فاز دوم: رابط کاربری نهایی

## ۱. صفحهٔ چرخه ✅
**فایل:** `src/components/cycle/CycleTab.tsx`
- چرخ رنگی SVG ۴ فاز
- کارتِ اطلاعات و توصیه‌های فاز
- پیش‌بینی قاعدگی بعدی
- فرم ثبت/تصحیح

## ۲. صفحهٔ مقالات (Timeline) ✅
**فایل:** `src/components/library/ArticlesTimelineTab.tsx`
- دسته‌بندی مقالات
- Timeline عمودی با دایره‌های رنگی
- نشان‌دهی وضعیت (خوانده شده / علاقه‌مندی)
- دکمه درونی برای باز کردن مقاله

### الهام از Roza:
- ساختار دسته‌بندی افقی
- خط عمودی میان ردیف‌ها
- دایره‌های متحرک (✓ یا ⏱️)
- علاقه‌مندی قابل کلیک

## ۳. منوی گسترده (Bottom Sheet) ✅
**فایل:** `src/components/layout/ExpandedMenu.tsx`
- منو از پایین (bottom sheet)
- شش تب اصلی + تنطیمات + درباره
- انیمیشن ورود از پایین
- هر آیتم: آیکن + نام + توضیح

### الهام از Roza:
- Sheet style + backdrop با blur
- آیتم‌های دسته‌بندی‌شده
- نشان‌دهی تب فعلی (نقطه رنگی)
- موشن انیمیشن برای هر ردیف

## ۴. صفحهٔ تنطیمات ✅
**فایل:** `src/components/profile/SettingsTab.tsx`
- تغییر تم شب/روز (toggle متحرک)
- درباره و راهنما
- حذف تمام داده‌ها (با تأیید)

### الهام از Roza:
- داخل منوی جانبی
- کارت‌های گروه‌بندی‌شده
- toggle switch محرک
- بخش خطرناک با اخطار

## اصلاحات متعلقه

### App.tsx
- اضافه `isMenuExpanded` state
- جایگزینی `LibraryTab` → `ArticlesTimelineTab`
- جایگزینی `ProfileTab` → `SettingsTab` (برای `activeTab='profile'`)
- اضافهٔ `ExpandedMenu` (جدای از `SideDrawerMenu`)
- تغییر `onOpenMenu()` برای باز کردن منو جدید

## ساختار تب‌ها در App

```
Home
Cycle
Library (Timeline)
Journeys
Exercises
Couple
Profile (Settings)
```

## رنگ‌های منو

- Home: `text-rose-500`
- Cycle: `text-red-500`
- Library: `text-indigo-500`
- Journeys: `text-amber-500`
- Exercises: `text-pink-500`
- Couple: `text-rose-600`

## موشن انیمیشن‌ها

- Timeline: تأخیری برای هر مقاله (cascade effect)
- ExpandedMenu: ورود از پایین (spring 380/40)
- SettingsTab: fade + slide از بالا
- تم toggle: layout animation

## بعد:
- پیوند کاملِ منو و ExpandedMenu
- آپلود APK نسخهٔ جدید
- تست روی گوشی
