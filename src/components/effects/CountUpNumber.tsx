import React, { useEffect, useState } from 'react';

interface CountUpNumberProps {
  to: number;
  from?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export const CountUpNumber: React.FC<CountUpNumberProps> = ({
  to,
  from = 0,
  duration = 1.5,
  suffix = '',
  prefix = '',
  className = ''
}) => {
  const [current, setCurrent] = useState(from);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // Easing cubic out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(from + (to - from) * easeOut));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [to, from, duration]);

  return (
    <span className={`tabular-nums font-bold ${className}`}>
      {prefix}{current}{suffix}
    </span>
  );
};
