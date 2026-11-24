import React from 'react';
import { cn } from '../lib/cn';

const TONES = {
  neutral: 'bg-soft text-ink-2 border-line',
  primary: 'bg-primary-soft text-primary border-primary/20',
  good: 'bg-good-track text-good border-good/25',
  bad: 'bg-bad-track text-bad border-bad/25',
  warn: 'bg-warn-soft text-warn border-warn/25',
};

export default function Badge({ children, tone = 'neutral', className, title }) {
  return (
    <span
      title={title}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap',
        TONES[tone] || TONES.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}
