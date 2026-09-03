import React from 'react';
import { motion } from 'motion/react';

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  onAnimationComplete?: () => void;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 50,
  className = '',
  animateBy = 'words',
  direction = 'top',
  onAnimationComplete
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');

  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-1.5 select-none ${className}`}>
      {elements.map((el, i) => (
        <motion.span
          key={i}
          initial={{
            filter: 'blur(10px)',
            opacity: 0,
            y: direction === 'top' ? -12 : 12
          }}
          animate={{
            filter: 'blur(0px)',
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.5,
            delay: (i * delay) / 1000,
            ease: [0.25, 1, 0.5, 1]
          }}
          whileHover={{
            scale: 1.06,
            y: -2,
            transition: { duration: 0.15 }
          }}
          onAnimationComplete={i === elements.length - 1 ? onAnimationComplete : undefined}
          className="inline-block transition-transform"
        >
          {el === ' ' ? '\u00A0' : el}
        </motion.span>
      ))}
    </span>
  );
};
