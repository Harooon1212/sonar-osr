import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ShieldAlert, CheckCircle, Navigation as NavIcon, Compass } from 'lucide-react';

export default function AuvPatrol() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [telemetry, setTelemetry] = useState({
    depth: 42.4,
    speed: 2.1,
    pingFreq: '3.0 MHz',
    heading: '148° SE'
  });

  const patrolWaypoints = [
    { id: 1, name: 'WP-Alpha', target: 'bottle', sampleImg: '/samples/bottle-sample.png', isKnown: true, score: 0.88, label: 'Known Debris (Glass Bottle)' },
    { id: 2, name: 'WP-Bravo', target: 'can', sampleImg: '/samples/can-sample.png', isKnown: true, score: 0.84, label: 'Known Debris (Metal Can)' },
    { id: 3, name: 'WP-Charlie', target: 'chain', sampleImg: '/samples/chain-sample.png', isKnown: false, score: 0.28, label: 'UNKNOWN ANOMALY (Moor Chain)' },
    { id: 4, name: 'WP-Delta', target: 'tire', sampleImg: '/samples/tire-sample.png', isKnown: true, score: 0.91, label: 'Known Debris (Rubber Tire)' },
    { id: 5, name: 'WP-Echo', target: 'valve', sampleImg: '/samples/valve-sample.png', isKnown: false, score: 0.31, label: 'UNKNOWN ANOMALY (Industrial Valve)' },
    { id: 6, name: 'WP-Foxtrot', target: 'propeller', sampleImg: '/samples/propeller-sample.png', isKnown: true, score: 0.89, label: 'Known Object (Propeller)' },
    { id: 7, name: 'WP-Golf', target: 'shampoo', sampleImg: '/samples/shampoo-sample.png', isKnown: false, score: 0.22, label: 'UNKNOWN ANOMALY (Plastic Flask)' },
  ];

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          const next = (prev + 1) % patrolWaypoints.length;
          const wp = patrolWaypoints[next];
          
          const newLog = {
            time: new Date().toLocaleTimeString(),
            wp: wp.name,
            target: wp.label,
            isKnown: wp.isKnown,
            score: wp.score,
            action: wp.isKnown ? 'Pass / Log Clutter' : 'EVASIVE MANOEUVRE / HOLD'
          };
          setLogs((prevLogs) => [newLog, ...prevLogs.slice(0, 15)]);

          setTelemetry((t) => ({
            ...t,
            depth: +(40 + Math.random() * 5).toFixed(1),
            speed: wp.isKnown ? 2.2 : 0.4,
            heading: `${Math.floor(130 + Math.random() * 30)}° SE`
          }));

          return next;
        });
      }, 2400);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const activeContact = patrolWaypoints[currentStep];

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setLogs([]);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <Compass size={18} style={{ color: 'var(--accent-cyan)' }} />
            Autonomous Underwater Vehicle (AUV) Patrol Simulator
          </h3>
          <p className="card-subtitle">
            Simulates an autonomous seabed survey mission running real-time open-set anomaly rejection
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${isPlaying ? 'btn-outline' : 'btn-primary'}`}
            style={{ padding: '6px 14px', fontSize: '13px' }}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'Halt Mission' : 'Start Patrol'}
          </button>
          <button
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '13px' }}
            onClick={handleReset}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Telemetry HUD Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AUV Depth</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
            {telemetry.depth} m
          </div>
        </div>
        <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Cruising Velocity</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--text-bright)' }}>
            {telemetry.speed} kts
          </div>
        </div>
        <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Acoustic Frequency</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--accent-purple)' }}>
            {telemetry.pingFreq}
          </div>
        </div>
        <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Heading</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--accent-green)' }}>
            {telemetry.heading}
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Active Contact & Seabed Trajectory */}
        <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '16px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-bright)' }}>
              Active Acoustic Contact at {activeContact.name}
            </span>
            <span className={`badge ${activeContact.isKnown ? 'badge-known' : 'badge-unknown'}`}>
              {activeContact.isKnown ? 'Known Seabed Clutter' : 'UNREGISTERED ANOMALY'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', margin: '14px 0' }}>
            <img
              src={activeContact.sampleImg}
              alt={activeContact.label}
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'contain',
                background: '#000',
                borderRadius: 'var(--radius-sm)',
                border: `2px solid ${activeContact.isKnown ? 'var(--accent-green)' : 'var(--accent-red)'}`
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: activeContact.isKnown ? 'var(--semantic-positive)' : 'var(--semantic-negative)' }}>
                {activeContact.label}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Open-set metric confidence: <strong className="font-mono tabular-nums" style={{ color: 'var(--text-bright)' }}>{activeContact.score.toFixed(2)}</strong>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Decision threshold: <strong className="font-mono tabular-nums">τ = 0.50</strong>
              </div>
              <div style={{
                marginTop: '10px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-xs)',
                background: activeContact.isKnown ? 'var(--semantic-positive-subtle)' : 'var(--semantic-negative-subtle)',
                border: `1px solid ${activeContact.isKnown ? 'rgba(76,195,138,0.25)' : 'rgba(229,72,77,0.25)'}`,
                fontSize: '12px',
                fontWeight: 500,
                color: activeContact.isKnown ? 'var(--semantic-positive)' : 'var(--semantic-negative)'
              }}>
                {activeContact.isKnown
                  ? 'Action: Safe to proceed survey (known debris)'
                  : 'Action: Anomaly avoidance triggered (emergency hold)'}
              </div>
            </div>
          </div>

          {/* Waypoint progress bar */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Seabed mission trajectory</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {patrolWaypoints.map((wp, i) => (
                <div
                  key={wp.id}
                  style={{
                    flex: 1,
                    height: '6px',
                    borderRadius: '2px',
                    backgroundColor: i === currentStep ? 'var(--accent-cyan)' : i < currentStep ? 'var(--border-strong)' : 'var(--bg-elevated)',
                    transition: 'background-color 140ms ease'
                  }}
                  title={wp.name}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-Time AUV Telemetry Log */}
        <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '16px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-bright)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Acoustic mission telemetry stream</span>
            <span className="font-mono tabular-nums" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>15 Hz pings</span>
          </div>

          <div style={{
            flex: 1,
            maxHeight: '220px',
            overflowY: 'auto',
            background: 'var(--bg-deepest)',
            borderRadius: 'var(--radius-xs)',
            padding: '10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            border: '1px solid var(--border-subtle)'
          }}>
            {logs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
                Press "Start patrol" to begin autonomous survey
              </div>
            ) : (
              logs.map((l, idx) => (
                <div key={idx} style={{ marginBottom: '6px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>[{l.time}]</span>{' '}
                  <span style={{ color: 'var(--text-bright)' }}>{l.wp}:</span>{' '}
                  <span style={{ color: l.isKnown ? 'var(--semantic-positive)' : 'var(--semantic-negative)' }}>{l.action}</span>{' '}
                  <span style={{ color: 'var(--text-secondary)' }}>({l.target})</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
