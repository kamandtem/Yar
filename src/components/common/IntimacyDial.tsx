import React from 'react';
import { motion } from 'motion/react';
import { toPersianDigits } from '../../utils/persianDate';
import { Heart, Sparkles, Thermometer, ShieldCheck } from 'lucide-react';

interface IntimacyDialProps {
  value: number; // 1 to 5 or temperature 18 to 36
  onChange?: (val: number) => void;
  readOnly?: boolean;
}

export const IntimacyDial: React.FC<IntimacyDialProps> = ({
  value = 4,
  onChange,
  readOnly = false
}) => {
  // Normalize value to a 1-5 scale or display as degrees like the image's 26°C!
  // Let's map 1-5 to a temperature range: 1 = 18°, 2 = 21°, 3 = 24°, 4 = 27°, 5 = 30°
  const degrees = Math.round(18 + ((value - 1) / 4) * 12);
  const percentage = Math.round(((value - 1) / 4) * 100);

  // Stroke math for circular SVG
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  // Let's show an arc of 260 degrees
  const strokeDashoffset = circumference - (percentage / 100) * (circumference * 0.75);

  const getStatusText = (val: number) => {
    if (val >= 4.5) return { title: 'صمیمیت پرشور و امن', subtitle: 'اتصال عاطفی در نقطه طلایی', color: 'text-emerald-500' };
    if (val >= 3.5) return { title: 'آرام، گرم و پناهگاه', subtitle: 'درک متقابل و صبوری جاری است', color: 'text-indigo-500' };
    if (val >= 2.5) return { title: 'متعادل، نیازمند توجه', subtitle: 'یک چای و گفت‌وگوی کوتاه توصیه می‌شود', color: 'text-amber-500' };
    return { title: 'خنک یا فاصله عاطفی', subtitle: 'پیشنهاد: استفاده از جریان آغازگر ملایم', color: 'text-rose-500' };
  };

  const status = getStatusText(value);

  // Generate 28 dotted ticks around the circumference
  const tickCount = 28;
  const ticks = Array.from({ length: tickCount }).map((_, i) => {
    const angle = (i / tickCount) * 270 - 135;
    const isLit = i / tickCount <= percentage / 100;
    return { angle, isLit };
  });

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Dial Outer Canvas */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Ticks ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {ticks.map((t, idx) => (
            <div
              key={idx}
              className="absolute w-1 h-3 rounded-full transition-all duration-300"
              style={{
                transform: `rotate(${t.angle}deg) translateY(-106px)`,
                backgroundColor: t.isLit ? '#818CF8' : 'rgba(148, 163, 184, 0.25)'
              }}
            />
          ))}
        </div>

        {/* SVG Arc Progress */}
        <svg className="w-52 h-52 -rotate-90 pointer-events-none" viewBox="0 0 200 200">
          {/* Background Track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="rgba(226, 232, 240, 0.6)"
            strokeWidth="10"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeLinecap="round"
            className="dark:stroke-slate-800"
          />

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="intimacyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="50%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>

          {/* Animated Gradient Progress Arc */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="url(#intimacyGradient)"
            strokeWidth="10"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </svg>

        {/* Center Frosted Glass Orb with Wave Effect */}
        <div className="absolute w-36 h-36 rounded-full bg-linear-to-br from-indigo-50/90 via-purple-50/70 to-sky-50/90 dark:from-slate-800/90 dark:via-indigo-950/70 dark:to-slate-900/90 backdrop-blur-xl border border-white/80 dark:border-slate-700 shadow-soft-card flex flex-col items-center justify-center overflow-hidden select-none">
          {/* Animated Subtle Wave in Center */}
          <div className="absolute inset-x-0 bottom-0 h-16 opacity-30 pointer-events-none">
            <svg
              viewBox="0 0 1440 320"
              className="w-full h-full text-indigo-400 dark:text-indigo-500 fill-current animate-pulse"
              preserveAspectRatio="none"
            >
              <path d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,197.3C672,192,768,128,864,122.7C960,117,1056,171,1152,181.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
            </svg>
          </div>

          {/* Temperature / Intimacy Metric */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="flex items-start">
              <span className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white tracking-tighter">
                {toPersianDigits(degrees)}°
              </span>
              <span className="text-xs font-black text-indigo-500 mt-1 mr-0.5">C</span>
            </div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
              دمای صمیمیت
            </span>
          </div>
        </div>
      </div>

      {/* Status & Quick Adjuster */}
      <div className="mt-2 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 shadow-soft-card text-xs font-bold text-slate-700 dark:text-slate-200">
          <Sparkles size={13} className="text-indigo-500" />
          <span>{status.title}</span>
        </div>

        <p className="text-[11px] text-slate-400 dark:text-slate-400 font-medium">
          {status.subtitle}
        </p>

        {!readOnly && onChange && (
          <div className="flex items-center justify-center gap-1 pt-1.5">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                onClick={() => onChange(lvl)}
                className={`w-7 h-7 rounded-xl text-xs font-bold transition-all ${
                  value === lvl
                    ? 'bg-indigo-600 text-white shadow-soft-card scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white border border-slate-100 dark:border-slate-800'
                }`}
              >
                {toPersianDigits(lvl)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
