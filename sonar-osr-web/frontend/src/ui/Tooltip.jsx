import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { cn } from '../lib/cn';

export default function Tooltip({ text, children, className }) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className={cn('relative inline-flex items-center', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children || (
        <button
          type="button"
          aria-label={text}
          className="inline-flex items-center justify-center text-ink-muted hover:text-ink transition-colors"
        >
          <Info size={14} />
        </button>
      )}
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-56 px-3 py-2 rounded-control bg-ink text-card text-[11px] leading-snug shadow-pop pointer-events-none"
        >
          {text}
        </span>
      )}
    </span>
  );
}
