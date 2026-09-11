import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Article } from '../../types';
import { toPersianDigits } from '../../utils/persianDate';
import {
  Clock,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  BookOpen,
  ArrowLeft,
  Share2,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface ArticleModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  isCompleted: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleCompleted: (id: string) => void;
  onSelectRelatedArticle: (id: string) => void;
  allArticles: Article[];
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  isOpen,
  onClose,
  isFavorite,
  isCompleted,
  onToggleFavorite,
  onToggleCompleted,
  onSelectRelatedArticle,
  allArticles
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  if (!isOpen || !article) return null;

  const relatedArticles = allArticles.filter((a) =>
    article.relatedContentIds?.includes(a.id)
  );

  return (
    <div className="fixed inset-x-0 top-[4.5rem] bottom-[5.5rem] z-40 flex items-center justify-center bg-slate-950/20 p-0 sm:p-4">
      <div className="relative w-full max-w-lg h-full sm:h-auto sm:max-h-full bg-[#FBF8F3] dark:bg-[#1A1E22] sm:rounded-3xl shadow-2xl border border-[#EBE1D7] dark:border-neutral-800 overflow-y-auto flex flex-col">
        
        {/* Floating Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#FBF8F3]/90 dark:bg-[#1A1E22]/90 backdrop-blur-md border-b border-[#EBDED3] dark:border-neutral-800">
<div className="w-8"/>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(article.id)}
              className={`p-2 rounded-full transition-colors ${
                isFavorite
                  ? 'text-[#C2413C] bg-[#FFF2F1] dark:bg-[#3D1E1E]'
                  : 'text-[#7A858C] hover:bg-[#EFE7DC] dark:hover:bg-neutral-800'
              }`}
              title="نشان کردن"
            >
              {isFavorite ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>

            <button
              onClick={() => onToggleCompleted(article.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isCompleted
                  ? 'bg-[#EBF3ED] dark:bg-[#1E3024] text-[#4E6B58] dark:text-[#86EFAC]'
                  : 'bg-white dark:bg-neutral-800 text-[#5C646A] dark:text-[#D1D5DB] border border-[#D5CBC1] dark:border-neutral-700'
              }`}
            >
              <CheckCircle2 size={15} />
              <span>{isCompleted ? 'خوانده شد' : 'علامت خوانده‌شده'}</span>
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* Hero Image */}
          <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden shadow-xs bg-[#F2E5D9]">
            <img
              src={article.heroImage}
              alt={article.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-white">
              <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-bold border border-white/20">
                {article.category}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                <Clock size={12} />
                <span>{toPersianDigits(article.readingTime)} دقیقه مطالعه</span>
              </div>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E2224] dark:text-[#F3F4F6] leading-tight">
              {article.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#707B84] dark:text-[#9CA3AF] mt-1.5 font-medium">
              {article.subtitle}
            </p>
          </div>

          {/* Short Summary (Item 21 mandate: خلاصه بسیار کوتاه) */}
          <div className="p-4 rounded-2xl bg-[#FFF5EF] dark:bg-[#2C1D18] border border-[#FADCC8] dark:border-[#542B21]">
            <span className="text-[11px] font-extrabold text-[#C2413C] dark:text-[#F87171] uppercase tracking-wider block mb-1">
              خلاصه در یک نگاه:
            </span>
            <p className="text-xs sm:text-sm text-[#4E2A22] dark:text-[#FCDDD6] font-medium leading-relaxed">
              {article.summary}
            </p>
          </div>

          {/* Real Scenario */}
          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800/80 border border-[#EBE1D7] dark:border-neutral-700/60 space-y-2 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E2224] dark:text-[#F3F4F6]">
              <span className="text-[#C2413C]">✦</span>
              <span>شاید این تجربه برایت آشنا باشد...</span>
            </div>
            <p className="text-xs sm:text-sm text-[#4A5258] dark:text-[#D1D5DB] leading-relaxed">
              {article.content.scenario}
            </p>
          </div>

          {/* Scientific Insight */}
          <div className="p-4 rounded-2xl bg-[#F0F6F2] dark:bg-[#19271E] border border-[#D1E3D7] dark:border-[#2C4A36] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#4E6B58] dark:text-[#86EFAC]">
              <BookOpen size={16} />
              <span>پشت این واکنش چه اتفاق علمی‌ای می‌افتد؟</span>
            </div>
            <p className="text-xs sm:text-sm text-[#2E4334] dark:text-[#CBD5E1] leading-relaxed">
              {article.content.scientificInsight}
            </p>
          </div>

          {/* Key Takeaway */}
          <div className="p-4 rounded-2xl bg-[#F4F1EA] dark:bg-neutral-800 border-l-4 border-l-[#3D5A80] border border-[#E5DCD1] dark:border-neutral-700">
            <span className="text-xs font-bold text-[#3D5A80] dark:text-[#93C5FD] block mb-1">
              نکته کلیدی برای به خاطر سپردن:
            </span>
            <p className="text-xs text-[#3E454B] dark:text-[#E2E8F0] font-semibold leading-relaxed">
              {article.content.keyTakeaway}
            </p>
          </div>

          {/* Interactive Question (Item 5: کاربر باید احساس کند یک کاری انجام داد) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-800/90 border border-[#EBE1D7] dark:border-neutral-700 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E2224] dark:text-[#F3F4F6]">
              <HelpCircle size={17} className="text-[#C2413C]" />
              <span>پرسش تعاملی: خودت را بسنج</span>
            </div>
            <p className="text-xs font-semibold text-[#555E65] dark:text-[#CBD5E1]">
              {article.interactiveQuestion.question}
            </p>

            <div className="space-y-2">
              {article.interactiveQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedOption(idx);
                      setShowFeedback(true);
                    }}
                    className={`w-full p-3 rounded-xl text-right text-xs font-medium border transition-all ${
                      isSelected
                        ? 'border-[#C2413C] bg-[#FFF2F1] dark:bg-[#331C1A] text-[#C2413C] dark:text-[#FCA5A5]'
                        : 'border-[#E8DDCF] dark:border-neutral-700 hover:bg-[#FAF5EE] dark:hover:bg-neutral-700 text-[#4A5258] dark:text-[#D1D5DB]'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 rounded-xl bg-[#FAF5EE] dark:bg-neutral-900 border border-[#EBDED3] dark:border-neutral-700 text-xs text-[#525B62] dark:text-[#CBD5E1] leading-relaxed"
              >
                💡 <span className="font-bold">یار می‌گوید:</span>{' '}
                {article.interactiveQuestion.reflectionPrompt}
              </motion.div>
            )}
          </div>

          {/* Practical Exercise Snippet */}
          <div className="p-4 rounded-2xl bg-linear-to-r from-[#FFF4ED] to-[#FAF1EB] dark:from-[#291F18] dark:to-[#221B17] border border-[#FADCC8] dark:border-neutral-700">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={16} className="text-[#D97D7A]" />
              <h3 className="text-xs font-bold text-[#1E2224] dark:text-[#F3F4F6]">
                {article.exerciseSnippet.title}
              </h3>
            </div>
            <p className="text-xs text-[#5C453C] dark:text-[#E2D5CF] leading-relaxed">
              {article.exerciseSnippet.instruction}
            </p>
          </div>

          {/* Related Content (Item 52 mandate: ۳ محتوای مرتبط) */}
          {relatedArticles.length > 0 && (
            <div className="pt-2">
              <h3 className="text-xs font-extrabold text-[#7A858C] dark:text-[#9CA3AF] mb-3">
                شاید این‌ها هم به دردت بخورد:
              </h3>
              <div className="space-y-2">
                {relatedArticles.slice(0, 3).map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => onSelectRelatedArticle(rel.id)}
                    className="w-full p-3 rounded-xl bg-white dark:bg-neutral-800 border border-[#E8DDCF] dark:border-neutral-700 hover:bg-[#FAF5EE] dark:hover:bg-neutral-700 text-right flex items-center justify-between group transition-all"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#1E2224] dark:text-[#F3F4F6] group-hover:text-[#C2413C] transition-colors">
                        {rel.title}
                      </h4>
                      <span className="text-[10px] text-[#7A858C] dark:text-[#9CA3AF]">
                        ⏱ {toPersianDigits(rel.readingTime)} دقیقه مطالعه
                      </span>
                    </div>
                    <ArrowLeft size={14} className="text-[#7A858C] group-hover:-translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <button onClick={onClose} className="mt-2 min-h-12 w-full rounded-2xl bg-[#3D5A80] text-sm font-black text-white shadow-md">متوجه شدم، برگشت به نکات زندگی</button>
        </div>
      </div>
    </div>
  );
};
