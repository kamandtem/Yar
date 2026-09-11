import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Droplet,
  Activity,
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
} from 'lucide-react';
import { MenstrualCycleConfig, PHASE_COLORS, PHASE_NAMES_FA, PHASE_DESCRIPTIONS_FA } from '../../types/cycle';
import { computeCycleState, getTodayIso } from '../../services/cycleService';

interface CycleTabProps {
  cycleConfig: MenstrualCycleConfig;
  onUpdateCycleConfig: (config: MenstrualCycleConfig) => void;
}

const PHASE_ORDER = ['menstrual', 'follicular', 'ovulation', 'luteal'] as const;

export const CycleTab: React.FC<CycleTabProps> = ({ cycleConfig, onUpdateCycleConfig }) => {
  const today = useMemo(() => getTodayIso(), []);
  const state = useMemo(() => computeCycleState(cycleConfig, today), [cycleConfig, today]);
  const [showPeriodForm, setShowPeriodForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);

  const handleLogPeriod = () => {
    if (selectedDate) {
      onUpdateCycleConfig({
        ...cycleConfig,
        lastPeriodStartIso: selectedDate,
      });
      setShowPeriodForm(false);
    }
  };

  if (!state.available) {
    return (
      <div className="pt-1 px-4 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-6 rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/30 border border-rose-200/60 dark:border-rose-900/40 text-center"
        >
          <Droplet className="mx-auto mb-3 text-rose-500" size={32} />
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
            ردیابی قاعدگی فعال نیست
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            برای شروع، ابتدای آخرین قاعدگی خود را ثبت کنید.
          </p>
        </motion.div>
      </div>
    );
  }

  const currentPhaseColor = state.phase ? PHASE_COLORS[state.phase] : PHASE_COLORS.follicular;

  return (
    <div className="pt-1 px-4 max-w-md mx-auto space-y-5">
      {/* چرخهٔ رنگی */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-64 h-64 mx-auto"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
          {PHASE_ORDER.map((phase, idx) => {
            const startAngle = (idx * 360) / PHASE_ORDER.length;
            const endAngle = startAngle + 360 / PHASE_ORDER.length;
            const isCurrentPhase = phase === state.phase;
            const phaseColor = PHASE_COLORS[phase];
            const phaseColorValue = phaseColor.bg.replace('bg-', '').replace('dark:', '');

            const start = polarToCartesian(100, 100, 85, endAngle);
            const end = polarToCartesian(100, 100, 85, startAngle);
            const largeArcFlag = 360 / PHASE_ORDER.length > 180 ? 1 : 0;
            const pathData = [
              `M ${start.x} ${start.y}`,
              `A 85 85 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
              `L 100 100`,
            ].join(' ');

            const colorMap: Record<string, string> = {
              'red-600': '#dc2626',
              'emerald-600': '#16a34a',
              'amber-600': '#d97706',
              'violet-600': '#7c3aed',
            };

            return (
              <g key={phase}>
                <path
                  d={pathData}
                  fill={colorMap[phaseColorValue] || '#ccc'}
                  opacity={isCurrentPhase ? 1 : 0.6}
                />
                <text
                  x={polarToCartesian(100, 100, 115, (startAngle + endAngle) / 2).x}
                  y={polarToCartesian(100, 100, 115, (startAngle + endAngle) / 2).y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-bold pointer-events-none"
                  fill="#333"
                >
                  {PHASE_NAMES_FA[phase as keyof typeof PHASE_NAMES_FA].split(' ')[0]}
                </text>
              </g>
            );
          })}

          <circle cx="100" cy="100" r="35" fill="white" />
          <text x="100" y="90" textAnchor="middle" className="text-2xl font-black" fill="#000">
            {state.cycleDay}
          </text>
          <text x="100" y="115" textAnchor="middle" className="text-xs" fill="#999">
            روز
          </text>
        </svg>
      </motion.div>

      {/* معلومات فاز */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-5 rounded-2xl border-2 ${currentPhaseColor.light} ${currentPhaseColor.text}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Activity size={18} className="fill-current" />
          <h3 className="text-lg font-extrabold">{state.phaseNameFa}</h3>
        </div>
        <p className="text-sm opacity-90 leading-relaxed mb-3">
          {state.phase ? PHASE_DESCRIPTIONS_FA[state.phase] : ''}
        </p>
        {state.inPeriod && (
          <div className="text-xs font-bold p-2 rounded-lg bg-white/40 dark:bg-black/20">
            🩸 قاعدگی فعال است
          </div>
        )}
        {state.inLuteal && (
          <div className="text-xs font-bold p-2 rounded-lg bg-white/40 dark:bg-black/20">
            ⚠️ فاز PMS
          </div>
        )}
      </motion.div>

      {/* پیش‌بینی */}
      {state.nextPeriodDate && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60"
        >
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={16} className="text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">پیش‌بینی</span>
          </div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white">
            {state.nextPeriodDate}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {state.daysUntilPeriod} روز باقی‌مانده
          </div>
        </motion.div>
      )}

      {/* فرم */}
      {showPeriodForm && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-rose-200 dark:border-rose-900/60"
        >
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">
            تاریخ شروع قاعدگی (YYYY-MM-DD):
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-900 dark:text-white text-sm mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={handleLogPeriod}
              className="flex-1 px-3 py-2 rounded-xl bg-rose-600 dark:bg-rose-700 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              ثبت
            </button>
            <button
              onClick={() => setShowPeriodForm(false)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              انصراف
            </button>
          </div>
        </motion.div>
      )}

      {/* دکمه‌ها */}
      {!showPeriodForm && (
        <button
          onClick={() => setShowPeriodForm(true)}
          className="w-full py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer text-sm"
        >
          <Plus size={18} />
          ثبت قاعدگی
        </button>
      )}

      {cycleConfig.lastPeriodStartIso && (
        <button
          onClick={() => {
            onUpdateCycleConfig({ ...cycleConfig, enabled: false, lastPeriodStartIso: undefined });
          }}
          className="w-full py-2 rounded-xl text-slate-500 dark:text-slate-400 text-xs font-bold flex items-center justify-center gap-1 hover:text-red-500 transition-colors cursor-pointer"
        >
          <Trash2 size={14} />
          حذف ردیابی
        </button>
      )}
    </div>
  );
};

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}
