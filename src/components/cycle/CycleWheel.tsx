import React from 'react';
import { MenstrualPhase } from '../../types';
import { getPhaseForDay } from '../../services/relationshipCycle';
import { toPersianDigits } from '../../services/jalali';
import { CalendarHeart, Droplet, Pencil } from 'lucide-react';

interface Props { currentDay:number; selectedDay:number; cycleLength:number; periodLength:number; daysUntilNextPeriod?:number|null; onSelectDay:(day:number)=>void; onEditPeriod?:()=>void; }
const COLOR:Record<MenstrualPhase,string>={menstrual:'oklch(62% 0.16 20)',follicular:'oklch(59% 0.10 175)',ovulation:'oklch(68% 0.13 78)',luteal:'oklch(58% 0.13 300)'};
const ORDINAL=['','اول','دوم','سوم','چهارم','پنجم','ششم','هفتم','هشتم','نهم','دهم','یازدهم','دوازدهم','سیزدهم','چهاردهم','پانزدهم','شانزدهم','هفدهم','هجدهم','نوزدهم','بیستم','بیست‌ویکم','بیست‌ودوم','بیست‌وسوم','بیست‌وچهارم','بیست‌وپنجم','بیست‌وششم','بیست‌وهفتم','بیست‌وهشتم','بیست‌ونهم','سی‌ام','سی‌ویکم','سی‌ودوم','سی‌وسوم','سی‌وچهارم','سی‌وپنجم','سی‌وششم','سی‌وهفتم','سی‌وهشتم','سی‌ونهم','چهلم','چهل‌ویکم','چهل‌ودوم','چهل‌وسوم','چهل‌وچهارم','چهل‌وپنجم','چهل‌وششم','چهل‌وهفتم','چهل‌وهشتم','چهل‌ونهم','پنجاهم','پنجاه‌ویکم','پنجاه‌ودوم','پنجاه‌وسوم','پنجاه‌وچهارم','پنجاه‌وپنجم','پنجاه‌وششم','پنجاه‌وهفتم','پنجاه‌وهشتم','پنجاه‌ونهم','شصتم'];
const dayWord=(day:number)=>ORDINAL[day]||toPersianDigits(day);
export const CycleWheel:React.FC<Props>=({currentDay,selectedDay,cycleLength,periodLength,daysUntilNextPeriod,onSelectDay,onEditPeriod})=>{
 const center=170,radius=132;
 return <div className="relative mx-auto aspect-square w-full max-w-[23rem]" dir="ltr">
  <svg viewBox="0 0 340 340" className="h-full w-full overflow-visible" role="group" aria-label="روزهای سیکل قاعدگی">
   <circle cx={center} cy={center} r="110" fill="none" stroke="oklch(93% 0.012 300)" strokeWidth="22"/>
   <circle cx={center} cy={center} r="123" fill="none" stroke="oklch(89% 0.035 300)" strokeWidth="2" strokeDasharray="2 6"/>
   {Array.from({length:cycleLength},(_,i)=>i+1).map(day=>{const angle=-90+((day-1)/cycleLength)*360,rad=angle*Math.PI/180,x=center+radius*Math.cos(rad),y=center+radius*Math.sin(rad),phase=getPhaseForDay(day,cycleLength,periodLength),active=day===selectedDay,today=day===currentDay;return <g key={day} onClick={()=>onSelectDay(day)} className="cursor-pointer" role="button" aria-label={`روز ${day}`}><circle cx={x} cy={y} r={active?13:today?10:6.5} fill={COLOR[phase]} opacity={active?1:.88} stroke={active?'oklch(98% 0.008 300)':'none'} strokeWidth="4"/>{(active||today||day===1)&&<text x={x} y={y+1} textAnchor="middle" dominantBaseline="middle" fontSize={active?10:8} fontWeight="900" fill="oklch(98% 0.008 300)">{toPersianDigits(day)}</text>}</g>})}
  </svg>
  <div className="pointer-events-none absolute inset-[19%] flex flex-col items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_42%,oklch(91%_0.09_300),oklch(76%_0.16_300)_52%,oklch(69%_0.13_300))] px-4 text-center shadow-[0_12px_34px_oklch(60%_0.12_300_/_0.22)]">
   <div className="pointer-events-auto"><p className="text-[1.25rem] font-black leading-8 text-[oklch(25%_0.04_300)]">روز {dayWord(currentDay)}</p><p className="mt-0.5 text-sm font-bold text-[oklch(44%_0.035_300)]">از {toPersianDigits(cycleLength)} روز</p></div>
   <div className="mt-2 flex items-center gap-1.5 rounded-full bg-[oklch(99%_0.004_300_/_0.78)] px-2.5 py-1 text-[10px] font-bold text-[oklch(47%_0.08_300)]"><CalendarHeart size={11}/>{daysUntilNextPeriod&&daysUntilNextPeriod>0?`پریود بعدی: ${toPersianDigits(daysUntilNextPeriod)} روز دیگر`:'پریود بعدی نزدیک است'}</div>
   <button onClick={onEditPeriod} className="pointer-events-auto relative mt-2 flex h-7 items-center gap-1 rounded-full bg-[oklch(60%_0.20_330)] px-2.5 text-[9px] font-black text-[oklch(99%_0.004_300)] shadow-[0_4px_12px_oklch(45%_0.18_330_/_0.22)] after:absolute after:-inset-x-2 after:-inset-y-2 active:scale-95"><Pencil size={10}/><span>ویرایش پریود</span><Droplet size={10}/></button>
  </div>
 </div>;
};
