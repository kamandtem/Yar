import React from 'react';

interface AppIconProps {
  className?: string;
  size?: number;
  rounded?: boolean;
}

export const AppIcon: React.FC<AppIconProps> = ({ className = '', size = 44, rounded = true }) => (
  <div
    className={`relative flex items-center justify-center overflow-hidden select-none ${rounded ? 'rounded-2xl shadow-sm' : ''} ${className}`}
    style={{ width: size, height: size }}
    aria-label="آیکون اپلیکیشن یار"
  >
    <img src="/app-icon.png" alt="" className="w-full h-full object-cover" draggable={false} />
  </div>
);
