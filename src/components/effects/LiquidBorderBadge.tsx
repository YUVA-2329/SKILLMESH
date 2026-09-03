import React from 'react';

interface LiquidBorderBadgeProps {
  children: React.ReactNode;
  className?: string;
  badgeClassName?: string;
}

export const LiquidBorderBadge: React.FC<LiquidBorderBadgeProps> = ({
  children,
  className = '',
  badgeClassName = 'bg-white/90 text-[#0058bc]'
}) => {
  return (
    <div className={`inline-flex p-[1.5px] rounded-full liquid-border-container ${className}`}>
      <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm liquid-border-inner ${badgeClassName}`}>
        {children}
      </div>
    </div>
  );
};
