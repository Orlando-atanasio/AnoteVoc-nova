/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SidebarToggleIconProps {
  className?: string;
}

export function SidebarToggleIcon({ className = 'w-5 h-5' }: SidebarToggleIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Outer rounded rectangle */}
      <rect x="3.2" y="3.5" width="17.6" height="17" rx="3.5" />
      {/* Vertical sidebar dividing line */}
      <line x1="9" y1="3.5" x2="9" y2="20.5" />
      {/* Three items in the sidebar panel */}
      <line x1="5.5" y1="8" x2="6.8" y2="8" strokeWidth="2" strokeLinecap="round" />
      <line x1="5.5" y1="12" x2="6.8" y2="12" strokeWidth="2" strokeLinecap="round" />
      <line x1="5.5" y1="16" x2="6.8" y2="16" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
