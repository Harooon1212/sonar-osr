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
            Final Year Project &bull; Department of Computer Science &bull; Bahria University Islamabad
          </p>
          <p className="font-mono tabular-nums" style={{ marginTop: '2px', color: 'var(--text-muted)', fontSize: '11px' }}>
            Sound Metrics ARIS Explorer 3000 &bull; 96 Beams &bull; 3.0 MHz
          </p>
        </div>
        <div style={{ textAlign: 'right', fontSize: '12px' }}>
          <div style={{ color: 'var(--text-secondary)' }}>Department of Computer Science, BUIC</div>
          <div style={{ marginTop: '4px', color: 'var(--text-muted)' }}>
            Deep Metric Learning &bull; Deep SVDD &bull; Baseline MSP
          </div>
        </div>
      </div>
    </footer>
  );
}
