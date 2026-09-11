import React from 'react';
import { MenstrualPhase } from '../../types';
import { getPhaseForDay } from '../../services/relationshipCycle';
import { toPersianDigits } from '../../services/jalali';

interface Props { currentDay: number; selectedDay: number; cycleLength: number; periodLength: number; onSelectDay: (day: number) => void; }
const COLOR: Record<MenstrualPhase, string> = {
  menstrual: 'oklch(62% 0.16 20)', follicular: 'oklch(59% 0.10 175)', ovulation: 'oklch(68% 0.13 78)', luteal: 'oklch(58% 0.13 300)',
};

export const CycleWheel: React.FC<Props> = ({ currentDay, selectedDay, cycleLength, periodLength, onSelectDay }) => {
  const center = 170; const radius = 132;
  return (
    <div className="relative w-full max-w-[23rem] aspect-square mx-auto" dir="ltr">
      <svg viewBox="0 0 340 340" className="w-full h-full overflow-visible" role="group" aria-label="روزهای سیکل قاعدگی">
        <circle cx={center} cy={center} r="106" fill="none" stroke="oklch(92% 0.012 330)" strokeWidth="22" />
        {Array.from({ length: cycleLength }, (_, index) => index + 1).map((day) => {
          const angle = -90 + ((day - 1) / cycleLength) * 360;
          const rad = angle * Math.PI / 180;
          const x = center + radius * Math.cos(rad); const y = center + radius * Math.sin(rad);
          const phase = getPhaseForDay(day, cycleLength, periodLength);
          const active = day === selectedDay; const today = day === currentDay;
          return (
            <g key={day} onClick={() => onSelectDay(day)} className="cursor-pointer" role="button" aria-label={`روز ${day}`}>
              <circle cx={x} cy={y} r={active ? 14 : today ? 10 : 6.5} fill={COLOR[phase]} opacity={active ? 1 : 0.72} stroke={active ? 'oklch(98% 0.008 330)' : 'none'} strokeWidth="4" />
              {(active || today || day === 1) && <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={active ? 10 : 8} fontWeight="900" fill="oklch(98% 0.008 330)">{toPersianDigits(day)}</text>}
            </g>
          );
        })}
        <circle cx={center} cy={center} r="84" fill="oklch(98% 0.008 330)" />
        <text x={center} y={center - 14} textAnchor="middle" fontSize="12" fontWeight="700" fill="oklch(52% 0.03 330)">روز سیکل</text>
        <text x={center} y={center + 25} textAnchor="middle" fontSize="38" fontWeight="900" fill="oklch(30% 0.035 330)">{toPersianDigits(selectedDay)}</text>
        {selectedDay === currentDay && <text x={center} y={center + 49} textAnchor="middle" fontSize="10" fontWeight="800" fill="oklch(58% 0.13 300)">امروز</text>}
      </svg>
    </div>
  );
};
