import React from 'react';
import { Card, CardHeader } from '../../../ui/Card';
import Badge from '../../../ui/Badge';

const ILLUSTRATIVE_SECTORS = [
  { angle_range: '0° – 45° (Frontal)', dml_auroc: '—', svdd_auroc: '—', msp_auroc: '—' },
  { angle_range: '45° – 135° (Broadside beam)', dml_auroc: '—', svdd_auroc: '—', msp_auroc: '—' },
  { angle_range: '135° – 225° (Aft echo)', dml_auroc: '—', svdd_auroc: '—', msp_auroc: '—' },
  { angle_range: '225° – 315° (Portside beam)', dml_auroc: '—', svdd_auroc: '—', msp_auroc: '—' },
  { angle_range: '315° – 360° (Return frontal)', dml_auroc: '—', svdd_auroc: '—', msp_auroc: '—' },
];

export default function AzimuthView() {
  return (
    <Card>
      <CardHeader
        title="Turntable Azimuth Rotation Generalization (0° to 360°)"
        subtitle="Aspect-angle invariance across seabed turntable sectors"
        right={<Badge tone="warn">Illustrative / placeholder — no exported data</Badge>}
      />

      <p className="text-sm text-ink-2 mb-5 leading-relaxed">
        Acoustic echograms vary as objects rotate on the seabed turntable due to changing specular reflection and shadow geometry. Per-sector turntable AUROC values have not yet been exported from <code>scripts/evaluate_turntable.py</code> into <code>results.json</code>, so values are shown as <code>—</code> to preserve data integrity.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wider text-ink-muted">
              <th className="py-2.5 pr-4 font-semibold">Azimuth Aspect Sector</th>
              <th className="py-2.5 px-3 font-semibold">DML Triplet AUROC</th>
              <th className="py-2.5 px-3 font-semibold">Deep SVDD AUROC</th>
              <th className="py-2.5 pl-3 font-semibold">Baseline MSP AUROC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {ILLUSTRATIVE_SECTORS.map((row) => (
              <tr key={row.angle_range}>
                <td className="py-3 pr-4 font-medium text-ink">{row.angle_range}</td>
                <td className="py-3 px-3 font-mono text-ink-muted">{row.dml_auroc}</td>
                <td className="py-3 px-3 font-mono text-ink-muted">{row.svdd_auroc}</td>
                <td className="py-3 pl-3 font-mono text-ink-muted">{row.msp_auroc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
