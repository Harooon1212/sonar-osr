import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function MarginGauge({ score, distance, threshold = 0.5, isKnown, isDistanceMetric = false }) {
  const svgRef = useRef(null);

  const val = isDistanceMetric ? Number(distance ?? 0.28) : Number(score ?? 0.88);
  const maxDomain = isDistanceMetric ? 1.8 : 1.0;
  const deltaNum = isDistanceMetric ? threshold - val : val - threshold;
  const deltaStr = deltaNum > 0 ? `+${deltaNum.toFixed(3)}` : deltaNum.toFixed(3);

  useEffect(() => {
    if (!svgRef.current) return;
    const width = svgRef.current.clientWidth || 300;
    const height = 46;
    const margin = { left: 12, right: 12, top: 12, bottom: 18 };

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
    const innerWidth = Math.max(80, width - margin.left - margin.right);
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear().domain([0, maxDomain]).range([0, innerWidth]);

    g.append('rect')
      .attr('x', 0)
      .attr('y', innerHeight / 2 - 3.5)
      .attr('width', innerWidth)
      .attr('height', 7)
      .attr('rx', 3.5)
      .attr('fill', 'var(--bg-soft)')
      .attr('stroke', 'var(--line)');

    const threshX = xScale(Math.max(0, Math.min(maxDomain, threshold)));
    g.append('line')
      .attr('x1', threshX)
      .attr('x2', threshX)
      .attr('y1', -2)
      .attr('y2', innerHeight + 2)
      .attr('stroke', 'var(--bad)')
      .attr('stroke-width', 1.8)
      .attr('stroke-dasharray', '3,3');

    const markerX = xScale(Math.max(0, Math.min(maxDomain, val)));
    const color = isKnown ? 'var(--good)' : 'var(--bad)';

    g.append('circle')
      .attr('cx', markerX)
      .attr('cy', innerHeight / 2)
      .attr('r', 5.5)
      .attr('fill', color)
      .attr('stroke', 'var(--bg-card)')
      .attr('stroke-width', 2);

    g.append('text')
      .attr('x', threshX)
      .attr('y', innerHeight + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--bad)')
      .attr('font-size', '10px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .text(`τ=${threshold.toFixed(2)}`);

    g.append('text')
      .attr('x', markerX)
      .attr('y', -3)
      .attr('text-anchor', 'middle')
      .attr('fill', color)
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('font-family', 'JetBrains Mono, monospace')
      .text(val.toFixed(2));
  }, [val, threshold, isKnown, maxDomain]);

  return (
    <div className="mt-3 p-3 rounded-control bg-soft/70 border border-line">
      <div className="flex items-center justify-between text-[11px] text-ink-muted mb-1">
        <span>{isDistanceMetric ? 'Distance vs τ' : 'Confidence vs τ'}</span>
        <span
          className="font-mono font-semibold tabular-nums"
          style={{ color: isKnown ? 'var(--good)' : 'var(--bad)' }}
        >
          Δ = {deltaStr} {isKnown ? '(Inside)' : '(Outside)'}
        </span>
      </div>
      <svg
        ref={svgRef}
        className="w-full h-[46px] overflow-visible"
        role="img"
        aria-label={`Margin gauge: value ${val.toFixed(2)} compared to threshold ${threshold.toFixed(2)}`}
      />
    </div>
  );
}
