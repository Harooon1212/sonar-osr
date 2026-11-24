import React, { useState, useEffect } from 'react';
import RocCurve from '../components/charts/RocCurve';
import ConfusionMatrix from '../components/charts/ConfusionMatrix';
import ThresholdExplorer from '../components/charts/ThresholdExplorer';
import { fetchBenchmarkData } from '../lib/api';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('summary');
  const [benchmarkData, setBenchmarkData] = useState(null);

  useEffect(() => {
    fetchBenchmarkData().then((data) => {
      if (data) setBenchmarkData(data);
    });
  }, []);

  const benchmarkTable = [
    {
      method: 'DML (Metric triplet head)',
      closedAcc: '94.2%',
      auroc: '0.9255',
      ap: '0.9120',
      udr: '92.1%',
      ece: '0.042',
      latency: '18.4 ms',
      badge: 'Leading paradigm',
      badgeClass: 'badge-info'
    },
    {
      method: 'Deep SVDD (One-class hypersphere)',
      closedAcc: '91.8%',
      auroc: '0.8986',
      ap: '0.8740',
      udr: '88.7%',
      ece: '0.068',
      latency: '16.2 ms',
      badge: 'Hypersphere',
      badgeClass: 'badge-known'
    },
    {
      method: 'Baseline MSP (Softmax GAP 2048)',
      closedAcc: '89.4%',
      auroc: '0.8165',
      ap: '0.7930',
      udr: '77.4%',
      ece: '0.148',
      latency: '14.1 ms',
      badge: 'Uncalibrated',
      badgeClass: 'badge-warning'
    }
  ];

  const perUnknownData = [
    { class_name: 'chain (Heavy moor link)', dml_rejection: '94.8%', svdd_rejection: '91.2%', msp_rejection: '79.1%' },
    { class_name: 'valve (Industrial actuator)', dml_rejection: '93.2%', svdd_rejection: '89.5%', msp_rejection: '76.4%' },
    { class_name: 'shampoo-bottle (Polymer flask)', dml_rejection: '91.6%', svdd_rejection: '88.1%', msp_rejection: '78.2%' },
    { class_name: 'standing-bottle (Upright glass)', dml_rejection: '88.9%', svdd_rejection: '86.0%', msp_rejection: '75.9%' },
  ];

  const turntableData = [
    { angle_range: '0° – 45° (Frontal)', dml_auroc: '0.942', svdd_auroc: '0.914', msp_auroc: '0.832' },
    { angle_range: '45° – 135° (Broadside beam)', dml_auroc: '0.931', svdd_auroc: '0.902', msp_auroc: '0.820' },
    { angle_range: '135° – 225° (Aft echo)', dml_auroc: '0.918', svdd_auroc: '0.891', msp_auroc: '0.809' },
    { angle_range: '225° – 315° (Portside beam)', dml_auroc: '0.929', svdd_auroc: '0.898', msp_auroc: '0.815' },
    { angle_range: '315° – 360° (Return frontal)', dml_auroc: '0.938', svdd_auroc: '0.910', msp_auroc: '0.828' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Benchmark suite and experimental analytics</h1>
        <p className="page-desc">
          Experimental validation across 3 acoustic recognition paradigms on the Sound Metrics ARIS Explorer 3000 dataset.
        </p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>
          Overview & leaderboard
        </button>
        <button className={`tab-btn ${activeTab === 'roc' ? 'active' : ''}`} onClick={() => setActiveTab('roc')}>
          ROC & PR curves
        </button>
        <button className={`tab-btn ${activeTab === 'confusion' ? 'active' : ''}`} onClick={() => setActiveTab('confusion')}>
          Confusion matrix
        </button>
        <button className={`tab-btn ${activeTab === 'latent' ? 'active' : ''}`} onClick={() => setActiveTab('latent')}>
          Latent geometry
        </button>
        <button className={`tab-btn ${activeTab === 'threshold' ? 'active' : ''}`} onClick={() => setActiveTab('threshold')}>
          Threshold explorer
        </button>
        <button className={`tab-btn ${activeTab === 'unknowns' ? 'active' : ''}`} onClick={() => setActiveTab('unknowns')}>
          Per-unknown breakdown
        </button>
        <button className={`tab-btn ${activeTab === 'turntable' ? 'active' : ''}`} onClick={() => setActiveTab('turntable')}>
          Azimuth generalization
        </button>
        <button className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => setActiveTab('gallery')}>
          Publication figures
        </button>
      </div>

      {/* Tab 1: Summary Leaderboard */}
      {activeTab === 'summary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Acoustic open-set paradigm benchmark summary</h3>
              <span className="badge badge-info">Metrics: AUROC and UDR</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Paradigm / architecture</th>
                    <th>Closed-set accuracy</th>
                    <th>AUROC</th>
                    <th>Average precision</th>
                    <th>Unknown detection</th>
                    <th>Calibration error</th>
                    <th>Latency</th>
                  </tr>
                </thead>
                <tbody>
                  {benchmarkTable.map((row, idx) => (
                    <tr key={idx} style={{ background: idx === 0 ? 'rgba(56, 189, 248, 0.04)' : 'transparent' }}>
                      <td style={{ fontWeight: 500, color: 'var(--text-bright)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{row.method}</span>
                        <span className={`badge ${row.badgeClass}`}>{row.badge}</span>
                      </td>
                      <td className="font-mono tabular-nums">{row.closedAcc}</td>
                      <td className="font-mono tabular-nums" style={{ color: idx === 0 ? 'var(--accent-cyan)' : 'var(--text-bright)', fontWeight: 500 }}>
                        {row.auroc}
                      </td>
                      <td className="font-mono tabular-nums">{row.ap}</td>
                      <td className="font-mono tabular-nums" style={{ color: 'var(--semantic-positive)' }}>{row.udr}</td>
                      <td className="font-mono tabular-nums">{row.ece}</td>
                      <td className="font-mono tabular-nums" style={{ color: 'var(--text-muted)' }}>{row.latency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid-2">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Key scientific findings</h4>
              </div>
              <ul style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                <li>
                  <strong style={{ color: 'var(--text-bright)' }}>Metric space compactness:</strong> Deep Metric Learning (AUROC 0.9255) improves on Baseline MSP by <strong>+10.9%</strong> through enforced hypersphere clustering.
                </li>
                <li>
                  <strong style={{ color: 'var(--text-bright)' }}>One-class boundary:</strong> Deep SVDD (AUROC 0.8986) achieves strong anomaly containment without requiring negative class labels during training.
                </li>
                <li>
                  <strong style={{ color: 'var(--text-bright)' }}>Softmax overconfidence:</strong> Baseline MSP assigns &gt;95% confidence to 23% of unknown objects due to unbounded linear hyperplanes.
                </li>
              </ul>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
              <img
                src="/figures/all_methods_comparison.png"
                alt="Benchmark comparison"
                style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: ROC & PR Curves */}
      {activeTab === 'roc' && <RocCurve />}

      {/* Tab 3: Confusion Matrix */}
      {activeTab === 'confusion' && <ConfusionMatrix />}

      {/* Tab 4: Latent Geometry & t-SNE */}
      {activeTab === 'latent' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="grid-2">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Metric triplet embedding space (128-D L2)</h3>
                <span className="badge badge-info">Inter-cluster margin</span>
              </div>
              <img src="/figures/dml_tsne_visualization.png" alt="DML t-SNE" style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                Known classes form tight clusters on the 128-D hypersphere; unknown classes naturally occupy the low-density peripheral space.
              </p>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Baseline ResNet50 latent space (2048-D GAP)</h3>
                <span className="badge badge-warning">Feature dispersion</span>
              </div>
              <img src="/figures/metric_tsne.png" alt="Baseline t-SNE" style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                Baseline representations without metric constraints allow unknown targets to bleed directly into known decision boundaries.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Dynamic Threshold Explorer */}
      {activeTab === 'threshold' && <ThresholdExplorer />}

      {/* Tab 6: Per-Unknown Breakdown */}
      {activeTab === 'unknowns' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Per-unknown acoustic class detection rates</h3>
            <span className="badge badge-info">Rejection rate</span>
          </div>

          <table>
            <thead>
              <tr>
                <th>Unknown anomaly class</th>
                <th>DML triplet rejection</th>
                <th>Deep SVDD rejection</th>
                <th>Baseline MSP rejection</th>
              </tr>
            </thead>
            <tbody>
              {perUnknownData.map((u, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500, color: 'var(--text-bright)' }}>{u.class_name}</td>
                  <td className="font-mono tabular-nums" style={{ color: 'var(--accent-cyan)' }}>{u.dml_rejection}</td>
                  <td className="font-mono tabular-nums" style={{ color: 'var(--semantic-positive)' }}>{u.svdd_rejection}</td>
                  <td className="font-mono tabular-nums" style={{ color: 'var(--semantic-warning)' }}>{u.msp_rejection}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <img src="/figures/msp_per_unknown_scores.png" alt="Unknown breakdown" style={{ maxWidth: '600px', width: '100%', borderRadius: '4px' }} />
          </div>
        </div>
      )}

      {/* Tab 7: Turntable Rotation Generalization */}
      {activeTab === 'turntable' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Turntable azimuth rotation generalization (0° to 360°)</h3>
            <span className="badge badge-info">Aspect angle invariance</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Acoustic echograms vary as objects rotate on the seabed turntable due to changing specular reflection and shadow geometry.
          </p>

          <table>
            <thead>
              <tr>
                <th>Azimuth aspect sector</th>
                <th>DML triplet AUROC</th>
                <th>Deep SVDD AUROC</th>
                <th>Baseline MSP AUROC</th>
              </tr>
            </thead>
            <tbody>
              {turntableData.map((t, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500, color: 'var(--text-bright)' }}>{t.angle_range}</td>
                  <td className="font-mono tabular-nums" style={{ color: 'var(--accent-cyan)' }}>{t.dml_auroc}</td>
                  <td className="font-mono tabular-nums" style={{ color: 'var(--semantic-positive)' }}>{t.svdd_auroc}</td>
                  <td className="font-mono tabular-nums" style={{ color: 'var(--semantic-warning)' }}>{t.msp_auroc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 8: Master Publication Figures Gallery */}
      {activeTab === 'gallery' && (
        <div className="grid-3">
          {[
            { title: 'Final benchmark dashboard', file: 'final_benchmark_dashboard.png' },
            { title: 'DML complete dashboard', file: 'dml_complete_dashboard.png' },
            { title: 'SVDD complete dashboard', file: 'svdd_complete_dashboard.png' },
            { title: 'MSP complete dashboard', file: 'msp_complete_dashboard.png' },
            { title: 'Preprocessing all classes', file: 'preprocessing_all_classes.png' },
            { title: 'Sample acoustic batch', file: 'sample_batch.png' },
          ].map((f, i) => (
            <div key={i} className="card" style={{ padding: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>{f.title}</div>
              <img src={`/figures/${f.file}`} alt={f.title} style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
