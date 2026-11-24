import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function CentroidRadar({ distances, threshold, predictedClass, isKnown }) {
  const svgRef = useRef(null);

  // Fallback sample distances if none provided
  const data = distances || [
    { class_name: 'bottle', distance: 0.42 },
    { class_name: 'can', distance: 0.88 },
    { class_name: 'tire', distance: 1.15 },
    { class_name: 'drink-carton', distance: 1.34 },
    { class_name: 'hook', distance: 1.62 },
    { class_name: 'propeller', distance: 1.85 },
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth || 400;
    const height = 240;
    const margin = { top: 20, right: 20, bottom: 40, left: 45 };

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const maxDist = Math.max(2.2, d3.max(data, d => d.distance) * 1.15, threshold * 1.25);

    const x = d3.scaleBand()
      .domain(data.map(d => d.class_name))
      .range([0, innerWidth])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, maxDist])
      .range([innerHeight, 0]);

    // Gridlines (quiet 8% opacity hairlines)
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y).ticks(5).tickSize(-innerWidth).tickFormat(''))
      .call(g => g.selectAll('.tick line').attr('stroke', 'rgba(238, 240, 245, 0.08)'))
      .call(g => g.select('.domain').remove());

    // X Axis
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x))
      .call(g => g.selectAll('.tick text')
        .attr('fill', '#a3a9b8')
        .attr('font-size', '11px')
        .attr('font-family', 'var(--font-mono)'))
      .call(g => g.select('.domain').attr('stroke', 'rgba(238, 240, 245, 0.12)'));

    // Y Axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .call(g => g.selectAll('.tick text')
        .attr('fill', '#a3a9b8')
        .attr('font-size', '10px')
        .attr('font-family', 'var(--font-mono)')
        .attr('font-feature-settings', "'tnum' 1"))
      .call(g => g.select('.domain').attr('stroke', 'rgba(238, 240, 245, 0.12)'));

    // Bars
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.class_name))
      .attr('y', d => y(d.distance))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d.distance))
      .attr('rx', 4)
      .attr('fill', d => {
        if (d.class_name === predictedClass) {
          return d.distance <= threshold ? 'var(--semantic-positive)' : 'var(--semantic-negative)';
        }
        return '#1a1e28';
      })
      .attr('stroke', d => d.class_name === predictedClass ? (d.distance <= threshold ? 'var(--semantic-positive)' : 'var(--semantic-negative)') : 'rgba(238, 240, 245, 0.12)')
      .attr('stroke-width', 1);

    // Value on top of bars
    g.selectAll('.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('x', d => x(d.class_name) + x.bandwidth() / 2)
      .attr('y', d => y(d.distance) - 6)
      .attr('text-anchor', 'middle')
      .attr('fill', d => d.class_name === predictedClass ? (d.distance <= threshold ? 'var(--semantic-positive)' : 'var(--semantic-negative)') : '#a3a9b8')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('font-family', 'var(--font-mono)')
      .attr('font-feature-settings', "'tnum' 1")
      .text(d => d.distance.toFixed(2));

    // Decision Radius Line (Threshold tau)
    const yThresh = y(threshold);
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yThresh)
      .attr('y2', yThresh)
      .attr('stroke', 'var(--semantic-negative)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,4');

    g.append('text')
      .attr('x', innerWidth - 5)
      .attr('y', yThresh - 6)
      .attr('text-anchor', 'end')
      .attr('fill', 'var(--semantic-negative)')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('font-family', 'var(--font-mono)')
      .attr('font-feature-settings', "'tnum' 1")
      .text(`Decision radius (τ = ${threshold.toFixed(2)})`);

  }, [distances, threshold, predictedClass, isKnown]);

  return (
    <div className="plate" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-bright)' }}>Centroid distance distribution</h4>
        <span className="badge badge-info" style={{ fontSize: '11px' }}>Metric space</span>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
        Euclidean distances from query embedding to known class centroids. Points below the dashed line fall inside the known cluster boundary.
      </p>
      <svg ref={svgRef} style={{ width: '100%', height: '240px' }}></svg>
    </div>
  );
}
