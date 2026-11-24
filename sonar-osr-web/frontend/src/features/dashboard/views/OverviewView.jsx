import React from 'react';
import { Card, CardHeader } from '../../../ui/Card';
import Badge from '../../../ui/Badge';
import Tooltip from '../../../ui/Tooltip';
import { formatDecimal, formatPercent } from '../../../lib/format';

export default function OverviewView({ benchmark, selectedMethods = ['dml', 'svdd', 'msp'] }) {
  const methods = benchmark?.methods || {};
  const winners = benchmark?.summary?.winners || {};
  const active = selectedMethods.length > 0 ? selectedMethods : ['dml', 'svdd', 'msp'];

  const rows = active
    .map((id) => ({ id, ...(methods[id] || {}) }))
    .filter((r) => r.name);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Acoustic Open-Set Paradigm Benchmark Summary"
          subtitle="All metrics read directly from public/data/results.json"
          right={<Badge tone="primary">Single Source of Truth</Badge>}
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wider text-ink-muted">
                <th className="py-3 pr-4 font-semibold">Paradigm / Method</th>
                <th className="py-3 px-3 font-semibold">AUROC</th>
                <th className="py-3 px-3 font-semibold">Avg Precision</th>
                <th className="py-3 px-3 font-semibold">TPR (Recall)</th>
                <th className="py-3 px-3 font-semibold">FPR</th>
                <th className="py-3 px-3 font-semibold">UDR</th>
                <th className="py-3 px-3 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    ECE
                    <Tooltip text="No exported data in results.json" />
                  </span>
                </th>
                <th className="py-3 pl-3 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    Latency
                    <Tooltip text="No exported data in results.json" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-hover/60 transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="font-semibold text-ink">{r.name}</div>
                    <div className="text-xs text-ink-muted">{r.paradigm}</div>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-semibold text-ink tabular-nums">
                    {formatDecimal(r.auroc, 4)}
                    {winners.auroc === r.id && (
                      <Badge tone="primary" className="ml-2 text-[10px] py-0.5 px-2">Winner</Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-3 font-mono tabular-nums text-ink-2">
                    {formatDecimal(r.ap, 4)}
                  </td>
                  <td className="py-3.5 px-3 font-mono tabular-nums text-ink-2">
                    {formatPercent(r.tpr, 2)}
                  </td>
                  <td className="py-3.5 px-3 font-mono tabular-nums text-ink-2">
                    {formatPercent(r.fpr, 2)}
                    {winners.fpr === r.id && (
                      <Badge tone="good" className="ml-2 text-[10px] py-0.5 px-2">Lowest</Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-3 font-mono tabular-nums text-ink-2">
                    {formatPercent(r.udr, 2)}
                    {winners.udr === r.id && (
                      <Badge tone="good" className="ml-2 text-[10px] py-0.5 px-2">Best</Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-ink-muted">—</td>
                  <td className="py-3.5 pl-3 font-mono text-ink-muted">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Key Scientific Findings" />
          <ul className="space-y-3 text-sm text-ink-2 leading-relaxed">
            <li>
              <strong className="text-ink">Metric Space Compactness:</strong> Deep Metric Learning (AUROC{' '}
              <span className="font-mono font-semibold text-primary">
                {formatDecimal(methods.dml?.auroc, 4)}
              </span>
              ) improves on Baseline MSP (
              <span className="font-mono">{formatDecimal(methods.msp?.auroc, 4)}</span>) by{' '}
              <span className="font-mono font-semibold text-good">
                +{((methods.dml?.auroc ?? 0) - (methods.msp?.auroc ?? 0)).toFixed(4)}
              </span>{' '}
              AUROC.
            </li>
            <li>
              <strong className="text-ink">One-Class Safety Margin:</strong> Deep SVDD achieves the lowest false-positive rate (
              <span className="font-mono font-semibold text-good">
                {formatPercent(methods.svdd?.fpr, 2)}
              </span>
              ) and highest unknown detection rate (
              <span className="font-mono font-semibold text-good">
                {formatPercent(methods.svdd?.udr, 2)}
              </span>
              ).
            </li>
            <li>
              <strong className="text-ink">Softmax Overconfidence:</strong> Baseline MSP suffers from a{' '}
              <span className="font-mono text-bad">{formatPercent(methods.msp?.fpr, 2)}</span> false-positive rate on novel anomalies.
            </li>
          </ul>
        </Card>

        <Card className="flex items-center justify-center p-4">
          <img
            src="/figures/all_methods_comparison.png"
            alt="All methods benchmark comparison"
            loading="lazy"
            decoding="async"
            className="max-h-[240px] w-auto object-contain rounded-control"
          />
        </Card>
      </div>
    </div>
  );
}
