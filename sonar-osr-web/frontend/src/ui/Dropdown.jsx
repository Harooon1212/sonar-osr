import React, { useState, useRef, useEffect, useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/cn';
import { dropdownMotion } from '../lib/motion';

export default function Dropdown({ label, value, options = [], onChange, className }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => {
          let next = (prev + 1) % options.length;
          while (options[next]?.disabled && next !== prev) {
            next = (next + 1) % options.length;
          }
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => {
          let next = (prev - 1 + options.length) % options.length;
          while (options[next]?.disabled && next !== prev) {
            next = (next - 1 + options.length) % options.length;
          }
          return next;
        });
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        const opt = options[activeIndex];
        if (opt && !opt.disabled) {
          onChange(opt.value);
          setOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, activeIndex, options, onChange]);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          setOpen((v) => !v);
          setActiveIndex(options.findIndex((o) => o.value === value));
        }}
        className={cn(
          'w-full h-14 px-5 rounded-pill bg-card border border-line shadow-card flex items-center justify-between gap-3 text-left transition-all duration-150 hover:border-line-strong',
          open && 'ring-2 ring-primary/15 border-primary/40'
        )}
      >
        <span className="text-[14px] text-ink-muted truncate">
          {label}:{' '}
          <strong className="font-semibold text-ink">{selected?.label ?? 'All'}</strong>
        </span>
        <ChevronDown
          size={16}
          className={cn(
            'text-ink-2 shrink-0 transition-transform duration-150',
            open && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={listId}
            role="listbox"
            aria-label={label}
            {...dropdownMotion}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 rounded-pill bg-card border border-line shadow-pop p-2.5 overflow-hidden"
          >
            <div className="border-b border-line pb-2 mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
              Select {label}
            </div>
            <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
              {options.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isFocused = idx === activeIndex;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    title={opt.disabled ? opt.disabledReason || 'No data exported yet' : undefined}
                    onClick={() => {
                      if (opt.disabled) return;
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={cn(
                      'w-full px-3.5 py-2.5 rounded-control text-left text-[14px] flex items-center justify-between transition-colors',
                      isSelected
                        ? 'bg-primary-soft text-ink font-semibold'
                        : isFocused
                        ? 'bg-hover text-ink'
                        : 'text-ink-2 hover:bg-hover',
                      opt.disabled && 'opacity-45 cursor-not-allowed hover:bg-transparent'
                    )}
                  >
                    <span>{opt.label}</span>
                    {opt.disabled && (
                      <span className="text-[11px] text-ink-faint">No data exported yet</span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
