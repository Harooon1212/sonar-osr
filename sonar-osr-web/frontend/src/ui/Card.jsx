import React from 'react';
import { cn } from '../lib/cn';

export function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'bg-card rounded-card border border-line shadow-card p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, right, className }) {
  return (
    <div className={cn('flex items-start justify-between gap-3 mb-4', className)}>
      <div>
        <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
        {subtitle && <p className="text-xs text-ink-muted mt-0.5">{subtitle}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
