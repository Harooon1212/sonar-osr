import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorBanner({ title = 'Request failed', message, onRetry }) {
  return (
    <div
      role="alert"
      className="rounded-control bg-bad-soft border border-bad/25 px-4 py-3.5 flex items-center justify-between gap-4"
    >
      <div className="flex items-start gap-3">
        <AlertCircle size={18} className="text-bad shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-semibold text-ink">{title}</div>
          {message && <div className="text-xs text-ink-2 mt-0.5">{message}</div>}
        </div>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-card border border-line text-xs font-semibold text-ink hover:bg-soft transition-colors shrink-0"
        >
          <RotateCcw size={13} />
          Retry
        </button>
      )}
    </div>
  );
}
