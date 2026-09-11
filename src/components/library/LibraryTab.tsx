import React, { useState } from 'react';
import { Book, Article } from '../../types';
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  Flame, 
  Clock, 
  Star, 
  ChevronLeft, 
  Quote, 
  BookMarked,
  Filter,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { toPersianDigits } from '../../utils/persianDate';

interface LibraryTabProps {
  books: Book[];
  articles: Article[];
  favorites: string[];
  completedArticles: string[];
  onOpenArticle: (article: Article) => void;
  onOpenBook?: (book: Book) => void;
  onToggleFavorite: (articleId: string) => void;
}

export const LibraryTab: React.FC<LibraryTabProps> = ({
  books,
  articles,
  favorites,
  completedArticles,
  onOpenArticle,
  onOpenBook,
  onToggleFavorite
}) => {
  const [activeSubSection, setActiveSubSection] = useState<'all' | 'books' | 'articles' | 'alain'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBookModal, setSelectedBookModal] = useState<Book | null>(null);

  // Filter books
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.includes(searchQuery) || 
      book.author.includes(searchQuery) || 
      book.summary.includes(searchQuery) ||
      (book.originalTitle && book.originalTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeSubSection === 'alain') {
      return matchesSearch && book.isAlainDeBotton;
    }
    return matchesSearch;
  });

  // Filter articles
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.includes(searchQuery) || 
      article.summary.includes(searchQuery) ||
      article.category.includes(searchQuery) ||
      article.tags.some(t => t.includes(searchQuery));
    
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;

    if (activeSubSection === 'alain') {
      const isAlainTopic = article.category.includes('دوباتن') || 
        article.tags.some(t => t.includes('دوباتن') || t.includes('آلن')) ||
        article.sources.some(s => s.author.includes('Botton') || s.author.includes('دوباتن'));
      return matchesSearch && matchesCategory && isAlainTopic;
    }

    return matchesSearch && matchesCategory;
  });

  // Extract unique categories for articles
  const articleCategories = ['all', ...Array.from(new Set(articles.map(a => a.category)))];

  return (
    <div className="pb-28 pt-2 px-4 max-w-lg mx-auto space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shadow-xl shadow-indigo-500/20">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-pink-400/20 rounded-full blur-lg pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
            <Sparkles size={14} className="text-amber-300" />
            <span>کتابخانه و مقالات دانشنامه یار</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            دانش، مهارت و بینش عشق
          </h1>
          <p className="text-xs text-white/90 leading-relaxed max-w-sm">
            مجموعه تخصصی ۵۰ مقاله کاربردی رابطه همراه با برترین آثار آلن دوباتن و نظریه‌پردازان نامدار روانشناسی ازدواج.
          </p>
          
          <div className="pt-2 flex items-center gap-3 text-xs">
            <span className="bg-white/15 px-2.5 py-1 rounded-xl font-bold backdrop-blur-sm">
              📚 {toPersianDigits(books.length)} کتاب برجسته
            </span>
            <span className="bg-white/15 px-2.5 py-1 rounded-xl font-bold backdrop-blur-sm">
              📝 {toPersianDigits(articles.length)} مقاله بالینی
            </span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="جستجو در کتاب‌ها، مقالات، موضوعات..."
          className="w-full bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm rounded-2xl py-3 pr-11 pl-4 border border-slate-200/80 dark:border-slate-700/80 shadow-soft-card focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
        <Search size={18} className="absolute right-4 top-3.5 text-slate-400" />
      </div>

      {/* Segmented Filter Control */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800/60 rounded-2xl gap-1">
        <button
          onClick={() => setActiveSubSection('all')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubSection === 'all'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          همه
        </button>
        <button
          onClick={() => setActiveSubSection('alain')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
            activeSubSection === 'alain'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Sparkles size={12} />
          <span>آلن دوباتن</span>
        </button>
        <button
          onClick={() => setActiveSubSection('books')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubSection === 'books'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          کتاب‌ها ({toPersianDigits(filteredBooks.length)})
        </button>
        <button
          onClick={() => setActiveSubSection('articles')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubSection === 'articles'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          مقالات ({toPersianDigits(filteredArticles.length)})
        </button>
      </div>

      {/* Alain de Botton Spotlight Showcase (if in 'all' or 'alain') */}
      {(activeSubSection === 'all' || activeSubSection === 'alain') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                مجموعه ویژه آثار آلن دوباتن
              </h2>
            </div>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
              مدرسه زندگی
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {books.filter(b => b.isAlainDeBotton).map((book) => (
              <div
                key={book.id}
                onClick={() => setSelectedBookModal(book)}
                className="group relative flex gap-4 p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700/60 shadow-soft-card cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="w-20 h-28 rounded-2xl overflow-hidden shadow-md flex-shrink-0 relative">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded-md bg-purple-950/80 text-[10px] text-purple-200 font-bold">
                    دوباتن
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-full">
                        {book.category}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                        <Star size={12} className="fill-amber-400" />
                        <span>{toPersianDigits(book.rating)}</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-50 line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {book.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{book.readTimeEstimate}</span>
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                      <span>خلاصه و بینش‌ها</span>
                      <ChevronLeft size={14} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Books Section (when in 'books' view) */}
      {activeSubSection === 'books' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              تمام کتاب‌های مرجع رابطه ({toPersianDigits(filteredBooks.length)})
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => setSelectedBookModal(book)}
                className="flex gap-4 p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/70 shadow-soft-card cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800 transition-all"
              >
                <div className="w-20 h-28 rounded-2xl overflow-hidden shadow-md flex-shrink-0">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full">
                        {book.category}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                        <Star size={12} className="fill-amber-400" />
                        <span>{toPersianDigits(book.rating)}</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {book.summary}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50 text-[11px] text-slate-400">
                    <span>{book.author}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center">
                      مشاهده جزئیات <ChevronLeft size={14} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Articles Section (in 'all' or 'articles') */}
      {(activeSubSection === 'all' || activeSubSection === 'articles') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                مقالات دانشنامه تحلیلی رابطه ({toPersianDigits(filteredArticles.length)})
              </h2>
              <p className="text-xs text-slate-500">پژوهش‌های گاتمن، سو جانسون، استر پرل و آلن دوباتن</p>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {articleCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                {cat === 'all' ? 'همه موضوعات' : cat}
              </button>
            ))}
          </div>

          {/* Articles List */}
          <div className="space-y-3">
            {filteredArticles.map((article) => {
              const isFav = favorites.includes(article.id);
              const isDone = completedArticles.includes(article.id);

              return (
                <div
                  key={article.id}
                  onClick={() => onOpenArticle(article)}
                  className="group p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/70 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-soft-card cursor-pointer transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-0.5 rounded-full">
                          {article.category}
                        </span>
                        {isDone && (
                          <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 size={10} />
                            خوانده شده
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {article.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {article.summary}
                      </p>

                      <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{toPersianDigits(article.readingTime)} دقیقه مطالعه</span>
                        </span>
                        {article.sources?.[0] && (
                          <span className="line-clamp-1">
                            منبع: {article.sources[0].author}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(article.id);
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-500 transition-colors"
                        title="نشان کردن"
                      >
                        <Bookmark
                          size={18}
                          className={isFav ? 'fill-rose-500 text-rose-500' : ''}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Book Detail Modal */}
      {selectedBookModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedBookModal(null)}
        >
          <div 
            className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-2xl text-right"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex gap-4">
              <div className="w-24 h-32 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                <img
                  src={selectedBookModal.coverImage}
                  alt={selectedBookModal.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-full">
                    {selectedBookModal.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star size={13} className="fill-amber-400" />
                    <span>{toPersianDigits(selectedBookModal.rating)}</span>
                  </div>
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-50">
                  {selectedBookModal.title}
                </h3>
                {selectedBookModal.originalTitle && (
                  <p className="text-xs text-slate-400 font-sans" dir="ltr">
                    {selectedBookModal.originalTitle}
                  </p>
                )}
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  نویسنده: {selectedBookModal.author}
                </p>
                {selectedBookModal.translator && (
                  <p className="text-xs text-slate-400">
                    مترجم: {selectedBookModal.translator}
                  </p>
                )}
              </div>
            </div>

            {/* Quote banner */}
            <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                <Quote size={14} />
                <span>جمله ماندگار کتاب:</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 italic leading-relaxed">
                {selectedBookModal.quote}
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                خلاصه و درونمایه کتاب:
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedBookModal.summary}
              </p>
            </div>

            {/* Key Insights */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                بینش‌های کلیدی برای زندگی مشترک:
              </h4>
              <div className="space-y-1.5">
                {selectedBookModal.keyInsights.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Why read for couples */}
            <div className="p-3.5 rounded-2xl bg-pink-50/80 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/40 space-y-1">
              <h4 className="text-xs font-bold text-pink-700 dark:text-pink-300">
                چرا خواندن این کتاب برای زوج‌ها معجزه می‌کند؟
              </h4>
              <p className="text-xs text-pink-900/80 dark:text-pink-200/80 leading-relaxed">
                {selectedBookModal.whyReadForCouples}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedBookModal(null)}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md active:scale-98"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
