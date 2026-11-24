import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function MarginGauge({ score, distance, threshold, isKnown, methodName, isDistanceMetric = false }) {
  const svgRef = useRef(null);

  // If distance metric (DML or SVDD), we evaluate distance d vs threshold radius tau
  const val = isDistanceMetric ? (distance ?? 0.28) : (score ?? 0.88);
  const maxDomain = isDistanceMetric ? 1.8 : 1.0;

  // For distance: delta = tau - d (positive is good/inside boundary, negative is outside)
  // For score: delta = score - tau (positive is good/above threshold)
  const deltaNum = isDistanceMetric ? (threshold - val) : (val - threshold);
  const deltaStr = (deltaNum > 0 ? `+${deltaNum.toFixed(3)}` : deltaNum.toFixed(3));
  const deltaColor = isKnown ? 'var(--semantic-positive)' : 'var(--semantic-negative)';

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth || 320;
    const height = 44;
    const margin = { left: 14, right: 14, top: 10, bottom: 18 };

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear().domain([0, maxDomain]).range([0, innerWidth]);

    // Background track
    g.append('rect')
      .attr('x', 0)
      .attr('y', innerHeight / 2 - 3)
      .attr('width', innerWidth)
      .attr('height', 6)
      .attr('rx', 3)
      .attr('fill', '#07080d')
      .attr('stroke', 'rgba(238, 240, 245, 0.08)');

    // Threshold indicator line (tau)
    const threshX = xScale(Math.max(0, Math.min(maxDomain, threshold)));
    g.append('line')
      .attr('x1', threshX)
      .attr('x2', threshX)
      .attr('y1', -2)
      .attr('y2', innerHeight + 2)
      .attr('stroke', 'var(--semantic-negative)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '3,3');

    // Value marker
    const markerX = xScale(Math.max(0, Math.min(maxDomain, val)));
    const color = isKnown ? 'var(--semantic-positive)' : 'var(--semantic-negative)';

    g.append('circle')
      .attr('cx', markerX)
      .attr('cy', innerHeight / 2)
      .attr('r', 5)
      .attr('fill', color)
      .attr('stroke', '#07080d')
      .attr('stroke-width', 2);

    // Labels
    g.append('text')
      .attr('x', threshX)
      .attr('y', innerHeight + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--semantic-negative)')
      .attr('font-size', '10px')
      .attr('font-family', 'var(--font-mono)')
      .attr('font-feature-settings', "'tnum' 1")
      .text(`τ=${threshold.toFixed(2)}`);

    g.append('text')
      .attr('x', markerX)
      .attr('y', -3)
      .attr('text-anchor', 'middle')
      .attr('fill', color)
      .attr('font-size', '10px')
      .attr('font-weight', '500')
      .attr('font-family', 'var(--font-mono)')
      .attr('font-feature-settings', "'tnum' 1")
      .text(val.toFixed(2));

  }, [val, threshold, isKnown, maxDomain]);

  return (
    <div style={{ marginTop: '8px', padding: '10px 12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
        <span>{isDistanceMetric ? 'Distance to boundary (d vs τ)' : 'Decision margin (P vs τ)'}</span>
        <span style={{ color: deltaColor, fontFamily: 'var(--font-mono)', fontWeight: 500 }} className="tabular-nums">
          Δ = {deltaStr} {isKnown ? '(Inside)' : '(Outside)'}
        </span>
      </div>
      <svg ref={svgRef} style={{ width: '100%', height: '44px', overflow: 'visible' }}></svg>
    </div>
  );
}
