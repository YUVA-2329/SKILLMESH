import React, { useRef, useEffect, useState, useMemo } from 'react';

interface VariableProximityProps {
  label: string;
  className?: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  containerRef?: React.RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
  minWeight?: number;
  maxWeight?: number;
  minScale?: number;
  maxScale?: number;
}

export const VariableProximity: React.FC<VariableProximityProps> = ({
  label,
  className = '',
  radius = 120,
  falloff = 'exponential',
  minWeight = 600,
  maxWeight = 900,
  minScale = 1.0,
  maxScale = 1.15
}) => {
  const container = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
      setMousePos(null);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('blur', handleMouseLeave);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('blur', handleMouseLeave);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const letters = useMemo(() => label.split(''), [label]);

  return (
    <span
      ref={container}
      className={`inline-flex flex-wrap items-center select-none font-display ${className}`}
    >
      {letters.map((char, index) => {
        let weight = minWeight;
        let scale = minScale;
        let translateY = 0;
        let colorActive = false;

        if (mousePos && letterRefs.current[index]) {
          const rect = letterRefs.current[index]!.getBoundingClientRect();
          const letterCenterX = rect.left + rect.width / 2;
          const letterCenterY = rect.top + rect.height / 2;
          const distance = Math.hypot(mousePos.x - letterCenterX, mousePos.y - letterCenterY);

          if (distance < radius) {
            let proximityFactor = (radius - distance) / radius;
            if (falloff === 'exponential') {
              proximityFactor = Math.pow(proximityFactor, 2);
            } else if (falloff === 'gaussian') {
              proximityFactor = Math.exp(-Math.pow(distance / (radius / 2.5), 2));
            }
            weight = Math.round(minWeight + (maxWeight - minWeight) * proximityFactor);
            scale = Number((minScale + (maxScale - minScale) * proximityFactor).toFixed(3));
            translateY = -(proximityFactor * 4);
            colorActive = proximityFactor > 0.4;
          }
        }

        return (
          <span
            key={index}
            ref={(el) => {
              letterRefs.current[index] = el;
            }}
            className="inline-block transition-transform duration-75 ease-out"
            style={{
              fontWeight: weight,
              transform: `scale(${scale}) translateY(${translateY}px)`,
              color: colorActive ? '#0058bc' : undefined,
              fontVariationSettings: `'wght' ${weight}`,
              willChange: 'transform, font-weight',
              display: char === ' ' ? 'inline' : 'inline-block'
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </span>
  );
};
