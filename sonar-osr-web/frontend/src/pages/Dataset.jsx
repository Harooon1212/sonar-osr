import React from 'react';
import { Database, Radio, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function Dataset() {
  const knownClasses = [
    { name: 'bottle', desc: 'Glass beverage container', samples: '96 echograms', sampleImg: '/samples/bottle-sample.png' },
    { name: 'can', desc: 'Aluminum beverage can', samples: '96 echograms', sampleImg: '/samples/can-sample.png' },
    { name: 'tire', desc: 'Submerged vehicle tire', samples: '96 echograms', sampleImg: '/samples/tire-sample.png' },
    { name: 'drink-carton', desc: 'Tetra Pak carton', samples: '96 echograms', sampleImg: '/samples/bottle-sample.png' },
    { name: 'hook', desc: 'Marine mooring hook', samples: '96 echograms', sampleImg: '/samples/bottle-sample.png' },
    { name: 'propeller', desc: 'Bronze boat propeller', samples: '96 echograms', sampleImg: '/samples/propeller-sample.png' },
  ];

  const unknownClasses = [
    { name: 'chain', desc: 'Heavy seabed moor chain', samples: '96 echograms', sampleImg: '/samples/chain-sample.png' },
    { name: 'valve', desc: 'Subsea pipeline valve actuator', samples: '96 echograms', sampleImg: '/samples/valve-sample.png' },
    { name: 'shampoo-bottle', desc: 'High-density polymer flask', samples: '96 echograms', sampleImg: '/samples/shampoo-sample.png' },
    { name: 'standing-bottle', desc: 'Upright orientation glass bottle', samples: '96 echograms', sampleImg: '/samples/valve-sample.png' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Acoustic dataset and open-set splits</h1>
        <p className="page-desc">
          Sound Metrics ARIS Explorer 3000 high-frequency forward-looking multibeam sonar echograms with strict zero-leakage partitioning.
        </p>
      </div>

      {/* Sensor Specifications Strip */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <h3 className="card-title">
            <Radio size={16} strokeWidth={1.5} style={{ color: 'var(--accent-cyan)' }} />
            Sensor specifications: Sound Metrics ARIS Explorer 3000
          </h3>
          <span className="badge badge-info font-mono">Acoustic camera</span>
        </div>

        <div className="grid-4" style={{ marginTop: '12px' }}>
          <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Acoustic frequency</div>
            <div className="font-mono tabular-nums" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-bright)', marginTop: '2px' }}>3.0 MHz / 1.8 MHz</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Dual-frequency operation</div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Beam array</div>
            <div className="font-mono tabular-nums" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-bright)', marginTop: '2px' }}>96 acoustic beams</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>0.3° beamwidth</div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Field of view</div>
            <div className="font-mono tabular-nums" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-bright)', marginTop: '2px' }}>30° Azimuth &times; 14° Elev</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Forward acoustic cone</div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Range & rate</div>
            <div className="font-mono tabular-nums" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-bright)', marginTop: '2px' }}>0.7m – 15m @ 15 Hz</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Real-time subsea telemetry</div>
          </div>
        </div>
      </div>

      {/* Class Splits */}
      <div className="grid-2" style={{ marginBottom: '20px' }}>
        {/* Known Classes */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <ShieldCheck size={16} strokeWidth={1.5} style={{ color: 'var(--semantic-positive)' }} />
                6 known classes (in-distribution)
              </h3>
              <p className="card-subtitle">Used during training and validation</p>
            </div>
            <span className="badge badge-known font-mono tabular-nums">576 echograms</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {knownClasses.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-elevated)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '13px', color: 'var(--text-bright)' }}>{c.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.desc}</div>
                </div>
                <span className="badge badge-info font-mono tabular-nums" style={{ fontSize: '10px' }}>{c.samples}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Unknown Classes */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <ShieldAlert size={16} strokeWidth={1.5} style={{ color: 'var(--semantic-negative)' }} />
                4 unknown classes (out-of-distribution)
              </h3>
              <p className="card-subtitle">Reserved for zero-shot open-set anomaly evaluation</p>
            </div>
            <span className="badge badge-unknown font-mono tabular-nums">384 echograms</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {unknownClasses.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-elevated)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '13px', color: 'var(--text-bright)' }}>{c.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.desc}</div>
                </div>
                <span className="badge badge-unknown font-mono tabular-nums" style={{ fontSize: '10px' }}>{c.samples}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dataset Visualizations */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Class distribution balance</h4>
          </div>
          <img src="/figures/class_distribution.png" alt="Class distribution" style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
        </div>

        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Acoustic intensity pixel distributions</h4>
          </div>
          <img src="/figures/pixel_distributions.png" alt="Pixel distribution" style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
        </div>
      </div>
    </div>
  );
}
