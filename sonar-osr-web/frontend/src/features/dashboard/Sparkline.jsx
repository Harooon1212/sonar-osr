import React, { useId } from 'react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function Sparkline({ points = [], color = 'var(--primary)' }) {
  const gradId = useId();
  const data = points.map((p, idx) => ({
    idx,
    val: Array.isArray(p) ? Number(p[1] ?? 0) : Number(p?.y ?? p ?? 0),
  }));

  if (data.length < 2) {
    return <div className="h-10 w-full" aria-hidden="true" />;
  }

  return (
    <div className="h-11 w-full mt-2" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 2, left: 2, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="val"
            stroke={color}
            strokeWidth={2.2}
            fill={`url(#${gradId})`}
            isAnimationActive={true}
            animationDuration={650}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
