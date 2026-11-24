import React, { useState, useRef, useEffect, useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Search, X } from 'lucide-react';
import { cn } from '../lib/cn';
import { dropdownMotion } from '../lib/motion';

export default function MultiSelect({
  label = 'Methods',
  selectedIds = [],
  items = [],
  groups = [],
  onChange,
  onClear,
  className,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const summaryText =
    selectedIds.length === 0
      ? 'None'
      : selectedIds.length === items.length
      ? 'All'
      : selectedIds.length === 1
      ? items.find((i) => i.id === selectedIds[0])?.label || selectedIds[0]
      : 'Multiple Selected';

  const q = query.trim().toLowerCase();
  const filteredItems = items.filter(
    (item) =>
      !q ||
      item.label.toLowerCase().includes(q) ||
      (item.group && item.group.toLowerCase().includes(q))
  );
  const filteredGroups = groups.filter(
    (g) => !q || g.label.toLowerCase().includes(q)
  );

  const toggleItem = (id) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const toggleGroup = (group) => {
    const allIn = group.memberIds.every((id) => selectedIds.includes(id));
    if (allIn) {
      onChange(selectedIds.filter((id) => !group.memberIds.includes(id)));
    } else {
      const merged = Array.from(new Set([...selectedIds, ...group.memberIds]));
      onChange(merged);
    }
  };

  const handleChipKeyDown = (e) => {
    if (e.key === 'Backspace' && !query && selectedIds.length > 0) {
      onChange(selectedIds.slice(0, -1));
    }
  };

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <div
        className={cn(
          'w-full h-14 px-5 rounded-pill bg-card border border-line shadow-card flex items-center justify-between gap-2 transition-all duration-150 hover:border-line-strong',
          open && 'ring-2 ring-primary/15 border-primary/40'
        )}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex-1 min-w-0 h-full flex items-center justify-between gap-2 text-left"
        >
          <span className="text-[14px] text-ink-muted truncate">
            {label}: <strong className="font-semibold text-ink">{summaryText}</strong>
          </span>
          {!open && <ChevronDown size={16} className="text-ink-2 shrink-0" />}
        </button>

        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear ? onClear() : onChange([]);
            }}
            className="text-xs font-medium text-ink-muted hover:text-primary px-1.5 py-1 rounded transition-colors shrink-0"
          >
            Clear
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            role="dialog"
            aria-label={`${label} filter`}
            {...dropdownMotion}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-pill bg-card border border-line shadow-pop p-4"
          >
            {/* Selected Chips */}
            {selectedIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {selectedIds.map((id) => {
                  const item = items.find((i) => i.id === id);
                  return (
                    <motion.span
                      layout
                      key={id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-soft text-ink text-xs font-medium border border-line"
                    >
                      <span>{item?.shortLabel || item?.label || id}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${item?.label || id}`}
                        onClick={() => toggleItem(id)}
                        className="text-ink-muted hover:text-ink"
                      >
                        <X size={12} />
                      </button>
                    </motion.span>
                  );
                })}
              </div>
            )}

            {/* Search Input */}
            <div className="relative pb-2.5 mb-3 border-b border-line">
              <Search size={15} className="absolute left-2 top-2 text-ink-faint pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleChipKeyDown}
                placeholder="Search"
                aria-label="Search methods or paradigms"
                className="w-full pl-8 pr-2 py-1 text-sm bg-transparent text-ink placeholder:text-ink-faint focus:outline-none"
              />
            </div>

            {/* Groups Section */}
            {filteredGroups.length > 0 && (
              <div className="mb-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted mb-1.5 px-1">
                  Paradigms
                </div>
                <div className="flex flex-col gap-0.5">
                  {filteredGroups.map((group) => {
                    const active = group.memberIds.every((id) => selectedIds.includes(id));
                    return (
                      <button
                        key={group.id}
                        type="button"
                        onClick={() => toggleGroup(group)}
                        className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-control text-left text-sm hover:bg-hover transition-colors"
                      >
                        <span
                          className={cn(
                            'w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors',
                            active ? 'border-primary bg-primary' : 'border-line-strong bg-card'
                          )}
                        >
                          {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        <span className="text-ink font-medium">{group.label}</span>
                        <span className="text-xs text-ink-muted ml-0.5">{group.count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Items Section */}
            <div className="pt-2 border-t border-line">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted mb-1.5 px-1">
                Methods
              </div>
              <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto">
                {filteredItems.map((item) => {
                  const active = selectedIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-control text-left text-sm hover:bg-hover transition-colors"
                    >
                      <span
                        className={cn(
                          'w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors',
                          active ? 'border-primary bg-primary' : 'border-line-strong bg-card'
                        )}
                      >
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      <span className="text-ink">{item.label}</span>
                    </button>
                  );
                })}
                {filteredItems.length === 0 && (
                  <div className="text-xs text-ink-muted px-2 py-2">No matching methods</div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
