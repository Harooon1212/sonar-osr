import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Card, CardHeader } from '../../ui/Card';
import Tabs from '../../ui/Tabs';
import Badge from '../../ui/Badge';

function interpolateCurve(points, gridX) {
  if (!Array.isArray(points) || points.length === 0) return gridX.map(() => null);
  const sorted = [...points].sort((a, b) => a[0] - b[0]);
  return gridX.map((x) => {
    if (x <= sorted[0][0]) return sorted[0][1];
    if (x >= sorted[sorted.length - 1][0]) return sorted[sorted.length - 1][1];
    for (let i = 0; i < sorted.length - 1; i++) {
      const [x0, y0] = sorted[i];
      const [x1, y1] = sorted[i + 1];
      if (x >= x0 && x <= x1) {
        const t = x1 === x0 ? 0 : (x - x0) / (x1 - x0);
        return Number((y0 + t * (y1 - y0)).toFixed(4));
      }
    }
    return null;
  });
}

export default function RocCurve({ benchmark }) {
  const [curveType, setCurveType] = useState('roc');
  const curves = benchmark?.curves || {};
  const methods = benchmark?.methods || {};

  const rocSeries = useMemo(() => {
    const xSet = new Set([0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8, 1]);
    ['dml_roc', 'svdd_roc', 'msp_roc'].forEach((key) => {
      (curves[key] || []).forEach(([x]) => xSet.add(Number(x)));
    });
    const gridX = Array.from(xSet).sort((a, b) => a - b);
    const dmlY = interpolateCurve(curves.dml_roc, gridX);
    const svddY = interpolateCurve(curves.svdd_roc, gridX);
    const mspY = interpolateCurve(curves.msp_roc, gridX);

    return gridX.map((x, idx) => ({
      x: Number(x.toFixed(4)),
      dml: dmlY[idx],
      svdd: svddY[idx],
      msp: mspY[idx],
      chance: Number(x.toFixed(4)),
    }));
  }, [curves]);

  const prSeries = useMemo(() => {
    const pts = curves.dml_pr || [];
    return pts.map(([recall, precision]) => ({
      x: Number(recall),
      dml: Number(precision),
    }));
  }, [curves]);

  const data = curveType === 'roc' ? rocSeries : prSeries;

  return (
    <Card>
      <CardHeader
        title={curveType === 'roc' ? 'Open-Set ROC Curves (Known vs Unknown)' : 'DML Precision-Recall Curve'}
        subtitle="Operating characteristics computed from exported evaluation curves"
        right={
          <Tabs
            layoutId="roc-pr-tabs"
            value={curveType}
            onChange={setCurveType}
            tabs={[
              { id: 'roc', label: 'ROC Curves' },
              { id: 'pr', label: 'DML PR Curve' },
            ]}
          />
        }
      />

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge tone="primary">
          DML AUROC {methods.dml?.auroc?.toFixed(4) ?? '—'} (FPR {((methods.dml?.fpr ?? 0) * 100).toFixed(2)}%, TPR {((methods.dml?.tpr ?? 0) * 100).toFixed(2)}%)
        </Badge>
        <Badge tone="good">
          SVDD AUROC {methods.svdd?.auroc?.toFixed(4) ?? '—'} (FPR {((methods.svdd?.fpr ?? 0) * 100).toFixed(2)}%, TPR {((methods.svdd?.tpr ?? 0) * 100).toFixed(2)}%)
        </Badge>
        <Badge tone="warn">
          MSP AUROC {methods.msp?.auroc?.toFixed(4) ?? '—'} (FPR {((methods.msp?.fpr ?? 0) * 100).toFixed(2)}%, TPR {((methods.msp?.tpr ?? 0) * 100).toFixed(2)}%)
        </Badge>
      </div>

      <div className="h-[340px] w-full" aria-label="ROC and Precision-Recall chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
            <XAxis
              dataKey="x"
              type="number"
              domain={[0, 1]}
              tick={{ fill: 'var(--chart-axis)', fontSize: 11 }}
              label={{
                value: curveType === 'roc' ? 'False Positive Rate (FPR)' : 'Recall',
                position: 'insideBottom',
                offset: -4,
                fill: 'var(--chart-axis)',
                fontSize: 12,
              }}
            />
            <YAxis
              domain={[0, 1]}
              tick={{ fill: 'var(--chart-axis)', fontSize: 11 }}
              label={{
                value: curveType === 'roc' ? 'True Positive Rate (TPR)' : 'Precision',
                angle: -90,
                position: 'insideLeft',
                fill: 'var(--chart-axis)',
                fontSize: 12,
              }}
            />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'var(--chart-tooltip-bg)',
                borderColor: 'var(--chart-tooltip-border)',
                borderRadius: 16,
                boxShadow: 'var(--shadow-pop)',
                fontSize: 12,
                color: 'var(--ink)',
              }}
            />
            <Legend verticalAlign="top" height={32} />
            {curveType === 'roc' && (
              <Line
                type="linear"
                dataKey="chance"
                name="Random (0.50)"
                stroke="var(--ink-faint)"
                strokeDasharray="4 4"
                dot={false}
                strokeWidth={1.5}
              />
            )}
            <Line
              type="monotone"
              dataKey="dml"
              name="DML (Triplet)"
              stroke="var(--primary)"
              strokeWidth={2.8}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            {curveType === 'roc' && (
              <>
                <Line
                  type="monotone"
                  dataKey="svdd"
                  name="Deep SVDD"
                  stroke="var(--good)"
                  strokeWidth={2.4}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="msp"
                  name="Baseline MSP"
                  stroke="var(--warn)"
                  strokeWidth={2.2}
                  dot={{ r: 3 }}
                />
                {methods.dml?.fpr != null && (
                  <ReferenceLine x={methods.dml.fpr} stroke="var(--primary)" strokeDasharray="3 3" strokeOpacity={0.45} />
                )}
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[11px] text-ink-muted mt-3">
        Note: Curve resampled for display from the exported operating points in <code>results.json</code>.
      </p>
    </Card>
  );
}
