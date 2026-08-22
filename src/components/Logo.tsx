import React from 'react';

interface LogoProps {
  isDarkMode?: boolean;
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  isDarkMode = true,
  className = '',
  showTagline = false,
}) => {
  return (
    <div className={`inline-flex flex-col justify-center text-left select-none ${className}`} aria-label="iPhone Lab UG">
      <div className="flex items-baseline gap-1.5 leading-none">
        <span
          className={`text-xl sm:text-2xl font-black tracking-tight font-sans transition-colors ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}
        >
          iPhone Lab
        </span>
        <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1D9BB5] font-sans">
          UG
        </span>
      </div>

      {showTagline && (
        <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-300 uppercase leading-none mt-1 font-sans">
          WE FIX. WE CARE. WE CONNECT.
        </span>
      )}
    </div>
  );
};
