import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  Legend,
} from 'recharts';
import { Card, CardHeader } from '../../ui/Card';
import Badge from '../../ui/Badge';
import EmptyState from '../../ui/EmptyState';

export default function ThresholdExplorer({ benchmark }) {
  const dist = benchmark?.score_distributions?.dml;
  const [tau, setTau] = useState(0.5);

  // Normalize negative similarity/distance scores (-1.8..0) into [0, 1] open-set score
  const { knownNorm, unknownNorm, bins } = useMemo(() => {
    if (!dist) return { knownNorm: [], unknownNorm: [], bins: [] };
    const toScore = (s) => Math.max(0, Math.min(1, Number((1 + s / 2).toFixed(3))));
    const k = (dist.known_scores || []).map(toScore);
    const u = (dist.unknown_scores || []).map(toScore);

    const bucketCount = 10;
    const rows = Array.from({ length: bucketCount }, (_, i) => {
      const lo = i / bucketCount;
      const hi = (i + 1) / bucketCount;
      const label = `${lo.toFixed(1)}`;
      return {
        bin: label,
        midpoint: Number(((lo + hi) / 2).toFixed(2)),
        known: k.filter((v) => v >= lo && (i === bucketCount - 1 ? v <= hi : v < hi)).length,
        unknown: u.filter((v) => v >= lo && (i === bucketCount - 1 ? v <= hi : v < hi)).length,
      };
    });
    return { knownNorm: k, unknownNorm: u, bins: rows };
  }, [dist]);

  if (!dist) {
    return (
      <Card>
        <EmptyState title="Score distributions unavailable" description="No score_distributions.dml found in results.json." />
      </Card>
    );
  }

  const tp = knownNorm.filter((v) => v >= tau).length;
  const fp = unknownNorm.filter((v) => v >= tau).length;
  const tn = unknownNorm.length - fp;
  const tpr = knownNorm.length ? (tp / knownNorm.length) * 100 : 0;
  const fpr = unknownNorm.length ? (fp / unknownNorm.length) * 100 : 0;
  const udr = unknownNorm.length ? (tn / unknownNorm.length) * 100 : 0;

  return (
    <Card>
      <CardHeader
        title="Interactive Threshold (τ) Explorer"
        subtitle="Adjust operating threshold τ over normalized DML score distributions"
        right={<Badge tone="primary" className="font-mono">τ = {tau.toFixed(2)}</Badge>}
      />

      <div className="mb-5 p-4 rounded-control bg-soft border border-line">
        <div className="flex items-center justify-between text-xs font-medium text-ink-2 mb-2">
          <span>Decision Threshold (τ)</span>
          <span className="font-mono font-semibold text-primary">{tau.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min={0.1}
          max={0.9}
          step={0.01}
          value={tau}
          onChange={(e) => setTau(Number(e.target.value))}
          aria-label="Decision threshold tau"
          className="sonar-slider"
        />
        <div className="grid grid-cols-3 gap-3 mt-4 text-center">
          <div className="p-2.5 rounded-control bg-card border border-line">
            <div className="text-[11px] text-ink-muted">Known Recall (TPR)</div>
            <div className="text-lg font-bold font-mono text-good tabular-nums">{tpr.toFixed(1)}%</div>
          </div>
          <div className="p-2.5 rounded-control bg-card border border-line">
            <div className="text-[11px] text-ink-muted">False Positive (FPR)</div>
            <div className="text-lg font-bold font-mono text-bad tabular-nums">{fpr.toFixed(1)}%</div>
          </div>
          <div className="p-2.5 rounded-control bg-card border border-line">
            <div className="text-[11px] text-ink-muted">Unknown Rejection (UDR)</div>
            <div className="text-lg font-bold font-mono text-primary tabular-nums">{udr.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      <div className="h-[260px] w-full" aria-label="Known vs Unknown score histogram">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bins} margin={{ top: 10, right: 16, left: -12, bottom: 4 }}>
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
            <XAxis dataKey="bin" tick={{ fill: 'var(--chart-axis)', fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fill: 'var(--chart-axis)', fontSize: 11 }} />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'var(--chart-tooltip-bg)',
                borderColor: 'var(--chart-tooltip-border)',
                borderRadius: 16,
                fontSize: 12,
                color: 'var(--ink)',
              }}
            />
            <Legend />
            <Bar dataKey="unknown" name="Unknown Scores" fill="var(--bad)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="known" name="Known Scores" fill="var(--good)" radius={[6, 6, 0, 0]} />
            <ReferenceLine
              x={(Math.floor(tau * 10) / 10).toFixed(1)}
              stroke="var(--primary)"
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[11px] text-ink-muted mt-3">
        Note: Curve resampled for display from the 10-point score summary in <code>results.json</code>.
      </p>
    </Card>
  );
}
