import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Clock, CheckCircle, ArrowUpRight } from 'lucide-react';
import { Article } from '../../types';

interface ArticlesTimelineTabProps {
  articles: Article[];
  completedArticles: string[];
  favorites: string[];
  onOpenArticle: (article: Article) => void;
  onToggleFavorite: (id: string) => void;
}

export const ArticlesTimelineTab: React.FC<ArticlesTimelineTabProps> = ({
  articles,
  completedArticles,
  favorites,
  onOpenArticle,
  onToggleFavorite,
}) => {
  const grouped = useMemo(() => {
    const map = new Map<string, Article[]>();
    articles.forEach((a) => {
      const cat = a.category || 'دیگر';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(a);
    });
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [articles]);

  if (!articles.length) {
    return (
      <div className="pt-8 px-4 text-center">
        <BookOpen className="mx-auto mb-3 text-slate-400" size={40} />
        <p className="text-sm text-slate-500 dark:text-slate-400">هنوز مقالهٔ جدیدی نیست</p>
      </div>
    );
  }

  return (
    <div className="pt-2 px-4 max-w-2xl mx-auto space-y-3">
      {grouped.map(([category, cats], categoryIdx) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: categoryIdx * 0.05 }}
        >
          {/* دسته‌بندی */}
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 tracking-wider">
              {category}
            </h3>
            <div className="flex-1 h-px bg-gradient-to-l from-slate-200 dark:from-slate-700 to-transparent" />
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
              {cats.length}
            </span>
          </div>

          {/* timeline برای هر مقاله */}
          <div className="space-y-0 relative">
            {/* خط عمودی */}
            <div className="absolute left-3.5 top-3 bottom-3 w-px bg-gradient-to-b from-slate-200 via-slate-200 to-transparent dark:from-slate-700 dark:via-slate-700" />

            {cats.map((article, articleIdx) => {
              const isCompleted = completedArticles.includes(article.id);
              const isFavorited = favorites.includes(article.id);

              return (
                <motion.button
                  key={article.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (categoryIdx * cats.length + articleIdx) * 0.02 }}
                  onClick={() => onOpenArticle(article)}
                  className="relative w-full text-right group"
                >
                  <div className="flex gap-3 p-3 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                    {/* دایره‌ی timeline */}
                    <div className="shrink-0 mt-1">
                      <motion.div
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-600 text-white'
                            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                        }`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {isCompleted ? <CheckCircle size={16} /> : <Clock size={14} className="text-slate-400" />}
                      </motion.div>
                    </div>

                    {/* محتوا */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {article.summary || article.description}
                      </p>
                    </div>

                    {/* دکمه‌ها */}
                    <div className="flex items-start gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(article.id);
                        }}
                        className="w-8 h-8 rounded-lg text-xl flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                      >
                        {isFavorited ? '❤️' : '🤍'}
                      </button>
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                        <ArrowUpRight size={14} />
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* فاصلهٔ دسته‌بندی */}
          {categoryIdx < grouped.length - 1 && <div className="h-2" />}
        </motion.div>
      ))}

      <div className="pb-4" />
    </div>
  );
};
