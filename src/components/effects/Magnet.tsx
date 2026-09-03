import React, { useState, useRef } from 'react';
import { soundEffects } from './SoundFeedback';

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeScale?: number;
  className?: string;
  onClick?: () => void;
  enableSound?: boolean;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 40,
  disabled = false,
  magnetStrength = 0.35,
  activeScale = 1.03,
  className = '',
  onClick,
  enableSound = true
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const magnetRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !magnetRef.current) return;

    const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distX = Math.abs(centerX - e.clientX);
    const distY = Math.abs(centerY - e.clientY);

    if (distX < width / 2 + padding && distY < height / 2 + padding) {
      const offsetX = (e.clientX - centerX) * magnetStrength;
      const offsetY = (e.clientY - centerY) * magnetStrength;
      setPosition({ x: offsetX, y: offsetY });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    setIsHovered(true);
    if (enableSound) soundEffects.playHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  const handleClick = () => {
    if (enableSound) soundEffects.playClick();
    if (onClick) onClick();
  };

  return (
    <div
      ref={magnetRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`inline-block transition-transform duration-200 ease-out select-none ${className}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isHovered ? activeScale : 1})`,
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
};
