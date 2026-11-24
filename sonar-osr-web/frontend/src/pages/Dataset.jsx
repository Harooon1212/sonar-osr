import React from 'react';
import { Radio, ShieldCheck, ShieldAlert } from 'lucide-react';
import PageHeader from '../layout/PageHeader';
import { Card, CardHeader } from '../ui/Card';
import Badge from '../ui/Badge';
import { useBenchmark } from '../hooks/useBenchmark';
import { formatInt } from '../lib/format';

const KNOWN_CLASSES = [
  { name: 'bottle', desc: 'Glass beverage container', thumb: '/samples/bottle-sample.png' },
  { name: 'can', desc: 'Aluminum beverage can', thumb: '/samples/can-sample.png' },
  { name: 'tire', desc: 'Submerged vehicle tire', thumb: '/samples/tire-sample.png' },
  { name: 'drink-carton', desc: 'Tetra Pak beverage carton', thumb: null },
  { name: 'hook', desc: 'Marine mooring hook', thumb: null },
  { name: 'propeller', desc: 'Bronze boat propeller', thumb: '/samples/propeller-sample.png' },
];

const UNKNOWN_CLASSES = [
  { name: 'chain', desc: 'Heavy seabed moor chain', thumb: '/samples/chain-sample.png' },
  { name: 'valve', desc: 'Subsea pipeline valve actuator', thumb: '/samples/valve-sample.png' },
  { name: 'shampoo-bottle', desc: 'High-density polymer flask', thumb: '/samples/shampoo-sample.png' },
  { name: 'standing-bottle', desc: 'Upright orientation glass bottle', thumb: null },
];

export default function Dataset() {
  const { data: benchmark } = useBenchmark();
  const summary = benchmark?.summary || {};
  const total = summary.total_images ?? 2364;
  const knownCount = summary.known_count ?? 1820;
  const unknownCount = summary.unknown_count ?? 544;

  return (
    <div>
      <PageHeader
        title="Acoustic Dataset & Open-Set Splits"
        subtitle="Marine Debris Forward-Looking Sonar (MD-FLS) captured with Sound Metrics ARIS Explorer 3000"
      />

      {/* Sensor Specs */}
      <Card className="mb-6">
        <CardHeader
          title="Sensor Specifications: Sound Metrics ARIS Explorer 3000"
          right={<Badge tone="primary"><Radio size={12} /> Acoustic Camera</Badge>}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-control bg-soft border border-line">
            <div className="text-xs text-ink-muted">Acoustic Frequency</div>
            <div className="text-base font-bold font-mono text-ink mt-1">3.0 MHz / 1.8 MHz</div>
            <div className="text-xs text-ink-muted mt-0.5">Identification &amp; detection modes</div>
          </div>
          <div className="p-4 rounded-control bg-soft border border-line">
            <div className="text-xs text-ink-muted">Beam Array</div>
            <div className="text-base font-bold font-mono text-ink mt-1">96 / 128 Beams</div>
            <div className="text-xs text-ink-muted mt-0.5">High-resolution forward cone</div>
          </div>
          <div className="p-4 rounded-control bg-soft border border-line">
            <div className="text-xs text-ink-muted">Field of View</div>
            <div className="text-base font-bold font-mono text-ink mt-1">30° Azimuth × 14° Elev</div>
            <div className="text-xs text-ink-muted mt-0.5">224×224 model input</div>
          </div>
          <div className="p-4 rounded-control bg-soft border border-line">
            <div className="text-xs text-ink-muted">Dataset Partitioning</div>
            <div className="text-base font-bold font-mono text-ink mt-1">{formatInt(total)} frames</div>
            <div className="text-xs text-ink-muted mt-0.5">
              {formatInt(knownCount)} known · {formatInt(unknownCount)} unknown
            </div>
          </div>
        </div>
      </Card>

      {/* Known vs Unknown Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader
            title="6 Known Classes (In-Distribution)"
            subtitle="Used for closed-set training, validation, and centroid estimation"
            right={
              <Badge tone="good">
                <ShieldCheck size={12} />
                {formatInt(knownCount)} frames
              </Badge>
            }
          />
          <div className="space-y-2.5">
            {KNOWN_CLASSES.map((c) => (
              <div
                key={c.name}
                className="flex items-center justify-between gap-3 p-3 rounded-control bg-soft border border-line"
              >
                <div className="flex items-center gap-3">
                  {c.thumb ? (
                    <img
                      src={c.thumb}
                      alt={c.name}
                      className="w-10 h-10 rounded-lg object-cover bg-[#0B1120] border border-line"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-card border border-line flex items-center justify-center text-[10px] font-mono text-ink-muted">
                      N/A
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-ink">{c.name}</div>
                    <div className="text-xs text-ink-muted">{c.desc}</div>
                  </div>
                </div>
                <Badge tone="good">Known</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="4 Unknown Classes (Out-of-Distribution)"
            subtitle="Strictly reserved for zero-shot open-set anomaly testing"
            right={
              <Badge tone="bad">
                <ShieldAlert size={12} />
                {formatInt(unknownCount)} frames
              </Badge>
            }
          />
          <div className="space-y-2.5">
            {UNKNOWN_CLASSES.map((c) => (
              <div
                key={c.name}
                className="flex items-center justify-between gap-3 p-3 rounded-control bg-soft border border-line"
              >
                <div className="flex items-center gap-3">
                  {c.thumb ? (
                    <img
                      src={c.thumb}
                      alt={c.name}
                      className="w-10 h-10 rounded-lg object-cover bg-[#0B1120] border border-line"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-card border border-line flex items-center justify-center text-[10px] font-mono text-ink-muted">
                      N/A
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-ink">{c.name}</div>
                    <div className="text-xs text-ink-muted">{c.desc}</div>
                  </div>
                </div>
                <Badge tone="bad">Unknown</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Distribution Figures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Class Distribution Balance" />
          <img
            src="/figures/class_distribution.png"
            alt="Class distribution balance"
            loading="lazy"
            decoding="async"
            className="w-full h-auto rounded-control border border-line"
          />
        </Card>
        <Card>
          <CardHeader title="Acoustic Intensity Pixel Distributions" />
          <img
            src="/figures/pixel_distributions.png"
            alt="Acoustic intensity pixel distributions"
            loading="lazy"
            decoding="async"
            className="w-full h-auto rounded-control border border-line"
          />
        </Card>
      </div>
    </div>
  );
}
