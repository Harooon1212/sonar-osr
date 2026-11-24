import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function ThresholdExplorer() {
  const [threshold, setThreshold] = useState(0.50);
  const svgRef = useRef(null);

  // Generate synthetic distribution of known and unknown scores modeled after DML
  // Known scores clustered around 0.82 (std 0.12), Unknown scores clustered around 0.28 (std 0.14)
  const nPoints = 400;
  const knownSamples = Array.from({ length: nPoints }, () => {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return Math.max(0.05, Math.min(0.99, 0.78 + z * 0.11));
  });

  const unknownSamples = Array.from({ length: nPoints }, () => {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return Math.max(0.01, Math.min(0.95, 0.26 + z * 0.13));
  });

  // Calculate live metrics based on current threshold
  // Convention: Score >= tau => classified as Known, Score < tau => rejected as Unknown
  const truePositives = knownSamples.filter(s => s >= threshold).length;
  const falseNegatives = knownSamples.length - truePositives;
  const falsePositives = unknownSamples.filter(s => s >= threshold).length;
  const trueNegatives = unknownSamples.length - falsePositives;

  const tpr = (truePositives / knownSamples.length) * 100;
  const fpr = (falsePositives / unknownSamples.length) * 100;
  const udr = (trueNegatives / unknownSamples.length) * 100;

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth || 500;
    const height = 220;
    const margin = { top: 20, right: 20, bottom: 35, left: 40 };

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3.scaleLinear().domain([0, 1]).range([0, innerWidth]);

    const bins = 30;
    const histogram = d3.bin()
      .domain(x.domain())
      .thresholds(x.ticks(bins));

    const binsKnown = histogram(knownSamples);
    const binsUnknown = histogram(unknownSamples);

    const maxCount = Math.max(
      d3.max(binsKnown, d => d.length),
      d3.max(binsUnknown, d => d.length)
    );

    const y = d3.scaleLinear().domain([0, maxCount]).range([innerHeight, 0]);

    // X Axis
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5))
      .call(g => g.selectAll('.tick text').attr('fill', '#a3a9b8').attr('font-size', '10px').attr('font-family', 'var(--font-mono)').attr('font-feature-settings', "'tnum' 1"))
      .call(g => g.select('.domain').attr('stroke', 'rgba(238, 240, 245, 0.12)'));

    // Bins Unknown (Red)
    g.selectAll('.bin-unknown')
      .data(binsUnknown)
      .enter()
      .append('rect')
      .attr('x', d => x(d.x0) + 1)
      .attr('y', d => y(d.length))
      .attr('width', d => Math.max(0, x(d.x1) - x(d.x0) - 2))
      .attr('height', d => innerHeight - y(d.length))
      .attr('fill', 'rgba(229, 72, 77, 0.35)')
      .attr('stroke', 'rgba(229, 72, 77, 0.7)')
      .attr('stroke-width', 1)
      .attr('rx', 2);

    // Bins Known (Green)
    g.selectAll('.bin-known')
      .data(binsKnown)
      .enter()
      .append('rect')
      .attr('x', d => x(d.x0) + 1)
      .attr('y', d => y(d.length))
      .attr('width', d => Math.max(0, x(d.x1) - x(d.x0) - 2))
      .attr('height', d => innerHeight - y(d.length))
      .attr('fill', 'rgba(76, 195, 138, 0.35)')
      .attr('stroke', 'rgba(76, 195, 138, 0.7)')
      .attr('stroke-width', 1)
      .attr('rx', 2);

    // Vertical Threshold Line
    const tx = x(threshold);
    g.append('line')
      .attr('x1', tx)
      .attr('x2', tx)
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#38bdf8')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,2');

    g.append('circle')
      .attr('cx', tx)
      .attr('cy', 8)
      .attr('r', 4)
      .attr('fill', '#38bdf8');

    g.append('text')
      .attr('x', tx)
      .attr('y', -6)
      .attr('text-anchor', 'middle')
      .attr('fill', '#38bdf8')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('font-family', 'var(--font-mono)')
      .attr('font-feature-settings', "'tnum' 1")
      .text(`τ = ${threshold.toFixed(2)}`);

  }, [threshold]);

  return (
    <div className="plate" style={{ padding: '22px' }}>
      <div className="card-header">
        <div>
          <h3 className="card-title">Real-time threshold and separability explorer</h3>
          <p className="card-subtitle">Scrub τ to inspect the tradeoff between known class retention and anomaly rejection</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <div className="slider-label">
            <span>Decision threshold (τ)</span>
            <span className="slider-val tabular-nums">{threshold.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.90"
            step="0.01"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="btn btn-outline"
            style={{ fontSize: '11px', padding: '6px 10px' }}
            onClick={() => setThreshold(0.35)}
          >
            High recall (0.35)
          </button>
          <button
            className="btn btn-outline"
            style={{ fontSize: '11px', padding: '6px 10px' }}
            onClick={() => setThreshold(0.50)}
          >
            Balanced (0.50)
          </button>
          <button
            className="btn btn-outline"
            style={{ fontSize: '11px', padding: '6px 10px' }}
            onClick={() => setThreshold(0.70)}
          >
            Low false alarm (0.70)
          </button>
        </div>
      </div>

      <svg ref={svgRef} style={{ width: '100%', height: '220px' }}></svg>

      <div className="grid-3" style={{ marginTop: '16px' }}>
        <div className="inset" style={{ padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Known class retention (TPR)</div>
          <div className="font-mono tabular-nums" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--highlight-green)', marginTop: '2px' }}>
            {tpr.toFixed(1)}%
          </div>
        </div>
        <div className="inset" style={{ padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Unknown anomaly rejection (UDR)</div>
          <div className="font-mono tabular-nums" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--glow-cyan)', marginTop: '2px' }}>
            {udr.toFixed(1)}%
          </div>
        </div>
        <div className="inset" style={{ padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>False alarm rate (FPR)</div>
          <div className="font-mono tabular-nums" style={{ fontSize: '18px', fontWeight: 600, color: fpr > 15 ? 'var(--alert-red)' : 'var(--text-main)', marginTop: '2px' }}>
            {fpr.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}
