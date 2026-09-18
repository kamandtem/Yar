# یار، همراه رابطه

اپلیکیشن React/Vite برای همراهی آگاهانه‌تر در رابطه، قابل خروجی گرفتن به APK با Capacitor.

## اجرای محلی

```bash
npm ci
npm run dev
```

## گرفتن APK از GitHub Actions

1. پروژه را در GitHub قرار دهید.
2. به تب **Actions** بروید.
3. workflow به نام **Build Yar APK** را باز کنید.
4. روی **Run workflow** بزنید.
5. بعد از پایان اجرا، از بخش Artifacts فایل `yar-debug-apk` را دانلود کنید.

با push کردن یک tag مثل `v1.0.0` هم workflow خودکار اجرا می‌شود.

## خروجی محلی

```bash
npm ci
npm run apk:debug
```

فایل APK در این مسیر ساخته می‌شود:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

برای انتشار عمومی، امضای release را با keystore واقعی خودتان به workflow اضافه کنید. این نسخه عمداً APK دیباگ می‌سازد تا بدون secret اضافی در GitHub Actions کار کند.

## گرفتن نسخه Release امضاشده

فایل workflow با نام `Build Yar Release APK` برای ساخت APK امضاشده اضافه شده است.

در GitHub، این چهار Secret را در مسیر `Settings → Secrets and variables → Actions` بسازید:

```text
YAR_KEYSTORE_BASE64
YAR_KEYSTORE_PASSWORD
YAR_KEY_PASSWORD
YAR_KEY_ALIAS
```

مقدار این چهار Secret در فایل جداگانه‌ای که همراه پروژه تحویل شده قرار دارد.

بعد از ساخت Secretها، از مسیر `Actions → Build Yar Release APK → Run workflow` اجرا کنید.

برای انتشار نسخه جدید، keystore را عوض نکنید؛ از همان keystore نسخه اول برای همه نسخه‌های بعدی استفاده کنید.
