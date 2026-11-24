import React from 'react';
import katex from 'katex';
import PageHeader from '../layout/PageHeader';
import { Card, CardHeader } from '../ui/Card';
import Badge from '../ui/Badge';
import { useBenchmark } from '../hooks/useBenchmark';
import { formatDecimal, formatPercent } from '../lib/format';

function MathBlock({ latex, label }) {
  const html = React.useMemo(
    () => katex.renderToString(latex, { displayMode: true, throwOnError: false }),
    [latex]
  );
  return (
    <div className="my-4 p-4 rounded-control bg-soft border border-line overflow-x-auto">
      {label && <div className="text-[11px] font-medium text-ink-muted mb-2">{label}</div>}
      <div className="text-ink" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export default function Methods() {
  const { data: benchmark } = useBenchmark();
  const dml = benchmark?.methods?.dml;
  const svdd = benchmark?.methods?.svdd;
  const msp = benchmark?.methods?.msp;

  return (
    <div>
      <PageHeader
        title="Methodology & Mathematical Formulations"
        subtitle="Mathematical foundations, loss functions, and decision boundary architectures governing the 3 acoustic recognition paradigms"
      />

      <div className="space-y-6">
        <Card>
          <CardHeader
            title="1. Deep Metric Learning (DML) with Triplet Margin Loss"
            subtitle="Geometric / Embedding paradigm · 128-D L2-normalized hypersphere"
            right={
              <Badge tone="primary" className="font-mono">
                AUROC {formatDecimal(dml?.auroc, 4)}
              </Badge>
            }
          />
          <p className="text-sm text-ink-2 leading-relaxed">
            Rather than learning hyperplane decision boundaries, DML maps acoustic features into a 128-dimensional
            L2-normalized hyperspherical space where Euclidean distance directly reflects semantic acoustic similarity.
            Hard-triplet online mining ensures rapid gradient convergence and dense cluster compactness.
          </p>
          <MathBlock
            label="Semi-hard triplet margin loss (margin α = 0.20)"
            latex="\mathcal{L}_{\text{triplet}} = \max\left(0,\; \|f(x_a) - f(x_p)\|_2^2 - \|f(x_a) - f(x_n)\|_2^2 + \alpha\right), \quad \alpha = 0.20"
          />
          <MathBlock
            label="Open-set decision rule (Euclidean distance to class centroids)"
            latex="d_{\min} = \min_k \|f(x) - c_k\|_2 \quad;\quad d_{\min} < \tau \implies \text{Class } k, \;\text{else Unknown (Rejected)}"
          />
          <p className="text-xs text-ink-muted">
            Operating characteristic: Deep Metric Learning achieves the highest overall AUROC (
            <span className="font-mono font-semibold text-ink">{formatDecimal(dml?.auroc, 4)}</span>) and known-class recall (
            <span className="font-mono font-semibold text-ink">{formatPercent(dml?.tpr, 2)}</span>).
          </p>
        </Card>

        <Card>
          <CardHeader
            title="2. Deep SVDD (Nearest Centroid Hypersphere)"
            subtitle="Boundary-based paradigm · 2048-D Global Average Pooled feature space"
            right={
              <Badge tone="good" className="font-mono">
                AUROC {formatDecimal(svdd?.auroc, 4)}
              </Badge>
            }
          />
          <p className="text-sm text-ink-2 leading-relaxed">
            One-class SVDD evaluates acoustic representations against class centroids in the 2048-D global-average-pooled
            feature space of the fine-tuned ResNet-50. Points falling outside the learned decision radius τ are detected as anomalies.
          </p>
          <MathBlock
            label="Class centroid definition (2048-D feature space)"
            latex="C_k = \frac{1}{N_k} \sum_{i=1}^{N_k} f(x_i)"
          />
          <p className="text-xs text-ink-muted">
            Operating characteristic: Deep SVDD achieves the lowest false-positive rate (
            <span className="font-mono font-semibold text-good">{formatPercent(svdd?.fpr, 2)}</span>) and highest unknown detection rate (
            <span className="font-mono font-semibold text-good">{formatPercent(svdd?.udr, 2)}</span>), making it ideal for defensive underwater navigation.
          </p>
        </Card>

        <Card>
          <CardHeader
            title="3. Baseline Maximum Softmax Probability (MSP)"
            subtitle="Confidence-based baseline · Standard ResNet-50 cross-entropy"
            right={
              <Badge tone="warn" className="font-mono">
                AUROC {formatDecimal(msp?.auroc, 4)}
              </Badge>
            }
          />
          <p className="text-sm text-ink-2 leading-relaxed">
            A standard ResNet-50 backbone fine-tuned with cross-entropy loss. Unknown rejection is attempted by thresholding
            the maximum softmax output across known logits.
          </p>
          <MathBlock
            label="Softmax confidence score & decision rule"
            latex="P_{\max} = \max_k \text{Softmax}(z_k) \quad;\quad \hat{y} = \arg\max_k p_k(x),\;\text{known iff } P_{\max} \ge \tau"
          />
          <p className="text-xs text-ink-muted">
            Theoretical limitation: Softmax normalizes unbounded linear logits across only known classes, causing artificially high confidence on out-of-distribution inputs (FPR{' '}
            <span className="font-mono font-semibold text-bad">{formatPercent(msp?.fpr, 2)}</span>).
          </p>
        </Card>
      </div>
    </div>
  );
}
