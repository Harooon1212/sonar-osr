import React from 'react';
import { GraduationCap, Code2 } from 'lucide-react';

export default function About() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Final year project and research team</h1>
        <p className="page-desc">
          Open-Set Recognition (OSR) using Underwater SONAR Images &bull; Department of Computer Science &bull; Bahria University Islamabad
        </p>
      </div>

      <div className="grid-sidebar">
        {/* Left Card: University & Academic Creds */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-strong)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <GraduationCap size={28} strokeWidth={1.5} style={{ color: 'var(--accent-cyan)' }} />
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '2px', color: 'var(--text-bright)' }}>Bahria University</h3>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Islamabad Campus (E-8)</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Department of Computer Science
            </div>

            <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <div><strong style={{ color: 'var(--text-bright)' }}>Degree:</strong> Bachelor of Science in Computer Science (BSCS)</div>
              <div style={{ marginTop: '6px' }}><strong style={{ color: 'var(--text-bright)' }}>Domain:</strong> Underwater Acoustic Robotics & Vision</div>
              <div style={{ marginTop: '6px' }}><strong style={{ color: 'var(--text-bright)' }}>Year:</strong> 2026 Final Year Project</div>
            </div>
          </div>

          <div className="card">
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-bright)' }}>
              <Code2 size={15} strokeWidth={1.5} style={{ color: 'var(--accent-cyan)' }} />
              Technology stack
            </div>
            <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', listStyle: 'none', lineHeight: 1.8 }}>
              <li>&bull; <strong style={{ color: 'var(--text-bright)' }}>Frontend:</strong> React 18, Vite, D3.js (v7), Lucide Icons</li>
              <li>&bull; <strong style={{ color: 'var(--text-bright)' }}>Backend:</strong> FastAPI, Uvicorn, Python 3.10</li>
              <li>&bull; <strong style={{ color: 'var(--text-bright)' }}>Deep learning:</strong> PyTorch, torchvision, Albumentations</li>
              <li>&bull; <strong style={{ color: 'var(--text-bright)' }}>Acoustic sensor:</strong> ARIS Explorer 3000 (96 beams)</li>
            </ul>
          </div>
        </div>

        {/* Right Area: Project Motivation & Supervisor Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Research abstract and project scope</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Autonomous Underwater Vehicles (AUVs) navigating murky subsea environments face severe limitations 
              when using optical sensors due to turbidity and light attenuation. Acoustic forward-looking sonar provides 
              critical long-range visibility, but traditional closed-set deep classifiers fail catastrophically by 
              mistaking novel obstacles, discarded marine clutter, and unexploded ordnances for known objects with 
              unrealistically high confidence.
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '12px' }}>
              This research introduces a bounded metric space open-set recognition framework. By combining 
              speckle-reduction filtering, acoustic highlight/shadow physics decomposition, and semi-hard triplet metric 
              learning, our system achieves an <strong style={{ color: 'var(--text-bright)' }}>AUROC of 0.9255</strong> on zero-shot anomaly detection, 
              preventing catastrophic false-accept decisions in autonomous subsea exploration.
            </p>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Supervision and faculty guidance</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 500 }}>Project supervisor</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-bright)', marginTop: '4px' }}>
                  Dr. Arif Ur Rahman
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Department of Computer Science &bull; Bahria University Islamabad
                </div>
              </div>

              <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--semantic-positive)', fontWeight: 500 }}>Student researcher</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-bright)', marginTop: '4px' }}>
                  Haroon
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  BS Computer Science &bull; Final Year Project 2026
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
