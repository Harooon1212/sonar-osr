import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { Card } from '../../ui/Card';
import { cn } from '../../lib/cn';

export default function RankedList({ title, items = [], tone = 'weak' }) {
  const isStrong = tone === 'strong';

  return (
    <Card>
      <h3 className="text-[15px] font-semibold text-ink-muted mb-5">{title}</h3>
      <div className="flex flex-col gap-5">
        {items.map((item) => {
          const pct = Math.max(0, Math.min(100, Number(item.value ?? 0)));
          return (
            <div key={item.id || item.name} className="flex items-center gap-4">
              {item.thumb ? (
                <img
                  src={item.thumb}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  className="w-14 h-10 rounded-xl object-cover bg-[#0B1120] border border-line shrink-0"
                />
              ) : (
                <div
                  className="w-14 h-10 rounded-xl bg-soft border border-line flex items-center justify-center text-ink-muted shrink-0"
                  title="No sample thumbnail available"
                >
                  <HelpCircle size={16} />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[14px] font-semibold text-ink truncate">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex-1 h-2.5 rounded-full overflow-hidden',
                      isStrong ? 'bg-good-track' : 'bg-bad-track'
                    )}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full"
                      style={{
                        background: isStrong ? 'var(--good-grad)' : 'var(--bad-grad)',
                      }}
                    />
                  </div>
                  <div className="text-xs whitespace-nowrap tabular-nums shrink-0">
                    <span className="font-semibold text-ink">{Math.round(pct)}%</span>{' '}
                    <span className="text-ink-muted">detected</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
