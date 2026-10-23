/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface WeatherIconProps {
  type: 'sun' | 'cloud' | 'rain' | 'storm';
  className?: string;
}

export function WeatherIcon({ type, className = 'w-11 h-11' }: WeatherIconProps) {
  if (type === 'sun') {
    // Screen 1: Golden glowing sun with rays
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-md">
          {/* Central sun disk */}
          <circle cx="32" cy="32" r="14" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" />
          <circle cx="32" cy="32" r="12" fill="#fde047" />
          {/* Radiating rays */}
          <g stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round">
            <line x1="32" y1="8" x2="32" y2="13" />
            <line x1="32" y1="51" x2="32" y2="56" />
            <line x1="8" y1="32" x2="13" y2="32" />
            <line x1="51" y1="32" x2="56" y2="32" />
            <line x1="15" y1="15" x2="19" y2="19" />
            <line x1="45" y1="45" x2="49" y2="49" />
            <line x1="15" y1="49" x2="19" y2="45" />
            <line x1="45" y1="19" x2="49" y2="15" />
          </g>
        </svg>
      </div>
    );
  }

  if (type === 'cloud') {
    // Screen 2: Sun behind cloud (Nublado)
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow">
          {/* Sun behind */}
          <circle cx="24" cy="24" r="11" fill="#f59e0b" />
          <circle cx="24" cy="24" r="9" fill="#fde047" />
          <g stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
            <line x1="24" y1="7" x2="24" y2="10" />
            <line x1="9" y1="24" x2="12" y2="24" />
            <line x1="12" y1="12" x2="15" y2="15" />
            <line x1="36" y1="12" x2="33" y2="15" />
          </g>
          {/* Front Cloud */}
          <path
            d="M48 42c4.4 0 8-3.6 8-8 0-4.1-3.1-7.4-7.1-7.9C47.8 20.9 42.8 16 36.8 16c-5.8 0-10.6 4.2-11.8 9.7C22 26.2 19.2 29.4 19.2 33.2c0 4.4 3.6 8 8 8h20.8z"
            fill="#ffffff"
            opacity="0.96"
          />
          <path
            d="M26 40h22c3.2 0 5.6-2.4 5.6-5.6 0-.6-.1-1.1-.3-1.6-1 3.7-4.3 6.4-8.2 6.4H27c-2.4 0-4.5-1.1-5.8-2.9.6 2.2 2.6 3.7 4.8 3.7z"
            fill="#cbd5e1"
          />
        </svg>
      </div>
    );
  }

  if (type === 'rain') {
    // Screen 3: Rain cloud with drops (Chuva leve)
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full drop-shadow">
          {/* Cloud Body */}
          <path
            d="M46 38c5.5 0 10-4.5 10-10 0-5.1-3.8-9.3-8.8-9.9C45.8 11.6 39.5 6 32 6c-7.2 0-13.3 5.2-14.7 12.1C13.5 19.3 10 23.3 10 28c0 5.5 4.5 10 10 10h26z"
            fill="#d2dce6"
            opacity="0.95"
          />
          <path
            d="M19 36h28c4 0 7-3 7-7 0-.7-.1-1.4-.3-2-1.3 4.6-5.4 8-10.2 8H20c-3 0-5.6-1.4-7.2-3.6.7 2.7 3.2 4.6 6.2 4.6z"
            fill="#9db0c4"
          />
          {/* Rain drops */}
          <g fill="#9fc7e8" opacity="0.95">
            <path d="M22 43c0 1.2-.9 2-2 2s-2-.8-2-2c0-.9 1.5-2.8 1.8-3.2.1-.1.3-.1.4 0 .3.4 1.8 2.3 1.8 3.2z" />
            <path d="M29 46c0 1.2-.9 2-2 2s-2-.8-2-2c0-.9 1.5-2.8 1.8-3.2.1-.1.3-.1.4 0 .3.4 1.8 2.3 1.8 3.2z" />
            <path d="M36 43c0 1.2-.9 2-2 2s-2-.8-2-2c0-.9 1.5-2.8 1.8-3.2.1-.1.3-.1.4 0 .3.4 1.8 2.3 1.8 3.2z" />
            <path d="M43 46c0 1.2-.9 2-2 2s-2-.8-2-2c0-.9 1.5-2.8 1.8-3.2.1-.1.3-.1.4 0 .3.4 1.8 2.3 1.8 3.2z" />
          </g>
        </svg>
      </div>
    );
  }

  // Screen 4: Storm cloud with thunder bolt (Tempestade)
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow">
        {/* Dark storm cloud */}
        <path
          d="M46 36c5.5 0 10-4.5 10-10 0-5.1-3.8-9.3-8.8-9.9C45.8 9.6 39.5 4 32 4c-7.2 0-13.3 5.2-14.7 12.1C13.5 17.3 10 21.3 10 26c0 5.5 4.5 10 10 10h26z"
          fill="#475569"
          opacity="0.95"
        />
        <path
          d="M19 34h28c4 0 7-3 7-7 0-.7-.1-1.4-.3-2-1.3 4.6-5.4 8-10.2 8H20c-3 0-5.6-1.4-7.2-3.6.7 2.7 3.2 4.6 6.2 4.6z"
          fill="#334155"
        />
        {/* Yellow Lightning Bolt */}
        <polygon
          points="31,34 26,45 32,45 28,56 40,43 33,43 37,34"
          fill="#facc15"
          stroke="#eab308"
          strokeWidth="0.8"
        />
        {/* Rain drops */}
        <g fill="#93c5fd" opacity="0.9">
          <path d="M20 44c0 1.2-.9 2-2 2s-2-.8-2-2c0-.9 1.5-2.8 1.8-3.2.1-.1.3-.1.4 0 .3.4 1.8 2.3 1.8 3.2z" />
          <path d="M44 45c0 1.2-.9 2-2 2s-2-.8-2-2c0-.9 1.5-2.8 1.8-3.2.1-.1.3-.1.4 0 .3.4 1.8 2.3 1.8 3.2z" />
        </g>
      </svg>
    </div>
  );
}
