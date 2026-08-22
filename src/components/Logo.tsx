import React from 'react';

interface LogoProps {
  isDarkMode?: boolean;
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  isDarkMode = false,
  className = 'h-10',
  showTagline = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Official Emblem Logo Image */}
      <img
        src={isDarkMode ? '/logo-dark.svg' : '/logo-light.svg'}
        alt="iPhone Lab UG"
        width="38"
        height="38"
        className="h-8 w-8 sm:h-9 sm:w-9 object-contain shrink-0 rounded-lg drop-shadow-sm"
        onError={(e) => {
          // If image fails, hide it gracefully
          (e.target as HTMLElement).style.display = 'none';
        }}
      />

      {/* Text-Based Branding */}
      <div className="flex items-center font-sans tracking-tight">
        <span
          className={`text-xl sm:text-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-[#1F3864]'
          }`}
        >
          iPhone
        </span>
        <span className="text-xl sm:text-2xl font-semibold text-[#1D9BB5] ml-1">
          Lab
        </span>
        <span className="ml-1.5 px-2 py-0.5 text-xs sm:text-xs font-black rounded-md bg-[#1D9BB5] text-white shadow-sm tracking-wider uppercase">
          UG
        </span>
      </div>

      {/* Tagline with vertical divider */}
      {showTagline && (
        <div className="hidden xl:flex items-center gap-3 text-slate-400 dark:text-slate-500">
          <span className="text-slate-300 dark:text-slate-700 font-light select-none text-sm">
            |
          </span>
          <span className="text-[11px] sm:text-xs font-bold tracking-widest text-slate-500 dark:text-slate-300 uppercase leading-none font-sans">
            WE FIX. WE CARE. WE CONNECT.
          </span>
        </div>
      )}
    </div>
  );
};



