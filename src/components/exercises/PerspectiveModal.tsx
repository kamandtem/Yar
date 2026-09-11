import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PerspectiveCase } from '../../types';
import { X, Eye, Sparkles, MessageSquare } from 'lucide-react';

interface PerspectiveModalProps {
  perspectiveCase: PerspectiveCase | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PerspectiveModal: React.FC<PerspectiveModalProps> = ({
  perspectiveCase,
  isOpen,
  onClose
}) => {
  const [activeView, setActiveView] = useState<'partnerA' | 'partnerB' | 'insight'>('partnerA');

  if (!isOpen || !perspectiveCase) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-lg h-full sm:h-auto sm:max-h-[92vh] bg-[#FBF8F3] dark:bg-[#1A1E22] sm:rounded-3xl shadow-2xl border border-[#EBE1D7] dark:border-neutral-800 overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#FBF8F3]/90 dark:bg-[#1A1E22]/90 backdrop-blur-md border-b border-[#EBDED3] dark:border-neutral-800">
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#7A858C] dark:text-[#9CA3AF] hover:bg-[#EFE7DC] dark:hover:bg-neutral-800 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-1.5 text-xs font-black text-[#D97D7A]">
            <Eye size={15} />
            <span>بخش دو دیدگاه (درک متقابل)</span>
          </div>
          <div className="w-8" />
        </div>

        {/* Body */}
        <div className="p-5 sm:p-7 space-y-5 flex-1">
          <div>
            <span className="text-[10px] font-bold text-[#C2413C] dark:text-[#F87171] px-2.5 py-0.5 rounded-full bg-[#FFF2F1] dark:bg-[#3D1E1E]">
              {perspectiveCase.category}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#1E2224] dark:text-[#F3F4F6] mt-2">
              {perspectiveCase.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#555E65] dark:text-[#CBD5E1] mt-1.5 leading-relaxed font-medium">
              سناریو: {perspectiveCase.situation}
            </p>
          </div>

          {/* Perspective View Switcher */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#EFE7DC] dark:bg-neutral-800 rounded-2xl">
            <button
              onClick={() => setActiveView('partnerA')}
              className={`py-2 px-1 text-xs font-bold rounded-xl transition-all ${
                activeView === 'partnerA'
                  ? 'bg-white dark:bg-neutral-900 text-[#C2413C] shadow-xs'
                  : 'text-[#6F7981] dark:text-[#9CA3AF]'
              }`}
            >
              دیدگاه نفر اول
            </button>
            <button
              onClick={() => setActiveView('partnerB')}
              className={`py-2 px-1 text-xs font-bold rounded-xl transition-all ${
                activeView === 'partnerB'
                  ? 'bg-white dark:bg-neutral-900 text-[#3D5A80] shadow-xs'
                  : 'text-[#6F7981] dark:text-[#9CA3AF]'
              }`}
            >
              دیدگاه نفر دوم
            </button>
            <button
              onClick={() => setActiveView('insight')}
              className={`py-2 px-1 text-xs font-bold rounded-xl transition-all ${
                activeView === 'insight'
                  ? 'bg-[#4E6B58] text-white shadow-xs'
                  : 'text-[#6F7981] dark:text-[#9CA3AF]'
              }`}
            >
              تحلیل یار 💡
            </button>
          </div>

          {/* Active Card Content */}
          <AnimatePresence mode="wait">
            {activeView === 'partnerA' && (
              <motion.div
                key="partnerA"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-5 rounded-3xl bg-white dark:bg-neutral-800 border border-[#E8DDCF] dark:border-neutral-700 shadow-xs space-y-3"
              >
                <span className="text-xs font-extrabold text-[#C2413C]">
                  {perspectiveCase.partnerA.label}
                </span>

                <div className="p-4 rounded-2xl bg-[#FFF9F7] dark:bg-neutral-900 border border-[#FADCCB] dark:border-neutral-800 text-xs sm:text-sm text-[#4E2A22] dark:text-[#FCDDD6] leading-relaxed italic">
                  {perspectiveCase.partnerA.thought}
                </div>

                <div className="space-y-1.5 text-xs text-[#525B62] dark:text-[#CBD5E1]">
                  <p>
                    <strong className="text-[#1E2224] dark:text-[#F3F4F6]">احساس زیرین:</strong>{' '}
                    {perspectiveCase.partnerA.underlyingFeeling}
                  </p>
                  <p>
                    <strong className="text-[#1E2224] dark:text-[#F3F4F6]">استراتژی دفاعی:</strong>{' '}
                    {perspectiveCase.partnerA.protectiveStrategy}
                  </p>
                </div>
              </motion.div>
            )}

            {activeView === 'partnerB' && (
              <motion.div
                key="partnerB"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-5 rounded-3xl bg-white dark:bg-neutral-800 border border-[#E8DDCF] dark:border-neutral-700 shadow-xs space-y-3"
              >
                <span className="text-xs font-extrabold text-[#3D5A80]">
                  {perspectiveCase.partnerB.label}
                </span>

                <div className="p-4 rounded-2xl bg-[#F4F8FA] dark:bg-neutral-900 border border-[#D5E1EC] dark:border-neutral-800 text-xs sm:text-sm text-[#273E54] dark:text-[#D1E5F7] leading-relaxed italic">
                  {perspectiveCase.partnerB.thought}
                </div>

                <div className="space-y-1.5 text-xs text-[#525B62] dark:text-[#CBD5E1]">
                  <p>
                    <strong className="text-[#1E2224] dark:text-[#F3F4F6]">احساس زیرین:</strong>{' '}
                    {perspectiveCase.partnerB.underlyingFeeling}
                  </p>
                  <p>
                    <strong className="text-[#1E2224] dark:text-[#F3F4F6]">استراتژی دفاعی:</strong>{' '}
                    {perspectiveCase.partnerB.protectiveStrategy}
                  </p>
                </div>
              </motion.div>
            )}

            {activeView === 'insight' && (
              <motion.div
                key="insight"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-3"
              >
                {/* Yar Insight */}
                <div className="p-4 rounded-2xl bg-[#F0F6F2] dark:bg-[#19271E] border border-[#D1E3D7] dark:border-[#2C4A36] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#4E6B58] dark:text-[#86EFAC]">
                    <Sparkles size={15} />
                    <span>تحلیل روان‌شناختی یار:</span>
                  </div>
                  <p className="text-xs text-[#2A3E30] dark:text-[#CBD5E1] leading-relaxed">
                    {perspectiveCase.yarInsight}
                  </p>
                </div>

                {/* Healthy Bridge / Better Dialogue */}
                <div className="p-4 rounded-2xl bg-linear-to-r from-[#FFF4ED] to-[#FAF1EB] dark:from-[#2A1F19] dark:to-[#211A16] border border-[#FADCC8] dark:border-neutral-700 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#C2413C] dark:text-[#F87171]">
                    <MessageSquare size={15} />
                    <span>پل ارتباطی و شیوه سالم گفت‌وگو:</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-[#FCE4D6] dark:border-neutral-800 text-xs text-[#1E2224] dark:text-[#F3F4F6] font-semibold leading-relaxed">
                    🗣️ {perspectiveCase.healthyBridge}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Golden Takeaway */}
          <div className="p-3.5 rounded-2xl bg-[#F6EEE4] dark:bg-neutral-800/60 text-xs text-[#525B62] dark:text-[#CBD5E1] border border-[#E5DCD1] dark:border-neutral-700 leading-relaxed">
            💡 <strong className="text-[#1E2224] dark:text-[#F3F4F6]">درس این موقعیت:</strong> در اوج اختلاف، رفتار طرف مقابل را نیت‌خوانی نکنید؛ پشت هر واکنش تند یا سکوت سنگین، معمولاً ترسی از دست رفتن اتصال عاطفی نهفته است.
          </div>
        </div>
      </div>
    </div>
  );
};
