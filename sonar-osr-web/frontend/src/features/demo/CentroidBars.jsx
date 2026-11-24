import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  Cell,
} from 'recharts';
import { Card, CardHeader } from '../../ui/Card';
import Badge from '../../ui/Badge';

export default function CentroidBars({ distances = [], threshold = 0.5, predictedClass }) {
  const data = distances.map((d) => ({
    name: d.class_name,
    distance: Number(Number(d.distance).toFixed(3)),
  }));

  return (
    <Card>
      <CardHeader
        title="Centroid Distance Distribution"
        subtitle="Euclidean distance to known class centroids; below dashed τ line = Known"
        right={<Badge tone="primary" className="font-mono">τ = {threshold.toFixed(2)}</Badge>}
      />

      <div className="h-[240px] w-full" aria-label="Centroid distance bar chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 16, left: -10, bottom: 4 }}>
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: 'var(--chart-axis)', fontSize: 11 }} />
            <YAxis tick={{ fill: 'var(--chart-axis)', fontSize: 11 }} />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'var(--chart-tooltip-bg)',
                borderColor: 'var(--chart-tooltip-border)',
                borderRadius: 16,
                fontSize: 12,
                color: 'var(--ink)',
              }}
              formatter={(v) => [Number(v).toFixed(3), 'Distance']}
            />
            <ReferenceLine
              y={threshold}
              stroke="var(--bad)"
              strokeDasharray="4 4"
              strokeWidth={2}
              label={{
                value: `τ = ${threshold.toFixed(2)}`,
                position: 'right',
                fill: 'var(--bad)',
                fontSize: 11,
              }}
            />
            <Bar dataKey="distance" radius={[8, 8, 0, 0]} maxBarSize={44}>
              {data.map((entry) => {
                const isPred = entry.name === predictedClass;
                const fill = isPred
                  ? entry.distance <= threshold
                    ? 'var(--good)'
                    : 'var(--bad)'
                  : 'var(--primary-soft)';
                return <Cell key={entry.name} fill={fill} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
