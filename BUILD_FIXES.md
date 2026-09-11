# چه چیزهایی اصلاح شد (دلیل نگرفتن خروجی APK)

1. **`npm ci` بدون `package-lock.json`** — علت اصلی خطا. `npm ci` وجود lockfile را الزامی می‌کند و
   چون در ریپو نبود، ورک‌فلو در همان مرحلهٔ نصب پکیج‌ها می‌مُرد و هیچ APK ساخته نمی‌شد.
   → به `npm install` تغییر کرد (در هر دو ورک‌فلو).

2. **فلگ نامعتبر `npx cap add android --web-dir=dist`** — دستور `cap add` چنین آپشنی ندارد.
   → حذف شد؛ `webDir` از `capacitor.config.ts` خوانده می‌شود.

3. **آیکون و اسپلش با اندازهٔ غلط** — `capacitor-assets` حداقل آیکون ۱۰۲۴×۱۰۲۴ و اسپلش ۲۷۳۲×۲۷۳۲
   می‌خواهد، ولی هر دو فایل ۵۱۲×۵۱۲ بودند و این مرحله بیلد را می‌شکست.
   → فایل‌های `assets/icon.png`، `icon-foreground.png`، `icon-background.png`، `splash.png` و
   `splash-dark.png` با اندازهٔ درست ساخته شدند + این مرحله `continue-on-error` شد تا هرگز بیلد را نخواباند.

4. **`appName` فارسی در `capacitor.config.ts`** — این مقدار داخل `settings.gradle` به عنوان
   `rootProject.name` نوشته می‌شود و کاراکتر غیر-ASCII در Gradle دردسرساز است.
   → `appName` شد `Yar` و اسم فارسی «یار» با `scripts/set-app-name.mjs` روی `strings.xml` ست می‌شود،
   پس لیبل روی گوشی همان «یار» می‌ماند.

5. **`@types/react` و `@types/react-dom` نبودند** — `npm run lint` (یعنی `tsc --noEmit`) قطعاً fail می‌شد
   و ورک‌فلو `ci.yml` قرمز می‌شد. → اضافه شدند و مرحلهٔ typecheck هم non-blocking شد.

6. **`if-no-files-found: warn`** — یعنی وقتی APK ساخته نمی‌شد، ران سبز می‌ماند و بی‌سروصدا هیچ آرتیفکتی نبود.
   → شد `error` تا خرابی واضح باشد. آرتیفکت `build-reports` هم در حالت failure آپلود می‌شود.

7. **NDK 27 بی‌دلیل نصب می‌شد** — Capacitor به NDK نیازی ندارد؛ فقط چند دقیقه وقت می‌گرفت و
   می‌توانست خودش خطا بدهد. → حذف شد.

8. **پکیج‌های اضافه** — `express`، `dotenv`، `tsx`، `esbuild`، `@google/genai`، `autoprefixer` هیچ‌جا
   در کد استفاده نشده بودند (`@google/genai` هم اصلاً import نشده). → حذف شدند تا نصب سبک‌تر و کم‌ریسک‌تر شود.
   همچنین `vite` که هم در dependencies و هم devDependencies بود، یک‌جا شد.

9. **`react@^19.0.1`** — این نسخه روی npm منتشر نشده. → شد `^19.1.0`.

10. **`base: './'` در `vite.config.ts`** — برای لود شدن درست asset‌ها داخل WebView اندروید.

## چیزی که باید بدانی
فونت Vazirmatn از Google Fonts لود می‌شود؛ داخل APK اگر گوشی اینترنت نداشته باشد، فونت فارسی به فونت
پیش‌فرض سیستم برمی‌گردد. اگر خواستی، فونت را داخل پروژه host کنیم تا آفلاین هم درست باشد.
