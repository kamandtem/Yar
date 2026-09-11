import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppIcon } from '../common/AppIcon';
import { RelationshipStage, PriorityTopic, UserPreferences } from '../../types';
import { ArrowLeft, Check, Sparkles, Heart, Users, Compass } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (prefs: Partial<UserPreferences>) => void;
}

const STAGES_LIST: { id: RelationshipStage; label: string; desc: string }[] = [
  { id: 'engaged', label: 'دوران نامزدی یا آشنایی', desc: 'در آستانه شروع زندگی مشترک' },
  { id: 'newlywed', label: 'تازه ازدواج کرده‌ایم', desc: 'ماه‌های ابتدایی زندگی زیر یک سقف' },
  { id: 'under_1_year', label: 'کمتر از ۱ سال', desc: 'در حال تطبیق با عادات و روال‌ها' },
  { id: '1_to_3_years', label: '۱ تا ۳ سال', desc: 'تثبیت پیوند و مواجهه با اولین چالش‌ها' },
  { id: 'over_3_years', label: 'بیشتر از ۳ سال', desc: 'تعمیق صمیمیت و احیای طراوت رابطه' },
  { id: 'solo', label: 'استفاده فردی', desc: 'می‌خواهم روی مهارت‌های عاطفی خودم کار کنم' }
];

const TOPICS_LIST: { id: PriorityTopic; label: string }[] = [
  { id: 'communication', label: 'ارتباط و گفت‌وگوی مؤثر' },
  { id: 'conflict', label: 'کاهش دعوا و تنش' },
  { id: 'intimacy', label: 'صمیمیت عاطفی' },
  { id: 'trust', label: 'اعتماد و امنیت' },
  { id: 'self_awareness', label: 'خودشناسی و الگوها' },
  { id: 'trauma', label: 'تروما و تجربه‌های گذشته' },
  { id: 'sexuality', label: 'رابطه جنسی سالم' },
  { id: 'family', label: 'مرزبندی با خانواده‌ها' },
  { id: 'finances', label: 'مسائل مالی و آینده' },
  { id: 'parenting', label: 'فرزندآوری و فرزندپروری' }
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [stage, setStage] = useState<RelationshipStage | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<PriorityTopic[]>([]);
  const [userName, setUserName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [anniversaryDate, setAnniversaryDate] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setStep(1);
    setStage(null);
    setSelectedTopics([]);
    setUserName('');
    setPartnerName('');
    setAnniversaryDate('');
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleTopic = (topic: PriorityTopic) => {
    if (selectedTopics.includes(topic)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter((t) => t !== topic));
      }
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleFinish = () => {
    if (!stage || selectedTopics.length === 0) return;
    onComplete({
      hasCompletedOnboarding: true,
      relationshipStage: stage,
      priorityTopics: selectedTopics,
      userName: userName.trim() || undefined,
      partnerName: stage === 'solo' ? undefined : partnerName.trim() || undefined,
      anniversaryDate: stage === 'solo' ? undefined : anniversaryDate.trim() || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#FBF8F3] dark:bg-[#1A1E22] rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#EBE1D7] dark:border-neutral-800 max-h-[90vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Slide 1: Welcome */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-center py-5 flex flex-col items-center"
            >
              <AppIcon size={84} rounded={true} className="mb-6 shadow-md" />
              <h1 className="text-3xl font-extrabold text-[#1E2224] dark:text-[#F3F4F6] mb-2">
                یار
              </h1>
              <p className="text-base text-[#707B84] dark:text-[#9CA3AF] font-medium max-w-xs mb-8">
                یک همراه علمی و محترمانه برای رابطه‌ای آگاهانه‌تر و ماندگار
              </p>

              <div className="w-full bg-[#F3EBE1] dark:bg-neutral-800/60 p-4 rounded-2xl mb-8 text-right border border-[#E8DDCF] dark:border-neutral-700/60">
                <p className="text-xs text-[#525B62] dark:text-[#CBD5E1] leading-relaxed">
                  «یار قرار نیست به تو یاد بدهد چطور همسرت را تغییر بدهی؛ کمک می‌کند خودت، رابطه‌ات و آدم روبه‌رویت را بهتر بفهمی.»
                </p>
              </div>

              <button
                id="onboarding-next-1"
                onClick={() => setStep(2)}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#C2413C] text-white font-semibold text-sm hover:bg-[#B13732] active:scale-98 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>شروع آشنایی</span>
                <ArrowLeft size={16} />
              </button>
            </motion.div>
          )}

          {/* Slide 2: Three core pillars */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="py-3"
            >
              <div className="text-center mb-6">
                <span className="text-xs font-semibold text-[#C2413C] dark:text-[#F87171] uppercase tracking-wider">
                  سه اصل ساده یار
                </span>
                <h2 className="text-xl font-bold text-[#1E2224] dark:text-[#F3F4F6] mt-1">
                  چگونه پیش می‌رویم؟
                </h2>
              </div>

              <div className="space-y-3.5 mb-8">
                <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800/80 border border-[#EBE1D7] dark:border-neutral-700/60 flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-[#FFF1EB] dark:bg-[#3D251D] text-[#C2413C] dark:text-[#F87171] shrink-0 mt-0.5">
                    <Heart size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1E2224] dark:text-[#F3F4F6]">
                      ۱. خودت را بهتر بشناس
                    </h3>
                    <p className="text-xs text-[#6F7981] dark:text-[#9CA3AF] mt-1 leading-relaxed">
                      شناخت الگوهای دلبستگی، محرک‌های عصبی (Triggers) و زخم‌هایی که ناخواسته به امروز می‌آوریم.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800/80 border border-[#EBE1D7] dark:border-neutral-700/60 flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-[#EBF3ED] dark:bg-[#1E3024] text-[#4E6B58] dark:text-[#86EFAC] shrink-0 mt-0.5">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1E2224] dark:text-[#F3F4F6]">
                      ۲. همدیگر را عمیق‌تر بفهمید
                    </h3>
                    <p className="text-xs text-[#6F7981] dark:text-[#9CA3AF] mt-1 leading-relaxed">
                      رمزگشایی نیازهای زیرینِ خشم و سکوت، بدون پیش‌داوری و با لنز دو دیدگاه متفاوت.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800/80 border border-[#EBE1D7] dark:border-neutral-700/60 flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-[#EFF4F8] dark:bg-[#1E2B38] text-[#3D5A80] dark:text-[#93C5FD] shrink-0 mt-0.5">
                    <Compass size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1E2224] dark:text-[#F3F4F6]">
                      ۳. هر روز یک قدم ۵ دقیقه‌ای
                    </h3>
                    <p className="text-xs text-[#6F7981] dark:text-[#9CA3AF] mt-1 leading-relaxed">
                      بدون نیاز به ساعت‌ها وقت؛ تمرین‌های کوتاه روزانه برای ساختن بانک پس‌انداز عاطفی.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="py-3 px-4 rounded-xl border border-[#D5CBC1] dark:border-neutral-700 text-[#555E65] dark:text-[#9CA3AF] text-sm font-medium"
                >
                  بازگشت
                </button>
                <button
                  id="onboarding-next-2"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 px-6 rounded-xl bg-[#C2413C] text-white font-semibold text-sm hover:bg-[#B13732] transition-all flex items-center justify-center gap-2"
                >
                  <span>شخصی‌سازی مسیر من</span>
                  <ArrowLeft size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Slide 3: Relationship Stage */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="py-3"
            >
              <div className="text-center mb-5">
                <span className="text-xs font-semibold text-[#4E6B58] dark:text-[#86EFAC]">
                  قدم اول
                </span>
                <h2 className="text-lg font-bold text-[#1E2224] dark:text-[#F3F4F6] mt-0.5">
                  رابطه شما در چه مرحله‌ای است؟
                </h2>
                <p className="text-xs text-[#7A858C] dark:text-[#9CA3AF] mt-1">
                  محتوا متناسب با نیازهای همین مرحله چیده می‌شود.
                </p>
              </div>

              <div className="space-y-2.5 mb-7">
                {STAGES_LIST.map((item) => {
                  const isSelected = stage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setStage(item.id)}
                      className={`w-full p-3.5 rounded-2xl text-right border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#C2413C] bg-[#FFF4F3] dark:bg-[#2D1A18] text-[#1E2224] dark:text-[#F3F4F6]'
                          : 'border-[#E8DDCF] dark:border-neutral-800 bg-white dark:bg-neutral-800/60 hover:bg-[#FAF5EE] dark:hover:bg-neutral-800'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[11px] text-[#7A858C] dark:text-[#9CA3AF] mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[#C2413C] bg-[#C2413C] text-white'
                            : 'border-[#C7BDAD] dark:border-neutral-600'
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="py-3 px-4 rounded-xl border border-[#D5CBC1] dark:border-neutral-700 text-[#555E65] dark:text-[#9CA3AF] text-sm font-medium"
                >
                  قبلی
                </button>
                <button
                  id="onboarding-next-3"
                  onClick={() => setStep(4)}
                  className="flex-1 py-3 px-6 rounded-xl bg-[#C2413C] text-white font-semibold text-sm hover:bg-[#B13732] transition-all flex items-center justify-center gap-2"
                >
                  <span>ادامه</span>
                  <ArrowLeft size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Slide 4: Priority Topics */}
          {step === 5 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="py-3"
            >
              <div className="text-center mb-5">
                <span className="text-xs font-semibold text-[#D97D7A]">
                  قدم دوم
                </span>
                <h2 className="text-lg font-bold text-[#1E2224] dark:text-[#F3F4F6] mt-0.5">
                  دوست داری بیشتر روی چه چیزی کار کنی؟
                </h2>
                <p className="text-xs text-[#7A858C] dark:text-[#9CA3AF] mt-1">
                  می‌توانی چند گزینه را انتخاب کنی (حداقل ۱ مورد).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-7">
                {TOPICS_LIST.map((topic) => {
                  const isSelected = selectedTopics.includes(topic.id);
                  return (
                    <button
                      key={topic.id}
                      onClick={() => toggleTopic(topic.id)}
                      className={`p-3 rounded-xl text-right text-xs font-semibold border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#C2413C] bg-[#FFF2F1] dark:bg-[#331C1A] text-[#C2413C] dark:text-[#FCA5A5]'
                          : 'border-[#E8DDCF] dark:border-neutral-800 bg-white dark:bg-neutral-800/60 text-[#4E565D] dark:text-[#D1D5DB] hover:bg-[#FAF5EE]'
                      }`}
                    >
                      <span className="leading-snug">{topic.label}</span>
                      {isSelected && <Check size={13} className="shrink-0 text-[#C2413C] dark:text-[#FCA5A5]" />}
                    </button>
                  );
                })}
              </div>

              {/* Optional Partner and User Name */}
              <div className="mb-6 p-3.5 rounded-2xl bg-[#F6EEE4] dark:bg-neutral-800/60 border border-[#E8DDCF] dark:border-neutral-700/60">
                <label className="block text-[11px] font-bold text-[#555E65] dark:text-[#CBD5E1] mb-1.5">
                  نام اختیاری شما و شریکتان (برای متن‌های شخصی‌تر):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="نام شما"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-[#D5CBC1] dark:border-neutral-700 focus:outline-none focus:border-[#C2413C]"
                  />
                  {stage !== 'solo' && (
                    <input
                      type="text"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="نام همراه شما"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-[#D5CBC1] dark:border-neutral-700 focus:outline-none focus:border-[#C2413C]"
                    />
                  )}
                </div>
                {stage !== 'solo' && (
                  <input
                    type="text"
                    value={anniversaryDate}
                    onChange={(e) => setAnniversaryDate(e.target.value)}
                    placeholder="تاریخ آشنایی یا سالگرد (اختیاری)"
                    className="w-full mt-2 px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-[#D5CBC1] dark:border-neutral-700 focus:outline-none focus:border-[#C2413C]"
                  />
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="py-3 px-4 rounded-xl border border-[#D5CBC1] dark:border-neutral-700 text-[#555E65] dark:text-[#9CA3AF] text-sm font-medium"
                >
                  قبلی
                </button>
                <button
                  id="onboarding-next-4"
                  onClick={() => selectedTopics.length > 0 && setStep(5)}
                  disabled={selectedTopics.length === 0}
                  className="flex-1 py-3 px-6 rounded-xl bg-[#C2413C] disabled:bg-[#C9BDB5] disabled:cursor-not-allowed text-white font-semibold text-sm hover:bg-[#B13732] transition-all flex items-center justify-center gap-2"
                >
                  <span>تأیید و ساخت مسیر</span>
                  <Sparkles size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Slide 5: Ready Message */}
          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#EBF3ED] dark:bg-[#1E3024] flex items-center justify-center text-[#4E6B58] dark:text-[#86EFAC] mb-4">
                <Sparkles size={32} />
              </div>

              <h2 className="text-2xl font-black text-[#1E2224] dark:text-[#F3F4F6] mb-2">
                مسیر اولیه یار برای تو آماده شد
              </h2>
              <p className="text-xs text-[#6B757C] dark:text-[#9CA3AF] leading-relaxed max-w-xs mb-8">
                هر روز با یک پیشنهاد کوتاه، یک تمرین ساده یا یک سؤال دونفره همراهت هستیم. آرام و بدون شتاب، با هم پیش می‌رویم.
              </p>

              <button
                id="onboarding-finish-btn"
                onClick={handleFinish}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#C2413C] text-white font-bold text-sm hover:bg-[#B13732] transition-all shadow-lg active:scale-98"
              >
                ورود به خانه یار
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
