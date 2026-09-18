import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookHeart,
  Brain,
  Check,
  ChevronDown,
  ExternalLink,
  HeartHandshake,
  History,
  Info,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  RELATIONSHIP_SCHEMAS,
  SCHEMA_DOMAINS,
  schemaById,
  type RelationshipSchema,
  type SchemaDomainId
} from '../../data/schemas';

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
}

const domainFor = (id: SchemaDomainId) =>
  SCHEMA_DOMAINS.find(domain => domain.id === id)!;

const Points = ({ items, color }: { items: string[]; color: string }) => (
  <div className="mt-4 space-y-3">
    {items.map((item, index) => (
      <div key={item} className="flex items-start gap-3">
        <span
          className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
          style={{ background: `color-mix(in oklch, ${color} 14%, transparent)`, color }}
        >
          <Check size={12} strokeWidth={3} />
        </span>
        <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">{item}</p>
      </div>
    ))}
  </div>
);

const DetailSection = ({
  icon,
  eyebrow,
  title,
  children
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="border-t border-slate-200/80 py-7 first:border-t-0 dark:border-slate-800">
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[oklch(94%_0.025_300)] text-[oklch(48%_0.13_300)] dark:bg-slate-800 dark:text-violet-300">
        {icon}
      </span>
      <div>
        <span className="text-[10px] font-black text-slate-400">{eyebrow}</span>
        <h2 className="mt-0.5 text-xl font-black text-slate-900 dark:text-white">{title}</h2>
      </div>
    </div>
    {children}
  </section>
);

const SchemaDetail = ({ schema, onBack }: { schema: RelationshipSchema; onBack: () => void }) => {
  const domain = domainFor(schema.domain);
  return (
    <article className="mx-auto max-w-2xl px-4 pb-32 pt-2" dir="rtl">
      <button
        onClick={onBack}
        className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-2xl px-2 text-sm font-black text-slate-600 transition-transform active:scale-95 dark:text-slate-300"
      >
        <ArrowRight size={19} />
        همه الگوها
      </button>

      <header className="overflow-hidden rounded-[2rem] bg-[oklch(97%_0.012_300)] shadow-[0_16px_42px_oklch(33%_0.04_300_/_0.08)] dark:bg-slate-900">
        <div className="h-2" style={{ background: domain.color }} />
        <div className="px-5 pb-6 pt-5 sm:px-7">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-black">
            <span className="rounded-full px-3 py-1.5" style={{ background: domain.soft, color: domain.color }}>
              {domain.title}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              الگوی احتمالی، نه تشخیص
            </span>
          </div>
          <h1 className="mt-5 text-[1.75rem] font-black leading-[1.35] text-slate-950 dark:text-white">
            {schema.title}
          </h1>
          <p className="mt-1 text-xs text-slate-400" dir="ltr">{schema.english}</p>
          <p className="mt-5 text-base leading-8 text-slate-700 dark:text-slate-200">{schema.summary}</p>
          <div className="mt-5 flex gap-3 rounded-2xl bg-[oklch(92%_0.03_300)] p-4 text-[oklch(35%_0.08_300)] dark:bg-violet-950/35 dark:text-violet-100">
            <Brain size={20} className="mt-1 shrink-0" />
            <p className="text-sm font-bold leading-7">صدای این الگو ممکن است بگوید: «{schema.innerVoice}»</p>
          </div>
        </div>
      </header>

      <div className="mt-6 px-1 sm:px-3">
        <DetailSection icon={<History size={19} />} eyebrow="فهم گذشته، نه سرزنش آن" title="چطور ممکن است شکل گرفته باشد؟">
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
            این‌ها احتمال‌اند، نه بازسازی قطعی کودکی تو؛ خلق‌وخو، خانواده، مدرسه، فرهنگ و تجربه‌های بعدی همگی می‌توانند سهم داشته باشند.
          </p>
          <Points items={schema.origins} color={domain.color} />
          <div className="mt-5 flex gap-3 rounded-2xl bg-[oklch(96%_0.025_75)] p-4 text-[oklch(38%_0.07_65)] dark:bg-amber-950/25 dark:text-amber-100">
            <Info size={18} className="mt-1 shrink-0" />
            <p className="text-xs leading-6">
              فهمیدن علت به معنی مقصر شناختن کسی نیست؛ بعضی مراقبان با امکانات کم، فشار زیاد یا زخم‌های حل‌نشده خودشان عمل کرده‌اند.
              نیت خوب می‌تواند کنار اثر دردناک وجود داشته باشد، اما هیچ گذشته‌ای رفتار آسیب‌زننده امروز را توجیه نمی‌کند.
            </p>
          </div>
        </DetailSection>

        <DetailSection icon={<HeartHandshake size={19} />} eyebrow="دو نفر، یک چرخه" title="در رابطه چه اتفاقی می‌افتد؟">
          <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">{schema.relationshipPattern}</p>
          <p className="mt-3 text-xs leading-6 text-slate-500">
            هدف پیدا‌کردن مقصر نیست؛ اگر چرخه را زودتر ببینید، می‌توانید قبل از شدیدشدن آن مسیر را عوض کنید.
          </p>
        </DetailSection>

        <DetailSection icon={<UserRound size={19} />} eyebrow="وقتی این الگو در من فعال می‌شود" title="من چه کار کنم؟">
          <Points items={schema.selfCare} color={domain.color} />
          <div className="mt-5 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
            <b className="text-xs font-black text-slate-900 dark:text-white">مکث ۳۰ ثانیه‌ای</b>
            <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-300">
              چه اتفاقی افتاد؟ من چه معنایی به آن دادم؟ چه احساسی دارم؟ الان چه نیاز و چه درخواست مشخصی دارم؟
            </p>
          </div>
        </DetailSection>

        <DetailSection icon={<UsersRound size={19} />} eyebrow="حمایت بدون تشخیص‌دادن" title="شریکم چگونه کمک کند؟">
          <Points items={schema.partnerCare} color={domain.color} />
          <p className="mt-5 text-xs leading-6 text-slate-500">
            همدلی یعنی احساس طرف مقابل را جدی بگیریم؛ نه اینکه کنترل، توهین، تهدید یا نقض مرز را بپذیریم.
          </p>
        </DetailSection>

        <section className="rounded-[1.7rem] bg-[oklch(94%_0.035_155)] p-5 text-[oklch(32%_0.065_155)] dark:bg-emerald-950/30 dark:text-emerald-100">
          <div className="flex items-center gap-2">
            <Sparkles size={19} />
            <h2 className="text-base font-black">یک جمله سالم‌تر</h2>
          </div>
          <p className="mt-3 text-sm leading-7">
            «وقتی این اتفاق می‌افتد، ذهنم سریع یک برداشت نگران‌کننده می‌سازد؛ الان احساس ... دارم و درخواست مشخصم این است که ...»
          </p>
        </section>

        <div className="mt-5 flex gap-3 rounded-[1.7rem] border border-rose-200 bg-rose-50 p-5 text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/25 dark:text-rose-100">
          <ShieldCheck size={20} className="mt-1 shrink-0" />
          <p className="text-xs leading-6">
            اگر در رابطه ترس، تهدید، خشونت، اجبار یا کنترل وجود دارد، این تمرین دونفره مناسب نیست؛ اولویت با امنیت و کمک مستقل حرفه‌ای است.
          </p>
        </div>
      </div>
    </article>
  );
};

const IntroBlock = () => {
  const [open, setOpen] = useState(false);
  return (
    <section className="overflow-hidden rounded-[2rem] bg-[oklch(96%_0.02_300)] dark:bg-slate-900">
      <div className="px-5 pb-6 pt-6 sm:px-7">
        <span className="text-[11px] font-black text-[oklch(49%_0.14_300)]">الگوهای رابطه و طرحواره‌ها</span>
        <h1 className="mt-2 text-[1.8rem] font-black leading-[1.35] text-slate-950 dark:text-white">
          واکنش امروزت شاید زمانی راه محافظتت بوده
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
          طرحواره یک برچسب یا بیماری نیست؛ الگویی است که ممکن است برداشت ما از خود، دیگران و رابطه را رنگ کند.
          شناختنش کمک می‌کند قبل از واکنش همیشگی، انتخاب تازه‌ای داشته باشیم.
        </p>
        <button
          onClick={() => setOpen(value => !value)}
          aria-expanded={open}
          className="mt-4 flex min-h-11 items-center gap-2 text-xs font-black text-[oklch(45%_0.12_300)] dark:text-violet-300"
        >
          <Info size={16} />
          قبل از شروع این را بدان
          <ChevronDown size={16} className="transition-transform" style={{ transform: open ? 'rotate(180deg)' : undefined }} />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-2 space-y-3 border-t border-[oklch(88%_0.025_300)] pt-4 text-xs leading-6 text-slate-600 dark:border-slate-800 dark:text-slate-300">
                <p>ممکن است چند الگو را در خودت ببینی؛ شدت و شکل فعال‌شدن آن‌ها در آدم‌ها متفاوت است.</p>
                <p>خاطره ما کامل نیست؛ علت‌های گفته‌شده سرنخ‌اند و نباید از آن‌ها برای متهم‌کردن خانواده استفاده کرد.</p>
                <p>به شریک عاطفی برچسب نزن؛ فقط درباره رفتار قابل مشاهده، احساس و نیاز خودت حرف بزن.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const TestCallout = () => (
  <section className="mt-5 border-y border-slate-200 py-5 dark:border-slate-800">
    <div className="flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[oklch(93%_0.035_245)] text-[oklch(44%_0.12_245)] dark:bg-blue-950/35 dark:text-blue-300">
        <BookHeart size={21} />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-base font-black text-slate-900 dark:text-white">می‌خواهی الگوهایت را بهتر بشناسی؟</h2>
        <p className="mt-1 text-xs leading-6 text-slate-500 dark:text-slate-400">
          پرسشنامه ۲۳۲ سؤالی ای‌سنج ۱۸ الگو را بررسی می‌کند؛ نتیجه خودارزیابی است، نه تشخیص قطعی.
        </p>
        <a
          href="https://esanj.ir/young-early-maladaptive-schema-test"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-2xl bg-[oklch(43%_0.11_245)] px-4 text-xs font-black text-[oklch(98%_0.005_245)] transition-transform active:scale-95"
        >
          رفتن به خودارزیابی بیرونی
          <ExternalLink size={15} />
        </a>
      </div>
    </div>
    <div className="mt-4 flex gap-2 text-[10px] leading-5 text-slate-400">
      <AlertTriangle size={14} className="mt-0.5 shrink-0" />
      پاسخ‌ها در وب‌سایتی خارج از یار ثبت می‌شوند؛ نتیجه را برای تشخیص خود یا شریکت استفاده نکن.
    </div>
  </section>
);

export const SchemasTab: React.FC<Props> = ({ selectedId, onSelect, onBack }) => {
  const selected = schemaById(selectedId);
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLocaleLowerCase('fa');
  const filtered = useMemo(
    () => normalized
      ? RELATIONSHIP_SCHEMAS.filter(schema =>
          `${schema.title} ${schema.shortTitle} ${schema.summary}`.toLocaleLowerCase('fa').includes(normalized)
        )
      : RELATIONSHIP_SCHEMAS,
    [normalized]
  );

  if (selected) return <SchemaDetail schema={selected} onBack={onBack} />;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-32 pt-2" dir="rtl">
      <IntroBlock />
      <TestCallout />

      <div className="relative mt-6">
        <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="جست‌وجوی یک الگو..."
          aria-label="جست‌وجوی طرحواره"
          className="min-h-12 w-full rounded-2xl border border-slate-200 bg-[oklch(99%_0.004_300)] pr-11 pl-4 text-sm text-slate-900 outline-none transition-shadow placeholder:text-slate-400 focus:border-[oklch(65%_0.1_300)] focus:ring-4 focus:ring-violet-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:ring-violet-950"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <Brain size={32} className="mx-auto text-slate-300" />
          <p className="mt-4 text-sm font-black text-slate-600 dark:text-slate-300">الگویی با این نام پیدا نشد</p>
          <button onClick={() => setQuery('')} className="mt-3 min-h-11 px-4 text-xs font-black text-violet-600 dark:text-violet-300">پاک‌کردن جست‌وجو</button>
        </div>
      ) : normalized ? (
        <section className="mt-7">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">نتیجه جست‌وجو</h2>
          <div className="mt-3 divide-y divide-slate-200 dark:divide-slate-800">
            {filtered.map(schema => (
              <SchemaRow key={schema.id} schema={schema} onSelect={onSelect} />
            ))}
          </div>
        </section>
      ) : (
        <div className="mt-8 space-y-10">
          {SCHEMA_DOMAINS.map(domain => {
            const schemas = filtered.filter(schema => schema.domain === domain.id);
            return (
              <section key={domain.id}>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ background: domain.color }} />
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">{domain.title}</h2>
                    <p className="mt-1 text-xs font-bold" style={{ color: domain.color }}>نیاز اصلی: {domain.need}</p>
                    <p className="mt-2 max-w-[58ch] text-xs leading-6 text-slate-500 dark:text-slate-400">{domain.intro}</p>
                  </div>
                </div>
                <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                  {schemas.map(schema => (
                    <SchemaRow key={schema.id} schema={schema} onSelect={onSelect} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <footer className="mt-12 rounded-[1.7rem] bg-slate-100 p-5 dark:bg-slate-900">
        <div className="flex gap-3">
          <ShieldCheck size={19} className="mt-1 shrink-0 text-slate-500" />
          <div>
            <h2 className="text-sm font-black text-slate-800 dark:text-white">مرز مهم</h2>
            <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
              این بخش برای خودآگاهی و گفت‌وگوی بهتر است، نه تشخیص یا درمان.
              اگر این الگوها زندگی، خواب، کار یا امنیت رابطه را جدی مختل کرده‌اند، کمک حرفه‌ای انتخاب دقیق‌تری است.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold text-slate-400">
          <a href="https://schematherapysociety.org/Schema-Therapy" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">مبنای مدل طرحواره <ExternalLink size={11} /></a>
          <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9963559/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">مرور انتقال بین‌نسلی <ExternalLink size={11} /></a>
        </div>
      </footer>
    </div>
  );
};

const SchemaRow = ({ schema, onSelect }: { schema: RelationshipSchema; onSelect: (id: string) => void }) => {
  const domain = domainFor(schema.domain);
  return (
    <button
      onClick={() => onSelect(schema.id)}
      className="group flex min-h-[4.8rem] w-full items-center gap-3 py-3 text-right transition-transform active:scale-[0.99]"
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
        style={{ background: domain.soft, color: domain.color }}
      >
        <Brain size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <b className="block text-sm font-black text-slate-800 dark:text-slate-100">{schema.title}</b>
        <small className="mt-1 block truncate text-[11px] text-slate-400">{schema.summary}</small>
      </span>
      <ArrowLeft size={16} className="shrink-0 text-slate-300 transition-transform group-active:-translate-x-1 dark:text-slate-600" />
    </button>
  );
};
