import React, { useState, useEffect, useRef } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  className?: string;
  parentClassName?: string;
  animateOn?: 'hover' | 'view' | 'both';
  revealDirection?: 'start' | 'end' | 'center';
  characters?: string;
}

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 40,
  maxIterations = 10,
  className = '',
  parentClassName = '',
  animateOn = 'both',
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><,./-='
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [hasAnimatedOnce, setHasAnimatedOnce] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const startAnimation = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(() =>
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1 / (maxIterations / 10);
    }, speed);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    if ((animateOn === 'view' || animateOn === 'both') && !hasAnimatedOnce) {
      setHasAnimatedOnce(true);
      const cleanup = startAnimation();
      return cleanup;
    }
  }, [text, animateOn]);

  const handleMouseEnter = () => {
    if (animateOn === 'hover' || animateOn === 'both') {
      setIsHovering(true);
      startAnimation();
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <span
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`inline-block font-mono select-none ${parentClassName}`}
    >
      <span className={className}>{displayText}</span>
    </span>
  );
};
