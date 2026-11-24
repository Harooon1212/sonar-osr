import React from 'react';
import { GraduationCap, Code2, Users, BookOpen, Quote } from 'lucide-react';

export default function About() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Final year project and research team</h1>
        <p className="page-desc">
          Open-Set Recognition (OSR) for Underwater Forward-Looking Sonar (FLS) Imagery &bull; Department of Computer Science &bull; Bahria University, Islamabad
        </p>
      </div>

      <div className="grid-sidebar">
        {/* Left Sidebar: University & Technical Specs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass--card" style={{ textAlign: 'center', padding: '24px 18px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 16px',
              borderRadius: 'var(--radius-control)',
              background: 'var(--accent-blue)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--glass-edge)'
            }}>
              <GraduationCap size={28} strokeWidth={1.5} style={{ color: 'var(--glow-cyan)' }} />
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '2px', color: 'var(--text-bright)' }}>Bahria University</h3>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Islamabad Campus (E-8)</div>
            <div style={{ fontSize: '12px', color: 'var(--text-faint)', marginTop: '4px' }}>
              Department of Computer Science
            </div>

            <div style={{ marginTop: '20px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-muted)' }}>
              <div><strong style={{ color: 'var(--text-bright)' }}>Degree:</strong> BS Computer Science (BSCS)</div>
              <div style={{ marginTop: '6px' }}><strong style={{ color: 'var(--text-bright)' }}>Domain:</strong> Underwater Acoustic Robotics & Vision</div>
              <div style={{ marginTop: '6px' }}><strong style={{ color: 'var(--text-bright)' }}>Year:</strong> 2026 Final Year Project</div>
            </div>
          </div>

          <div className="glass--card">
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-bright)' }}>
              <Code2 size={16} strokeWidth={1.5} style={{ color: 'var(--glow-cyan)' }} />
              Technology stack
            </div>
            <ul style={{ fontSize: '12px', color: 'var(--text-muted)', listStyle: 'none', lineHeight: 1.8 }}>
              <li>&bull; <strong style={{ color: 'var(--text-bright)' }}>Frontend:</strong> React 18, Vite, D3.js (v7), Lucide Icons</li>
              <li>&bull; <strong style={{ color: 'var(--text-bright)' }}>Styling:</strong> Glassmorphism token architecture</li>
              <li>&bull; <strong style={{ color: 'var(--text-bright)' }}>Backend:</strong> FastAPI, PyTorch (CPU), Uvicorn</li>
              <li>&bull; <strong style={{ color: 'var(--text-bright)' }}>Deep learning:</strong> ResNet-50, Triplet loss, Deep SVDD</li>
              <li>&bull; <strong style={{ color: 'var(--text-bright)' }}>Acoustic sensor:</strong> ARIS Explorer 3000 (96 beams)</li>
            </ul>
          </div>
        </div>

        {/* Right Content: Abstract, Team Members & Supervisor, Citations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass--card">
            <div className="card-header">
              <h3 className="card-title">Research abstract and project scope</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              Autonomous Underwater Vehicles (AUVs) navigating murky subsea environments face severe limitations 
              when using optical sensors due to turbidity and light attenuation. Acoustic forward-looking sonar provides 
              critical long-range visibility, but traditional closed-set deep classifiers fail catastrophically by 
              mistaking novel obstacles, discarded marine clutter, and unexploded ordnances for known objects with 
              dangerously high artificial confidence.
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7, marginTop: '12px' }}>
              This research introduces a bounded metric space open-set recognition framework. By combining 
              speckle-reduction filtering, acoustic highlight/shadow physics decomposition, and semi-hard triplet metric 
              learning, our system achieves an <strong style={{ color: 'var(--text-bright)' }}>AUROC of 0.9255</strong> on zero-shot anomaly detection, 
              preventing catastrophic false-accept decisions in autonomous subsea exploration.
            </p>
          </div>

          {/* Research Authors & Supervisor (from design.md) */}
          <div className="glass--card">
            <div className="card-header">
              <h3 className="card-title">
                <Users size={16} strokeWidth={1.5} style={{ color: 'var(--glow-cyan)' }} />
                Research team and supervision
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              <div className="inset" style={{ padding: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--glow-cyan)', fontWeight: 500 }}>Project supervisor</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-bright)', marginTop: '4px' }}>
                  Dr. Arif Ur Rahman
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-faint)', marginTop: '2px' }}>
                  Department of Computer Science &bull; Bahria University
                </div>
              </div>

              <div className="inset" style={{ padding: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--highlight-green)', fontWeight: 500 }}>Student researcher</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-bright)', marginTop: '4px' }}>
                  Mohammad Khizar Hayat Cheema
                </div>
                <div className="font-mono" style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '2px' }}>
                  Enrollment: 01-134231-039
                </div>
              </div>

              <div className="inset" style={{ padding: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--highlight-green)', fontWeight: 500 }}>Student researcher</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-bright)', marginTop: '4px' }}>
                  Muhammad Haroon
                </div>
                <div className="font-mono" style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '2px' }}>
                  Enrollment: 01-134231-052
                </div>
              </div>
            </div>
          </div>

          {/* Academic Citations from Section 3 Page 9 of design.md */}
          <div className="glass--card">
            <div className="card-header">
              <h3 className="card-title">
                <BookOpen size={16} strokeWidth={1.5} style={{ color: 'var(--glow-cyan)' }} />
                Academic references and dataset citations
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="plate" style={{ padding: '12px 14px', fontSize: '12px', lineHeight: 1.6, color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-bright)' }}>MD-FLS Dataset:</strong> Valdenegro-Toro, M. (2019). <em>Marine Debris Forward-Looking Sonar Dataset: Watertank release</em>. Sound Metrics ARIS Explorer 3000 high-frequency multibeam acoustic imagery.
              </div>
              <div className="plate" style={{ padding: '12px 14px', fontSize: '12px', lineHeight: 1.6, color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-bright)' }}>Open-Set Recognition:</strong> Scheirer, W. J., de Rocha, A., Micheals, R. J., & Boult, T. E. (2013). <em>Toward Open Set Recognition</em>. IEEE TPAMI, 35(7), 1757–1772.
              </div>
              <div className="plate" style={{ padding: '12px 14px', fontSize: '12px', lineHeight: 1.6, color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-bright)' }}>Baseline MSP:</strong> Hendrycks, D., & Gimpel, K. (2017). <em>A Baseline for Detecting Misclassified and Out-of-Distribution Examples in Neural Networks</em>. ICLR.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
