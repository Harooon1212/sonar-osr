import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Compass, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Card, CardHeader } from '../../ui/Card';
import Badge from '../../ui/Badge';
import { cn } from '../../lib/cn';

const WAYPOINTS = [
  { id: 1, name: 'WP-Alpha', x: 12, y: 68, target: 'bottle', sampleImg: '/samples/bottle-sample.png', isKnown: true, score: 0.88, label: 'Known debris (glass bottle)' },
  { id: 2, name: 'WP-Bravo', x: 26, y: 42, target: 'can', sampleImg: '/samples/can-sample.png', isKnown: true, score: 0.84, label: 'Known debris (metal can)' },
  { id: 3, name: 'WP-Charlie', x: 40, y: 58, target: 'chain', sampleImg: '/samples/chain-sample.png', isKnown: false, score: 0.28, label: 'Unknown anomaly (moor chain)' },
  { id: 4, name: 'WP-Delta', x: 54, y: 30, target: 'tire', sampleImg: '/samples/tire-sample.png', isKnown: true, score: 0.91, label: 'Known debris (rubber tire)' },
  { id: 5, name: 'WP-Echo', x: 68, y: 62, target: 'valve', sampleImg: '/samples/valve-sample.png', isKnown: false, score: 0.31, label: 'Unknown anomaly (industrial valve)' },
  { id: 6, name: 'WP-Foxtrot', x: 80, y: 36, target: 'propeller', sampleImg: '/samples/propeller-sample.png', isKnown: true, score: 0.89, label: 'Known object (propeller)' },
  { id: 7, name: 'WP-Golf', x: 90, y: 55, target: 'shampoo', sampleImg: '/samples/shampoo-sample.png', isKnown: false, score: 0.22, label: 'Unknown anomaly (plastic flask)' },
];

export default function AuvPatrol() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [telemetry, setTelemetry] = useState({
    depth: 42.4,
    speed: 2.1,
    pingFreq: '3.0 MHz',
    heading: '148° SE',
  });

  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % WAYPOINTS.length;
        const wp = WAYPOINTS[next];

        const entry = {
          id: `${Date.now()}-${next}`,
          time: new Date().toLocaleTimeString(),
          wp: wp.name,
          target: wp.label,
          isKnown: wp.isKnown,
          score: wp.score,
          action: wp.isKnown ? 'Catalogued / Continue' : 'Anomaly rejected / Evasive waypoint',
        };
        setLogs((prevLogs) => [entry, ...prevLogs.slice(0, 15)]);
        setTelemetry({
          depth: +(40 + Math.random() * 5).toFixed(1),
          speed: wp.isKnown ? 2.2 : 0.4,
          pingFreq: '3.0 MHz',
          heading: `${Math.floor(130 + Math.random() * 30)}° SE`,
        });
        return next;
      });
    }, 2400);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const active = WAYPOINTS[currentStep];

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setLogs([]);
    setTelemetry({ depth: 42.4, speed: 2.1, pingFreq: '3.0 MHz', heading: '148° SE' });
  };

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                <Compass size={18} className="text-primary" />
                AUV Seabed Patrol Simulator
              </h3>
              <Badge tone="warn">Scripted simulation</Badge>
            </div>
            <p className="text-xs text-ink-muted mt-1">
              Illustrative mission replay with pre-scripted confidence scores (not live model inference).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-control bg-primary text-white text-xs font-semibold hover:opacity-95 transition"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? 'Halt Mission' : 'Start Patrol'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-control bg-soft border border-line text-xs font-semibold text-ink-2 hover:bg-hover transition"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>

        {/* Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="p-3.5 rounded-control bg-soft border border-line">
            <div className="text-[11px] text-ink-muted">AUV Depth</div>
            <div className="text-lg font-bold font-mono text-primary tabular-nums">{telemetry.depth} m</div>
          </div>
          <div className="p-3.5 rounded-control bg-soft border border-line">
            <div className="text-[11px] text-ink-muted">Cruising Velocity</div>
            <div className="text-lg font-bold font-mono text-ink tabular-nums">{telemetry.speed} kts</div>
          </div>
          <div className="p-3.5 rounded-control bg-soft border border-line">
            <div className="text-[11px] text-ink-muted">Acoustic Frequency</div>
            <div className="text-lg font-bold font-mono text-ink tabular-nums">{telemetry.pingFreq}</div>
          </div>
          <div className="p-3.5 rounded-control bg-soft border border-line">
            <div className="text-[11px] text-ink-muted">Heading</div>
            <div className="text-lg font-bold font-mono text-good tabular-nums">{telemetry.heading}</div>
          </div>
        </div>

        {/* Track Map */}
        <div className="rounded-control bg-soft border border-line p-4">
          <div className="text-xs font-semibold text-ink-muted mb-2">Patrol Waypoint Track</div>
          <svg viewBox="0 0 100 90" className="w-full h-36" role="img" aria-label="AUV patrol waypoint track">
            <polyline
              fill="none"
              stroke="var(--primary)"
              strokeOpacity={0.35}
              strokeWidth={1.2}
              strokeDasharray="2 2"
              points={WAYPOINTS.map((w) => `${w.x},${w.y}`).join(' ')}
            />
            {WAYPOINTS.map((w, idx) => {
              const isCurrent = idx === currentStep;
              return (
                <g key={w.id}>
                  <circle
                    cx={w.x}
                    cy={w.y}
                    r={isCurrent ? 4 : 2.5}
                    fill={w.isKnown ? 'var(--good)' : 'var(--bad)'}
                    stroke={isCurrent ? 'var(--primary)' : 'none'}
                    strokeWidth={isCurrent ? 1.5 : 0}
                  />
                  <text
                    x={w.x}
                    y={w.y - 6}
                    textAnchor="middle"
                    fill="var(--ink-2)"
                    fontSize="3.4"
                    fontWeight={isCurrent ? '700' : '500'}
                  >
                    {w.name.replace('WP-', '')}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Active Contact */}
        <Card>
          <CardHeader
            title={`Active Contact · ${active.name}`}
            right={
              <Badge tone={active.isKnown ? 'good' : 'bad'}>
                {active.isKnown ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                {active.isKnown ? 'Known Verified' : 'Anomaly Rejected'}
              </Badge>
            }
          />
          <div className="flex items-center gap-4">
            <div className="w-32 h-32 rounded-control bg-[#0B1120] border border-line flex items-center justify-center p-2 shrink-0">
              <img src={active.sampleImg} alt={active.label} className="max-h-full max-w-full object-contain" />
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="font-bold text-ink">{active.label}</div>
              <div className="text-xs text-ink-muted">
                Scripted Score:{' '}
                <span className="font-mono font-semibold text-primary">
                  {(active.score * 100).toFixed(1)}%
                </span>
              </div>
              <div
                className={cn(
                  'mt-2 px-3 py-1.5 rounded-control text-xs font-medium',
                  active.isKnown ? 'bg-good-soft text-good' : 'bg-bad-soft text-bad'
                )}
              >
                {active.isKnown ? 'Survey course maintained' : 'Obstacle avoidance triggered'}
              </div>
            </div>
          </div>
        </Card>

        {/* Event Log */}
        <Card>
          <CardHeader title="Mission Event Log" subtitle="Latest 16 waypoint events" />
          <div className="max-h-44 overflow-y-auto divide-y divide-line text-xs">
            {logs.length === 0 ? (
              <div className="py-8 text-center text-ink-muted">
                Press <strong>Start Patrol</strong> to begin mission replay.
              </div>
            ) : (
              logs.map((l) => (
                <div key={l.id} className="py-2 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-mono text-ink-faint mr-2">{l.time}</span>
                    <strong className="text-ink">{l.wp}</strong> · <span className="text-ink-2">{l.target}</span>
                  </div>
                  <Badge tone={l.isKnown ? 'good' : 'bad'} className="text-[10px] py-0.5 px-2">
                    {l.action}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
