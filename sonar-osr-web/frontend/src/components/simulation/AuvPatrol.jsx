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
    { id: 1, name: 'WP-Alpha', target: 'bottle', sampleImg: '/samples/bottle-sample.png', isKnown: true, score: 0.88, label: 'Known debris (glass bottle)' },
    { id: 2, name: 'WP-Bravo', target: 'can', sampleImg: '/samples/can-sample.png', isKnown: true, score: 0.84, label: 'Known debris (metal can)' },
    { id: 3, name: 'WP-Charlie', target: 'chain', sampleImg: '/samples/chain-sample.png', isKnown: false, score: 0.28, label: 'Unknown anomaly (moor chain)' },
    { id: 4, name: 'WP-Delta', target: 'tire', sampleImg: '/samples/tire-sample.png', isKnown: true, score: 0.91, label: 'Known debris (rubber tire)' },
    { id: 5, name: 'WP-Echo', target: 'valve', sampleImg: '/samples/valve-sample.png', isKnown: false, score: 0.31, label: 'Unknown anomaly (industrial valve)' },
    { id: 6, name: 'WP-Foxtrot', target: 'propeller', sampleImg: '/samples/propeller-sample.png', isKnown: true, score: 0.89, label: 'Known object (propeller)' },
    { id: 7, name: 'WP-Golf', target: 'shampoo', sampleImg: '/samples/shampoo-sample.png', isKnown: false, score: 0.22, label: 'Unknown anomaly (plastic flask)' },
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
            action: wp.isKnown ? 'Catalogued / Continue' : 'Anomaly rejected / Evasive waypoint'
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
    <div className="glass" style={{ padding: '24px' }}>
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <Compass size={18} style={{ color: 'var(--glow-cyan)' }} />
            Autonomous underwater vehicle (AUV) patrol simulator
          </h3>
          <p className="card-subtitle">
            Illustrative simulation of an autonomous seabed survey mission running real-time open-set anomaly rejection
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${isPlaying ? 'btn-outline' : 'btn-primary'}`}
            style={{ padding: '6px 14px', fontSize: '13px' }}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'Halt mission' : 'Start patrol'}
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

      {/* Telemetry HUD Inset Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div className="inset" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>AUV depth</div>
          <div className="font-mono tabular-nums" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--glow-cyan)' }}>
            {telemetry.depth} m
          </div>
        </div>
        <div className="inset" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Cruising velocity</div>
          <div className="font-mono tabular-nums" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-bright)' }}>
            {telemetry.speed} kts
          </div>
        </div>
        <div className="inset" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Acoustic frequency</div>
          <div className="font-mono tabular-nums" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--shadow-purple)' }}>
            {telemetry.pingFreq}
          </div>
        </div>
        <div className="inset" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Heading</div>
          <div className="font-mono tabular-nums" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--highlight-green)' }}>
            {telemetry.heading}
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Active Contact Data Plate */}
        <div className="plate" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-bright)' }}>
              Active acoustic contact at {activeContact.name}
            </span>
            <span className={activeContact.isKnown ? 'badge badge-known' : 'badge badge-unknown'}>
              {activeContact.isKnown ? 'Known class verified' : 'Anomaly rejected'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '16px', alignItems: 'center' }}>
            <div style={{ background: '#050811', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-control)', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}>
              <img src={activeContact.sampleImg} alt="Contact" style={{ maxHeight: '128px', maxWidth: '100%', objectFit: 'contain' }} />
            </div>

            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-bright)', marginBottom: '4px' }}>
                {activeContact.label}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Target type: <strong style={{ color: activeContact.isKnown ? 'var(--highlight-green)' : 'var(--alert-red)' }}>
                  {activeContact.isKnown ? 'In-distribution debris' : 'Out-of-distribution obstacle'}
                </strong>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Acoustic confidence: <strong className="font-mono tabular-nums" style={{ color: 'var(--glow-cyan)' }}>{(activeContact.score * 100).toFixed(1)}%</strong>
              </div>
              <div style={{ marginTop: '10px', fontSize: '12px', padding: '6px 10px', borderRadius: 'var(--radius-xs)', background: activeContact.isKnown ? 'var(--semantic-positive-subtle)' : 'var(--semantic-negative-subtle)', color: activeContact.isKnown ? 'var(--highlight-green)' : 'var(--alert-red)', border: activeContact.isKnown ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(239,68,68,0.25)' }}>
                Mission action: {activeContact.isKnown ? 'Survey course maintained' : 'Autonomous obstacle avoidance triggered'}
              </div>
            </div>
          </div>
        </div>

        {/* Mission Event Log Plate */}
        <div className="plate" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-bright)' }}>
              Subsea survey mission log
            </span>
            <span className="badge badge-info font-mono tabular-nums">{logs.length} events</span>
          </div>

          <div style={{ height: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {logs.length === 0 ? (
              <div style={{ color: 'var(--text-faint)', fontSize: '12px', textAlign: 'center', margin: 'auto' }}>
                Click "Start patrol" to begin simulated AUV seabed survey mission.
              </div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="inset" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', fontSize: '11px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="font-mono tabular-nums" style={{ color: 'var(--text-faint)' }}>{log.time}</span>
                    <strong style={{ color: log.isKnown ? 'var(--highlight-green)' : 'var(--alert-red)' }}>{log.wp}</strong>
                    <span style={{ color: 'var(--text-muted)' }}>{log.target}</span>
                  </div>
                  <span className={log.isKnown ? 'badge badge-known' : 'badge badge-unknown'} style={{ fontSize: '10px' }}>
                    {log.action}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
