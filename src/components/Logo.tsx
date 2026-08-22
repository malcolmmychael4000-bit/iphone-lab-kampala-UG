import React from 'react';

interface LogoProps {
  isDarkMode?: boolean;
  className?: string;
  showTagline?: boolean;
  variant?: 'full' | 'emblem';
}

export const Logo: React.FC<LogoProps> = ({
  isDarkMode = true,
  className = 'h-10 sm:h-12',
  showTagline = false,
  variant = 'full',
}) => {
  const textColor = isDarkMode ? '#FFFFFF' : '#1B2E4B';
  const appleColor = isDarkMode ? '#FFFFFF' : '#1B2E4B';
  const centerBg = isDarkMode ? '#0A0E17' : '#FFFFFF';

  if (variant === 'emblem') {
    return (
      <div className={`inline-flex items-center select-none ${className}`} aria-label="iPhone Lab Logo">
        <svg
          viewBox="0 0 160 160"
          className="h-full w-auto max-h-full object-contain filter drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 3 Colored Orbital Dots */}
          <circle cx="118" cy="18" r="7.5" fill="#00A3C4" />
          <circle cx="144" cy="20" r="10" fill="#F0A500" />
          <circle cx="144" cy="52" r="12" fill="#D32F2F" />

          {/* Cyan Gear Body */}
          <path
            d="M 68 18 C 76 22, 82 30, 84 38 C 85 45, 81 54, 76 60 C 82 63, 89 67, 93 74 L 102 72 C 108 71, 114 76, 114 82 L 114 88 C 114 94, 109 100, 102 101 L 93 103 C 90 110, 85 116, 78 121 L 82 129 C 85 135, 83 142, 78 147 L 73 151 C 68 155, 61 155, 56 150 L 49 143 C 42 146, 35 147, 27 146 L 24 155 C 22 161, 16 165, 10 165 L 4 165 C -2 165, -8 161, -10 155 L -13 146 C -20 145, -27 142, -34 137 L -42 143 C -47 147, -54 146, -58 141 L -63 136 C -67 131, -67 124, -63 118 L -57 111 C -60 104, -62 97, -62 89 L -71 86 C -77 84, -81 78, -81 72 L -81 66 C -81 60, -77 54, -71 52 L -62 50 C -61 42, -58 35, -53 28 L -59 21 C -63 16, -62 9, -57 4 L -52 0 C -47 -4, -40 -4, -36 1 L -29 8 C -22 5, -15 3, -7 4 L -5 -5 C -3 -11, 3 -15, 9 -15 L 15 -15 C 21 -15, 27 -11, 29 -5 L 31 4 C 39 5, 46 8, 52 13 Z"
            fill="#00A3C4"
            transform="matrix(0.82 0 0 0.82 56 46)"
          />

          {/* Center Circle with Apple Logo */}
          <circle cx="68" cy="86" r="36" fill={centerBg} />

          {/* Apple Logo */}
          <g transform="translate(50, 66) scale(0.78)">
            <path
              d="M 27.5 7.5 C 29.5 5, 31 1.5, 30.5 -2 C 27.5 -1.8, 24 0.2, 22 2.5 C 20.2 4.6, 18.8 8.1, 19.3 11.5 C 22.5 11.7, 25.8 9.8, 27.5 7.5 Z"
              fill={appleColor}
            />
            <path
              d="M 30.2 13.5 C 27.5 13.3, 25 15, 23.5 15 C 22 15, 19.8 13.6, 17.5 13.6 C 13.2 13.6, 9.2 16.2, 7 20.3 C 2.5 28.5, 5.8 40.8, 10.2 47.3 C 12.3 50.4, 14.8 53.9, 18.2 53.7 C 21.4 53.6, 22.6 51.6, 26.5 51.6 C 30.3 51.6, 31.4 53.7, 34.8 53.7 C 38.3 53.6, 40.5 50.4, 42.6 47.3 C 45.1 43.7, 46.1 40.2, 46.3 39.9 C 46.1 39.8, 39.8 37.3, 39.7 30 C 39.6 23.8, 44.5 20.8, 44.8 20.6 C 41.9 16.3, 37.5 13.8, 30.2 13.5 Z"
              fill={appleColor}
            />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`} aria-label="iPhone Lab Logo">
      {/* Official Vector Logo Brandmark */}
      <svg
        viewBox="0 0 440 180"
        className="h-full w-auto max-h-full object-contain filter drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Typography: iPhone Lab */}
        <g fill={textColor} font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif">
          <text x="12" y="78" font-size="74" font-weight="700" letter-spacing="-1.5px">
            iPhone
          </text>
          <text x="142" y="152" font-size="74" font-weight="700" letter-spacing="-1.5px">
            Lab
          </text>
        </g>

        {/* Gear & Apple Icon with Orbital Dots */}
        <g transform="translate(290, 8)">
          {/* 3 Colored Orbital Dots */}
          <circle cx="98" cy="18" r="8.5" fill="#00A3C4" />
          <circle cx="128" cy="16" r="11" fill="#F0A500" />
          <circle cx="128" cy="48" r="14" fill="#D32F2F" />

          {/* Stylized Cyan Gear Body */}
          <path
            d="M 68 18 C 76 22, 82 30, 84 38 C 85 45, 81 54, 76 60 C 82 63, 89 67, 93 74 L 102 72 C 108 71, 114 76, 114 82 L 114 88 C 114 94, 109 100, 102 101 L 93 103 C 90 110, 85 116, 78 121 L 82 129 C 85 135, 83 142, 78 147 L 73 151 C 68 155, 61 155, 56 150 L 49 143 C 42 146, 35 147, 27 146 L 24 155 C 22 161, 16 165, 10 165 L 4 165 C -2 165, -8 161, -10 155 L -13 146 C -20 145, -27 142, -34 137 L -42 143 C -47 147, -54 146, -58 141 L -63 136 C -67 131, -67 124, -63 118 L -57 111 C -60 104, -62 97, -62 89 L -71 86 C -77 84, -81 78, -81 72 L -81 66 C -81 60, -77 54, -71 52 L -62 50 C -61 42, -58 35, -53 28 L -59 21 C -63 16, -62 9, -57 4 L -52 0 C -47 -4, -40 -4, -36 1 L -29 8 C -22 5, -15 3, -7 4 L -5 -5 C -3 -11, 3 -15, 9 -15 L 15 -15 C 21 -15, 27 -11, 29 -5 L 31 4 C 39 5, 46 8, 52 13 Z"
            fill="#00A3C4"
            transform="matrix(0.72 0 0 0.72 40 45)"
          />

          {/* Center Circle with Apple Logo */}
          <circle cx="50" cy="80" r="32" fill={centerBg} />

          {/* Apple Logo */}
          <g transform="translate(34, 62) scale(0.68)">
            <path
              d="M 27.5 7.5 C 29.5 5, 31 1.5, 30.5 -2 C 27.5 -1.8, 24 0.2, 22 2.5 C 20.2 4.6, 18.8 8.1, 19.3 11.5 C 22.5 11.7, 25.8 9.8, 27.5 7.5 Z"
              fill={appleColor}
            />
            <path
              d="M 30.2 13.5 C 27.5 13.3, 25 15, 23.5 15 C 22 15, 19.8 13.6, 17.5 13.6 C 13.2 13.6, 9.2 16.2, 7 20.3 C 2.5 28.5, 5.8 40.8, 10.2 47.3 C 12.3 50.4, 14.8 53.9, 18.2 53.7 C 21.4 53.6, 22.6 51.6, 26.5 51.6 C 30.3 51.6, 31.4 53.7, 34.8 53.7 C 38.3 53.6, 40.5 50.4, 42.6 47.3 C 45.1 43.7, 46.1 40.2, 46.3 39.9 C 46.1 39.8, 39.8 37.3, 39.7 30 C 39.6 23.8, 44.5 20.8, 44.8 20.6 C 41.9 16.3, 37.5 13.8, 30.2 13.5 Z"
              fill={appleColor}
            />
          </g>
        </g>
      </svg>

      {/* Optional Tagline for Wide Desktop Displays */}
      {showTagline && (
        <div className="hidden xl:flex items-center gap-3 pl-2 border-l border-slate-700/60 dark:border-white/10">
          <span className="text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-300 uppercase leading-none font-sans">
            WE FIX. WE CARE. WE CONNECT.
          </span>
        </div>
      )}
    </div>
  );
};
