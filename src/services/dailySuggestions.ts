import { MoodInsight } from './personalization';

export interface PrivateSuggestion { id:string; title:string; action:string; time:string; tags:string[]; }
const SUGGESTIONS: PrivateSuggestion[] = [
 {id:'repair-1',title:'پیام بدون بحث',action:'فقط بنویس: «می‌دونم امروز بین‌مون سخت بود. نمی‌خوام فاصله بیشتر بشه.»',time:'۱ دقیقه',tags:['low','support','connection']},
 {id:'repair-2',title:'مکث زمان‌دار',action:'۲۰ دقیقه از بحث فاصله بگیرید و ساعت دقیق برگشت به گفت‌وگو را مشخص کنید.',time:'۲۰ دقیقه',tags:['low','space','irritable']},
 {id:'repair-3',title:'یک مسئولیت کوچک',action:'یک کار عقب‌افتاده مشترک را بی‌سروصدا انجام بده، بدون انتظار تشکر فوری.',time:'۵ دقیقه',tags:['low','support','low-energy']},
 {id:'repair-4',title:'شروع دوباره',action:'بگو: «می‌شه این گفت‌وگو رو از اول و آروم‌تر شروع کنیم؟»',time:'۲ دقیقه',tags:['low','talk']},
 {id:'repair-5',title:'شنیدن بی‌دفاع',action:'سه دقیقه فقط گوش بده. جواب را با «چیزی که شنیدم اینه که...» شروع کن.',time:'۳ دقیقه',tags:['low','talk','connection']},
 {id:'repair-6',title:'کاهش اصطکاک',action:'امشب فقط روی یک مسئله کوچک توافق کنید. باقی موارد را فعلاً باز نکنید.',time:'۷ دقیقه',tags:['low','irritable','low-energy']},
 {id:'repair-7',title:'علامت امن',action:'یک کلمه مشترک برای توقف بحث انتخاب کنید تا مکث، ترک کردن تلقی نشود.',time:'۴ دقیقه',tags:['low','space']},
 {id:'repair-8',title:'ترمیم کوتاه',action:'سهم خودت را در یک جمله بگو، بدون توضیح و بدون «اما».',time:'۱ دقیقه',tags:['low','talk']},
 {id:'warm-1',title:'تشکر دقیق',action:'از یک رفتار مشخص امروز تشکر کن، نه از یک ویژگی کلی.',time:'۱ دقیقه',tags:['high','connection','support']},
 {id:'warm-2',title:'قرار بی‌برنامه',action:'ده دقیقه کنار هم بنشینید، بدون موبایل و بدون موضوع از قبل تعیین‌شده.',time:'۱۰ دقیقه',tags:['high','connection']},
 {id:'warm-3',title:'خاطره‌سازی کوچک',action:'از یک لحظه معمولی امروز عکس بگیرید و برایش یک اسم بگذارید.',time:'۳ دقیقه',tags:['high','connection']},
 {id:'warm-4',title:'سؤال آینده',action:'بپرس: «دوست داری این ماه چه تجربه کوچکی با هم داشته باشیم؟»',time:'۵ دقیقه',tags:['high','talk']},
 {id:'warm-5',title:'قدردانی پنهان',action:'یک یادداشت کوتاه جایی بگذار که بعداً پیدایش کند.',time:'۲ دقیقه',tags:['high','support']},
 {id:'warm-6',title:'آیین دونفره',action:'یک کار ۵ دقیقه‌ای انتخاب کنید که هر روز در زمان ثابتی با هم انجام دهید.',time:'۵ دقیقه',tags:['high','connection']},
 {id:'middle-1',title:'چک‌این سه کلمه‌ای',action:'هر نفر حالش را فقط با سه کلمه بگوید. فعلاً تحلیل و راه‌حل ممنوع.',time:'۳ دقیقه',tags:['mid','talk','low-energy']},
 {id:'middle-2',title:'انتخاب نیاز',action:'بین نزدیکی، فضا، حمایت، استراحت و گفت‌وگو فقط یکی را برای امروز انتخاب کن.',time:'۱ دقیقه',tags:['mid','all']},
 {id:'middle-3',title:'قدم بیرون',action:'هفت دقیقه کنار هم راه بروید. درباره کار و مشکل‌های رابطه حرف نزنید.',time:'۷ دقیقه',tags:['mid','connection','rest']},
 {id:'middle-4',title:'تعویض فضا',action:'چای یا آب را در جایی متفاوت از همیشه با هم بخورید.',time:'۵ دقیقه',tags:['mid','rest','low-energy']},
 {id:'middle-5',title:'پرسش روشن',action:'بپرس: «امروز از من همراهی می‌خوای یا راه‌حل؟»',time:'۱ دقیقه',tags:['mid','support','talk']},
 {id:'middle-6',title:'تماس کوتاه',action:'اگر هر دو راحتید، سی ثانیه دست هم را بگیرید و فقط نفس بکشید.',time:'۱ دقیقه',tags:['mid','connection']},
 {id:'self-1',title:'استراحت بدون عذاب وجدان',action:'ده دقیقه هیچ مسئله‌ای را حل نکن. فقط آب، سکوت و تنفس آرام.',time:'۱۰ دقیقه',tags:['rest','low-energy','irritable']},
 {id:'self-2',title:'مرز مهربان',action:'بگو: «الان ظرفیت ندارم، اما ساعت ... برای گفت‌وگو برمی‌گردم.»',time:'۱ دقیقه',tags:['space','irritable','low']},
 {id:'self-3',title:'درخواست مستقیم',action:'یک درخواست مشخص و قابل انجام را بدون کنایه مطرح کن.',time:'۲ دقیقه',tags:['support','talk','mid']},
 {id:'self-4',title:'خالی کردن ذهن',action:'قبل از حرف زدن، چیزی را که می‌خواهی بگویی در سه خط بنویس و خط سرزنش‌آمیز را حذف کن.',time:'۴ دقیقه',tags:['irritable','talk','low']},
 {id:'self-5',title:'نسخه سبک',action:'اگر انرژی نداری، فقط یک ایموجی یا جمله کوتاه برای حفظ ارتباط بفرست.',time:'۱ دقیقه',tags:['low-energy','connection','support']},
 {id:'pms-1',title:'قرار تعویق آگاهانه',action:'موضوع حساس را یادداشت کنید و برای ۴۸ ساعت بعد زمان مشخص بگذارید.',time:'۲ دقیقه',tags:['pms','irritable','low']},
 {id:'pms-2',title:'راحتی جسمی اول',action:'گرما، آب و استراحت را قبل از گفت‌وگوی رابطه‌ای جدی امتحان کن.',time:'۱۰ دقیقه',tags:['pms','rest','low-energy']},
 {id:'pms-3',title:'ترجمه حساسیت',action:'به‌جای «تو اصلاً نمی‌فهمی» بگو «امروز زودتر از معمول تحت فشار می‌رم».',time:'۱ دقیقه',tags:['pms','talk','irritable']},
];

export function getPrivateSuggestions(score:number, insight:MoodInsight, inPms:boolean, offset=0): PrivateSuggestion[] {
 const temperature = score <= 2 ? 'low' : score >= 4 ? 'high' : 'mid';
 const tags = [temperature, insight.strongestNeed || 'all'];
 if (insight.averageEnergy > 0 && insight.averageEnergy <= 2.5) tags.push('low-energy');
 if (insight.averageIrritability >= 3.5) tags.push('irritable');
 if (inPms) tags.push('pms');
 const ranked = SUGGESTIONS.map(item => ({item, rank:item.tags.filter(tag=>tags.includes(tag)).length})).filter(x=>x.rank>0).sort((a,b)=>b.rank-a.rank || a.item.id.localeCompare(b.item.id));
 const seed = Math.floor(new Date().getTime()/86400000) + offset * 3;
 const pool = ranked.map(x=>x.item);
 return Array.from({length:Math.min(3,pool.length)},(_,i)=>pool[(seed+i)%pool.length]);
}
