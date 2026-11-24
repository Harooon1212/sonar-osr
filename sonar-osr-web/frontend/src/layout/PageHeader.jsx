import React from 'react';
import { Download } from 'lucide-react';

export default function PageHeader({ title, subtitle, action, onDownload, downloadLabel = 'Download' }) {
  return (
    <header className="pb-5 mb-6 border-b border-line flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-ink leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-ink-muted mt-1">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {action}
        {onDownload && (
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-control text-sm font-medium text-ink-2 hover:text-ink hover:bg-soft transition-colors"
          >
            <Download size={16} strokeWidth={2} />
            <span>{downloadLabel}</span>
          </button>
        )}
      </div>
    </header>
  );
}
