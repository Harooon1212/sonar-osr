import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand">
            SonarOSR &bull; Open-set acoustic anomaly detection
          </div>
          <p style={{ marginTop: '4px', color: 'var(--text-muted)' }}>
            Final Year Project &bull; Department of Computer Science &bull; Bahria University, Islamabad
          </p>
          <p className="font-mono tabular-nums" style={{ marginTop: '2px', color: 'var(--text-faint)', fontSize: '11px' }}>
            Sound Metrics ARIS Explorer 3000 &bull; 96 Beams &bull; 3.0 MHz
          </p>
        </div>
        <div style={{ textAlign: 'right', fontSize: '12px' }}>
          <div style={{ color: 'var(--text-muted)' }}>
            Authors: Mohammad Khizar Hayat Cheema &bull; Muhammad Haroon
          </div>
          <div style={{ marginTop: '4px', color: 'var(--text-faint)' }}>
            Supervisor: Dr. Arif Ur Rahman &bull; BUIC
          </div>
        </div>
      </div>
    </footer>
  );
}
