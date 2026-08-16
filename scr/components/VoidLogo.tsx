import React from 'react';

interface VoidLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  textColor?: string;
}

export const VoidLogo: React.FC<VoidLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textColor = '#0F172A',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'h-4',
    md: 'h-5',
    lg: 'h-6',
  };

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none notranslate ${className}`}
      translate="no"
      lang="en"
    >
      {/* Precision Vector Icon for VOID */}
      <div
        className={`${iconSizes[size]} shrink-0 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-0.5 shadow-md shadow-blue-500/20 flex items-center justify-center`}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer Prism / Geometric Shield */}
          <rect width="36" height="36" rx="9" fill="url(#void-bg-grad)" />
          
          {/* Stylized Modern Futuristic 'V' Icon Geometry */}
          <path
            d="M9 11L18 27L27 11H22.5L18 20L13.5 11H9Z"
            fill="white"
            fillOpacity="0.95"
          />
          <path
            d="M14 11L18 19.5L22 11H18.8L18 13.2L17.2 11H14Z"
            fill="url(#void-v-inner)"
          />
          <circle cx="18" cy="11.5" r="2" fill="#38BDF8" />
          
          {/* Subtle Glow Defs */}
          <defs>
            <linearGradient id="void-bg-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563EB" />
              <stop offset="0.5" stopColor="#4F46E5" />
              <stop offset="1" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id="void-v-inner" x1="14" y1="11" x2="22" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#93C5FD" />
              <stop offset="1" stopColor="#60A5FA" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Vectorized Brand Typography (Immune to browser auto-translation) */}
      {showText && (
        <div className="flex items-center" translate="no" lang="zxx">
          <svg
            viewBox="0 0 88 22"
            className={`${textSizes[size]} w-auto`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block' }}
          >
            {/* Vector Letter 'V' */}
            <path
              d="M3 3L11.5 19H14.5L23 3H18.5L13 14.5L7.5 3H3Z"
              fill={textColor}
            />
            {/* Vector Letter 'O' */}
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M35.5 3C29.7 3 25 7.7 25 13.5C25 19.3 29.7 24 35.5 24C41.3 24 46 19.3 46 13.5C46 7.7 41.3 3 35.5 3ZM35.5 7.5C38.8 7.5 41.5 10.2 41.5 13.5C41.5 16.8 38.8 19.5 35.5 19.5C32.2 19.5 29.5 16.8 29.5 13.5C29.5 10.2 32.2 7.5 35.5 7.5Z"
              transform="translate(0, -2.5)"
              fill={textColor}
            />
            {/* Vector Letter 'I' */}
            <path
              d="M50.5 3H55V19H50.5V3Z"
              fill={textColor}
            />
            {/* Vector Letter 'D' */}
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M63 3H72C78 3 82.5 7.2 82.5 13.5C82.5 19.8 78 24 72 24H63V3ZM67.5 7.5V19.5H71.5C75.2 19.5 78 17 78 13.5C78 10 75.2 7.5 71.5 7.5H67.5Z"
              transform="translate(0, -2.5)"
              fill={textColor}
            />
          </svg>
        </div>
      )}
    </div>
  );
};
