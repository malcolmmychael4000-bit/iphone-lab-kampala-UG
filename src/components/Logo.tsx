import React from 'react';
import { Smartphone, Wrench } from 'lucide-react';

interface LogoProps {
  isDarkMode?: boolean;
  className?: string;
  showTagline?: boolean;
  variant?: 'full' | 'emblem' | 'compact';
}

export const Logo: React.FC<LogoProps> = ({
  isDarkMode = true,
  className = '',
  showTagline = false,
  variant = 'full',
}) => {
  if (variant === 'emblem') {
    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`} aria-label="iPhone Lab UG Emblem">
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#1D9BB5] via-[#00A3C4] to-[#1F3864] p-0.5 shadow-lg shadow-[#1D9BB5]/25 flex items-center justify-center">
          <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${isDarkMode ? 'bg-[#0A0E17]' : 'bg-white'}`}>
            <div className="relative flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-[#1D9BB5]" />
              <Wrench className="w-3 h-3 text-[#D4A017] absolute -bottom-0.5 -right-1" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`} aria-label="iPhone Lab UG Logo">
      {/* Sleek Modern Emblem Icon */}
      <div className="relative shrink-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#1D9BB5] via-[#00A3C4] to-[#1F3864] p-0.5 shadow-lg shadow-[#1D9BB5]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
          <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${isDarkMode ? 'bg-[#0A0E17]' : 'bg-white'}`}>
            <div className="relative flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-[#1D9BB5]" />
              <Wrench className="w-3 h-3 text-[#D4A017] absolute -bottom-0.5 -right-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`text-xl sm:text-2xl font-black tracking-tight font-sans ${isDarkMode ? 'text-white' : 'text-[#1F3864]'}`}>
            iPhone
          </span>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1D9BB5] font-sans">
            Lab
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-black uppercase tracking-wider bg-[#1D9BB5]/15 text-[#1D9BB5] border border-[#1D9BB5]/30">
            UG
          </span>
        </div>

        {/* Optional Tagline or Sub-label */}
        {showTagline ? (
          <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-300 uppercase leading-none mt-1 font-sans">
            WE FIX. WE CARE. WE CONNECT.
          </span>
        ) : (
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 tracking-wide leading-none mt-1">
            Specialized iPhone Repairs &amp; Parts
          </span>
        )}
      </div>
    </div>
  );
};
