import React, { useState } from 'react';
import logoImg from '../assets/images/logo.jpg';

interface LogoProps {
  isDarkMode?: boolean;
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  isDarkMode = true,
  className = '',
  showTagline = false,
  size = 'md',
}) => {
  const [imgError, setImgError] = useState(false);

  const heightClass = size === 'lg' ? 'h-12' : size === 'sm' ? 'h-8' : 'h-10 sm:h-11';

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`} aria-label="iPhone Lab UG">
      {!imgError ? (
        <div className="relative flex items-center">
          <img
            src={logoImg}
            onError={() => setImgError(true)}
            alt="iPhone Lab Logo"
            className={`${heightClass} w-auto object-contain rounded-lg shadow-sm`}
            loading="eager"
            decoding="async"
          />
          <span className="ml-1.5 text-xs font-black px-1.5 py-0.5 rounded bg-[#1D9BB5] text-white tracking-wider font-sans self-center shadow-sm">
            UG
          </span>
        </div>
      ) : (
        <div className="flex flex-col justify-center text-left">
          <div className="flex items-baseline gap-1.5 leading-none">
            <span
              className={`text-xl sm:text-2xl font-black tracking-tight font-sans transition-colors ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              iPhone Lab
            </span>
            <span className="text-xs sm:text-sm font-black px-1.5 py-0.5 rounded bg-[#1D9BB5] text-white tracking-wider font-sans">
              UG
            </span>
          </div>
          {showTagline && (
            <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-300 uppercase leading-none mt-1 font-sans">
              WE FIX. WE CARE. WE CONNECT.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
