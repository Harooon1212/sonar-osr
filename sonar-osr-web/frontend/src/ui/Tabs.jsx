import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';

export default function Tabs({ tabs = [], value, onChange, layoutId = 'tabs-pill', className }) {
  const handleKeyDown = (e, idx) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = tabs[(idx + 1) % tabs.length];
      if (next) onChange(next.id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
      if (prev) onChange(prev.id);
    }
  };

  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-pill bg-soft border border-line',
        className
      )}
    >
      {tabs.map((tab, idx) => {
        const active = tab.id === value;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={cn(
              'relative px-4 py-2 rounded-full text-xs sm:text-[13px] font-medium transition-colors inline-flex items-center gap-2',
              active ? 'text-primary font-semibold' : 'text-ink-2 hover:text-ink'
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="absolute inset-0 rounded-full bg-card shadow-card border border-line"
                aria-hidden="true"
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              {Icon && <Icon size={14} />}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
