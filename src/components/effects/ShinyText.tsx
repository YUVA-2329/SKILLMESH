import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  shimmerColor?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 4,
  className = '',
  shimmerColor = 'rgba(255, 255, 255, 0.95)'
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block font-inherit relative bg-clip-text text-transparent bg-gradient-to-r from-[#1b1b1d] via-[#0058bc] to-[#1b1b1d] ${
        disabled ? '' : 'animate-shine'
      } ${className}`}
      style={{
        backgroundImage: `linear-gradient(120deg, rgba(27, 27, 29, 0.9) 0%, rgba(27, 27, 29, 0.9) 40%, ${shimmerColor} 50%, rgba(27, 27, 29, 0.9) 60%, rgba(27, 27, 29, 0.9) 100%)`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        animationDuration: animationDuration
      }}
    >
      {text}
    </span>
  );
};
