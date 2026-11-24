import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';
import { Card, CardHeader } from '../../../ui/Card';
import Badge from '../../../ui/Badge';

export default function LatentView({ benchmark }) {
  const pca = benchmark?.latent_scatter_pca || [];
  const knownPts = pca.filter((p) => p.known);
  const unknownPts = pca.filter((p) => !p.known);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="Metric Triplet Embedding Space (128-D L2)"
            right={<Badge tone="primary">Inter-cluster margin</Badge>}
          />
          <img
            src="/figures/dml_tsne_visualization.png"
            alt="DML t-SNE visualization"
            loading="lazy"
            decoding="async"
            className="w-full h-auto rounded-control border border-line"
          />
          <p className="text-xs text-ink-muted mt-3">
            Known classes form tight clusters on the 128-D hypersphere; unknown classes occupy peripheral open space.
          </p>
        </Card>

        <Card>
          <CardHeader
            title="Baseline ResNet-50 Latent Space (2048-D GAP)"
            right={<Badge tone="warn">Feature dispersion</Badge>}
          />
          <img
            src="/figures/metric_tsne.png"
            alt="Baseline t-SNE visualization"
            loading="lazy"
            decoding="async"
            className="w-full h-auto rounded-control border border-line"
          />
          <p className="text-xs text-ink-muted mt-3">
            Baseline representations without metric constraints allow unknown targets to bleed into known decision boundaries.
          </p>
        </Card>
      </div>

      {pca.length > 0 && (
        <Card>
          <CardHeader
            title="Interactive 2D PCA Latent Projection"
            subtitle="Known vs Unknown embedding coordinates from results.json"
            right={<Badge tone="neutral">Sampled projection</Badge>}
          />
          <div className="h-[280px] w-full" aria-label="2D PCA latent scatter plot">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
                <XAxis type="number" dataKey="x" name="PC1" tick={{ fill: 'var(--chart-axis)', fontSize: 11 }} />
                <YAxis type="number" dataKey="y" name="PC2" tick={{ fill: 'var(--chart-axis)', fontSize: 11 }} />
                <RechartsTooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    backgroundColor: 'var(--chart-tooltip-bg)',
                    borderColor: 'var(--chart-tooltip-border)',
                    borderRadius: 16,
                    fontSize: 12,
                    color: 'var(--ink)',
                  }}
                  formatter={(value, name) => [value, name]}
                />
                <Legend />
                <Scatter name="Known Classes" data={knownPts} fill="var(--good)" />
                <Scatter name="Unknown Classes" data={unknownPts} fill="var(--bad)" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-ink-muted mt-2">
            Note: Projection resampled for display from <code>latent_scatter_pca</code> in <code>results.json</code>.
          </p>
        </Card>
      )}
    </div>
  );
}
