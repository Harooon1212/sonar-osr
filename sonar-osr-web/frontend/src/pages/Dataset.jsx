import React from 'react';
import { Database, Radio, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function Dataset() {
  const knownClasses = [
    { name: 'bottle', desc: 'Glass beverage container', samples: '449 echograms', sampleImg: '/samples/bottle-sample.png' },
    { name: 'can', desc: 'Aluminum beverage can', samples: '367 echograms', sampleImg: '/samples/can-sample.png' },
    { name: 'tire', desc: 'Submerged vehicle tire', samples: '331 echograms', sampleImg: '/samples/tire-sample.png' },
    { name: 'drink-carton', desc: 'Tetra Pak beverage carton', samples: '349 echograms', sampleImg: '/samples/bottle-sample.png' },
    { name: 'hook', desc: 'Marine mooring hook (upweighted)', samples: '133 echograms', sampleImg: '/samples/bottle-sample.png' },
    { name: 'propeller', desc: 'Bronze boat propeller (upweighted)', samples: '137 echograms', sampleImg: '/samples/propeller-sample.png' },
  ];

  const unknownClasses = [
    { name: 'chain', desc: 'Heavy seabed moor chain', samples: '226 echograms', sampleImg: '/samples/chain-sample.png' },
    { name: 'valve', desc: 'Subsea pipeline valve actuator', samples: '208 echograms', sampleImg: '/samples/valve-sample.png' },
    { name: 'shampoo-bottle', desc: 'High-density polymer flask', samples: '99 echograms', sampleImg: '/samples/shampoo-sample.png' },
    { name: 'standing-bottle', desc: 'Upright orientation glass bottle', samples: '65 echograms', sampleImg: '/samples/valve-sample.png' },
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
      <div className="glass--card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <h3 className="card-title">
            <Radio size={16} strokeWidth={1.5} style={{ color: 'var(--glow-cyan)' }} />
            Sensor specifications: Sound Metrics ARIS Explorer 3000
          </h3>
          <span className="badge badge-info font-mono">Acoustic camera</span>
        </div>

        <div className="grid-4" style={{ marginTop: '12px' }}>
          <div className="inset" style={{ padding: '14px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Acoustic frequency</div>
            <div className="font-mono tabular-nums" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-bright)', marginTop: '2px' }}>3.0 MHz / 1.8 MHz</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Identification & detection modes</div>
          </div>
          <div className="inset" style={{ padding: '14px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Beam array</div>
            <div className="font-mono tabular-nums" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-bright)', marginTop: '2px' }}>128 acoustic beams</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>0.25° angular resolution</div>
          </div>
          <div className="inset" style={{ padding: '14px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Field of view</div>
            <div className="font-mono tabular-nums" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-bright)', marginTop: '2px' }}>30° Azimuth &times; 14° Elev</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Forward acoustic cone</div>
          </div>
          <div className="inset" style={{ padding: '14px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Dataset partitioning</div>
            <div className="font-mono tabular-nums" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-bright)', marginTop: '2px' }}>2,364 total frames</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>1,766 known &bull; 598 unknown</div>
          </div>
        </div>
      </div>

      {/* Class Splits */}
      <div className="grid-2" style={{ marginBottom: '20px' }}>
        {/* Known Classes */}
        <div className="glass--card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <ShieldCheck size={16} strokeWidth={1.5} style={{ color: 'var(--highlight-green)' }} />
                6 known classes (in-distribution)
              </h3>
              <p className="card-subtitle">1,233 train &bull; 262 validation &bull; 271 test</p>
            </div>
            <span className="badge badge-known font-mono tabular-nums">1,766 echograms</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {knownClasses.map((c, i) => (
              <div key={i} className="inset" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '13px', color: 'var(--text-bright)' }}>{c.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.desc}</div>
                </div>
                <span className="badge badge-info font-mono tabular-nums" style={{ fontSize: '11px' }}>{c.samples}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Unknown Classes */}
        <div className="glass--card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <ShieldAlert size={16} strokeWidth={1.5} style={{ color: 'var(--alert-red)' }} />
                4 unknown classes (out-of-distribution)
              </h3>
              <p className="card-subtitle">Strictly reserved for zero-shot open-set anomaly testing</p>
            </div>
            <span className="badge badge-unknown font-mono tabular-nums">598 echograms</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {unknownClasses.map((c, i) => (
              <div key={i} className="inset" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '13px', color: 'var(--text-bright)' }}>{c.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.desc}</div>
                </div>
                <span className="badge badge-unknown font-mono tabular-nums" style={{ fontSize: '11px' }}>{c.samples}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dataset Visualizations (Inside Data Plates, NO blur) */}
      <div className="grid-2">
        <div className="plate" style={{ padding: '20px' }}>
          <div className="card-header">
            <h4 className="card-title">Class distribution balance</h4>
          </div>
          <img src="/figures/class_distribution.png" alt="Class distribution" style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
        </div>

        <div className="plate" style={{ padding: '20px' }}>
          <div className="card-header">
            <h4 className="card-title">Acoustic intensity pixel distributions</h4>
          </div>
          <img src="/figures/pixel_distributions.png" alt="Pixel distribution" style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
        </div>
      </div>
    </div>
  );
}
