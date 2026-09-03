import React, { useState, useRef, useEffect } from 'react';

interface TrueFocusProps {
  sentence: string;
  className?: string;
  glowColor?: string;
  borderColor?: string;
  animationDuration?: number;
}

export const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence,
  className = '',
  borderColor = '#0058bc',
  animationDuration = 0.3
}) => {
  const words = sentence.split(' ');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusStyle, setFocusStyle] = useState<{ left: number; top: number; width: number; height: number; opacity: number }>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0
  });

  useEffect(() => {
    if (hoveredIndex !== null && wordRefs.current[hoveredIndex]) {
      const el = wordRefs.current[hoveredIndex]!;
      setFocusStyle({
        left: el.offsetLeft - 4,
        top: el.offsetTop - 2,
        width: el.offsetWidth + 8,
        height: el.offsetHeight + 4,
        opacity: 1
      });
    } else {
      setFocusStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [hoveredIndex]);

  return (
    <span className={`relative inline-flex flex-wrap items-center gap-x-1.5 ${className}`}>
      {/* Gliding Focus Box */}
      <span
        className="pointer-events-none absolute rounded-lg border-2 transition-all ease-out z-0"
        style={{
          left: focusStyle.left,
          top: focusStyle.top,
          width: focusStyle.width,
          height: focusStyle.height,
          opacity: focusStyle.opacity,
          borderColor: borderColor,
          backgroundColor: 'rgba(0, 88, 188, 0.06)',
          boxShadow: '0 0 16px rgba(0, 88, 188, 0.25)',
          transitionDuration: `${animationDuration}s`
        }}
      />

      {words.map((word, i) => (
        <span
          key={i}
          ref={(el) => {
            wordRefs.current[i] = el;
          }}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={`relative z-10 cursor-pointer px-1 py-0.5 rounded transition-all duration-200 ${
            hoveredIndex !== null && hoveredIndex !== i
              ? 'opacity-65 blur-[0.4px]'
              : 'opacity-100 font-extrabold'
          }`}
        >
          {word}
        </span>
      ))}
    </span>
  );
};
