import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';
import { Card, CardHeader } from '../../../ui/Card';
import Badge from '../../../ui/Badge';
import { titleCase } from '../../../lib/format';

export default function PerUnknownView({ benchmark }) {
  const perClass = benchmark?.per_class_unknown_detection || {};
  const rows = Object.entries(perClass).map(([cls, scores]) => ({
    classKey: cls,
    name: titleCase(cls),
    dml: Number(scores.dml ?? 0),
    svdd: Number(scores.svdd ?? 0),
    msp: Number(scores.msp ?? 0),
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Per-Unknown Acoustic Class Detection Rates"
          subtitle="Zero-shot rejection % from per_class_unknown_detection in results.json"
          right={<Badge tone="primary">4 Held-out Classes</Badge>}
        />

        <div className="h-[280px] w-full mb-6" aria-label="Per-unknown class detection grouped bar chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} margin={{ top: 10, right: 16, left: -12, bottom: 4 }}>
              <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: 'var(--chart-axis)', fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: 'var(--chart-axis)', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'var(--chart-tooltip-bg)',
                  borderColor: 'var(--chart-tooltip-border)',
                  borderRadius: 16,
                  fontSize: 12,
                  color: 'var(--ink)',
                }}
                formatter={(v) => `${v}%`}
              />
              <Legend />
              <Bar dataKey="dml" name="DML" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="svdd" name="Deep SVDD" fill="var(--good)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="msp" name="Baseline MSP" fill="var(--warn)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wider text-ink-muted">
                <th className="py-2.5 pr-4 font-semibold">Unknown Class</th>
                <th className="py-2.5 px-3 font-semibold">DML Detection</th>
                <th className="py-2.5 px-3 font-semibold">Deep SVDD Detection</th>
                <th className="py-2.5 pl-3 font-semibold">Baseline MSP Detection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.classKey}>
                  <td className="py-3 pr-4 font-semibold text-ink">{r.name}</td>
                  <td className="py-3 px-3 font-mono text-primary font-semibold tabular-nums">{r.dml.toFixed(1)}%</td>
                  <td className="py-3 px-3 font-mono text-good font-semibold tabular-nums">{r.svdd.toFixed(1)}%</td>
                  <td className="py-3 pl-3 font-mono text-warn font-semibold tabular-nums">{r.msp.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="flex flex-col items-center">
        <img
          src="/figures/msp_per_unknown_scores.png"
          alt="MSP per-unknown scores"
          loading="lazy"
          decoding="async"
          className="max-w-xl w-full h-auto rounded-control border border-line"
        />
      </Card>
    </div>
  );
}
