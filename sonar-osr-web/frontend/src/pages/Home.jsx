import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Cpu, FlaskConical, AlertCircle, CheckCircle2, Layers, Radio, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero Section: Apple VisionOS Spatial Dark Glass Window */}
      <section className="apple-glass-window" style={{
        padding: '36px 36px',
        marginBottom: '24px',
        position: 'relative'
      }}>
        <div className="window-body">
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '36px', alignItems: 'center' }}>
            <div>
              <div className="vision-badge" style={{ marginBottom: '18px' }}>
                <Radio size={13} strokeWidth={1.5} style={{ color: 'var(--glow-cyan)' }} />
                <span>ARIS Explorer 3000 &bull; 3.0 MHz &bull; 96 Beams</span>
              </div>

              <h1 style={{ fontSize: '34px', lineHeight: 1.2, fontWeight: 600, marginBottom: '16px', letterSpacing: '-0.025em', color: 'var(--text-bright)' }}>
                Open-set recognition for underwater sonar imagery
              </h1>

              <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: '640px', marginBottom: '28px' }}>
                Standard deep neural networks force acoustic echoes into known categories with dangerously high false confidence. 
                Our framework equips Autonomous Underwater Vehicles (AUVs) with bounded metric hyperspheres to safely reject 
                unseen marine hazards and unknown objects in low-visibility seabed environments.
              </p>

              {/* Action Buttons: VisionOS Glass Pill Button (Reference 1) */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to="/demo" className="apple-liquid-pill">
                  <span>Launch live demo</span>
                  <div className="apple-pill-circle">
                    <ChevronRight size={14} strokeWidth={2.5} />
                  </div>
                </Link>

                <Link to="/dashboard" className="apple-glass-btn-subtle">
                  <Cpu size={15} strokeWidth={1.5} />
                  <span>Benchmark suite</span>
                </Link>

                <Link to="/lab" className="apple-glass-btn-subtle">
                  <FlaskConical size={15} strokeWidth={1.5} />
                  <span>Acoustic lab</span>
                </Link>
              </div>
            </div>

            {/* Hydroacoustic Radar encased in VisionOS Spatial Lens Housing */}
            <div style={{ textAlign: 'center' }}>
              <div className="vision-radar-housing">
                <div className="radar-display">
                  <div className="radar-crosshair-x"></div>
                  <div className="radar-crosshair-y"></div>
                  <div className="radar-ring" style={{ width: '70px', height: '70px' }}></div>
                  <div className="radar-ring" style={{ width: '150px', height: '150px' }}></div>
                  <div className="radar-ring" style={{ width: '230px', height: '230px' }}></div>
                  <div className="radar-beam"></div>

                  {/* Target echoes */}
                  <div style={{ position: 'absolute', top: '35%', left: '42%', width: '7px', height: '7px', background: 'var(--highlight-green)', borderRadius: '50%', boxShadow: '0 0 10px #34d399' }} title="Known marine debris: Bottle"></div>
                  <div style={{ position: 'absolute', top: '65%', left: '72%', width: '7px', height: '7px', background: 'var(--alert-red)', borderRadius: '50%', boxShadow: '0 0 10px #f87171' }} title="Unknown anomaly"></div>
                </div>
              </div>
              <div className="font-mono tabular-nums" style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-faint)', letterSpacing: '0.04em' }}>
                RANGE 15.0m &bull; AZIMUTH 30° &bull; 96 BEAMS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Strip: Apple VisionOS Window holding recessed spatial trays */}
      <div className="apple-glass-window" style={{ padding: '14px', marginBottom: '24px' }}>
        <div className="window-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            
            <div className="apple-recessed-plate" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Primary Metric</span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--glow-cyan)' }}></span>
              </div>
              <div className="font-mono tabular-nums" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--glow-cyan)', letterSpacing: '-0.02em' }}>
                0.9255
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-bright)', fontWeight: 500, marginTop: '2px' }}>
                Best AUROC (DML)
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '2px' }}>
                Semi-hard triplets &bull; Margin 0.20
              </div>
            </div>

            <div className="apple-recessed-plate" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Safety Margin</span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--highlight-green)' }}></span>
              </div>
              <div className="font-mono tabular-nums" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--highlight-green)', letterSpacing: '-0.02em' }}>
                11.71%
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-bright)', fontWeight: 500, marginTop: '2px' }}>
                Lowest FPR (SVDD)
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '2px' }}>
                Defensive underwater navigation
              </div>
            </div>

            <div className="apple-recessed-plate" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Known Accuracy</span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#38bdf8' }}></span>
              </div>
              <div className="font-mono tabular-nums" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-bright)', letterSpacing: '-0.02em' }}>
                94.10%
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-bright)', fontWeight: 500, marginTop: '2px' }}>
                Known-class recall (TPR)
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '2px' }}>
                Closed-set validation
              </div>
            </div>

            <div className="apple-recessed-plate" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Corpus</span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#a855f7' }}></span>
              </div>
              <div className="font-mono tabular-nums" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-bright)', letterSpacing: '-0.02em' }}>
                2,364
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-bright)', fontWeight: 500, marginTop: '2px' }}>
                Dataset images (MD-FLS)
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '2px' }}>
                Turbid seawater tank acoustic echoes
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Closed-World vs Open-Set Comparison (VisionOS Spatial Windows) */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="apple-glass-window" style={{ padding: '24px' }}>
          <div className="window-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertCircle size={16} strokeWidth={2} style={{ color: 'var(--alert-red)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-bright)' }}>The closed-world failure</h3>
                <span style={{ fontSize: '11px', color: 'var(--alert-red)', fontFamily: 'var(--font-mono)' }}>Standard Softmax classification</span>
              </div>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.65 }}>
              Standard Softmax classifiers divide Euclidean space with linear hyperplanes, leaving unbounded 
              receptive fields. When an AUV encounters novel seabed debris, submerged mines, or structural hazards, 
              the network forces a closed-world label with high artificial confidence (99%+ Softmax probability), 
              causing catastrophic false identifications during autonomous missions.
            </p>
            <div className="apple-recessed-plate" style={{ padding: '10px 14px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-faint)' }}>MSP Decision Boundary</span>
              <span style={{ color: 'var(--alert-red)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Unbounded &bull; AUROC 0.8165</span>
            </div>
          </div>
        </div>

        <div className="apple-glass-window" style={{ padding: '24px' }}>
          <div className="window-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={16} strokeWidth={2} style={{ color: 'var(--highlight-green)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-bright)' }}>The open-set solution</h3>
                <span style={{ fontSize: '11px', color: 'var(--highlight-green)', fontFamily: 'var(--font-mono)' }}>Bounded metric hyperspheres</span>
              </div>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.65 }}>
              Our dual-paradigm architecture enforces closed boundaries around known acoustic classes:
              <strong style={{ color: 'var(--text-bright)' }}> One-class SVDD (nearest centroid)</strong> projects known features into high-dimensional clusters, while 
              <strong style={{ color: 'var(--text-bright)' }}> Deep metric learning (DML)</strong> uses semi-hard triplet mining to cluster known classes tightly 
              in a 128-D normalized embedding space. Any query exceeding decision radius τ is rejected as an anomaly.
            </p>
            <div className="apple-recessed-plate" style={{ padding: '10px 14px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-faint)' }}>DML Decision Boundary</span>
              <span style={{ color: 'var(--highlight-green)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Bounded Radius &bull; AUROC 0.9255</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Architecture Strip (Apple VisionOS Spatial Window) */}
      <div className="apple-glass-window" style={{ padding: '28px 32px', marginBottom: '24px' }}>
        <div className="window-body">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={16} strokeWidth={2} style={{ color: 'var(--glow-cyan)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-bright)' }}>End-to-end processing & decision pipeline</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-faint)' }}>Four-stage acoustic signal transformation and inference</span>
              </div>
            </div>
            <span className="vision-badge font-mono text-[11px]">Zero data leakage protocol</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            
            <div className="apple-recessed-plate" style={{ padding: '16px' }}>
              <div className="font-mono" style={{ color: 'var(--glow-cyan)', fontSize: '11px', marginBottom: '4px', fontWeight: 600 }}>PHASE 01</div>
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px', color: 'var(--text-bright)' }}>Acoustic denoising</div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                Median filtering attenuates multiplicative Rayleigh speckle; CLAHE equalizes acoustic attenuation across sensor range bins.
              </p>
            </div>

            <div className="apple-recessed-plate" style={{ padding: '16px' }}>
              <div className="font-mono" style={{ color: 'var(--glow-cyan)', fontSize: '11px', marginBottom: '4px', fontWeight: 600 }}>PHASE 02</div>
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px', color: 'var(--text-bright)' }}>Physics decomposition</div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                Otsu and percentile decomposition isolates specular target backscatter, acoustic occlusion shadow, and seabed reverberation.
              </p>
            </div>

            <div className="apple-recessed-plate" style={{ padding: '16px' }}>
              <div className="font-mono" style={{ color: 'var(--glow-cyan)', fontSize: '11px', marginBottom: '4px', fontWeight: 600 }}>PHASE 03</div>
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px', color: 'var(--text-bright)' }}>Feature embedding</div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                ResNet-50 backbone maps acoustic echograms into 2048-D latent representations, projected to a 128-D L2 hypersphere.
              </p>
            </div>

            <div className="apple-recessed-plate" style={{ padding: '16px' }}>
              <div className="font-mono" style={{ color: 'var(--glow-cyan)', fontSize: '11px', marginBottom: '4px', fontWeight: 600 }}>PHASE 04</div>
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px', color: 'var(--text-bright)' }}>Open-set decision</div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                Euclidean distance to class centroids is scored against τ: accepted points receive closed-set labels; outliers trigger anomaly avoidance.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}