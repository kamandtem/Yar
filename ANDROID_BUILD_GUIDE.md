# ساخت خروجی APK برای اپ «یار»

## روش ۱: گیت‌هاب اکشن (پیشنهادی)

1. کل پروژه را به یک ریپازیتوری گیت‌هاب پوش کن (برنچ `main`).
2. در تب **Actions**، ورک‌فلوی **Build Yar APK** را انتخاب کن و **Run workflow** را بزن.
   (با هر پوش روی `main` هم خودکار اجرا می‌شود.)
3. بعد از اتمام (حدود ۵ تا ۱۰ دقیقه)، پایین صفحهٔ همان ران، بخش **Artifacts** → فایل `yar-debug-apk` را دانلود کن.

اگر ران قرمز شد، آرتیفکت `build-reports` هم آپلود می‌شود؛ لاگ خطای Gradle داخل آن است.

## روش ۲: بیلد روی سیستم خودت

نیازمندی‌ها: Node.js 22، JDK 21، Android SDK (API 35 + Build Tools 35.0.0)

```bash
npm install
npm run build
npx cap add android      # فقط بار اول
node scripts/set-app-name.mjs
npx cap sync android
npx capacitor-assets generate --android
cd android && ./gradlew assembleDebug
```

خروجی: `android/app/build/outputs/apk/debug/app-debug.apk`

## نکات

- پوشهٔ `android/` در `.gitignore` است و در هر بیلد از نو ساخته می‌شود. آن را کامیت نکن.
- برای نسخهٔ Release باید keystore بسازی و امضا کنی؛ نسخهٔ Debug روی گوشی نصب می‌شود ولی برای انتشار در استور مناسب نیست.
- `appId` فعلی: `com.yar.relationship`
