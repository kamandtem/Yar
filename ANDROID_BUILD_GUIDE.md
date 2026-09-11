# راهنمای ساخت APK برای Yar

## مشکل اصلی
workflow قبلی تمام step ها رو میکرد ولی APK رو نمی ساخت.

## مشکلات حل شده
1. ✅ Android SDK و NDK proper setup
2. ✅ Node.js version deprecation fix (20 instead of 24)
3. ✅ Gradle build logging تفصیلی
4. ✅ Build directory verification
5. ✅ APK path detection دقیق

## فایل workflow جدید
`.github/workflows/build-apk.yml` - فایل workflow کاملا دوباره نوشته شده

## اجرا کردن
1. این workflow رو push کن
2. GitHub Actions -> Build Yar APK -> Run workflow
3. منتظر بمان تا workflow کامل شود

## اگر هنوز fail شد
آخرین step "Final status" تمام log ها رو print میکند. اونو ببین و بفرست.

## APK دانلود
- Artifacts -> yar-debug-apk -> app-debug.apk

