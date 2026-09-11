import React from 'react';
import { User } from 'lucide-react';

/**
 * Profile tab قدیمی — اینجا برای عدم شکستنِ کد موجود.
 * تمام کارکردهای تنطیمات به SettingsTab منتقل شدند.
 */
export const ProfileTab: React.FC = () => {
  return (
    <div className="pt-8 px-4 text-center">
      <User className="mx-auto mb-3 text-slate-400" size={40} />
      <p className="text-sm text-slate-500 dark:text-slate-400">پروفایل</p>
    </div>
  );
};
