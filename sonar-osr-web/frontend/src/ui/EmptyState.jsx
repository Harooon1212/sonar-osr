import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'No data available', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4">
      <div className="w-11 h-11 rounded-2xl bg-soft text-ink-muted flex items-center justify-center mb-3">
        <Icon size={20} />
      </div>
      <div className="text-sm font-semibold text-ink">{title}</div>
      {description && <p className="text-xs text-ink-muted mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
