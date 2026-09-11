import React,{useEffect,useState} from 'react';
import {ChevronLeft,HeartHandshake,RefreshCw,Sparkles} from 'lucide-react';
import {motion} from 'motion/react';

const QUOTES=[
'رابطه خوب از آدم‌های بی‌اشتباه ساخته نمی‌شود؛ از آدم‌هایی ساخته می‌شود که بلدند برگردند و ترمیم کنند.',
'گاهی بهترین پاسخ به یک دلخوری، حل کردنش نیست؛ اول شنیدن آن است.',
'با هم بودن یعنی هم‌تیمی بودن، نه برنده شدن در هر بحث.',
'یک جمله آرام می‌تواند جلوی یک شب طولانی از فاصله را بگیرد.',
'محبت فقط حرف قشنگ نیست؛ توجه کردن به چیزهای کوچک روزمره است.',
'قبل از اینکه نیت طرف مقابل را حدس بزنی، از خودش بپرس.',
'آدم‌ها بیشتر از راه‌حل، نیاز دارند مطمئن شوند تنها نیستند.',
'مرز سالم دیوار نیست؛ راهی است برای نزدیک ماندن بدون گم کردن خود.',
'هر بار که با احترام مکث می‌کنی، به رابطه فرصت تازه‌ای می‌دهی.',
'عذرخواهی خوب گذشته را پاک نمی‌کند؛ آینده را قابل اعتمادتر می‌کند.',
'صمیمیت از گفتن همه‌چیز شروع نمی‌شود؛ از امن بودن برای گفتن یک چیز کوچک شروع می‌شود.',
'گاهی «الان کنارت هستم» از ده‌ها توصیه مفیدتر است.',
'عشق در روزهای معمولی دیده می‌شود، نه فقط در لحظه‌های بزرگ.',
'اگر مسئله تکراری است، شاید احساس پنهان زیر آن هنوز شنیده نشده.',
'گفت‌وگوی سخت وقتی بهتر پیش می‌رود که به جای شخصیت، درباره یک رفتار مشخص حرف بزنیم.',
'تفاوت داشتن نشانه خراب بودن رابطه نیست؛ بلد نبودنِ عبور از تفاوت‌هاست.',
'از شریک زندگی‌ات نخواه ذهنت را بخواند؛ خواسته‌ات را روشن و مهربان بگو.',
'امنیت عاطفی یعنی بتوانی هم قوی باشی، هم گاهی نیازمند.',
'وقتی خسته‌ای، تصمیم‌های بزرگ رابطه را به بعد از یک استراحت کوتاه بسپار.',
'قدردانی، حافظه رابطه را از خوبی‌ها هم پر می‌کند.',
'هر روز یک پرسش واقعی بهتر از هفته‌ها حدس زدن است.',
'نزدیکی با کنترل کردن ساخته نمی‌شود؛ با اعتماد و انتخاب دوباره ساخته می‌شود.',
'قرار نیست همیشه هم‌حال باشید؛ کافی است بلد باشید حال هم را جدی بگیرید.',
'یک لمس آرام، یک لیوان آب یا یک پیام کوتاه هم می‌تواند مراقبت باشد.',
'رابطه سالم جایی نیست که دعوا ندارد؛ جایی است که بعد از دعوا راه برگشت دارد.',
'قبل از دفاع کردن، یک لحظه فکر کن شاید طرف مقابل فقط می‌خواهد دیده شود.',
'به جای شمردن اشتباه‌های هم، گاهی تلاش‌های هم را هم بشمارید.',
'استقلال و صمیمیت دشمن هم نیستند؛ هر دو برای یک رابطه بالغ لازم‌اند.',
'وقتی هر دو نفر مسئول سهم خودشان باشند، اختلاف تبدیل به دشمنی نمی‌شود.',
'بهبود رابطه با یک حرکت بزرگ شروع نمی‌شود؛ با یک انتخاب کوچک و تکرارشونده شروع می‌شود.'
];
const toFa=(n:number)=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
export const QuoteOfTheDay=()=>{const [index,setIndex]=useState(0);useEffect(()=>{setIndex(Math.floor(Math.random()*QUOTES.length));},[]);const next=()=>setIndex(v=>(v+1)%QUOTES.length);return <motion.section key={index} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="relative overflow-hidden rounded-[1.7rem] border border-[oklch(87%_0.06_155)] bg-[linear-gradient(125deg,oklch(96%_0.035_155),oklch(97%_0.025_80))] px-5 py-4 shadow-[0_12px_28px_oklch(45%_0.04_155_/_0.06)]" dir="rtl"><div className="absolute -left-8 -top-10 h-28 w-28 rounded-full bg-[oklch(88%_0.08_155_/_0.32)]"/><div className="relative flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[oklch(99%_0.004_155_/_0.8)] text-[oklch(48%_0.12_155)]"><HeartHandshake size={19}/></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5 text-[10px] font-black text-[oklch(45%_0.12_155)]"><Sparkles size={13}/> یک جمله برای امروز</span><button onClick={next} aria-label="جمله بعدی" className="flex h-8 w-8 items-center justify-center rounded-xl text-[oklch(48%_0.12_155)] hover:bg-[oklch(90%_0.05_155)]"><RefreshCw size={14}/></button></div><p className="mt-2 text-[15px] font-black leading-7 text-[oklch(27%_0.045_155)]">«{QUOTES[index]}»</p><div className="mt-3 flex items-center justify-between"><small className="text-[10px] font-bold text-[oklch(52%_0.04_155)]">جمله {toFa(index+1)} از {toFa(QUOTES.length)}</small><ChevronLeft size={15} className="text-[oklch(52%_0.12_155)]"/></div></div></div></motion.section>};
