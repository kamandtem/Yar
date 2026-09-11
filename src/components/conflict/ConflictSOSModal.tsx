import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert, ArrowLeft, Heart, CheckCircle2, PhoneCall, RefreshCw } from 'lucide-react';

interface ConflictSOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise?: (exerciseId: string) => void;
}

type EmotionType = 
  | 'خشم و عصبانیت' 
  | 'ناراحتی و دل‌شکستگی' 
  | 'ترس و وحشت' 
  | 'ناامیدی و دلسردی' 
  | 'شرم و خجالت' 
  | 'بی‌ارزشی و تحقیر' 
  | 'سردرگمی و گیجی' 
  | 'بی‌حسی و کرختی';

type NeedType = 
  | 'آرام شدن و تنفس' 
  | 'فاصله کوتاه و وقفه' 
  | 'صحبت کردن با لحن ملایم' 
  | 'شنیده شدن بدون قضاوت' 
  | 'درک شدن و در آغوش گرفته شدن' 
  | 'حل منطقی مسئله';

export const ConflictSOSModal: React.FC<ConflictSOSModalProps> = ({ isOpen, onClose, onSelectExercise }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [breathPhase, setBreathPhase] = useState<'دم' | 'نگه‌داشتن' | 'بازدم'>('دم');
  const [breathCounter, setBreathCounter] = useState(4);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);
  const [selectedNeed, setSelectedNeed] = useState<NeedType | null>(null);
  const [customWord, setCustomWord] = useState('');

  // 4-4-6 Breathing loop for Step 1
  useEffect(() => {
    if (!isOpen || step !== 1) return;
    const timer = setInterval(() => {
      setBreathCounter((prev) => {
        if (prev <= 1) {
          if (breathPhase === 'دم') {
            setBreathPhase('نگه‌داشتن');
            return 4;
          } else if (breathPhase === 'نگه‌داشتن') {
            setBreathPhase('بازدم');
            return 6;
          } else {
            setBreathPhase('دم');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, step, breathPhase]);

  if (!isOpen) return null;

  const EMOTIONS: EmotionType[] = [
    'خشم و عصبانیت',
    'ناراحتی و دل‌شکستگی',
    'ترس و وحشت',
    'ناامیدی و دلسردی',
    'شرم و خجالت',
    'بی‌ارزشی و تحقیر',
    'سردرگمی و گیجی',
    'بی‌حسی و کرختی'
  ];

  const NEEDS: NeedType[] = [
    'آرام شدن و تنفس',
    'فاصله کوتاه و وقفه',
    'صحبت کردن با لحن ملایم',
    'شنیده شدن بدون قضاوت',
    'درک شدن و در آغوش گرفته شدن',
    'حل منطقی مسئله'
  ];

  const handleReset = () => {
    setStep(1);
    setSelectedEmotion(null);
    setSelectedNeed(null);
    setBreathPhase('دم');
    setBreathCounter(4);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#FBF8F3] dark:bg-[#1A1E22] rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#EBE1D7] dark:border-neutral-800 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EBDED3] dark:border-neutral-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-[#FDE8E7] dark:bg-[#3D1E1E] text-[#C2413C]">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E2224] dark:text-[#F3F4F6]">
                الان دعوامون شده
              </h2>
              <span className="text-[11px] text-[#7A858C] dark:text-[#9CA3AF]">
                جریان فوری آرام‌سازی و پیشگیری از تخریب
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#7A858C] hover:bg-[#EFE7DC] dark:hover:bg-neutral-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Steps Progress Indicator */}
        <div className="flex items-center justify-between px-2 mb-5">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s
                    ? 'bg-[#C2413C] text-white shadow-xs'
                    : step > s
                    ? 'bg-[#4E6B58] text-white'
                    : 'bg-[#E5DCD1] dark:bg-neutral-800 text-[#7A858C]'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
              {s < 4 && (
                <div
                  className={`w-8 sm:w-12 h-0.5 rounded-full ${
                    step > s ? 'bg-[#4E6B58]' : 'bg-[#E5DCD1] dark:bg-neutral-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Physiological Pause & Breathing */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-2 flex flex-col items-center"
            >
              <span className="px-3 py-1 rounded-full bg-[#FFF1EB] dark:bg-[#3D251D] text-[#C2413C] dark:text-[#FCA5A5] text-xs font-bold mb-2">
                مرحله اول: اول مکث کنیم
              </span>
              <h3 className="text-lg font-bold text-[#1E2224] dark:text-[#F3F4F6] mb-1">
                سیستم عصبی‌ات را خنک کن
              </h3>
              <p className="text-xs text-[#6F7981] dark:text-[#9CA3AF] max-w-xs mb-6 leading-relaxed">
                وقتی ضربان قلب در بحث بالا می‌رود، مغز توان همدلی را موقتاً از دست می‌دهد. یک دقیقه تنفس همگام با دایره داشته باش.
              </p>

              {/* Animated Breathing Circle */}
              <div className="relative w-44 h-44 flex items-center justify-center mb-6">
                <motion.div
                  animate={{
                    scale: breathPhase === 'دم' ? 1.25 : breathPhase === 'نگه‌داشتن' ? 1.25 : 0.85
                  }}
                  transition={{
                    duration: breathPhase === 'دم' ? 4 : breathPhase === 'نگه‌داشتن' ? 4 : 6,
                    ease: 'easeInOut'
                  }}
                  className="absolute inset-0 rounded-full bg-linear-to-tr from-[#F8D8C8] to-[#E8F1EC] dark:from-[#3D251D] dark:to-[#1E3024] opacity-70"
                />
                <div className="relative z-10 flex flex-col items-center justify-center text-center">
                  <span className="text-base font-extrabold text-[#C2413C] dark:text-[#F87171]">
                    {breathPhase}
                  </span>
                  <span className="text-3xl font-black text-[#1E2224] dark:text-[#F3F4F6] my-0.5">
                    {breathCounter}
                  </span>
                  <span className="text-[10px] text-[#7A858C] dark:text-[#9CA3AF]">
                    ثانیه
                  </span>
                </div>
              </div>

              <div className="w-full bg-[#F3EBE1] dark:bg-neutral-800/60 p-3 rounded-2xl mb-6 text-right text-xs text-[#525B62] dark:text-[#CBD5E1] border border-[#E8DDCF] dark:border-neutral-700/60">
                💡 <span className="font-bold">قانون طلایی گاتمن:</span> اگر قلبت تند می‌زند، هر کلمه‌ای که بگویی به احتمال زیاد تدافعی یا تند خواهد بود. ابتدا بدن را آرام کن.
              </div>

              <button
                id="sos-next-1"
                onClick={() => setStep(2)}
                className="w-full py-3 px-6 rounded-2xl bg-[#C2413C] text-white font-bold text-sm hover:bg-[#B13732] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>احساسم را نام‌گذاری می‌کنم</span>
                <ArrowLeft size={16} />
              </button>
            </motion.div>
          )}

          {/* STEP 2: Name the primary emotion */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-2"
            >
              <div className="text-center mb-4">
                <span className="px-3 py-1 rounded-full bg-[#FFF1EB] dark:bg-[#3D251D] text-[#C2413C] dark:text-[#FCA5A5] text-xs font-bold">
                  مرحله دوم: احساس واقعی
                </span>
                <h3 className="text-lg font-bold text-[#1E2224] dark:text-[#F3F4F6] mt-1.5">
                  الان بیشتر چه حسی درون قلبت داری؟
                </h3>
                <p className="text-xs text-[#6F7981] dark:text-[#9CA3AF] mt-1">
                  زیر لایه خشم یا قهر، کدام حس پنهان شده است؟
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-6">
                {EMOTIONS.map((emotion) => {
                  const isSelected = selectedEmotion === emotion;
                  return (
                    <button
                      key={emotion}
                      onClick={() => setSelectedEmotion(emotion)}
                      className={`p-3 rounded-2xl text-right text-xs font-bold border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#C2413C] bg-[#FFF2F1] dark:bg-[#331C1A] text-[#C2413C] dark:text-[#FCA5A5] shadow-xs'
                          : 'border-[#E8DDCF] dark:border-neutral-800 bg-white dark:bg-neutral-800/60 text-[#4A5258] dark:text-[#D1D5DB] hover:bg-[#FAF5EE]'
                      }`}
                    >
                      <span>{emotion}</span>
                      {isSelected && <CheckCircle2 size={14} className="text-[#C2413C] dark:text-[#FCA5A5]" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={() => setStep(1)}
                  className="py-3 px-4 rounded-xl border border-[#D5CBC1] dark:border-neutral-700 text-[#555E65] dark:text-[#9CA3AF] text-xs font-medium"
                >
                  قبلی
                </button>
                <button
                  disabled={!selectedEmotion}
                  onClick={() => setStep(3)}
                  className={`flex-1 py-3 px-6 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    selectedEmotion
                      ? 'bg-[#C2413C] text-white hover:bg-[#B13732] shadow-sm'
                      : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <span>قدم بعد: نیازم چیست؟</span>
                  <ArrowLeft size={15} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Identify the underlying need */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-2"
            >
              <div className="text-center mb-4">
                <span className="px-3 py-1 rounded-full bg-[#EBF3ED] dark:bg-[#1E3024] text-[#4E6B58] dark:text-[#86EFAC] text-xs font-bold">
                  مرحله سوم: نیاز پنهان
                </span>
                <h3 className="text-lg font-bold text-[#1E2224] dark:text-[#F3F4F6] mt-1.5">
                  الان بیشتر به چه چیزی نیاز داری؟
                </h3>
                <p className="text-xs text-[#6F7981] dark:text-[#9CA3AF] mt-1">
                  چه کاری می‌تواند این تنش را به یک پیوند دوباره تبدیل کند؟
                </p>
              </div>

              <div className="space-y-2.5 mb-6">
                {NEEDS.map((need) => {
                  const isSelected = selectedNeed === need;
                  return (
                    <button
                      key={need}
                      onClick={() => setSelectedNeed(need)}
                      className={`w-full p-3.5 rounded-2xl text-right text-xs font-bold border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#4E6B58] bg-[#F2F7F4] dark:bg-[#1D2B22] text-[#4E6B58] dark:text-[#86EFAC] shadow-xs'
                          : 'border-[#E8DDCF] dark:border-neutral-800 bg-white dark:bg-neutral-800/60 text-[#4A5258] dark:text-[#D1D5DB] hover:bg-[#FAF5EE]'
                      }`}
                    >
                      <span>{need}</span>
                      {isSelected && <CheckCircle2 size={16} className="text-[#4E6B58] dark:text-[#86EFAC]" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={() => setStep(2)}
                  className="py-3 px-4 rounded-xl border border-[#D5CBC1] dark:border-neutral-700 text-[#555E65] dark:text-[#9CA3AF] text-xs font-medium"
                >
                  قبلی
                </button>
                <button
                  disabled={!selectedNeed}
                  onClick={() => setStep(4)}
                  className={`flex-1 py-3 px-6 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    selectedNeed
                      ? 'bg-[#C2413C] text-white hover:bg-[#B13732] shadow-sm'
                      : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <span>دیدن راهکار اختصاصی یار</span>
                  <ArrowLeft size={15} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Actionable De-escalation Plan */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-2"
            >
              <div className="text-center mb-4">
                <div className="inline-flex p-2 rounded-full bg-[#EBF3ED] dark:bg-[#1E3024] text-[#4E6B58] dark:text-[#86EFAC] mb-2">
                  <Heart size={20} />
                </div>
                <h3 className="text-lg font-extrabold text-[#1E2224] dark:text-[#F3F4F6]">
                  راهکار اختصاصی برای این لحظه
                </h3>
                <p className="text-xs text-[#7A858C] dark:text-[#9CA3AF] mt-0.5">
                  بر اساس حس <span className="text-[#C2413C] font-bold">«{selectedEmotion}»</span> و نیاز <span className="text-[#4E6B58] font-bold">«{selectedNeed}»</span>
                </p>
              </div>

              {/* Action Script Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-[#E8DDCF] dark:border-neutral-700 mb-4 shadow-xs">
                <span className="text-[11px] font-bold text-[#C2413C] dark:text-[#F87171] block mb-1">
                  🗣️ متنی که همین الان می‌توانید با آرامش بخوانید یا بفرستید:
                </span>
                <div className="p-3 rounded-xl bg-[#FAF5EE] dark:bg-neutral-900 border border-[#EBDED3] dark:border-neutral-800 text-xs font-semibold text-[#1E2224] dark:text-[#E5E7EB] leading-relaxed select-all">
                  {selectedNeed?.includes('فاصله') || selectedNeed?.includes('آرام شدن')
                    ? '«من این رابطه و تو رو دوست دارم و نمی‌خوام به هم حرف تندی بزنیم. الان ضربان قلبم بالاست و نیاز به ۲۰ دقیقه قدم زدن در سکوت دارم تا بعداً با آرامش حرف بزنیم.»'
                    : selectedNeed?.includes('شنیده شدن') || selectedNeed?.includes('درک شدن')
                    ? '«من در این لحظه احساس ناراحتی و تنهایی می‌کنم. چیزی که واقعاً بهش نیاز دارم اینه که چند دقیقه بدون قضاوت حرفم رو بشنوی و بدونم هوام رو داری.»'
                    : '«بیا برای نیم ساعت بحث رو متوقف کنیم، یک لیوان آب خنک بخوریم و وقتی هر دو آروم شدیم، فقط روی پیدا کردن یک راه‌حل مشترک تمرکز کنیم.»'}
                </div>
              </div>

              {/* Recommended Quick Exercise Link */}
              <div className="p-3.5 rounded-2xl bg-[#EFF4F8] dark:bg-[#1E2B38] border border-[#D3E0EA] dark:border-neutral-700/60 mb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#1E2224] dark:text-[#F3F4F6]">
                      تمرین پیشنهادی یار:
                    </h4>
                    <p className="text-[11px] text-[#55636E] dark:text-[#CBD5E1] mt-0.5">
                      توقف هوشمند هنگام داغ شدن بحث (Time-out)
                    </p>
                  </div>
                  {onSelectExercise && (
                    <button
                      onClick={() => {
                        onClose();
                        onSelectExercise('ex-2');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#3D5A80] text-white text-[11px] font-bold hover:bg-[#2F4563] transition-all"
                    >
                      شروع تمرین
                    </button>
                  )}
                </div>
              </div>

              {/* Clinical Safety & Crisis Alert */}
              <div className="p-3 rounded-2xl bg-[#FFF4F3] dark:bg-[#301B1B] border border-[#FADBD8] dark:border-[#5E2222] text-[11px] text-[#78281F] dark:text-[#FCA5A5] leading-relaxed mb-4">
                <div className="flex items-start gap-2">
                  <PhoneCall size={14} className="shrink-0 mt-0.5 text-[#C2413C]" />
                  <div>
                    <strong className="block font-bold">مرز بالینی و امنیت جانی:</strong>
                    اگر در این موقعیت هرگونه تهدید فیزیکی، تحقیر شدید، یا خطر آسیب وجود دارد، فوراً گفت‌وگو را متوقف کرده و به مکان امن بروید. (اورژانس اجتماعی: ۱۲۳ | مشاوره رایگان بهزیستی: ۱۴۸۰)
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={handleReset}
                  className="py-2.5 px-3.5 rounded-xl border border-[#D5CBC1] dark:border-neutral-700 text-[#555E65] dark:text-[#9CA3AF] text-xs font-medium flex items-center gap-1"
                >
                  <RefreshCw size={13} />
                  <span>شروع دوباره</span>
                </button>
                <button
                  id="sos-finish-btn"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-5 rounded-xl bg-[#C2413C] text-white font-bold text-xs hover:bg-[#B13732] transition-all shadow-sm text-center"
                >
                  متوجه شدم، به خانه بازگرد
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
