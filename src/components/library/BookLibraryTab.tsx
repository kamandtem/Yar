import React, { useState } from 'react';
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, List, Moon, Palette, Sun, Type } from 'lucide-react';
import { motion } from 'motion/react';
import { DOPAMINE_BOOK } from '../../data/bookDopamine';
import { KAIZEN_BOOK } from '../../data/bookKaizen';
import { PageIntroAccordion } from '../common/PageIntroAccordion';

const BOOKS = [
  { data: DOPAMINE_BOOK, cover: '/books/dopamine-cover.svg', epub: '/books/dopamine-molecule.epub', tone: 'green' },
  { data: KAIZEN_BOOK, cover: '/books/kaizen-cover.svg', epub: '/books/kaizen-small-steps.epub', tone: 'gold' },
] as const;
type Book = typeof BOOKS[number];
const READER_BACKGROUNDS = [
  { name: 'کاغذی', page: 'bg-[oklch(98%_0.012_80)]', header: 'bg-[oklch(99%_0.008_80)]', border: 'border-[oklch(88%_0.025_80)]', text: 'text-[oklch(24%_0.035_265)]' },
  { name: 'سبز آرام', page: 'bg-[oklch(96%_0.025_155)]', header: 'bg-[oklch(98%_0.012_155)]', border: 'border-[oklch(86%_0.035_155)]', text: 'text-[oklch(25%_0.045_170)]' },
  { name: 'کرم گرم', page: 'bg-[oklch(96%_0.025_80)]', header: 'bg-[oklch(98%_0.015_80)]', border: 'border-[oklch(87%_0.035_80)]', text: 'text-[oklch(27%_0.04_70)]' },
  { name: 'شب', page: 'bg-[oklch(18%_0.025_210)]', header: 'bg-[oklch(20%_0.025_210)]', border: 'border-slate-700', text: 'text-[oklch(90%_0.025_80)]' },
];

export const BookLibraryTab: React.FC = () => {
  const [reading, setReading] = useState<Book | null>(null);
  const [chapter, setChapter] = useState(0);
  const [toc, setToc] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [background, setBackground] = useState(0);
  const [showPalette, setShowPalette] = useState(false);
  const activeBg = READER_BACKGROUNDS[background];
  const active = reading?.data.chapters[chapter];
  const progress = reading ? Math.round(((chapter + 1) / reading.data.chapters.length) * 100) : 0;
  const startReading = (book: Book) => { setChapter(0); setBackground(0); setReading(book); };
  const next = () => reading && setChapter(v => Math.min(reading.data.chapters.length - 1, v + 1));
  const previous = () => setChapter(v => Math.max(0, v - 1));

  if (reading && active) return <div className={`fixed inset-0 z-[70] flex flex-col ${activeBg.page} ${activeBg.text}`} dir="rtl">
    <header className={`flex h-16 shrink-0 items-center gap-2 border-b px-3 ${activeBg.header} ${activeBg.border}`}>
      <button onClick={() => setReading(null)} aria-label="بازگشت به کتابخانه" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[oklch(93%_0.025_265)] text-slate-600 active:scale-95 dark:bg-slate-800 dark:text-slate-200"><ArrowRight size={18}/></button>
      <div className="min-w-0 flex-1"><p className="truncate text-xs font-black">{reading.data.title}</p><p className="text-[10px] opacity-60">{active.label}، {chapter + 1} از {reading.data.chapters.length}</p></div>
      <button onClick={() => setToc(v => !v)} aria-label="فهرست فصل‌ها" className="flex h-10 w-10 items-center justify-center rounded-xl bg-[oklch(93%_0.025_265)] text-slate-600 dark:bg-slate-800 dark:text-slate-200"><List size={17}/></button>
      <button onClick={() => setFontScale(v => v >= 1.3 ? .9 : Number((v + .1).toFixed(1)))} aria-label="تغییر اندازه متن" className="flex h-10 w-10 items-center justify-center rounded-xl bg-[oklch(93%_0.025_265)] text-slate-600 dark:bg-slate-800 dark:text-slate-200"><Type size={17}/></button>
      <button onClick={() => setShowPalette(v => !v)} aria-label="تغییر رنگ پس‌زمینه" className="flex h-10 w-10 items-center justify-center rounded-xl bg-[oklch(93%_0.025_265)] text-slate-600 dark:bg-slate-800 dark:text-slate-200"><Palette size={17}/></button>
    </header>
    <div className="h-1 bg-[oklch(91%_0.02_265)]"><div className="h-full bg-[oklch(52%_0.13_175)] transition-all" style={{width:`${progress}%`}}/></div>
    {showPalette && <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} className={`absolute left-3 top-[4.5rem] z-20 rounded-2xl border p-2 shadow-xl ${activeBg.header} ${activeBg.border}`}><p className="px-2 pb-1 text-[10px] font-black">رنگ صفحه</p>{READER_BACKGROUNDS.map((bg,index)=><button key={bg.name} onClick={() => {setBackground(index);setShowPalette(false)}} className="flex min-h-9 w-32 items-center gap-2 rounded-xl px-2 text-right text-[10px] font-bold"><span className={`h-5 w-5 rounded-full border ${bg.page} ${bg.border}`}/>{bg.name}</button>)}</motion.div>}
    {toc && <motion.aside initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} className={`absolute right-0 top-[4.25rem] z-10 h-[calc(100%-4.25rem)] w-[min(21rem,88vw)] overflow-y-auto border-l p-5 shadow-2xl ${activeBg.header} ${activeBg.border}`}><div className="mb-4 flex items-center justify-between"><b className="text-sm">فهرست کتاب</b><button onClick={() => setToc(false)} className="text-xs opacity-60">بستن</button></div><div className="space-y-1">{reading.data.chapters.map((item,index)=><button key={item.id} onClick={() => {setChapter(index);setToc(false)}} className={`w-full rounded-xl px-3 py-3 text-right text-xs leading-5 ${index===chapter?'bg-[oklch(92%_0.04_175)] text-[oklch(35%_0.10_175)] font-black':'opacity-70 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{item.label}: {item.title}</button>)}</div></motion.aside>}
    <main className="mx-auto w-full max-w-2xl flex-1 overflow-y-auto px-5 py-8 sm:px-10" style={{fontSize:`${fontScale}rem`}}><motion.article key={`${reading.data.id}-${active.id}`} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="pb-10"><div className="mb-8"><span className="text-xs font-black text-[oklch(48%_0.13_175)]">{active.label}</span><h1 className="mt-2 text-2xl font-black leading-[1.7] sm:text-3xl">{active.title}</h1><div className="mt-4 h-1 w-16 rounded-full bg-[oklch(58%_0.13_175)]"/></div><div className="space-y-5 text-[1em] leading-[2.15]">{active.paragraphs.map((p,index)=><p key={index}>{p}</p>)}</div></motion.article><div className={`mt-8 rounded-[1.5rem] p-4 text-xs leading-6 ${background===3?'bg-[oklch(24%_0.04_175)]':'bg-[oklch(94%_0.035_175)]'}`}><BookOpen size={16} className="mb-2 text-[oklch(46%_0.11_175)]"/>این متن، چکیده آموزشی و بازآفرینی‌شده کتاب است؛ نسخه کامل کتاب منتشر نشده است.</div></main>
    <footer className={`flex shrink-0 items-center justify-between border-t px-5 py-3 ${activeBg.header} ${activeBg.border}`}><button onClick={previous} disabled={!chapter} className="flex min-h-11 items-center gap-1 rounded-xl px-3 text-xs font-black disabled:opacity-30"><ChevronRight size={17}/> فصل قبل</button><span className="text-[10px] opacity-60">{progress}٪ خوانده شد</span><button onClick={next} disabled={chapter===reading.data.chapters.length-1} className="flex min-h-11 items-center gap-1 rounded-xl px-3 text-xs font-black disabled:opacity-30">فصل بعد <ChevronLeft size={17}/></button></footer>
  </div>;

  return <div className="max-w-2xl mx-auto px-4 pt-2 pb-28" dir="rtl"><PageIntroAccordion kind="library"/><section className="mb-6"><div><p className="text-xs font-black text-[oklch(48%_0.13_175)]">کتابخانه یار</p><h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">کتاب‌ها برای بهتر فهمیدن</h1><p className="mt-2 text-xs leading-6 text-slate-500">دو کتاب، یک Reader مشترک با فهرست، اندازه متن و رنگ صفحه قابل تنظیم.</p></div></section><div className="space-y-4">{BOOKS.map(book=><motion.button key={book.data.id} whileTap={{scale:.99}} onClick={() => startReading(book)} className="w-full overflow-hidden rounded-[1.8rem] bg-[oklch(96%_0.025_175)] text-right shadow-[0_14px_30px_oklch(45%_0.05_175_/_0.12)] dark:bg-slate-900"><div className="flex gap-4 p-4 sm:p-5"><img src={book.cover} alt={`جلد ${book.data.title}`} className="h-44 w-32 shrink-0 rounded-2xl object-cover shadow-[0_8px_18px_oklch(30%_0.06_175_/_0.18)]"/><div className="flex min-w-0 flex-1 flex-col justify-between py-1"><div><span className="text-[10px] font-black text-[oklch(45%_0.12_175)]">چکیده آموزشی</span><h2 className="mt-2 text-lg font-black leading-8 text-slate-900 dark:text-white">{book.data.title}</h2><p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-300">{book.data.description}</p></div><span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-[oklch(45%_0.12_175)]">شروع مطالعه <ChevronLeft size={15}/></span></div></div><div className="flex items-center gap-4 border-t border-[oklch(88%_0.03_175)] px-5 py-3 text-[10px] font-bold text-slate-500"><span>{book.data.chapters.length} فصل</span><span>مطالعه کوتاه</span><span>فارسی</span><a href={book.epub} download onClick={e => e.stopPropagation()} className="mr-auto">EPUB</a></div></motion.button>)}</div></div>;
};
