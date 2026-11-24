import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Cpu, FlaskConical, AlertCircle, CheckCircle2, Layers, Radio } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero Section with Hydroacoustic Radar Viewport (Section 3 Page 1) */}
      <section className="glass" style={{
        padding: '36px 32px',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '24px'
      }}>
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '32px', alignItems: 'center' }}>
          <div>
            <div className="badge badge-info" style={{ marginBottom: '16px' }}>
              <Radio size={12} strokeWidth={1.5} />
              <span>ARIS Explorer 3000 &bull; 3.0 MHz &bull; 96 Beams</span>
            </div>

            <h1 style={{ fontSize: '32px', lineHeight: 1.25, fontWeight: 600, marginBottom: '14px', letterSpacing: '-0.02em', color: 'var(--text-bright)' }}>
              Open-set recognition for underwater sonar imagery
            </h1>

            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '640px', marginBottom: '24px' }}>
              Standard deep neural networks force acoustic echoes into known categories with dangerously high confidence. 
              Our framework equips Autonomous Underwater Vehicles (AUVs) with bounded metric hyperspheres to reject 
              unseen marine hazards and unknown objects in low-visibility seabed environments.
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link to="/demo" className="btn btn-primary">
                <Activity size={15} strokeWidth={1.5} /> Launch live demo
              </Link>
              <Link to="/dashboard" className="btn btn-secondary">
                <Cpu size={15} strokeWidth={1.5} /> Benchmark suite
              </Link>
              <Link to="/lab" className="btn btn-outline">
                <FlaskConical size={15} strokeWidth={1.5} /> Acoustic physics lab
              </Link>
            </div>
          </div>

          {/* Interactive Radar Viewport (Solid black inset viewport, never under blur) */}
          <div style={{ textAlign: 'center' }}>
            <div className="radar-display">
              <div className="radar-crosshair-x"></div>
              <div className="radar-crosshair-y"></div>
              <div className="radar-ring" style={{ width: '70px', height: '70px' }}></div>
              <div className="radar-ring" style={{ width: '150px', height: '150px' }}></div>
              <div className="radar-ring" style={{ width: '230px', height: '230px' }}></div>
              <div className="radar-beam"></div>

              {/* Target blips */}
              <div style={{ position: 'absolute', top: '35%', left: '42%', width: '6px', height: '6px', background: 'var(--highlight-green)', borderRadius: '50%' }} title="Known marine debris"></div>
              <div style={{ position: 'absolute', top: '65%', left: '72%', width: '6px', height: '6px', background: 'var(--alert-red)', borderRadius: '50%' }} title="Unknown anomaly"></div>
            </div>
            <div className="font-mono tabular-nums" style={{ marginTop: '10px', fontSize: '11px', color: 'var(--text-faint)' }}>
              Range 15.0m &bull; Azimuth 30° &bull; 96 Beams
            </div>
          </div>
        </div>
      </section>

      {/* KPI Strip (Section 3: One Glass 1 panel holding four inset tiles) */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-num kpi-accent tabular-nums">0.9255</div>
          <div className="kpi-label">Best AUROC (deep metric learning)</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-num tabular-nums">11.71%</div>
          <div className="kpi-label">Lowest FPR (one-class SVDD)</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-num tabular-nums">94.10%</div>
          <div className="kpi-label">Known-class recall (TPR)</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-num tabular-nums">2,364</div>
          <div className="kpi-label">Dataset images (MD-FLS)</div>
        </div>
      </div>

      {/* Closed-World vs Open-Set Comparison (Glass 2 Cards) */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="glass--card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <AlertCircle size={18} strokeWidth={1.5} style={{ color: 'var(--alert-red)' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 600 }}>The closed-world failure</h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Standard Softmax classifiers divide Euclidean space with linear hyperplanes, leaving unbounded 
            receptive fields. When an AUV encounters novel seabed debris, submerged mines, or structural hazards, 
            the network forces a closed-world label with high artificial confidence (99%+ Softmax probability), 
            causing catastrophic false identifications during autonomous missions.
          </p>
        </div>

        <div className="glass--card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <CheckCircle2 size={18} strokeWidth={1.5} style={{ color: 'var(--highlight-green)' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 600 }}>The open-set solution</h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Our dual-paradigm architecture enforces closed boundaries around known acoustic classes:
            <strong style={{ color: 'var(--text-bright)' }}> One-class SVDD (nearest centroid)</strong> projects known features into high-dimensional clusters, while 
            <strong style={{ color: 'var(--text-bright)' }}> Deep metric learning (DML)</strong> uses semi-hard triplet mining to cluster known classes tightly 
            in a 128-D normalized embedding space. Any query exceeding decision radius τ is rejected as an anomaly.
          </p>
        </div>
      </div>

      {/* Pipeline Architecture Strip */}
      <div className="glass--card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">
            <Layers size={16} strokeWidth={1.5} style={{ color: 'var(--glow-cyan)' }} />
            End-to-end processing & decision pipeline
          </h3>
          <span className="badge badge-info">Zero data leakage protocol</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '12px' }}>
          <div className="inset" style={{ padding: '14px' }}>
            <div className="font-mono" style={{ color: 'var(--glow-cyan)', fontSize: '11px', marginBottom: '4px' }}>Phase 1</div>
            <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '4px', color: 'var(--text-bright)' }}>Acoustic denoising</div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Median filtering attenuates multiplicative Rayleigh speckle; CLAHE equalizes acoustic attenuation across sensor range bins.
            </p>
          </div>

          <div className="inset" style={{ padding: '14px' }}>
            <div className="font-mono" style={{ color: 'var(--glow-cyan)', fontSize: '11px', marginBottom: '4px' }}>Phase 2</div>
            <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '4px', color: 'var(--text-bright)' }}>Physics decomposition</div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Otsu and percentile decomposition isolates specular target backscatter, acoustic occlusion shadow, and seabed reverberation.
            </p>
          </div>

          <div className="inset" style={{ padding: '14px' }}>
            <div className="font-mono" style={{ color: 'var(--glow-cyan)', fontSize: '11px', marginBottom: '4px' }}>Phase 3</div>
            <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '4px', color: 'var(--text-bright)' }}>Feature embedding</div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              ResNet-50 backbone maps acoustic echograms into 2048-D latent representations, projected to a 128-D L2 hypersphere.
            </p>
          </div>

          <div className="inset" style={{ padding: '14px' }}>
            <div className="font-mono" style={{ color: 'var(--glow-cyan)', fontSize: '11px', marginBottom: '4px' }}>Phase 4</div>
            <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '4px', color: 'var(--text-bright)' }}>Open-set decision</div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Euclidean distance to class centroids is scored against τ: accepted points receive closed-set labels; outliers trigger anomaly avoidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
