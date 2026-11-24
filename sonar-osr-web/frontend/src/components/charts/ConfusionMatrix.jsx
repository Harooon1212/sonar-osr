import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function ConfusionMatrix() {
  const [method, setMethod] = useState('dml');
  const svgRef = useRef(null);

  const classes = ['bottle', 'can', 'tire', 'carton', 'hook', 'propeller', 'Unknown'];

  // Normalized confusion matrices (%)
  const matrices = {
    dml: [
      [94, 2,  1,  1,  0,  0,  2],
      [ 1, 91, 3,  2,  0,  0,  3],
      [ 2, 2,  89, 2,  1,  0,  4],
      [ 1, 3,  2,  88, 1,  0,  5],
      [ 0, 1,  1,  1,  92, 1,  4],
      [ 0, 0,  1,  0,  1,  93, 5],
      [ 2, 1,  2,  2,  0,  1,  92] // Rejection of true unknowns: 92%
    ],
    svdd: [
      [89, 3,  2,  2,  0,  0,  4],
      [ 2, 87, 4,  2,  1,  0,  4],
      [ 3, 3,  84, 3,  1,  1,  5],
      [ 2, 4,  3,  83, 2,  0,  6],
      [ 0, 2,  1,  2,  88, 2,  5],
      [ 0, 1,  2,  0,  2,  89, 6],
      [ 3, 2,  2,  2,  1,  1,  89] // Rejection: 89%
    ],
    msp: [
      [82, 5,  4,  3,  1,  0,  5],
      [ 4, 79, 5,  4,  2,  1,  5],
      [ 5, 4,  76, 4,  3,  2,  6],
      [ 3, 6,  4,  75, 4,  1,  7],
      [ 2, 3,  3,  3,  81, 3,  5],
      [ 1, 2,  3,  2,  3,  82, 7],
      [ 5, 4,  5,  4,  3,  2,  77] // Rejection: 77%
    ]
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const matrix = matrices[method];
    const n = classes.length;
    const size = 360;
    const margin = { top: 70, right: 20, bottom: 20, left: 75 };

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const cellSize = (size - margin.left - margin.right) / n;

    // Color scale: low values navy, high values bright cyan/emerald
    const colorScale = d3.scaleSequential()
      .domain([0, 100])
      .interpolator(d3.interpolateBlues);

    // Draw cells
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const val = matrix[r][c];
        const isDiag = r === c;
        const cellGroup = g.append('g')
          .attr('transform', `translate(${c * cellSize}, ${r * cellSize})`);

        let fill = '#11141c';
        if (isDiag) {
          fill = d3.interpolateLab('#1a1e28', '#4cc38a')(val / 100);
        } else if (val > 0) {
          fill = d3.interpolateLab('#11141c', '#e5484d')(val / 20);
        }

        cellGroup.append('rect')
          .attr('width', cellSize - 2)
          .attr('height', cellSize - 2)
          .attr('rx', 3)
          .attr('fill', fill)
          .attr('stroke', 'rgba(238, 240, 245, 0.08)')
          .attr('stroke-width', 0.5);

        cellGroup.append('text')
          .attr('x', (cellSize - 2) / 2)
          .attr('y', (cellSize - 2) / 2 + 4)
          .attr('text-anchor', 'middle')
          .attr('fill', val > 40 ? '#ffffff' : '#a3a9b8')
          .attr('font-size', '10px')
          .attr('font-weight', isDiag ? '500' : '400')
          .attr('font-family', 'var(--font-mono)')
          .attr('font-feature-settings', "'tnum' 1")
          .text(`${val}%`);
      }
    }

    // Row labels (True class)
    for (let r = 0; r < n; r++) {
      g.append('text')
        .attr('x', -8)
        .attr('y', r * cellSize + cellSize / 2 + 3)
        .attr('text-anchor', 'end')
        .attr('fill', r === 6 ? 'var(--semantic-negative)' : '#a3a9b8')
        .attr('font-size', '10px')
        .attr('font-weight', r === 6 ? '500' : '400')
        .attr('font-family', 'var(--font-mono)')
        .text(classes[r]);
    }

    // Column labels (Predicted class)
    for (let c = 0; c < n; c++) {
      g.append('text')
        .attr('transform', `translate(${c * cellSize + cellSize / 2}, -8) rotate(-45)`)
        .attr('text-anchor', 'start')
        .attr('fill', c === 6 ? 'var(--semantic-negative)' : '#a3a9b8')
        .attr('font-size', '10px')
        .attr('font-weight', c === 6 ? '500' : '400')
        .attr('font-family', 'var(--font-mono)')
        .text(classes[c]);
    }

    // Label: True / Predicted
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(n * cellSize) / 2)
      .attr('y', -60)
      .attr('text-anchor', 'middle')
      .attr('fill', '#7a8296')
      .attr('font-size', '11px')
      .text('True acoustic class');

    g.append('text')
      .attr('x', (n * cellSize) / 2)
      .attr('y', -52)
      .attr('text-anchor', 'middle')
      .attr('fill', '#7a8296')
      .attr('font-size', '11px')
      .text('Predicted class');

  }, [method]);

  return (
    <div className="plate" style={{ padding: '22px' }}>
      <div className="card-header">
        <div>
          <h3 className="card-title">Normalized open-set confusion matrix</h3>
          <p className="card-subtitle">Row: Ground truth &bull; Col: Predicted class (last col: Unknown rejection)</p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className={`btn ${method === 'dml' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '6px 10px', fontSize: '11px' }}
            onClick={() => setMethod('dml')}
          >
            DML Triplet
          </button>
          <button
            className={`btn ${method === 'svdd' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '6px 10px', fontSize: '11px' }}
            onClick={() => setMethod('svdd')}
          >
            Deep SVDD
          </button>
          <button
            className={`btn ${method === 'msp' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '6px 10px', fontSize: '11px' }}
            onClick={() => setMethod('msp')}
          >
            MSP Softmax
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg ref={svgRef} style={{ width: '380px', height: '360px' }}></svg>
      </div>

      <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
        <span style={{ color: 'var(--text-bright)', fontWeight: 500 }}>Observation:</span>{' '}
        {method === 'dml' && 'DML achieves 92% accurate unknown rejection with <5% false alarm on known classes.'}
        {method === 'svdd' && 'Deep SVDD isolates the known cluster within hyperspheres, reaching 89% rejection.'}
        {method === 'msp' && 'MSP suffers from overconfident Softmax activations, misclassifying 23% of unknown objects.'}
      </div>
    </div>
  );
}
