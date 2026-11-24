import React from 'react';
import { Card } from '../../ui/Card';
import { cn } from '../../lib/cn';

export default function Leaderboard({ title, rows = [] }) {
  return (
    <Card>
      <h3 className="text-[15px] font-semibold text-ink-muted mb-5">{title}</h3>
      <div className="flex flex-col gap-4">
        {rows.map((row, idx) => {
          const rank = row.rank ?? idx + 1;
          const up = row.trend !== 'down';
          return (
            <div key={row.id || row.name} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                {row.badgeText && (
                  <div className="w-10 h-10 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    {row.badgeText}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold text-ink truncate">
                    {row.name}
                  </div>
                  <div className="text-xs text-ink-muted truncate tabular-nums">
                    {row.subline}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 tabular-nums">
                <span className="text-sm font-bold text-ink">{rank}</span>
                <span
                  aria-label={up ? 'Trending up' : 'Trending down'}
                  className={cn(
                    'text-[10px] leading-none',
                    up ? 'text-good' : 'text-bad'
                  )}
                >
                  {up ? '▲' : '▼'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
