import React from 'react';
import { useEngine } from '../store/useEngine';
import { cn } from '../lib/cn';

export default function EngineStatus({ compact = false }) {
  const { status, device, modelLoaded } = useEngine();

  const dotClass =
    status === 'online'
      ? 'bg-good shadow-[0_0_8px_rgba(22,199,132,0.55)]'
      : status === 'checking'
      ? 'bg-warn animate-pulse'
      : 'bg-bad';

  const label =
    status === 'online'
      ? `Engine online · ${device ? device.toUpperCase() : 'CPU'}`
      : status === 'checking'
      ? 'Checking engine…'
      : 'Engine offline — static data only';

  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-soft border border-line text-xs font-medium text-ink-2"
        title={modelLoaded ? 'PyTorch weights loaded' : 'Calibrated demonstration or offline'}
      >
        <span className={cn('w-2 h-2 rounded-full shrink-0', dotClass)} aria-hidden="true" />
        <span>{label}</span>
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-ink-muted mt-1">
      <span className={cn('w-2 h-2 rounded-full shrink-0', dotClass)} aria-hidden="true" />
      <span className="truncate" title={label}>
        {label}
      </span>
    </div>
  );
}
