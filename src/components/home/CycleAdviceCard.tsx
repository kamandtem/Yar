import React from 'react';
import { motion } from 'motion/react';
import { Droplet, AlertCircle, Heart, Sparkles } from 'lucide-react';
import { MenstrualPhase, PHASE_COLORS, PHASE_DESCRIPTIONS_FA } from '../../types/cycle';
import { PHASE_RECOMMENDATIONS, getHomeTip } from '../../services/cycleAdvanced';

interface CycleAdviceCardProps {
  phase: MenstrualPhase | null;
  cycleDay: number | null;
  inPeriod: boolean;
  inLuteal: boolean;
  onOpenCycle: () => void;
}

export const CycleAdviceCard: React.FC<CycleAdviceCardProps> = ({
  phase,
  cycleDay,
  inPeriod,
  inLuteal,
  onOpenCycle,
}) => {
  if (!phase || cycleDay === null) {
    return null; // چرخه فعال نیست
  }

  const recommendation = PHASE_RECOMMENDATIONS[phase];
  const colors = PHASE_COLORS[phase];
  const tip = getHomeTip(phase);

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onOpenCycle}
      className={`w-full p-5 rounded-2xl border-2 text-left transition-all active:scale-95 cursor-pointer ${colors.light} ${colors.text} hover:shadow-lg`}
    >
      {/* هدر */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-extrabold flex items-center gap-2">
            <Droplet size={18} className="fill-current" />
            {recommendation.phaseFa}
          </h3>
          <div className="text-xs opacity-75 mt-0.5">روز {cycleDay} از چرخه</div>
        </div>
        <div className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${colors.light}`}>
          {inPeriod ? '🩸 قاعدگی' : inLuteal ? '⚠️ PMS' : '✨ فعال'}
        </div>
      </div>

      {/* توصیهٔ روزانه */}
      <div className="p-3 rounded-xl bg-white/40 dark:bg-black/20 mb-3 text-sm font-bold leading-relaxed">
        {tip}
      </div>

      {/* نکات مهم */}
      <div className="space-y-2">
        {/* مراقبتِ پوست */}
        {recommendation.skinCare.length > 0 && (
          <div className="text-xs">
            <div className="font-bold flex items-center gap-1 mb-1">
              ✨ پوست
            </div>
            <ul className="space-y-0.5 opacity-90 pl-4">
              {recommendation.skinCare.slice(0, 2).map((tip, idx) => (
                <li key={idx} className="text-[11px]">
                  • {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* نکاتِ عاطفی */}
        {recommendation.emotionalTips.length > 0 && (
          <div className="text-xs">
            <div className="font-bold flex items-center gap-1 mb-1">
              ❤️ احساسات
            </div>
            <ul className="space-y-0.5 opacity-90 pl-4">
              {recommendation.emotionalTips.slice(0, 2).map((tip, idx) => (
                <li key={idx} className="text-[11px]">
                  • {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* پرهیز */}
        {recommendation.avoidance.length > 0 && (
          <div className="text-xs">
            <div className="font-bold flex items-center gap-1 mb-1">
              ⚠️ پرهیز
            </div>
            <ul className="space-y-0.5 opacity-90 pl-4">
              {recommendation.avoidance.slice(0, 2).map((item, idx) => (
                <li key={idx} className="text-[11px]">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* دکمهٔ بیشتر */}
      <div className="mt-3 text-xs font-bold opacity-75 text-center">
        برای توصیه‌های کاملتر → کلیک کن
      </div>
    </motion.button>
  );
};
