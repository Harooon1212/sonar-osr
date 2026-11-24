import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { useCountUp } from '../../hooks/useCountUp';
import Tooltip from '../../ui/Tooltip';
import Sparkline from './Sparkline';
import { cardItem } from '../../lib/motion';

export default function KpiCard({
  title,
  numericValue,
  formatValue,
  displayValue,
  unit,
  info,
  sparkline,
  className,
}) {
  const animated = useCountUp(typeof numericValue === 'number' ? numericValue : null, 600);

  const renderedValue =
    displayValue !== undefined
      ? displayValue
      : animated !== null && formatValue
      ? formatValue(animated)
      : animated !== null
      ? Math.round(animated).toLocaleString('en-US')
      : '—';

  return (
    <motion.div
      variants={cardItem}
      className={cn(
        'bg-card rounded-card border border-line shadow-card p-6 flex flex-col justify-between min-h-[156px]',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[14px] font-medium text-ink-muted">{title}</span>
        {info && <Tooltip text={info} />}
      </div>

      <div className="mt-3">
        <div className="flex items-baseline gap-1 font-bold tracking-tight text-ink tabular-nums">
          <span className="text-[34px] xl:text-[38px] leading-none">{renderedValue}</span>
          {unit && (
            <span className="text-[18px] font-semibold text-ink-muted leading-none">
              {unit}
            </span>
          )}
        </div>
        {sparkline && sparkline.length > 1 && <Sparkline points={sparkline} />}
      </div>
    </motion.div>
  );
}
