import React, { useState } from 'react';
import { motion } from 'motion/react';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  animationFrom?: { opacity: number; transform: string };
  animationTo?: { opacity: number; transform: string };
  easing?: string;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  onLetterAnimationComplete?: () => void;
  interactive?: boolean;
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 35,
  textAlign = 'left',
  onLetterAnimationComplete,
  interactive = true
}) => {
  const words = text.split(' ');

  return (
    <span
      className={`inline-block select-none ${className}`}
      style={{ textAlign, whiteSpace: 'normal', wordBreak: 'break-word' }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.split('').map((char, charIndex) => {
            const index = words
              .slice(0, wordIndex)
              .reduce((acc, w) => acc + w.length, 0) + charIndex;

            return (
              <motion.span
                key={charIndex}
                initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.45,
                  delay: (index * delay) / 1000,
                  ease: [0.2, 0.65, 0.3, 0.9]
                }}
                whileHover={
                  interactive
                    ? {
                        y: -5,
                        scale: 1.15,
                        color: '#0058bc',
                        transition: { duration: 0.18, ease: 'easeOut' }
                      }
                    : undefined
                }
                onAnimationComplete={
                  wordIndex === words.length - 1 && charIndex === word.length - 1
                    ? onLetterAnimationComplete
                    : undefined
                }
                className="inline-block transition-colors cursor-default"
              >
                {char}
              </motion.span>
            );
          })}
          {wordIndex < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  );
};
