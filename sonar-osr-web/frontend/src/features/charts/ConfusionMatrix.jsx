import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardHeader } from '../../ui/Card';
import Badge from '../../ui/Badge';
import EmptyState from '../../ui/EmptyState';

export default function ConfusionMatrix({ benchmark }) {
  const cm = benchmark?.confusion_matrix_dml;
  const svgRef = useRef(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    if (!svgRef.current || !cm?.matrix?.length) return;
    const labels = cm.labels || [];
    const matrix = cm.matrix || [];
    const n = labels.length;

    const size = 440;
    const margin = { top: 82, right: 20, bottom: 20, left: 105 };
    const cellSize = (size - margin.left - margin.right) / n;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const raw = Number(matrix[r][c] ?? 0);
        const pct = raw <= 1 ? Math.round(raw * 100) : Math.round(raw);
        const isDiag = r === c;
        const isUnknownRow = r === n - 1;

        let fill = 'var(--bg-soft)';
        if (isDiag) {
          fill = isUnknownRow
            ? `rgba(47, 107, 255, ${0.22 + (pct / 100) * 0.72})`
            : `rgba(22, 199, 132, ${0.2 + (pct / 100) * 0.72})`;
        } else if (pct > 0) {
          fill = `rgba(255, 77, 46, ${Math.min(0.65, 0.1 + (pct / 20) * 0.45)})`;
        }

        const cell = g
          .append('g')
          .attr('transform', `translate(${c * cellSize}, ${r * cellSize})`)
          .style('cursor', 'pointer')
          .on('mouseenter', () =>
            setHovered({ trueClass: labels[r], predClass: labels[c], pct })
          )
          .on('mouseleave', () => setHovered(null));

        cell
          .append('rect')
          .attr('width', cellSize - 3)
          .attr('height', cellSize - 3)
          .attr('rx', 6)
          .attr('fill', fill)
          .attr('stroke', isUnknownRow && isDiag ? 'var(--primary)' : 'var(--line)')
          .attr('stroke-width', isUnknownRow && isDiag ? 1.5 : 1);

        cell
          .append('text')
          .attr('x', (cellSize - 3) / 2)
          .attr('y', (cellSize - 3) / 2 + 4)
          .attr('text-anchor', 'middle')
          .attr('fill', pct >= 55 ? '#FFFFFF' : 'var(--ink)')
          .attr('font-size', '11px')
          .attr('font-weight', isDiag ? '700' : '500')
          .attr('font-family', 'JetBrains Mono, monospace')
          .text(`${pct}%`);
      }
    }

    // Row labels
    labels.forEach((lbl, r) => {
      g.append('text')
        .attr('x', -10)
        .attr('y', r * cellSize + (cellSize - 3) / 2 + 4)
        .attr('text-anchor', 'end')
        .attr('fill', r === n - 1 ? 'var(--primary)' : 'var(--ink-2)')
        .attr('font-size', '11px')
        .attr('font-weight', r === n - 1 ? '700' : '500')
        .text(lbl);
    });

    // Column labels
    labels.forEach((lbl, c) => {
      g.append('text')
        .attr(
          'transform',
          `translate(${c * cellSize + (cellSize - 3) / 2}, -10) rotate(-35)`
        )
        .attr('text-anchor', 'start')
        .attr('fill', c === n - 1 ? 'var(--primary)' : 'var(--ink-2)')
        .attr('font-size', '11px')
        .attr('font-weight', c === n - 1 ? '700' : '500')
        .text(lbl);
    });
  }, [cm]);

  if (!cm?.matrix?.length) {
    return (
      <Card>
        <EmptyState title="Confusion matrix unavailable" description="No confusion_matrix_dml data found in results.json." />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="7×7 Open-Set Confusion Matrix (DML)"
        subtitle="Normalized row proportions across 6 known classes + Unknown (Novel) rejection row"
        right={<Badge tone="primary">DML Triplet Head</Badge>}
      />

      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="w-full max-w-[460px] overflow-x-auto">
          <svg
            ref={svgRef}
            viewBox="0 0 440 440"
            className="w-full h-auto"
            role="img"
            aria-label="7 by 7 normalized open-set confusion matrix for DML"
          />
        </div>

        <div className="flex-1 space-y-3 text-sm text-ink-2">
          <div className="p-4 rounded-control bg-soft border border-line">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1">
              Cell Inspector
            </div>
            {hovered ? (
              <div className="font-mono text-sm text-ink">
                True: <strong>{hovered.trueClass}</strong> → Predicted:{' '}
                <strong>{hovered.predClass}</strong> ({hovered.pct}%)
              </div>
            ) : (
              <div className="text-xs text-ink-muted">
                Hover any cell to inspect exact true-vs-predicted percentage.
              </div>
            )}
          </div>
          <p className="text-xs text-ink-muted leading-relaxed">
            Diagonal cells show per-class recall. The bottom row (<strong>Unknown (Novel)</strong>) shows how often unseen anomalies are correctly rejected (75%) versus misclassified into known categories.
          </p>
          <p className="text-[11px] text-ink-faint">
            Source: <code>confusion_matrix_dml</code> in <code>results.json</code> (note: values are rounded for display).
          </p>
        </div>
      </div>
    </Card>
  );
}
